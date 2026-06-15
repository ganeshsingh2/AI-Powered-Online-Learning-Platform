import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";


const PROMPT = `
Generate Learning Course depends on following details.

Return the response in JSON format only.

Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "learning_outcomes": ["string"],
    "prerequisites": ["string"],
    "banner_image_prompt": "string",
    "chapters": [
      {
        "chapter_name": "string",
        "chapter_description": "string",
        "chapter_duration": "string",
        "topics": [
          {
            "topic_name": "string",
            "topic_description": "string",
            "topic_duration": "string"
          }
        ]
      }
    ],
    "total_duration": "string"
  }
}
`;

export async function POST(req) {
  try {
    const { courseId, ...formData } = await req.json();

    const user = await currentUser();
    const {has} = await auth()
    const hasPremiumAccess=has({plan:'stater'})

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    //If user already created any course?
    if(!hasPremiumAccess){
      const result=await db.select().from(coursesTable)
      .where(eq(coursesTable.userEmail,user?.primaryEmailAddress.emailAddress));

      if(result?.length>=1){
        return NextResponse.json({'resp' : 'limit exceed'})
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT + JSON.stringify(formData),
    });

    console.log(response.candidates[0].content.parts[0].text);

    const RawResp = response?.candidates[0]?.content?.parts[0]?.text;
    const RawJson = RawResp.replace("```json", "").replace("```", "");
    const JSONResp = JSON.parse(RawJson);
    const ImagePrompt = JSONResp.course?.banner_image_prompt;
    const bannerImageUrl = await GenerateImage(ImagePrompt);

    const result = await db.insert(coursesTable).values({
      ...formData,
      courseJson: JSONResp,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid: courseId,
      bannerImageUrl: bannerImageUrl,
    });

    return NextResponse.json({
      courseId: courseId,
      course: JSONResp,
      image: bannerImageUrl,
    });
  } catch (error) {
    console.log("Course Generate Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate course",
      },
      {
        status: 500,
      }
    );
  }
}
const GenerateImage = async (imagePrompt) => {
  try {
    const BASE_URL = "https://aigurulab.tech";
    const apiKey = process.env.AI_GURU_LAB_API_KEY || process.env.AI_GURU_LAB_API;

    if (!imagePrompt) {
      console.log("Image Generate Error: Missing image prompt");
      return "";
    }

    if (!apiKey) {
      console.log("Image Generate Error: Missing AI Guru Lab API key");
      return "";
    }

    const result = await axios.post(BASE_URL + "/api/generate-image",
      {
        width: 1024,
        height: 1024,
        input: imagePrompt,
        model: "flux",
        aspectRatio: "16:9",
      },
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl =
      result?.data?.image ||
      result?.data?.imageUrl ||
      result?.data?.url ||
      result?.data?.output?.[0] ||
      result?.data?.data?.[0]?.url ||
      "";

    if (!imageUrl) {
      console.log("Image Generate Error: Missing image URL in response", result.data);
    } else {
      console.log(imageUrl);
    }

    return imageUrl;
  } catch (error) {
    console.log("Image Generate Error:", error?.response?.data || error?.message || error);
    return "";
  }
};

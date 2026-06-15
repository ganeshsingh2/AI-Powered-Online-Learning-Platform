import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { GoogleGenAI } from "@google/genai";
import { eq } from "drizzle-orm";

const PROMPT = `
Generate detailed learning content for the provided chapter and its topics.

Return JSON only.
Do not use Markdown syntax in any value. Do not include ###, ####, **, *, backticks, or HTML tags.
Write topic content as clean documentation-style text with short paragraphs and point-wise lines.
Use the examples and key_points arrays for concise bullet-style information.

Schema:
{
  "chapter_name": "string",
  "chapter_summary": "plain text string without Markdown",
  "topics": [
    {
      "topic_name": "string",
      "content": "plain text string without Markdown symbols; use separate lines for steps or points",
      "examples": ["plain text string without Markdown"],
      "key_points": ["plain text string without Markdown"]
    }
  ]
}

: User Input:
`;

const parseJsonResponse = (text) => {
  const cleaned = text
    ?.replace(/```json/gi, "")
    ?.replace(/```/g, "")
    ?.trim();

  if (!cleaned) {
    throw new Error("Gemini returned an empty response");
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Gemini did not return valid JSON");
    }

    return JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
  }
};

const getErrorMessage = (error) =>
  error?.response?.data?.error?.message ||
  error?.response?.data?.error ||
  error?.cause?.message ||
  error?.message ||
  "Failed to generate course content";

const isMissingCourseContentColumnError = (error) => {
  const message = String(error?.message || "");
  const causeMessage = String(error?.cause?.message || "");

  return (
    message.includes("courseContent") ||
    causeMessage.includes("courseContent") ||
    error?.code === "42703"
  );
};

const saveCourseContent = async ({ courseId, courseContent, updatedCourseJson }) => {
  try {
    await db
      .update(coursesTable)
      .set({
        courseContent,
        courseJson: { course: updatedCourseJson },
      })
      .where(eq(coursesTable.cid, courseId));

    return "courseContent";
  } catch (error) {
    if (!isMissingCourseContentColumnError(error)) {
      throw error;
    }

    console.log(
      "courseContent column missing. Saving generated content inside courseJson only."
    );

    await db
      .update(coursesTable)
      .set({ courseJson: { course: updatedCourseJson } })
      .where(eq(coursesTable.cid, courseId));

    return "courseJson";
  }
};

export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    if (!courseJson?.chapters?.length) {
      return NextResponse.json(
        { error: "Missing course chapters" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const courseContent = [];

    for (const chapter of courseJson.chapters) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
        },
        contents: PROMPT + JSON.stringify(chapter),
      });

      const rawResponse =
        response?.text ||
        response?.candidates?.[0]?.content?.parts?.[0]?.text;

      const courseData = parseJsonResponse(rawResponse);
      const youtubeVideo = await GetYoutubeVideo(
        `${courseTitle || ""} ${chapter?.chapter_name || ""}`.trim()
      );

      courseContent.push({
        chapterName: chapter?.chapter_name,
        youtubeVideo,
        courseData,
      });
    }

    const updatedCourseJson = {
      ...courseJson,
      generated_content: courseContent,
    };

    const savedTo = await saveCourseContent({
      courseId,
      courseContent,
      updatedCourseJson,
    });

    return NextResponse.json({
      courseName: courseTitle,
      courseContent,
      savedTo,
    });
  } catch (error) {
    console.log("Course Content Generate Error:", error);
    const message = getErrorMessage(error);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const GetYoutubeVideo = async (topic) => {
  try {
    if (!process.env.YOUTUBE_API_KEY || !topic) {
      return [];
    }

    const params = new URLSearchParams({
      part: "snippet",
      q: topic,
      maxResults: "4",
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    });

    const resp = await fetch(`${YOUTUBE_BASE_URL}?${params.toString()}`);

    if (!resp.ok) {
      console.log("Youtube Video Error:", await resp.text());
      return [];
    }

    const data = await resp.json();

    return (data?.items || []).map((item) => ({
      videoId: item?.id?.videoId,
      title: item?.snippet?.title,
      description: item?.snippet?.description,
      thumbnail: item?.snippet?.thumbnails?.medium?.url,
    }));
  } catch (error) {
    console.log("Youtube Video Error:", error);
    return [];
  }
};

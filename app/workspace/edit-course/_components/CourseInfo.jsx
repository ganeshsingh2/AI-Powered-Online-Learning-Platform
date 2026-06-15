"use client";

import { Book, Clock, Link, PlayCircle, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CourseInfo({ course, viewCourse }){
  const courseLayout = course?.courseJson?.course;

  const bannerImageUrl =
    typeof course?.bannerImageUrl === "string"
      ? course.bannerImageUrl.trim() : "";

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const GenerateCourseContent = async () => {
    // call API to generate content
    setLoading(true);
    try {
      const result = await axios.post('/api/generate-course-content', {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid
      });
      console.log(result.data);
      toast.success('Course Generated Successfully');
      router.replace('/workspace');
    }
    catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.error || "Server Side error, Try Again!");
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <div className="grid gap-5 rounded-xl border bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_34%] md:items-center">

      {/* Left Section */}
      <div className="flex min-w-0 flex-col gap-3">

        {/* Title & Description */}
        <div>
          <h2 className="text-3xl font-bold leading-tight text-slate-950">
            {courseLayout?.name}
          </h2>

          <p className="mt-3 line-clamp-2 max-w-3xl text-base leading-7 text-gray-500">
            {courseLayout?.description}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">

          {/* Duration */}
          <div className="flex h-[64px] items-center gap-4 rounded-md border border-slate-100 bg-white px-4 shadow-[0_1px_8px_rgba(15,23,42,0.12)]">
            <Clock className="h-6 w-6 shrink-0 text-blue-600" />
            <div className="min-w-0">
              <h2 className="font-semibold leading-5 text-slate-950">Duration</h2>
              <p className="mt-1 text-sm text-slate-800">
                {courseLayout?.total_duration || "2 Hours"}
              </p>
            </div>
          </div>

          {/* Chapters */}
          <div className="flex h-[64px] items-center gap-4 rounded-md border border-slate-100 bg-white px-4 shadow-[0_1px_8px_rgba(15,23,42,0.12)]">
            <Book className="h-6 w-6 shrink-0 text-emerald-500" />
            <div className="min-w-0">
              <h2 className="font-semibold leading-5 text-slate-950">Chapters</h2>
              <p className="mt-1 text-sm text-slate-800">
                {courseLayout?.chapters?.length || 0} Chapters
              </p>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex h-[64px] items-center gap-4 rounded-md border border-slate-100 bg-white px-4 shadow-[0_1px_8px_rgba(15,23,42,0.12)]">
            <TrendingUp className="h-6 w-6 shrink-0 text-rose-500" />
            <div className="min-w-0">
              <h2 className="font-semibold leading-5 text-slate-950">Difficulty Level</h2>
              <p className="mt-1 text-sm text-slate-800">
                {course?.difficultyLevel || "Beginner"}
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {!viewCourse ? <Button
          className="h-10 w-full max-w-[342px] bg-violet-600 text-black shadow-sm hover:bg-violet-700"
          disabled={loading}
          onClick={GenerateCourseContent}
        >
          <Settings className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Generate Content"}
        </Button> : 
        <Link href={'/course/' + course?.cid}>
          <Button>
          <PlayCircle /> Continue Learning
        </Button> 
        </Link>}
      </div>

      {bannerImageUrl ? (
        <Image
          src={bannerImageUrl}
          alt="Banner Image"
          width={300}
          height={240}
          sizes="(max-width: 300px) 100vw, 34vw"
          className="h-[190px] max-h-[190px] w-full rounded-xl object-cover md:h-[213px] md:max-h-[213px]"
        />
      ) : (
        <div className="h-[190px] max-h-[190px] w-full rounded-xl bg-gray-100 md:h-[213px] md:max-h-[213px]" />
      )}
    </div>
  );
};

export default CourseInfo;

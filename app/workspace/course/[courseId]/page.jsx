"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { LoaderCircle, PlayCircle } from 'lucide-react';
import FormattedContent from '@/app/course/_components/FormattedContent';

function CoursePage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            getCourse();
        }
    }, [courseId]);

    const getCourse = async () => {
        try {
            setLoading(true);
            const result = await axios.get('/api/courses?courseId=' + courseId);
            setCourse(result.data);
        } catch (error) {
            console.error(error);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className='flex min-h-60 items-center justify-center'>
                <LoaderCircle className='size-8 animate-spin text-violet-600' />
            </div>
        )
    }

    if (!course) {
        return (
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <h2 className='text-xl font-bold text-black'>Course not found</h2>
                <p className='mt-2 text-sm text-gray-500'>This course could not be loaded.</p>
            </div>
        )
    }

    const courseJson = course?.courseJson?.course;
    const courseContent = Array.isArray(course?.courseContent) ? course.courseContent : [];
    const courseName = courseJson?.name || course?.name || 'Course';
    const courseDescription = courseJson?.description || course?.description || 'Continue your course.';
    const bannerImageUrl =
        typeof course?.bannerImageUrl === 'string' && course.bannerImageUrl.trim()
            ? course.bannerImageUrl
            : '/online-education.svg';

    return (
        <div className='space-y-6'>
            <div className='overflow-hidden rounded-lg border bg-white shadow-sm'>
                <Image
                    src={bannerImageUrl}
                    alt={courseName}
                    width={1000}
                    height={420}
                    className='h-64 w-full object-cover'
                />
                <div className='p-5'>
                    <h1 className='text-3xl font-bold text-black'>{courseName}</h1>
                    <p className='mt-2 max-w-3xl text-gray-500'>{courseDescription}</p>
                </div>
            </div>

            {courseContent.length > 0 ? (
                <div className='space-y-4'>
                    {courseContent.map((chapter, index) => (
                        <div key={index} className='rounded-lg border bg-white p-5 shadow-sm'>
                            <h2 className='text-xl font-bold text-black'>{chapter?.chapterName || chapter?.courseData?.chapter_name || `Chapter ${index + 1}`}</h2>
                            <p className='mt-2 text-sm leading-6 text-gray-500'>{chapter?.courseData?.chapter_summary}</p>

                            <div className='mt-4 space-y-3'>
                                {chapter?.courseData?.topics?.map((topic, topicIndex) => (
                                    <div key={topicIndex} className='rounded-md border bg-gray-50 p-4'>
                                        <h3 className='font-semibold text-black'>{topic?.topic_name}</h3>
                                        <div className='mt-2'>
                                            <FormattedContent content={topic?.content} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {chapter?.youtubeVideo?.[0]?.videoId && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${chapter.youtubeVideo[0].videoId}`}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-600'
                                >
                                    <PlayCircle className='size-4' />
                                    Watch related video
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className='rounded-lg border bg-white p-6 shadow-sm'>
                    <h2 className='text-xl font-bold text-black'>No content generated yet</h2>
                    <p className='mt-2 text-sm text-gray-500'>Generate course content before continuing this course.</p>
                </div>
            )}
        </div>
    )
}

export default CoursePage;

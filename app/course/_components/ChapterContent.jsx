"use client"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import React, { useContext, useState } from 'react'
import YouTube from 'react-youtube';
import FormattedContent, { InlineContent } from './FormattedContent';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2Icon, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

function ChapterContent({ courseInfo, refreshData }) {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const courseContent = Array.isArray(courseInfo?.courses?.courseContent)
        ? courseInfo.courses.courseContent
        : [];
    const { selectedChapterIndex } = useContext(SelectedChapterIndexContext)
    const selectedChapter = courseContent?.[selectedChapterIndex];
    const videoData = selectedChapter?.youtubeVideo
    const enrollCourse = courseInfo?.enrollCourse;
    const completedChapters = Array.isArray(enrollCourse?.completedChapters)
        ? enrollCourse.completedChapters.map(Number)
        : [];
    const isCompleted = completedChapters.includes(selectedChapterIndex);

    const saveCompletedChapters = async (completedChapter) => {
        setLoading(true);

        try {
            await axios.put('/api/enroll-course', {
                courseId,
                completedChapter,
            });
            await refreshData?.();
        } finally {
            setLoading(false);
        }
    }

    const markChapterCompleted = async () => {
        const completedChapter = Array.from(new Set([...completedChapters, selectedChapterIndex])).sort((a, b) => a - b);
        await saveCompletedChapters(completedChapter);
        toast.success('Chapter marked completed!');
    }

    const markIncompleteChapter = async () => {
        const completedChapter = completedChapters.filter((item) => item !== selectedChapterIndex);
        await saveCompletedChapters(completedChapter);
        toast.success('Chapter marked incomplete!');
    }

    if (!selectedChapter) {
        return (
            <div className='flex-1 p-10'>
                <h2 className='text-2xl font-bold text-black'>No chapter content found</h2>
                <p className='mt-2 text-gray-500'>Generate course content before continuing this course.</p>
            </div>
        )
    }

    return (
        <div className='flex-1 p-10'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold'>{selectedChapterIndex + 1}. {selectedChapter?.chapterName || selectedChapter?.courseData?.chapter_name || 'Chapter'}</h2>
                {!isCompleted ? <Button onClick={markChapterCompleted}
                    disabled={loading}
                > {loading ? <Loader2Icon className='animate-spin' /> : <CheckCircle />} Mark as Completed </Button> :
                    <Button variant="outline" onClick={markIncompleteChapter}
                        disabled={loading}
                    >
                        {loading ? <Loader2Icon className='animate-spin' /> : <X />} Mark Incomplete </Button>}
            </div>
            <h2 className='my-2 text-lg font-bold'>Related Videos</h2>
            <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                {videoData?.slice(0, 2).map((video, index) => (
                    <div key={video?.videoId || index} className='overflow-hidden rounded-lg border bg-white'>
                        <YouTube
                            videoId={video?.videoId}
                            className='w-full'
                            iframeClassName='aspect-video w-full'
                            opts={{ width: '100%', height: '100%' }}
                        />
                    </div>
                ))}
            </div>
            <div className='mt-8 space-y-4'>
                {selectedChapter?.courseData?.topics?.map((topic, index) => (
                    <div key={index} className='rounded-lg border bg-white p-5 shadow-sm bg-secondary'>
                        <h3 className='font-bold text-primary'>{index + 1}. {topic?.topic_name || topic?.topic}</h3>
                        <div className='mt-3'>
                            <FormattedContent content={topic?.content} />
                        </div>
                        {topic?.examples?.length > 0 && (
                            <div className='mt-4'>
                                <h4 className='font-semibold text-black'>Examples</h4>
                                <ul className='mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700'>
                                    {topic.examples.map((example, exampleIndex) => (
                                        <li key={exampleIndex}><InlineContent text={example} /></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {topic?.key_points?.length > 0 && (
                            <div className='mt-4'>
                                <h4 className='font-semibold text-black'>Key Points</h4>
                                <ul className='mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700'>
                                    {topic.key_points.map((point, pointIndex) => (
                                        <li key={pointIndex}><InlineContent text={point} /></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChapterContent

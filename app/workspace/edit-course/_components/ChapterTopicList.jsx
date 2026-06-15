import { Gift } from "lucide-react";
import React from 'react'

function ChapterTopicList({ course }) {
    const courseLayout = course?.courseJson?.course;
    return (
        <div>
            <h2 className='font-bold text-3xl mt-10'>Chapters & Topics</h2>
            <div className='flex flex-col items-center justify-center mt-10'>
                {courseLayout?.chapters?.map((chapter, index) => (
                    <div key={index} className='flex flex-col items-center'>
                        <div className='p-4 border shadow rounded-xl bg-primary text-white'>
                            <h2 className='text-center'>Chapter {index + 1}</h2>
                            <h2 className='font-bold text-lg text-center'>{chapter.chapter_name}</h2>
                            <h2 className='text-xs flex justify-between gap-16'><span>Duration: {chapter?.chapter_duration}</span>
                                <span>No. Of Chapters: {chapter?.topics?.length}</span>
                            </h2>
                        </div>
                        <div>
                            {chapter?.topics?.map((topic, topicIndex) => (
                                <div className='flex flex-col items-center' key={`${topic?.topic_name}-${topicIndex}`}>
                                    <div className='h-10 bg-gray-300 w-1'></div>
                                    <div className='grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] items-center gap-5'>
                                        {topicIndex % 2 === 0 ? (
                                            <span className='w-64 max-w-xs text-right'>{topic.topic_name}</span>
                                        ) : (
                                            <span aria-hidden="true" />
                                        )}
                                        <h2 className='rounded-full bg-gray-300 p-4 text-center text-gray-500'></h2>
                                        {topicIndex % 2 !== 0 ? (
                                            <span className='w-64 max-w-xs text-left'>{topic.topic_name}</span>
                                        ) : (
                                            <span aria-hidden="true" />
                                        )}
                                    </div>
                                    {topicIndex == chapter?.topics?.length - 1 && (<div className='h-10 bg-gray-300 w-1'></div>)}
                                    {topicIndex == chapter?.topics?.length - 1 && (
                                        <div className="flex items-center gap-5">
                                            <Gift className="text-center rounded-full bg-gray-300 h-14 w-14 text-gray-500 p-4" />
                                        </div>
                                    )}
                                    {topicIndex !== chapter?.topics?.length - 1 && (
                                        <div className="h-10 bg-gray-300 w-1"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className='p-4 border shadow rounded-xl bg-green-600 text-green'>
                    <h2>Finish</h2>
                </div>
            </div>
        </div>
    )
}
export default ChapterTopicList

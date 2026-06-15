"use client"
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import { useContext } from 'react';
import { CheckCircle } from 'lucide-react';

function ChapterListSidebar({ courseInfo }) {
    const courseContent = Array.isArray(courseInfo?.courses?.courseContent)
        ? courseInfo.courses.courseContent
        : [];
    const {selectedChapterIndex,setSelectedChapterIndex}=useContext(SelectedChapterIndexContext)
    const enrollCourse = courseInfo?.enrollCourse;
    const completedChapters = Array.isArray(enrollCourse?.completedChapters)
        ? enrollCourse.completedChapters.map(Number)
        : [];

    return (
        <div className='h-screen w-80 shrink-0 overflow-y-auto bg-secondary p-5'>
            <h2 className='my-3 text-xl font-bold'>Chapters ({courseContent.length})</h2>
            <Accordion type="single" collapsible defaultValue="item-1">
                {courseContent.map((chapter, index) => (
                    <AccordionItem
                        value={`item-${index + 1}`}
                        key={index}
                        onClick={() => setSelectedChapterIndex(index)}
                    >
                        <AccordionTrigger className={`px-5 text-left text-lg font-medium ${completedChapters.includes(index) ? 'bg-green-100 text-green-800' : 'bg-white'} ${selectedChapterIndex === index ? 'text-violet-600' : ''}`}>
                            <span className='flex items-center gap-2'>
                                {completedChapters.includes(index) && <CheckCircle className='size-4 shrink-0 text-green-600' />}
                                {index+1}. {chapter?.chapterName || chapter?.courseData?.chapter_name || 'Chapter'}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div>
                                {chapter?.courseData?.topics?.map((topic,index_)=>(
                                    <h2 key={index_} className={`my-1 rounded-lg bg-white p-3
                                        ${completedChapters.includes(index) ? 'bg-green-100 text-green-800' : 'bg-white'}`}>{topic?.topic_name || topic?.topic} </h2>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}

            </Accordion>

        </div>
    )
}

export default ChapterListSidebar

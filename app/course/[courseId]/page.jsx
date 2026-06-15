"use client"
import AppHeader from '@/app/workspace/_components/AppHeader'
import React, { useEffect, useState } from 'react'
import ChapterListSidebar from '../_components/ChapterListSidebar'
import ChapterContent from '../_components/ChapterContent'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { LoaderCircle } from 'lucide-react'

function Course() {
    const {courseId}=useParams();
    const [courseInfo,setCourseInfo]=useState();
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        if (courseId) {
            GetEnrolledCourseById();
        }
    },[courseId])
    
    const GetEnrolledCourseById = async () => {
        try {
            setLoading(true);
            const result =await axios.get('/api/enroll-course?courseId='+courseId);
            console.log(result.data);
            setCourseInfo(result.data);
        } catch (error) {
            console.error(error);
            setCourseInfo(null);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div>
                <AppHeader hideSidebar={true} />
                <div className='flex min-h-96 items-center justify-center'>
                    <LoaderCircle className='size-8 animate-spin text-violet-600' />
                </div>
            </div>
        )
    }

    if (!courseInfo) {
        return (
            <div>
                <AppHeader hideSidebar={true} />
                <div className='p-10'>
                    <h2 className='text-2xl font-bold text-black'>Course not found</h2>
                    <p className='mt-2 text-gray-500'>Enroll in this course before continuing.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <AppHeader hideSidebar={true} />
            <div className='flex'>
                <ChapterListSidebar courseInfo={courseInfo} />
                <ChapterContent courseInfo={courseInfo} refreshData={()=>GetEnrolledCourseById()} />
            </div>
        </div>
    )
}

export default Course

"use client";
import axios from 'axios';
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react'
import AddNewCourseDialog from './AddNewCourseDialog'
import { useUser } from '@clerk/nextjs';
import CourseCard from './CourseCard';
import { useEffect } from 'react';

const CourseList = () => {
  const [courseList, setCourseList] = useState([]);
  const {user}= useUser();

  useEffect(()=>{
    user && GetCourseList();
  }, [user])
   
  const GetCourseList=async()=>{
    const result=await axios.get('/api/courses');
    console.log(result.data);
    setCourseList(result.data)
  }
  return (
    <div className='mt-9'>
      <h2 className='mb-1 text-xl font-bold tracking-normal text-black'>Course List</h2>
      {courseList?.length === 0 ? 
       <div className='mt-2 flex flex-col items-center justify-center rounded-lg border bg-secondary p-7'>
        <Image src='/online-education.svg' alt='No courses' width={80} height={80}/>
        <h2 className='my-2 text-xl font-bold'>You have not created any courses yet.</h2>
        <AddNewCourseDialog>
            <Button className='bg-violet-600 hover:bg-violet-700'>+ Create Course</Button>
        </AddNewCourseDialog>
       </div> :
         <div className='mt-1 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {courseList?.map((course,index)=>(
              <CourseCard course={course} key={index}/>
            ))}
         </div>
      }
    </div>
  )
}

export default CourseList

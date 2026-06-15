"use client";

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import EnrollCourseCard from './EnrollCourseCard';
import { useUser } from '@clerk/nextjs';

function EnrollCourseList() {

    const [enrolledCourseList, setEnrolledCourseList] = useState([]);
    const { isLoaded, user } = useUser();

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        if (!user) {
            setEnrolledCourseList([]);
            return;
        }

        GetEnrolledCourse();

        window.addEventListener('course-enrolled', GetEnrolledCourse);

        return () => {
            window.removeEventListener('course-enrolled', GetEnrolledCourse);
        }
    }, [isLoaded, user])


    const GetEnrolledCourse = async () => {
        try {
            const result = await axios.get('/api/enroll-course');
            console.log(result.data);
            setEnrolledCourseList(result.data);
        } catch (error) {
            console.error(error);
            setEnrolledCourseList([]);
        }
    }
    return enrolledCourseList?.length > 0 && (
        <div className='mt-3'>
            <h2 className='font-bold text-xl'>Continue Learning Courses</h2>

            <div className='mt-1 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
                {enrolledCourseList?.map((course, index) => (
                    <EnrollCourseCard course={course?.courses} enrollCourse={course?.enrollCourse} key={index} />
                ))}
            </div>


        </div>
    )
}

export default EnrollCourseList

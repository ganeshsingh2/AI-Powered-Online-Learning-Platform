import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';


function EnrollCourseCard({ course, enrollCourse }) {
    const courseJson = course?.courseJson?.course;
    const courseName = courseJson?.name || course?.name || 'Course';
    const courseDescription =
        courseJson?.description || course?.description || 'Continue learning with this course.';
    const bannerImageUrl =
        typeof course?.bannerImageUrl === 'string' && course.bannerImageUrl.trim()
            ? course.bannerImageUrl
            : '/online-education.svg';
    const totalChapters = Array.isArray(course?.courseContent) ? course.courseContent.length : 0;

    const calculateProgress = () => {
        if (!totalChapters) {
            return 0;
        }

        const completedChapters = Array.isArray(enrollCourse?.completedChapters)
            ? enrollCourse.completedChapters.length
            : 0;

        return Math.round((completedChapters / totalChapters) * 100);
    }
    const progress = calculateProgress();

    return (
        <div className='overflow-hidden rounded-lg border bg-white shadow-sm'>
            <Image src={bannerImageUrl} alt={courseName}
                width={420}
                height={235}
                className='aspect-video w-full object-cover'
            />
            <div className='flex min-h-[9.5rem] flex-col gap-3 p-3'>
                <h2 className='line-clamp-1 text-base font-bold text-black md:text-lg'>{courseName}</h2>
                <p className='line-clamp-3 min-h-[3.75rem] text-sm leading-5 text-gray-400'>{courseDescription}</p>
                <div className='mt-auto'>
                    <h2 className='flex justify-between text-sm font-medium text-gray-800'>Progress <span>{progress}%</span></h2>
                    <div className='mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100'>
                        <div className='h-full rounded-full bg-violet-600 transition-all' style={{ width: `${progress}%` }} />
                    </div>
                    <Link href={'/course/' + course?.cid}>
                        <Button className='mt-3 w-full bg-violet-600 hover:bg-violet-700'>
                            <PlayCircle className='size-4' />
                            Continue Learning
                        </Button>
                    </Link>    
                </div>
            </div>

        </div>
    )
}

export default EnrollCourseCard

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { Book, LoaderCircle, PlayCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function CourseCard({ course }) {
    const courseJson = course?.courseJson?.course;
    const [loading,setLoading]=useState(false);
    const router = useRouter();

    const onEnrollCourse = async () => {
        if (loading) {
            return;
        }

        try {
            setLoading(true);
            const result = await axios.post('/api/enroll-course', {
                courseId: course?.cid
            })
            console.log(result.data);
            if(result.data.resp){
                toast.warning('Already Enrolled!');
                router.push('/course/' + course?.cid);
                return;
            }
            toast.success('Enrolled!')
            window.dispatchEvent(new Event('course-enrolled'));
            router.push('/course/' + course?.cid);
        }
        catch (e) {
            toast.error('Server Side Error')
        }
        finally {
            setLoading(false);
        }
    }
    const courseName = courseJson?.name || course?.name || 'Course';
    const courseDescription =
        courseJson?.description || course?.description || 'Start learning with this course.';
    const bannerImageUrl =
        typeof course?.bannerImageUrl === 'string' && course.bannerImageUrl.trim()
            ? course.bannerImageUrl
            : '/online-education.svg';
    const chapterCount = courseJson?.chapters?.length || course?.numberOfChapters || 0;

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
                <div className='mt-auto flex items-center justify-between gap-3'>
                    <h2 className='flex items-center gap-2 text-sm font-semibold text-gray-800'>
                        <Book className='size-4 text-violet-600' />
                        {chapterCount} Chapters
                    </h2>
                    {course?.courseContent?.length ? (
                        <Button size='sm' className='bg-orange-600 px-3 text-xs font-semibold hover:bg-yellow-700' onClick={onEnrollCourse} disabled={loading}>
                            {loading?<LoaderCircle className='animate-spin'/>:<PlayCircle className='size-4' />}
                            Start Learning
                        </Button>
                    ) : (
                        <Link href={'/workspace/edit-course/' + course?.cid}><Button size='sm' variant='outline' className='bg-orange-400 px-3 text-xs font-semibold hover:bg-orange-600'>
                            <Settings className='size-4' />
                            Generate Course
                        </Button>
                        </Link>
                    )}
                </div>
            </div>

        </div>
    )
}

export default CourseCard

"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import axios from 'axios'
import { Loader2Icon, Sparkle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {v4 as uuidv4} from 'uuid';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
const AddNewCourseDialog = ({ children }) => {


    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        numberOfChapters: 0,
        includeVideo: false,
        difficultyLevel: '',
        category: ''
    });


    const router=useRouter();

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        console.log(formData);
    }

    const onGenerate = async () => {
        console.log(formData);
        const courseId=uuidv4();
        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                courseId:courseId
            });
        
            if(result.data.resp=='limit exceed'){
                toast.warning('Please subscribe to plan!')
                router.push('/workspace/billing');
            }
            setLoading(false);
            router.push('/workspace/edit-course/'+result.data?.courseId);

        }
        catch (e) {
            console.log(e);
            setLoading(false);
        }
    }


    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription asChild>
                        <div className='flex flex-col gap-4 mt-3'>
                            <div>
                                <label>Course Name</label>
                                <Input placeholder='Enter course name' onChange={(event) => onHandleInputChange('name', event?.target.value)} />
                            </div>
                            <div>
                                <label>Course Description (Optional)</label>
                                <Textarea placeholder='Course description' onChange={(event) => onHandleInputChange('description', event?.target.value)} />
                            </div>
                            <div>
                                <label>No. of Chapters</label>
                                <Input placeholder='No. of chapters' type='number' onChange={(event) => onHandleInputChange('numberOfChapters', Number(event?.target.value))} />
                            </div>
                            <div className='flex gap-3 items-center'>
                                <label>Include Video Lectures</label>
                                <Switch onCheckedChange={(checked) => onHandleInputChange('includeVideo', checked)} />
                            </div>
                            <div>
                                <label>Difficulty Level</label>
                                <Select onValueChange={(value) => onHandleInputChange('difficultyLevel', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Difficulty Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label>Category</label>
                                <Input placeholder='Category (Seperated by Comma)' onChange={(event) => onHandleInputChange('category', event?.target.value)} />
                            </div>
                            <div className='mt-5'>
                                <Button className={'w-full'} onClick={onGenerate} disabled={loading}>
                                    {loading ? <Loader2Icon className='animate-spin' /> : <Sparkle />} Generate Course
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Course details form fields */}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewCourseDialog


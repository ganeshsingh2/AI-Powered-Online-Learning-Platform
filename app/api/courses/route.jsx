import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { desc, eq, ne } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import axios from 'axios';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId');
    const user = await currentUser();
    if(courseId==0){
        const result = await db.select().from(coursesTable).where(sql`${coursesTable.courseContent} :: jsonb !='{}' ::jsonb`);
        console.log(result);
        return NextResponse.json(result[0]);
    }
    if (courseId) {
        const result = await db.select().from(coursesTable).where(eq(coursesTable.cid, courseId));

        console.log(result);
        return NextResponse.json(result[0]);
    }
    else {
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        if (!userEmail) {
            return NextResponse.json([]);
        }

        const result = await db.select().from(coursesTable).where(eq(coursesTable.userEmail, userEmail)).orderBy(desc(coursesTable.id));

        console.log(result);
        return NextResponse.json(result);
    }
}    

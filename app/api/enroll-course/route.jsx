import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const withCompletedChaptersArray = (course) => ({
    ...course,
    enrollCourse: {
        ...course?.enrollCourse,
        completedChapters: Array.isArray(course?.enrollCourse?.completedChapters)
            ? course.enrollCourse.completedChapters
            : [],
    },
});

export async function POST(req) {
    const { courseId } = await req.json();
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!courseId || !userEmail) {
        return NextResponse.json({ error: "Missing course or user" }, { status: 400 });
    }

    //if Course already enrolled
    const enrollCourses = await db.select().from(enrollCourseTable)
        .where(and(eq(enrollCourseTable.userEmail, userEmail),
            eq(enrollCourseTable.cid, courseId)));

    if (enrollCourses?.length == 0) {
        const result = await db.insert(enrollCourseTable)
            .values({
                cid: courseId,
                userEmail,
                completedChapters: []
            }).returning()

        return NextResponse.json(result);
    }

    return NextResponse.json({ 'resp': 'Already Enrolled' })
}

export async function GET(req) {
    const user = await currentUser()
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
        return NextResponse.json([]);
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId')

    if (courseId) {
        const result = await db.select().from(coursesTable)
            .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
            .where(and(eq(enrollCourseTable.userEmail, userEmail),
                eq(enrollCourseTable.cid, courseId)))
        return NextResponse.json(result[0] ? withCompletedChaptersArray(result[0]) : null);
    }
    else {
        const result = await db.select().from(coursesTable)
            .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
            .where(eq(enrollCourseTable.userEmail, userEmail))
            .orderBy(desc(enrollCourseTable.id));


        return NextResponse.json(result.map(withCompletedChaptersArray));
    }
}


export async function PUT(req) {
    const { completedChapter, courseId } = await req.json();
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!courseId || !userEmail) {
        return NextResponse.json({ error: "Missing course or user" }, { status: 400 });
    }

    if (!Array.isArray(completedChapter)) {
        return NextResponse.json({ error: "completedChapter must be an array" }, { status: 400 });
    }

    const completedChapters = Array.from(
        new Set(completedChapter.map(Number).filter(Number.isInteger))
    ).sort((a, b) => a - b);

    const result = await db.update(enrollCourseTable).set({
        completedChapters
    }).where(and(eq(enrollCourseTable.cid, courseId),
        eq(enrollCourseTable.userEmail, userEmail)))
        .returning()

    return NextResponse.json(result);
}

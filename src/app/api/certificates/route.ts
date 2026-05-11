import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = getSession();
    
    // For demo purposes, fallback to a user if mock session is inactive
    let userId = session?.id;
    if (!userId) {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        return NextResponse.json({ error: "No user available" }, { status: 401 });
      }
      userId = fallbackUser.id;
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    // 1. Fetch course & calculate total lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: { lessons: true }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    let totalLessonsCount = 0;
    const lessonIds: string[] = [];
    course.sections.forEach(section => {
      totalLessonsCount += section.lessons.length;
      section.lessons.forEach(l => lessonIds.push(l.id));
    });

    // 2. Fetch completed lessons for user
    const progressRecords = await prisma.progress.findMany({
      where: {
        userId: userId,
        lessonId: { in: lessonIds },
        isCompleted: true
      }
    });

    // If no lessons or not all lessons completed, reject
    if (progressRecords.length < totalLessonsCount || totalLessonsCount === 0) {
      return NextResponse.json({ 
        error: "Course not 100% complete", 
        completed: progressRecords.length,
        total: totalLessonsCount
      }, { status: 400 });
    }

    // 3. Check if certificate already exists to avoid duplicates
    const existingCert = await prisma.certificate.findFirst({
      where: { userId: userId, courseId: courseId }
    });

    if (existingCert) {
      return NextResponse.json({ 
        certificateId: existingCert.id, 
        uniqueUrl: existingCert.uniqueUrl 
      });
    }

    // 4. Generate Certificate
    const uniqueUrl = crypto.randomUUID();
    const certificate = await prisma.certificate.create({
      data: {
        userId: userId,
        courseId: courseId,
        uniqueUrl: uniqueUrl,
      }
    });

    return NextResponse.json({ 
      certificateId: certificate.id, 
      uniqueUrl: certificate.uniqueUrl 
    });

  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

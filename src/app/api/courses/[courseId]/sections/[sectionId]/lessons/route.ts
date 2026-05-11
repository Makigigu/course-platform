import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { courseId: string, sectionId: string } }) {
  try {
    const session = getSession();
    if (!session || session.role !== "INSTRUCTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { title, isQuiz } = await req.json();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const count = await prisma.lesson.count({ where: { sectionId: params.sectionId } });

    const lesson = await prisma.lesson.create({
      data: {
        title,
        order: count + 1,
        isQuiz: !!isQuiz,
        videoUrl: isQuiz ? null : "https://www.w3schools.com/html/mov_bbb.mp4", // Mock video
        sectionId: params.sectionId
      }
    });

    // If it's a quiz, create a default empty quiz object
    if (isQuiz) {
      await prisma.quiz.create({
        data: {
          lessonId: lesson.id,
          questions: [
            {
              id: "q1",
              questionText: "แบบทดสอบเริ่มต้น (กรุณาแก้ไข)",
              options: ["ตัวเลือก A", "ตัวเลือก B", "ตัวเลือก C"],
              correctOptionIndex: 0
            }
          ]
        }
      });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}

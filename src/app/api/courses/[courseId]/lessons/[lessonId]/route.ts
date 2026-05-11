import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { courseId: string, lessonId: string } }) {
  try {
    const session = getSession();
    if (!session || session.role !== "INSTRUCTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await prisma.progress.deleteMany({ where: { lessonId: params.lessonId } });
    await prisma.quiz.deleteMany({ where: { lessonId: params.lessonId } });
    await prisma.lesson.delete({ where: { id: params.lessonId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}

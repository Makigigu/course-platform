import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const session = getSession();
    if (!session || session.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const course = await prisma.course.findUnique({ where: { id: params.courseId } });
    if (!course || course.instructorId !== session.id) {
      return NextResponse.json({ error: "Not found or not your course" }, { status: 404 });
    }

    // Must delete related records first due to foreign keys
    await prisma.progress.deleteMany({ where: { lesson: { section: { courseId: params.courseId } } } });
    await prisma.quiz.deleteMany({ where: { lesson: { section: { courseId: params.courseId } } } });
    await prisma.lesson.deleteMany({ where: { section: { courseId: params.courseId } } });
    await prisma.section.deleteMany({ where: { courseId: params.courseId } });
    await prisma.enrollment.deleteMany({ where: { courseId: params.courseId } });
    await prisma.review.deleteMany({ where: { courseId: params.courseId } });
    await prisma.certificate.deleteMany({ where: { courseId: params.courseId } });

    await prisma.course.delete({ where: { id: params.courseId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}

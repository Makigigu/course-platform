import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { courseId: string, sectionId: string } }) {
  try {
    const session = getSession();
    if (!session || session.role !== "INSTRUCTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await prisma.progress.deleteMany({ where: { lesson: { sectionId: params.sectionId } } });
    await prisma.quiz.deleteMany({ where: { lesson: { sectionId: params.sectionId } } });
    await prisma.lesson.deleteMany({ where: { sectionId: params.sectionId } });
    await prisma.section.delete({ where: { id: params.sectionId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}

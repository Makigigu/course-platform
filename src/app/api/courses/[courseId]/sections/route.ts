import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const session = getSession();
    if (!session || session.role !== "INSTRUCTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const count = await prisma.section.count({ where: { courseId: params.courseId } });

    const section = await prisma.section.create({
      data: {
        title,
        order: count + 1,
        courseId: params.courseId
      }
    });

    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}

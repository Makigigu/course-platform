import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = getSession();
    
    // Only INSTRUCTOR can create a course
    if (!session || session.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized. Only instructors can create courses." }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, price, thumbnail } = body;

    if (!title || !description || price === undefined) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // Create the course and link to the instructor
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        price: Number(price),
        thumbnail: thumbnail || null,
        instructorId: session.id,
      }
    });

    return NextResponse.json({ success: true, courseId: newCourse.id });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างคอร์ส" }, { status: 500 });
  }
}

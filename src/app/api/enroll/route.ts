import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนทำการลงทะเบียนเรียน" }, { status: 401 });
    }

    // ตรวจสอบว่า User นี้ยังมีอยู่ในระบบจริงหรือไม่ (เผื่อกรณีที่มีการล้างฐานข้อมูล Seed ใหม่)
    const userExists = await prisma.user.findUnique({ where: { id: session.id } });
    if (!userExists) {
      const response = NextResponse.json({ error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
      response.cookies.delete("session_token");
      return response;
    }

    const { courseId } = await req.json();

    const existing = await prisma.enrollment.findFirst({
      where: { userId: session.id, courseId }
    });

    if (existing) {
      return NextResponse.json({ success: true, enrollmentId: existing.id });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.id,
        courseId,
        progress: 0.0
      }
    });

    return NextResponse.json({ success: true, enrollmentId: enrollment.id });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" }, { status: 500 });
  }
}

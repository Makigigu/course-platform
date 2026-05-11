import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // เช็คว่ามีอีเมลนี้อยู่แล้วหรือไม่
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น" }, { status: 400 });
    }

    // สร้างบัญชีผู้ใช้ใหม่
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        role: "STUDENT" 
      }
    });

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const encoded = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    
    const response = NextResponse.json({ success: true });
    response.cookies.set("session_token", encoded, { path: "/", httpOnly: true });
    
    return response;
  } catch (e) {
    console.error("Register Error:", e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

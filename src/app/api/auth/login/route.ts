import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
    }

    // สำหรับโหมดจำลอง (Mock) เราจะค้นหาแค่ด้วยอีเมล โดยข้ามการเข้ารหัสรหัสผ่านไปก่อน
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return NextResponse.json({ error: "ไม่พบบัญชีผู้ใช้นี้ หรือรหัสผ่านไม่ถูกต้อง" }, { status: 404 });
    }

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // จำลองการเข้ารหัส JWT เบื้องต้นด้วย Base64
    const encoded = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    
    const response = NextResponse.json({ success: true, role: user.role });
    // เซ็ต Cookie ชื่อ session_token เพื่อให้ auth.ts ดึงไปใช้งานต่อ
    response.cookies.set("session_token", encoded, { path: "/", httpOnly: true });
    
    return response;
  } catch (e) {
    console.error("Login Error:", e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

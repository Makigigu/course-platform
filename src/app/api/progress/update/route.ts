import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = getSession();
    
    // Fallback สำหรับโหมดทดสอบ
    let userId = session?.id;
    if (!userId) {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      userId = fallbackUser.id;
    }

    const { lessonId, isCompleted } = await req.json();

    await prisma.progress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: { isCompleted },
      create: { userId, lessonId, isCompleted, watchedSeconds: 0 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

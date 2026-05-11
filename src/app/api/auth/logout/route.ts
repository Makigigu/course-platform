import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // ลบ Cookie เพื่อออกจากระบบ
  response.cookies.delete("session_token");
  return response;
}

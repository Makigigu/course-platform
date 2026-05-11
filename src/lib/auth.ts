import { cookies } from "next/headers";

export type UserSession = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
} | null;

export function getSession(): UserSession {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session_token");

  if (!sessionToken) {
    return null;
  }

  try {
    // Decode JWT payload properly (UTF-8)
    const decodedStr = Buffer.from(sessionToken.value, 'base64').toString('utf8');
    const decoded = JSON.parse(decodedStr);
    return decoded as UserSession;
  } catch (e) {
    return null;
  }
}

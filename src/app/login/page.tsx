"use client";

import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@skillnova.com"); // ค่าเริ่มต้นเพื่อความสะดวกในการเทส
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }

      // นำทางไปหน้าแดชบอร์ดตาม Role
      if (data.role === 'ADMIN') {
        router.push("/admin");
      } else if (data.role === 'INSTRUCTOR') {
        router.push("/instructor");
      } else {
        router.push("/dashboard");
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col items-center gap-2 mb-8">
          <BookOpen className="h-10 w-10 text-[#9F7AEA]" />
          <h1 className="text-2xl font-bold text-slate-800">ยินดีต้อนรับกลับมา</h1>
          <p className="text-sm text-slate-500">เข้าสู่ระบบเพื่อเรียนต่อบน SkillNova</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setEmail("student@skillnova.com")} className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">นักเรียน</button>
            <button type="button" onClick={() => setEmail("instructor@skillnova.com")} className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">ผู้สอน</button>
            <button type="button" onClick={() => setEmail("admin@skillnova.com")} className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors">แอดมิน</button>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">อีเมล</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com" 
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#9F7AEA] focus:outline-none focus:ring-1 focus:ring-[#9F7AEA]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">รหัสผ่าน</label>
              <Link href="#" className="text-xs text-[#9F7AEA] hover:underline">ลืมรหัสผ่าน?</Link>
            </div>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••" 
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#9F7AEA] focus:outline-none focus:ring-1 focus:ring-[#9F7AEA]"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 w-full flex items-center justify-center h-11 rounded-lg bg-[#9F7AEA] px-4 font-bold text-white shadow-md transition-all hover:bg-[#805AD5] disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "เข้าสู่ระบบ"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          ยังไม่มีบัญชีใช่ไหม?{" "}
          <Link href="/register" className="font-medium text-[#9F7AEA] hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </main>
  );
}

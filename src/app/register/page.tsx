"use client";

import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "สมัครสมาชิกไม่สำเร็จ");
      }

      router.push("/dashboard");
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
          <h1 className="text-2xl font-bold text-slate-800">สร้างบัญชีผู้ใช้</h1>
          <p className="text-sm text-slate-500">เริ่มต้นเส้นทางการเรียนรู้ของคุณวันนี้</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">ชื่อ-นามสกุล</label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe" 
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#9F7AEA] focus:outline-none focus:ring-1 focus:ring-[#9F7AEA]"
            />
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
            <label className="text-sm font-medium text-slate-700" htmlFor="password">รหัสผ่าน</label>
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
            className="mt-4 w-full flex justify-center items-center h-11 rounded-lg bg-[#9F7AEA] px-4 font-bold text-white shadow-md transition-all hover:bg-[#805AD5] disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ลงทะเบียนฟรี"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          มีบัญชีอยู่แล้วใช่ไหม?{" "}
          <Link href="/login" className="font-medium text-[#9F7AEA] hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </main>
  );
}

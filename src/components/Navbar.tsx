import Link from "next/link";
import { BookOpen, UserCircle } from "lucide-react";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const session = getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-brand" />
            <span className="text-xl font-bold tracking-tight text-slate-800">SkillNova</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              {session.role === 'ADMIN' ? (
                <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">แผงควบคุม (Admin)</Link>
              ) : session.role === 'INSTRUCTOR' ? (
                <Link href="/instructor" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">แดชบอร์ดผู้สอน</Link>
              ) : (
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">ห้องเรียนของฉัน</Link>
              )}
              <div className="group relative flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer py-2">
                <UserCircle className="h-6 w-6 text-brand-light" />
                <span className="hidden md:inline">{session.name}</span>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-1 w-56 rounded-xl bg-white shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-500">บัญชีผู้ใช้</p>
                    <p className="font-bold text-slate-800 truncate">{session.name}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      session.role === 'ADMIN' ? 'bg-red-50 text-red-500' :
                      session.role === 'INSTRUCTOR' ? 'bg-blue-50 text-blue-500' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {session.role}
                    </span>
                  </div>
                  {session.role === 'ADMIN' ? (
                    <Link href="/admin" className="px-4 py-2.5 text-sm text-slate-600 hover:bg-[#9F7AEA]/10 hover:text-brand transition-colors">แผงควบคุม Admin</Link>
                  ) : session.role === 'INSTRUCTOR' ? (
                    <Link href="/instructor" className="px-4 py-2.5 text-sm text-slate-600 hover:bg-[#9F7AEA]/10 hover:text-brand transition-colors">แดชบอร์ดผู้สอน</Link>
                  ) : (
                    <Link href="/dashboard" className="px-4 py-2.5 text-sm text-slate-600 hover:bg-[#9F7AEA]/10 hover:text-brand transition-colors">ห้องเรียนของฉัน</Link>
                  )}
                  <div className="px-4 py-2 mt-1 border-t border-slate-100">
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">เข้าสู่ระบบ</Link>
              <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-md bg-[#9F7AEA] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#805AD5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand">
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

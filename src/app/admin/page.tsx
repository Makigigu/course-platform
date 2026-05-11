import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, BookOpen, Award, FileText } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = getSession();
  
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch system-wide stats
  const totalUsers = await prisma.user.count();
  const totalCourses = await prisma.course.count();
  const totalCertificates = await prisma.certificate.count();
  const totalEnrollments = await prisma.enrollment.count();

  const recentUsers = await prisma.user.findMany({
    orderBy: { id: 'desc' }, // mockup order
    take: 5
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 flex items-center gap-6 bg-slate-900 p-8 rounded-2xl shadow-md border border-slate-800">
          <div className="h-20 w-20 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shadow-md">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">ศูนย์ควบคุมผู้ดูแลระบบ (Admin)</h1>
            <p className="text-slate-400 font-medium">ภาพรวมระบบ จัดการผู้ใช้งาน และควบคุมความปลอดภัย</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-slate-500 font-medium">
              <Users className="h-5 w-5 text-blue-500" /> บัญชีทั้งหมด
            </div>
            <h3 className="text-3xl font-black text-slate-800">{totalUsers}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-slate-500 font-medium">
              <BookOpen className="h-5 w-5 text-[#9F7AEA]" /> คอร์สเรียนในระบบ
            </div>
            <h3 className="text-3xl font-black text-slate-800">{totalCourses}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-slate-500 font-medium">
              <FileText className="h-5 w-5 text-emerald-500" /> การลงทะเบียนเรียน
            </div>
            <h3 className="text-3xl font-black text-slate-800">{totalEnrollments}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-slate-500 font-medium">
              <Award className="h-5 w-5 text-amber-500" /> ใบประกาศที่ออกไป
            </div>
            <h3 className="text-3xl font-black text-slate-800">{totalCertificates}</h3>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">ผู้ใช้งานล่าสุด</h2>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition-colors">
              ดูผู้ใช้ทั้งหมด
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-sm text-slate-500">
                  <th className="p-4 font-semibold">ชื่อ</th>
                  <th className="p-4 font-semibold">อีเมล</th>
                  <th className="p-4 font-semibold">บทบาท (Role)</th>
                  <th className="p-4 font-semibold">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{u.name}</td>
                    <td className="p-4 text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        u.role === 'INSTRUCTOR' ? 'bg-[#9F7AEA]/20 text-[#805AD5]' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> ใช้งานปกติ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

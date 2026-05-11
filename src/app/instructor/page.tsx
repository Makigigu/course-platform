import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, PlayCircle, Star, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function InstructorDashboard() {
  const session = getSession();
  
  if (!session || session.role !== "INSTRUCTOR") {
    redirect("/dashboard");
  }

  // Fetch only courses that belong to the instructor
  const courses = await prisma.course.findMany({
    where: {
      instructorId: session.id
    },
    include: {
      _count: {
        select: { enrollments: true }
      },
      reviews: true
    }
  });

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);
  const totalRevenue = totalStudents * 1500; // Mock revenue

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 flex items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#9F7AEA] to-[#805AD5] text-white flex items-center justify-center text-3xl font-bold shadow-md">
            {session.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-1">แดชบอร์ดผู้สอน, {session.name}</h1>
            <p className="text-slate-500 font-medium">จัดการคอร์สเรียน ติดตามรายได้ และดูแลนักเรียนของคุณ</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">นักเรียนทั้งหมด</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalStudents} คน</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
              <DollarSign className="h-7 w-7" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">รายได้รวมโดยประมาณ</p>
              <h3 className="text-2xl font-bold text-slate-800">฿{totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#9F7AEA]/10 text-[#9F7AEA] flex items-center justify-center">
              <PlayCircle className="h-7 w-7" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">คอร์สเรียนที่เปิดสอน</p>
              <h3 className="text-2xl font-bold text-slate-800">{courses.length} คอร์ส</h3>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">คอร์สเรียนของคุณ</h2>
            <Link href="/instructor/courses/new" className="px-4 py-2 bg-[#9F7AEA] hover:bg-[#805AD5] text-white rounded-lg text-sm font-semibold transition-colors">
              + สร้างคอร์สใหม่
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {courses.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="mb-4 text-lg">คุณยังไม่มีคอร์สเรียน</p>
                <Link href="/instructor/courses/new" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                  เริ่มสร้างคอร์สแรกของคุณ
                </Link>
              </div>
            ) : (
              courses.map(course => (
              <div key={course.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-50 transition-colors">
                <div className="w-full sm:w-48 aspect-video bg-slate-100 rounded-xl overflow-hidden shrink-0">
                  <img src={course.thumbnail || ''} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{course.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course._count.enrollments} นักเรียน</span>
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400" /> {course.reviews.length > 0 ? (course.reviews.reduce((a, b) => a + b.rating, 0) / course.reviews.length).toFixed(1) : 4.8} ({course.reviews.length} รีวิว)</span>
                    <span className="font-bold text-slate-700">฿{course.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/instructor/courses/${course.id}/edit`} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">จัดการคอร์ส</Link>
                  <Link href={`/courses/${course.id}`} className="px-4 py-2 border border-slate-200 hover:border-[#9F7AEA] hover:text-[#9F7AEA] font-semibold rounded-lg text-sm transition-colors">ดูหน้าคอร์ส</Link>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

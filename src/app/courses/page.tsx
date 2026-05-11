import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Search, Star, PlayCircle, BookOpen, Clock, Users } from "lucide-react";

const prisma = new PrismaClient();

export default async function AllCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      reviews: true,
      _count: {
        select: { enrollments: true, sections: true }
      }
    }
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">คอร์สเรียนทั้งหมด</h1>
          <p className="text-slate-400 max-w-2xl text-lg">เลือกดูและลงทะเบียนเรียนในคอร์สที่คัดสรรมาเพื่อการพัฒนาทักษะเฉพาะด้านของคุณ โดยผู้เชี่ยวชาญจากทั่วโลก</p>
          
          <div className="w-full max-w-xl flex items-center relative mt-8">
            <Search className="absolute left-4 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อคอร์สเรียน..." 
              className="w-full h-14 pl-12 pr-4 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#9F7AEA] text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => {
            const avgRating = course.reviews.length > 0 
              ? course.reviews.reduce((acc, rev) => acc + rev.rating, 0) / course.reviews.length 
              : 4.8;

            return (
              <Link key={course.id} href={`/courses/${course.id}`} className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                <div className="aspect-video w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#9F7AEA]/20 to-transparent flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-[#9F7AEA] opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {avgRating.toFixed(1)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-[#9F7AEA] transition-colors">{course.title}</h3>
                  <div className="flex items-center text-xs text-slate-500 mb-4 gap-3 font-medium">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {course._count.sections} บท</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {course._count.enrollments} คน</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    <span className="font-black text-xl text-slate-800">฿{course.price}</span>
                    <span className="text-sm font-bold text-[#9F7AEA]">ดูรายละเอียด</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, Award, PlayCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = getSession();
  
  // Use a fallback user for demonstration if auth isn't fully active
  let userId = session?.id;
  
  if (!userId) {
    const user = await prisma.user.findFirst();
    if (user) {
      userId = user.id;
    } else {
      redirect("/login");
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: { 
          course: {
            include: {
              sections: {
                include: { lessons: true }
              }
            }
          }
        }
      },
      certificates: {
        include: { course: true },
        orderBy: { id: 'desc' }
      },
      progress: {
        where: { isCompleted: true }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-12 flex items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#9F7AEA] to-[#805AD5] text-white flex items-center justify-center text-3xl font-bold shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-1">ยินดีต้อนรับกลับมา, {user.name}</h1>
            <p className="text-slate-500 font-medium">จัดการการเรียนรู้และดูความสำเร็จของคุณ</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-[#9F7AEA]" />
                คอร์สเรียนที่กำลังเรียน
              </h2>
              {user.enrollments.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PlayCircle className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">ไม่มีคอร์สเรียนที่ลงทะเบียนไว้</h3>
                  <p className="text-slate-500 mb-6">คุณยังไม่ได้ลงทะเบียนเรียนคอร์สใดๆ</p>
                  <Link href="/courses" className="inline-flex items-center justify-center rounded-xl bg-[#9F7AEA] px-6 py-3 font-semibold text-white shadow-sm hover:bg-[#805AD5] transition-all hover:-translate-y-0.5">
                    สำรวจคอร์สเรียน
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {user.enrollments.map((enrollment) => {
                    let totalLessonsCount = 0;
                    const courseLessonIds: string[] = [];
                    enrollment.course.sections.forEach(s => {
                      totalLessonsCount += s.lessons.length;
                      s.lessons.forEach(l => courseLessonIds.push(l.id));
                    });
                    
                    const completedLessonsCount = user.progress.filter(pr => courseLessonIds.includes(pr.lessonId)).length;
                    const calculatedProgress = totalLessonsCount === 0 ? 0 : Math.round((completedLessonsCount / totalLessonsCount) * 100);

                    return (
                    <div key={enrollment.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-8 group hover:shadow-md hover:border-[#9F7AEA]/50 transition-all duration-300">
                      <div className="w-full sm:w-56 aspect-video bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
                        {enrollment.course.thumbnail ? (
                          <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[#9F7AEA]/20 to-transparent flex items-center justify-center">
                            <PlayCircle className="h-12 w-12 text-[#9F7AEA] opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-xl text-slate-800 mb-3 group-hover:text-[#805AD5] transition-colors">{enrollment.course.title}</h3>
                        
                        <div className="mb-5">
                          <div className="flex justify-between text-sm mb-2 font-medium">
                            <span className="text-slate-600">ความคืบหน้า</span>
                            <span className="text-[#9F7AEA]">{calculatedProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-3">
                            <div className="bg-gradient-to-r from-[#9F7AEA] to-[#805AD5] h-3 rounded-full transition-all duration-1000" style={{ width: `${calculatedProgress}%` }}></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <Clock className="h-4 w-4" /> เข้าเรียนล่าสุดวันนี้
                          </div>
                          <Link 
                            href={`/courses/${enrollment.courseId}`}
                            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800 hover:shadow-md transition-all active:scale-95"
                          >
                            เรียนต่อ
                          </Link>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Award className="h-6 w-6 text-amber-500" />
                ใบประกาศนียบัตรของฉัน
              </h2>
              {user.certificates.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                    <Award className="h-10 w-10 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">ยังไม่มีใบประกาศนียบัตร</h3>
                  <p className="text-slate-500 text-sm">เรียนจบ 100% เพื่อรับใบประกาศนียบัตรใบแรกของคุณ</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {user.certificates.map((cert) => (
                    <div key={cert.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-100 transition-colors">
                          <Award className="h-7 w-7 text-amber-500" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-slate-800 line-clamp-2 text-sm mb-2">{cert.course.title}</h3>
                          <Link 
                            href={`/certificate/${cert.id}`}
                            className="inline-flex items-center text-sm font-bold text-[#9F7AEA] hover:text-[#805AD5] hover:underline"
                          >
                            ดูเอกสาร &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}

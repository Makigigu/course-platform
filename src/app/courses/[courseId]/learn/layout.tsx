import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";

const prisma = new PrismaClient();

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const session = getSession();
  
  // จำลอง User หากไม่ได้เข้าสู่ระบบจริงๆ ในโหมดสาธิต
  let userId = session?.id;
  if (!userId) {
    const user = await prisma.user.findFirst();
    userId = user?.id;
  }
  if (!userId) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              progress: {
                where: { userId }
              }
            }
          }
        }
      }
    }
  });

  if (!course) notFound();

  // คำนวณความคืบหน้า (Progress)
  let totalLessons = 0;
  let completedLessons = 0;

  course.sections.forEach(s => {
    totalLessons += s.lessons.length;
    s.lessons.forEach(l => {
      if (l.progress[0]?.isCompleted) completedLessons++;
    });
  });

  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Sidebar เมนูด้านข้าง */}
      <aside className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col hidden md:flex shrink-0">
        <div className="p-5 border-b border-slate-200 bg-white">
          <Link href="/dashboard" className="text-sm font-medium text-[#9F7AEA] hover:underline mb-2 block">&larr; กลับแดชบอร์ด</Link>
          <h2 className="font-bold text-slate-800 line-clamp-2 leading-tight">{course.title}</h2>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div className="bg-gradient-to-r from-[#9F7AEA] to-[#805AD5] h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-2">เรียนไปแล้ว {progressPercent}% ({completedLessons}/{totalLessons} บท)</p>
          
          {progressPercent === 100 && (
             <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg text-sm flex items-center gap-2 text-green-700 font-medium">
               <CheckCircle2 className="h-5 w-5 text-green-500" /> ยินดีด้วย! คุณเรียนจบแล้ว
             </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {course.sections.map((section, sIndex) => (
            <div key={section.id} className="border-b border-slate-200 last:border-b-0">
              <div className="px-5 py-4 bg-white/50 font-bold text-slate-800 text-sm border-b border-slate-100 shadow-sm sticky top-0 z-10 backdrop-blur-sm">
                ส่วนที่ {sIndex + 1}: {section.title}
              </div>
              <div className="flex flex-col">
                {section.lessons.map((lesson, lIndex) => {
                  const isCompleted = lesson.progress[0]?.isCompleted;
                  return (
                    <Link 
                      key={lesson.id} 
                      href={`/courses/${course.id}/learn/${lesson.id}`}
                      className={`flex items-start gap-4 px-5 py-4 hover:bg-[#9F7AEA]/5 border-l-4 transition-colors group ${
                        isCompleted ? 'border-transparent' : 'border-transparent hover:border-[#9F7AEA]'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5 relative">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : lesson.isQuiz ? (
                          <Lock className="h-5 w-5 text-slate-300 group-hover:text-[#9F7AEA] transition-colors" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-slate-300 group-hover:text-[#9F7AEA] transition-colors" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold leading-snug ${isCompleted ? 'text-slate-500' : 'text-slate-700'}`}>
                          {lIndex + 1}. {lesson.title}
                        </p>
                        {lesson.isQuiz && <span className="text-[10px] tracking-wide font-black uppercase text-[#9F7AEA] mt-1.5 block">📝 แบบทดสอบ</span>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
      
      {/* พื้นที่แสดงเนื้อหาหลัก */}
      <main className="flex-1 overflow-y-auto bg-slate-100 flex flex-col relative w-full">
        {children}
      </main>
    </div>
  );
}

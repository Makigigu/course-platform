import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { PlayCircle, CheckCircle2, Clock, Users, BookOpen, Star, Play } from 'lucide-react';
import Link from 'next/link';
import { getSession } from "@/lib/auth";
import EnrollButton from "@/components/EnrollButton";

const prisma = new PrismaClient();

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      },
      reviews: true,
      _count: {
        select: { enrollments: true }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const session = getSession();
  let isEnrolled = false;

  if (session && session.id) {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.id, courseId: params.courseId }
    });
    isEnrolled = !!enrollment;
  }

  // Calculate total lessons
  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  
  // Calculate Rating
  const avgRating = course.reviews.length > 0 
    ? course.reviews.reduce((acc, rev) => acc + rev.rating, 0) / course.reviews.length 
    : 4.8;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50 overflow-x-hidden">
      {/* Course Hero - Light Modern Theme */}
      <div className="bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 text-slate-900 py-12 md:py-20 relative border-b border-slate-100">
        {/* Abstract background blobs for design */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-[#9F7AEA]/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 rounded-full bg-[#805AD5]/10 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="bg-[#9F7AEA]/20 text-[#9F7AEA] px-3 py-1 rounded-full">การพัฒนาซอฟต์แวร์</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span className="text-slate-500 ml-1 font-medium">({course.reviews.length} รีวิว)</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">{course.title}</h1>
              <p className="text-slate-600 text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
                {course.description}
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm text-indigo-700">
                  ท
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">ผู้สอน</div>
                  <div className="font-bold text-slate-800">ทีมผู้เชี่ยวชาญ</div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-slate-200 text-sm font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#9F7AEA]" />
                  <span>นักเรียนที่ลงทะเบียน {course._count.enrollments} คน</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#9F7AEA]" />
                  <span>{totalLessons} บทเรียน</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#9F7AEA]" />
                  <span>เรียนได้ตามอัธยาศัย</span>
                </div>
              </div>
            </div>
            
            {/* Desktop Enrollment Card */}
            <div className="hidden lg:block relative">
              <div className="absolute top-0 right-0 w-full max-w-sm rounded-2xl bg-white shadow-2xl text-slate-800 overflow-hidden border border-slate-100 translate-y-8">
                <div className="aspect-video w-full bg-slate-100 flex items-center justify-center relative">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#9F7AEA]/50 to-[#805AD5]/30 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="bg-white/90 rounded-full p-3 shadow-lg">
                      <PlayCircle className="h-8 w-8 text-[#9F7AEA]" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-4xl font-black text-slate-800 mb-6 flex items-baseline gap-1">
                    <span className="text-2xl text-slate-500 font-bold">฿</span>
                    {course.price.toLocaleString()}
                  </div>
                  {isEnrolled ? (
                    <Link href={`/courses/${course.id}/learn`} className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-4 font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:-translate-y-0.5 mb-4 text-lg">
                      <Play className="h-5 w-5" /> เข้าสู่ห้องเรียน
                    </Link>
                  ) : (
                    <EnrollButton courseId={course.id} />
                  )}
                  <p className="text-sm text-center text-slate-500 font-medium">เข้าถึงได้ตลอดชีพและรับประกันคืนเงินภายใน 30 วัน</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">เนื้อหาหลักสูตร</h2>
            <div className="space-y-6">
              {course.sections.map((section, index) => (
                <div key={section.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">
                      ส่วนที่ {index + 1}: {section.title}
                    </h3>
                    <span className="text-sm font-medium text-slate-500">{section.lessons.length} บทเรียน</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 shrink-0 font-medium text-sm group-hover:bg-[#9F7AEA]/10 group-hover:text-[#9F7AEA] transition-colors">
                          {lessonIndex + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">{lesson.title}</span>
                          {lesson.isQuiz && <span className="text-xs font-bold text-[#9F7AEA] mt-0.5 uppercase tracking-wider">แบบทดสอบ</span>}
                        </div>
                        <div className="ml-auto flex items-center">
                          {lesson.isQuiz ? (
                            <CheckCircle2 className="h-5 w-5 text-slate-300 group-hover:text-[#9F7AEA] transition-colors" />
                          ) : (
                            <PlayCircle className="h-5 w-5 text-slate-300 group-hover:text-[#9F7AEA] transition-colors" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Enrollment Card */}
          <div className="lg:hidden rounded-2xl bg-white shadow-xl border border-slate-200 p-8 mt-8">
            <div className="text-4xl font-black text-slate-800 mb-6 flex items-baseline gap-1">
              <span className="text-2xl text-slate-500 font-bold">฿</span>
              {course.price.toLocaleString()}
            </div>
            {isEnrolled ? (
              <Link href={`/courses/${course.id}/learn`} className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-4 font-bold text-white shadow-lg transition-colors hover:bg-slate-800 mb-4 text-lg">
                <Play className="h-5 w-5" /> เข้าสู่ห้องเรียน
              </Link>
            ) : (
              <EnrollButton courseId={course.id} />
            )}
            <p className="text-sm text-center text-slate-500 font-medium">เข้าถึงได้ตลอดชีพและรับประกันคืนเงินภายใน 30 วัน</p>
          </div>
        </div>
      </div>
    </main>
  );
}

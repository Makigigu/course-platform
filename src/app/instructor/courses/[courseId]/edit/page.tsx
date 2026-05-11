import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Users, PlayCircle, Trash2, Edit3, PlusCircle } from "lucide-react";
import CourseDeleteButton from "./CourseDeleteButton";
import AddSectionButton from "./AddSectionButton";
import DeleteSectionButton from "./DeleteSectionButton";
import AddLessonButton from "./AddLessonButton";
import DeleteLessonButton from "./DeleteLessonButton";

const prisma = new PrismaClient();

export default async function EditCoursePage({ params }: { params: { courseId: string } }) {
  const session = getSession();
  
  if (!session || session.role !== "INSTRUCTOR") {
    redirect("/dashboard");
  }

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: { lessons: { orderBy: { order: 'asc' } } }
      },
      enrollments: {
        include: { user: true }
      }
    }
  });

  if (!course) notFound();
  if (course.instructorId !== session.id) redirect("/instructor");

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link href="/instructor" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#9F7AEA] transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" /> กลับสู่แดชบอร์ด
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-800">จัดการคอร์สเรียน</h1>
            <p className="text-slate-500 mt-2 font-medium">{course.title}</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/courses/${course.id}`} target="_blank" className="px-6 py-2.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:border-[#9F7AEA] hover:text-[#9F7AEA] transition-all shadow-sm">
              ดูหน้าคอร์ส (Preview)
            </Link>
            <CourseDeleteButton courseId={course.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Curriculum */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#9F7AEA]" /> โครงสร้างหลักสูตร (Curriculum)
                </h2>
                <AddSectionButton courseId={course.id} />
              </div>
              
              <div className="p-6 space-y-6">
                {course.sections.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <p className="mb-4">ยังไม่มีเนื้อหาในคอร์สนี้</p>
                    <AddSectionButton courseId={course.id} />
                  </div>
                ) : (
                  course.sections.map((section, sIdx) => (
                    <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-100/50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">ส่วนที่ {sIdx + 1}: {section.title}</h3>
                        <div className="flex gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-[#9F7AEA] transition-colors" title="แก้ไข (กำลังพัฒนา)"><Edit3 className="h-4 w-4" /></button>
                          <DeleteSectionButton courseId={course.id} sectionId={section.id} />
                        </div>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {section.lessons.length === 0 ? (
                          <div className="px-5 py-4 text-sm text-slate-500 text-center">ไม่มีบทเรียน</div>
                        ) : (
                          section.lessons.map((lesson, lIdx) => (
                            <div key={lesson.id} className="px-5 py-3 flex justify-between items-center hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <PlayCircle className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-700">{lIdx + 1}. {lesson.title}</span>
                                {lesson.isQuiz && <span className="text-[10px] bg-[#9F7AEA]/10 text-[#9F7AEA] px-2 py-0.5 rounded-full font-bold uppercase">Quiz</span>}
                              </div>
                              <div className="flex items-center gap-3">
                                <button className="text-xs font-bold text-slate-400 hover:text-[#9F7AEA]" title="แก้ไข (กำลังพัฒนา)">แก้ไข</button>
                                <DeleteLessonButton courseId={course.id} lessonId={lesson.id} />
                              </div>
                            </div>
                          ))
                        )}
                        <div className="px-5 py-3 bg-slate-50/50">
                          <AddLessonButton courseId={course.id} sectionId={section.id} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Students */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" /> นักเรียนที่ลงทะเบียน
              </h2>
              <div className="text-3xl font-black text-slate-800 mb-6">{course.enrollments.length} <span className="text-base font-medium text-slate-500">คน</span></div>
              
              <div className="space-y-3">
                {course.enrollments.length === 0 ? (
                  <p className="text-sm text-slate-500">ยังไม่มีนักเรียนลงทะเบียน</p>
                ) : (
                  course.enrollments.map(enrollment => (
                    <div key={enrollment.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                        {enrollment.user.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">{enrollment.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{enrollment.user.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">ข้อมูลคอร์ส</h2>
              
              <div className="aspect-video w-full rounded-xl bg-slate-100 mb-4 overflow-hidden border border-slate-200">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">ไม่มีรูปหน้าปก</div>
                )}
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <p className="text-slate-500 font-medium">ราคา</p>
                  <p className="font-bold text-slate-800 flex items-baseline gap-1">
                    <span className="text-slate-500 font-medium">฿</span>
                    {course.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <p className="text-slate-500 font-medium">สถานะ</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 font-bold text-[10px] rounded-full uppercase tracking-wider">เผยแพร่แล้ว</span>
                </div>
                <button 
                  className="w-full py-2.5 mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  แก้ไขข้อมูลพื้นฐาน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

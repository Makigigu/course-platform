import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import QuizPlayer from "@/components/QuizPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import { FileText } from "lucide-react";

const prisma = new PrismaClient();

export default async function LessonPage({ params }: { params: { courseId: string, lessonId: string } }) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      quiz: true
    }
  });

  if (!lesson) notFound();

  return (
    <div className="flex flex-col w-full h-full bg-slate-100">
      {/* Header บทเรียน */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0 shadow-sm z-10">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">{lesson.title}</h1>
        {lesson.pdfUrl && (
          <a href={lesson.pdfUrl} target="_blank" className="flex items-center gap-2 text-sm font-bold text-[#805AD5] hover:text-white bg-[#9F7AEA]/10 hover:bg-[#9F7AEA] transition-all px-5 py-2.5 rounded-xl shadow-sm">
            <FileText className="h-4 w-4" /> โหลดเอกสาร PDF
          </a>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 flex flex-col items-center justify-start md:justify-center relative">
        {lesson.isQuiz && lesson.quiz ? (
          <QuizPlayer 
            quizId={lesson.quiz.id} 
            lessonId={lesson.id} 
            questions={lesson.quiz.questions as any} 
          />
        ) : (
          <div className="w-full max-w-6xl bg-black aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-slate-900/10">
            <VideoPlayer videoUrl={lesson.videoUrl || ""} lessonId={lesson.id} />
          </div>
        )}
      </div>
    </div>
  );
}

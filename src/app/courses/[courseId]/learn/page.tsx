import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function LearnRootPage({ params }: { params: { courseId: string } }) {
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
      }
    }
  });

  if (!course || course.sections.length === 0 || course.sections[0].lessons.length === 0) {
    redirect(`/courses/${params.courseId}`);
  }

  // นำทางไปยังบทเรียนแรกอัตโนมัติ
  const firstLesson = course.sections[0].lessons[0];
  redirect(`/courses/${params.courseId}/learn/${firstLesson.id}`);
}

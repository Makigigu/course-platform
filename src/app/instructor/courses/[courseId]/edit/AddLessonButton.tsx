"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddLessonButton({ courseId, sectionId }: { courseId: string, sectionId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    const isQuiz = window.confirm("ต้องการสร้างเป็น 'แบบทดสอบ (Quiz)' ใช่หรือไม่?\n(ถ้าคลิก OK จะเป็นแบบทดสอบ, ถ้าคลิก Cancel จะเป็นบทเรียนวิดีโอ)");
    const title = window.prompt(`กรุณากรอกชื่อ${isQuiz ? 'แบบทดสอบ' : 'บทเรียน'}ใหม่:`);
    if (!title) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, isQuiz }),
      });

      if (!res.ok) throw new Error("Failed to add lesson");
      router.refresh();
    } catch (e) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleAdd} disabled={isLoading} className="text-sm font-bold text-slate-500 hover:text-[#9F7AEA] flex items-center gap-1 disabled:opacity-50">
      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <PlusCircle className="h-3 w-3" />} เพิ่มบทเรียน / แบบทดสอบ
    </button>
  );
}

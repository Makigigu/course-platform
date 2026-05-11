"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteLessonButton({ courseId, lessonId }: { courseId: string, lessonId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("ยืนยันการลบบทเรียนนี้?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete lesson");
      router.refresh();
    } catch (e) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading} className="text-xs font-bold text-red-400 hover:text-red-600 disabled:opacity-50 flex items-center gap-1">
      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} ลบ
    </button>
  );
}

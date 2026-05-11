"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function CourseDeleteButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้? ข้อมูลทั้งหมดรวมถึงนักเรียนจะถูกลบทิ้งอย่างถาวร")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "ลบคอร์สไม่สำเร็จ");
      }

      router.push("/instructor");
      router.refresh();
    } catch (error) {
      alert(error);
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      ลบคอร์ส
    </button>
  );
}

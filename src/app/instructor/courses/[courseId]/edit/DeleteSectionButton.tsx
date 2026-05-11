"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteSectionButton({ courseId, sectionId }: { courseId: string, sectionId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("ยืนยันการลบหมวดหมู่นี้? บทเรียนทั้งหมดในหมวดหมู่นี้จะหายไป")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/sections/${sectionId}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete section");
      router.refresh();
    } catch (e) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}

"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddSectionButton({ courseId }: { courseId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    const title = window.prompt("กรุณากรอกชื่อหมวดหมู่ใหม่:");
    if (!title) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error("Failed to add section");
      router.refresh();
    } catch (e) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleAdd} disabled={isLoading} className="text-sm font-bold text-[#9F7AEA] hover:text-[#805AD5] flex items-center gap-1">
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />} เพิ่มหมวดหมู่
    </button>
  );
}

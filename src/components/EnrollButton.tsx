"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId })
      });

      if (res.status === 401) {
        // หากยังไม่ได้เข้าสู่ระบบ
        router.push("/login");
        return;
      }

      if (res.ok) {
        router.push(`/courses/${courseId}/learn`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (e) {
      console.error(e);
      alert("ไม่สามารถลงทะเบียนได้ในขณะนี้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleEnroll}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#9F7AEA] px-4 py-4 font-bold text-white shadow-lg transition-all hover:bg-[#805AD5] hover:shadow-xl hover:-translate-y-0.5 mb-4 text-lg"
    >
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
        <>
          ลงทะเบียนเรียน <ArrowRight className="h-5 w-5" />
        </>
      )}
    </button>
  );
}

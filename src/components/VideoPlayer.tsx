"use client";

import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function VideoPlayer({ videoUrl, lessonId }: { videoUrl: string, lessonId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleTimeUpdate = () => {
    if (!videoRef.current || isCompleted) return;
    
    const progress = videoRef.current.currentTime / videoRef.current.duration;
    // มาร์คว่าเรียนจบเมื่อดูไปแล้ว 90%
    if (progress > 0.9) {
      setIsCompleted(true);
      markCompleted();
    }
  };

  const markCompleted = async () => {
    try {
      await fetch('/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, isCompleted: true })
      });
      // Refresh เพื่ออัปเดต sidebar (ในสถานการณ์จริงควรใช้ Zustand หรือ Router refresh)
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 group">
      <video 
        ref={videoRef}
        src={videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} 
        controls 
        controlsList="nodownload"
        className="w-full h-full object-contain bg-black"
        onTimeUpdate={handleTimeUpdate}
      />
      
      {isCompleted && (
        <div className="absolute top-6 right-6 bg-green-500/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl animate-bounce">
          <CheckCircle2 className="h-5 w-5" /> เรียนจบแล้ว
        </div>
      )}
    </div>
  );
}

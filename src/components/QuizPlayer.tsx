"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type Question = {
  question: string;
  options: string[];
};

interface QuizPlayerProps {
  quizId: string;
  lessonId: string;
  questions: Question[];
}

export default function QuizPlayer({ quizId, lessonId, questions }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean; courseCompleted?: boolean; certificateId?: string } | null>(null);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (result) return; // Prevent changing after submission
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      alert("กรุณาตอบคำถามให้ครบทุกข้อก่อนส่ง");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, lessonId }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "ไม่สามารถส่งแบบทดสอบได้");
      }

      setResult(data);
    } catch (error: any) {
      alert(error.message || "เกิดข้อผิดพลาดขณะส่งแบบทดสอบ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <div className="inline-flex items-center rounded-full border border-[#9F7AEA]/30 bg-[#9F7AEA]/10 px-3 py-1 text-sm font-medium text-[#805AD5] mb-4">
          📝 ทดสอบความรู้
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">แบบประเมินผล</h2>
        <p className="text-slate-500 mt-2">ตอบคำถามต่อไปนี้เพื่อให้ผ่านบทเรียน คุณต้องได้คะแนนอย่างน้อย 80%</p>
      </div>

      {result && (
        <div className={`mb-8 p-6 rounded-xl flex items-start gap-4 ${result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {result.passed ? (
            <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
          ) : (
            <XCircle className="h-8 w-8 text-red-600 shrink-0" />
          )}
          <div>
            <h3 className={`font-bold text-lg ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
              {result.passed ? 'สอบผ่าน!' : 'สอบไม่ผ่าน'}
            </h3>
            <p className={`text-base mt-1 ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
              คุณได้คะแนน <strong>{result.score}%</strong> {result.passed ? 'ทำได้ดีมาก! บทเรียนนี้ถือว่าเรียนจบแล้ว' : 'คุณต้องได้คะแนน 80% ขึ้นไป กรุณาทบทวนเนื้อหาและลองใหม่อีกครั้ง'}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-10 mb-10">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="space-y-5">
            <h3 className="font-semibold text-slate-800 text-lg leading-snug">
              <span className="text-[#9F7AEA] mr-2">{qIndex + 1}.</span> 
              {q.question}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, oIndex) => {
                const isSelected = answers[qIndex] === oIndex;
                return (
                  <label 
                    key={oIndex} 
                    onClick={() => handleSelect(qIndex, oIndex)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-[#9F7AEA] bg-[#9F7AEA]/5' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    } ${result ? 'opacity-70 pointer-events-none' : ''}`}
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-[#9F7AEA] bg-[#9F7AEA]' : 'border-slate-300'}`}>
                      {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!result ? (
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || answers.includes(-1)}
          className="w-full flex justify-center items-center h-14 rounded-xl bg-[#9F7AEA] px-8 font-bold text-white shadow-lg transition-all hover:bg-[#805AD5] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
        >
          {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'ส่งคำตอบ'}
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => {
              if (!result.passed) {
                setResult(null);
                setAnswers(new Array(questions.length).fill(-1));
              } else {
                window.location.reload();
              }
            }} 
            className={`w-full flex justify-center items-center h-14 rounded-xl font-bold transition-colors ${result.passed && result.courseCompleted ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-2 border-[#9F7AEA] text-[#805AD5] hover:bg-[#9F7AEA]/5'}`}
          >
            {result.passed ? 'เรียนต่อ / ทบทวนเนื้อหา' : 'ทำแบบทดสอบอีกครั้ง'}
          </button>
          
          {result.passed && result.courseCompleted && result.certificateId && (
            <a 
              href={`/certificate/${result.certificateId}`}
              className="w-full flex justify-center items-center h-14 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 font-black text-white shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-pulse"
            >
              🎉 ยินดีด้วย! รับใบประกาศนียบัตรของคุณ
            </a>
          )}
        </div>
      )}
    </div>
  );
}

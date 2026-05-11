import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Download, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function CertificatePage({ params }: { params: { certificateId: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: params.certificateId },
    include: {
      user: true,
      course: true,
    }
  });

  if (!certificate) {
    notFound();
  }

  // Display current date as issue date since schema doesn't store timestamps
  const issueDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <Link href="/dashboard" className="text-brand hover:underline font-medium text-sm mb-2 block">&larr; กลับไปที่แดชบอร์ด</Link>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="text-green-500 h-6 w-6" /> 
            ได้รับใบประกาศนียบัตรแล้ว!
          </h1>
        </div>
        <button className="flex items-center gap-2 bg-[#9F7AEA] px-6 py-3 rounded-xl text-white font-bold hover:bg-[#805AD5] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
          <Download className="w-5 h-5" />
          ดาวน์โหลดเป็น PDF
        </button>
      </div>

      {/* Formal Document Layout */}
      <div className="relative w-full max-w-5xl aspect-[1.414/1] bg-white shadow-2xl border-[12px] border-double border-slate-200 p-8 md:p-24 flex flex-col items-center text-center overflow-hidden print:shadow-none print:border-none">
        
        {/* Ornate corners */}
        <div className="absolute top-0 left-0 w-40 h-40 border-t-[12px] border-l-[12px] border-[#9F7AEA]/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 border-t-[12px] border-r-[12px] border-[#9F7AEA]/20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 border-b-[12px] border-l-[12px] border-[#9F7AEA]/20"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 border-b-[12px] border-r-[12px] border-[#9F7AEA]/20"></div>

        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-[500px] h-[500px]" />
        </div>

        {/* Certificate Content */}
        <div className="relative z-10 flex flex-col h-full w-full justify-between items-center py-8">
          
          <div className="w-full flex flex-col items-center">
            <div className="text-[#805AD5] font-black text-xl md:text-2xl tracking-[0.4em] uppercase mb-10">
              SkillNova Platform
            </div>

            <div className="font-serif text-4xl md:text-6xl text-slate-800 mb-10">
              ใบรับรองการผ่านการอบรม
            </div>

            <div className="text-slate-500 uppercase tracking-[0.1em] text-sm md:text-base font-medium mb-6">
              ขอมอบใบประกาศเกียรติคุณฉบับนี้เพื่อแสดงว่า
            </div>

            <div className="text-4xl md:text-6xl font-black text-slate-900 mb-10 border-b-2 border-slate-200 pb-6 inline-block px-16">
              {certificate.user.name}
            </div>

            <div className="text-slate-500 uppercase tracking-[0.1em] text-sm md:text-base font-medium mb-6">
              ได้ผ่านการอบรมหลักสูตรอย่างสมบูรณ์
            </div>

            <div className="text-2xl md:text-4xl font-bold text-[#9F7AEA] max-w-4xl leading-tight">
              {certificate.course.title}
            </div>
          </div>

          {/* Signatures & Metadata */}
          <div className="flex justify-between items-end w-full mt-12 pt-8">
            <div className="flex flex-col items-center w-48">
              <div className="border-b border-slate-400 w-full mb-2 h-10 flex items-end justify-center">
                <span className="font-serif text-2xl italic text-slate-800">ทีมผู้เชี่ยวชาญ</span>
              </div>
              <span className="text-xs text-slate-500 tracking-widest">ผู้สอนหลัก</span>
            </div>

            <div className="flex flex-col items-center shrink-0 mx-8">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#9F7AEA]/10 rounded-full scale-150 blur-md"></div>
                <ShieldCheck className="h-16 w-16 text-[#9F7AEA] relative z-10" />
              </div>
              <span className="font-bold text-slate-800 mt-4 text-sm uppercase tracking-wider">เอกสารรับรองความถูกต้อง</span>
            </div>

            <div className="flex flex-col items-center w-48 text-right">
              <div className="border-b border-slate-400 w-full mb-2 h-10 flex items-end justify-end">
                <span className="font-medium text-slate-800 text-lg">{issueDate}</span>
              </div>
              <span className="text-xs text-slate-500 tracking-widest w-full text-right">วันที่ออกเอกสาร</span>
            </div>
          </div>
          
          <div className="absolute bottom-0 text-slate-400 text-xs font-mono w-full text-center tracking-widest opacity-60">
            รหัสใบประกาศนียบัตร: {certificate.id.toUpperCase()}
          </div>

        </div>
      </div>
    </main>
  );
}

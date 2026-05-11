import Link from "next/link";
import { Video, Award, Users, BookOpen } from "lucide-react";

export default function TeachPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 bg-slate-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-[#9F7AEA]/30 blur-3xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            มาร่วมเป็นผู้สอนกับ <span className="text-[#9F7AEA]">SkillNova</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-10">
            แบ่งปันความรู้ สร้างรายได้ และสร้างแรงบันดาลใจให้กับผู้คนนับล้านทั่วโลก ไม่ว่าคุณจะเชี่ยวชาญด้านไหน เรามีแพลตฟอร์มที่พร้อมให้คุณเปล่งประกาย
          </p>
          <Link href="/login" className="flex items-center justify-center h-14 px-8 rounded-xl bg-[#9F7AEA] hover:bg-[#805AD5] text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            เริ่มต้นเป็นผู้สอนวันนี้
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">ทำไมต้องสอนกับเรา?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#9F7AEA]/10 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-[#9F7AEA]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">เข้าถึงนักเรียนทั่วโลก</h3>
              <p className="text-slate-500">สร้างอิมแพคโดยการสอนนักเรียนนับล้านคนที่กำลังค้นหาคอร์สเรียนเพื่อพัฒนาทักษะของตนเอง</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#9F7AEA]/10 flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-[#9F7AEA]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">สร้างแบรนด์ส่วนตัว</h3>
              <p className="text-slate-500">ยกระดับโปรไฟล์ของคุณในฐานะผู้เชี่ยวชาญระดับมืออาชีพ และสร้างฐานผู้ติดตามอย่างยั่งยืน</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#9F7AEA]/10 flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-[#9F7AEA]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">ระบบจัดการที่ครบครัน</h3>
              <p className="text-slate-500">แพลตฟอร์มของเรามีเครื่องมือที่ช่วยให้การสร้างคอร์สและประเมินผลนักเรียนเป็นเรื่องง่าย</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

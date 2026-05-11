import Link from "next/link";
import { Search, Star, PlayCircle, TrendingUp, Users, Award, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        reviews: true,
        _count: {
          select: { enrollments: true, sections: true }
        }
      },
      take: 6,
      orderBy: { id: 'asc' }
    });
    return courses;
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const courses = await getCourses();

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-28 pb-32 lg:pt-36 lg:pb-40 overflow-hidden bg-white">
        {/* Background Gradients & Orbs - Light Modern Theme */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden z-0 bg-gradient-to-b from-indigo-50/50 via-white to-white">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-[#9F7AEA]/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] rounded-full bg-[#805AD5]/15 blur-[100px]" />
          <div className="absolute top-[20%] right-[15%] w-[30%] h-[40%] rounded-full bg-blue-400/10 blur-[120px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center rounded-full border border-[#9F7AEA]/20 bg-white px-4 py-2 text-sm font-bold text-[#805AD5] shadow-sm animate-pulse">
              <Zap className="h-4 w-4 mr-2 text-[#9F7AEA]" />
              แพลตฟอร์มคอร์สเรียนออนไลน์อันดับ 1
            </div>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl xl:text-7xl text-slate-900 leading-[1.1]">
              ยกระดับทักษะของคุณสู่ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9F7AEA] to-[#805AD5]">
                อนาคตที่ไร้ขีดจำกัด
              </span>
            </h1>

            <p className="text-slate-500 md:text-xl leading-relaxed max-w-2xl font-medium">
              เรียนรู้จากผู้เชี่ยวชาญระดับแนวหน้าในอุตสาหกรรม สร้างโปรเจกต์ใช้งานจริง และก้าวสู่ขั้นต่อไปในสายอาชีพของคุณได้อย่างมั่นใจ
            </p>

            {/* Glassmorphism Search */}
            <div className="w-full max-w-2xl flex items-center relative mt-8 p-1.5 rounded-2xl bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl shadow-[#9F7AEA]/5">
              <Search className="absolute left-6 text-slate-400 h-6 w-6" />
              <input 
                type="text" 
                placeholder="คุณอยากเรียนรู้อะไรในวันนี้? (เช่น React, Python, Business...)" 
                className="w-full pl-16 pr-32 py-5 rounded-xl bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-lg font-medium"
              />
              <button className="absolute right-2 px-6 py-4 bg-[#9F7AEA] hover:bg-[#805AD5] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
                ค้นหาเลย
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-slate-600 pt-8 border-t border-slate-200 w-full">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-[#9F7AEA]" />
                <span className="font-bold text-slate-800">100,000+</span> นักเรียน
              </div>
              <div className="flex items-center gap-3">
                <PlayCircle className="h-6 w-6 text-[#9F7AEA]" />
                <span className="font-bold text-slate-800">500+</span> คอร์สเรียน
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-[#9F7AEA]" />
                <span className="font-bold text-slate-800">ใบประกาศฯ</span> ทุกคอร์ส
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="w-full py-24 bg-slate-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <div className="text-[#9F7AEA] font-bold tracking-wider uppercase text-sm mb-2">Popular Courses</div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                คอร์สเรียนยอดฮิต 🔥
              </h2>
            </div>
            <Link href="/courses" className="hidden md:flex items-center gap-2 text-[#9F7AEA] font-bold hover:text-[#805AD5] transition-colors mt-4 md:mt-0">
              ดูคอร์สเรียนทั้งหมด <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? courses.map((course) => {
              // คำนวณเรตติ้ง (จำลอง)
              const rating = 4.8;
              const reviewCount = course.reviews?.length || Math.floor(Math.random() * 100) + 20;
              const studentCount = course._count?.enrollments || Math.floor(Math.random() * 500) + 50;
              
              return (
                <Link 
                  key={course.id} 
                  href={`/courses/${course.id}`}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(159,122,234,0.15)] transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E9D8FD] to-[#D6BCFA]">
                        <PlayCircle className="h-16 w-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {rating}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#9F7AEA] mb-3">
                      <TrendingUp className="h-4 w-4" /> แนะนำสำหรับคุณ
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-[#9F7AEA] transition-colors">
                      {course.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {studentCount}</span>
                      </div>
                      <div className="text-xl font-black text-slate-900">
                        ฿{course.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }) : (
              <div className="col-span-full text-center py-20 text-slate-500">
                ยังไม่มีคอร์สเรียนในระบบ
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-slate-100 text-slate-800 font-bold w-full">
              ดูคอร์สเรียนทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* Why SkillNova Section */}
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
              ทำไมต้องเรียนกับ <span className="text-[#9F7AEA]">SkillNova</span>
            </h2>
            <p className="text-lg text-slate-500">
              เราออกแบบประสบการณ์การเรียนรู้ที่ดีที่สุด เพื่อให้คุณพร้อมสำหรับการทำงานในยุคดิจิทัลอย่างมั่นใจ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#9F7AEA]/30 hover:bg-[#FAF5FF] transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-[#9F7AEA]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">เรียนที่ไหน เมื่อไหร่ก็ได้</h3>
              <p className="text-slate-500 leading-relaxed">
                เข้าถึงเนื้อหาคุณภาพสูงได้ตลอด 24 ชั่วโมง ผ่านทุกอุปกรณ์ เรียนได้ตามจังหวะของคุณเอง ไม่มีวันหมดอายุ
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#9F7AEA]/30 hover:bg-[#FAF5FF] transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-[#9F7AEA]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">รับใบประกาศนียบัตร</h3>
              <p className="text-slate-500 leading-relaxed">
                ทำแบบทดสอบและรับใบประกาศนียบัตรเมื่อเรียนจบ เพื่อนำไปใส่ในเรซูเม่และโปรไฟล์ LinkedIn ของคุณ
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#9F7AEA]/30 hover:bg-[#FAF5FF] transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-[#9F7AEA]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">ชุมชนแห่งการเรียนรู้</h3>
              <p className="text-slate-500 leading-relaxed">
                พบปะ แลกเปลี่ยนความรู้ และสร้างคอนเนคชั่นกับผู้เรียนและผู้สอนที่มีความสนใจเหมือนกับคุณ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#805AD5]/80"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            พร้อมที่จะเปลี่ยนชีวิตคุณแล้วหรือยัง?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            เริ่มต้นเส้นทางการเรียนรู้ของคุณวันนี้ สมัครสมาชิกฟรีเพื่อดูคอร์สเรียนฟรีและเริ่มต้นอัปสกิลของคุณได้ทันที
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="h-14 px-8 flex items-center justify-center rounded-xl bg-[#9F7AEA] text-white font-bold text-lg hover:bg-[#805AD5] hover:scale-105 transition-all shadow-[0_0_20px_rgba(159,122,234,0.4)]">
              สมัครสมาชิกเลย
            </Link>
            <Link href="/courses" className="h-14 px-8 flex items-center justify-center rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20">
              ดูคอร์สเรียนทั้งหมด
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

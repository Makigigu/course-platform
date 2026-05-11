"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Image as ImageIcon, BookOpen, DollarSign, AlignLeft } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาดในการสร้างคอร์ส");

      // Redirect to instructor dashboard (or later to the curriculum builder)
      router.push("/instructor");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Link href="/instructor" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#9F7AEA] transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> กลับสู่แดชบอร์ด
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800">สร้างคอร์สเรียนใหม่</h1>
          <p className="text-slate-500 mt-2">เริ่มต้นแบ่งปันความรู้ของคุณ โดยการกรอกข้อมูลพื้นฐานของคอร์สเรียน</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <BookOpen className="h-4 w-4 text-[#9F7AEA]" /> ชื่อคอร์สเรียน
              </label>
              <input 
                type="text" 
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="เช่น พื้นฐานการเขียนโปรแกรม Python 2024"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:border-[#9F7AEA] focus:ring-2 focus:ring-[#9F7AEA]/20 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <AlignLeft className="h-4 w-4 text-[#9F7AEA]" /> รายละเอียดคอร์ส
              </label>
              <textarea 
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="อธิบายว่าคอร์สนี้เกี่ยวกับอะไร นักเรียนจะได้เรียนรู้อะไรบ้าง..."
                rows={5}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:border-[#9F7AEA] focus:ring-2 focus:ring-[#9F7AEA]/20 transition-all outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <DollarSign className="h-4 w-4 text-[#9F7AEA]" /> ราคา (บาท)
                </label>
                <input 
                  type="number" 
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="เช่น 1500 (ใส่ 0 สำหรับคอร์สฟรี)"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:border-[#9F7AEA] focus:ring-2 focus:ring-[#9F7AEA]/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <ImageIcon className="h-4 w-4 text-[#9F7AEA]" /> URL รูปภาพหน้าปก
                </label>
                <input 
                  type="url" 
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:border-[#9F7AEA] focus:ring-2 focus:ring-[#9F7AEA]/20 transition-all outline-none"
                />
              </div>
            </div>

            {formData.thumbnail && (
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-700 mb-2">ตัวอย่างภาพหน้าปก:</p>
                <div className="aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Invalid+Image+URL';
                    }} 
                  />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
              <Link href="/instructor" className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                ยกเลิก
              </Link>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#9F7AEA] hover:bg-[#805AD5] transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "บันทึกและสร้างคอร์ส"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

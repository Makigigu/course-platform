import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillNova - แพลตฟอร์มคอร์สเรียนออนไลน์",
  description: "แพลตฟอร์มคอร์สเรียนออนไลน์ที่ทันสมัยสำหรับคนวัยทำงานที่ต้องการอัปสกิล",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50 text-slate-800">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // กลับไปหน้าเข้าสู่ระบบและรีเฟรชสถานะ
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg ml-2 shadow-sm"
      title="ออกจากระบบ"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden md:inline">ออกจากระบบ</span>
    </button>
  );
}

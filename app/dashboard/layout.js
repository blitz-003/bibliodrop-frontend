"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  // 1. Keep the shared sidebar visibility state here
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fallback user layout placeholder - connect to your auth state hook
  const user = { name: "Alex Mercer", role: "admin" };

  return (
    /* We remove the extra <Navbar /> tag from here entirely */
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* 2. SIDEBAR MOUNTS SIDE-BY-SIDE WITH APP CONTENT */}
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* 3. WORKSPACE CONTAINER PORTAL */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 w-full">
        {children}
      </main>
    </div>
  );
}

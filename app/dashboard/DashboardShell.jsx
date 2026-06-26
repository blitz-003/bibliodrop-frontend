"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function DashboardShell({ user, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 w-full">
        {children}
      </main>
    </div>
  );
}

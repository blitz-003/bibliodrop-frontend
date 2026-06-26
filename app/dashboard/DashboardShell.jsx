"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function DashboardShell({ user, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50  overflow-hidden">
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto bg-slate-50 w-full p-4 md:p-8 lg:ml-72">
        {children}
      </main>
    </div>
  );
}

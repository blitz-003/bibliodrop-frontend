"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

        <h2 className="text-3xl font-bold text-slate-800">
          Loading Dashboard...
        </h2>

        <p className="text-slate-500 text-lg">
          Please wait while we prepare your workspace
        </p>
      </div>
    );
  }

  const user = session?.user;

  console.log("Session:", session);
  console.log("User:", user);

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

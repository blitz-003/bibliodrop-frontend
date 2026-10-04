"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function DashboardShell({ user, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/*
        `lg:ml-72` is 18rem and the pinned drawer occupies 17rem
        (w-64 + lg:left-4), leaving a 1rem gutter. The drawer itself declares
        the same numbers so the two cannot drift apart.
      */}
      <main className="w-full p-4 md:p-8 lg:ml-72">
        {/*
          The drawer had open/close plumbing but no trigger, so on viewports
          below `lg` it was unreachable — the only way in was to resize the
          window. This is the missing control.
        */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen((open) => !open)}
          aria-expanded={isSidebarOpen}
          aria-controls="dashboard-sidebar"
          className="mb-4 inline-flex items-center gap-2 rounded-control border border-border bg-surface px-3 py-2 text-sm font-medium text-content shadow-card transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
          Menu
        </button>

        {children}
      </main>
    </div>
  );
}

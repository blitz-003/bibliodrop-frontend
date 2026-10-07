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

        Sidebar width is w-64 (16rem). With lg:left-4, content margin lg:ml-20

        aligns cleanly and avoids horizontal overflow.

      */}

      <main className="w-full min-w-0 overflow-x-hidden max-w-full w-full p-2 sm:p-3 md:p-4 lg:ml-20">

        {/*

          The drawer had open/close plumbing but no trigger, so on viewports

          below `lg` it was unreachable 锟?the only way in was to resize the

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





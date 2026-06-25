"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function SidebarLayout({
  title,
  user,
  children,
  closeMobileMenu,
}) {
  return (
    <aside className="w-full h-screen flex flex-col bg-slate-900 border-r border-slate-800 p-6 text-slate-300 font-sans">
      {/* 1. BRAND TITLE HEADER BLOCK (Updated to Bibliodrop) */}
      <div className="border-b border-slate-800/80 pb-5">
        <span className="block text-xs uppercase tracking-widest font-semibold text-blue-500">
          {title}
        </span>
        <h2 className="text-xl font-bold text-white mt-1 font-sans">
          Bibliodrop
        </h2>
      </div>

      {/* 2. IDENTITY PROFILE BOX (Swapped violet to HeroUI primary blue-600) */}
      <div className="mt-5 mb-8 bg-slate-800/50 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-base font-bold select-none shadow-sm shadow-blue-600/20">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate leading-normal">
            {user.name}
          </p>
          <p className="text-xs text-slate-400 capitalize truncate leading-normal">
            {user.role} Account
          </p>
        </div>
      </div>

      {/* 3. ACTIVE LIVE NAVIGATION LINK GRID */}
      <nav className="flex flex-col gap-2 overflow-y-auto pr-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onClick: closeMobileMenu });
          }
          return child;
        })}
      </nav>
    </aside>
  );
}

// SHARED TARGET ACTIVE LINK STYLING UTILITY (Updated to HeroUI primary blue)
export function SidebarLink({ href, icon: Icon, children, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 leading-normal select-none ${
        isActive
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
          : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
      }`}
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}
      />
      <span>{children}</span>
    </a>
  );
}

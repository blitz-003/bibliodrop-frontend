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
    <aside
      className="
    h-full
    bg-slate-900
    border border-slate-800
    rounded-card
    shadow-panel
    flex flex-col
    p-6
    text-slate-300
  "
    >
      {/* 1. BRAND TITLE HEADER BLOCK */}
      <div className="border-b border-slate-800/80 pb-5">
        <span className="block text-xs font-semibold uppercase text-blue-400">
          {title}
        </span>
        <h2 className="mt-1 text-xl font-semibold text-white">Bibliodrop</h2>
      </div>

      {/* 2. IDENTITY PROFILE BOX */}
      <div className="mt-5 mb-8 flex items-center gap-3 rounded-control border border-slate-800 bg-slate-800/50 p-4">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 select-none items-center justify-center rounded-full bg-accent text-base font-semibold text-white shadow-sm"
        >
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-normal text-white">
            {user.name}
          </p>
          <p className="truncate text-xs capitalize leading-normal text-slate-400">
            {user.role} Account
          </p>
        </div>
      </div>

      {/* 3. ACTIVE LIVE NAVIGATION LINK GRID */}
      <nav
        aria-label="Dashboard"
        className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1"
      >
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

// SHARED TARGET ACTIVE LINK STYLING UTILITY
export function SidebarLink({ href, icon: Icon, children, onClick }) {
  const pathname = usePathname();
  // Exact equality only meant no link was ever highlighted when a user was on
  // a nested route such as /dashboard/admin/users. A prefix match fixes that.
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`flex select-none items-center gap-3 rounded-control px-4 py-3 text-sm font-medium leading-normal transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400 ${
        isActive
          ? "bg-accent text-white shadow-card"
          : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400"}`}
      />
      <span>{children}</span>
    </a>
  );
}

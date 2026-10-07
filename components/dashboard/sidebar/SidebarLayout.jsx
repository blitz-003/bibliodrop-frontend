"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function SidebarLayout({
  title,
  user,
  children,
  closeMobileMenu,
}) {
  const pathname = usePathname();

  // The current entry is resolved once, here, rather than independently by each
  // link. Deciding it per link marked every ancestor route as current too, so on
  // /dashboard/admin/users/42 both "Overview" and "Manage Users" carried
  // aria-current="page" and screen readers announced two current pages.
  const hrefs = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child))
    .map((child) => child.props.href)
    .filter(Boolean);

  const activeHref = findActiveHref(pathname, hrefs);

  return (
    <aside
      className="
    h-full
    bg-slate-900
    border border-slate-800
    rounded-card
    shadow-panel
    flex flex-col
    p-4
    text-slate-300
  "
    >
      {/* 1. BRAND TITLE HEADER BLOCK */}
      <div className="border-b border-slate-800/80 pb-4">
        <span className="block text-xs font-semibold uppercase text-blue-400">
          {title}
        </span>
        <h2 className="mt-1 text-xl font-semibold text-white">Bibliodrop</h2>
      </div>

      {/* 2. IDENTITY PROFILE BOX */}
      <div className="mt-3 mb-6 flex items-center gap-2 rounded-control border border-slate-800 bg-slate-800/50 p-3">
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
            return React.cloneElement(child, {
              onClick: closeMobileMenu,
              activeHref,
            });
          }
          return child;
        })}
      </nav>
    </aside>
  );
}

// SHARED TARGET ACTIVE LINK STYLING UTILITY

// `null` is possible outside a routed render, so the predicate stays total.
export function matchesPath(pathname, href) {
  if (!pathname || !href) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Picks the single most specific route the current path sits under.
 *
 * Preferring the longest match is what stops an ancestor entry from also
 * claiming to be current on a nested page.
 */
export function findActiveHref(pathname, hrefs) {
  if (!pathname || !hrefs?.length) return undefined;

  return hrefs.reduce((best, href) => {
    if (!matchesPath(pathname, href)) return best;
    if (best === undefined || href.length > best.length) return href;
    return best;
  }, undefined);
}

export function SidebarLink({
  href,
  icon: Icon,
  children,
  onClick,
  activeHref,
}) {
  // `activeHref` is supplied by `SidebarLayout`, which is the only thing that
  // can see every sibling and so pick one winner. The local fallback keeps the
  // link working if it is ever rendered outside a layout.
  const pathname = usePathname();
  const isActive =
    activeHref !== undefined ? href === activeHref : matchesPath(pathname, href);

  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`flex select-none items-center gap-2 rounded-control px-4 py-3 text-sm font-medium leading-normal transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400 ${
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


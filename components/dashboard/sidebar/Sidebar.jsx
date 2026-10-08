"use client";

import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import UserSidebar from "./UserSidebar";
import LibrarianSidebar from "./LibrarianSidebar";
import AdminSidebar from "./AdminSidebar";

/*
 * Dashboard navigation drawer.
 *
 * Three defects were fixed here:
 *
 * 1. `top-23` is not a Tailwind class (the scale stops at `top-22`/`top-24`),
 *    so the offset silently dropped and the drawer sat under the sticky
 *    navbar. Offsets are now explicit: `top-16` on mobile, where the navbar is
 *    a full-bleed `h-16` bar, and `lg:top-[88px]`, which clears the navbar's
 *    desktop `lg:top-2` pill plus its height.
 *
 * 2. The drawer had no way to be dismissed with the keyboard 锟?no Escape
 *    handler and no close button, so once open the only exit was tapping the
 *    backdrop or navigating.
 *
 * 3. `w-64` at `lg:left-4` is 17rem of horizontal space; the content column
 *    is inset with `lg:pl-72` (18rem) by `DashboardShell`, leaving a 1rem gap.
 *    Any change to the width must be mirrored there.
 */
export default function Sidebar({ user, isOpen, setIsOpen }) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  // Escape closes, and focus moves into the drawer so keyboard users are not
  // left tabbing through the page behind the overlay.
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // The page behind the drawer must not scroll on mobile.
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!user) return null;

  const content = (() => {
    switch (user.role) {
      case "user":
        return <UserSidebar user={user} closeMobileMenu={close} />;
      case "librarian":
        return <LibrarianSidebar user={user} closeMobileMenu={close} />;
      case "admin":
        return <AdminSidebar user={user} closeMobileMenu={close} />;
      default:
        return null;
    }
  })();

  if (!content) return null;

  return (
    <>
      {/* MOBILE DRIFT BACKDROP OVERLAY */}
      {isOpen && (
        <div
          data-testid="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
          onClick={close}
        />
      )}

      {/* FULL HEIGHT DRAW SIDEBAR */}
      <div
        id="dashboard-sidebar"
        ref={panelRef}
        role="dialog"
        aria-modal={isOpen ? true : undefined}
        aria-label="Dashboard navigation"
        className={`fixed bottom-0 left-0 top-16 z-50 w-64 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:top-[88px] lg:bottom-6 lg:left-4 lg:translate-x-0`}
      >
        {/* Explicit close affordance; hidden on desktop where the drawer is
            permanently pinned open and has nothing to dismiss. */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close navigation menu"
          className="absolute right-3 top-3 z-10 rounded-control p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 lg:hidden"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        {content}
      </div>
    </>
  );
}




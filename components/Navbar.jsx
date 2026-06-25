"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getRoleLinks } from "@/lib/navigationData";

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Dynamically pull dashboard links matching this logged-in user's role
  const dashboardLinks = user ? getRoleLinks(user.role) : [];

  async function logout() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full font-sans text-gray-700">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* BRAND LOGO & CORE LINKS */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 tracking-normal hover:text-blue-600 transition-colors"
          >
            Bibliodrop
          </Link>

          {/* Desktop Global Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link
              href="/"
              className={`transition-colors ${pathname === "/" ? "text-blue-600" : "hover:text-blue-600"}`}
            >
              Home
            </Link>
            <Link
              href="/browse-books"
              className={`transition-colors ${pathname === "/browse-books" ? "text-blue-600" : "hover:text-blue-600"}`}
            >
              Browse
            </Link>
          </div>
        </div>

        {/* ACTIONS BLOCK (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/10"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/dashboard/${user.role}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-500" />
                <span>Dashboard</span>
              </Link>
              <span className="text-gray-900 border-l border-gray-200 pl-4 font-semibold">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE UNIFIED HAMBURGER MENU BUTTON */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE UNIFIED EXPANDABLE MENU DRAWER */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-xl max-h-[calc(100vh-64px)] overflow-y-auto px-4 py-5 space-y-6">
          {/* SECTION A: PRIMARY BASE CORE ROUTES */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3">
              Explore
            </span>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Home
            </Link>
            <Link
              href="/browse-books"
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === "/browse-books" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Browse Books
            </Link>
          </div>

          {/* SECTION B: NO OVERLAP RE-ROUTING — SIDEBAR CONTENT INJECTS HERE ON MOBILE */}
          {user && dashboardLinks.length > 0 && (
            <div className="space-y-2 border-t border-gray-100 pt-5">
              <div className="px-3 flex items-center justify-between mb-1">
                <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {user.role} Workspace
                </span>
                <span className="text-xs font-semibold text-gray-800">
                  {user.name}
                </span>
              </div>

              {dashboardLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/10"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* SECTION C: MOBILE SYSTEM ACCOUNT PROFILES LOGICS */}
          <div className="border-t border-gray-100 pt-5">
            {!user ? (
              <div className="grid grid-cols-2 gap-3 px-1">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 transition-colors text-center"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="px-1">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

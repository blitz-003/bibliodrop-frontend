"use client";

import UserSidebar from "./UserSidebar";
import LibrarianSidebar from "./LibrarianSidebar";
import AdminSidebar from "./AdminSidebar";

export default function Sidebar({ user, isOpen, setIsOpen }) {
  if (!user) return null;

  const renderSidebarContent = () => {
    switch (user.role) {
      case "user":
        return (
          <UserSidebar user={user} closeMobileMenu={() => setIsOpen(false)} />
        );
      case "librarian":
        return (
          <LibrarianSidebar
            user={user}
            closeMobileMenu={() => setIsOpen(false)}
          />
        );
      case "admin":
        return (
          <AdminSidebar user={user} closeMobileMenu={() => setIsOpen(false)} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* MOBILE DRIFT BACKDROP OVERLAY */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FULL HEIGHT DRAW SIDEBAR */}
      <div
        className={`
    fixed
    left-0
    top-23
    bottom-6
    w-64
    z-50
    transition-transform duration-300 ease-in-out

    ${isOpen ? "translate-x-4" : "-translate-x-full"}

    lg:left-4
    lg:translate-x-0
  `}
      >
        {renderSidebarContent()}
      </div>
    </>
  );
}

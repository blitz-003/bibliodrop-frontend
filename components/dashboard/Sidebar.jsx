"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Sidebar({ user }) {
  return (
    <aside>
      <h3>{user.name}</h3>

      <p>{user.role}</p>

      {user.role === "user" && (
        <>
          <Link href="/dashboard/user">Overview</Link>

          <Link href="/dashboard/user/history">History</Link>
        </>
      )}

      {user.role === "librarian" && (
        <>
          <Link href="/dashboard/librarian">Overview</Link>

          <Link href="/dashboard/librarian/add-book">Add Book</Link>
        </>
      )}

      {user.role === "admin" && (
        <>
          <Link href="/dashboard/admin">Overview</Link>

          <Link href="/dashboard/admin/users">Users</Link>
        </>
      )}
    </aside>
  );
}

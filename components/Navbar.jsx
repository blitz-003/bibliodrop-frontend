"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/providers/SessionProvider";

export default function Navbar() {
  const { user, loading } = useSession();

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <nav style={{ display: "flex", gap: 10 }}>
      <Link href="/">Home</Link>
      <Link href="/browse-books">Browse</Link>

      {!loading && !user && (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}

      {user && (
        <>
          <Link href="/dashboard/user">Dashboard</Link>
          <span>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

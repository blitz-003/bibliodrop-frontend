"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function NavbarActions({ user }) {
  async function logout() {
    await authClient.signOut();

    window.location.href = "/";
  }

  return (
    <>
      {!user ? (
        <>
          <Link href="/login">Login</Link>

          <Link href="/register">Register</Link>
        </>
      ) : (
        <>
          <Link href="/dashboard">Dashboard</Link>

          <span>{user.name}</span>

          <button onClick={logout}>Logout</button>
        </>
      )}
    </>
  );
}

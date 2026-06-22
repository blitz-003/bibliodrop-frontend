import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SidebarLayout({ title, user, children }) {
  return (
    <aside style={{ width: 250, padding: 20, borderRight: "1px solid #ccc" }}>
      <h3>{title}</h3>
      <p>
        <b>{user.name}</b>
      </p>

      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </nav>
    </aside>
  );
}

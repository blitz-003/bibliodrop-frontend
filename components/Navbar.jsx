"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return <nav>Logo Home Browse Books Login Register Dashboard</nav>;
}

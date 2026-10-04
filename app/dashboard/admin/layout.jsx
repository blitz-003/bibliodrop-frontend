import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Role guard only.
 *
 * This previously rendered its own `display:flex` wrapper and a second
 * `<main>` with hardcoded `padding: 20`, on top of the `<main>` and
 * `p-4 md:p-8` that `app/dashboard/layout.jsx` already supplies via
 * `DashboardShell`. That produced a nested `<main>` landmark (only one is
 * valid per document) and double padding on every admin page.
 */
export default async function AdminLayout({ children }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return children;
}
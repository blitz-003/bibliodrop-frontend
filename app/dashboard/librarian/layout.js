import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Role guard only.
 *
 * See the note in `app/dashboard/admin/layout.jsx`: the inline-styled flex
 * wrapper and second `<main>` this used to render duplicated the shell that
 * `app/dashboard/layout.jsx` already provides, and the hardcoded `padding: 20`
 * stacked on the shell's own `p-4 md:p-8`.
 */
export default async function LibrarianLayout({ children }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "librarian") {
    redirect("/dashboard");
  }

  return children;
}
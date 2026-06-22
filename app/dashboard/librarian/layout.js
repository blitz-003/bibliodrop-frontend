import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export const dynamic = "force-dynamic";

export default async function LibrarianLayout({ children }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "librarian") {
    redirect("/dashboard");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}

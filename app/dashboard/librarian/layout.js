import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
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

import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
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

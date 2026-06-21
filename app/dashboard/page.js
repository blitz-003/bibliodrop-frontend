import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/getServerSession";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "user") {
    redirect("/dashboard/user");
  }

  if (role === "librarian") {
    redirect("/dashboard/librarian");
  }

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  redirect("/");
}

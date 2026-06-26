import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/getServerSession";
import DashboardShell from "./DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}

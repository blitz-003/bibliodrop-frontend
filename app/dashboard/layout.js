import { getServerSession } from "@/lib/getServerSession";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function DashboardLayout({ children }) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div style={{ display: "flex" }}>
      {" "}
      <Sidebar user={session.user} />{" "}
      <main style={{ flex: 1 }}>{children}</main>{" "}
    </div>
  );
}

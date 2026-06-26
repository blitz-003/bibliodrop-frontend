import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "user") {
    redirect("/dashboard");
  }

  return children;
}

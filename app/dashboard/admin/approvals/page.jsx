import { getServerSession } from "@/lib/getServerSession"; // Adjust path to your file
import { redirect } from "next/navigation";
import ApprovalsClient from "./ApprovalsClient";

export default async function ApprovalsPage() {
  const session = await getServerSession();

  // 1. Authentication Guard
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Authorization Guard (Must be Admin)
  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  // 3. User passes guards, render the Client dashboard
  return <ApprovalsClient token={session.accessToken || ""} />;
}

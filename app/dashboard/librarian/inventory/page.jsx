import { getServerSession } from "@/lib/getServerSession";
import InventoryClient from "./InventoryClient";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const session = await getServerSession();

  // 1. Kick out unauthenticated users
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Kick out users who aren't librarians
  if (session.user.role !== "librarian") {
    redirect("/dashboard"); // Or back to a safe dashboard
  }

  // Debugging: This will now print nicely in your terminal (server side)
  console.log("Logged in user role:", session.user.role);

  // 3. Render the client component since they passed both checks
  return <InventoryClient user={session.user} />;
}

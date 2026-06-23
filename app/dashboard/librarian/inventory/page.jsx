import { getServerSession } from "@/lib/getServerSession";
import InventoryClient from "./InventoryClient";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <InventoryClient user={session.user} />;
}

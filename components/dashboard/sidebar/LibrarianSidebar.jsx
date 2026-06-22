import Link from "next/link";
import SidebarLayout from "./SidebarLayout";

export default function LibrarianSidebar({ user }) {
  return (
    <SidebarLayout title="Librarian Dashboard" user={user}>
      <Link href="/dashboard/librarian">Overview</Link>
      <Link href="/dashboard/librarian/add-book">Add Book</Link>
      <Link href="/dashboard/librarian/inventory">Inventory</Link>
      <Link href="/dashboard/librarian/deliveries">Deliveries</Link>
    </SidebarLayout>
  );
}

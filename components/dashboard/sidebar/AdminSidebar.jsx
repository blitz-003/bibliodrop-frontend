import Link from "next/link";
import SidebarLayout from "./SidebarLayout";

export default function AdminSidebar({ user }) {
  return (
    <SidebarLayout title="Admin Dashboard" user={user}>
      <Link href="/dashboard/admin">Overview</Link>
      <Link href="/dashboard/admin/users">Manage Users</Link>
      <Link href="/dashboard/admin/books">Manage Books</Link>
      <Link href="/dashboard/admin/approvals">Manage Approval for Books</Link>
      <Link href="/dashboard/admin/transactions">Transactions</Link>
    </SidebarLayout>
  );
}

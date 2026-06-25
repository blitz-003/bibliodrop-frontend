import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckSquare,
  Receipt,
} from "lucide-react";
import SidebarLayout, { SidebarLink } from "./SidebarLayout";

export default function AdminSidebar({ user, closeMobileMenu }) {
  return (
    <SidebarLayout
      title="Admin Dashboard"
      user={user}
      closeMobileMenu={closeMobileMenu}
    >
      <SidebarLink href="/dashboard/admin" icon={LayoutDashboard}>
        Overview
      </SidebarLink>
      <SidebarLink href="/dashboard/admin/users" icon={Users}>
        Manage Users
      </SidebarLink>
      <SidebarLink href="/dashboard/admin/books" icon={BookOpen}>
        Manage Books
      </SidebarLink>
      <SidebarLink href="/dashboard/admin/approvals" icon={CheckSquare}>
        Book Approvals
      </SidebarLink>
      <SidebarLink href="/dashboard/admin/transactions" icon={Receipt}>
        Transactions
      </SidebarLink>
    </SidebarLayout>
  );
}

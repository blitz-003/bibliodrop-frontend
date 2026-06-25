import { LayoutDashboard, FilePlus, Boxes, Truck } from "lucide-react";
import SidebarLayout, { SidebarLink } from "./SidebarLayout";

export default function LibrarianSidebar({ user, closeMobileMenu }) {
  return (
    <SidebarLayout
      title="Librarian Dashboard"
      user={user}
      closeMobileMenu={closeMobileMenu}
    >
      <SidebarLink href="/dashboard/librarian" icon={LayoutDashboard}>
        Overview
      </SidebarLink>
      <SidebarLink href="/dashboard/librarian/add-book" icon={FilePlus}>
        Add Book
      </SidebarLink>
      <SidebarLink href="/dashboard/librarian/inventory" icon={Boxes}>
        Manage Inventory
      </SidebarLink>
      <SidebarLink href="/dashboard/librarian/deliveries" icon={Truck}>
        Manage Delivery
      </SidebarLink>
    </SidebarLayout>
  );
}

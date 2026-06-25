import {
  LayoutDashboard,
  Truck,
  BookMarked,
  MessageSquare,
} from "lucide-react";
import SidebarLayout, { SidebarLink } from "./SidebarLayout";

export default function UserSidebar({ user, closeMobileMenu }) {
  return (
    <SidebarLayout
      title="User Dashboard"
      user={user}
      closeMobileMenu={closeMobileMenu}
    >
      <SidebarLink href="/dashboard/user" icon={LayoutDashboard}>
        Overview
      </SidebarLink>
      <SidebarLink href="/dashboard/user/deliveries" icon={Truck}>
        Deliveries
      </SidebarLink>
      <SidebarLink href="/dashboard/user/reading-list" icon={BookMarked}>
        Reading List
      </SidebarLink>
      <SidebarLink href="/dashboard/user/reviews" icon={MessageSquare}>
        Reviews
      </SidebarLink>
    </SidebarLayout>
  );
}

import { getRoleLinks, getRoleTitle } from "@/lib/navigationData";
import SidebarLayout, { SidebarLink } from "./SidebarLayout";

export default function AdminSidebar({ user, closeMobileMenu }) {
  return (
    <SidebarLayout
      title={getRoleTitle("admin")}
      user={user}
      closeMobileMenu={closeMobileMenu}
    >
      {getRoleLinks("admin").map(({ label, href, icon }) => (
        <SidebarLink key={href} href={href} icon={icon}>
          {label}
        </SidebarLink>
      ))}
    </SidebarLayout>
  );
}

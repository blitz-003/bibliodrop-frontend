import { getRoleLinks, getRoleTitle } from "@/lib/navigationData";
import SidebarLayout, { SidebarLink } from "./SidebarLayout";

export default function UserSidebar({ user, closeMobileMenu }) {
  return (
    <SidebarLayout
      title={getRoleTitle("user")}
      user={user}
      closeMobileMenu={closeMobileMenu}
    >
      {getRoleLinks("user").map(({ label, href, icon }) => (
        <SidebarLink key={href} href={href} icon={icon}>
          {label}
        </SidebarLink>
      ))}
    </SidebarLayout>
  );
}

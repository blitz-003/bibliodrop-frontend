import { getRoleLinks, getRoleTitle } from "@/lib/navigationData";
import SidebarLayout, { SidebarLink } from "./SidebarLayout";

export default function LibrarianSidebar({ user, closeMobileMenu }) {
  return (
    <SidebarLayout
      title={getRoleTitle("librarian")}
      user={user}
      closeMobileMenu={closeMobileMenu}
    >
      {getRoleLinks("librarian").map(({ label, href, icon }) => (
        <SidebarLink key={href} href={href} icon={icon}>
          {label}
        </SidebarLink>
      ))}
    </SidebarLayout>
  );
}

import UserSidebar from "./UserSidebar";
import LibrarianSidebar from "./LibrarianSidebar";
import AdminSidebar from "./AdminSidebar";

export default function Sidebar({ user }) {
  if (user.role === "user") return <UserSidebar user={user} />;

  if (user.role === "librarian") return <LibrarianSidebar user={user} />;

  if (user.role === "admin") return <AdminSidebar user={user} />;

  return null;
}

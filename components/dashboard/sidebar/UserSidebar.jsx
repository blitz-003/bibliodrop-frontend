import Link from "next/link";
import SidebarLayout from "./SidebarLayout";

export default function UserSidebar({ user }) {
  return (
    <SidebarLayout title="User Dashboard" user={user}>
      <Link href="/dashboard/user">Overview</Link>
      <Link href="/dashboard/user/deliveries">Deliveries</Link>
      <Link href="/dashboard/user/reading-list">Reading List</Link>
      <Link href="/dashboard/user/reviews">Reviews</Link>
    </SidebarLayout>
  );
}

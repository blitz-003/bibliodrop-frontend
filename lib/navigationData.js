import { LayoutDashboard, Truck, BookMarked, MessageSquare, FilePlus, Boxes, Users, BookOpen, CheckSquare, Receipt } from "lucide-react";

export function getRoleLinks(role) {
  const routes = {
    user: [
      { label: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
      { label: "Deliveries", href: "/dashboard/user/deliveries", icon: Truck },
      { label: "Reading List", href: "/dashboard/user/reading-list", icon: BookMarked },
      { label: "Reviews", href: "/dashboard/user/reviews", icon: MessageSquare },
    ],
    librarian: [
      { label: "Overview", href: "/dashboard/librarian", icon: LayoutDashboard },
      { label: "Add Book", href: "/dashboard/librarian/add-book", icon: FilePlus },
      { label: "Manage Inventory", href: "/dashboard/librarian/inventory", icon: Boxes },
      { label: "Manage Delivery", href: "/dashboard/librarian/deliveries", icon: Truck },
    ],
    admin: [
      { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
      { label: "Manage Books", href: "/dashboard/admin/books", icon: BookOpen },
      { label: "Book Approvals", href: "/dashboard/admin/approvals", icon: CheckSquare },
      { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    ]
  };

  return routes[role] || [];
}
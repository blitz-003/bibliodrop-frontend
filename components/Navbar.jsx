import Link from "next/link";
import NavbarActions from "./NavbarActions";

export default function Navbar({ user }) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 20,
        padding: 20,
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link href="/">Home</Link>

      <Link href="/browse-books">Browse</Link>

      <NavbarActions user={user} />
    </nav>
  );
}

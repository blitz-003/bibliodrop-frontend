"use client";

import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>{book.category}</p>
      <p>${book.fee}</p>

      {/* NEW: navigate to details page */}
      <Link href={`/books/${book.id}`}>View Details</Link>
    </div>
  );
}

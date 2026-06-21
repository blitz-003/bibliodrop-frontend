"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/services/bookService";
import { useParams } from "next/navigation";

export default function BookDetailsPage() {
  const params = useParams();
  const id = params.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
  });

  if (isLoading) return <p>Loading book...</p>;
  if (isError) return <p>Error loading book</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{data.title}</h1>

      <p>
        <b>Author:</b> {data.author}
      </p>
      <p>
        <b>Category:</b> {data.category}
      </p>
      <p>
        <b>Fee:</b> ${data.fee}
      </p>

      <p>
        <b>Description:</b> {data.description}
      </p>

      <p>Status: {data.available ? "Available" : "Checked Out"}</p>

      {/* placeholder for future feature */}
      <button disabled={!data.available}>
        Request Delivery (Stripe later)
      </button>
    </div>
  );
}

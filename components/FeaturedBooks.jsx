"use client";

import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/services/bookService";
import BookCard from "./BookCard";

export default function FeaturedBooks() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featuredBooks"],
    queryFn: () => getBooks(),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading books</p>;

  return (
    <section>
      <h2>Featured Books</h2>

      <div>
        {data.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

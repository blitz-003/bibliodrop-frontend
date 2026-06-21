"use client";

import { useQuery } from "@tanstack/react-query";
import { getTopLibrarians } from "@/services/bookService";
import LibrarianCard from "./LibrarianCard";

export default function TopLibrarians() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["topLibrarians"],
    queryFn: getTopLibrarians,
  });

  if (isLoading) return <p>Loading librarians...</p>;
  if (isError) return <p>Error loading librarians</p>;

  return (
    <section>
      <h2>Top Librarians</h2>

      <div>
        {data.map((lib) => (
          <LibrarianCard key={lib.id} librarian={lib} />
        ))}
      </div>
    </section>
  );
}

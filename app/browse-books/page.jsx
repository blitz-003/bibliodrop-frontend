"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/services/bookService";
import BookCard from "@/components/BookCard";

export default function BrowseBooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read from URL
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // React Query (sync with URL)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", search, category],
    queryFn: () => getBooks({ search, category }),
  });

  // update URL helper
  function updateURL(key, value) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/browse-books?${params.toString()}`);
  }

  return (
    <div>
      <h1>Browse Books</h1>

      {/* FILTERS (NOW URL DRIVEN) */}
      <div style={{ marginBottom: "20px" }}>
        {/* SEARCH */}
        <input
          placeholder="Search books..."
          value={search}
          onChange={(e) => updateURL("search", e.target.value)}
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => updateURL("category", e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Programming">Programming</option>
          <option value="Self Help">Self Help</option>
          <option value="Fantasy">Fantasy</option>
        </select>
      </div>

      {/* LOADING */}
      {isLoading && <p>Loading books...</p>}

      {/* ERROR */}
      {isError && <p>Error loading books</p>}

      {/* DATA */}
      <div>
        {data?.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

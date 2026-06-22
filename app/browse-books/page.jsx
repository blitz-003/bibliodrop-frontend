"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/services/bookService";
import BookCard from "@/components/BookCard";

export default function BrowseBooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // local input only (NO syncing effect anymore)
  const [searchInput, setSearchInput] = useState(search);

  // debounce → update URL
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchInput) {
        params.set("search", searchInput);
      } else {
        params.delete("search");
      }

      router.push(`/browse-books?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // React Query (URL is source of truth)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", search, category],
    queryFn: () => getBooks({ search, category }),
  });

  function updateURL(key, value) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/browse-books?${params.toString()}`);
  }
  const categories = Array.from(
    new Set(data?.map((book) => book.category).filter(Boolean)),
  );
  return (
    <div>
      <h1>Browse Books</h1>

      <div style={{ marginBottom: "20px" }}>
        {/* SEARCH */}
        <input
          placeholder="Search books..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => updateURL("category", e.target.value)}
        >
          <option value="">All Categories</option>

          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Loading books...</p>}
      {isError && <p>Error loading books</p>}

      <div>
        {data?.map((book) => (
          <BookCard key={book._id || book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

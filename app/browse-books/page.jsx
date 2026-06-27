"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/services/bookService";
import BookCard from "@/components/BookCard";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
} from "lucide-react";

// Easily adjust backend pagination item threshold defaults globally right here
const ITEMS_PER_PAGE = 8;

export default function BrowseBooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Local state handling search field input
  const [searchInput, setSearchInput] = useState(search);

  // Sync debounce layout tracking to router URL string paths
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) {
        params.set("search", searchInput);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // Reset pagination window on new search
      router.push(`/browse-books?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Hook query source matching backend pagination schema
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", search, category, page],
    queryFn: () => getBooks({ search, category, page, limit: ITEMS_PER_PAGE }),
  });

  // SAFE PAYLOAD ENGINE PARSING: Fallback to array if API returns raw array data instead of object
  const booksList = Array.isArray(data) ? data : data?.books || [];
  const totalBooks = data?.totalCount || booksList.length;
  const globalCategories =
    data?.allCategories ||
    Array.from(new Set(booksList.map((b) => b.category).filter(Boolean)));
  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE) || 1;

  function updateURL(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/browse-books?${params.toString()}`);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/browse-books?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800  py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* HEADER SECTION (Light Theme Layout) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              Browse Books
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Explore our unified catalog, ecosystem records, and reading
              queues.
            </p>
          </div>

          {/* COLORFUL GRADIENT TOTAL BADGE */}
          <div className="inline-flex items-center gap-2 self-start md:self-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-4 py-2 rounded-xl text-base font-semibold text-blue-600 shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>{totalBooks} Books Available</span>
          </div>
        </div>

        {/* CONTROLS SEARCH & FILTERS CONTROLS BAR */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          {/* SEARCH INPUT */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white text-base placeholder-gray-400 text-gray-800 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* CATEGORY FILTER */}
          <div className="relative w-full sm:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => updateURL("category", e.target.value)}
              className="w-full bg-white text-base text-gray-700 pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none cursor-pointer transition-all"
            >
              <option value="">All Categories</option>
              {globalCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0" />
          </div>
        </div>

        {/* LOADING & ERROR GRAPHICS */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-base text-gray-500 font-medium">
              Syncing library collections...
            </p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-xl text-center max-w-md mx-auto">
            <p className="text-base font-semibold">
              Failed to load system book catalog stream.
            </p>
          </div>
        )}

        {/* RESPONSIVE CARDS GRID CONTAINER */}
        {!isLoading && !isError && (
          <>
            {booksList.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl shadow-sm">
                <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-lg text-gray-500 font-medium">
                  No results matched your parameters.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try modifying your search query filters.
                </p>
              </div>
            ) : (
              /* RESPONSIVE LAYOUT CONFIG: 1 column on Mobile, 2 columns on Tablet, 4 columns on Large Screens */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {booksList.map((book) => (
                  <BookCard key={book._id || book.id} book={book} />
                ))}
              </div>
            )}

            {/* LIGHT INTERACTIVE PAGINATION PANEL */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-12 border-t border-gray-200">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 shadow-sm hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 font-semibold text-base px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-900">Page {page}</span>
                  <span className="text-gray-400 font-normal">/</span>
                  <span className="text-gray-500">{totalPages}</span>
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 shadow-sm hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

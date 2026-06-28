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
  SlidersHorizontal,
  X,
  ArrowUpDown,
  DollarSign,
} from "lucide-react";
import { Spinner } from "@heroui/react";

const ITEMS_PER_PAGE = 8;

export default function BrowseBooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Route URL parameter extraction
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const minDeliveryFee = searchParams.get("minDeliveryFee") || "";
  const maxDeliveryFee = searchParams.get("maxDeliveryFee") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Local state controls
  const [searchInput, setSearchInput] = useState(search);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Sync debounce search query to router paths
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) {
        params.set("search", searchInput);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`/browse-books?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // React Query fetching data stream hooks
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "books",
      search,
      category,
      sort,
      minDeliveryFee,
      maxDeliveryFee,
      page,
    ],
    queryFn: () =>
      getBooks({
        search,
        category,
        sort,
        minDeliveryFee,
        maxDeliveryFee,
        page,
        limit: ITEMS_PER_PAGE,
      }),
  });

  const booksList = Array.isArray(data) ? data : data?.books || [];
  const totalBooks = data?.totalCount || booksList.length;
  const globalCategories =
    data?.allCategories ||
    Array.from(new Set(booksList.map((b) => b.category).filter(Boolean)));
  const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE) || 1;

  // Single parameter updating routing wrapper engine
  function updateURL(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/browse-books?${params.toString()}`);
  }

  // Dual parameter update workflow specialized for delivery fee ranges
  function updateDeliveryFees(min, max) {
    const params = new URLSearchParams(searchParams.toString());

    if (min !== "" && min !== undefined) params.set("minDeliveryFee", min);
    else params.delete("minDeliveryFee");

    if (max !== "" && max !== undefined) params.set("maxDeliveryFee", max);
    else params.delete("maxDeliveryFee");

    params.set("page", "1");
    router.push(`/browse-books?${params.toString()}`);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/browse-books?${params.toString()}`);
  }

  function handleClearAll() {
    setSearchInput("");
    router.push("/browse-books"); // Navigates cleanly back to pristine defaults
  }

  // Boolean helper to display clear button when filters are active
  const hasActiveFilters = !!(
    search ||
    category ||
    minDeliveryFee ||
    maxDeliveryFee ||
    sort !== "newest"
  );

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl tracking-tight">
              Browse Books
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Explore our unified catalog, ecosystem records, and reading
              queues.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start md:self-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-4 py-2 rounded-xl text-base font-semibold text-blue-600 shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>{totalBooks} Books Available</span>
          </div>
        </div>

        {/* PRIMARY FILTERS BAR CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* SEARCH BAR INPUT */}
            <div className="relative w-full lg:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title, author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-base placeholder-gray-400 text-gray-800 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* ACTION ELEMENTS CONTAINER */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto items-center">
              {/* SORT BY DROPDOWN PANEL DESIGN */}
              <div className="relative w-full sm:w-60">
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => updateURL("sort", e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 text-base font-medium text-gray-700 pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0" />
              </div>

              {/* COLLAPSIBLE TOGGLE FILTER BUTTON */}
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-base border transition-all w-full sm:w-auto whitespace-nowrap shadow-sm ${
                  showFiltersPanel ||
                  category ||
                  minDeliveryFee ||
                  maxDeliveryFee
                    ? "bg-blue-50 text-blue-600 border-blue-200 ring-2 ring-blue-100"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {(category || minDeliveryFee || maxDeliveryFee) && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-blue-600" />
                )}
              </button>

              {/* CLEAR ALL BUTTON */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-medium text-base text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-100 transition-all w-full sm:w-auto"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* HIDDEN / EXPANDABLE FILTER SUBSYSTEM SECTION */}
          {showFiltersPanel && (
            <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-xl border border-gray-100">
                {/* CATEGORY DROPDOWN BOX */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-gray-400" /> Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => updateURL("category", e.target.value)}
                      className="w-full bg-white text-base text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-sm transition-all"
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

                {/* MIN DELIVERY FEE INPUT */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" /> Min
                    Delivery Fee
                  </label>
                  <input
                    type="number"
                    placeholder="Min fee (e.g. 0)"
                    min="0"
                    value={minDeliveryFee}
                    onChange={(e) =>
                      updateDeliveryFees(e.target.value, maxDeliveryFee)
                    }
                    className="w-full bg-white text-base px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                  />
                </div>

                {/* MAX DELIVERY FEE INPUT */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" /> Max
                    Delivery Fee
                  </label>
                  <input
                    type="number"
                    placeholder="Max fee (e.g. 15)"
                    min="0"
                    value={maxDeliveryFee}
                    onChange={(e) =>
                      updateDeliveryFees(minDeliveryFee, e.target.value)
                    }
                    className="w-full bg-white text-base px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LOADING & ERROR LAYOUT PANELS */}
        {isLoading && (
          <div className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <Spinner
                size="lg"
                color="primary"
                className="scale-150 md:scale-[1.8]"
              />

              <div>
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  Loading...
                </h1>
                <p className="mt-2 text-sm text-default-500 sm:text-base">
                  Please wait while we prepare everything for you.
                </p>
              </div>
            </div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-xl text-center max-w-md mx-auto">
            <p className="text-base font-semibold">
              Failed to load system book catalog stream.
            </p>
          </div>
        )}

        {/* CARDS RENDERING GRID ZONE */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {booksList.map((book) => (
                  <BookCard key={book._id || book.id} book={book} />
                ))}
              </div>
            )}

            {/* INTERACTIVE PAGINATION GRID */}
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

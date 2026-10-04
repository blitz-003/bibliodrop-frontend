"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/services/bookService";
import BookCard from "@/components/BookCard";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  PageHeader,
  Panel,
  Input,
  Select,
  EmptyState,
  LoadingScreen,
} from "@/components/ui";

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

  // Sync debounce search query to router paths.
  //
  // `search` (the URL value) is in the dependency list, and the handler bails
  // when the input already matches it. That guard is what makes the effect
  // safe to re-run on URL change: without it, navigating to page 2 would change
  // `searchParams`, retrigger this effect, and immediately push back to page 1,
  // so pagination would never advance.
  useEffect(() => {
    if (searchInput === search) return;

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
  }, [searchInput, search, router, searchParams]);

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

  const hasFeeOrCategory = Boolean(
    category || minDeliveryFee || maxDeliveryFee,
  );

  // Boolean helper to display clear button when filters are active
  const hasActiveFilters = !!(
    search ||
    category ||
    minDeliveryFee ||
    maxDeliveryFee ||
    sort !== "newest"
  );

  return (
    <div className="min-h-screen overflow-hidden bg-page px-4 py-12 text-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-app space-y-8">
        {/* HEADER SECTION */}
        <PageHeader
          title="Browse Books"
          subtitle="Explore our unified catalog, ecosystem records, and reading queues."
          action={
            <Badge tone="info" className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-base">
              <BookOpen aria-hidden="true" className="h-5 w-5" />
              <span>{totalBooks} Books Available</span>
            </Badge>
          }
        />

        {/* PRIMARY FILTERS BAR CONTROLS */}
        <Panel className="space-y-4 p-4">
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            {/* SEARCH BAR INPUT */}
            <div className="relative w-full lg:flex-1">
              <label htmlFor="book-search" className="sr-only">
                Search books by title or author
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-content-subtle"
              />
              <input
                id="book-search"
                type="text"
                placeholder="Search books by title, author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-control border border-border bg-surface-subtle pl-12 pr-4 py-3 text-base text-content transition-colors placeholder:text-content-subtle hover:bg-surface focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {/* ACTION ELEMENTS CONTAINER */}
            <div className="flex w-full flex-wrap items-center gap-3 sm:flex-nowrap lg:w-auto">
              {/* SORT BY DROPDOWN PANEL DESIGN */}
              <div className="relative w-full sm:w-60">
                <label htmlFor="book-sort" className="sr-only">
                  Sort books
                </label>
                <ArrowUpDown
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-content-subtle"
                />
                <select
                  id="book-sort"
                  value={sort}
                  onChange={(e) => updateURL("sort", e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-control border border-border bg-surface-subtle py-3 pl-12 pr-10 text-base font-medium text-content transition-colors hover:bg-surface focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 h-0 w-0 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-content-muted" />
              </div>

              {/* COLLAPSIBLE TOGGLE FILTER BUTTON */}
              <Button
                variant={showFiltersPanel || hasFeeOrCategory ? "primary" : "secondary"}
                className="w-full whitespace-nowrap sm:w-auto"
                aria-expanded={showFiltersPanel}
                aria-controls="book-filters-panel"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              >
                <SlidersHorizontal aria-hidden="true" className="h-5 w-5" />
                <span>Filters</span>
                {(category || minDeliveryFee || maxDeliveryFee) && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-current" />
                )}
              </Button>

              {/* CLEAR ALL BUTTON */}
              {hasActiveFilters && (
                <Button
                  variant="danger"
                  className="w-full bg-danger-subtle sm:w-auto"
                  onClick={handleClearAll}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>

          {/* HIDDEN / EXPANDABLE FILTER SUBSYSTEM SECTION */}
          {showFiltersPanel && (
            <div
              id="book-filters-panel"
              className="animate-in fade-in slide-in-from-top-2 border-t border-border-subtle pt-4 duration-200"
            >
              <div className="grid grid-cols-1 gap-6 rounded-control border border-border-subtle bg-surface-subtle p-5 md:grid-cols-3">
                {/* CATEGORY DROPDOWN BOX */}
                <Select
                  label="Category"
                  id="book-category"
                  value={category}
                  onChange={(e) => updateURL("category", e.target.value)}
                >
                  <option value="">All Categories</option>
                  {globalCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>

                {/* MIN / MAX DELIVERY FEE INPUTS */}
                <Input
                  type="number"
                  label="Min Delivery Fee"
                  id="book-min-fee"
                  min="0"
                  placeholder="Min fee (e.g. 0)"
                  value={minDeliveryFee}
                  onChange={(e) =>
                    updateDeliveryFees(e.target.value, maxDeliveryFee)
                  }
                />
                <Input
                  type="number"
                  label="Max Delivery Fee"
                  id="book-max-fee"
                  min="0"
                  placeholder="Max fee (e.g. 15)"
                  value={maxDeliveryFee}
                  onChange={(e) =>
                    updateDeliveryFees(minDeliveryFee, e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </Panel>

        {/* LOADING & ERROR LAYOUT PANELS */}
        {isLoading && <LoadingScreen title="Loading books" />}

        {isError && (
          <Alert tone="danger" className="mx-auto max-w-md">
            <p className="text-base font-semibold">
              Failed to load system book catalog stream.
            </p>
          </Alert>
        )}

        {/* CARDS RENDERING GRID ZONE */}
        {!isLoading && !isError && (
          <>
            {booksList.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No results matched your parameters."
                description="Try modifying your search query filters."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                {booksList.map((book) => (
                  <BookCard key={book._id || book.id} book={book} />
                ))}
              </div>
            )}

            {/* INTERACTIVE PAGINATION GRID */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-center gap-2 border-t border-border pt-12"
              >
                <Button
                  variant="secondary"
                  size="md"
                  className="p-2.5"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                </Button>

                <p
                  aria-current="page"
                  className="flex items-center gap-1.5 rounded-control border border-border bg-surface px-4 py-2 text-base font-semibold shadow-panel"
                >
                  <span className="text-content-strong">Page {page}</span>
                  <span className="font-normal text-content-subtle" aria-hidden="true">
                    /
                  </span>
                  <span className="text-content-muted">{totalPages}</span>
                </p>

                <Button
                  variant="secondary"
                  size="md"
                  className="p-2.5"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight aria-hidden="true" className="h-5 w-5" />
                </Button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

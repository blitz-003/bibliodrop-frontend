"use client";

import { useQuery } from "@tanstack/react-query";

export default function UserReadingListPage() {
  // Fetch reading list directory data via TanStack Query
  const {
    data: readingList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-reading-list"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/reading-list`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok)
          throw new Error("Could not parse digital catalog archives.");
        return res.json();
      }),
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-6 text-red-500 font-medium">
        Error loading your personal reading list index.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Profile Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-normal">
          My Reading List
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your curated collection of successfully acquired and delivered
          literature volumes.
        </p>
      </div>

      {/* Fluid Responsive Responsive Grid Matrix Layout */}
      {readingList?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {readingList.map((book) => (
            <div
              key={book.deliveryId}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              {/* Card Header Top: Small Compressed Aspect-ratio Media Box Container */}
              <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden border-b border-gray-50">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400";
                  }}
                />

                {/* Micro Meta Delivery Log Badge */}
                <div className="absolute top-3 right-3 bg-green-500/90 text-white backdrop-blur-md font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  Arrived
                </div>
              </div>

              {/* Card Footer Body Workspace Wrapper Context */}
              <div className="p-4 flex flex-col flex-grow space-y-2.5">
                {/* Meta Category Micro Pill Component */}
                <div>
                  <span className="inline-block bg-indigo-50 text-indigo-600 border border-indigo-100 font-semibold text-[11px] px-2 py-0.5 rounded-md capitalize">
                    {book.category}
                  </span>
                </div>

                {/* Primary Narrative Text Strings block wrapper */}
                <div className="space-y-0.5 flex-grow">
                  <h3
                    className="text-sm font-bold text-gray-900 group-hover:text-[#635BFF] transition-colors line-clamp-1 leading-tight tracking-normal"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    by {book.author}
                  </p>
                </div>

                {/* Secondary Rich Block Text Description Paragraph Component */}
                <p className="text-xs text-gray-400 font-normal line-clamp-2 leading-relaxed flex-grow">
                  {book.description}
                </p>

                {/* Bottom Border Action Timeline Tracker Timestamp Component Indicator */}
                <div className="pt-2.5 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                  <span>Delivered On</span>
                  <span className="font-mono text-gray-500">
                    {new Date(book.deliveredAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Display Component Frame Layout Setup */
        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto mt-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900 tracking-normal">
            Your reading library is empty
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            Books will automatically securely materialize on this dashboard
            index here once they are dispatched and dropped off at your address.
          </p>
        </div>
      )}
    </div>
  );
}

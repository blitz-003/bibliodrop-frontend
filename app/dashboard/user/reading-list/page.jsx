"use client";

import { BookMarked } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Badge,
  PageHeader,
  Panel,
  EmptyState,
  DashboardSkeleton,
} from "@/components/ui";

export default function UserReadingListPage() {
  // Fetch reading list directory data via TanStack Query

  const {
    data: readingList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-reading-list"],
    queryFn: async () => {
      const { data, error } = await authClient.token();

      if (error || !data) {
        throw new Error("Authentication token missing.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/reading-list`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Could not load your reading list.");
      }

      return res.json();
    },
  });

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Could not load your reading list.
          </p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="My Reading List"
        subtitle="Your curated collection of successfully acquired and delivered literature volumes."
      />

      {readingList?.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 [&>*]:min-w-0">
          {readingList.map((book) => (
            <Panel
              key={book.deliveryId}
              className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-panel"
            >
              {/* Card Header Top: Small Compressed Aspect-ratio Media Box Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border-subtle bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Micro Meta Delivery Log Badge */}
                <div className="absolute right-3 top-3">
                  <Badge
                    tone="success"
                    uppercase
                    className="bg-green-500 text-white backdrop-blur-md"
                  >
                    Arrived
                  </Badge>
                </div>
              </div>

              {/* Card Footer Body Workspace Wrapper Context */}
              <div className="flex flex-grow flex-col space-y-2.5 p-4">
                <div>
                  <Badge className="capitalize">{book.category}</Badge>
                </div>

                <div className="flex-grow space-y-0.5">
                  <h3
                    className="line-clamp-1 text-sm font-semibold leading-tight text-content-strong transition-colors group-hover:text-brand"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                  <p className="truncate text-xs font-medium text-content-muted">
                    by {book.author}
                  </p>
                </div>

                <p className="line-clamp-2 flex-grow text-xs font-normal leading-relaxed text-content-subtle">
                  {book.description}
                </p>

                <div className="flex items-center justify-between border-t border-border-subtle pt-2.5 text-[11px] font-medium text-content-subtle">
                  <span>Delivered On</span>
                  <span className="font-mono text-content-muted">
                    {new Date(book.deliveredAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="Your reading library is empty"
          description="Books you request will show up here once they're delivered to your address."
        />
      )}
    </div>
  );
}




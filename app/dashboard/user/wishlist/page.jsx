"use client";

import { Heart } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Alert, Panel, Badge } from "@/components/ui";
import BookCard from "@/components/BookCard";

async function fetchWishlist({ queryKey }) {
  const [, { token, userId }] = queryKey;
  if (!token || !userId) return [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/wishlist?userId=${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Could not load wishlist.");
    const data = await res.json();
    return data?.books || data?.data || [];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default function WishlistPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const token = session?.token || session?.data?.token;
  const user = session?.user || session?.data?.user;
  const userId = user?._id || user?.id;

  const {
    data: wishlist = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist", { token, userId }],
    queryFn: fetchWishlist,
    enabled: !!token && !!userId && !sessionLoading,
  });

  if (sessionLoading || isLoading) {
    return (
      <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
        <PageHeader title="My Wishlist" subtitle="Books you saved" />
        <Panel className="px-6 py-12 text-center text-sm text-content-subtle">Loading...</Panel>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
        <PageHeader title="My Wishlist" subtitle="Books you saved" />
        <Alert tone="danger">Could not load your wishlist.</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="My Wishlist"
        subtitle="Books you love, saved for later"
        action={
          <Badge tone="info" className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-base">
            <Heart aria-hidden="true" className="h-5 w-5" />
            <span>{wishlist.length} Books</span>
          </Badge>
        }
      />

      {wishlist.length === 0 ? (
        <Panel className="px-6 py-16 text-center">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Heart aria-hidden="true" className="h-10 w-10 text-content-subtle" />
            <h2 className="text-lg font-semibold text-content-strong">Your wishlist is empty</h2>
            <p className="text-sm text-content-subtle">Save books you love and they&apos;ll show up here.</p>
          </div>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {wishlist.map((book) => (
            <BookCard key={book._id || book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

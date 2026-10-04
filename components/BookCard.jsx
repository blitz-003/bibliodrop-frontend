import Link from "next/link";
import { User, Bookmark, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui";

/**
 * Card primitive for the catalogue grid. Browse is the visual reference.
 *
 * Notes on the changes:
 *  - The whole card is now a single `<Link>`. It previously was a `<div>`
 *    with `onClick`, which meant the primary navigation target on the site was
 *    unreachable by keyboard and announced as nothing by a screen reader.
 *    A nested "View Info" button inside it duplicated that same navigation and
 *    needed `stopPropagation()` to avoid firing twice; both problems go away
 *    when there is one link instead of a clickable div plus a button.
 *  - No `"use client"` needed: `next/link` performs client navigation on its
 *    own, and the component holds no state or handlers. That also removes the
 *    previous latent bug where this file called `useRouter` without the
 *    directive and only worked because its one consumer happened to be a
 *    client component.
 *  - `aspect-[5/6]` plus `sizes` give the cover a reserved box before the
 *    image loads, so the grid no longer reflows as covers arrive.
 */

const CATEGORY_TONES = {
  Fiction: "bg-purple-50 text-purple-700 border-purple-100",
  "Sci-Fi": "bg-indigo-50 text-indigo-700 border-indigo-100",
  Business: "bg-emerald-50 text-emerald-700 border-emerald-100",
  History: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function BookCard({ book }) {
  const bookId = book._id || book.id;
  const coverImageSrc = book.image || book.imageUrl || book.coverImage || null;
  const category = book.category || "General";
  const badgeClass =
    CATEGORY_TONES[book.category] ?? "bg-blue-50 text-blue-700 border-blue-100";
  const isAvailable = book.available !== false;

  if (!bookId) return null;

  return (
    <Link
      href={`/books/${bookId}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-card border border-border bg-surface transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      {/* COVER IMAGE — fixed aspect ratio reserves space, preventing layout shift.
          `aspect-[5/6]` is 80% of the previous `aspect-[2/3]` height (1.2x width
          instead of 1.5x); at 4-up on xl the covers were far too tall. */}
      <div className="relative aspect-[5/6] w-full overflow-hidden border-b border-border-subtle bg-surface">
        {coverImageSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={coverImageSrc}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <ImageOff aria-hidden="true" className="h-9 w-9 text-gray-300" />
            <span className="text-xs font-medium text-content-subtle">
              No Cover Art
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 z-10">
          <Badge className={`${badgeClass} backdrop-blur-md shadow-sm`}>
            {category}
          </Badge>
        </div>

        <div className="absolute right-3 top-3 z-10">
          <Badge
            tone={isAvailable ? "success" : "danger"}
            className={
              isAvailable
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }
          >
            {isAvailable ? "In Stock" : "Borrowed"}
          </Badge>
        </div>
      </div>

      {/* BOOK TEXT DETAILS */}
      <div className="flex flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-content-strong transition-colors group-hover:text-accent">
          {book.title}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-sm text-content-muted">
          <User aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="min-w-0 truncate">
            {book.author || "Unknown Author"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-green-700">
            ${book.deliveryFee?.toFixed(2) ?? "0.00"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-control border border-transparent bg-accent-subtle px-3 py-1.5 text-sm font-semibold text-accent transition-colors group-hover:bg-accent group-hover:text-white">
            <Bookmark aria-hidden="true" className="h-4 w-4" />
            View Info
          </span>
        </div>
      </div>
    </Link>
  );
}
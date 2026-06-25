import { useRouter } from "next/navigation";
import { User, Bookmark, ImageOff } from "lucide-react";

export default function BookCard({ book }) {
  const router = useRouter();

  const badgeColors = {
    Fiction: "bg-purple-50 text-purple-700 border-purple-100",
    "Sci-Fi": "bg-indigo-50 text-indigo-700 border-indigo-100",
    Business: "bg-emerald-50 text-emerald-700 border-emerald-100",
    History: "bg-amber-50 text-amber-700 border-amber-100",
  };

  const badgeClass =
    badgeColors[book.category] || "bg-blue-50 text-blue-700 border-blue-100";

  const bookId = book._id || book.id;
  const coverImageSrc = book.image || book.imageUrl || book.coverImage || null;

  // ROUTING PATH FIX: Updated destination prefix to go directly to /books/[id]
  function navigateToDetails() {
    if (bookId) {
      router.push(`/books/${bookId}`);
    }
  }

  return (
    <div
      onClick={navigateToDetails}
      className="bg-white border border-gray-200 rounded-2xl flex flex-col justify-between group hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500 transition-all duration-300 relative overflow-hidden cursor-pointer"
    >
      <div>
        {/* COVER IMAGE */}
        <div className="w-full h-56 bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
          {coverImageSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={coverImageSrc}
              alt={book.title || "Book Cover"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:scale-110 transition-transform duration-500 ease-out">
              <ImageOff className="w-9 h-9 text-gray-300" />
              <span className="text-xs font-medium text-gray-400/80">
                No Cover Art
              </span>
            </div>
          )}

          {/* OVERLAY BADGES */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm backdrop-blur-md uppercase tracking-wider ${badgeClass}`}
            >
              {book.category || "General"}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm ${
                book.available !== false
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {book.available !== false ? "In Stock" : "Borrowed"}
            </span>
          </div>
        </div>

        {/* BOOK TEXT DETAILS */}
        <div className="p-5 space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {book.title}
            </h3>
            <div className="flex items-center gap-1.5 text-base font-medium text-gray-500 pt-1">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {book.author || "Unknown Author"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER INTERACTION DECK */}
      <div className="p-5 pt-0 mt-2">
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-400">
            ID: {String(bookId || "").slice(-5)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents clicking the button from firing navigateToDetails twice
              navigateToDetails();
            }}
            className="inline-flex items-center gap-1.5 text-base font-bold text-blue-600 group-hover:text-white transition-colors bg-blue-50/60 group-hover:bg-blue-600 px-4 py-2 rounded-xl border border-transparent"
          >
            <Bookmark className="w-4 h-4" />
            <span>View Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}

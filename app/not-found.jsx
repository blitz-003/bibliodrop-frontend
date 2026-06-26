import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen p-4 md:p-8 flex flex-col items-center justify-center bg-white  text-gray-700 select-none">
      <div className="max-w-md text-center space-y-6 flex flex-col items-center">
        {/* ─── VISUAL ILLUSTRATION LOGO ─── */}
        <div className="relative flex items-center justify-center w-24 h-24 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
            404
          </span>
        </div>

        {/* ─── TYPOGRAPHY CONTENT ─── */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Catalog Index Missing
          </h1>
          <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
            The book record or workspace view matrix you are trying to access
            does not exist or has been archived from our index servers.
          </p>
        </div>

        {/* ─── NAVIGATION BUTTON ─── */}
        <div className="pt-2 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

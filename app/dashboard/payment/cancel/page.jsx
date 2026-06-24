import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Transaction Canceled
        </h1>
        <p className="text-gray-600 mb-6">
          The payment checkout process was aborted. Your card was not charged,
          and your database records remain unchanged.
        </p>
        <Link
          href="/dashboard"
          className="inline-block w-full bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          Return to Browse Books
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle } from "lucide-react";
import LibrarianBookActions from "@/components/LibrarianBookActions";
import { authClient } from "@/lib/auth-client";

// ✅ FIX: Define the client outside the component function so it is never recreated during renders.
const standaloneDetailsClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function BookDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id;

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  const getClientToken = async () => {
    try {
      if (typeof authClient.getToken === "function") {
        const res = await authClient.getToken();
        if (res?.token) return res.token;
        if (res?.data?.token) return res.data.token;
      }
      if (typeof authClient.token === "function") {
        const res = await authClient.token();
        if (res?.token) return res.token;
        if (res?.data?.token) return res.data.token;
      }
    } catch (e) {
      console.error("Error reading token from authClient:", e);
    }
    return null;
  };

  // 1. Fetch Auth Token Status
  const { data: clientToken, isLoading: isAuthLoading } = useQuery({
    queryKey: ["auth-token"],
    queryFn: getClientToken,
    staleTime: 1000 * 60 * 5,
  });

  const userIsLoggedIn = !!clientToken;

  // 2. Fetch Book Details Dependent Query
  const {
    data,
    isLoading: isBookLoading,
    isError,
  } = useQuery({
    queryKey: ["book-details", id, clientToken],
    queryFn: async () => {
      const headers = {};
      if (clientToken) {
        headers["Authorization"] = `Bearer ${clientToken}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
        { headers },
      );

      if (!res.ok) throw new Error("Failed to load book details.");
      return res.json();
    },
    enabled: !isAuthLoading,
  });

  const checkoutMutation = useMutation({
    mutationFn: async (checkoutPayload) => {
      if (!clientToken) {
        throw new Error("You must be logged in to request a checkout.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
          },
          body: JSON.stringify(checkoutPayload),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || "Could not initialize payment window.",
        );
      }

      return res.json();
    },
    onSuccess: (resData) => {
      if (resData.url) {
        window.location.href = resData.url;
      } else {
        toast.error("Failed to extract valid gateway url.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to establish payment connections.");
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!clientToken) {
        throw new Error("Authentication state dropped. Please log in again.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
          },
          body: JSON.stringify({ comment, rating }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Review processing failed.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Review posted successfully!");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["book-details", id] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // ✅ FIX: Adjusted conditions to prevent loading screens blocking the content layout awkwardly
  if (isAuthLoading || isBookLoading) {
    return (
      <p className="p-5 text-gray-500 font-medium">Loading book details...</p>
    );
  }

  if (isError) {
    return (
      <p className="p-5 text-red-500 font-medium">
        Error loading book parameters.
      </p>
    );
  }

  const {
    book,
    canReview,
    isLibrarianOwner,
    hasRequestedDelivery,
    isAuthenticated,
  } = data || {};

  const computedAuthStatus = userIsLoggedIn || isAuthenticated;
  const isAvailable = book?.availableStock > 0;
  const isCheckedOut =
    book?.availabilityStatus === "Checked Out" || hasRequestedDelivery;

  const clearStatus = () => {
    router.push(`/books/${id}`);
  };

  const getButtonText = () => {
    if (!computedAuthStatus) return "Login to Request Delivery";
    if (checkoutMutation.isPending) return "Connecting to Stripe...";
    if (isCheckedOut) return "Checked Out";
    if (hasRequestedDelivery || isSuccess) return "Delivery Already Requested";
    if (!isAvailable) return "Out of Stock";
    return "Pay with Stripe";
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] p-4 md:p-8 flex flex-col items-center bg-slate-50 gap-6  text-gray-700">
      {/* ─── STATUS BANNERS ─── */}
      {isSuccess && (
        <div className="w-full max-w-5xl bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900">
                Payment Successful!
              </h3>
              <p className="text-sm text-green-700">
                Your delivery has been requested.
              </p>
            </div>
          </div>
          <button
            onClick={clearStatus}
            className="text-sm font-medium text-green-800 hover:underline px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {isCanceled && (
        <div className="w-full max-w-5xl bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900">Payment Canceled</h3>
              <p className="text-sm text-amber-700">
                The checkout process was interrupted.
              </p>
            </div>
          </div>
          <button
            onClick={clearStatus}
            className="text-sm font-medium text-amber-800 hover:underline px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── MAIN CARD FRAME ─── */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="w-full md:w-1/2 h-[45vh] md:h-auto relative bg-gray-100 min-h-[550px]">
          <Image
            src={
              book?.coverImage ||
              "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400"
            }
            alt={book?.title || "Book Cover"}
            fill
            priority
            sizes="(max-w-768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 ">
              {book?.title}
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              Written by {book?.author}
            </p>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong className="text-gray-800">Category:</strong>{" "}
              {book?.category || "General Literature"}
            </p>
            <p>
              <strong className="text-gray-800">Assigned Librarian:</strong>{" "}
              {book?.ownerName || "Staff Admin"}
            </p>
            <div className="text-gray-700 leading-relaxed text-xs">
              <strong className="text-gray-800 text-sm block mb-1">
                Manifest Overview Description:
              </strong>
              <p className="line-clamp-4 whitespace-pre-line">
                {book?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <span className="text-sm font-medium text-gray-700">
              Status Availability:
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isAvailable && !isCheckedOut ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isAvailable && !isCheckedOut ? "bg-green-600" : "bg-red-600"}`}
              />
              {isCheckedOut
                ? "Checked Out"
                : isAvailable
                  ? `Available (${book?.availableStock} Units)`
                  : "Out of Inventory Stock"}
            </span>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase  text-indigo-700">
              Delivery Logistics Fee
            </span>
            <span className="text-2xl md:text-3xl font-black text-indigo-600">
              ${Number(book?.deliveryFee || 0).toFixed(2)}
            </span>
          </div>

          {/* ACTIONS CONTAINER */}
          <div className="pt-2">
            {isLibrarianOwner ? (
              <LibrarianBookActions
                bookId={book?._id}
                publishStatus={book?.publishStatus}
              />
            ) : (
              <>
                {!computedAuthStatus && (
                  <div className="mb-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                    Login to request delivery for this book.
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!computedAuthStatus) {
                      router.push("/login");
                      return;
                    }
                    checkoutMutation.mutate({
                      bookId: book._id,
                      title: book.title,
                      deliveryFee: book.deliveryFee,
                      coverImage: book.coverImage,
                    });
                  }}
                  disabled={
                    !isAvailable ||
                    checkoutMutation.isPending ||
                    isSuccess ||
                    isCheckedOut
                  }
                  className={`w-full py-3 px-4 rounded-xl font-medium  shadow-sm flex items-center justify-center gap-2.5 transition-all duration-200 ${
                    !isAvailable || isSuccess || isCheckedOut
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : !computedAuthStatus
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-[#635BFF] hover:bg-[#5249E0] text-white active:scale-[0.99]"
                  }`}
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13.93 10.09c0-.62-.51-1.01-1.37-1.01-.89 0-1.77.27-2.54.73l-.44-2.1c.88-.41 2.05-.68 3.23-.68 2.25 0 3.73 1.15 3.73 3.4 0 2.22-1.74 3.03-3.15 3.82-.93.52-1.28.91-1.28 1.48h2.64c0-.62.51-1.01 1.37-1.01.89 0 1.77-.27 2.54-.73l.44-2.1c-.88.41-2.05.68-3.23.68-2.25 0-3.73-1.15-3.73-3.4 0-2.22 1.74-3.03 3.15-3.82.93-.52 1.28-.91 1.28-1.48H13.93zM5.5 10.37c0-2.8 2.04-4.22 4.97-4.22 1.15 0 2.11.2 2.76.47l-.46 2.03c-.53-.22-1.2-.38-1.95-.38-1.57 0-2.61.77-2.61 2.16 0 3.02 4.19 2.5 4.19 5.51 0 2.94-2.14 4.14-5.22 4.14-1.28 0-2.45-.25-3.14-.58l.49-2.06c.64.3 1.5.49 2.37.49 1.69 0 2.77-.73 2.77-2.11 0-3.21-4.17-2.56-4.17-5.45z" />
                  </svg>
                  <span>{getButtonText()}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── REVIEW LISTING MODULE ─── */}
      <div className="w-full max-w-5xl bg-white shadow-md border border-gray-100 rounded-xl p-6 space-y-6 mt-2">
        <h2 className="text-lg font-semibold text-gray-900">
          Reader Feedback Log
        </h2>

        {computedAuthStatus && canReview ? (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 max-w-xl">
            <h3 className="text-xs font-semibold uppercase  text-gray-400">
              Write a Review
            </h3>
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-gray-600">
                Rating Scale
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-white border border-gray-200 rounded-md text-xs px-2 py-1 font-semibold focus:outline-none"
              >
                {[5, 4, 3, 2, 1].map((val) => (
                  <option key={val} value={val}>
                    {val} Stars
                  </option>
                ))}
              </select>
            </div>

            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave your review..."
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-400"
            />

            <button
              onClick={() => submitReviewMutation.mutate()}
              disabled={!comment.trim() || submitReviewMutation.isPending}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
            >
              {submitReviewMutation.isPending
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>
        ) : null}

        <div className="space-y-4 max-w-xl">
          {book?.reviews?.length > 0 ? (
            book.reviews.map((rev, i) => (
              <div key={i} className="border-b border-gray-50 pb-4 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-900">
                    {rev.userName || "Anonymous Reader"}
                  </span>
                  <span className="font-semibold text-amber-600">
                    ★ {rev.rating}/5
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">
              No reviews logged under this catalog index yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookDetailsPage() {
  return (
    <QueryClientProvider client={standaloneDetailsClient}>
      <BookDetailsContent />
    </QueryClientProvider>
  );
}

"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getBookById } from "@/services/bookService";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle } from "lucide-react"; // Import clean icons

export default function BookDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id;

  // Read Stripe query params from URL
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  // 1. Fetch book profile data via TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
  });

  // 2. Stripe Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Sends authentication cookies to Express backend
        body: JSON.stringify({
          bookId: data._id,
          title: data.title,
          deliveryFee: data.deliveryFee || data.fee,
          coverImage: data.coverImage,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || "Could not initialize payment window.",
        );
      }
      return res.json(); // Expected payload: { url: "https://checkout.stripe.com/..." }
    },
    onSuccess: (resData) => {
      if (resData.url) {
        window.location.href = resData.url; // Forward out to Stripe
      } else {
        toast.error("Failed to extract valid gateway url.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to establish payment connections.");
    },
  });

  if (isLoading) return <p className="p-5">Loading book...</p>;
  if (isError) return <p className="p-5">Error loading book</p>;

  const isAvailable = data.availableStock > 0;

  // Helper helper to clear status parameters from the URL
  const clearStatus = () => {
    router.push(`/dashboard/books/${id}`);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] p-4 md:p-[10px] flex flex-col items-center justify-center bg-gray-50 gap-4">
      {/* ─── STATUS BANNERS ─── */}
      {isSuccess && (
        <div className="w-full max-w-5xl bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <h3 className="font-bold text-green-900">Payment Successful!</h3>
              <p className="text-sm text-green-700">
                Your delivery has been requested. Check your transaction logs
                for tracking.
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
              <h3 className="font-bold text-amber-900">Payment Canceled</h3>
              <p className="text-sm text-amber-700">
                The checkout process was interrupted. No charges were made.
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
      <div className="w-full h-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        {/* LEFT COMPONENT: IMAGE */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-auto relative bg-gray-100">
          <Image
            src={data.coverImage}
            alt={data.title}
            fill
            priority
            sizes="(max-w-768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* RIGHT COMPONENT: METADATA DETAILS */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-stretch gap-4 overflow-y-auto">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {data.title}
            </h1>
            <p className="text-sm text-gray-500 italic">
              Written by {data.author}
            </p>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong className="text-gray-800">Category:</strong>{" "}
              {data.category}
            </p>
            <p>
              <strong className="text-gray-800">Librarian:</strong>{" "}
              {data.ownerName || "Staff"}
            </p>
            <p className="text-gray-700 leading-relaxed text-xs line-clamp-4">
              <strong className="text-gray-800 text-sm block mb-0.5">
                Description:
              </strong>
              {data.description}
            </p>
          </div>

          <div className="flex items-center gap-3 py-1">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isAvailable
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-green-600" : "bg-red-600"}`}
              />
              {isAvailable
                ? `Available (${data.availableStock} Left)`
                : "Out of Stock"}
            </span>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Delivery Fee
            </span>
            <span className="text-2xl md:text-3xl font-black text-indigo-600">
              ${Number(data.deliveryFee || data.fee).toFixed(2)}
            </span>
          </div>

          {/* PAYMENT TRIGGER ACTIONS */}
          <button
            onClick={() => checkoutMutation.mutate()}
            disabled={!isAvailable || checkoutMutation.isPending || isSuccess}
            className={`w-full py-3 px-4 rounded-xl font-medium tracking-wide shadow-sm flex items-center justify-center gap-2.5 transition-all duration-200 ${
              isAvailable && !isSuccess
                ? "bg-[#635BFF] hover:bg-[#5249E0] text-white active:scale-[0.99]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.93 10.09c0-.62-.51-1.01-1.37-1.01-.89 0-1.77.27-2.54.73l-.44-2.1c.88-.41 2.05-.68 3.23-.68 2.25 0 3.73 1.15 3.73 3.4 0 2.22-1.74 3.03-3.15 3.82-.93.52-1.28.91-1.28 1.48h2.64c0-.62.51-1.01 1.37-1.01.89 0 1.77-.27 2.54-.73l.44-2.1c-.88.41-2.05.68-3.23.68-2.25 0-3.73-1.15-3.73-3.4 0-2.22 1.74-3.03 3.15-3.82.93-.52 1.28-.91 1.28-1.48H13.93zM5.5 10.37c0-2.8 2.04-4.22 4.97-4.22 1.15 0 2.11.2 2.76.47l-.46 2.03c-.53-.22-1.2-.38-1.95-.38-1.57 0-2.61.77-2.61 2.16 0 3.02 4.19 2.5 4.19 5.51 0 2.94-2.14 4.14-5.22 4.14-1.28 0-2.45-.25-3.14-.58l.49-2.06c.64.3 1.5.49 2.37.49 1.69 0 2.77-.73 2.77-2.11 0-3.21-4.17-2.56-4.17-5.45z" />
            </svg>
            <span>
              {checkoutMutation.isPending
                ? "Connecting to Stripe..."
                : isSuccess
                  ? "Ordered & Paid"
                  : "Pay with Stripe"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

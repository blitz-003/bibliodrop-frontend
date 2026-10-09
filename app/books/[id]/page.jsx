"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle } from "lucide-react";
import LibrarianBookActions from "@/components/LibrarianBookActions";
import { authClient } from "@/lib/auth-client";
import {
  Alert,
  Badge,
  Button,
  Panel,
  Select,
  Textarea,
  LoadingScreen,
} from "@/components/ui";

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

  // FIX: Adjusted conditions to prevent loading screens blocking the content layout awkwardly
  if (isAuthLoading || (isBookLoading && !data)) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-app px-4 py-12">
        <Alert tone="danger" className="mx-auto max-w-md">
          <p className="text-base font-semibold">
            Could not load this book.
          </p>
        </Alert>
      </div>
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
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center gap-6 bg-page p-4 text-content md:p-8">
      {/* ─── STATUS BANNERS ─── */}
      {isSuccess && (
        <Alert
          tone="success"
          className="w-full max-w-detail items-center justify-between"
        >
          <span className="flex items-center gap-3">
            <CheckCircle2 aria-hidden="true" className="h-6 w-6 shrink-0" />
            <span>
              <strong className="block font-semibold">
                Payment Successful!
              </strong>
              <span className="text-sm">
                Your delivery has been requested.
              </span>
            </span>
          </span>
          <Button variant="ghost" size="sm" onClick={clearStatus}>
            Dismiss
          </Button>
        </Alert>
      )}

      {isCanceled && (
        <Alert
          tone="warning"
          className="w-full max-w-detail items-center justify-between"
        >
          <span className="flex items-center gap-3">
            <XCircle aria-hidden="true" className="h-6 w-6 shrink-0" />
            <span>
              <strong className="block font-semibold">Payment Canceled</strong>
              <span className="text-sm">
                The checkout process was interrupted.
              </span>
            </span>
          </span>
          <Button variant="ghost" size="sm" onClick={clearStatus}>
            Dismiss
          </Button>
        </Alert>
      )}

      {/* ─── MAIN CARD FRAME ─── */}
      {/* `max-w-detail` (1152px) rather than `max-w-read` (768px): 25% wider on
          each side. The status banners above carry the same cap so all three
          blocks stay flush at the new width. */}
      <div className="flex w-full max-w-detail flex-col overflow-hidden rounded-card border border-border bg-surface shadow-panel md:flex-row">
        <div className="relative min-h-[320px] w-full bg-surface-subtle md:h-auto md:w-1/2 md:min-h-[550px]">
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

        <div className="flex w-full flex-col justify-center gap-4 p-6 md:w-1/2 md:p-8">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-content-strong md:text-3xl">
              {book?.title}
            </h1>
            <p className="text-sm font-medium text-content-muted">
              Written by {book?.author}
            </p>
          </div>

          <hr className="border-border-subtle" />

          <div className="space-y-2 text-sm text-content-muted">
            <p>
              <strong className="text-content">Category:</strong>{" "}
              {book?.category || "General Literature"}
            </p>
            <p>
              <strong className="text-content">Assigned Librarian:</strong>{" "}
              {book?.ownerName || "Staff Admin"}
            </p>
            <div className="text-xs leading-relaxed text-content">
              <strong className="mb-1 block text-sm text-content">
                Description:
              </strong>
              <p className="line-clamp-4 whitespace-pre-line">
                {book?.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 py-1">
            <span className="text-sm font-medium text-content">
              Availability:
            </span>
            <Badge
              tone={isAvailable && !isCheckedOut ? "success" : "danger"}
              dot
            >
              {isCheckedOut
                ? "Checked Out"
                : isAvailable
                  ? `Available (${book?.availableStock} copies)`
                  : "Out of Stock"}
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-control border border-indigo-100 bg-indigo-50/60 p-4">
            <span className="text-xs font-semibold uppercase text-indigo-700">
              Delivery Fee
            </span>
            <span className="text-2xl font-black text-indigo-600 md:text-3xl">
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
                  <Alert tone="info" className="mb-3">
                    <p className="text-sm">
                      Login to request delivery for this book.
                    </p>
                  </Alert>
                )}

                {/*
                  The CTA keeps its three distinct visual states: unavailable
                  (muted, disabled), signed-out (accent blue), and ready to pay
                  (Stripe brand violet). `brand` is the reserved token for the
                  third case so the payment colour cannot drift.
                */}
                <Button
                  size="lg"
                  className="w-full"
                  variant={
                    !isAvailable || isSuccess || isCheckedOut
                      ? "subtle"
                      : computedAuthStatus
                        ? "brand"
                        : "primary"
                  }
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
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13.93 10.09c0-.62-.51-1.01-1.37-1.01-.89 0-1.77.27-2.54.73l-.44-2.1c.88-.41 2.05-.68 3.23-.68 2.25 0 3.73 1.15 3.73 3.4 0 2.22-1.74 3.03-3.15 3.82-.93.52-1.28.91-1.28 1.48h2.64c0-.62.51-1.01 1.37-1.01.89 0 1.77-.27 2.54-.73l.44-2.1c-.88.41-2.05.68-3.23.68-2.25 0-3.73-1.15-3.73-3.4 0-2.22 1.74-3.03 3.15-3.82.93-.52 1.28-.91 1.28-1.48H13.93zM5.5 10.37c0-2.8 2.04-4.22 4.97-4.22 1.15 0 2.11.2 2.76.47l-.46 2.03c-.53-.22-1.2-.38-1.95-.38-1.57 0-2.61.77-2.61 2.16 0 3.02 4.19 2.5 4.19 5.51 0 2.94-2.14 4.14-5.22 4.14-1.28 0-2.45-.25-3.14-.58l.49-2.06c.64.3 1.5.49 2.37.49 1.69 0 2.77-.73 2.77-2.11 0-3.21-4.17-2.56-4.17-5.45z" />
                  </svg>
                  <span>{getButtonText()}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── REVIEW LISTING MODULE ─── */}
      <Panel className="mt-2 w-full max-w-detail space-y-6 p-6">
        <h2 className="text-lg font-semibold text-content-strong">
          Reader Reviews
        </h2>

        {computedAuthStatus && canReview ? (
          <Panel className="space-y-4 border-border-subtle p-5">
            <h3 className="text-xs font-semibold uppercase text-content-subtle">
              Write a Review
            </h3>

            <Select
              label="Rating"
              id="review-rating"
              className="max-w-[10rem]"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val} Stars
                </option>
              ))}
            </Select>

            <Textarea
              rows={3}
              id="review-comment"
              label="Your review"
              placeholder="Leave your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button
              variant="neutral"
              size="sm"
              onClick={() => submitReviewMutation.mutate()}
              disabled={!comment.trim() || submitReviewMutation.isPending}
            >
              {submitReviewMutation.isPending
                ? "Submitting..."
                : "Submit Review"}
            </Button>
          </Panel>
        ) : null}

        {/*
          The former `max-w-narrow` cap (896px) is gone: inside a 1152px panel
          it left ~208px of dead space down each side. `max-w-prose` instead
          keeps the comment measure readable at the new panel width.
        */}
        <div className="space-y-4">
          {book?.reviews?.length > 0 ? (
            book.reviews.map((rev, i) => (
              <article
                key={i}
                className="max-w-prose space-y-1 border-b border-border-subtle pb-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-content-strong">
                    {rev.userName || "Anonymous Reader"}
                  </span>
                  <span className="font-semibold text-amber-600">
                    <span aria-hidden="true">★</span> {rev.rating}/5
                    <span className="sr-only"> out of 5</span>
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-content-muted">
                  {rev.comment}
                </p>
              </article>
            ))
          ) : (
            <p className="text-xs italic text-content-subtle">
              No reviews yet.
            </p>
          )}
        </div>
      </Panel>
    </div>
  );
}

export default function BookDetailsPage() {
  return <BookDetailsContent />;
}

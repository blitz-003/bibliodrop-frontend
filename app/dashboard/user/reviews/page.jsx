"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2, Edit3, Check, X, MessageSquare, Star } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const dashboardReviewsClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function MyReviewsContent() {
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  // =========================
  // Fetch Reviews
  // =========================

  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const { data, error } = await authClient.token();

      if (error || !data) {
        throw new Error(error?.message || "Authentication token missing.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/me`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.message || "Could not populate your personal feedback logs.",
        );
      }

      return res.json();
    },
  });

  // =========================
  // Update Review
  // =========================

  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, comment, rating }) => {
      const { data, error } = await authClient.token();

      if (error || !data) {
        throw new Error(error?.message || "Authentication token missing.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            comment,
            rating,
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update review changes.");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Review updated!");
      setEditingId(null);

      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  // =========================
  // Delete Review
  // =========================

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const { data, error } = await authClient.token();

      if (error || !data) {
        throw new Error(error?.message || "Authentication token missing.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to erase review payload.");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Review removed permanently.");

      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const startEditing = (review) => {
    setEditingId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl p-4 md:p-8 space-y-4 mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        {[1, 2].map((n) => (
          <div
            key={n}
            className="h-32 bg-white border border-gray-100 rounded-xl"
          ></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-4xl p-4 md:p-8 mx-auto text-center">
        <p className="bg-red-50 border border-red-100 p-4 rounded-xl text-sm font-medium text-red-500 inline-block">
          Error rendering reviews panel. Please verify your authentication
          state.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-4 md:p-8 space-y-6 text-gray-700 mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900  flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          My Personal Reviews
        </h1>

        <p className="text-xs text-gray-400 mt-0.5">
          Manage and update evaluation metrics you logged across catalog
          entries.
        </p>
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-4">
        {reviews?.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-3 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {rev.bookId?.title || "Unknown Book"}
                  </h3>

                  <p className="text-[11px] text-gray-400 italic">
                    By {rev.bookId?.author || "Unknown Author"}
                  </p>
                </div>

                {editingId === rev._id ? (
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="bg-white border border-gray-200 rounded px-2 py-0.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    <Star className="w-3 h-3 fill-current" />
                    {rev.rating}/5
                  </div>
                )}
              </div>

              {editingId === rev._id ? (
                <textarea
                  rows={2}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-lg">
                  {rev.comment}
                </p>
              )}

              <div className="flex justify-end gap-2 text-xs">
                {editingId === rev._id ? (
                  <>
                    <button
                      onClick={() =>
                        updateReviewMutation.mutate({
                          reviewId: rev._id,
                          comment: editComment,
                          rating: editRating,
                        })
                      }
                      disabled={
                        updateReviewMutation.isPending || !editComment.trim()
                      }
                      className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(rev)}
                      className="inline-flex items-center gap-1 border border-gray-200 hover:bg-white px-3 py-1.5 rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Permanently erase this review?")) {
                          deleteReviewMutation.mutate(rev._id);
                        }
                      }}
                      disabled={deleteReviewMutation.isPending}
                      className="inline-flex items-center gap-1 border border-red-100 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-xl p-12 text-center text-xs text-gray-400">
            You have not written any reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyReviewsPage() {
  return (
    <QueryClientProvider client={dashboardReviewsClient}>
      <MyReviewsContent />
    </QueryClientProvider>
  );
}

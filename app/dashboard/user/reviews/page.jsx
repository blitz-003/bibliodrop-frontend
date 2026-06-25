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

// Independent client tree for the isolated dashboard views
const dashboardReviewsClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

function MyReviewsContent() {
  const queryClient = useQueryClient();

  // Track which review is currently being edited inline
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  // 1. Fetch all reviews written by the active session profile
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: () =>
      fetch("http://localhost:5000/reviews/me", {
        credentials: "include",
      }).then((res) => {
        if (!res.ok)
          throw new Error("Could not populate your personal feedback logs.");
        return res.json();
      }),
  });

  // 2. Mutation: Update/Edit an existing review
  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, comment, rating }) => {
      const res = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment, rating }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update review changes.");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review updated!");
      setEditingId(null);
      queryClient.invalidateQueries(["my-reviews"]);
    },
    onError: (err) => toast.error(err.message),
  });

  // 3. Mutation: Delete a review completely
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const res = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to erase review payload.");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review removed permanently.");
      queryClient.invalidateQueries(["my-reviews"]);
    },
    onError: (err) => toast.error(err.message),
  });

  const startEditing = (review) => {
    setEditingId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  if (isLoading)
    return (
      <p className="p-6 text-sm font-medium text-gray-400">
        Loading your feedback metrics...
      </p>
    );
  if (isError)
    return (
      <p className="p-6 text-sm font-medium text-red-500">
        Error rendering reviews panel.
      </p>
    );

  return (
    <div className="w-full max-w-4xl p-4 md:p-8 space-y-6 font-sans text-gray-700">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" /> My Personal
          Reviews
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
              {/* HEADER LAYER: BOOK TITLE & RATINGS */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {rev.bookId?.title || "Unknown Book Catalog Index"}
                  </h3>
                  <p className="text-[11px] text-gray-400 italic">
                    By {rev.bookId?.author || "Unknown Author"}
                  </p>
                </div>

                {/* RATING DISPLAY MATRIX */}
                {editingId === rev._id ? (
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs font-bold focus:outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-100">
                    <Star className="w-3 h-3 fill-current" /> {rev.rating}/5
                  </div>
                )}
              </div>

              {/* CONTENT FIELD BLOCK */}
              {editingId === rev._id ? (
                <textarea
                  rows="2"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-gray-400"
                />
              ) : (
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/40 p-3 rounded-lg border border-gray-50/60">
                  {rev.comment}
                </p>
              )}

              {/* ACTION BUTTON CONTROLS */}
              <div className="flex justify-end gap-2 text-xs font-medium pt-1">
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
                      className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(rev)}
                      className="inline-flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Permanently erase this review?"))
                          deleteReviewMutation.mutate(rev._id);
                      }}
                      disabled={deleteReviewMutation.isPending}
                      className="inline-flex items-center gap-1 border border-red-100 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-xl p-12 text-center text-xs text-gray-400 font-medium">
            You have not written any book profile logs or feedback reviews yet.
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

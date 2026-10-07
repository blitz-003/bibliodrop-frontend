"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2, Edit3, Check, X, MessageSquare, Star } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  Alert,
  Badge,
  Button,
  PageHeader,
  Panel,
  EmptyState,
  Select,
  Textarea,
} from "@/components/ui";

export default function MyReviewsPage() {
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
      <div aria-busy="true" className="mx-auto w-full max-w-full min-w-0 space-y-4 px-1 sm:px-0">
        <span className="sr-only">Loading your reviews</span>
        {[1, 2].map((n) => (
          <Panel key={n} className="h-32 animate-pulse bg-surface-subtle" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-narrow">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Error rendering reviews panel
          </p>
          <p className="mt-1 text-sm">
            Please verify your authentication state.
          </p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="My Personal Reviews"
        subtitle="Manage and update evaluation metrics you logged across catalog entries."
        icon={MessageSquare}
      />

      <div className="space-y-4">
        {reviews?.length > 0 ? (
          reviews.map((rev) => (
            <Panel key={rev._id} className="space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-content-strong">
                    {rev.bookId?.title || "Unknown Book"}
                  </h3>

                  <p className="text-[11px] text-content-subtle italic">
                    By {rev.bookId?.author || "Unknown Author"}
                  </p>
                </div>

                {editingId === rev._id ? (
                  <label className="sr-only" htmlFor={`rating-${rev._id}`}>
                    Rating for {rev.bookId?.title || "book"}
                  </label>
                ) : null}

                {editingId === rev._id ? (
                  <Select
                    id={`rating-${rev._id}`}
                    className="w-auto"
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Badge tone="warning">
                    <Star aria-hidden="true" className="h-3 w-3 fill-current" />
                    {rev.rating}/5
                  </Badge>
                )}
              </div>

              {editingId === rev._id ? (
                <Textarea
                  rows={2}
                  label="Review comment"
                  name={`comment-${rev._id}`}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="text-xs"
                />
              ) : (
                <p className="rounded-control bg-surface-subtle p-3 text-xs leading-relaxed text-content">
                  {rev.comment}
                </p>
              )}

              <div className="flex justify-end gap-2">
                {editingId === rev._id ? (
                  <>
                    <Button
                      size="sm"
                      variant="success"
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
                    >
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                      Save
                    </Button>

                    <Button
                      size="sm"
                      variant="subtle"
                      onClick={() => setEditingId(null)}
                    >
                      <X aria-hidden="true" className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => startEditing(rev)}
                    >
                      <Edit3 aria-hidden="true" className="h-3.5 w-3.5" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm("Permanently erase this review?")) {
                          deleteReviewMutation.mutate(rev._id);
                        }
                      }}
                      disabled={deleteReviewMutation.isPending}
                    >
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Panel>
          ))
        ) : (
          <EmptyState
            title="You have not written any reviews yet"
            description="Reviews you leave on catalog entries will appear here."
          />
        )}
      </div>
    </div>
  );
}


"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LibrarianBookActions({ bookId, publishStatus }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // components/LibrarianBookActions.jsx
  // Inside your togglePublish mutation:

  const togglePublish = useMutation({
    mutationFn: async () => {
      const { data: tokenData } = await authClient.getAccessToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/toggle-publish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData?.accessToken}`,
          },
        },
      );

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(
          error.message || "Could not update publication status.",
        );
      }

      return res.json();
    },

    onSuccess: (data) => {
      const isNowPublished =
        data.publishStatus === "approved" || data.isPublished === true;

      toast.success(
        `Book ${isNowPublished ? "published" : "unpublished"} successfully!`,
      );

      queryClient.invalidateQueries({
        queryKey: ["book-details", bookId],
      });
    },

    onError: (err) => {
      toast.error(err.message || "Could not update publication status.");
    },
  });

  // 2. Mutation: Delete Book

  const deleteBook = useMutation({
    mutationFn: async () => {
      const { data: tokenData } = await authClient.getAccessToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData?.accessToken}`,
          },
        },
      );

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete book");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Book removed successfully.");
      router.push("/dashboard/inventory");
    },

    onError: (err) => {
      toast.error(err.message || "Failed to delete book.");
    },
  });

  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <button
        onClick={() => router.push(`/books/${bookId}/edit`)} // Clean unified target!
        className="bg-white hover:bg-white text-gray-700 border border-gray-200 font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
      >
        Edit
      </button>

      <button
        onClick={() => togglePublish.mutate()}
        disabled={togglePublish.isPending}
        className="bg-white hover:bg-white text-gray-700 border border-gray-200 font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
      >
        {publishStatus === "approved" ? "Unpublish" : "Publish"}
      </button>

      <button
        onClick={() => {
          if (confirm("Are you sure you want to delete this book entirely?")) {
            deleteBook.mutate();
          }
        }}
        disabled={deleteBook.isPending}
        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
      >
        {deleteBook.isPending ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}

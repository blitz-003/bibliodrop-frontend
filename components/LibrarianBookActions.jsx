"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LibrarianBookActions({ bookId, publishStatus }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // components/LibrarianBookActions.jsx
  // Inside your togglePublish mutation:

  const togglePublish = useMutation({
    mutationFn: async () => {
      // Instead of pushing to an /admin route, we call a clean resource toggle endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/toggle-publish`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: (data) => {
      // Check whatever property your backend uses to denote visibility status
      const isNowPublished =
        data.publishStatus === "approved" || data.isPublished === true;
      toast.success(
        `Book ${isNowPublished ? "published" : "unpublished"} successfully!`,
      );
      queryClient.invalidateQueries(["book-details", bookId]);
    },
    onError: () => toast.error("Could not update publication status."),
  });

  // 2. Mutation: Delete Book
  const deleteBook = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      toast.success("Book removed successfully.");
      router.push("/dashboard/inventory");
    },
    onError: () => toast.error("Failed to delete book."),
  });

  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <button
        onClick={() => router.push(`/books/${bookId}/edit`)} // Clean unified target!
        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
      >
        Edit
      </button>

      <button
        onClick={() => togglePublish.mutate()}
        disabled={togglePublish.isPending}
        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
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

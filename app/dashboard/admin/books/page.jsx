"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function AdminManageBooksPage() {
  const queryClient = useQueryClient();

  // 1. Fetch entire catalog via Admin master endpoint

  const {
    data: books,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-manage-books"],
    queryFn: async () => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/books`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to load inventory logs.");
      }

      return res.json();
    },
  });

  // 2. Mutation: Toggle Publication States

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, nextStatus }) => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/books/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            publishStatus: nextStatus,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Status transformation failure.");
      }

      return res.json();
    },

    onSuccess: (data) => {
      const isApproved = data.publishStatus === "approved";

      toast.success(
        `Book successfully ${isApproved ? "Published" : "Unpublished"}!`,
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-manage-books"],
      });
    },

    onError: () => {
      toast.error("Could not alter book publication status.");
    },
  });

  if (isLoading)
    return (
      <p className="p-6 text-gray-500 font-medium">
        Gathering book listings...
      </p>
    );
  if (isError)
    return (
      <p className="p-6 text-red-500 font-medium">
        Error loading master book inventory catalogue.
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Manage Books</h1>
        <p className="text-sm text-gray-500">
          Monitor active catalog submissions, review delivery valuations, and
          control platform publication parameters.
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs font-semibold uppercase  text-gray-600">
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Delivery Fee</th>
                <th className="p-4">Librarian (Owner)</th>
                <th className="p-4">Publishing Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {books?.map((book) => (
                <tr
                  key={book._id}
                  className="hover:bg-white/50 transition-colors"
                >
                  {/* Title */}
                  <td
                    className="p-4 font-semibold text-gray-900 max-w-[200px] truncate"
                    title={book.title}
                  >
                    {book.title}
                  </td>

                  {/* Author */}
                  <td className="p-4 font-medium text-gray-600">
                    {book.author}
                  </td>

                  {/* Delivery Fee */}
                  <td className="p-4 font-semibold text-gray-900">
                    ${Number(book.deliveryFee).toFixed(2)}
                  </td>

                  {/* Librarian (Using the flat string snapshot safely or fallback) */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">
                        {book.ownerName || "Staff"}
                      </span>
                      <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]">
                        {book.ownerEmail || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Publishing Status */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase  ${
                        book.publishStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : book.publishStatus === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {book.publishStatus === "approved"
                        ? "published"
                        : book.publishStatus === "pending"
                          ? "pending"
                          : "unpublished"}
                    </span>
                  </td>

                  {/* Action Buttons Toggle */}
                  <td className="p-4 text-center">
                    {book.publishStatus === "approved" ? (
                      <button
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: book._id,
                            nextStatus: "rejected",
                          })
                        }
                        disabled={togglePublishMutation.isPending}
                        className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-xs px-4 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: book._id,
                            nextStatus: "approved",
                          })
                        }
                        disabled={togglePublishMutation.isPending}
                        className="bg-[#635BFF] hover:bg-[#5249E0] text-white font-semibold text-xs px-4 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        Publish
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {books?.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-12 text-center text-gray-400 italic"
                  >
                    No books uploaded to the system ledger directories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

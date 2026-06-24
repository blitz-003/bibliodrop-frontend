"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ApprovalsClient({ token }) {
  const queryClient = useQueryClient();

  const fetchHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // 1. Fetching Pending Books
  const {
    data: pendingBooks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pendingBooks"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/adminApproval", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load approvals checklist");
      return res.json();
    },
  });

  // 2. Mutating Status (PATCH)
  const mutation = useMutation({
    mutationFn: async ({ bookId, status }) => {
      const res = await fetch(`http://localhost:5000/books/${bookId}/status`, {
        method: "PATCH",
        headers: fetchHeaders,
        credentials: "include",
        body: JSON.stringify({ publishStatus: status }),
      });
      if (!res.ok) throw new Error("Could not update book status");
      return res.json();
    },
    // The magic step: This invalidates the cache, pulling the updated list from the backend
    // and removing the approved/rejected book from view instantly.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingBooks"] });
    },
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading pending requests...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Approval Management
      </h1>

      {pendingBooks.length === 0 ? (
        <div className="p-8 bg-gray-50 border rounded-lg text-center text-gray-500">
          No books are currently waiting for approval.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse bg-white text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700 border-b">
              <tr>
                <th className="px-6 py-4">Book Title</th>
                <th className="px-6 py-4">Librarian (Owner)</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Delivery Fee</th>
                <th className="px-6 py-4">Publish Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingBooks.map((book) => (
                <tr
                  key={book._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {book.title}
                  </td>
                  <td className="px-6 py-4">
                    <div>{book.ownerName}</div>
                    <div className="text-xs text-gray-400">
                      {book.ownerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4">{book.totalStock}</td>
                  <td className="px-6 py-4">${book.deliveryFee?.toFixed(2)}</td>

                  {/* Added Status Column Value */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 border border-yellow-200 uppercase tracking-wider">
                      {book.publishStatus || "pending"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          mutation.mutate({
                            bookId: book._id,
                            status: "approved",
                          })
                        }
                        disabled={mutation.isPending}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition-all"
                      >
                        {mutation.isPending ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() =>
                          mutation.mutate({
                            bookId: book._id,
                            status: "rejected",
                          })
                        }
                        disabled={mutation.isPending}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

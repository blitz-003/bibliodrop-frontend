"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast"; // 1. Import toast

export default function ApprovalsClient({ token }) {
  const queryClient = useQueryClient();

  const fetchHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Fetching pending books
  const {
    data: pendingBooks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pendingBooks"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adminApproval`,
        {
          headers: fetchHeaders,
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to load approvals checklist");
      return res.json();
    },
  });

  // 2. Mutating Status (PATCH) with Toast integrated
  const mutation = useMutation({
    mutationFn: async ({ bookId, status }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/status`,
        {
          method: "PATCH",
          headers: fetchHeaders,
          credentials: "include",
          body: JSON.stringify({ publishStatus: status }),
        },
      );
      if (!res.ok) throw new Error("Could not update book status");
      return res.json();
    },
    // Triggers when the button is clicked and the request goes out
    onMutate: ({ status }) => {
      // Return context with the status so onSuccess can read it if needed
      return { status };
    },
    // Triggers when the backend successfully updates
    onSuccess: (data, variables) => {
      // Invalidate cache to remove item from table list
      queryClient.invalidateQueries({ queryKey: ["pendingBooks"] });
    },
  });

  // 3. Helper function to trigger the promise-based toast notification
  const handleAction = (bookId, status) => {
    // toast.promise takes the actual mutation promise execution
    toast.promise(
      mutation.mutateAsync({ bookId, status }), // Note: Use mutateAsync here to pass the promise
      {
        loading: `Updating book status to ${status}...`,
        success: <b>Book successfully {status}!</b>,
        error: <b>Could not update book status.</b>,
      },
    );
  };

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
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 border border-yellow-200 uppercase">
                      {book.publishStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(book._id, "approved")}
                        disabled={mutation.isPending}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(book._id, "rejected")}
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

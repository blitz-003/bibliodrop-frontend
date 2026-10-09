"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast"; // 1. Import toast
import {
  Alert,
  Button,
  PageHeader,
  EmptyState,
  DataTable,
  DataTableHead,
  DataTableTh,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  StatusBadge,
} from "@/components/ui";

export default function ApprovalsClient() {
  const queryClient = useQueryClient();

  // Fetching pending books
  const {
    data: pendingBooks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pendingBooks"],
    queryFn: async () => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adminApproval`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed");

      return res.json();
    },
  });

  // 2. Mutating Status (PATCH) with Toast integrated
  const mutation = useMutation({
    mutationFn: async ({ bookId, status }) => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            publishStatus: status,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Could not update book status");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingBooks"],
      });

      toast.success("Book status updated successfully!");
    },

    onError: (error) => {
      toast.error(error.message || "Could not update book status");
    },
  });

  // 3. Helper to trigger the mutation (toasts fire from onSuccess/onError)
  const handleAction = (bookId, status) => {
    mutation.mutate({ bookId, status });
  };

  if (isLoading)
    return (
      <div aria-busy="true" className="mx-auto w-full max-w-app">
        <span className="sr-only">Loading pending requests</span>
      </div>
    );
  if (isError)
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Could not load approval requests.
          </p>
          <p className="mt-1 text-sm">{error.message}</p>
        </Alert>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Admin Approval Management"
        subtitle="Review catalog submissions submitted by librarians."
      />

      {pendingBooks.length === 0 ? (
        <EmptyState
          title="No books awaiting approval"
          description="Librarian submissions will appear here for review."
        />
      ) : (
        <DataTable minWidth="min-w-[720px]">
          <DataTableHead>
            <tr>
              <DataTableTh>Book Title</DataTableTh>
              <DataTableTh>Librarian (Owner)</DataTableTh>
              <DataTableTh>Stock</DataTableTh>
              <DataTableTh>Publish Status</DataTableTh>
              <DataTableTh align="right">Actions</DataTableTh>
            </tr>
          </DataTableHead>

          <DataTableBody>
            {pendingBooks.map((book) => (
              <DataTableRow key={book._id}>
                <DataTableCell className="font-medium text-content-strong">
                  {book.title}
                </DataTableCell>

                <DataTableCell>
                  <span className="block">{book.ownerName}</span>
                  <span className="block text-xs text-content-subtle">
                    {book.ownerEmail}
                  </span>
                </DataTableCell>

                <DataTableCell className="tabular-nums">
                  {book.totalStock}
                </DataTableCell>

                <DataTableCell>
                  <StatusBadge kind="publish" value={book.publishStatus} />
                </DataTableCell>

                <DataTableCell align="right">
                  <span className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      disabled={mutation.isPending}
                      onClick={() => handleAction(book._id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={mutation.isPending}
                      onClick={() => handleAction(book._id, "rejected")}
                    >
                      Reject
                    </Button>
                  </span>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      )}
    </div>
  );
}


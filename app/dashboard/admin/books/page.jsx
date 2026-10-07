"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Alert,
  Button,
  PageHeader,
  DataTable,
  DataTableHead,
  DataTableTh,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableEmpty,
  StatusBadge,
} from "@/components/ui";

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
      <div aria-busy="true" className="mx-auto w-full max-w-app">
        <span className="sr-only">Gathering book listings</span>
      </div>
    );
  if (isError)
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Error loading master book inventory catalogue
          </p>
        </Alert>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Manage Books"
        subtitle="Monitor active catalog submissions, review delivery valuations, and control platform publication parameters."
      />

      <DataTable minWidth="min-w-[800px]">
        <DataTableHead>
          <tr>
            <DataTableTh>Title</DataTableTh>
            <DataTableTh>Author</DataTableTh>
            <DataTableTh>Delivery Fee</DataTableTh>
            <DataTableTh>Librarian (Owner)</DataTableTh>
            <DataTableTh>Publishing Status</DataTableTh>
            <DataTableTh align="center">Actions</DataTableTh>
          </tr>
        </DataTableHead>

        <DataTableBody>
          {books?.map((book) => (
            <DataTableRow key={book._id}>
              <DataTableCell className="max-w-[200px] font-semibold text-content-strong">
                <span className="block truncate" title={book.title}>
                  {book.title}
                </span>
              </DataTableCell>

              <DataTableCell className="font-medium text-content-muted">
                {book.author}
              </DataTableCell>

              <DataTableCell className="font-semibold tabular-nums text-content-strong">
                ${Number(book.deliveryFee).toFixed(2)}
              </DataTableCell>

              <DataTableCell>
                <span className="flex flex-col">
                  <span className="font-medium text-content">
                    {book.ownerName || "Staff"}
                  </span>
                  <span className="max-w-[150px] truncate font-mono text-xs text-content-subtle">
                    {book.ownerEmail || "N/A"}
                  </span>
                </span>
              </DataTableCell>

              <DataTableCell>
                <StatusBadge
                  kind="publish"
                  value={
                    book.publishStatus === "approved"
                      ? "published"
                      : book.publishStatus === "pending"
                        ? "pending"
                        : "unpublished"
                  }
                />
              </DataTableCell>

              <DataTableCell align="center">
                {book.publishStatus === "approved" ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      togglePublishMutation.mutate({
                        id: book._id,
                        nextStatus: "rejected",
                      })
                    }
                    disabled={togglePublishMutation.isPending}
                  >
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      togglePublishMutation.mutate({
                        id: book._id,
                        nextStatus: "approved",
                      })
                    }
                    disabled={togglePublishMutation.isPending}
                  >
                    Publish
                  </Button>
                )}
              </DataTableCell>
            </DataTableRow>
          ))}

          {(!books || books.length === 0) && (
            <DataTableEmpty colSpan={6}>
              No books uploaded to the system ledger directories yet.
            </DataTableEmpty>
          )}
        </DataTableBody>
      </DataTable>
    </div>
  );
}


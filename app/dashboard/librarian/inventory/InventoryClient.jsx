"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  PageHeader,
  DataTable,
  DataTableHead,
  DataTableTh,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableEmpty,
  StatusBadge,
  DashboardSkeleton,
} from "@/components/ui";

export default function InventoryClient({ user }) {
  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ["inventory", user?.id],

    queryFn: async () => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/inventory`,
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

  const safeBooks = Array.isArray(books) ? books : [];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Inventory Dashboard"
        subtitle="Stock levels and publication status for the titles you manage."
      />

      <DataTable minWidth="min-w-[520px]">
        <DataTableHead>
          <tr>
            <DataTableTh>Title</DataTableTh>
            <DataTableTh>Category</DataTableTh>
            <DataTableTh align="right">Stock</DataTableTh>
            <DataTableTh>Status</DataTableTh>
          </tr>
        </DataTableHead>

        <DataTableBody>
          {safeBooks.map((b) => (
            <DataTableRow key={b._id}>
              <DataTableCell className="font-medium text-content-strong">
                {b.title}
              </DataTableCell>
              <DataTableCell>{b.category}</DataTableCell>
              <DataTableCell align="right" className="tabular-nums">
                {b.totalStock}
              </DataTableCell>
              <DataTableCell>
                <StatusBadge kind="publish" value={b.publishStatus} />
              </DataTableCell>
            </DataTableRow>
          ))}

          {safeBooks.length === 0 && !isError && (
            <DataTableEmpty colSpan={4}>
              No books in your inventory yet.
            </DataTableEmpty>
          )}
        </DataTableBody>
      </DataTable>
    </div>
  );
}


"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  Alert,
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

export default function UserDeliveryHistoryPage() {
  const {
    data: deliveries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-deliveries"],
    queryFn: async () => {
      const { data, error } = await authClient.token();

      if (error) {
        throw new Error("Failed to retrieve authentication token.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deliveries/history`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to load delivery history.");
      }

      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div aria-busy="true" className="mx-auto w-full max-w-app">
        <span className="sr-only">Loading delivery records</span>
        <DataTable>
          <DataTableBody>
            {[...Array(4)].map((_, i) => (
              <DataTableRow key={i}>
                <DataTableCell className="h-12 animate-pulse bg-gray-100" />
                <DataTableCell className="h-12 animate-pulse bg-gray-100" />
                <DataTableCell className="h-12 animate-pulse bg-gray-100" />
                <DataTableCell className="h-12 animate-pulse bg-gray-100" />
                <DataTableCell className="h-12 animate-pulse bg-gray-100" />
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Error fetching delivery tracking logs
          </p>
        </Alert>
      </div>
    );
  }

  const rows = Array.isArray(deliveries) ? deliveries : [];

  return (
    <div className="mx-auto w-full max-w-app space-y-6">
      <PageHeader
        title="Your Delivery History"
        subtitle="Track the status of every book you have requested."
      />

      <DataTable>
        <DataTableHead>
          <tr>
            <DataTableTh>Book Title</DataTableTh>
            <DataTableTh>Delivery Fee</DataTableTh>
            <DataTableTh>Request Date</DataTableTh>
            <DataTableTh>Status</DataTableTh>
            <DataTableTh>Transaction ID</DataTableTh>
          </tr>
        </DataTableHead>

        <DataTableBody>
          {rows.map((d) => (
            <DataTableRow key={d._id}>
              <DataTableCell className="font-semibold text-content-strong">
                {d.bookTitle}
              </DataTableCell>
              <DataTableCell className="tabular-nums">
                ${d.deliveryFee.toFixed(2)}
              </DataTableCell>
              <DataTableCell>
                {new Date(d.createdAt).toLocaleDateString()}
              </DataTableCell>
              <DataTableCell>
                <StatusBadge kind="delivery" value={d.status} />
              </DataTableCell>
              <DataTableCell className="font-mono text-xs text-content-subtle">
                {d.transactionId}
              </DataTableCell>
            </DataTableRow>
          ))}

          {rows.length === 0 && (
            <DataTableEmpty colSpan={5}>
              No delivery history records identified.
            </DataTableEmpty>
          )}
        </DataTableBody>
      </DataTable>
    </div>
  );
}
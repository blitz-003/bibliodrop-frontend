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
export default function AdminTransactionsPage() {
  // Fetch compiled admin ledger stream via TanStack Query

  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Network response error");
      }

      return res.json();
    },
  });

  if (isLoading)
    return (
      <div aria-busy="true" className="mx-auto w-full max-w-app">
        <span className="sr-only">Loading ledger streams</span>
      </div>
    );
  if (isError)
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Error loading system transaction histories
          </p>
        </Alert>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-app space-y-6">
      <PageHeader
        title="System Transactions"
        subtitle="Master ledger monitoring overall global checkout logs and shipping fulfillment statuses."
      />

      <DataTable minWidth="min-w-[900px]">
        <DataTableHead>
          <tr>
            <DataTableTh>Transaction ID</DataTableTh>
            <DataTableTh>Amount</DataTableTh>
            <DataTableTh>Book Name</DataTableTh>
            <DataTableTh>User (Client ID)</DataTableTh>
            <DataTableTh>Librarian</DataTableTh>
            <DataTableTh>Time</DataTableTh>
            <DataTableTh>Delivery Status</DataTableTh>
          </tr>
        </DataTableHead>

        <DataTableBody>
          {transactions?.map((tx) => (
            <DataTableRow key={tx._id}>
              <DataTableCell className="max-w-[120px] select-all truncate font-mono text-xs text-content-subtle">
                <span title={tx._id}>{tx._id}</span>
              </DataTableCell>

              <DataTableCell className="font-semibold tabular-nums text-content-strong">
                ${Number(tx.amountPaid).toFixed(2)}
              </DataTableCell>

              <DataTableCell className="max-w-[200px] font-semibold text-indigo-950">
                <span className="block truncate" title={tx.bookName}>
                  {tx.bookName}
                </span>
              </DataTableCell>

              <DataTableCell className="max-w-[100px] truncate font-mono text-xs text-content-muted">
                <span title={tx.userId}>{tx.userId}</span>
              </DataTableCell>

              <DataTableCell className="font-medium text-content">
                {tx.librarianName}
              </DataTableCell>

              <DataTableCell className="whitespace-nowrap text-xs text-content-muted">
                {new Date(tx.createdAt).toLocaleString()}
              </DataTableCell>

              <DataTableCell>
                <StatusBadge
                  kind="delivery"
                  value={tx.deliveryStatus}
                  dot
                />
              </DataTableCell>
            </DataTableRow>
          ))}

          {(!transactions || transactions.length === 0) && (
            <DataTableEmpty colSpan={7}>
              No financial transaction events identified across the network data
              streams.
            </DataTableEmpty>
          )}
        </DataTableBody>
      </DataTable>
    </div>
  );
}

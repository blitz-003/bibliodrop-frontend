"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
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
      <p className="p-6 text-gray-500 font-medium">Loading ledger streams...</p>
    );
  if (isError)
    return (
      <p className="p-6 text-red-500 font-medium">
        Error loading system transaction histories.
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          System Transactions
        </h1>
        <p className="text-sm text-gray-500">
          Master ledger monitoring overall global checkout logs and shipping
          fulfillment statuses.
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-600">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Book Name</th>
                <th className="p-4">User (Client ID)</th>
                <th className="p-4">Librarian</th>
                <th className="p-4">Time</th>
                <th className="p-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {transactions?.map((tx) => (
                <tr
                  key={tx._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Transaction ID */}
                  <td
                    className="p-4 font-mono text-xs text-gray-400 select-all max-w-[120px] truncate"
                    title={tx._id}
                  >
                    {tx._id}
                  </td>

                  {/* Transaction Amount */}
                  <td className="p-4 font-semibold text-gray-900">
                    ${Number(tx.amountPaid).toFixed(2)}
                  </td>

                  {/* Book Name */}
                  <td
                    className="p-4 font-bold text-indigo-950 max-w-[200px] truncate"
                    title={tx.bookName}
                  >
                    {tx.bookName}
                  </td>

                  {/* User (Client ID) */}
                  <td
                    className="p-4 text-xs font-mono text-gray-500 truncate max-w-[100px]"
                    title={tx.userId}
                  >
                    {tx.userId}
                  </td>

                  {/* Librarian */}
                  <td className="p-4 font-medium text-gray-700">
                    {tx.librarianName}
                  </td>

                  {/* Time */}
                  <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>

                  {/* Delivery Status (Color Coded badges with NO action buttons) */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        tx.deliveryStatus === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : tx.deliveryStatus === "dispatched"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          tx.deliveryStatus === "pending"
                            ? "bg-amber-500"
                            : tx.deliveryStatus === "dispatched"
                              ? "bg-blue-500"
                              : "bg-green-500"
                        }`}
                      />
                      {tx.deliveryStatus}
                    </span>
                  </td>
                </tr>
              ))}

              {transactions?.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-12 text-center text-gray-400 italic"
                  >
                    No financial transaction events identified across the
                    network data streams.
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

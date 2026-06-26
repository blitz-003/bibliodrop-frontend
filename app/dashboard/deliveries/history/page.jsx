"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export default function UserDeliveryHistoryPage() {
  const {
    data: deliveries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-deliveries"],
    queryFn: async () => {
      const { data: tokenData } = await authClient.getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deliveries/history`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to load delivery history");
      }

      return res.json();
    },
  });

  if (isLoading) return <p className="p-6">Loading delivery records...</p>;
  if (isError)
    return (
      <p className="p-6 text-red-500">Error fetching delivery tracking logs.</p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-black mb-6 text-gray-900">
        Your Delivery History
      </h1>
      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4">Book Title</th>
                <th className="p-4">Delivery Fee</th>
                <th className="p-4">Request Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {deliveries?.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-900">{d.bookTitle}</td>
                  <td className="p-4">${d.deliveryFee.toFixed(2)}</td>
                  <td className="p-4">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        d.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : d.status === "dispatched"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-gray-400">
                    {d.transactionId}
                  </td>
                </tr>
              ))}
              {deliveries?.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-400 italic"
                  >
                    No delivery history records identified.
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

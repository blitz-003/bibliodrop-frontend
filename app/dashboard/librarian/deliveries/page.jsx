"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ManageDeliveriesPage() {
  const queryClient = useQueryClient();

  const {
    data: queue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["librarian-deliveries"],
    queryFn: () =>
      fetch("http://localhost:5000/deliveries/manage", {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, nextStatus }) => {
      const res = await fetch(`http://localhost:5000/deliveries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Status transformation failure.");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Delivery status updated successfully!");
      queryClient.invalidateQueries(["librarian-deliveries"]);
    },
    onError: () => toast.error("Could not alter workflow item step."),
  });

  if (isLoading) return <p className="p-6">Loading pipeline streams...</p>;
  if (isError)
    return (
      <p className="p-6 text-red-500">Fulfillment stream collection failed.</p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-black mb-6 text-gray-900">
        Manage Deliveries Dashboard
      </h1>
      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4">Client Name</th>
                <th className="p-4">Book Name</th>
                <th className="p-4">Order Date</th>
                <th className="p-4">Delivery Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {queue?.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-900">
                    {d.userName}
                  </td>
                  <td className="p-4 font-bold text-indigo-950">
                    {d.bookTitle}
                  </td>
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
                  <td className="p-4 text-center">
                    {d.status === "pending" && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: d._id,
                            nextStatus: "dispatched",
                          })
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        Mark Dispatch
                      </button>
                    )}
                    {d.status === "dispatched" && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: d._id,
                            nextStatus: "delivered",
                          })
                        }
                        className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs px-4 py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        Deliver Button
                      </button>
                    )}
                    {d.status === "delivered" && (
                      <span className="text-xs font-medium text-gray-400 italic">
                        No Action Required
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

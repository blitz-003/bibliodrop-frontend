"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Spinner, Chip } from "@heroui/react";

export default function InventoryClient({ user }) {
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["inventory", user?.id],

    queryFn: async () => {
      const res = await fetch("http://localhost:5000/dashboard/inventory", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed");

      return res.json();
    },
  });

  const safeBooks = Array.isArray(books) ? books : [];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">📦 Inventory Dashboard</h1>

      {/* CARD WRAPPER */}
      <Card className="p-4">
        {isLoading ? (
          <div className="flex justify-center p-10">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3">Title</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {safeBooks.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{b.title}</td>
                    <td>{b.category}</td>
                    <td>{b.stock}</td>
                    <td>
                      <Chip
                        color={
                          b.availabilityStatus === "available"
                            ? "success"
                            : "warning"
                        }
                        size="sm"
                      >
                        {b.availabilityStatus}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

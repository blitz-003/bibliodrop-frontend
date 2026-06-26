"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Spinner, Chip } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function InventoryClient({ user }) {
  const { data: books = [], isLoading } = useQuery({
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
  console.log(books);
  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold">Inventory Dashboard</h1>

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
                  <th className="p-1">Title</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {safeBooks.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-white">
                    <td className="p-3 font-medium">{b.title}</td>
                    <td>{b.category}</td>
                    <td>{b.totalStock}</td>
                    <td>
                      {b.publishStatus == "pending" ? (
                        <Chip color={"warning"}>{b.publishStatus}</Chip>
                      ) : (
                        <Chip color={"success"}>{b.publishStatus}</Chip>
                      )}
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

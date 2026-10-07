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

export default function ManageDeliveriesPage() {
  const queryClient = useQueryClient();

  const {
    data: queue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["librarian-deliveries"],
    queryFn: async () => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deliveries/manage`,
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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, nextStatus }) => {
      const { data } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deliveries/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Status transformation failure.");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Delivery status updated successfully!");

      queryClient.invalidateQueries({
        queryKey: ["librarian-deliveries"],
      });
    },

    onError: () => {
      toast.error("Could not alter workflow item step.");
    },
  });

  if (isLoading)
    return (
      <div aria-busy="true" className="mx-auto w-full max-w-app">
        <span className="sr-only">Loading pipeline streams</span>
      </div>
    );
  if (isError)
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Fulfillment stream collection failed
          </p>
        </Alert>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Manage Deliveries Dashboard"
        subtitle="Dispatch and confirm book deliveries across the branch queue."
      />

      <DataTable>
        <DataTableHead>
          <tr>
            <DataTableTh>Client Name</DataTableTh>
            <DataTableTh>Book Name</DataTableTh>
            <DataTableTh>Order Date</DataTableTh>
            <DataTableTh>Delivery Status</DataTableTh>
            <DataTableTh align="center">Actions</DataTableTh>
          </tr>
        </DataTableHead>

        <DataTableBody>
          {queue?.map((d) => (
            <DataTableRow key={d._id}>
              <DataTableCell className="font-medium text-content-strong">
                {d?.userName || "Deleted User"}
              </DataTableCell>
              <DataTableCell className="font-semibold text-indigo-950">
                {d?.bookTitle || "Unknown Book"}
              </DataTableCell>
              <DataTableCell>
                {new Date(d.createdAt).toLocaleDateString()}
              </DataTableCell>
              <DataTableCell>
                <StatusBadge kind="delivery" value={d.status} />
              </DataTableCell>
              <DataTableCell align="center">
                {d.status === "pending" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: d._id,
                        nextStatus: "dispatched",
                      })
                    }
                  >
                    Mark Dispatch
                  </Button>
                )}
                {d.status === "dispatched" && (
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: d._id,
                        nextStatus: "delivered",
                      })
                    }
                  >
                    Mark Deliver
                  </Button>
                )}
                {d.status === "delivered" && (
                  <span className="text-xs font-medium text-content-subtle italic">
                    No Action Required
                  </span>
                )}
              </DataTableCell>
            </DataTableRow>
          ))}

          {(!queue || queue.length === 0) && (
            <DataTableEmpty colSpan={5}>
              No deliveries in the fulfillment queue.
            </DataTableEmpty>
          )}
        </DataTableBody>
      </DataTable>
    </div>
  );
}


"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  Alert,
  Button,
  PageHeader,
  Modal,
  Select,
  DataTable,
  DataTableHead,
  DataTableTh,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableEmpty,
  StatusBadge,
} from "@/components/ui";

export default function AdminManageUsersPage() {
  const queryClient = useQueryClient();

  // Modal State Management
  const [roleModalUser, setRoleModalUser] = useState(null); // Holds user object when opening change-role popup
  const [deleteModalUser, setDeleteModalUser] = useState(null); // Holds user object when opening delete confirmation
  const [selectedRole, setSelectedRole] = useState("");

  // 1. Fetch Users Directory via TanStack Query
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to load user records");
      }

      return res.json();
    },
  });

  // 2. Mutation: Change User Role

  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const { data: tokenData } = await authClient.getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ role }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update user role");
      }

      return res.json();
    },

    onSuccess: (data) => {
      toast.success(
        `Role of ${data.email} changed from ${roleModalUser.role} to ${data.role}`,
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      setRoleModalUser(null);
    },

    onError: () => {
      toast.error("Could not modify authorization rules.");
    },
  });

  // 3. Mutation: Delete Account Permanent Clean-up

  const deleteAccountMutation = useMutation({
    mutationFn: async (id) => {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Deletion failed.");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Account successfully purged from system.");

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      setDeleteModalUser(null);
    },

    onError: (err) => {
      toast.error(err.message || "Failed to remove account.");
    },
  });
  if (isLoading)
    return (
      <div aria-busy="true" className="mx-auto w-full max-w-app">
        <span className="sr-only">Gathering directory streams</span>
      </div>
    );
  if (isError)
    return (
      <div className="mx-auto w-full max-w-app">
        <Alert tone="danger" className="mx-auto max-w-md inline-flex">
          <p className="text-base font-semibold">
            Error loading user profile directory
          </p>
        </Alert>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Manage Users"
        subtitle="View registered accounts, alter account group privileges, or revoke system access logs."
      />

      {/* Main Data Table */}
      <DataTable minWidth="min-w-[680px]">
        <DataTableHead>
          <tr>
            <DataTableTh>Username</DataTableTh>
            <DataTableTh>Email</DataTableTh>
            <DataTableTh>Role</DataTableTh>
            <DataTableTh>Joined</DataTableTh>
            <DataTableTh align="center">Actions</DataTableTh>
          </tr>
        </DataTableHead>

        <DataTableBody>
          {users?.map((u) => (
            <DataTableRow key={u._id}>
              <DataTableCell className="font-semibold text-content-strong">
                {u.name || "No Username"}
              </DataTableCell>
              <DataTableCell className="font-medium text-content-muted">
                {u.email}
              </DataTableCell>
              <DataTableCell>
                <StatusBadge kind="role" value={u.role} />
              </DataTableCell>
              <DataTableCell className="text-xs text-content-subtle">
                {u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString()
                  : "N/A"}
              </DataTableCell>
              <DataTableCell align="center">
                <span className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setRoleModalUser(u);
                      setSelectedRole(u.role);
                    }}
                  >
                    Change Role
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteModalUser(u)}
                  >
                    Delete Account
                  </Button>
                </span>
              </DataTableCell>
            </DataTableRow>
          ))}

          {(!users || users.length === 0) && (
            <DataTableEmpty colSpan={5}>
              No registered accounts found.
            </DataTableEmpty>
          )}
        </DataTableBody>
      </DataTable>

      {/* Pop-up Window 1: Change Role Dropdown Modal */}
      <Modal
        open={Boolean(roleModalUser)}
        onClose={() => setRoleModalUser(null)}
        title="Change Role"
        description={
          roleModalUser
            ? `Modifying access groups for ${roleModalUser.email}`
            : undefined
        }
        closeLabel="Cancel"
        confirmLabel="Save Changes"
        confirmVariant="brand"
        confirming={changeRoleMutation.isPending}
        onConfirm={() =>
          changeRoleMutation.mutate({
            id: roleModalUser?._id,
            role: selectedRole,
          })
        }
      >
        <Select
          label="Select Access Pool"
          name="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="librarian">Librarian</option>
        </Select>
      </Modal>

      {/* Pop-up Window 2: Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteModalUser)}
        onClose={() => setDeleteModalUser(null)}
        title="Are you sure you want to delete this account?"
        description={
          deleteModalUser ? (
            <>
              This will permanently delete the access history configuration
              profile for <b>{deleteModalUser.email}</b>.
            </>
          ) : undefined
        }
        icon={AlertTriangle}
        tone="danger"
        closeLabel="No, Cancel"
        confirmLabel="Yes, Delete"
        confirmVariant="dangerSolid"
        confirming={deleteAccountMutation.isPending}
        onConfirm={() => deleteAccountMutation.mutate(deleteModalUser?._id)}
      />
    </div>
  );
}


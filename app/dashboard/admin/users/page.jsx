"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

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
      <p className="p-6 text-gray-500 font-medium">
        Gathering directory streams...
      </p>
    );
  if (isError)
    return (
      <p className="p-6 text-red-500 font-medium">
        Error loading user profile directory.
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Manage Users
        </h1>
        <p className="text-sm text-gray-500">
          View registered accounts, alter account group privileges, or revoke
          system access logs.
        </p>
      </div>

      {/* Main Data Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-600">
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {users?.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 font-bold text-gray-900">
                    {u.name || "No Username"}
                  </td>
                  <td className="p-4 font-medium text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "librarian"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setRoleModalUser(u);
                        setSelectedRole(u.role);
                      }}
                      className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => setDeleteModalUser(u)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
                    >
                      Delete Account
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop-up Window 1: Change Role Dropdown Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">Change Role</h2>
              <p className="text-xs text-gray-400">
                Modifying access groups for {roleModalUser.email}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Select Access Pool
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-indigo-500 font-medium text-gray-700"
              >
                <option value="user">User</option>
                <option value="librarian">Librarian</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRoleModalUser(null)}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  changeRoleMutation.mutate({
                    id: roleModalUser._id,
                    role: selectedRole,
                  })
                }
                disabled={changeRoleMutation.isPending}
                className="w-1/2 bg-[#635BFF] hover:bg-[#5249E0] text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {changeRoleMutation.isPending ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Window 2: Delete Confirmation Modal */}
      {deleteModalUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl border border-gray-100 p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Are you sure you want to delete this account?
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                This will permanently delete the access history configuration
                profile for <b>{deleteModalUser.email}</b>.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteModalUser(null)}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={() =>
                  deleteAccountMutation.mutate(deleteModalUser._id)
                }
                disabled={deleteAccountMutation.isPending}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {deleteAccountMutation.isPending
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

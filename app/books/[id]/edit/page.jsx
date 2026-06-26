"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// Initialize a standalone Query Client instance specifically for this route tree
const standaloneEditClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function EditBookFormContent() {
  const { id } = useParams();
  const router = useRouter();

  // 1. Fetch current book specifications to seed our input states
  const { data, isLoading, isError } = useQuery({
    queryKey: ["edit-book-lookup", id],
    queryFn: async () => {
      const { data, error } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Could not retrieve catalog item specifications.");
      }

      return res.json();
    },
  });

  // 2. Initialize local form state lazily from the fetched data
  // This completely eliminates the need for a useEffect hook and prevents render loops!
  const [formData, setFormData] = useState(null);

  if (data?.book && !formData) {
    setFormData({
      title: data.book.title || "",
      author: data.book.author || "",
      description: data.book.description || "",
      category: data.book.category || "",
      deliveryFee: data.book.deliveryFee || 0,
    });
  }

  // 3. Mutation: Send updated data properties to the backend API routing pipeline
  const updateBookMutation = useMutation({
    mutationFn: async (updatedFields) => {
      const { data, error } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify(updatedFields),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        throw new Error(
          errorData.message || "Server rejected document modifications.",
        );
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Book specifications updated successfully!");
      router.push(`/books/${id}`); // Force redirect back to updated details view
    },
    onError: (err) => toast.error(err.message),
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBookMutation.mutate(formData);
  };

  if (isLoading || !formData) {
    return (
      <p className="p-6 text-gray-500 font-medium">
        Loading asset parameters...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="p-6 text-red-500 font-medium">
        Error mapping catalog configuration metrics.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 text-gray-700 font-sans">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Edit Catalog Volume</h1>
        <p className="text-xs text-gray-400">
          Modify data variables index record for catalog index reference token{" "}
          {id}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white border border-gray-100 p-6 rounded-xl shadow-sm"
      >
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Book Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Author
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleInputChange("author", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Category Tag
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Delivery Logistics Access Fee ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.deliveryFee}
            onChange={(e) =>
              handleInputChange("deliveryFee", Number(e.target.value))
            }
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Manifest Overview Description
          </label>
          <textarea
            rows="5"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateBookMutation.isPending}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
          >
            {updateBookMutation.isPending
              ? "Saving Schema Changes..."
              : "Save Modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditBookPage() {
  return (
    <QueryClientProvider client={standaloneEditClient}>
      <EditBookFormContent />
    </QueryClientProvider>
  );
}

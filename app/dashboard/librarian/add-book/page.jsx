"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createBook } from "@/services/bookService";
import { PageHeader, Panel, Button, Input, Textarea, Spinner } from "@/components/ui";

export default function AddBookPage() {
  const router = useRouter();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Object URLs are revoked whenever the preview is replaced or the page
  // unmounts, so a librarian picking several covers in a row does not leak the
  // earlier blobs for the life of the session.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const form = e.target;

    const title = form.title?.value;
    const author = form.author?.value;
    const category = form.category?.value;
    const description = form.description?.value;
    const stock = form.stock?.value;
    const deliveryFee = form.deliveryFee?.value;

    if (!title || !author || !category) {
      toast.error("Title, Author and Category are required.");
      return;
    }

    if (!image) {
      toast.error("Please upload a cover image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("description", description || "");
    formData.append("stock", stock || 0);
    formData.append("deliveryFee", deliveryFee || 0);
    formData.append("coverImage", image);

    const toastId = toast.loading("Uploading book...");

    try {
      setIsSubmitting(true);

      await createBook(formData);

      toast.success("Book uploaded successfully!", {
        id: toastId,
      });

      // Small delay so the user can see the success toast
      setTimeout(() => {
        router.push("/dashboard/librarian/inventory");
      }, 800);
    } catch (err) {
      console.error(err);

      toast.error(err.message || "Failed to upload book.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-full min-w-0 space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Add New Book"
        subtitle="Upload a cover and describe the book to add it to the catalog."
      />

      <Panel className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="w-full">
            <label className="mb-3 block font-medium" htmlFor="coverImage">
              Cover Image
            </label>

            <label
              htmlFor="coverImage"
              className="block cursor-pointer"
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.querySelector("input")?.click();
                }
              }}
            >
              <div className="flex h-[220px] w-full items-center justify-center overflow-hidden rounded-card border-2 border-dashed border-border transition hover:border-accent focus-within:border-accent">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Cover Preview"
                    width={800}
                    height={220}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div aria-hidden="true" className="mb-2 text-5xl">
                      馃摎
                    </div>
                    <p className="font-medium">Click to upload</p>
                    <p className="text-sm text-content-muted">
                      JPG, PNG, WEBP
                    </p>
                  </div>
                )}
              </div>
            </label>

            <input
              id="coverImage"
              type="file"
              accept="image/*"
              hidden
              disabled={isSubmitting}
              onChange={handleImageChange}
            />
          </div>

          <Input
            label="Book Title"
            name="title"
            placeholder="Atomic Habits"
            required
            disabled={isSubmitting}
          />

          <Input
            label="Author"
            name="author"
            placeholder="James Clear"
            required
            disabled={isSubmitting}
          />

          <Input
            label="Category"
            name="category"
            placeholder="Self Help"
            required
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              type="number"
              label="Stock"
              name="stock"
              placeholder="10"
              min="0"
              disabled={isSubmitting}
            />

            <Input
              type="number"
              label="Delivery Fee"
              name="deliveryFee"
              placeholder="50"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            rows={8}
            placeholder="Write a short description about the book..."
            disabled={isSubmitting}
          />

          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Spinner className="h-4 w-4 text-current" aria-hidden="true" />
            )}
            <span>{isSubmitting ? "Uploading Book..." : "Add Book"}</span>
          </Button>
        </form>
      </Panel>
    </div>
  );
}


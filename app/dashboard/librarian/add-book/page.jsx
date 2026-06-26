"use client";

import { useState } from "react";
import { Card, Input, TextArea, Button, Spinner } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createBook } from "@/services/bookService";

export default function AddBookPage() {
  const router = useRouter();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <Card className="border border-default-200 p-6 shadow-xl md:p-8">
        <h1 className="mb-8 text-3xl font-semibold">Add New Book</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="w-full">
            <label className="mb-3 block font-medium">Cover Image</label>

            <label htmlFor="coverImage" className="block cursor-pointer">
              <div className="flex h-[220px] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-default-300 transition hover:border-primary">
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
                    <div className="mb-2 text-5xl">📚</div>
                    <p className="font-medium">Click to upload</p>
                    <p className="text-sm text-default-500">JPG, PNG, WEBP</p>
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

          {/* Title */}
          <div className="w-full">
            <label className="mb-2 block font-medium">Book Title</label>
            <Input
              className="w-full"
              name="title"
              variant="bordered"
              placeholder="Atomic Habits"
              required
              isDisabled={isSubmitting}
            />
          </div>

          {/* Author */}
          <div className="w-full">
            <label className="mb-2 block font-medium">Author</label>
            <Input
              className="w-full"
              name="author"
              variant="bordered"
              placeholder="James Clear"
              required
              isDisabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div className="w-full">
            <label className="mb-2 block font-medium">Category</label>
            <Input
              className="w-full"
              name="category"
              variant="bordered"
              placeholder="Self Help"
              required
              isDisabled={isSubmitting}
            />
          </div>

          {/* Stock */}
          <div className="w-full">
            <label className="mb-2 block font-medium">Stock</label>
            <Input
              className="w-full"
              name="stock"
              type="number"
              variant="bordered"
              placeholder="10"
              isDisabled={isSubmitting}
            />
          </div>

          {/* Delivery Fee */}
          <div className="w-full">
            <label className="mb-2 block font-medium">Delivery Fee</label>
            <Input
              className="w-full"
              name="deliveryFee"
              type="number"
              variant="bordered"
              placeholder="50"
              isDisabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="w-full">
            <label className="mb-2 block font-medium">Description</label>
            <TextArea
              className="w-full"
              name="description"
              variant="bordered"
              minRows={8}
              placeholder="Write a short description about the book..."
              isDisabled={isSubmitting}
            />
          </div>

          <Button
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Spinner size="sm" color="current" />
                <span>Uploading Book...</span>
              </div>
            ) : (
              "Add Book"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}

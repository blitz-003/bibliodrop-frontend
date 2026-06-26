"use client";

import { useState } from "react";
import { Card, Input, TextArea, Button } from "@heroui/react";
import Image from "next/image";
import { createBook } from "@/services/bookService";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const title = form.title?.value;
    const author = form.author?.value;
    const category = form.category?.value;
    const description = form.description?.value;
    const stock = form.stock?.value;
    const deliveryFee = form.deliveryFee?.value;

    // required validations
    if (!title || !author || !category) {
      alert("Title, Author, Category are required");
      return;
    }

    if (!image) {
      alert("Cover image is required");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("description", description || "");
    formData.append("stock", stock || 0);
    formData.append("deliveryFee", deliveryFee || 0);

    // IMPORTANT: must match backend multer field name
    formData.append("coverImage", image);

    try {
      console.log([...formData.entries()]);

      // example if you later use API:
      await createBook(formData);

      alert("Book ready to submit!");
      router.push("/dashboard/librarian/inventory");
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <Card className="p-6 md:p-8 shadow-xl border border-default-200">
        <h1 className="text-3xl font-bold mb-8">Add New Book</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="w-full">
            <label className="font-medium block mb-3">Cover Image</label>

            <label htmlFor="coverImage" className="cursor-pointer block">
              <div className="border-2 border-dashed border-default-300 rounded-2xl h-[220px] w-full flex items-center justify-center overflow-hidden hover:border-primary transition">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Cover Preview"
                    width={800}
                    height={220}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl mb-2">📚</div>
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
              onChange={handleImageChange}
            />
          </div>

          {/* Title */}
          <div className="w-full">
            <label className="font-medium block mb-2">Book Title</label>
            <Input
              className="w-full"
              name="title"
              variant="bordered"
              placeholder="Atomic Habits"
              required
            />
          </div>

          {/* Author */}
          <div className="w-full">
            <label className="font-medium block mb-2">Author</label>
            <Input
              className="w-full"
              name="author"
              variant="bordered"
              placeholder="James Clear"
              required
            />
          </div>

          {/* Category */}
          <div className="w-full">
            <label className="font-medium block mb-2">Category</label>
            <Input
              className="w-full"
              name="category"
              variant="bordered"
              placeholder="Self Help"
            />
          </div>

          {/* Stock */}
          <div className="w-full">
            <label className="font-medium block mb-2">Stock</label>
            <Input
              className="w-full"
              name="stock"
              type="number"
              variant="bordered"
              placeholder="10"
            />
          </div>

          {/* Delivery Fee */}
          <div className="w-full">
            <label className="font-medium block mb-2">Delivery Fee</label>
            <Input
              className="w-full"
              name="deliveryFee"
              type="number"
              variant="bordered"
              placeholder="50"
            />
          </div>

          {/* Description */}
          <div className="w-full">
            <label className="font-medium block mb-2">Description</label>
            <TextArea
              className="w-full"
              name="description"
              variant="bordered"
              minrows={18}
              placeholder="Write a short description about the book..."
            />
          </div>

          <Button color="primary" size="lg" type="submit" className="w-full">
            Add Book
          </Button>
        </form>
      </Card>
    </div>
  );
}

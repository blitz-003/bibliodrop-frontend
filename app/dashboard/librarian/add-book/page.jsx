"use client";

import { useState } from "react";
import { createBook } from "@/services/bookService";

export default function AddBookPage() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.author || !form.category) {
      alert("Title, Author, Category are required");
      return;
    }

    if (!file) {
      alert("Cover image is required");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("description", form.description);
    formData.append("category", form.category);

    // file field name MUST match backend multer/cloudinary config
    formData.append("coverImage", file);

    try {
      setLoading(true);
      await createBook(formData);

      alert("Book created successfully!");

      // reset form
      setForm({
        title: "",
        author: "",
        description: "",
        category: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Book title"
          className="w-full border p-2 rounded"
          required
        />

        {/* AUTHOR */}
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author"
          className="w-full border p-2 rounded"
          required
        />

        {/* CATEGORY */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g. Business, Programming)"
          className="w-full border p-2 rounded"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={4}
        />

        {/* FILE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
          required
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

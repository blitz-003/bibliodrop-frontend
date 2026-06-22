"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/services/bookService";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function BookDetailsPage() {
  const params = useParams();
  const id = params.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
  });

  if (isLoading) return <p className="p-5">Loading book...</p>;
  if (isError) return <p className="p-5">Error loading book</p>;
  console.log(data);

  return (
    <div className="p-6 flex justify-center">
      {/* MAIN CARD */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT: IMAGE (50%) */}
        <div className="md:w-1/2 w-full">
          <Image
            src={data.coverImage}
            alt={data.title}
            width={800}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT: CONTENT (50%) */}
        <div className="md:w-1/2 w-full p-6 flex flex-col gap-3">
          <h1 className="text-2xl font-bold">{data.title}</h1>

          <p className="text-gray-600">
            <b>Author:</b> {data.author}
          </p>

          <p className="text-gray-600">
            <b>Category:</b> {data.category}
          </p>

          <p className="text-green-600 font-semibold">
            <b>Fee:</b> ${data.fee}
          </p>

          <p className="text-gray-700 leading-relaxed">
            <b>Description:</b> {data.description}
          </p>

          <p className={data.available ? "text-green-600" : "text-red-500"}>
            Status: {data.available ? "Available" : "Checked Out"}
          </p>

          {/* BUTTON */}
          <button
            disabled={!data.available}
            className={`mt-4 px-4 py-2 rounded-md text-white ${
              data.available
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Request Delivery (Stripe later)
          </button>
        </div>
      </div>
    </div>
  );
}

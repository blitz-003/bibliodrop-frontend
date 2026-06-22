"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, Button } from "@heroui/react";

export default function BookCard({ book }) {
  console.log(book);
  return (
    <Card className="flex flex-row gap-4 p-4 items-center shadow-md hover:shadow-lg transition">
      {/* LEFT IMAGE */}
      <Image
        src={book.coverImage}
        alt={book.title}
        width={96}
        height={128}
        className="rounded-md object-cover"
      />

      {/* RIGHT CONTENT */}
      <div className="flex flex-col flex-1 gap-1">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        <p className="text-sm text-gray-500">{book.category}</p>
        <p className="text-sm font-medium text-green-600">
          ${book.deliveryFee}
        </p>

        <Link href={`/books/${book._id}`}>
          <Button size="sm" color="primary" className="mt-2 w-fit">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}

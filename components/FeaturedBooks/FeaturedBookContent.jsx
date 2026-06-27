"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck } from "lucide-react";

export default function FeaturedBookContent({ book }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 40,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -40,
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="max-w-xl"
    >
      {/* Category */}

      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
        {book.category}
      </p>

      {/* Title */}

      <h2 className="text-6xl font-bold leading-tight text-slate-900">
        {book.title}
      </h2>

      {/* Author */}

      <p className="mt-4 text-xl text-slate-600">
        by <span className="font-semibold">{book.author}</span>
      </p>

      {/* Description */}

      <p className="mt-8 text-lg leading-9 text-slate-600">
        {book.description}
      </p>

      {/* Stats */}

      <div className="mt-10 flex flex-wrap gap-8">
        <div className="flex items-center gap-2">
          <Star size={20} className="fill-yellow-400 text-yellow-400" />

          <span className="font-semibold">{book.averageRating.toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Truck size={20} />

          <span>৳ {book.deliveryFee}</span>
        </div>

        <div className="font-medium text-slate-600">
          {book.availableStock} available
        </div>
      </div>

      {/* Button */}

      <Link
        href={`/books/${book._id}`}
        className="group mt-12 inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-white transition hover:scale-105"
      >
        View Details
        <ArrowRight
          size={20}
          className="transition group-hover:translate-x-1"
        />
      </Link>
    </motion.div>
  );
}

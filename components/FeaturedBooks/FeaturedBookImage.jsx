"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function FeaturedBookImage({ book }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1.08,
        filter: "blur(18px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        scale: 0.94,
        filter: "blur(18px)",
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative h-[700px] w-full overflow-hidden rounded-[32px] bg-slate-100 shadow-2xl"
    >
      <Image
        src={book.coverImage}
        alt={book.title}
        fill
        priority
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {/* Category Badge */}
      <div className="absolute left-8 top-8 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold backdrop-blur-md">
        {book.category}
      </div>

      {/* Stock Badge */}
      <div className="absolute bottom-8 left-8 rounded-full bg-black/70 px-5 py-2 text-sm font-medium text-white backdrop-blur-md">
        {book.availableStock} copies available
      </div>
    </motion.div>
  );
}

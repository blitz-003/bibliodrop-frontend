"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Fetch function for TanStack Query
const fetchFeaturedBooks = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const res = await fetch(`${baseUrl}/books?limit=6`);
  if (!res.ok) throw new Error("Failed to fetch featured books");
  return res.json();
};

export default function FeaturedBooks() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const timerRef = useRef(null);

  // TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["featuredBooks"],
    queryFn: fetchFeaturedBooks,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  // Extract array safely from API response structure
  const books = data?.books || [];

  // Resets and restarts the 7-second automatic sliding timer
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (books.length || 1));
    }, 7000); // Updated to 7 seconds
  };

  useEffect(() => {
    if (books && books.length > 0) {
      resetTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [books, currentIndex]);

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-stone-400 font-light">
        Loading premium selections...
      </div>
    );
  }

  if (error || !books || books.length === 0) return null;

  const currentBook = books?.[currentIndex];

  // Safe-guard against transitioning indexes
  if (!currentBook) return null;

  const bookTitle = currentBook.title || "Untitled Selection";
  const bookAuthor = currentBook.author || "Unknown Author";
  const bookCategory = currentBook.category || "General";
  const bookDescription = currentBook.description || "No description provided.";
  const bookImage =
    currentBook.coverImage || currentBook.image || currentBook.img;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  // Blur + Dissolve (Fade out) crossfade configuration
  const crossfadeVariants = {
    enter: {
      opacity: 0,
      filter: "blur(15px)",
      scale: 1.02,
    },
    center: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      filter: "blur(15px)", // Smooth dissolve blur
      scale: 0.98,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <section className="relative py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto border-t border-b border-stone-200/60 my-12">
      {/* Dynamic Section Title Heading */}
      <div className="mb-4">
        <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold block mb-2">
          Curated Showcase
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900">
          Featured Books
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-20">
        {/* LEFT COLUMN: Visual Media Frame matching image_7f19c7.png */}
        <div className="lg:col-span-6 relative aspect-square w-full max-w-[500px] mx-auto lg:max-w-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={crossfadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-300/50 bg-stone-100"
            >
              {bookImage && (
                <img
                  src={bookImage}
                  alt={bookTitle}
                  className="w-full h-full object-cover object-center filter contrast-[102%] min-h-[500px]"
                  loading="eager"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Media Typography Content & Controls */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 min-h-[350px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={crossfadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
                Category / {bookCategory}
              </span>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-stone-900 leading-tight tracking-tight">
                {bookTitle}
              </h3>
              <p className="text-sm font-mono text-stone-500 italic">
                by {bookAuthor}
              </p>
              <p className="text-stone-600 font-light leading-relaxed text-base max-w-xl">
                {bookDescription}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Actions Container */}
          <div className="pt-8 flex items-center justify-between border-t border-stone-200 max-w-xl">
            <Link
              href={`/browse-books?id=${currentBook.id || currentBook._id}`}
            >
              <button className="px-6 py-3 border border-stone-900 bg-stone-900 text-stone-100 hover:bg-transparent hover:text-stone-900 transition-all duration-300 text-xs font-semibold uppercase tracking-wider">
                Discover Book
              </button>
            </Link>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                aria-label="Previous Book"
                className="w-10 h-10 border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-all duration-200 bg-white shadow-sm active:scale-95"
              >
                ←
              </button>
              <span className="text-xs font-mono font-medium text-stone-400 w-12 text-center">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(books.length).padStart(2, "0")}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next Book"
                className="w-10 h-10 border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-all duration-200 bg-white shadow-sm active:scale-95"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

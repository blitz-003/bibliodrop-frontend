"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import TeaserSection from "@/components/TeaserSection";

// --- PREMIUM IMAGES (Books, Coffee, Cafes) ---
const IMAGES = {
  heroBg:
    "https://images.unsplash.com/photo-1706195546853-a81b6a190daf?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Woman reading book with a coffee mug beside
  book1:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
  book2:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
  book3:
    "https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?auto=format&fit=crop&q=80&w=600",
  book4:
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
  book5:
    "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=600",
  book6:
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
  cafe1:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
  lib1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  lib2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  lib3: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
};

const mockBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    img: IMAGES.book1,
  },
  {
    id: 2,
    title: "Dune: Deluxe Edition",
    author: "Frank Herbert",
    category: "Sci-Fi",
    img: IMAGES.book2,
  },
  {
    id: 3,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    category: "Fiction",
    img: IMAGES.book3,
  },
  {
    id: 4,
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Sci-Fi",
    img: IMAGES.book4,
  },
  {
    id: 5,
    title: "The Art of Coffee",
    author: "R. Hoffmann",
    category: "Lifestyle",
    img: IMAGES.book5,
  },
  {
    id: 6,
    title: "Selected Poems",
    author: "Rainer Rilke",
    category: "Poetry",
    img: IMAGES.book6,
  },
];

const librarians = [
  {
    name: "Sarah Jenkins",
    deliveries: 142,
    role: "South District Curator",
    img: IMAGES.lib1,
  },
  {
    name: "Michael Chen",
    deliveries: 128,
    role: "Metro Hub Supervisor",
    img: IMAGES.lib2,
  },
  {
    name: "Amara Okafor",
    deliveries: 115,
    role: "East Side Archivist",
    img: IMAGES.lib3,
  },
];

const categories = [
  "Fiction",
  "Sci-Fi",
  "Academic",
  "History",
  "Poetry",
  "Design",
];

// --- FAMER MOTION CONFIGS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: "60%", filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
  });

  // Scaled Up Airplane Motion Paths
  const planeY = useTransform(
    smoothProgress,
    [0, 0.25, 0.7, 1],
    ["0vh", "35vh", "75vh", "110vh"],
  );
  const planeX = useTransform(
    smoothProgress,
    [0, 0.35, 0.7, 1],
    ["0vw", "12vw", "-8vw", "4vw"],
  );
  const planeRotate = useTransform(
    smoothProgress,
    [0, 0.4, 0.8, 1],
    [15, 35, -20, 10],
  );
  const planeScale = useTransform(
    smoothProgress,
    [0, 0.2, 1],
    [1.1, 0.85, 0.65],
  );

  return (
    <div className="relative min-h-screen bg-slate-50 text-stone-900 overflow-x-hidden  antialiased selection:bg-slate-50">
      {/* ================= RE-SIZED LARGER PAPER AIRPLANE LAYER ================= */}
      <motion.div
        style={{ y: planeY, x: planeX, rotate: planeRotate, scale: planeScale }}
        className="fixed top-28 left-6 md:left-16 z-50 pointer-events-none drop-shadow-2xl text-stone-800 will-change-transform"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </motion.div>

      {/* ================= 1. CINEMATIC HERO SECTION ================= */}
      {/* UPDATED: Removed border, forced layout to top of window */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Panel */}
        {/* UPDATED: lg:pt-36 pushes content down safely past your floating navbar */}
        <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-28 pb-16 lg:pt-36 lg:pb-24 z-10 bg-slate-50 backdrop-blur-sm lg:backdrop-blur-none">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl space-y-4"
          >
            <div className="overflow-hidden py-1">
              <motion.h1
                variants={textRevealVariants}
                className="text-5xl sm:text-6xl md:text-7xl font-serif font-light text-stone-900 leading-[1.05]"
              >
                Your Local Library, <br />
                <span className="italic font-normal text-stone-500 font-serif">
                  Delivered to You.
                </span>
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.p
                variants={textRevealVariants}
                className="text-lg text-stone-600 font-light leading-relaxed"
              >
                Skip the lines. We connect local independent bookstores and town
                archives straight to your coffee table, maintaining the rich
                texture of fresh book pages without the commute.
              </motion.p>
            </div>

            <div className="overflow-hidden pt-2 flex items-center gap-3">
              <Link href="/browse-books">
                <motion.button
                  variants={textRevealVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-stone-900 text-stone-100 rounded-none shadow-sm hover:bg-stone-800 transition-all duration-300 text-sm font-medium uppercase"
                >
                  Browse Books
                </motion.button>
              </Link>
              <motion.span
                variants={textRevealVariants}
                className="text-xs uppercase  text-stone-400 font-semibold hidden sm:inline-block"
              >
                Est. 2026 — Archive Edition
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Right Panel: Atmospheric Woman Reading Picture */}
        {/* UPDATED: Added lg:col-span-7, lg:p-6 (space on all sides), and rounded-3xl corners */}
        <div className="absolute inset-0 lg:relative lg:col-span-6 h-full w-full -z-10 lg:z-0 lg:p-6 lg:pl-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F5] via-[#FAF9F5]/40 to-transparent lg:hidden z-10" />
          <img
            src={IMAGES.heroBg}
            alt="A woman reading a book with a steaming hot coffee cup alongside"
            className="w-full h-full object-cover object-center filter contrast-[102%] lg:rounded-3xl shadow-md"
          />
        </div>
      </section>

      {/* ================= 2. FEATURED BOOKS GRID ================= */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase  text-stone-400 font-semibold">
              New Arrivals
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mt-2">
              Latest From The Archives
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-xs font-light">
            Fresh physical editions uploaded from regional libraries this
            morning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {mockBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: index * 0.05,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              <Link href="/browse-books" className="block cursor-pointer group">
                {/* Immersive Book Framing with Rounded Left Spine */}
                <div className="overflow-hidden bg-stone-100 aspect-[4/5] relative mb-6 rounded-2xl">
                  <Image
                    src={book.img}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[10%] rounded-2xl"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] uppercase  px-3 py-1 font-medium text-stone-700">
                    {book.category}
                  </div>
                </div>

                <div className="flex justify-between items-start pt-2 border-t border-stone-200">
                  <div>
                    <h3 className="font-serif text-xl font-light text-stone-900 group-hover:text-stone-600 transition-colors duration-300">
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-light  mt-1">
                      by {book.author}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    #00{book.id}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= 3. SPLIT STICKY EDITORIAL SECTION ================= */}
      <section className="border-t border-b border-stone-200/80 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 relative">
          {/* Left Panel: Frozen Sticky Content */}
          <div className="md:sticky md:top-32 h-fit space-y-6 self-start">
            <span className="text-xs uppercase  text-stone-400 font-semibold">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-stone-900 leading-tight">
              Top Curators & <br />
              Local Providers
            </h2>
            <p className="text-stone-600 font-light max-w-md leading-relaxed text-sm md:text-base">
              Meet the meticulous specialists managing your literary drops.
              These designated library couriers pack each edition perfectly
              alongside custom protective sleeves to preserve the physical text
              ecosystem.
            </p>
            <div className="pt-6 hidden md:block max-w-sm rounded-none overflow-hidden aspect-video border border-stone-200">
              <img
                src={IMAGES.cafe1}
                alt="Cafe brewing workspace"
                className="w-full h-full object-cover filter contrast-[95%]"
              />
            </div>
          </div>

          {/* Right Panel: Scrollable Curators List */}
          <div className="space-y-6">
            {librarians.map((lib, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-none border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group"
              >
                <Link
                  href="/browse-books"
                  className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full cursor-pointer"
                >
                  {/* Portrait Avatar */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={lib.img}
                      alt={lib.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-xl font-serif font-light text-stone-900 group-hover:text-stone-600 transition-colors duration-200">
                        {lib.name}
                      </h3>
                      <span className="text-[11px] font-mono  bg-stone-100 text-stone-600 px-2 py-0.5 self-center sm:self-auto rounded-full">
                        Verified Courier
                      </span>
                    </div>
                    <p className="text-xs text-stone-400  uppercase font-medium">
                      {lib.role}
                    </p>
                    <p className="text-sm font-light text-stone-600 pt-2 border-t border-stone-100 mt-2">
                      Successfully routed{" "}
                      <strong className="font-medium text-stone-900">
                        {lib.deliveries} books
                      </strong>{" "}
                      this quarter.
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. CURATED CATEGORIES GRID ================= */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase  text-stone-400 font-semibold">
            Taxonomy
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mt-2">
            Search via Core Disciplines
          </h2>
          <p className="text-stone-500 font-light text-sm mt-3">
            Filter immediately down into specialized literary ecosystems via
            automated metadata routing rules.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Link
                href="/browse-books"
                className="bg-white border border-stone-200 px-4 py-8 text-center hover:border-stone-800 transition-colors duration-300 block group cursor-pointer"
              >
                <span className="block font-serif text-lg font-light text-stone-800 group-hover:text-stone-900">
                  {cat}
                </span>
                <span className="text-[10px] font-mono  text-stone-400 block mt-2 uppercase">
                  Explore →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

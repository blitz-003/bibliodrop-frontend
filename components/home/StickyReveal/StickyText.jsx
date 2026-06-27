"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function StickyText({ item, index, total }) {
  return (
    <div className="flex h-full items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -40,
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-600">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>

          <p className="mt-6 text-lg font-semibold text-violet-600">
            {item.subtitle}
          </p>

          <h2 className="mt-4 text-6xl font-bold leading-tight text-slate-900">
            {item.title}
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600">
            {item.description}
          </p>

          <button className="mt-10 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700">
            Explore Books
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function StickyContent({ item, index, total }) {
  return (
    <div className="flex h-full items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -50,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="max-w-xl"
        >
          {/* Progress */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1,
              duration: 0.5,
            }}
            className="text-lg font-semibold text-violet-600"
          >
            {item.subtitle}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
            }}
            className="mt-4 text-5xl font-bold leading-tight text-slate-900"
          >
            {item.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.6,
            }}
            className="mt-8 text-lg leading-8 text-slate-600"
          >
            {item.description}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

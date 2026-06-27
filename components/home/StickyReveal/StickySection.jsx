"use client";

import { motion } from "framer-motion";

export default function StickySection({ section, index, active, setActive }) {
  return (
    <section
      className="h-screen flex items-center"
      onMouseEnter={() => setActive(index)}
    >
      <motion.div
        onViewportEnter={() => setActive(index)}
        viewport={{ amount: 0.5 }}
        initial={{ opacity: 0.2, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <span className="text-primary font-semibold text-lg">0{index + 1}</span>

        <h2 className="mt-4 text-5xl font-bold leading-tight">
          {section.title}
        </h2>

        <p className="mt-6 text-lg text-gray-600 leading-8">
          {section.description}
        </p>
      </motion.div>
    </section>
  );
}

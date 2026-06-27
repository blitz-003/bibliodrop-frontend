"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function StickyImage({ item }) {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          className="absolute inset-0"
          initial={{
            opacity: 0,
            scale: 1.15,
            filter: "blur(20px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            filter: "blur(20px)",
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

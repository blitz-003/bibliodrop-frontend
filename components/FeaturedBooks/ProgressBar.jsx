"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ progress, current, total }) {
  return (
    <div className="mt-12">
      {/* Number */}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">
          Featured Books
        </p>

        <p className="text-sm font-semibold text-slate-500">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </p>
      </div>

      {/* Track */}

      <div className="h-[4px] w-full overflow-hidden rounded-full bg-slate-200">
        <motion.div
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            ease: "linear",
            duration: 0.1,
          }}
          className="h-full rounded-full bg-slate-900"
        />
      </div>
    </div>
  );
}

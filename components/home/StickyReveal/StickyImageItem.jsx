"use client";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";

export default function StickyImageItem({ item, progress, start, end }) {
  const opacity = useTransform(
    progress,
    [start, (start + end) / 2, end],
    [1, 1, 0],
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <Image src={item.image} alt={item.title} fill className="object-cover" />
    </motion.div>
  );
}

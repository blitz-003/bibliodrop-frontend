"use client";

import { useEffect, useState } from "react";

export default function useScrollProgress(ref, totalItems) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();

      const totalHeight = rect.height - window.innerHeight;

      const progress = Math.min(Math.max(-rect.top / totalHeight, 0), 0.9999);

      const index = Math.floor(progress * totalItems);

      setActiveIndex(index);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref, totalItems]);

  return activeIndex;
}

"use client";

import { useEffect, useRef } from "react";

export default function Trigger({ index, setActiveIndex }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveIndex(index);
        }
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="h-full" />;
}

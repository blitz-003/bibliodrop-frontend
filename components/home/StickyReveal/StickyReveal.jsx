"use client";

import { useRef, useState } from "react";

import StickyImage from "./StickyImage";
import TextSection from "./TextSection";
import revealItems from "./data";

export default function StickyReveal() {
  const container = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section ref={container} className="relative bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-24">
        {/* LEFT */}

        <div className="sticky top-0 flex h-screen items-center">
          <StickyImage item={revealItems[activeIndex]} />
        </div>

        {/* RIGHT */}

        <div>
          {revealItems.map((item, index) => (
            <TextSection
              key={item.id}
              item={item}
              index={index}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

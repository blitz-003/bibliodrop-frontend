"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextSection({ item, index, setActiveIndex }) {
  const ref = useRef(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,

      start: "top center",

      end: "bottom center",

      onEnter: () => setActiveIndex(index),

      onEnterBack: () => setActiveIndex(index),
    });
  }, []);

  return (
    <section ref={ref} className="flex h-screen items-center">
      <div className="max-w-xl">
        <p className="font-semibold text-violet-600">{item.subtitle}</p>

        <h2 className="mt-5 text-6xl font-bold leading-tight">{item.title}</h2>

        <p className="mt-8 text-lg leading-8 text-gray-600">
          {item.description}
        </p>
      </div>
    </section>
  );
}

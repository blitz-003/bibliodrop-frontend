"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NavigationButtons({ swiper }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => swiper.current.slidePrev()}
        className="flex h-12 w-12 items-center justify-center rounded-full border transition hover:scale-110 hover:bg-black hover:text-white"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={() => swiper.current.slideNext()}
        className="flex h-12 w-12 items-center justify-center rounded-full border transition hover:scale-110 hover:bg-black hover:text-white"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

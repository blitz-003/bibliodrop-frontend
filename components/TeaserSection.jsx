"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const BIBLIODROP_STEPS = [
  {
    id: 1,
    title: "Algorithmic Metadata Matching",
    subtitle:
      "Syncing regional library archives with your personal reading taste profile.",
    content:
      "Our system runs automated cross-routing metadata rules. By scanning your historical category choices, Bibliodrop maps specialized independent bookstores and town archives to pinpoint exact physical editions sitting idle on shelves near you.",
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop", // Moody library aisle
  },
  {
    id: 2,
    title: "Sleeve Sealed & Curated",
    subtitle:
      "Maintaining the rich texture of fresh paper pages in climate-controlled shielding.",
    content:
      "Once routed, your book is handled by a dedicated district curator. Every edition is vacuum-dusted, placed in a custom anti-microbial protective sleeve, and packed securely alongside insulated seals to protect against humidity or transit scuffs.",
    img: "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1200&auto=format&fit=crop", // Books stacked neatly / parcel packing
  },
  {
    id: 3,
    title: "Autonomous Local Dropoff",
    subtitle:
      "Real-time dispatching straight to your coffee table, skipping the commute.",
    content:
      "Your drop is assigned to a verified regional courier or premium micro-transit drone route. Seamlessly track your package as it bridges the gap from dark archives to your hands within hours, leaving zero carbon footprints behind.",
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop", // Cozy coffee table reading setup
  },
];

export default function TeaserSection() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll progression through the whole section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Split the 100% scroll path evenly between 3 items
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      setActiveIndex(0);
    } else if (latest >= 0.33 && latest < 0.66) {
      setActiveIndex(1);
    } else {
      setActiveIndex(2);
    }
  });

  return (
    <div
      ref={containerRef}
      className="relative min-h-[300vh] bg-[#FAF9F5] text-stone-900  selection:bg-stone-200 antialiased border-t border-stone-200"
    >
      {/* Pinned Sticky Layout Frame */}
      <div className="sticky top-0 lg:h-screen w-full flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center py-20 lg:py-0">
          {/* LEFT PANEL: CONTENT ENGINE */}
          <div className="col-span-1 lg:col-span-5 space-y-24 lg:space-y-[45vh] py-[5vh] lg:py-[25vh] max-h-none lg:max-h-[75vh] lg:overflow-y-auto no-scrollbar">
            {BIBLIODROP_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`transition-all duration-500 space-y-5 ${
                  activeIndex === index
                    ? "opacity-100"
                    : "opacity-100 lg:opacity-20 lg:blur-[1px]"
                }`}
              >
                {/* Mobile Responsive Image (Only renders layout-down) */}
                <div className="block lg:hidden w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-stone-200 mb-6">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-xs uppercase  text-stone-400 font-mono font-semibold">
                  Phase 0{step.id} — The Pipeline
                </span>

                <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 leading-tight">
                  {step.title}
                </h2>

                <h3 className="text-base font-normal text-stone-600 font-serif italic leading-relaxed">
                  {step.subtitle}
                </h3>

                <p className="text-stone-500 font-light leading-relaxed text-sm sm:text-base">
                  {step.content}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL: FLOATING PREMIUM MEDIA CANVAS (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-7 relative aspect-[4/3] w-full p-4">
            <div className="w-full h-full relative bg-stone-100 rounded-[2.5rem] overflow-hidden border border-stone-200/80 shadow-xl shadow-stone-900/5">
              {BIBLIODROP_STEPS.map((step, index) => {
                const isActive = activeIndex === index;
                return (
                  <motion.div
                    key={step.id}
                    className="absolute inset-0 w-full h-full"
                    initial={{
                      opacity: 0,
                      scale: 1.08,
                      filter: "brightness(0.9) blur(4px)",
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 1.08,
                      filter: isActive
                        ? "brightness(1) blur(0px)"
                        : "brightness(0.9) blur(4px)",
                    }}
                    transition={{
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ pointerEvents: isActive ? "auto" : "none" }}
                  >
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full h-full object-cover filter contrast-[102%] brightness-[98%]"
                    />
                    {/* Atmospheric luxury shadow mask */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent mix-blend-multiply" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

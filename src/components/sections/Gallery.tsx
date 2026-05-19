"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { getGalleryItems, GalleryItem } from "@/lib/store";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Fetch gallery items from store (includes default mock images we copied!)
    setItems(getGalleryItems());

    const handleSync = () => {
      setItems(getGalleryItems());
    };

    window.addEventListener("rhythm_night_db_sync", handleSync);
    return () => {
      window.removeEventListener("rhythm_night_db_sync", handleSync);
    };
  }, []);

  const openLightbox = (item: GalleryItem, index: number) => {
    setActiveItem(item);
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveItem(null);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % items.length;
    setActiveItem(items[nextIdx]);
    setActiveIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + items.length) % items.length;
    setActiveItem(items[prevIdx]);
    setActiveIndex(prevIdx);
  };

  // We can duplicate the items list to create an infinite scroll illusion!
  const sliderItems = [...items, ...items, ...items];

  return (
    <>
      <section
        id="gallery"
        className="relative py-24 sm:py-32 w-full overflow-hidden border-t border-purple-500/10"
      >
        {/* Glowing orbs */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-pink-900/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[-10%] w-[50vw] h-[50vw] bg-purple-900/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full mb-12">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-xs uppercase font-mono font-bold tracking-[0.25em] text-cyan-400 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> Captures
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Moments From Previous Events
            </h2>
            <p className="text-white/60 font-light max-w-xl text-sm sm:text-base">
              Music, memories, and innovation together. Where Technology Meets Entertainment.
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full mt-1" />
          </div>
        </div>

        {/* HORIZONTAL AUTO-SCROLL SLIDER CONTAINER */}
        <div
          className="relative w-full overflow-hidden py-4 select-none cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Infinite row scrolling wrapper using CSS Keyframes */}
          <div
            className={`flex gap-6 w-max ${isHovered ? "[animation-play-state:paused]" : ""}`}
            style={{
              animation: "marquee 35s linear infinite",
            }}
          >
            {sliderItems.map((item, index) => {
              const originalIndex = index % items.length;
              return (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => openLightbox(item, originalIndex)}
                  className="w-[280px] sm:w-[350px] aspect-[4/3] relative rounded-2xl overflow-hidden border border-purple-500/20 bg-[#090526]/40 backdrop-blur-md transition-all duration-500 group shadow-lg hover:border-purple-400/60 hover:shadow-[0_10px_30px_rgba(139,92,246,0.2)] hover:scale-[1.01] flex-shrink-0"
                >
                  <Image
                    src={item.url}
                    alt={item.caption}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-[1px]"
                    sizes="350px"
                  />
                  {/* Motion Blur Screen */}
                  <div className="absolute inset-0 bg-[#030014]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Glass Card Caption Hover Panel */}
                  <div className="absolute bottom-4 inset-x-4 p-3 bg-[#07041c]/80 border border-purple-500/20 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-20 flex justify-between items-center">
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="text-[8px] uppercase tracking-wider text-pink-400 font-mono font-bold block">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-medium text-white block truncate">
                        {item.caption}
                      </span>
                    </div>
                    <Maximize2 className="w-3.5 h-3.5 text-purple-300 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CSS keyframe inject for seamless layout movement */}
        <style jsx global>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 3));
            }
          }
        `}</style>
      </section>

      {/* LIGHTBOX DIALOG OVERLAY */}
      <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg px-6"
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-50 bg-[#0e0a29] border border-purple-500/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 text-white/70 hover:text-white transition-colors p-3 z-50 bg-[#0e0a29] border border-purple-500/20 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 sm:right-8 text-white/70 hover:text-white transition-colors p-3 z-50 bg-[#0e0a29] border border-purple-500/20 rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Main lightbox content */}
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl w-full flex flex-col items-center gap-4 relative"
              >
                <div className="w-full aspect-[4/3] max-h-[70vh] relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl bg-black">
                  <Image
                    src={activeItem.url}
                    alt={activeItem.caption}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
                
                {/* Caption Detail card */}
                <div className="px-6 py-4 bg-[#0a0526]/80 border border-purple-500/20 rounded-2xl backdrop-blur-md max-w-xl w-full text-center">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-[9px] uppercase font-bold tracking-wider text-cyan-400 mb-1">
                    <Compass className="w-3 h-3 text-cyan-400 animate-spin-slow" /> {activeItem.category}
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold font-display text-white mt-1">
                    {activeItem.caption}
                  </h4>
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest mt-2">
                    Where Technology Meets Entertainment
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

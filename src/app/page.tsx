"use client";

import { useEffect, useState } from "react";
import { getAnnouncements, Announcement } from "@/lib/store";
import { Info, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Features from "@/components/sections/Features";
import Gallery from "@/components/sections/Gallery";
import {
  CountdownTimer,
  Performers,
  EventTimeline,
  Sponsors,
  Pricing,
  FAQ,
  Testimonials,
  Contact,
  Footer
} from "@/components/sections/ExtraSections";

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeAnnIndex, setActiveAnnIndex] = useState<number>(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Initial fetch of active database broadcasts
    setAnnouncements(getAnnouncements());

    // Dynamic state synchronizer for tab synchronization
    const handleStorage = () => {
      setAnnouncements(getAnnouncements());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <>
      {/* Floating navigation header */}
      <Navbar />

      {/* GORGEOUS CYBER BROADCAST BANNER */}
      <AnimatePresence>
        {visible && announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-[85px] left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl"
          >
            <div className={`p-3.5 rounded-2xl border backdrop-blur-xl flex items-center justify-between gap-4 shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 ${
              announcements[activeAnnIndex].type === "alert"
                ? "bg-pink-950/40 border-pink-500/30 text-pink-200"
                : announcements[activeAnnIndex].type === "success"
                ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-200"
                : "bg-purple-950/40 border-purple-500/30 text-purple-200"
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                {/* Ticker Icon */}
                <div className={`p-2 rounded-xl shrink-0 ${
                  announcements[activeAnnIndex].type === "alert"
                    ? "bg-pink-500/20 text-pink-400"
                    : announcements[activeAnnIndex].type === "success"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-purple-500/20 text-purple-400"
                }`}>
                  {announcements[activeAnnIndex].type === "alert" ? (
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                  ) : announcements[activeAnnIndex].type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4 animate-pulse" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold tracking-widest uppercase font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 shrink-0">
                      Broadcast Alert
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm truncate">
                      {announcements[activeAnnIndex].title}
                    </h4>
                  </div>
                  <p className="text-[11px] opacity-80 font-light truncate mt-0.5 max-w-[500px]">
                    {announcements[activeAnnIndex].content}
                  </p>
                </div>
              </div>

              {/* Navigation and Dismiss */}
              <div className="flex items-center gap-2 shrink-0">
                {announcements.length > 1 && (
                  <button
                    onClick={() => setActiveAnnIndex((prev) => (prev + 1) % announcements.length)}
                    className="text-[9px] font-bold font-mono tracking-wider bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors text-white"
                  >
                    Next ({activeAnnIndex + 1}/{announcements.length})
                  </button>
                )}
                <button
                  onClick={() => setVisible(false)}
                  className="p-1.5 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 text-white/60 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main continuous storytelling scroll container */}
      <main className="relative w-full flex flex-col items-center">
        
        {/* 1. Immersive Hero visualizer */}
        <Hero />

        {/* 2. Scroll Countdown Ticker */}
        <div className="w-full px-6 mt-16 md:mt-24 relative z-30">
          <CountdownTimer />
        </div>

        {/* 3. Storytelling About grid */}
        <About />

        {/* 4. Tilted glow Feature cards */}
        <Features />

        {/* 5. Horizontal infinite Gallery slider */}
        <Gallery />

        {/* 6. Neon Lineup perform highlights */}
        <Performers />

        {/* 7. Progression Schedule Timeline */}
        <EventTimeline />

        {/* 8. Glowing Sponsors scroller */}
        <Sponsors />

        {/* 9. Ticket access matrix */}
        <Pricing />

        {/* 10. Reviews & Testimonials slider */}
        <Testimonials />

        {/* 11. Custom Accordion FAQ */}
        <FAQ />

        {/* 12. Inquiry & Collaboration forms */}
        <Contact />

      </main>

      {/* Glowing cyber footer */}
      <Footer />
    </>
  );
}

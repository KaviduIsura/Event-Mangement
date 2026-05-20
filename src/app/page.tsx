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

      {/* COMPACT FLOATING CYBER BROADCAST ALERT BOX */}
      <AnimatePresence>
        {visible && announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-24 right-4 sm:right-6 md:right-8 z-50 w-[320px] max-w-[90vw]"
          >
            <div className={`p-4 rounded-2xl border backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 relative flex flex-col gap-2.5 ${
              announcements[activeAnnIndex].type === "alert"
                ? "bg-[#0c041c]/95 border-pink-500/30 text-pink-200 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                : announcements[activeAnnIndex].type === "success"
                ? "bg-[#040c1c]/95 border-cyan-500/30 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                : "bg-[#08041c]/95 border-purple-500/30 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
            }`}>
              
              {/* Header with Icon, Ticker, and close action button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    announcements[activeAnnIndex].type === "alert"
                      ? "bg-pink-500/20 text-pink-400"
                      : announcements[activeAnnIndex].type === "success"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}>
                    {announcements[activeAnnIndex].type === "alert" ? (
                      <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                    ) : announcements[activeAnnIndex].type === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Info className="w-3.5 h-3.5 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[9px] font-bold tracking-widest uppercase font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/80">
                    {announcements[activeAnnIndex].type === "alert" ? "SYSTEM ALERT" : "BROADCAST"}
                  </span>
                </div>
                
                <button
                  onClick={() => setVisible(false)}
                  className="p-1 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 text-white/50 hover:text-white transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text content details */}
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-white tracking-wide leading-tight">
                  {announcements[activeAnnIndex].title}
                </h4>
                <p className="text-[11px] opacity-75 font-light text-slate-300 leading-relaxed break-words">
                  {announcements[activeAnnIndex].content}
                </p>
              </div>

              {/* Navigation controls footer */}
              {announcements.length > 1 && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-[9px] text-slate-500 font-mono">
                    Message {activeAnnIndex + 1} of {announcements.length}
                  </span>
                  <button
                    onClick={() => setActiveAnnIndex((prev) => (prev + 1) % announcements.length)}
                    className="text-[9px] font-bold font-mono tracking-wider bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg hover:bg-purple-500/20 text-purple-300 transition-all duration-300"
                  >
                    Next Broadcast &rarr;
                  </button>
                </div>
              )}
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

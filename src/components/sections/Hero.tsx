"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Ticket, Sparkles, Compass, Music, Radio } from "lucide-react";
import RsvpModal from "./RsvpModal";

// Load 3D interactive particle waves dynamically to bypass Next.js server-side compilation issues
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function Hero() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [visualizerHovered, setVisualizerHovered] = useState(false);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("about");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // Soundwave bars
  const totalBars = 36;
  const barVariants = {
    animate: (i: number) => ({
      scaleY: [1, i % 2 === 0 ? 3.5 : 2.5, 1],
      transition: {
        duration: visualizerHovered ? 0.6 : 1.2,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: i * 0.04,
      },
    }),
  };

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-12 overflow-hidden"
      >
        {/* Live 3D particle topography grid in background */}
        <Hero3D />

        {/* Glowing Spotlight Radial Overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-[60%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Decorative Floating Cyber Music Notes */}
        <div className="absolute inset-0 pointer-events-none z-0 select-none">
          {[
            { Icon: Music, top: "20%", left: "15%", delay: 0, size: 24, color: "text-purple-500/30" },
            { Icon: Radio, top: "70%", left: "10%", delay: 2, size: 28, color: "text-cyan-500/20" },
            { Icon: Sparkles, top: "35%", right: "12%", delay: 1, size: 20, color: "text-pink-500/30" },
            { Icon: Music, top: "75%", right: "18%", delay: 3, size: 22, color: "text-purple-400/25" },
          ].map((item, index) => {
            const { Icon, top, left, right, delay, size, color } = item;
            return (
              <motion.div
                key={index}
                className={`absolute ${color}`}
                style={{ top, left, right }}
                animate={{
                  y: [0, -25, 0],
                  rotate: [0, 15, -15, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                }}
              >
                <Icon style={{ width: size, height: size }} />
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
          
          {/* Text Side */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 backdrop-blur-md text-xs uppercase tracking-widest font-semibold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
              Music • Energy • Innovation • Community
            </motion.div>

            {/* Cinematic Hero Title */}
            <div className="space-y-2">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-cyan-400 font-display uppercase tracking-[0.25em] font-bold text-xs sm:text-sm"
              >
                Fundraiser for the IT Innovation Fair
              </motion.h3>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-7xl font-display font-black tracking-tight leading-none"
              >
                🎶 Rhythm Night{" "}
                <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                  2026
                </span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/70 max-w-xl text-base sm:text-lg leading-relaxed font-light"
            >
              Join us for an unforgettable musical night filled with live performances, visual spectacles, and community action to support future technology builders at the IT Innovation Fair 2026.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2"
            >
              <Button
                onClick={() => setRsvpOpen(true)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold font-display tracking-wider rounded-xl h-12 px-8 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300 border border-purple-400/20"
              >
                <Ticket className="w-5 h-5 mr-2 animate-pulse" />
                Reserve Seat
              </Button>
              
              <Button
                onClick={handleExploreClick}
                variant="outline"
                className="bg-[#0c082b]/80 border-purple-500/20 hover:bg-purple-950/20 hover:border-purple-500/50 text-purple-200 h-12 px-8 rounded-xl font-semibold tracking-wide"
              >
                <Compass className="w-5 h-5 mr-2 text-cyan-400 animate-spin-slow" />
                Explore Event
              </Button>
            </motion.div>
          </div>

          {/* Interactive Music Wave Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[300px] sm:min-h-[400px] lg:min-h-auto w-full group"
          >
            {/* Visualizer Frame */}
            <div
              onMouseEnter={() => setVisualizerHovered(true)}
              onMouseLeave={() => setVisualizerHovered(false)}
              className="relative p-8 rounded-3xl bg-[#090526]/40 border border-purple-500/20 backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.1)] w-full max-w-[450px] aspect-square flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Internal glowing elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
              
              {/* Card Header details */}
              <div className="flex justify-between items-start z-10">
                <div className="flex gap-2.5 items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <div className="text-[10px] uppercase font-mono tracking-widest text-white/50">Frequency Active</div>
                </div>
                <Radio className="w-5 h-5 text-purple-400 group-hover:animate-bounce" />
              </div>

              {/* Central Soundwave Grid */}
              <div className="h-44 w-full flex items-center justify-center gap-1.5 px-4 relative z-10">
                {Array.from({ length: totalBars }).map((_, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={barVariants}
                    animate="animate"
                    className="w-1.5 rounded-full"
                    style={{
                      height: `${Math.floor(25 + Math.random() * 20)}%`,
                      originY: 0.5,
                      background: `linear-gradient(to top, #8b5cf6, #ec4899, #06b6d4)`,
                    }}
                  />
                ))}
              </div>

              {/* Sound wave metadata overlay */}
              <div className="flex justify-between items-end z-10 border-t border-purple-500/10 pt-4 mt-2">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/30 block">Audio Engine</span>
                  <span className="text-xs font-semibold font-mono text-cyan-300">NEURAL-SYNTH v20.26</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-pink-400">
                  {visualizerHovered ? "TURBO MODE ACTIVE" : "HOVER TO ACCELERATE"}
                </span>
              </div>
            </div>
            
            {/* Outer neon sound ring */}
            <div className="absolute inset-0 max-w-[450px] aspect-square rounded-3xl border border-dashed border-cyan-500/25 animate-spin-slow pointer-events-none" />
          </motion.div>
        </div>

        {/* Floating Mouse Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer z-10"
          onClick={handleExploreClick}
        >
          <div className="w-6 h-10 rounded-full border border-purple-500/30 flex justify-center p-1.5 bg-purple-950/20 backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce" />
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-purple-300/60">
            Scroll to begin
          </span>
        </motion.div>
      </section>

      {/* Booking RSVP Modal */}
      <RsvpModal isOpen={rsvpOpen} onOpenChange={setRsvpOpen} />
    </>
  );
}

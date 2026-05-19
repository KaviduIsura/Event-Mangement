"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Radio, Heart, ArrowUpRight, Sparkles } from "lucide-react";
import RsvpModal from "./RsvpModal";

export default function Features() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [ticketType, setTicketType] = useState<"general" | "vip">("general");

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  const [card1Style, setCard1Style] = useState({});
  const [card2Style, setCard2Style] = useState({});

  // High fidelity card tilt & spotlight tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardNum: number, ref: React.RefObject<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate relative to card
    const y = e.clientY - rect.top;  // y coordinate relative to card
    
    const xPct = (x / rect.width - 0.5) * 12; // tilt limit x
    const yPct = (y / rect.height - 0.5) * -12; // tilt limit y

    const setStyle = cardNum === 1 ? setCard1Style : setCard2Style;

    setStyle({
      transform: `perspective(1000px) rotateX(${yPct}deg) rotateY(${xPct}deg) scale3d(1.02, 1.02, 1.02)`,
      "--spotlight-x": `${x}px`,
      "--spotlight-y": `${y}px`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = (cardNum: number) => {
    const setStyle = cardNum === 1 ? setCard1Style : setCard2Style;
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out",
    });
  };

  return (
    <>
      <section
        id="features"
        className="relative py-24 sm:py-32 w-full overflow-hidden"
      >
        {/* Dynamic spot gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-16 space-y-3">
            <span className="text-xs uppercase font-mono font-bold tracking-[0.25em] text-pink-400 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Event Features
            </h2>
            <p className="text-white/60 font-light max-w-xl text-sm sm:text-base">
              A premium synthesis of next-generation entertainment and direct philanthropic support.
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-1" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch max-w-5xl mx-auto">
            
            {/* Feature Card 1: Live Band Performances */}
            <div
              ref={card1Ref}
              onMouseMove={(e) => handleMouseMove(e, 1, card1Ref)}
              onMouseLeave={() => handleMouseLeave(1)}
              style={card1Style as React.CSSProperties}
              className="group relative rounded-3xl bg-[#090526]/40 border border-purple-500/20 backdrop-blur-xl p-5 overflow-hidden flex flex-col justify-between transition-shadow duration-500 shadow-[0_15px_35px_rgba(3,0,20,0.3)] hover:shadow-[0_15px_35px_rgba(139,92,246,0.15)] select-none"
            >
              {/* Radial Glow Spotlight Tracker Overlay */}
              <div className="absolute inset-0 z-0 bg-[radial-gradient(350px_circle_at_var(--spotlight-x,50%)_var(--spotlight-y,50%),rgba(139,92,246,0.08),transparent_80%)] pointer-events-none" />

              {/* Graphic wrapper */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full border border-purple-500/10 z-10 mb-6">
                <Image
                  src="/images/band.png"
                  alt="Live Band Performance"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090526]/80 via-transparent to-transparent opacity-60" />
                
                {/* Floating badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/30 text-[10px] font-bold uppercase tracking-wider text-purple-300 backdrop-blur-sm shadow-md">
                  <Radio className="w-3 h-3 text-pink-400 animate-pulse" /> Live Symphony
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-3 z-10 px-1.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    Live Band Performances
                    <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-white/60 font-light text-sm sm:text-base leading-relaxed">
                    Experience electrifying, futuristic synth-rock performances and student acoustic sets under cinematic holographic stage visualizers.
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      setTicketType("general");
                      setRsvpOpen(true);
                    }}
                    className="w-full h-11 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 font-semibold font-display tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:border-purple-400"
                  >
                    View Lineup & Schedule
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Card 2: Supporting Future Innovators */}
            <div
              ref={card2Ref}
              onMouseMove={(e) => handleMouseMove(e, 2, card2Ref)}
              onMouseLeave={() => handleMouseLeave(2)}
              style={card2Style as React.CSSProperties}
              className="group relative rounded-3xl bg-[#090526]/40 border border-cyan-500/20 backdrop-blur-xl p-5 overflow-hidden flex flex-col justify-between transition-shadow duration-500 shadow-[0_15px_35px_rgba(3,0,20,0.3)] hover:shadow-[0_15px_35px_rgba(34,211,238,0.15)] select-none"
            >
              {/* Radial Glow Spotlight Tracker Overlay */}
              <div className="absolute inset-0 z-0 bg-[radial-gradient(350px_circle_at_var(--spotlight-x,50%)_var(--spotlight-y,50%),rgba(34,211,238,0.08),transparent_80%)] pointer-events-none" />

              {/* Graphic wrapper */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full border border-cyan-500/10 z-10 mb-6">
                <Image
                  src="/images/tech.png"
                  alt="Student IT displays"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090526]/80 via-transparent to-transparent opacity-60" />
                
                {/* Floating badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-[10px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-sm shadow-md">
                  <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Direct Impact
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-3 z-10 px-1.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    Supporting Innovators
                    <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-white/60 font-light text-sm sm:text-base leading-relaxed">
                    Every ticket funds cash grants, robotics gear, and scholarship stalls, directly fueling young tech leaders at the IT Innovation Fair 2026.
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      setTicketType("vip");
                      setRsvpOpen(true);
                    }}
                    className="w-full h-11 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 font-semibold font-display tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:border-cyan-400"
                  >
                    Reserve Impact Seat
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Booking RSVP Modal */}
      <RsvpModal isOpen={rsvpOpen} onOpenChange={setRsvpOpen} defaultTicketType={ticketType} />
    </>
  );
}

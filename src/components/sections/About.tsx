"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Trophy, Lightbulb, Users, ArrowRight } from "lucide-react";

export default function About() {
  const timelinePoints = [
    {
      Icon: Lightbulb,
      title: "Funding Workshops",
      desc: "Providing resources for deep-tech student workshops in AI, web3, and robotics.",
      color: "from-cyan-400 to-blue-500",
    },
    {
      Icon: Trophy,
      title: "Exhibits & Awards",
      desc: "Direct support for cash grants for the most innovative student hardware and software exhibits.",
      color: "from-purple-400 to-pink-500",
    },
    {
      Icon: Users,
      title: "Future Scholarships",
      desc: "Creating access to sponsor networks and tech incubator programs for deserving innovators.",
      color: "from-pink-400 to-orange-500",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 w-full overflow-hidden border-t border-purple-500/10"
    >
      {/* Background light beam vectors */}
      <div className="absolute top-1/2 left-[-10%] w-[50vw] h-[50vw] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-[5%] w-[45vw] h-[45vw] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Light Beam Ray */}
      <div className="absolute top-[-20%] right-[20%] w-[2px] h-[150vh] bg-gradient-to-b from-purple-500/20 via-cyan-500/20 to-transparent rotate-[35deg] transform-gpu pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-16 space-y-3">
          <span className="text-xs uppercase font-mono font-bold tracking-[0.25em] text-purple-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> Our Mission
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            A Night of Music & Innovation
          </h2>
          <div className="w-20 h-[3px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        </div>

        {/* Storytelling Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <p className="text-white/80 font-light text-lg leading-relaxed">
              <span className="font-semibold text-purple-300 font-display">Rhythm Night 2026</span> is a premium cinematic fundraising event organized specifically to support the upcoming annual <span className="font-semibold text-cyan-300">IT Innovation Fair</span>. 
            </p>
            <p className="text-white/70 font-light text-base leading-relaxed">
              This exciting evening bridges the gap between digital creativity and technical engineering, bringing together students, musical artists, tech leaders, and corporate sponsors under one electric atmosphere.
            </p>
            <p className="text-white/60 font-light text-base leading-relaxed">
              Every ticket, seat reservation, and corporate sponsorship contribution translates directly into scholarships, exhibition grants, and high-tech equipment for the young technological builders of tomorrow.
            </p>

            {/* Timeline features list */}
            <div className="space-y-5 pt-4">
              {timelinePoints.map((item, index) => {
                const { Icon, title, desc, color } = item;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="flex gap-4 p-4 rounded-2xl bg-[#090526]/30 border border-purple-500/10 hover:border-purple-500/20 hover:bg-[#090526]/50 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} text-white shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {title}
                      </h4>
                      <p className="text-white/50 text-xs sm:text-sm font-light">
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Floating Image Block */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            
            {/* Background design elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute inset-0 border border-cyan-500/10 rounded-full scale-75 animate-pulse pointer-events-none" />
            
            {/* Cyber floating card holding generated image */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 1, type: "spring", stiffness: 50 }}
              className="p-3 bg-[#090526]/60 border border-purple-500/20 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(3,0,20,0.4)] max-w-md w-full relative z-10 hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)] transition-shadow duration-500 group"
            >
              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden aspect-square border border-purple-500/10">
                <Image
                  src="/images/tech.png"
                  alt="Student IT innovators displaying tech"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 50vw"
                  priority
                />
                
                {/* Neon overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-transparent to-transparent opacity-60" />
                
                {/* Small float details */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-[#07041c]/80 backdrop-blur-md border border-purple-500/20 px-4 py-2.5 rounded-xl z-20">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-cyan-400 block font-mono font-bold">Innovation Focus</span>
                    <span className="text-xs font-semibold font-display text-white">Robotics & AI displays</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Decorative side brackets */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl-lg pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-pink-400 rounded-br-lg pointer-events-none" />
            </motion.div>
            
            {/* Orbiting dotted lines */}
            <div className="absolute -inset-4 border border-dashed border-purple-500/15 rounded-full rotate-45 pointer-events-none animate-spin-slow" />
          </div>
        </div>
      </div>
    </section>
  );
}

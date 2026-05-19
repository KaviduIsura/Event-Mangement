"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Music,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Mail,
  Send,
  MessageSquare,
  Award
} from "lucide-react";
import RsvpModal from "./RsvpModal";
import { getPerformers, getSponsors, Performer, Sponsor } from "@/lib/store";

// ==========================================
// 1. COUNTDOWN TIMER
// ==========================================
export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: December 18, 2026
    const targetDate = new Date("2026-12-18T19:30:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days, color: "text-purple-400" },
    { label: "Hours", value: timeLeft.hours, color: "text-pink-400" },
    { label: "Min", value: timeLeft.minutes, color: "text-cyan-400" },
    { label: "Sec", value: timeLeft.seconds, color: "text-purple-300" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl bg-[#090526]/50 border border-purple-500/20 backdrop-blur-xl shadow-[0_15px_40px_rgba(3,0,20,0.4)] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden z-10">
      <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_20%_50%,rgba(168,85,247,0.05),transparent)]" />
      
      <div className="text-left space-y-1.5 z-10 shrink-0">
        <span className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-pink-400">Time to Symphony</span>
        <h3 className="text-2xl font-bold font-display text-white">Counting Down to Rhythm</h3>
        <p className="text-white/50 text-xs sm:text-sm font-light">Join the action live on stage.</p>
        <div className="flex gap-4 text-xs text-purple-300 font-semibold pt-1.5">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Dec 18, 2026</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 19:30 UTC</span>
        </div>
      </div>

      {/* Clock Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-6 z-10 w-full md:w-auto">
        {timeBlocks.map((block, index) => (
          <div key={index} className="flex flex-col items-center p-3 sm:p-5 rounded-2xl bg-[#070417]/80 border border-purple-500/10 min-w-[70px] sm:min-w-[90px] shadow-inner relative group">
            <span className={`text-2xl sm:text-4xl font-display font-black leading-none ${block.color}`}>
              {block.value.toString().padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-white/40 mt-2 font-bold">{block.label}</span>
            <div className="absolute bottom-0 inset-x-4 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. PERFORMER HIGHLIGHTS
// ==========================================
export function Performers() {
  const [performers, setPerformers] = useState<Performer[]>([]);

  useEffect(() => {
    setPerformers(getPerformers());

    const handleSync = () => {
      setPerformers(getPerformers());
    };

    window.addEventListener("rhythm_night_db_sync", handleSync);
    return () => {
      window.removeEventListener("rhythm_night_db_sync", handleSync);
    };
  }, []);

  return (
    <section id="performers" className="relative py-24 w-full overflow-hidden border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <span className="text-xs uppercase font-mono font-bold tracking-[0.25em] text-purple-400 flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> Lineup
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Performer Highlights
          </h2>
          <p className="text-white/60 font-light max-w-xl text-sm sm:text-base">
            Futuristic audio waves combined with electronic symphonies.
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full mt-1" />
        </div>

        {/* Performers grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {performers.map((perf, index) => (
            <motion.div
              key={perf.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group rounded-3xl bg-[#090526]/30 border border-purple-500/20 backdrop-blur-xl p-5 overflow-hidden flex flex-col justify-between transition-shadow duration-500 shadow-md hover:border-purple-400/40 hover:shadow-[0_15px_30px_rgba(139,92,246,0.15)] relative h-96"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/90 via-[#030014]/40 to-transparent z-10" />
              
              {/* Visual avatar placeholder */}
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={perf.avatar}
                  alt={perf.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Central soundwave decoration on hover */}
              <div className="absolute top-1/3 inset-x-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center items-center gap-1 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-pink-400/70 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 8}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              {/* Bottom information */}
              <div className="mt-auto relative z-20 space-y-3">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-400">
                  {perf.role}
                </span>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {perf.name}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-white/50 mt-1 font-light">
                    <span>{perf.genre}</span>
                    <span className="text-purple-300 font-medium">{perf.timeSlot}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-500/10 flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Audio Live Channel</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. EVENT TIMELINE
// ==========================================
export function EventTimeline() {
  const schedule = [
    {
      time: "19:30",
      title: "Opening Neon Symphony",
      desc: "Electronic intro ambiance by student orchestra synthesis.",
      details: "Stage Area • Hologram Active",
    },
    {
      time: "20:30",
      title: "Young Innovators Showcase",
      desc: "Live demonstration of student projects in AI, robotics, and hardware displays.",
      details: "Exhibition Wing • VC Investors Welcomed",
    },
    {
      time: "21:30",
      title: "Headline Synth-Rock Band",
      desc: "Neon Wave Symphony electrifying set under cyber lights.",
      details: "Main Concert Stage • High Volume",
    },
    {
      time: "23:00",
      title: "Fundraise Final Pitch",
      desc: "Announcement of total tickets raised, corporate matchups, and direct award grants.",
      details: "Central Stage • Toast Celebration",
    },
  ];

  return (
    <section id="timeline" className="relative py-24 w-full overflow-hidden border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <span className="text-xs uppercase font-mono font-bold tracking-[0.25em] text-cyan-400 flex items-center gap-1.5 justify-center">
            <Clock className="w-3.5 h-3.5 text-purple-400" /> Schedule
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Event Schedule
          </h2>
          <p className="text-white/60 font-light max-w-xl text-sm sm:text-base">
            The narrative scroll progression of the Rhythm fundraiser evening.
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full mt-1" />
        </div>

        {/* Timeline representation */}
        <div className="max-w-3xl mx-auto relative flex flex-col pt-4">
          
          {/* Vertical central bar */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500/20 -translate-x-1/2" />

          {schedule.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 sm:mb-16 ${
                  isEven ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Node marker */}
                <div className="absolute left-4 sm:left-1/2 w-8 h-8 rounded-full bg-[#070417] border-4 border-purple-500 -translate-x-1/2 z-20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                </div>

                {/* Content Card */}
                <div className={`w-full sm:w-[calc(50%-2rem)] ml-10 sm:ml-0 ${
                  isEven ? "sm:text-right" : "sm:text-left"
                }`}>
                  <div className="p-6 rounded-2xl bg-[#090526]/30 border border-purple-500/10 hover:border-purple-500/20 backdrop-blur-md hover:bg-[#090526]/50 transition-all duration-300 shadow-md">
                    <span className="font-display font-black text-xl text-cyan-400 tracking-wide block mb-1">
                      {item.time}
                    </span>
                    <h4 className="font-display font-semibold text-lg text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-white/60 text-sm font-light leading-relaxed mb-3">
                      {item.desc}
                    </p>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-md inline-block">
                      {item.details}
                    </span>
                  </div>
                </div>

                {/* Empty spacer for alignment */}
                <div className="hidden sm:block w-[calc(50%-2rem)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. SPONSORS SHOWCASE
// ==========================================
export function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    setSponsors(getSponsors());

    const handleSync = () => {
      setSponsors(getSponsors());
    };

    window.addEventListener("rhythm_night_db_sync", handleSync);
    return () => {
      window.removeEventListener("rhythm_night_db_sync", handleSync);
    };
  }, []);

  return (
    <section className="py-16 w-full overflow-hidden border-t border-purple-500/10 bg-[#090526]/20">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center">
        <span className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-purple-300/60 mb-6">
          Funded & Supported by Trusted Leaders
        </span>
        
        {/* Infinite sponsors horizontal scroller */}
        <div className="w-full overflow-hidden relative py-4 select-none">
          <div
            className="flex gap-16 w-max items-center"
            style={{
              animation: "marquee 25s linear infinite",
            }}
          >
            {[...sponsors, ...sponsors].map((spon, index) => (
              <span
                key={`${spon.id}-${index}`}
                className="font-display font-black text-2xl tracking-widest text-white/20 hover:text-white/60 transition-colors duration-300 cursor-default"
              >
                {spon.logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. TICKET PRICING
// ==========================================
export function Pricing() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [ticketType, setTicketType] = useState<"general" | "vip" | "sponsor">("general");

  const openBooking = (type: "general" | "vip" | "sponsor") => {
    setTicketType(type);
    setRsvpOpen(true);
  };

  const tiers = [
    {
      type: "general",
      title: "General Entry",
      price: "Donation Match",
      desc: "Full admission to the live concert, DJ slots, and common IT Fair exhibition stalls.",
      features: [
        "Concert Hall entry",
        "Acoustic + Synth Band sets",
        "Common technology displays",
        "Digital boarding pass ID",
      ],
      border: "border-purple-500/10",
      bg: "bg-[#090526]/20",
      btnClass: "bg-purple-600/20 hover:bg-purple-600/35 border-purple-500/30 text-purple-200",
    },
    {
      type: "vip",
      title: "VIP Lounge Pass",
      price: "$50",
      desc: "Elevated concert visibility, access to the VIP Lounge, and free drinks/buffet.",
      features: [
        "Front row concert visibility",
        "Exclusive VIP lounge access",
        "Complimentary cocktails + buffet",
        "Priority project demonstrations",
        "Premium support certificate",
      ],
      border: "border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.1)]",
      bg: "bg-gradient-to-b from-[#180933] to-[#070417]",
      btnClass: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg",
      popular: true,
    },
    {
      type: "sponsor",
      title: "Corporate Sponsor",
      price: "$250",
      desc: "All VIP benefits plus sponsor placement (logo in scroller), and private VC pitch meetings.",
      features: [
        "4 VIP Boarding Passes",
        "Sponsor logo placement active",
        "Student pitch private meetings",
        "Exclusive dinner with jury team",
        "Tax-deductible tax invoice",
      ],
      border: "border-cyan-500/20",
      bg: "bg-[#090526]/20",
      btnClass: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-200",
    },
  ];

  return (
    <>
      <section id="pricing" className="relative py-24 w-full overflow-hidden border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 space-y-3">
            <span className="text-xs uppercase font-mono font-bold tracking-[0.25em] text-pink-400 flex items-center gap-1.5 justify-center">
              <Award className="w-3.5 h-3.5 text-purple-400" /> Tickets
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Select Your Access Tier
            </h2>
            <p className="text-white/60 font-light max-w-xl text-sm sm:text-base">
              Secure your entrance boarding pass. Every contribution funds future tech creators.
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full mt-1" />
          </div>

          {/* Grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.type}
                className={`rounded-3xl border ${tier.border} ${tier.bg} p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md group hover:scale-[1.01] transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500 text-[9px] uppercase font-bold text-white tracking-wider animate-pulse">
                    Popular Match
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold font-display text-white">{tier.title}</h4>
                    <p className="text-white/50 text-xs mt-1 min-h-[36px] font-light leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-display font-black text-white">
                      {tier.price}
                    </span>
                    {tier.type !== "general" && <span className="text-white/40 text-xs">/ ticket</span>}
                  </div>

                  <hr className="border-purple-500/10" />

                  {/* Features list */}
                  <ul className="space-y-3">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-white/70 font-light">
                        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Button
                    onClick={() => openBooking(tier.type as any)}
                    className={`w-full h-11 rounded-xl font-semibold tracking-wider font-display text-xs uppercase transition-all duration-300 border ${tier.btnClass}`}
                  >
                    Reserve {tier.title}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking RSVP Modal */}
      <RsvpModal isOpen={rsvpOpen} onOpenChange={setRsvpOpen} defaultTicketType={ticketType} />
    </>
  );
}

// ==========================================
// 6. FAQ SECTION
// ==========================================
export function FAQ() {
  const faqs = [
    {
      q: "Where and when is Rhythm Night 2026 taking place?",
      a: "The event is scheduled for December 18, 2026, starting at 19:30 UTC. It will take place at the main Tech Symphony Pavilion and Exhibition Wing (simulated space). Access credentials are sent inside your boarding ticket.",
    },
    {
      q: "Are the corporate ticket purchases tax-deductible?",
      a: "Yes! Since Rhythm Night 2026 functions as a registered fundraiser for the student IT Innovation Fair, all VIP Corporate sponsor contributions receive a legitimate charity receipt for tax deductions.",
    },
    {
      q: "What is the relation with the IT Innovation Fair?",
      a: "All ticket yields, sponsor matching programs, and booth fees collected at Rhythm Night directly fund cash grants, exhibition gear, student travel stipends, and awards for young creators presenting projects at the 2026 IT Fair.",
    },
    {
      q: "How do I check in at the gate?",
      a: "When you book a ticket via our Reserve Seat modal, a digital pass with a custom QR code is instantly saved. Present this boarding pass at the entrance gate (either on your phone or printed) where coordinators will scan your QR code for rapid check-in.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 w-full overflow-hidden border-t border-purple-500/10">
      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <span className="text-xs uppercase font-mono font-bold tracking-[0.25em] text-cyan-400 flex items-center gap-1.5 justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Frequently Answered Questions
          </h2>
          <p className="text-white/60 font-light text-sm sm:text-base">
            Everything you need to know about Rhythm tickets and technical showcases.
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full mt-1" />
        </div>

        {/* Custom Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-purple-500/15 bg-[#090526]/30 overflow-hidden backdrop-blur-md transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 flex justify-between items-center text-left hover:bg-purple-950/10 transition-colors"
                >
                  <span className="font-display font-semibold text-white text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-5 pt-0 border-t border-purple-500/5 text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 7. TESTIMONIALS
// ==========================================
export function Testimonials() {
  const reviews = [
    {
      quote: "Rhythm Night funds changed my life. The IT Fair grant I won allowed our team to purchase parts for our neural prosthetic arm prototype. We are now pitching to actual VCs!",
      author: "Samantha Kavidu",
      role: "Student Innovator, Bio-Robotics Lab",
    },
    {
      quote: "As a performer, playing at Rhythm Night is an unparalleled experience. The hologram soundwave engine was amazing, and knowing the audience tickets fund youth tech is beautiful.",
      author: "DJ VoidWave",
      role: "Headline Electro-Artist",
    },
    {
      quote: "A perfectly synthesized event. Tech meetings and startup networking blended with rock concerts. We committed to hiring three student developers on the spot.",
      author: "Marcus Vance",
      role: "Managing Director, Apex VC Group",
    },
  ];

  return (
    <section className="relative py-24 w-full overflow-hidden border-t border-purple-500/10 bg-[#090526]/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-[#090526]/30 border border-purple-500/10 backdrop-blur-md flex flex-col justify-between shadow-inner relative hover:border-purple-400/30 transition-colors duration-300"
            >
              <span className="text-4xl text-pink-400/30 font-serif leading-none absolute top-4 left-4 pointer-events-none">
                &ldquo;
              </span>
              <p className="text-white/70 italic text-xs sm:text-sm font-light leading-relaxed pl-4 z-10">
                {rev.quote}
              </p>
              
              <div className="pt-6 border-t border-purple-500/10 mt-6 pl-4 flex flex-col">
                <span className="font-display font-semibold text-white text-xs sm:text-sm">{rev.author}</span>
                <span className="text-[10px] text-purple-300/60 mt-0.5 font-mono">{rev.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 8. CONTACT SECTION
// ==========================================
export function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.msg) {
      toast({
        title: "Validation Error",
        description: "Please populate all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Inquiry Sent!",
        description: "We will get back to you shortly regarding sponsorships/performances.",
      });
      setFormData({ name: "", email: "", msg: "" });
    }, 1000);
  };

  return (
    <section id="contact" className="relative py-24 w-full overflow-hidden border-t border-purple-500/10">
      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Info panel */}
        <div className="space-y-6 text-left">
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-[0.25em] text-purple-400">Collaborate</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white mt-1.5">
              Support the Movement
            </h2>
            <p className="text-white/60 font-light text-sm sm:text-base mt-3 leading-relaxed">
              Looking to showcase your tech projects? Sponsor a student booth? Or request band performance bookings? Shoot us a message.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3 items-center text-xs text-white/70">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>rhythm@innovation-fair.org</span>
            </div>
            <div className="flex gap-3 items-center text-xs text-white/70">
              <MapPin className="w-4 h-4 text-pink-400" />
              <span>Symphony Pavilion, IT Innovation Fair 2026</span>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="p-6 rounded-3xl bg-[#090526]/50 border border-purple-500/20 backdrop-blur-xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Textarea
                value={formData.msg}
                onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                placeholder="How would you like to collaborate?"
                className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl min-h-[100px] resize-none"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold font-display tracking-wider rounded-xl h-10 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Sending Message..." : <span className="flex items-center gap-1.5 justify-center"><Send className="w-3.5 h-3.5" /> Send Inquiry</span>}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 9. EVENT FOOTER
// ==========================================
export function Footer() {
  return (
    <footer className="relative py-12 w-full overflow-hidden border-t border-purple-500/10 bg-[#040114]/90 z-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        
        {/* Info */}
        <div className="space-y-2">
          <span className="font-display font-black text-sm tracking-widest text-white">
            🎶 RHYTHM NIGHT 2026
          </span>
          <p className="text-[10px] text-white/40 font-light">
            © 2026 IT Innovation Fair. All Rights Reserved. Built with Next.js & Three.js.
          </p>
        </div>

        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-[9px] font-mono font-bold tracking-wider text-cyan-400">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>CYBER SECURITY CHECKED</span>
        </div>

        {/* Socials */}
        <div className="flex gap-4">
          <a
            href="#"
            className="p-2.5 rounded-xl border border-purple-500/10 bg-[#090526]/50 hover:bg-purple-900/20 text-purple-300 hover:text-white transition-all duration-300"
            aria-label="Twitter"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="#"
            className="p-2.5 rounded-xl border border-purple-500/10 bg-[#090526]/50 hover:bg-purple-900/20 text-purple-300 hover:text-white transition-all duration-300"
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 fill-none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          <a
            href="#"
            className="p-2.5 rounded-xl border border-purple-500/10 bg-[#090526]/50 hover:bg-purple-900/20 text-purple-300 hover:text-white transition-all duration-300"
            aria-label="GitHub"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

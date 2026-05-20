"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveRSVP, getRSVPs, RSVP } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Sparkles, CheckCircle, CreditCard, Download, Users } from "lucide-react";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { useLenis } from "lenis/react";

interface RsvpModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTicketType?: "general" | "vip" | "sponsor";
}

export default function RsvpModal({ isOpen, onOpenChange, defaultTicketType = "general" }: RsvpModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "ticket">("form");
  const [ticketType, setTicketType] = useState<"general" | "vip" | "sponsor">(defaultTicketType);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    seats: 1,
    innovationSupport: "",
  });
  const [createdTicket, setCreatedTicket] = useState<RSVP | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (isOpen) {
      lenis.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ticketId = params.get("ticketId");
      if (ticketId) {
        // Find matching ticket from localStorage
        const allRsvps = getRSVPs();
        const matched = allRsvps.find(r => r.id.toLowerCase() === ticketId.toLowerCase());
        if (matched) {
          setCreatedTicket(matched);
          setStep("ticket");
          onOpenChange(true);
        }
      }
    }
  }, [onOpenChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSeatsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, seats: parseInt(value) }));
  };

  const handleTicketSelect = (type: "general" | "vip" | "sponsor") => {
    setTicketType(type);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti coming from both sides
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury API booking lag
    setTimeout(() => {
      try {
        const ticket = saveRSVP({
          name: formData.name,
          email: formData.email,
          ticketType,
          seats: formData.seats,
          innovationSupport: formData.innovationSupport || "Supporting young tech innovators!",
        });

        setCreatedTicket(ticket);
        setStep("ticket");
        setIsSubmitting(false);
        triggerConfetti();
        
        toast({
          title: "Seat Reserved!",
          description: "Your boarding ticket has been generated successfully.",
        });
      } catch (err: any) {
        setIsSubmitting(false);
        toast({
          title: "Registration Failed",
          description: err.message || "Failed to reserve your seat. Please try again.",
          variant: "destructive",
        });
      }
    }, 1200);
  };

  const resetModal = () => {
    setStep("form");
    setFormData({ name: "", email: "", seats: 1, innovationSupport: "" });
    setTicketType(defaultTicketType);
    setCreatedTicket(null);
    onOpenChange(false);
  };

  const downloadTicketImage = async () => {
    const ticketElement = document.querySelector(".print-ticket-card") as HTMLElement;
    if (!ticketElement) {
      toast({
        title: "Download Error",
        description: "Could not locate ticket element. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Generating Pass",
        description: "Compiling your high-contrast thermal ticket...",
      });

      const canvas = await html2canvas(ticketElement, {
        scale: 3, // High definition crisp scaling
        useCORS: true, // Allow external QR vector loading
        backgroundColor: "#ffffff", // Pure white card background
        logging: false,
      });

      const imageUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = `Rhythm_Night_Ticket_${createdTicket?.id || "pass"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast({
        title: "Download Complete!",
        description: "Your fully completed ticket image has been saved.",
      });
    } catch (error) {
      console.error("html2canvas error: ", error);
      toast({
        title: "Download Failed",
        description: "Failed to render ticket image graphics.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetModal(); else onOpenChange(open); }}>
      <DialogContent data-lenis-prevent className="max-w-xl w-[95vw] max-h-[95vh] overflow-y-auto bg-[#070417]/95 border border-purple-500/30 backdrop-blur-2xl text-white rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] p-5 sm:p-6 scrollbar-thin scrollbar-thumb-purple-500/20">
        {step === "form" ? (
          <div className="p-1">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 flex items-center gap-2">
                <Ticket className="w-8 h-8 text-purple-400 animate-pulse" />
                Reserve Boarding Pass
              </DialogTitle>
              <p className="text-purple-200/60 text-sm mt-1">
                Choose your participation tier. All proceeds directly fund scholarship exhibitions at the IT Innovation Fair 2026.
              </p>
            </DialogHeader>

            {/* Ticket Tier Selection */}
             <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  type: "general" as const,
                  label: "Neon Entry",
                  desc: "Basic Entry",
                  border: "border-purple-500/20",
                  glow: "hover:border-purple-500/55",
                },
                {
                  type: "vip" as const,
                  label: "Aurora Access",
                  desc: "Standard Pass",
                  border: "border-pink-500/20",
                  glow: "hover:border-pink-500/55",
                },
                {
                  type: "sponsor" as const,
                  label: "Cosmic Elite",
                  desc: "VIP lounge access",
                  border: "border-cyan-500/20",
                  glow: "hover:border-cyan-500/55",
                },
              ].map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => handleTicketSelect(t.type)}
                  className={`relative p-3 rounded-xl border flex flex-col justify-between items-start transition-all duration-300 ${
                    ticketType === t.type
                      ? "bg-purple-600/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      : `bg-[#0e0a29]/60 ${t.border} ${t.glow}`
                  }`}
                >
                  <div>
                    <span className="font-semibold text-xs block text-left truncate w-full">{t.label}</span>
                    <span className="text-[9px] text-white/50 block text-left mt-0.5">{t.desc}</span>
                  </div>
                  <span className="text-xs text-purple-300 font-medium font-display mt-2">
                    {t.type === "general" ? "Rs. 1,000" : t.type === "vip" ? "Rs. 1,800" : "Rs. 2,500"}
                  </span>
                  {ticketType === t.type && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-400" />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs text-purple-200/70">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="bg-[#0e0a2b]/80 border-purple-500/20 focus:border-purple-500/60 focus:ring-0 text-white rounded-lg h-10"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-purple-200/70">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@domain.com"
                    className="bg-[#0e0a2b]/80 border-purple-500/20 focus:border-purple-500/60 focus:ring-0 text-white rounded-lg h-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="seats" className="text-xs text-purple-200/70 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Seats Volume
                  </Label>
                  <Select onValueChange={handleSeatsChange} defaultValue="1">
                    <SelectTrigger className="bg-[#0e0a2b]/80 border-purple-500/20 focus:ring-0 text-white h-10 rounded-lg">
                      <SelectValue placeholder="1 Seat" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0e0a2b] border-purple-500/30 text-white">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Seat" : "Seats"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-purple-200/70 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Entrance Gate Fee
                  </Label>
                  <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg h-10 px-3 flex items-center text-xs text-pink-400 font-bold">
                    Pay at Door: Rs. {(formData.seats * (ticketType === "sponsor" ? 2500 : ticketType === "vip" ? 1800 : 1000)).toLocaleString()} LKR
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="innovationSupport" className="text-xs text-purple-200/70 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Support Note (Optional)
                </Label>
                <Textarea
                  id="innovationSupport"
                  value={formData.innovationSupport}
                  onChange={handleInputChange}
                  placeholder="Share a word of encouragement for the student innovators..."
                  className="bg-[#0e0a2b]/80 border-purple-500/20 focus:border-purple-500/60 focus:ring-0 text-white rounded-lg min-h-[70px] resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold font-display tracking-wider rounded-xl h-11 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Cyber Ticket...
                  </div>
                ) : (
                  "Confirm RSVP & Boarding Pass"
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* CINEMATIC TICKETING BOARDING PASS */
          <div className="flex flex-col items-center">
            <CheckCircle className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
            <h2 className="text-xl font-bold font-display text-center mb-0.5">Reservation Confirmed</h2>
            <p className="text-white/60 text-[11px] text-center mb-5">
              Your ticket is successfully compiled. Present this receipt for scan-gate entrance.
            </p>

            {/* White Thermal Receipt Ticket with Jagged Edges */}
            <div className="w-[360px] max-w-full bg-white text-slate-900 border border-slate-200 shadow-2xl relative flex flex-col pt-6 pb-6 px-5 print-ticket-card overflow-visible">
              
              {/* Top Jagged Edge (Row of SVG Triangles) */}
              <div className="absolute -top-[6px] left-0 w-full overflow-hidden h-[6px] flex z-10">
                {Array.from({ length: 36 }).map((_, i) => (
                  <svg key={i} className="w-2.5 h-[6px] fill-white text-white shrink-0" viewBox="0 0 10 6">
                    <polygon points="0,6 5,0 10,6" />
                  </svg>
                ))}
              </div>

              {/* Bottom Jagged Edge (Row of SVG Triangles) */}
              <div className="absolute -bottom-[6px] left-0 w-full overflow-hidden h-[6px] flex z-10">
                {Array.from({ length: 36 }).map((_, i) => (
                  <svg key={i} className="w-2.5 h-[6px] fill-white text-white shrink-0" viewBox="0 0 10 6">
                    <polygon points="0,0 5,6 10,0" />
                  </svg>
                ))}
              </div>

              {/* Top Section */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-mono font-bold">RHYTHM NIGHT 2026</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Ticket Confirmed!</h3>
                <p className="text-slate-500 text-[10px] max-w-[200px] mt-0.5 leading-relaxed">
                  Present this QR code at the registration gate to enter.
                </p>

                {/* Massive QR Code Container */}
                <div className="w-40 h-40 bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm mt-4 shrink-0">
                  <img
                    src={createdTicket?.qrCodeUrl}
                    alt="Admission QR code"
                    className="w-full h-full object-contain animate-fade-in"
                  />
                </div>

                {/* Monospace Serial Code */}
                <span className="font-mono font-black text-slate-800 text-sm tracking-widest mt-2.5">
                  {createdTicket?.id}
                </span>
              </div>

              {/* Dashed Horizontal Tear-off Line */}
              <div className="relative my-5">
                <div className="border-t border-dashed border-slate-300 w-full" />
                <div className="absolute -top-[6px] -left-[26px] w-3 h-3 rounded-full bg-[#070417] border-r border-slate-300 z-10" />
                <div className="absolute -top-[6px] -right-[26px] w-3 h-3 rounded-full bg-[#070417] border-l border-slate-300 z-10" />
              </div>

              {/* Bottom Section */}
              <div className="flex-grow flex flex-col justify-between">
                
                {/* Header Row: Avatar & Brand Title */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    {/* Event Avatar placeholder / Performer image */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                      <Ticket className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-slate-900 block capitalize">
                        {createdTicket?.ticketType === "sponsor" ? "💎 Cosmic Elite" : createdTicket?.ticketType === "vip" ? "👑 Aurora Access" : "🎟️ Neon Entry"}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono block">RHYTHM CYBERDOME A</span>
                    </div>
                  </div>

                  {/* Rotated Serial & Small QR block on the right */}
                  <div className="flex items-center gap-1.5 self-stretch">
                    {/* Vertical text serial */}
                    <div className="text-[9px] font-mono font-bold text-slate-300 tracking-wider rotate-180 uppercase" style={{ writingMode: "vertical-lr" }}>
                      {createdTicket?.id}
                    </div>
                    {/* Tiny copy of QR code */}
                    <div className="w-8 h-8 bg-white p-0.5 rounded border border-slate-200 flex items-center justify-center shrink-0">
                      <img
                        src={createdTicket?.qrCodeUrl}
                        alt="Mini QR code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Details Fields */}
                <div className="space-y-2 mt-4 text-xs">
                  <div className="text-left border-b border-slate-100 pb-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">Guest Name</span>
                    <span className="font-bold text-slate-800">{createdTicket?.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-left border-b border-slate-100 pb-1">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">Seats volume</span>
                      <span className="font-semibold text-slate-700">{createdTicket?.seats} {createdTicket?.seats === 1 ? "Seat" : "Seats"}</span>
                    </div>
                    <div className="text-left border-b border-slate-100 pb-1">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">Session</span>
                      <span className="font-semibold text-slate-700">19:30 UTC - 01/16/2026</span>
                    </div>
                  </div>

                  <div className="text-left border-b border-slate-100 pb-1 col-span-2">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">Entrance Gate Fee</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      Rs. {((createdTicket?.seats || 1) * (createdTicket?.ticketType === "sponsor" ? 2500 : createdTicket?.ticketType === "vip" ? 1800 : 1000)).toLocaleString()} LKR
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 text-left">
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">GATE ENTRY STATUS</span>
                  <span className="text-[10px] font-bold text-emerald-600 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    PAID & RSVP VALIDATED
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 w-[360px] max-w-full mt-6 z-20">
              <Button
                variant="outline"
                onClick={resetModal}
                className="flex-1 bg-[#0b0824]/80 border-purple-500/20 hover:bg-purple-900/20 text-white rounded-xl h-10 font-semibold"
              >
                Close Ticket
              </Button>
              <Button
                onClick={downloadTicketImage}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl h-10 font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                <Download className="w-4 h-4" /> Download Pass
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
      } catch (err) {
        setIsSubmitting(false);
        toast({
          title: "System Error",
          description: "Failed to reserve your seat. Please try again.",
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetModal(); else onOpenChange(open); }}>
      <DialogContent className="max-w-xl w-[95vw] max-h-[95vh] overflow-y-auto bg-[#070417]/95 border border-purple-500/30 backdrop-blur-2xl text-white rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] p-5 sm:p-6 scrollbar-thin scrollbar-thumb-purple-500/20">
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
                  label: "General",
                  desc: "Pass Entry",
                  border: "border-purple-500/20",
                  glow: "hover:border-purple-500/55",
                },
                {
                  type: "vip" as const,
                  label: "VIP",
                  desc: "Lounge Seat",
                  border: "border-pink-500/20",
                  glow: "hover:border-pink-500/55",
                },
                {
                  type: "sponsor" as const,
                  label: "Sponsor",
                  desc: "Exp Booth",
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
                    <span className="font-semibold text-sm block text-left">{t.label}</span>
                    <span className="text-[10px] text-white/50 block text-left">{t.desc}</span>
                  </div>
                  <span className="text-xs text-purple-300 font-medium font-display mt-2">
                    {t.type === "general" ? "Donation" : t.type === "vip" ? "$50" : "$250"}
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
                    Pay at Door: {ticketType === "general" ? `$${formData.seats * 10} USD (Or donation)` : `$${formData.seats * (ticketType === "vip" ? 50 : 250)} USD`}
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
            <p className="text-white/60 text-[11px] text-center mb-4">
              Your boarding pass is ready. Present this QR code at the event gate.
            </p>

            {/* Glowing Ticket Shell - Double Column Boarding Pass */}
            <div className="w-full bg-gradient-to-br from-[#120b38] via-[#090520] to-[#040210] border border-purple-400/40 rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(168,85,247,0.25)] flex flex-col sm:flex-row print-ticket-card">
              
              {/* Left Column: Guest & Ticket Details */}
              <div className="flex-grow p-4 sm:p-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-purple-500/20">
                <div className="space-y-4">
                  {/* Brand & Serial */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-cyan-300 font-mono font-bold block text-left">EVENT BOARDING PASS</span>
                      <h3 className="text-lg font-black tracking-wider text-white mt-0.5 text-left">RHYTHM NIGHT 2026</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">SERIAL ID</span>
                      <span className="font-mono font-bold text-pink-400 text-xs">{createdTicket?.id}</span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    <div className="text-left">
                      <span className="text-[8px] uppercase text-slate-400 font-mono block">GUEST NAME</span>
                      <span className="font-semibold text-white truncate max-w-[130px] block">{createdTicket?.name}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[8px] uppercase text-slate-400 font-mono block">ADMISSION TIER</span>
                      <span className="font-bold text-purple-300 uppercase flex items-center gap-1">
                        {createdTicket?.ticketType === "sponsor" ? "💎 Sponsor" : createdTicket?.ticketType === "vip" ? "👑 VIP" : "🎟️ General"}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-[8px] uppercase text-slate-400 font-mono block">SEATS</span>
                      <span className="font-medium text-white">{createdTicket?.seats} {createdTicket?.seats === 1 ? "Seat" : "Seats"}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[8px] uppercase text-slate-400 font-mono block">GATE FEE</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        ${((createdTicket?.seats || 1) * (createdTicket?.ticketType === "sponsor" ? 250 : createdTicket?.ticketType === "vip" ? 50 : 10)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Venue & Time Block (Bottom of Left Column) */}
                <div className="mt-4 pt-2.5 border-t border-purple-500/10 space-y-1 text-[9px] text-slate-300">
                  <div className="flex justify-between flex-wrap gap-1 text-left">
                    <span>🏛️ RHYTHM CYBERDOME HALL A</span>
                    <span>🕒 JAN 16, 2026 • 19:30 UTC</span>
                  </div>
                </div>
              </div>

              {/* Tear-Off Cut Line (Only visible on desktop/tablet, hidden on mobile) */}
              <div className="hidden sm:flex flex-col justify-between py-3 relative w-px bg-transparent">
                <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#070417] border-b border-purple-500/20" />
                <div className="h-full border-l border-dashed border-purple-500/30" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[#070417] border-t border-purple-500/20" />
              </div>

              {/* Right Column: High-Contrast QR Scanner Gate Gate */}
              <div className="w-full sm:w-[170px] bg-purple-950/10 p-4 sm:p-5 flex flex-col items-center justify-center gap-3 text-center shrink-0">
                <span className="text-[8px] uppercase tracking-wider text-cyan-300 font-mono font-bold">SCAN GATE ENTRY</span>
                
                {/* QR Code Container */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 rounded-2xl border border-purple-500/20 flex items-center justify-center shadow-lg shrink-0">
                  <img
                    src={createdTicket?.qrCodeUrl}
                    alt="Admission QR code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="text-[8px] text-slate-400 font-mono block mt-1">PAID & RSVP VALIDATED</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 w-full mt-5">
              <Button
                variant="outline"
                onClick={resetModal}
                className="flex-1 bg-[#0b0824]/80 border-purple-500/20 hover:bg-purple-900/20 text-white rounded-xl h-10 font-semibold"
              >
                Close Ticket
              </Button>
              <Button
                onClick={() => {
                  window.print();
                }}
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

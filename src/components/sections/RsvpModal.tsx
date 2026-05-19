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

  const ticketPrices = {
    general: "Donation Match",
    vip: "$50 USD",
    sponsor: "$250 USD",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetModal(); else onOpenChange(open); }}>
      <DialogContent className="max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#070417]/95 border border-purple-500/30 backdrop-blur-2xl text-white rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] scrollbar-thin scrollbar-thumb-purple-500/20 p-6 md:p-8">
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
                { type: "general", label: "General", desc: "Show Entry", border: "border-purple-500/20", glow: "hover:border-purple-500/50" },
                { type: "vip", label: "VIP Pass", desc: "Front Lounge", border: "border-pink-500/20", glow: "hover:border-pink-500/50" },
                { type: "sponsor", label: "Sponsor", desc: "VIP + Dinner", border: "border-cyan-500/20", glow: "hover:border-cyan-500/50" },
              ].map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => handleTicketSelect(t.type as any)}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-24 ${
                    ticketType === t.type
                      ? "bg-purple-600/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      : `bg-[#0e0a29]/60 ${t.border} ${t.glow}`
                  }`}
                >
                  <div>
                    <span className="font-semibold text-sm block">{t.label}</span>
                    <span className="text-[10px] text-white/50 block">{t.desc}</span>
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
                    placeholder="name@example.com"
                    className="bg-[#0e0a2b]/80 border-purple-500/20 focus:border-purple-500/60 focus:ring-0 text-white rounded-lg h-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="seats" className="text-xs text-purple-200/70 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Number of Seats
                  </Label>
                  <Select onValueChange={handleSeatsChange} defaultValue="1">
                    <SelectTrigger className="bg-[#0e0a2b]/80 border-purple-500/20 focus:border-purple-500/60 text-white rounded-lg h-10">
                      <SelectValue placeholder="Select seats" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0e0a2b] border-purple-500/30 text-white">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()} className="focus:bg-purple-600/30">
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
          <div className="p-1 flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
            <h2 className="text-2xl font-bold font-display text-center mb-1">Reservation Confirmed</h2>
            <p className="text-white/60 text-xs text-center mb-6">
              Your futuristic boarding pass is compiled. Present this code at the registration gate.
            </p>

            {/* Glowing Ticket Shell */}
            <div className="w-full bg-gradient-to-b from-[#110c33] to-[#070417] border border-purple-400/40 rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(168,85,247,0.25)] flex flex-col print-ticket-card">
              
              {/* Ticket Top: Brand & Invoice Header */}
              <div className="p-6 border-b border-purple-500/20 bg-purple-950/20 text-center flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-[0.25em] text-purple-300 font-mono font-bold">OFFICIAL ENTRY ADMISSION RECEIPT</span>
                <span className="text-xl md:text-2xl font-black font-display text-white tracking-widest mt-1.5 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-white to-pink-300">
                  RHYTHM NIGHT 2026
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-1">SECURE ENCRYPTED BOARDING PASS</span>
              </div>

              {/* Ticket Middle: Invoice Details & Itemized Pricing List */}
              <div className="p-6 space-y-5">
                
                {/* Invoice Meta */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">ISSUED TO (GUEST)</span>
                    <span className="font-bold text-white text-sm block mt-0.5">{createdTicket?.name}</span>
                    <span className="text-slate-400 text-[10px] block mt-0.5 truncate max-w-[170px]">{createdTicket?.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">INVOICE SERIAL ID</span>
                    <span className="font-mono font-black text-cyan-300 text-sm block mt-0.5">{createdTicket?.id}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">DATE: JAN 16, 2026</span>
                  </div>
                </div>

                {/* Itemized pricing table - Bill structure */}
                <div className="border border-purple-500/15 rounded-xl overflow-hidden bg-purple-950/10">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 bg-purple-950/45 p-2 text-[8px] font-mono font-bold uppercase tracking-wider text-slate-300 border-b border-purple-500/20">
                    <div className="col-span-6">ITEM DESCRIPTION</div>
                    <div className="col-span-2 text-center">QTY</div>
                    <div className="col-span-2 text-right">UNIT</div>
                    <div className="col-span-2 text-right">SUBTOTAL</div>
                  </div>

                  {/* Seat ticket row */}
                  <div className="grid grid-cols-12 p-3 text-[11px] border-b border-purple-500/10 items-center">
                    <div className="col-span-6 font-semibold text-white capitalize flex flex-col">
                      <span>
                        {createdTicket?.ticketType === "sponsor" 
                          ? "💎 Corporate Sponsor Pass" 
                          : createdTicket?.ticketType === "vip" 
                          ? "👑 VIP Lounge Pass" 
                          : "🎟️ General Support Pass"}
                      </span>
                      <span className="text-[9px] text-slate-400 font-normal font-mono mt-0.5">Includes full hall admission</span>
                    </div>
                    <div className="col-span-2 text-center font-bold text-purple-300">{createdTicket?.seats}</div>
                    <div className="col-span-2 text-right font-mono text-slate-300">
                      ${createdTicket?.ticketType === "sponsor" ? "250.00" : createdTicket?.ticketType === "vip" ? "50.00" : "10.00"}
                    </div>
                    <div className="col-span-2 text-right font-mono font-bold text-white">
                      ${((createdTicket?.seats || 1) * (createdTicket?.ticketType === "sponsor" ? 250 : createdTicket?.ticketType === "vip" ? 50 : 10)).toFixed(2)}
                    </div>
                  </div>

                  {/* Booking Tax row */}
                  <div className="grid grid-cols-12 p-2.5 text-[10px] text-slate-400 border-b border-purple-500/10 bg-purple-950/15">
                    <div className="col-span-10">Booking Fee & Convenience Charge</div>
                    <div className="col-span-2 text-right text-emerald-400 font-bold">FREE</div>
                  </div>

                  {/* Grand total row */}
                  <div className="grid grid-cols-12 p-3 bg-purple-950/25 text-xs items-center">
                    <div className="col-span-6 text-[9px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      PAID & RSVP VALIDATED
                    </div>
                    <div className="col-span-4 text-right font-bold text-slate-400">TOTAL PAID:</div>
                    <div className="col-span-2 text-right font-mono text-xs font-black text-white">
                      ${((createdTicket?.seats || 1) * (createdTicket?.ticketType === "sponsor" ? 250 : createdTicket?.ticketType === "vip" ? 50 : 10)).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Event date/location block */}
                <div className="flex justify-between items-center bg-purple-950/10 border border-purple-500/10 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">EVENT VENUE</span>
                    <span className="text-[11px] font-semibold text-white">Rhythm Cyberdome Hall A</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">DOORS TIMING</span>
                    <span className="text-[11px] font-semibold text-white">Jan 16, 2026 • 19:30 UTC</span>
                  </div>
                </div>

                {createdTicket?.innovationSupport && (
                  <div className="text-[10px] text-purple-200/50 text-center italic font-light truncate max-w-full">
                    &ldquo;{createdTicket.innovationSupport}&rdquo;
                  </div>
                )}
              </div>

              {/* Tear-Off Cut Line */}
              <div className="relative h-px w-full border-t border-dashed border-purple-500/30">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#070417] border-r border-purple-500/30" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[#070417] border-l border-purple-500/30" />
              </div>

              {/* Large QR Display centered at the bottom */}
              <div className="p-6 bg-purple-950/15 flex flex-col items-center gap-4 text-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-300 font-mono font-bold block">
                  SECURE DECRYPTION GATE PASS QR
                </span>

                {/* Large QR display container */}
                <div className="w-48 h-48 bg-white p-3 rounded-3xl border border-purple-500/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.12)] shrink-0">
                  <img
                    src={createdTicket?.qrCodeUrl}
                    alt="Secure entry QR code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Present this QR code for gate admission</span>
                  <span className="text-[9px] text-purple-300/60 block font-light max-w-xs mx-auto leading-relaxed">
                    Code contains full URL verify matrix mapping securely linked to: <span className="font-mono text-cyan-300">{createdTicket?.id}</span>.
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 w-full mt-6">
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
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl h-10 font-semibold flex items-center justify-center gap-1.5"
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

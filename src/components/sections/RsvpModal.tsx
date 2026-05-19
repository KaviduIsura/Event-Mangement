"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveRSVP, RSVP } from "@/lib/store";
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
      <DialogContent className="max-w-lg bg-[#070417]/95 border border-purple-500/30 backdrop-blur-2xl text-white rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
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
              
              {/* Ticket Top: Brand */}
              <div className="p-4 border-b border-purple-500/20 bg-purple-950/20 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold block">Boarding Pass</span>
                  <span className="text-lg font-bold font-display text-white tracking-wide">Rhythm Night 2026</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-400/30 text-[10px] uppercase font-bold tracking-wider text-purple-300">
                  {createdTicket?.ticketType}
                </div>
              </div>

              {/* Ticket Middle: Details & QR Code split */}
              <div className="p-4 flex gap-4 items-center">
                {/* Details list */}
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">Holder</span>
                    <span className="text-sm font-semibold font-display text-white">{createdTicket?.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 block">Pass ID</span>
                      <span className="text-xs font-mono font-bold text-cyan-300">{createdTicket?.id}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 block">Seats</span>
                      <span className="text-xs font-semibold text-purple-300">{createdTicket?.seats} {createdTicket?.seats === 1 ? "Seat" : "Seats"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block">Date & Time</span>
                    <span className="text-xs font-semibold text-white/80">Jan 16, 2026 • 19:30</span>
                  </div>
                </div>

                {/* QR Code Graphic */}
                <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border border-purple-400/40 flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.08)] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={createdTicket?.qrCodeUrl}
                    alt="Cyber ticket QR code"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 border border-purple-500/10 rounded-2xl pointer-events-none" />
                </div>
              </div>

              {/* Decorative dash line separation */}
              <div className="relative h-px w-full border-t border-dashed border-purple-500/30">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#070417] border-r border-purple-500/30" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[#070417] border-l border-purple-500/30" />
              </div>

              {/* Ticket Footer: Support message and decorative bars */}
              <div className="p-4 bg-purple-950/10 flex flex-col gap-2">
                <div className="text-[10px] text-purple-200/60 text-center italic font-light truncate max-w-full">
                  &ldquo;{createdTicket?.innovationSupport}&rdquo;
                </div>
                <div className="flex justify-center items-center gap-1.5 mt-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-purple-500/30 rounded-full"
                      style={{
                        width: "2px",
                        height: `${Math.sin(i * 0.4) * 8 + 14}px`,
                      }}
                    />
                  ))}
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

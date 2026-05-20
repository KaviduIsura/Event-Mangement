"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getRSVPs,
  getPerformers,
  getSponsors,
  getAnnouncements,
  saveRSVP,
  savePerformer,
  saveSponsor,
  saveAnnouncement,
  updateRSVPCheckIn,
  deleteRSVP,
  deletePerformer,
  deleteSponsor,
  deleteAnnouncement,
  RSVP,
  Performer,
  Sponsor,
  Announcement,
  syncWithBackend,
} from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Music,
  Heart,
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  QrCode,
  Download,
  Ticket,
  Plus,
  Trash2,
  Volume2,
  Moon,
  Sun,
  LayoutDashboard,
  Home,
  ShieldAlert,
  Award,
  Lock,
  KeyRound,
  Menu,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Gatekeeper Authorization State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // HTML5 Live Camera QR Scanner State
  const [html5QrCodeInstance, setHtml5QrCodeInstance] = useState<any>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<any>(null);

  // Shared localStorage States
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "general" | "vip" | "sponsor">("all");

  // QR verification State
  const [verifyId, setVerifyId] = useState("");
  const [verifiedTicket, setVerifiedTicket] = useState<RSVP | null>(null);
  const [scanTab, setScanTab] = useState<"camera" | "manual">("camera");
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Form Adding states
  const [isPerfOpen, setIsPerfOpen] = useState(false);
  const [isSponOpen, setIsSponOpen] = useState(false);
  const [isAnnOpen, setIsAnnOpen] = useState(false);

  const [newPerf, setNewPerf] = useState({ name: "", role: "", genre: "", timeSlot: "", avatar: "/images/band.png" });
  const [newSpon, setNewSpon] = useState({ name: "", logo: "", tier: "gold" as "diamond" | "gold" | "silver", contribution: 1000 });
  const [newAnn, setNewAnn] = useState({ title: "", content: "", type: "info" as "info" | "alert" | "success" });

  // Counter Ticket Manual addition states
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [counterData, setCounterData] = useState({
    name: "",
    email: "",
    ticketType: "general" as "general" | "vip" | "sponsor",
    seats: 1,
    innovationSupport: "",
  });

  // Ticket Preview / Show Modal states
  const [selectedTicketForPreview, setSelectedTicketForPreview] = useState<RSVP | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check local session key
    const auth = sessionStorage.getItem("rhythm_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // Dynamically load html5-qrcode library safely on client-side to prevent Next.js SSR build errors
    import("html5-qrcode").then((module) => {
      setHtml5QrCodeInstance(() => module.Html5Qrcode);
    }).catch(err => {
      console.error("Failed to load html5-qrcode library dynamically:", err);
    });

    // Initial fetch from store
    setRsvps(getRSVPs());
    setPerformers(getPerformers());
    setSponsors(getSponsors());
    setAnnouncements(getAnnouncements());

    // Trigger full backend server sync immediately on mount
    syncWithBackend();

    // Event listener for backend database syncs
    const handleSync = () => {
      setRsvps(getRSVPs());
      setPerformers(getPerformers());
      setSponsors(getSponsors());
      setAnnouncements(getAnnouncements());
    };

    window.addEventListener("rhythm_night_db_sync", handleSync);
    return () => {
      window.removeEventListener("rhythm_night_db_sync", handleSync);
      // Clean up camera streaming context if page unmounts
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Decrypt authorization key handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (passwordInput === "admin123") {
        sessionStorage.setItem("rhythm_admin_auth", "true");
        setIsAuthenticated(true);
        toast({
          title: "Access Granted",
          description: "Welcome to Rhythm Night gate control interface.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid gate decryption security key.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 1200);
  };

  // Secure sign out / lock console
  const handleLogout = () => {
    stopCamera();
    sessionStorage.removeItem("rhythm_admin_auth");
    setIsAuthenticated(false);
    toast({
      title: "Console Locked",
      description: "Secure terminal session terminated.",
    });
  };

  // HTML5 rear camera controllers
  const startCamera = async () => {
    if (!html5QrCodeInstance) {
      toast({
        title: "Scanner Loading...",
        description: "Decryption optical engine is booting. Please wait a moment.",
      });
      return;
    }

    try {
      setCameraError("");
      setIsScanning(true);
      setIsCameraActive(true); // Toggle instantly to mount viewport element

      // Ensure any previously initialized active stream is cleared to avoid running clashes
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {}
      }

      // Create instance pointing to div "qr-reader-viewport"
      const scanner = new html5QrCodeInstance("qr-reader-viewport");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 240, // Highly robust static boundary box dimensions prevent startup crashes on mobile iOS/Android
        },
        (decodedText: string) => {
          // Parse the ticket ID from scanned raw code OR full URL
          const match = decodedText.match(/RN-\d{4}/i);
          const scannedId = match ? match[0].toUpperCase() : decodedText.trim().toUpperCase();
          
          setVerifyId(scannedId);
          
          toast({
            title: "QR Code Decoded!",
            description: `Serial parsed: "${scannedId}"`,
          });

          // Programmatic check-in trigger
          const latestRsvps = getRSVPs();
          const matched = latestRsvps.find(r => r.id.toLowerCase() === scannedId.toLowerCase());
          if (matched) {
            if (!matched.checkedIn) {
              const updated = updateRSVPCheckIn(matched.id, true);
              setRsvps(updated);
              const updatedTicket = updated.find(r => r.id === matched.id);
              setVerifiedTicket(updatedTicket || matched);
              toast({
                title: "Scan Authorized!",
                description: `Successfully checked in ${matched.name} (${matched.id}).`,
              });
            } else {
              setVerifiedTicket(matched);
              toast({
                title: "Pass Previously Used",
                description: `${matched.name} is already inside the event hall.`,
              });
            }
          } else {
            setVerifiedTicket(null);
            toast({
              title: "Ticket Matrix Mismatch",
              description: `Boarding Pass code "${decodedText}" was not recognized.`,
              variant: "destructive"
            });
          }

          stopCamera();
        },
        (errorMessage: string) => {
          // Continuous video scanning frame cycle
        }
      );

      setIsScanning(false);
    } catch (err: any) {
      console.error("Camera permissions failed:", err);
      setIsScanning(false);
      setIsCameraActive(false);
      setCameraError("Camera blocked. Note: Mobile cameras require secure HTTPS connections to run!");
      toast({
        title: "Camera Matrix Failure",
        description: "Webcam blocked or insecure HTTP context. Mobile phone camera APIs require secure HTTPS hosting (like Vercel) to initialize!",
        variant: "destructive"
      });
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Failed to release camera context:", err);
      }
      scannerRef.current = null;
    }
    setIsCameraActive(false);
  };

  if (!mounted || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: "Theme Switched",
      description: `Switched dashboard style to ${theme === "dark" ? "Light" : "Dark"} Mode (simulation).`,
    });
  };

  // Calculations for KPIs
  const totalTickets = rsvps.reduce((acc, curr) => acc + curr.seats, 0);
  const totalCheckedIn = rsvps.filter(r => r.checkedIn).reduce((acc, curr) => acc + curr.seats, 0);
  const totalSponsorsContribution = sponsors.reduce((acc, curr) => acc + curr.contribution, 0);
  
  // Calculate ticket revenue in LKR: Neon Entry (Rs. 1,000), Aurora Access (Rs. 1,800), Cosmic Elite (Rs. 2,500)
  const ticketRevenue = rsvps.reduce((acc, curr) => {
    const price = curr.ticketType === "vip" ? 1800 : curr.ticketType === "sponsor" ? 2500 : 1000;
    return acc + (price * curr.seats);
  }, 0);
  const totalFunds = ticketRevenue + totalSponsorsContribution;

  // RSVP actions
  const handleCheckInToggle = (id: string, currentStatus: boolean) => {
    const updated = updateRSVPCheckIn(id, !currentStatus);
    setRsvps(updated);
    toast({
      title: "Check-in Status Updated",
      description: `Ticket ${id} is now ${!currentStatus ? "Checked In" : "Unchecked"}.`,
    });
  };

  const handleDeleteRSVP = (id: string) => {
    // block deletions under immutable security policies
    toast({
      title: "Action Forbidden",
      description: "[Security Policy] Confirmed ticketing records are fully immutable and cannot be deleted.",
      variant: "destructive",
    });
  };

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterData.name || !counterData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in guest name and email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save manually using the local store saveRSVP (which validates unique email!)
      const ticket = saveRSVP({
        name: counterData.name.trim(),
        email: counterData.email.trim(),
        ticketType: counterData.ticketType,
        seats: counterData.seats,
        innovationSupport: counterData.innovationSupport || "Counter Purchase ticket booking",
      });

      // Update state
      setRsvps(getRSVPs());
      setIsCounterOpen(false);
      
      // Reset form
      setCounterData({
        name: "",
        email: "",
        ticketType: "general",
        seats: 1,
        innovationSupport: "",
      });

      toast({
        title: "Ticket Issued!",
        description: `Successfully issued ticket ${ticket.id} from Counter.`,
      });
    } catch (err: any) {
      toast({
        title: "Counter Issue Failed",
        description: err.message || "Failed to manually issue ticket.",
        variant: "destructive",
      });
    }
  };

  const downloadAdminTicketImage = async () => {
    const ticketElement = document.querySelector(".print-admin-ticket-card") as HTMLElement;
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
        description: "Compiling high-contrast thermal ticket copy...",
      });

      const canvas = await html2canvas(ticketElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imageUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = `Rhythm_Night_Ticket_${selectedTicketForPreview?.id || "pass"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast({
        title: "Download Complete!",
        description: "Ticket copy has been successfully downloaded.",
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

  // Live verification scanner
  const handleVerifyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyId) return;

    const latestRsvps = getRSVPs();
    const matched = latestRsvps.find(r => r.id.toLowerCase() === verifyId.trim().toLowerCase());
    if (matched) {
      if (!matched.checkedIn) {
        // Auto check-in verified ticket
        const updated = updateRSVPCheckIn(matched.id, true);
        setRsvps(updated);
        const updatedTicket = updated.find(r => r.id === matched.id);
        setVerifiedTicket(updatedTicket || matched);
        toast({
          title: "Ticket Verified!",
          description: `Checked in ${matched.name} successfully.`,
        });
      } else {
        setVerifiedTicket(matched);
        toast({
          title: "Ticket Verified",
          description: `${matched.name} was already checked in.`,
        });
      }
    } else {
      setVerifiedTicket(null);
      toast({
        title: "Invalid Ticket ID",
        description: `No boarding pass matching ID "${verifyId}" was found.`,
        variant: "destructive",
      });
    }
  };

  // Live holographic QR scan simulation
  const triggerSimulatedScan = () => {
    const latestRsvps = getRSVPs();
    if (latestRsvps.length === 0) {
      toast({
        title: "No Tickets Found",
        description: "Please RSVP for a ticket first so we can simulate scanning it!",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    toast({
      title: "Scanner Initializing...",
      description: "Booting holographic laser camera matrix feed.",
    });

    setTimeout(() => {
      const currentRsvps = getRSVPs();
      // Pick a random ticket, preferring one that is not checked-in yet
      const unchecked = currentRsvps.filter(r => !r.checkedIn);
      const chosenTicket = unchecked.length > 0 
        ? unchecked[Math.floor(Math.random() * unchecked.length)]
        : currentRsvps[Math.floor(Math.random() * currentRsvps.length)];

      setVerifyId(chosenTicket.id);
      setIsScanning(false);

      // Perform optimistic check-in
      const matched = chosenTicket;
      
      if (!matched.checkedIn) {
        const updated = updateRSVPCheckIn(matched.id, true);
        setRsvps(updated);
        const updatedTicket = updated.find(r => r.id === matched.id);
        setVerifiedTicket(updatedTicket || matched);
        toast({
          title: "Laser Scan Successful!",
          description: `Checked in ${matched.name} (${matched.id}) successfully.`,
        });
      } else {
        setVerifiedTicket(matched);
        toast({
          title: "Pass Scan Complete",
          description: `${matched.name} was already checked in.`,
        });
      }
    }, 1800);
  };

  // Add handlers
  const handleAddPerformer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerf.name || !newPerf.role) return;
    const updated = savePerformer(newPerf);
    setPerformers(updated);
    setIsPerfOpen(false);
    setNewPerf({ name: "", role: "", genre: "", timeSlot: "", avatar: "/images/band.png" });
    toast({ title: "Performer Added", description: `${newPerf.name} listed in schedule.` });
  };

  const handleAddSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpon.name || !newSpon.logo) return;
    const updated = saveSponsor(newSpon);
    setSponsors(updated);
    setIsSponOpen(false);
    setNewSpon({ name: "", logo: "", tier: "gold", contribution: 1000 });
    toast({ title: "Sponsor Listed", description: `${newSpon.name} corporate tier active.` });
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) return;
    const updated = saveAnnouncement(newAnn);
    setAnnouncements(updated);
    setIsAnnOpen(false);
    setNewAnn({ title: "", content: "", type: "info" });
    toast({ title: "Alert Broadcasted", description: "Emergency alert active on server." });
  };

  // Delete Handlers
  const handleDeletePerformer = (id: string) => {
    setPerformers(deletePerformer(id));
    toast({ title: "Performer Removed" });
  };

  const handleDeleteSponsor = (id: string) => {
    setSponsors(deleteSponsor(id));
    toast({ title: "Sponsor Removed" });
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(deleteAnnouncement(id));
    toast({ title: "Announcement Removed" });
  };

  // Filter & Search RSVPs
  const filteredRSVPs = rsvps.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && r.ticketType === filterType;
  });

  // Recharts Chart Data dynamically populated from live MongoDB RSVP registers
  const getBookingChartData = () => {
    const datesMap: { [key: string]: number } = {};
    
    // Initialize last 5 calendar days
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
      datesMap[dateStr] = 0;
    }

    rsvps.forEach((r) => {
      try {
        const dateStr = new Date(r.createdAt).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
        if (dateStr in datesMap) {
          datesMap[dateStr] += r.seats;
        } else {
          // Keep dynamic range grouping
          datesMap[dateStr] = (datesMap[dateStr] || 0) + r.seats;
        }
      } catch (e) {
        // Fallback for seed date parsing
      }
    });

    return Object.entries(datesMap)
      .map(([name, Tickets]) => ({ name, Tickets }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const chartData = getBookingChartData();

  const sponsorChartData = sponsors.map(s => ({
    name: s.name,
    Contribution: s.contribution,
  }));

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white relative overflow-hidden font-sans">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Futuristic particles / grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0b2a_1px,transparent_1px),linear-gradient(to_bottom,#0f0b2a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative z-10 w-full max-w-md px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 rounded-3xl border border-purple-500/20 bg-[#090526]/50 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.05)] text-center relative overflow-hidden"
          >
            {/* Tech bracket accents */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-purple-400/50" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-purple-400/50" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-purple-400/50" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-purple-400/50" />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <Lock className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-purple-300 font-bold block mb-2">
              Rhythm Night 2026
            </span>
            <h2 className="text-2xl font-display font-black tracking-wide text-white mb-2">
              Gatekeeper Portal
            </h2>
            <p className="text-xs text-slate-400 font-light mb-8">
              Decrypt safety key to authorize gate control terminal.
            </p>

            <form onSubmit={handleLogin} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="passKey" className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Decryption Password
                </Label>
                <div className="relative">
                  <Input
                    id="passKey"
                    type="password"
                    placeholder="Enter admin password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="h-12 bg-slate-950/70 border-purple-500/20 text-white rounded-xl placeholder:text-slate-700 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 pl-10 font-mono tracking-widest text-center"
                    required
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <KeyRound className="w-4 h-4 text-purple-400/50" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold font-display tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? "Decrypting Matrix..." : "Decrypt Authorization Key"}
              </Button>
            </form>

            <div className="mt-8 text-[9px] font-mono text-slate-600 tracking-wider">
              IP TRACE ACTIVE // SECURE SYSTEM CONSOLE
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === "dark" ? "bg-[#030014] text-white" : "bg-[#f8fafc] text-slate-900"
    }`}>
      {/* Sidebar Grid Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar Left Component */}
        <aside className={`w-full lg:w-64 flex-shrink-0 flex flex-col lg:justify-between p-4 lg:p-6 border-b lg:border-b-0 lg:border-r transition-all duration-300 ${
          theme === "dark" ? "bg-[#070417]/90 border-purple-500/10" : "bg-white border-slate-200"
        }`}>
          {/* Mobile Brand Header */}
          <div className="flex items-center justify-between lg:mb-8 w-full">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-purple-400 animate-pulse" />
              <span className="font-display font-black text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                RHYTHM SaaS
              </span>
            </div>
            
            {/* Mobile Navigation Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-9 w-9 text-slate-400 hover:text-white rounded-xl focus:bg-purple-600/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-purple-400" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation & Controls Wrapper: Collapsible on mobile, static on desktop */}
          <div className={`${
            isMobileMenuOpen ? "flex animate-in fade-in slide-in-from-top-4 duration-300" : "hidden"
          } lg:flex flex-col flex-1 justify-between mt-4 lg:mt-0 gap-6 lg:gap-8`}>
            
            {/* Simulated navigation */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 px-3 block mb-1">Navigation</span>
              
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xs uppercase tracking-wider font-semibold gap-2.5 h-10 hover:bg-purple-600/10 rounded-xl"
                >
                  <Home className="w-4 h-4 text-purple-400" />
                  Home Page
                </Button>
              </Link>
            </div>

            {/* Sidebar Footer details */}
            <div className="pt-6 border-t border-purple-500/10 flex flex-col gap-4">
              {/* Theme selector */}
              <Button
                variant="outline"
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full h-10 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold ${
                  theme === "dark" ? "border-purple-500/20 bg-purple-950/20 hover:bg-purple-900/30 text-purple-300" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    Dark Mode
                  </>
                )}
              </Button>

              {/* Lock Dashboard Console */}
              <Button
                variant="outline"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full h-10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border-rose-500/20 bg-rose-950/10 hover:bg-rose-950/30 text-rose-400 border animate-pulse"
              >
                <Lock className="w-4 h-4 text-rose-400" />
                Lock Terminal
              </Button>
              
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] text-slate-400 font-mono">Live synchronization</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Dashboard Content Right */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-x-hidden space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-purple-500/10 pb-6">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-purple-400 block">IT Innovation Fair Fundraiser</span>
              <h1 className="text-3xl font-display font-bold">Rhythm Night 2026 Dashboard</h1>
            </div>
            
            {/* Counter Sales Ticket Issuer */}
            <div className="flex gap-3">
              <Dialog open={isCounterOpen} onOpenChange={setIsCounterOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-xl text-xs gap-1.5 h-10 bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  >
                    <Plus className="w-4 h-4" />
                    Issue Ticket (Counter)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-[#070417] border border-purple-500/30 text-white rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.2)] p-6 z-50">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      🎟️ Counter Ticket Sales
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-400 font-light">
                      Manually issue confirmed attendee tickets directly from the main desk.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCounterSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="counterName" className="text-xs text-slate-400">Guest Full Name</Label>
                      <Input
                        id="counterName"
                        value={counterData.name}
                        onChange={(e) => setCounterData({ ...counterData, name: e.target.value })}
                        placeholder="e.g. Kavidu Isura"
                        className="bg-[#0e0a29] border-purple-500/20 text-white rounded-xl focus:border-purple-500/50"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="counterEmail" className="text-xs text-slate-400">Email Address</Label>
                      <Input
                        id="counterEmail"
                        type="email"
                        value={counterData.email}
                        onChange={(e) => setCounterData({ ...counterData, email: e.target.value })}
                        placeholder="e.g. kavidu@mail.com"
                        className="bg-[#0e0a29] border-purple-500/20 text-white rounded-xl focus:border-purple-500/50"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="counterType" className="text-xs text-slate-400">Ticket Class</Label>
                        <Select
                          onValueChange={(value: any) => setCounterData({ ...counterData, ticketType: value })}
                          defaultValue="general"
                        >
                          <SelectTrigger className="bg-[#0e0a29] border-purple-500/20 text-white rounded-xl">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#070417] border-purple-500/30 text-white">
                            <SelectItem value="general">🎟️ Neon Entry (Rs. 1,000)</SelectItem>
                            <SelectItem value="vip">👑 Aurora Access (Rs. 1,800)</SelectItem>
                            <SelectItem value="sponsor">💎 Cosmic Elite (Rs. 2,500)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="counterSeats" className="text-xs text-slate-400">Seats Count</Label>
                        <Select
                          onValueChange={(value) => setCounterData({ ...counterData, seats: parseInt(value) })}
                          defaultValue="1"
                        >
                          <SelectTrigger className="bg-[#0e0a29] border-purple-500/20 text-white rounded-xl">
                            <SelectValue placeholder="Quantity" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#070417] border-purple-500/30 text-white">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Seat" : "Seats"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 flex justify-between items-center">
                      <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">Total Sales price:</span>
                      <span className="text-sm font-mono font-bold text-pink-400">
                        Rs. {(counterData.seats * (counterData.ticketType === "sponsor" ? 2500 : counterData.ticketType === "vip" ? 1800 : 1000)).toLocaleString()} LKR
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="counterSupport" className="text-xs text-slate-400">Support Note (Optional)</Label>
                      <Textarea
                        id="counterSupport"
                        value={counterData.innovationSupport}
                        onChange={(e) => setCounterData({ ...counterData, innovationSupport: e.target.value })}
                        placeholder="Innovator motivation / table details..."
                        className="bg-[#0e0a29] border-purple-500/20 text-white rounded-xl focus:border-purple-500/50 min-h-[50px] resize-none text-xs"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold h-11 rounded-xl text-xs transition-all duration-300"
                    >
                      🎟️ Confirm Sale & Issue Ticket
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* MAIN TABS CONTAINER */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            
            {/* Mobile Navigation Dropdown Select */}
            <div className="block lg:hidden w-full mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className={`w-full h-11 rounded-xl font-semibold text-xs uppercase tracking-wider focus:ring-0 ${
                  theme === "dark" 
                    ? "bg-[#090526]/80 border-purple-500/25 text-white" 
                    : "bg-white border-slate-200 text-slate-800"
                }`}>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent className={`${
                  theme === "dark" ? "bg-[#0c0827] border-purple-500/30 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}>
                  <SelectItem value="overview">📈 Overview Stats</SelectItem>
                  <SelectItem value="registrations">🎟️ RSVPs & Tickets</SelectItem>
                  <SelectItem value="verification">🔍 QR Gate Check-in</SelectItem>
                  <SelectItem value="performers">🎸 Performers Lineup</SelectItem>
                  <SelectItem value="sponsors">💎 Corporate Sponsors</SelectItem>
                  <SelectItem value="alerts">📢 Broadcast Alerts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Navigation TabsList */}
            <TabsList className={`hidden lg:grid lg:grid-cols-6 rounded-xl border p-1 ${
              theme === "dark" ? "bg-[#090526]/50 border-purple-500/10" : "bg-slate-100 border-slate-200"
            }`}>
              <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">Overview</TabsTrigger>
              <TabsTrigger value="registrations" className="rounded-lg text-xs font-semibold">RSVPs & Tickets</TabsTrigger>
              <TabsTrigger value="verification" className="rounded-lg text-xs font-semibold">QR Gate Check-in</TabsTrigger>
              <TabsTrigger value="performers" className="rounded-lg text-xs font-semibold">Performers</TabsTrigger>
              <TabsTrigger value="sponsors" className="rounded-lg text-xs font-semibold">Sponsors</TabsTrigger>
              <TabsTrigger value="alerts" className="rounded-lg text-xs font-semibold">Broadcasts</TabsTrigger>
            </TabsList>

            {/* TAB: OVERVIEW */}
            <TabsContent value="overview" className="space-y-6">
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Funding */}
                <Card className={`rounded-2xl border transition-all duration-300 ${
                  theme === "dark" ? "bg-[#090526]/40 border-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.02)]" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Funding Raised</CardTitle>
                    <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-black">Rs. {totalFunds.toLocaleString()}</div>
                    <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                      +100% direct proceeds match active
                    </p>
                  </CardContent>
                </Card>

                {/* Ticket Volume */}
                <Card className={`rounded-2xl border transition-all duration-300 ${
                  theme === "dark" ? "bg-[#090526]/40 border-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.02)]" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-bold">Tickets Reserved</CardTitle>
                    <Users className="w-4 h-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-black">{totalTickets} Seats</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-light">
                      Across {rsvps.length} registered reservations
                    </p>
                  </CardContent>
                </Card>

                {/* Checked in Rate */}
                <Card className={`rounded-2xl border transition-all duration-300 ${
                  theme === "dark" ? "bg-[#090526]/40 border-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.02)]" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-bold">Checked In Ratio</CardTitle>
                    <QrCode className="w-4 h-4 text-cyan-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-black">
                      {totalTickets > 0 ? Math.round((totalCheckedIn / totalTickets) * 100) : 0}%
                    </div>
                    <p className="text-[10px] text-cyan-400 font-medium mt-1">
                      {totalCheckedIn} out of {totalTickets} seats validated
                    </p>
                  </CardContent>
                </Card>

                {/* Corporate Sponsorships */}
                <Card className={`rounded-2xl border transition-all duration-300 ${
                  theme === "dark" ? "bg-[#090526]/40 border-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.02)]" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-bold">Sponsor Pledges</CardTitle>
                    <Award className="w-4 h-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-black">Rs. {totalSponsorsContribution.toLocaleString()}</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-light">
                      From {sponsors.length} premium listed companies
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Area Chart - Booking Volume */}
                <Card className={`lg:col-span-8 rounded-2xl border ${
                  theme === "dark" ? "bg-[#090526]/30 border-purple-500/10" : "bg-white border-slate-200"
                }`}>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-purple-400" /> Ticket Booking Curve over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#ffffff08" : "#00000008"} />
                        <XAxis dataKey="name" stroke={theme === "dark" ? "#ffffff50" : "#00000050"} fontSize={10} />
                        <YAxis stroke={theme === "dark" ? "#ffffff50" : "#00000050"} fontSize={10} />
                        <Tooltip contentStyle={{
                          backgroundColor: theme === "dark" ? "#070417" : "#fff",
                          borderColor: "#a855f720",
                          borderRadius: "12px",
                          color: theme === "dark" ? "#fff" : "#000",
                          fontSize: "12px",
                        }} />
                        <Area type="monotone" dataKey="Tickets" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#purpleGlow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Bar Chart - Sponsor Contribution */}
                <Card className={`lg:col-span-4 rounded-2xl border ${
                  theme === "dark" ? "bg-[#090526]/30 border-purple-500/10" : "bg-white border-slate-200"
                }`}>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Corporate Sponsors Contributions</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    {sponsorChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sponsorChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#ffffff08" : "#00000008"} />
                          <XAxis dataKey="name" stroke={theme === "dark" ? "#ffffff50" : "#00000050"} fontSize={8} />
                          <YAxis stroke={theme === "dark" ? "#ffffff50" : "#00000050"} fontSize={10} />
                          <Tooltip contentStyle={{
                            backgroundColor: theme === "dark" ? "#070417" : "#fff",
                            borderColor: "#22d3ee20",
                            borderRadius: "12px",
                            color: theme === "dark" ? "#fff" : "#000",
                            fontSize: "12px",
                          }} />
                          <Bar dataKey="Contribution" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-white/40">
                        No active sponsors listed
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB: REGISTRATIONS TABLE */}
            <TabsContent value="registrations" className="space-y-6">
              
              {/* Table search & filter filters */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search name, ticket ID or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 h-10 rounded-xl focus:ring-0 ${
                      theme === "dark" ? "bg-[#090526]/50 border-purple-500/20" : "bg-white border-slate-200"
                    }`}
                  />
                </div>

                {/* Filter select */}
                <div className="w-full sm:w-44 flex-shrink-0">
                  <Select onValueChange={(value: any) => setFilterType(value)} defaultValue="all">
                    <SelectTrigger className={`h-10 rounded-xl focus:ring-0 ${
                      theme === "dark" ? "bg-[#090526]/50 border-purple-500/20 text-white" : "bg-white border-slate-200"
                    }`}>
                      <SelectValue placeholder="Ticket Tier" />
                    </SelectTrigger>
                    <SelectContent className={`${
                      theme === "dark" ? "bg-[#0c0827] border-purple-500/30 text-white" : "bg-white border-slate-200"
                    }`}>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="general">General Support</SelectItem>
                      <SelectItem value="vip">VIP Passes</SelectItem>
                      <SelectItem value="sponsor">Corporate Sponsors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Desktop Data Table */}
              <div className={`hidden md:block rounded-2xl border overflow-x-auto shadow-sm ${
                theme === "dark" ? "bg-[#090526]/40 border-purple-500/10" : "bg-white border-slate-200"
              }`}>
                <Table>
                  <TableHeader className={theme === "dark" ? "bg-purple-950/15" : "bg-slate-50"}>
                    <TableRow className={theme === "dark" ? "border-purple-500/10" : "border-slate-200"}>
                      <TableHead className="font-semibold text-xs uppercase text-slate-400 w-24">ID</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-slate-400">Name / Contact</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-slate-400 w-32">Tier</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-slate-400 text-center w-24">Seats</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-slate-400 text-center w-36">Entrance Checked</TableHead>
                      <TableHead className="font-semibold text-xs uppercase text-slate-400 text-right w-36">Show Ticket</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {filteredRSVPs.length > 0 ? (
                      filteredRSVPs.map((row) => (
                        <TableRow key={row.id} className={theme === "dark" ? "border-purple-500/10 hover:bg-purple-950/10" : "border-slate-100 hover:bg-slate-50/50"}>
                          <TableCell className="font-mono font-bold text-xs text-purple-400">{row.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{row.name}</div>
                              <div className="text-[11px] text-slate-400 font-light">{row.email}</div>
                              {row.innovationSupport && (
                                <div className="text-[10px] text-pink-400 italic font-light truncate max-w-xs mt-0.5">
                                  &ldquo;{row.innovationSupport}&rdquo;
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                              row.ticketType === "sponsor"
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/25"
                                : row.ticketType === "vip"
                                ? "bg-pink-500/10 text-pink-400 border border-pink-400/25"
                                : "bg-purple-500/10 text-purple-400 border border-purple-400/25"
                            }`}>
                              {row.ticketType}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-semibold text-sm">{row.seats}</TableCell>
                          
                          <TableCell className="text-center">
                            <button
                              onClick={() => handleCheckInToggle(row.id, row.checkedIn)}
                              className="focus:outline-none hover:scale-105 transition-transform"
                            >
                              {row.checkedIn ? (
                                <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  <CheckCircle className="w-3.5 h-3.5" /> Checked In
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-400 border border-slate-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  <XCircle className="w-3.5 h-3.5" /> Checked Out
                                </div>
                              )}
                            </button>
                          </TableCell>

                          <TableCell className="text-right pr-4">
                            <Button
                              onClick={() => setSelectedTicketForPreview(row)}
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/40 text-purple-300 px-3.5 py-1.5 rounded-xl h-8.5 transition-all duration-300"
                            >
                              <QrCode className="w-3.5 h-3.5" /> Show Ticket
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-slate-400 font-light">
                          No ticket registrations match search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Responsive Cards View */}
              <div className="md:hidden space-y-4">
                {filteredRSVPs.length > 0 ? (
                  filteredRSVPs.map((row) => (
                    <div key={row.id} className={`p-4 rounded-2xl border flex flex-col gap-3.5 transition-all duration-300 ${
                      theme === "dark" 
                        ? "bg-[#090526]/40 border-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.01)]" 
                        : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      {/* Header: ID & Tier */}
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-xs text-purple-400">{row.id}</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                          row.ticketType === "sponsor"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/25"
                            : row.ticketType === "vip"
                            ? "bg-pink-500/10 text-pink-400 border border-pink-400/25"
                            : "bg-purple-500/10 text-purple-400 border border-purple-400/25"
                        }`}>
                          {row.ticketType}
                        </span>
                      </div>

                      {/* Info: Name, Email & Support Note */}
                      <div className="space-y-1">
                        <div className={`font-semibold text-sm ${theme === "dark" ? "text-white" : "text-slate-800"}`}>{row.name}</div>
                        <div className="text-[11px] text-slate-400 font-light">{row.email}</div>
                        {row.innovationSupport && (
                          <div className="text-[10px] text-pink-400 italic font-light mt-1.5 leading-relaxed bg-pink-500/5 p-2 rounded-lg border border-pink-500/10">
                            &ldquo;{row.innovationSupport}&rdquo;
                          </div>
                        )}
                      </div>

                      {/* Footer Details: Seats, Checked-in toggle, Trash action */}
                      <div className="pt-3 border-t border-purple-500/10 flex justify-between items-center gap-2">
                        <div className="text-xs text-slate-400">
                          Seats: <span className={`font-bold ${theme === "dark" ? "text-white" : "text-slate-800"}`}>{row.seats}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCheckInToggle(row.id, row.checkedIn)}
                            className="focus:outline-none hover:scale-105 transition-transform"
                          >
                            {row.checkedIn ? (
                              <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                <CheckCircle className="w-3 h-3" /> Checked In
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-400 border border-slate-400/30 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                <XCircle className="w-3 h-3" /> Checked Out
                              </div>
                            )}
                          </button>

                          <Button
                            onClick={() => setSelectedTicketForPreview(row)}
                            className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/40 text-purple-300 px-2.5 py-0.5 rounded-xl h-7 transition-all duration-300"
                          >
                            <QrCode className="w-2.5 h-2.5" /> Show Ticket
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 font-light">
                    No ticket registrations match search criteria.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB: INTERACTIVE QR VALIDATION GATE */}
            <TabsContent value="verification" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
                
                {/* Form Input panel */}
                <div className={`md:col-span-5 p-6 rounded-2xl border ${
                  theme === "dark" ? "bg-[#090526]/40 border-purple-500/20 shadow-lg" : "bg-white border-slate-200"
                }`}>
                  <h3 className="text-lg font-bold font-display flex items-center gap-2 mb-4">
                    <QrCode className="w-5 h-5 text-purple-400 animate-pulse" /> QR Scan Verification
                  </h3>
                  
                  {/* Style tag for laser sweep keyframes */}
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes laser-sweep {
                      0%, 100% { top: 5%; }
                      50% { top: 95%; }
                    }
                    .animate-laser {
                      position: absolute;
                      animation: laser-sweep 2.2s ease-in-out infinite;
                    }
                  `}} />

                  {/* Mode Selector */}
                  <div className="flex gap-1.5 p-1 bg-slate-950/60 border border-purple-500/15 rounded-xl mb-4 text-xs">
                    <button
                      type="button"
                      onClick={() => setScanTab("camera")}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        scanTab === "camera"
                          ? "bg-purple-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Holographic Laser
                    </button>
                    <button
                      type="button"
                      onClick={() => setScanTab("manual")}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        scanTab === "manual"
                          ? "bg-purple-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Manual Serial
                    </button>
                  </div>

                  {scanTab === "camera" ? (
                    <div className="space-y-4">
                      {/* Panoramic view finder */}
                      <div className="relative w-full h-[200px] rounded-xl overflow-hidden border border-cyan-500/25 bg-[#070417] flex flex-col justify-center items-center shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                        {/* Glowing brackets on corners */}
                        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400/80 z-20" />
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/80 z-20" />
                        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400/80 z-20" />
                        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400/80 z-20" />

                        {/* Laser line bar */}
                        <div className="absolute left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-laser z-20" />

                        {/* Target placeholder container for HTML5 video stream */}
                        <div id="qr-reader-viewport" className="absolute inset-0 w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover" />

                        {/* Dynamic scan states overlay */}
                        {!isCameraActive && (
                          <div className="text-center space-y-2.5 z-10 bg-slate-950/60 p-4 rounded-xl backdrop-blur-sm border border-white/5 max-w-[80%]">
                            <QrCode className="w-10 h-10 text-cyan-500/30 mx-auto animate-pulse" />
                            <span className="text-[9px] uppercase tracking-widest text-slate-300 font-mono block">
                              Webcam Link Offline
                            </span>
                            <span className="text-[8px] text-slate-400 block leading-relaxed">
                              Authorize camera permissions to initiate live video validation.
                            </span>
                          </div>
                        )}

                        {isCameraActive && isScanning && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-10 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-400/20 animate-pulse">
                            <span className="text-[8px] uppercase tracking-widest text-cyan-400 font-mono font-bold">
                              Live Video Stream Active
                            </span>
                          </div>
                        )}
                      </div>

                      {cameraError && (
                        <div className="text-[9px] text-center text-rose-400 font-mono bg-rose-950/15 p-2 rounded-lg border border-rose-500/10">
                          {cameraError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-2">
                        {isCameraActive ? (
                          <Button
                            type="button"
                            onClick={stopCamera}
                            className="w-full h-11 bg-rose-950/40 hover:bg-rose-900/30 border border-rose-500/30 text-rose-400 font-bold font-display tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                          >
                            Disconnect Camera Stream
                          </Button>
                        ) : (
                          <>
                            <Button
                              type="button"
                              onClick={startCamera}
                              className="w-full h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-display tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            >
                              Initialize Mobile Camera Scan
                            </Button>
                            
                            <Button
                              type="button"
                              onClick={triggerSimulatedScan}
                              disabled={isScanning}
                              className="w-full h-9 bg-slate-950/60 hover:bg-slate-900/50 border border-purple-500/15 hover:border-purple-500/30 text-purple-300 text-xs font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
                            >
                              {isScanning ? "Decrypting..." : "Simulate Holographic Mock Scan"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyTicket} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="verifyId" className="text-xs text-slate-400">Boarding Pass Ticket ID</Label>
                        <Input
                          id="verifyId"
                          placeholder="e.g. RN-8942"
                          value={verifyId}
                          onChange={(e) => setVerifyId(e.target.value)}
                          className={`h-11 rounded-xl text-center font-mono font-bold tracking-wider ${
                            theme === "dark" ? "bg-[#0c0827] border-purple-500/20 focus:border-purple-400" : "bg-slate-50 border-slate-200"
                          }`}
                          required
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold font-display tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      >
                        Verify & Check-in Pass
                      </Button>
                    </form>
                  )}
                </div>

                {/* Gate Display Output */}
                <div className="md:col-span-7 flex justify-center items-center h-full">
                  <AnimatePresence mode="wait">
                    {verifiedTicket ? (
                      <motion.div
                        key={verifiedTicket.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="w-full bg-gradient-to-b from-[#110c33] to-[#070417] border border-purple-400/40 rounded-2xl overflow-hidden shadow-2xl relative p-6 flex flex-col justify-between h-auto min-h-[320px]"
                      >
                        {/* Ring element */}
                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />

                        <div className="flex justify-between items-start">
                          <div className="text-left">
                            <span className="text-[9px] uppercase tracking-widest text-purple-300 font-bold block">Access Granted</span>
                            <span className="text-xl font-bold font-display text-white mt-1 block">{verifiedTicket.name}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-400/30 text-[9px] uppercase font-bold tracking-wider text-emerald-400 rounded-md h-fit">
                            Verified Check-in
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-purple-500/15">
                          <div className="text-left">
                            <span className="text-[9px] uppercase text-white/40 block">Pass Serial</span>
                            <span className="text-sm font-mono font-bold text-cyan-300">{verifiedTicket.id}</span>
                          </div>
                          <div className="text-left">
                            <span className="text-[9px] uppercase text-white/40 block">Seat Reservation</span>
                            <span className="text-sm font-semibold text-white">{verifiedTicket.seats} {verifiedTicket.seats === 1 ? "Seat" : "Seats"}</span>
                          </div>
                        </div>

                        {/* Gate Collection Alert Banner */}
                        <div className="my-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center z-10 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                          <div className="text-left">
                            <span className="text-[8px] uppercase tracking-widest text-amber-400 font-bold block">Gate Fee to Collect</span>
                            <span className="text-[10px] text-white/50 font-light block">
                              {verifiedTicket.ticketType.toUpperCase()} Tier • {verifiedTicket.seats} {verifiedTicket.seats === 1 ? "Seat" : "Seats"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-display font-black text-amber-400 block">
                              Rs. {(verifiedTicket.seats * (verifiedTicket.ticketType === "sponsor" ? 2500 : verifiedTicket.ticketType === "vip" ? 1800 : 1000)).toLocaleString()} LKR
                            </span>
                            <span className="text-[8px] uppercase tracking-widest text-white/40 font-mono">Collect at door</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2 text-xs text-white/50 font-light pt-2 border-t border-purple-500/10">
                          <span>Tier: <strong className="text-purple-300 uppercase">{verifiedTicket.ticketType}</strong></span>
                          <span>Timestamp: <strong>{new Date(verifiedTicket.createdAt).toLocaleTimeString()}</strong></span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="w-full h-[300px] border border-dashed border-purple-500/20 rounded-2xl flex flex-col justify-center items-center text-center p-6 bg-[#090526]/10">
                        <ShieldAlert className="w-12 h-12 text-purple-500/40 animate-pulse mb-3" />
                        <span className="text-sm font-semibold text-slate-400 font-display">Awaiting Verification</span>
                        <p className="text-xs text-slate-500 max-w-xs mt-1.5 font-light leading-relaxed">
                          Input a ticket serial code (e.g. <strong>RN-8942</strong>) inside the scanner panel to trigger live gate check-in registers.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </TabsContent>

            {/* TAB: PERFORMERS MANAGEMENT */}
            <TabsContent value="performers" className="space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold font-display flex items-center gap-1.5"><Music className="w-5 h-5 text-purple-400 animate-pulse" /> Performance Lineup</h3>
                
                {/* Add Performer Dialog */}
                <Dialog open={isPerfOpen} onOpenChange={setIsPerfOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl h-10 text-xs gap-1.5">
                      <Plus className="w-4 h-4" /> Add Performer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#070417]/95 border border-purple-500/30 text-white rounded-2xl backdrop-blur-2xl max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold font-display">Add Live Performer</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddPerformer} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="perfName" className="text-xs text-slate-400">Name / Band Name</Label>
                        <Input
                          id="perfName"
                          value={newPerf.name}
                          onChange={(e) => setNewPerf({ ...newPerf, name: e.target.value })}
                          placeholder="e.g. Synth Raiders"
                          className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="perfRole" className="text-xs text-slate-400">Role / Placement</Label>
                        <Input
                          id="perfRole"
                          value={newPerf.role}
                          onChange={(e) => setNewPerf({ ...newPerf, role: e.target.value })}
                          placeholder="e.g. Headline Act"
                          className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="perfGenre" className="text-xs text-slate-400">Genre</Label>
                          <Input
                            id="perfGenre"
                            value={newPerf.genre}
                            onChange={(e) => setNewPerf({ ...newPerf, genre: e.target.value })}
                            placeholder="e.g. Algorave Synth"
                            className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="perfTime" className="text-xs text-slate-400">Timeslot</Label>
                          <Input
                            id="perfTime"
                            value={newPerf.timeSlot}
                            onChange={(e) => setNewPerf({ ...newPerf, timeSlot: e.target.value })}
                            placeholder="e.g. 20:30 - 21:00"
                            className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 h-10 rounded-xl text-xs font-semibold">
                        Add to Lineup
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Performers grid display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {performers.map((perf) => (
                  <div
                    key={perf.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between h-48 relative overflow-hidden backdrop-blur-md transition-all duration-300 ${
                      theme === "dark" ? "bg-[#090526]/30 border-purple-500/10 hover:border-purple-400/30" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="space-y-2 z-10">
                      <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
                        {perf.role}
                      </span>
                      <h4 className="text-lg font-bold font-display">{perf.name}</h4>
                      <div className="text-xs text-slate-400 flex flex-col gap-0.5">
                        <span>Genre: <strong>{perf.genre}</strong></span>
                        <span>Slot: <strong>{perf.timeSlot}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center z-10 border-t border-purple-500/10 pt-4 mt-2">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500">Live Stage ID</span>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeletePerformer(perf.id)}
                        className="text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 p-2 h-8 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB: SPONSORS MANAGER */}
            <TabsContent value="sponsors" className="space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold font-display flex items-center gap-1.5"><Heart className="w-5 h-5 text-pink-400" /> Corporate Sponsors</h3>
                
                {/* Add Sponsor Dialog */}
                <Dialog open={isSponOpen} onOpenChange={setIsSponOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-pink-600 hover:bg-pink-500 text-white rounded-xl h-10 text-xs gap-1.5">
                      <Plus className="w-4 h-4" /> Add Sponsor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#070417]/95 border border-purple-500/30 text-white rounded-2xl backdrop-blur-2xl max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold font-display">Add Corporate Sponsor</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddSponsor} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="sponName" className="text-xs text-slate-400">Company Name</Label>
                        <Input
                          id="sponName"
                          value={newSpon.name}
                          onChange={(e) => setNewSpon({ ...newSpon, name: e.target.value })}
                          placeholder="e.g. Apex Soft"
                          className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="sponLogo" className="text-xs text-slate-400">Logo Icon Logo / Text</Label>
                        <Input
                          id="sponLogo"
                          value={newSpon.logo}
                          onChange={(e) => setNewSpon({ ...newSpon, logo: e.target.value })}
                          placeholder="e.g. ▲ APEX SOFT"
                          className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="sponTier" className="text-xs text-slate-400">Sponsor Tier</Label>
                          <Select onValueChange={(value: any) => setNewSpon({ ...newSpon, tier: value })} defaultValue="gold">
                            <SelectTrigger className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl focus:ring-0">
                              <SelectValue placeholder="Tier" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0c0827] border-purple-500/30 text-white">
                              <SelectItem value="diamond">Diamond (Rs. 3M+)</SelectItem>
                              <SelectItem value="gold">Gold (Rs. 1.5M+)</SelectItem>
                              <SelectItem value="silver">Silver (Rs. 600k+)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="sponCont" className="text-xs text-slate-400">Pledge (Rs. LKR)</Label>
                          <Input
                            id="sponCont"
                            type="number"
                            value={newSpon.contribution}
                            onChange={(e) => setNewSpon({ ...newSpon, contribution: parseInt(e.target.value) || 0 })}
                            className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 h-10 rounded-xl text-xs font-semibold">
                        Confirm Sponsor
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Sponsors list display */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {sponsors.map((spon) => (
                  <div
                    key={spon.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between h-40 relative backdrop-blur-md transition-all duration-300 ${
                      theme === "dark" ? "bg-[#090526]/30 border-purple-500/10 hover:border-purple-400/30" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[8px] uppercase tracking-widest font-extrabold ${
                        spon.tier === "diamond"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                          : spon.tier === "gold"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/25"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/25"
                      }`}>
                        {spon.tier}
                      </span>
                      <h4 className="font-display font-black text-xl tracking-widest pt-1.5 text-white/70">{spon.logo}</h4>
                    </div>

                    <div className="flex justify-between items-center border-t border-purple-500/10 pt-4 mt-2">
                      <span className="text-xs font-bold text-cyan-300">Rs. {spon.contribution.toLocaleString()}</span>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteSponsor(spon.id)}
                        className="text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 p-2 h-8 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB: ANNOUNCEMENT BROADCASTS */}
            <TabsContent value="alerts" className="space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold font-display flex items-center gap-1.5"><Volume2 className="w-5 h-5 text-cyan-400" /> Server Broadcast Alerts</h3>
                
                {/* Add Alert Dialog */}
                <Dialog open={isAnnOpen} onOpenChange={setIsAnnOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl h-10 text-xs gap-1.5">
                      <Plus className="w-4 h-4" /> Broadcast Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#070417]/95 border border-purple-500/30 text-white rounded-2xl backdrop-blur-2xl max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold font-display">Broadcast Global Alert</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddAnnouncement} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="annTitle" className="text-xs text-slate-400">Alert Title</Label>
                        <Input
                          id="annTitle"
                          value={newAnn.title}
                          onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                          placeholder="e.g. VIP Tickets Closed"
                          className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="annType" className="text-xs text-slate-400">Broadcast Severity</Label>
                        <Select onValueChange={(value: any) => setNewAnn({ ...newAnn, type: value })} defaultValue="info">
                          <SelectTrigger className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl focus:ring-0">
                            <SelectValue placeholder="Alert Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0c0827] border-purple-500/30 text-white">
                            <SelectItem value="info">Info (Purple)</SelectItem>
                            <SelectItem value="alert">Alert (Pink)</SelectItem>
                            <SelectItem value="success">Success (Cyan)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="annContent" className="text-xs text-slate-400">Alert message content</Label>
                        <Textarea
                          id="annContent"
                          value={newAnn.content}
                          onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                          placeholder="Provide details about the alert..."
                          className="bg-[#0c0827] border-purple-500/20 text-white rounded-xl min-h-[80px]"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 h-10 rounded-xl text-xs font-semibold">
                        Broadcast Live
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Announcements list display */}
              <div className="space-y-4 max-w-4xl mx-auto">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-5 rounded-2xl border flex items-center justify-between gap-6 backdrop-blur-md transition-all duration-300 ${
                      theme === "dark" ? "bg-[#090526]/30 border-purple-500/10 hover:border-purple-400/30" : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          ann.type === "alert"
                            ? "bg-pink-500"
                            : ann.type === "success"
                            ? "bg-cyan-400"
                            : "bg-purple-500"
                        }`} />
                        <h4 className="font-display font-semibold text-sm sm:text-base text-white truncate">{ann.title}</h4>
                      </div>
                      <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed pl-4">
                        {ann.content}
                      </p>
                      <span className="text-[9px] text-slate-500 font-mono pl-4 block">
                        Timestamp: {new Date(ann.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 p-2.5 rounded-xl shrink-0"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

          </Tabs>
        </main>
      </div>
      {/* GORGEOUS TICKET PREVIEW MODAL FOR ADMIN */}
      <Dialog open={selectedTicketForPreview !== null} onOpenChange={(open) => { if (!open) setSelectedTicketForPreview(null); }}>
        <DialogContent data-lenis-prevent className="max-w-md w-[95vw] max-h-[95vh] overflow-y-auto bg-[#070417]/95 border border-purple-500/30 backdrop-blur-2xl p-6 flex flex-col items-center z-50 scrollbar-thin scrollbar-thumb-purple-500/20 text-white rounded-2xl">
          <DialogHeader className="w-full text-center mb-2">
            <DialogTitle className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              🎫 Entrance Pass Preview
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-light">
              Scrollable high-contrast thermal admission voucher. Admin can download or copy.
            </DialogDescription>
          </DialogHeader>

          {selectedTicketForPreview && (
            <div className="flex flex-col items-center gap-6 w-full">
              {/* White Thermal Receipt Ticket with Jagged Edges */}
              <div className="w-[340px] max-w-full bg-white text-slate-900 border border-slate-200 shadow-2xl relative flex flex-col pt-6 pb-6 px-5 print-admin-ticket-card overflow-visible">
                
                {/* Top Jagged Edge */}
                <div className="absolute -top-[6px] left-0 w-full overflow-hidden h-[6px] flex z-10">
                  {Array.from({ length: 34 }).map((_, i) => (
                    <svg key={i} className="w-2.5 h-[6px] fill-white text-white shrink-0" viewBox="0 0 10 6">
                      <polygon points="0,6 5,0 10,6" />
                    </svg>
                  ))}
                </div>

                {/* Bottom Jagged Edge */}
                <div className="absolute -bottom-[6px] left-0 w-full overflow-hidden h-[6px] flex z-10">
                  {Array.from({ length: 34 }).map((_, i) => (
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

                  {/* QR Code Container */}
                  <div className="w-40 h-40 bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm mt-4 shrink-0">
                    <img
                      src={selectedTicketForPreview.qrCodeUrl}
                      alt="Admission QR code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Monospace Serial Code */}
                  <span className="font-mono font-black text-slate-800 text-sm tracking-widest mt-2.5">
                    {selectedTicketForPreview.id}
                  </span>
                </div>

                {/* Dashed Tear Line */}
                <div className="relative my-5">
                  <div className="border-t border-dashed border-slate-300 w-full" />
                  <div className="absolute -top-[6px] -left-[26px] w-3 h-3 rounded-full bg-[#070417] border-r border-slate-300 z-10" />
                  <div className="absolute -top-[6px] -right-[26px] w-3 h-3 rounded-full bg-[#070417] border-l border-slate-300 z-10" />
                </div>

                {/* Bottom Section */}
                <div className="flex-grow flex flex-col justify-between">
                  
                  {/* Header Row: Class Icon */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
                        <Ticket className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-slate-900 block capitalize">
                          {selectedTicketForPreview.ticketType === "sponsor" ? "💎 Cosmic Elite" : selectedTicketForPreview.ticketType === "vip" ? "👑 Aurora Access" : "🎟️ Neon Entry"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono block">RHYTHM CYBERDOME A</span>
                      </div>
                    </div>

                    {/* Small Mini-QR */}
                    <div className="flex items-center gap-1.5 self-stretch">
                      <div className="text-[9px] font-mono font-bold text-slate-300 tracking-wider rotate-180 uppercase" style={{ writingMode: "vertical-lr" }}>
                        {selectedTicketForPreview.id}
                      </div>
                      <div className="w-8 h-8 bg-white p-0.5 rounded border border-slate-200 flex items-center justify-center shrink-0">
                        <img
                          src={selectedTicketForPreview.qrCodeUrl}
                          alt="Mini QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="space-y-2 mt-4 text-xs">
                    <div className="text-left border-b border-slate-100 pb-1">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">Guest Name</span>
                      <span className="font-bold text-slate-800">{selectedTicketForPreview.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-left border-b border-slate-100 pb-1">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">Seats Volume</span>
                        <span className="font-semibold text-slate-700">{selectedTicketForPreview.seats} {selectedTicketForPreview.seats === 1 ? "Seat" : "Seats"}</span>
                      </div>
                      <div className="text-left border-b border-slate-100 pb-1">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">Session</span>
                        <span className="font-semibold text-slate-700">19:30 UTC - 01/16/2026</span>
                      </div>
                    </div>

                    <div className="text-left border-b border-slate-100 pb-1 col-span-2">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">Entrance Gate Fee</span>
                      <span className="font-bold text-emerald-600 font-mono">
                        Rs. {((selectedTicketForPreview.seats || 1) * (selectedTicketForPreview.ticketType === "sponsor" ? 2500 : selectedTicketForPreview.ticketType === "vip" ? 1800 : 1000)).toLocaleString()} LKR
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

              {/* Action Buttons */}
              <div className="flex gap-3 w-full mt-2">
                <Button
                  onClick={downloadAdminTicketImage}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold h-11 rounded-xl text-xs gap-1.5 transition-all duration-300"
                >
                  <Download className="w-4 h-4" /> Download Pass Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTicketForPreview(null)}
                  className="px-5 border-purple-500/20 hover:bg-purple-950/20 text-purple-300 rounded-xl text-xs font-semibold h-11"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

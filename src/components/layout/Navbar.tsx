"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Ticket, Menu, X, BarChart3, Radio } from "lucide-react";
import RsvpModal from "../sections/RsvpModal";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Story", id: "about" },
    { label: "Features", id: "features" },
    { label: "Gallery", id: "gallery" },
    { label: "Performers", id: "performers" },
    { label: "Timeline", id: "timeline" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#030014]/80 border-b border-purple-500/10 backdrop-blur-md shadow-[0_4px_30px_rgba(3,0,20,0.5)]"
            : "py-6 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e as any, "hero")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Radio className="w-6 h-6 text-purple-400 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-display font-black text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-pink-400">
              RHYTHM NIGHT
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="text-xs uppercase font-medium tracking-widest text-purple-100/70 hover:text-white transition-colors duration-300 relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={() => setRsvpOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs uppercase tracking-widest font-bold rounded-xl px-5 py-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 border border-purple-400/20"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Reserve Seat
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:text-purple-400 transition-colors p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[60px] bg-[#070417]/95 border-b border-purple-500/10 backdrop-blur-2xl transition-all duration-500 ease-in-out z-40 overflow-hidden ${
            mobileMenuOpen ? "max-h-[500px] py-6 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-4 px-6">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="text-sm font-semibold tracking-wider text-purple-200/80 hover:text-white transition-colors py-1.5"
              >
                {link.label}
              </a>
            ))}

            <hr className="border-purple-500/10 my-2" />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRsvpOpen(true);
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold h-11 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                <Ticket className="w-4 h-4 mr-2" />
                Reserve Seat
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Booking RSVP Modal */}
      <RsvpModal isOpen={rsvpOpen} onOpenChange={setRsvpOpen} />
    </>
  );
}

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Features from "@/components/sections/Features";
import Gallery from "@/components/sections/Gallery";
import {
  CountdownTimer,
  Performers,
  EventTimeline,
  Sponsors,
  Pricing,
  FAQ,
  Testimonials,
  Contact,
  Footer
} from "@/components/sections/ExtraSections";

export default function Home() {
  return (
    <>
      {/* Floating navigation header */}
      <Navbar />

      {/* Main continuous storytelling scroll container */}
      <main className="relative w-full flex flex-col items-center">
        
        {/* 1. Immersive Hero visualizer */}
        <Hero />

        {/* 2. Scroll Countdown Ticker */}
        <div className="w-full px-6 mt-16 md:mt-24 relative z-30">
          <CountdownTimer />
        </div>

        {/* 3. Storytelling About grid */}
        <About />

        {/* 4. Tilted glow Feature cards */}
        <Features />

        {/* 5. Horizontal infinite Gallery slider */}
        <Gallery />

        {/* 6. Neon Lineup perform highlights */}
        <Performers />

        {/* 7. Progression Schedule Timeline */}
        <EventTimeline />

        {/* 8. Glowing Sponsors scroller */}
        <Sponsors />

        {/* 9. Ticket access matrix */}
        <Pricing />

        {/* 10. Reviews & Testimonials slider */}
        <Testimonials />

        {/* 11. Custom Accordion FAQ */}
        <FAQ />

        {/* 12. Inquiry & Collaboration forms */}
        <Contact />

      </main>

      {/* Glowing cyber footer */}
      <Footer />
    </>
  );
}

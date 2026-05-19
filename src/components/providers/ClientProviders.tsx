"use client";

import { useEffect, useRef, useState } from "react";
import { ReactLenis } from "lenis/react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Toaster } from "@/components/ui/toaster";
import { syncWithBackend } from "@/lib/store";

// Dynamically import the React Three Fiber background with SSR disabled
const ThreeBackground = dynamic(() => import("../effects/ThreeBackground"), {
  ssr: false,
});

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initial background sync with Next.js JSON Database
    syncWithBackend();

    // Register GSAP ScrollTrigger
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // High performance mouse tracker using CSS custom properties
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      containerRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
      containerRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <div
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#030014] text-white selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden"
        style={{
          // Set default values for mouse position
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties}
      >
        {/* Ambient Mouse Spotlight Glow */}
        <div className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(139,92,246,0.06),transparent_80%)]" />
        
        {/* Subtle grid pattern overlay */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        {/* Global Three.js Scene */}
        <ThreeBackground />

        {/* App Content */}
        <div className="relative z-10 w-full">{children}</div>

        {/* Global Toast notifications */}
        <Toaster />
      </div>
    </ReactLenis>
  );
}

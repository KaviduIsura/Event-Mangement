import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ClientProviders from "@/components/providers/ClientProviders";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-display" 
});

export const metadata: Metadata = {
  title: "Rhythm Night 2026 | IT Innovation Fair Fundraiser",
  description: "An immersive, cinematic fundraiser event for the IT Innovation Fair 2026. Join us for live bands, future technology exhibitions, and community action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={cn(
        "min-h-screen font-sans antialiased bg-[#030014] text-white",
        inter.variable,
        outfit.variable
      )}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

"use client";

// Optimistic store syncing with the server-side Next.js JSON Database.

export interface RSVP {
  id: string;
  name: string;
  email: string;
  ticketType: "general" | "vip" | "sponsor";
  seats: number;
  innovationSupport: string; // Brief message of support
  checkedIn: boolean;
  qrCodeUrl: string;
  createdAt: string;
}

export interface Performer {
  id: string;
  name: string;
  role: string;
  genre: string;
  timeSlot: string;
  avatar: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "diamond" | "gold" | "silver";
  contribution: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: "music" | "tech" | "crowd";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "alert" | "success";
  createdAt: string;
}

// Pre-populated local client defaults
const DEFAULT_RSVPS: RSVP[] = [
  {
    id: "RN-8942",
    name: "Alex Rivera",
    email: "alex.rivera@tech.org",
    ticketType: "vip",
    seats: 2,
    innovationSupport: "Can't wait to see the AI robotics displays!",
    checkedIn: true,
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RN-8942",
    createdAt: "2026-05-18T10:14:00Z"
  },
  {
    id: "RN-3051",
    name: "Elena Rostova",
    email: "elena@vcfund.com",
    ticketType: "sponsor",
    seats: 4,
    innovationSupport: "Proud to sponsor the next generation of digital builders.",
    checkedIn: false,
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RN-3051",
    createdAt: "2026-05-18T14:32:00Z"
  },
  {
    id: "RN-7712",
    name: "Marcus Chen",
    email: "marcus.chen@student.edu",
    ticketType: "general",
    seats: 1,
    innovationSupport: "Hyped for the Neon Wave performance!",
    checkedIn: false,
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RN-7712",
    createdAt: "2026-05-19T08:05:00Z"
  },
  {
    id: "RN-2290",
    name: "Sophia Martinez",
    email: "sophia.m@innovate.co",
    ticketType: "vip",
    seats: 2,
    innovationSupport: "Excited about the student pitch competitions.",
    checkedIn: false,
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RN-2290",
    createdAt: "2026-05-19T16:22:00Z"
  }
];

const DEFAULT_PERFORMERS: Performer[] = [
  {
    id: "perf-1",
    name: "Neon Wave Symphony",
    role: "Headline Act",
    genre: "Futuristic Synth-Rock",
    timeSlot: "21:30 - 23:00",
    avatar: "/images/band.png"
  },
  {
    id: "perf-2",
    name: "Aether & Bass",
    role: "Opening Act",
    genre: "Cinematic Electro-Ambient",
    timeSlot: "19:30 - 20:30",
    avatar: "/images/hero.png"
  },
  {
    id: "perf-3",
    name: "Vibe Hackers",
    role: "Special Performance",
    genre: "Live-Coded Algorave Beats",
    timeSlot: "20:45 - 21:15",
    avatar: "/images/tech.png"
  }
];

const DEFAULT_SPONSORS: Sponsor[] = [
  { id: "spon-1", name: "Aether Labs", logo: "⚡ AETHER LABS", tier: "diamond", contribution: 10000 },
  { id: "spon-2", name: "Apex Venture Capital", logo: "▲ APEX VC", tier: "diamond", contribution: 7500 },
  { id: "spon-3", name: "CyberNode Systems", logo: "⬡ CYBERNODE", tier: "gold", contribution: 5000 },
  { id: "spon-4", name: "Quantum Innovations", logo: "❖ QUANTUM", tier: "gold", contribution: 4000 },
  { id: "spon-5", name: "Nova Softworks", logo: "✦ NOVA", tier: "silver", contribution: 2000 }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "gal-1", url: "/images/hero.png", caption: "The main stage holographic visualizer active", category: "music" },
  { id: "gal-2", url: "/images/band.png", caption: "Electric strings solo on high energy chorus", category: "music" },
  { id: "gal-3", url: "/images/tech.png", caption: "Demonstrating the neural cyber arm interface", category: "tech" }
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Ticket Phase 1 Closing Soon",
    content: "Our VIP tickets are now at 92% capacity. General admissions are booking fast. Reserve your spots now!",
    type: "alert",
    createdAt: "2026-05-19T10:00:00Z"
  },
  {
    id: "ann-2",
    title: "Student Discount Active",
    content: "All university and high-school students can claim 50% discount on general passes by providing a valid student ID during check-in.",
    type: "info",
    createdAt: "2026-05-18T12:00:00Z"
  }
];

// Helper to push database slices to the Next.js API backend asynchronously in the background
async function postDBUpdate(sliceName: string, sliceData: any) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [sliceName]: sliceData })
    });
  } catch (error) {
    console.error(`Failed to sync ${sliceName} background update:`, error);
  }
}

// Master Client-Side Server Sync Operation
export async function syncWithBackend(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch("/api/db");
    const json = await res.json();
    if (json.success && json.data) {
      const { rsvps, performers, sponsors, gallery, announcements } = json.data;
      
      localStorage.setItem("rhythm_night_rsvps", JSON.stringify(rsvps));
      localStorage.setItem("rhythm_night_performers", JSON.stringify(performers));
      localStorage.setItem("rhythm_night_sponsors", JSON.stringify(sponsors));
      localStorage.setItem("rhythm_night_gallery", JSON.stringify(gallery));
      localStorage.setItem("rhythm_night_announcements", JSON.stringify(announcements));
      
      // Dispatch standard DOM event to trigger hot reload in listening states
      window.dispatchEvent(new Event("rhythm_night_db_sync"));
      return true;
    }
  } catch (error) {
    console.error("Failed to sync client store with backend:", error);
  }
  return false;
}

// Public functions matching original signature (with background server syncing added)
export function getRSVPs(): RSVP[] {
  if (typeof window === "undefined") return DEFAULT_RSVPS;
  const stored = localStorage.getItem("rhythm_night_rsvps");
  if (!stored) {
    localStorage.setItem("rhythm_night_rsvps", JSON.stringify(DEFAULT_RSVPS));
    // Trigger initial seed persistence on backend
    postDBUpdate("rsvps", DEFAULT_RSVPS);
    return DEFAULT_RSVPS;
  }
  return JSON.parse(stored);
}

export function saveRSVP(rsvp: Omit<RSVP, "id" | "checkedIn" | "qrCodeUrl" | "createdAt">): RSVP {
  const rsvps = getRSVPs();
  const id = `RN-${Math.floor(1000 + Math.random() * 9000)}`;
  const newRsvp: RSVP = {
    ...rsvp,
    id,
    checkedIn: false,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`,
    createdAt: new Date().toISOString()
  };
  
  rsvps.unshift(newRsvp);
  localStorage.setItem("rhythm_night_rsvps", JSON.stringify(rsvps));
  postDBUpdate("rsvps", rsvps);
  return newRsvp;
}

export function updateRSVPCheckIn(id: string, checkedIn: boolean): RSVP[] {
  const rsvps = getRSVPs();
  const updated = rsvps.map(r => r.id === id ? { ...r, checkedIn } : r);
  localStorage.setItem("rhythm_night_rsvps", JSON.stringify(updated));
  postDBUpdate("rsvps", updated);
  return updated;
}

export function deleteRSVP(id: string): RSVP[] {
  const rsvps = getRSVPs();
  const updated = rsvps.filter(r => r.id !== id);
  localStorage.setItem("rhythm_night_rsvps", JSON.stringify(updated));
  postDBUpdate("rsvps", updated);
  return updated;
}

export function getPerformers(): Performer[] {
  if (typeof window === "undefined") return DEFAULT_PERFORMERS;
  const stored = localStorage.getItem("rhythm_night_performers");
  if (!stored) {
    localStorage.setItem("rhythm_night_performers", JSON.stringify(DEFAULT_PERFORMERS));
    postDBUpdate("performers", DEFAULT_PERFORMERS);
    return DEFAULT_PERFORMERS;
  }
  return JSON.parse(stored);
}

export function savePerformer(performer: Omit<Performer, "id">): Performer[] {
  const performers = getPerformers();
  const newPerformer = { ...performer, id: `perf-${Date.now()}` };
  performers.push(newPerformer);
  localStorage.setItem("rhythm_night_performers", JSON.stringify(performers));
  postDBUpdate("performers", performers);
  return performers;
}

export function deletePerformer(id: string): Performer[] {
  const performers = getPerformers();
  const updated = performers.filter(p => p.id !== id);
  localStorage.setItem("rhythm_night_performers", JSON.stringify(updated));
  postDBUpdate("performers", updated);
  return updated;
}

export function getSponsors(): Sponsor[] {
  if (typeof window === "undefined") return DEFAULT_SPONSORS;
  const stored = localStorage.getItem("rhythm_night_sponsors");
  if (!stored) {
    localStorage.setItem("rhythm_night_sponsors", JSON.stringify(DEFAULT_SPONSORS));
    postDBUpdate("sponsors", DEFAULT_SPONSORS);
    return DEFAULT_SPONSORS;
  }
  return JSON.parse(stored);
}

export function saveSponsor(sponsor: Omit<Sponsor, "id">): Sponsor[] {
  const sponsors = getSponsors();
  const newSponsor = { ...sponsor, id: `spon-${Date.now()}` };
  sponsors.push(newSponsor);
  localStorage.setItem("rhythm_night_sponsors", JSON.stringify(sponsors));
  postDBUpdate("sponsors", sponsors);
  return sponsors;
}

export function deleteSponsor(id: string): Sponsor[] {
  const sponsors = getSponsors();
  const updated = sponsors.filter(s => s.id !== id);
  localStorage.setItem("rhythm_night_sponsors", JSON.stringify(updated));
  postDBUpdate("sponsors", updated);
  return updated;
}

export function getGalleryItems(): GalleryItem[] {
  if (typeof window === "undefined") return DEFAULT_GALLERY;
  const stored = localStorage.getItem("rhythm_night_gallery");
  if (!stored) {
    localStorage.setItem("rhythm_night_gallery", JSON.stringify(DEFAULT_GALLERY));
    postDBUpdate("gallery", DEFAULT_GALLERY);
    return DEFAULT_GALLERY;
  }
  return JSON.parse(stored);
}

export function saveGalleryItem(item: Omit<GalleryItem, "id">): GalleryItem[] {
  const items = getGalleryItems();
  const newItem = { ...item, id: `gal-${Date.now()}` };
  items.unshift(newItem);
  localStorage.setItem("rhythm_night_gallery", JSON.stringify(items));
  postDBUpdate("gallery", items);
  return items;
}

export function getAnnouncements(): Announcement[] {
  if (typeof window === "undefined") return DEFAULT_ANNOUNCEMENTS;
  const stored = localStorage.getItem("rhythm_night_announcements");
  if (!stored) {
    localStorage.setItem("rhythm_night_announcements", JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    postDBUpdate("announcements", DEFAULT_ANNOUNCEMENTS);
    return DEFAULT_ANNOUNCEMENTS;
  }
  return JSON.parse(stored);
}

export function saveAnnouncement(announcement: Omit<Announcement, "id" | "createdAt">): Announcement[] {
  const announcements = getAnnouncements();
  const newAnnouncement = {
    ...announcement,
    id: `ann-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  announcements.unshift(newAnnouncement);
  localStorage.setItem("rhythm_night_announcements", JSON.stringify(announcements));
  postDBUpdate("announcements", announcements);
  return announcements;
}

export function deleteAnnouncement(id: string): Announcement[] {
  const announcements = getAnnouncements();
  const updated = announcements.filter(a => a.id !== id);
  localStorage.setItem("rhythm_night_announcements", JSON.stringify(updated));
  postDBUpdate("announcements", updated);
  return updated;
}

import clientPromise from "./mongodb";

export interface RSVP {
  id: string;
  name: string;
  email: string;
  ticketType: "general" | "vip" | "sponsor";
  seats: number;
  innovationSupport: string;
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

export interface DBData {
  rsvps: RSVP[];
  performers: Performer[];
  sponsors: Sponsor[];
  gallery: GalleryItem[];
  announcements: Announcement[];
}

// Default high-fidelity seed data to pre-populate fresh MongoDB instances
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

// Asynchronous MongoDB reader with auto-seeding
export async function readDB(): Promise<DBData> {
  try {
    const client = await clientPromise;
    const db = client.db("rhythm_night");

    // Pull datasets from collections, omitting MongoDB's native _id field to avoid serialization issues
    const rsvps = await db
      .collection<RSVP>("rsvps")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const performers = await db
      .collection<Performer>("performers")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const sponsors = await db
      .collection<Sponsor>("sponsors")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const gallery = await db
      .collection<GalleryItem>("gallery")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    const announcements = await db
      .collection<Announcement>("announcements")
      .find({}, { projection: { _id: 0 } })
      .toArray();

    // Auto-seed if all critical collections are empty (fresh MongoDB start)
    if (
      rsvps.length === 0 &&
      performers.length === 0 &&
      sponsors.length === 0 &&
      announcements.length === 0
    ) {
      console.log("Seeding fresh MongoDB database collections...");
      await db.collection("rsvps").insertMany(DEFAULT_RSVPS);
      await db.collection("performers").insertMany(DEFAULT_PERFORMERS);
      await db.collection("sponsors").insertMany(DEFAULT_SPONSORS);
      await db.collection("gallery").insertMany(DEFAULT_GALLERY);
      await db.collection("announcements").insertMany(DEFAULT_ANNOUNCEMENTS);

      return {
        rsvps: DEFAULT_RSVPS,
        performers: DEFAULT_PERFORMERS,
        sponsors: DEFAULT_SPONSORS,
        gallery: DEFAULT_GALLERY,
        announcements: DEFAULT_ANNOUNCEMENTS
      };
    }

    return {
      rsvps: rsvps || [],
      performers: performers || [],
      sponsors: sponsors || [],
      gallery: gallery || [],
      announcements: announcements || []
    };
  } catch (error) {
    console.error("Failed to read from MongoDB database:", error);
    return {
      rsvps: DEFAULT_RSVPS,
      performers: DEFAULT_PERFORMERS,
      sponsors: DEFAULT_SPONSORS,
      gallery: DEFAULT_GALLERY,
      announcements: DEFAULT_ANNOUNCEMENTS
    };
  }
}

// Asynchronous MongoDB writer committing changes by overwrite collections
export async function writeDB(data: DBData) {
  try {
    const client = await clientPromise;
    const db = client.db("rhythm_night");

    if (data.rsvps) {
      await db.collection("rsvps").deleteMany({});
      if (data.rsvps.length > 0) {
        await db.collection("rsvps").insertMany(data.rsvps);
      }
    }

    if (data.performers) {
      await db.collection("performers").deleteMany({});
      if (data.performers.length > 0) {
        await db.collection("performers").insertMany(data.performers);
      }
    }

    if (data.sponsors) {
      await db.collection("sponsors").deleteMany({});
      if (data.sponsors.length > 0) {
        await db.collection("sponsors").insertMany(data.sponsors);
      }
    }

    if (data.gallery) {
      await db.collection("gallery").deleteMany({});
      if (data.gallery.length > 0) {
        await db.collection("gallery").insertMany(data.gallery);
      }
    }

    if (data.announcements) {
      await db.collection("announcements").deleteMany({});
      if (data.announcements.length > 0) {
        await db.collection("announcements").insertMany(data.announcements);
      }
    }
  } catch (error) {
    console.error("Failed to write datasets to MongoDB:", error);
  }
}

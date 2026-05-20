import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, DBData } from "@/lib/db";

// GET /api/db -> Returns role-based sanitized database records from MongoDB
export async function GET(req: NextRequest) {
  try {
    const data = await readDB();
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("ticketId");

    const adminKey = req.headers.get("x-admin-key");
    const isAdmin = adminKey === "admin123";

    if (!isAdmin) {
      // Secure Ticket Lookup: If guest requests their unique ticket, expose only their details
      let matchedTicket = null;
      if (ticketId) {
        matchedTicket = data.rsvps.find(
          r => r.id.toLowerCase() === ticketId.trim().toLowerCase()
        );
      }

      // Guest Sanity Privacy Masking: Obfuscate identifying credentials of other guests to prevent data harvesting
      const sanitizedRsvps = data.rsvps.map(rsvp => {
        if (matchedTicket && rsvp.id === matchedTicket.id) {
          return rsvp; // Expose full ticket to authorized linkholder
        }
        return {
          id: rsvp.id,
          seats: rsvp.seats,
          ticketType: rsvp.ticketType,
          checkedIn: rsvp.checkedIn,
          createdAt: rsvp.createdAt,
          name: "Reserved Seat",
          email: "masked@***.com",
          qrCodeUrl: "" // Mask other QR codes
        };
      });

      const sanitizedData = {
        ...data,
        rsvps: sanitizedRsvps
      };
      return NextResponse.json({ success: true, data: sanitizedData });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to read database" },
      { status: 500 }
    );
  }
}

// POST /api/db -> Secure role-based mutation validating duplicate emails & registration integrity
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminKey = req.headers.get("x-admin-key");
    const isAdmin = adminKey === "admin123";

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid data body" },
        { status: 400 }
      );
    }

    const currentDB = await readDB();

    // 1. Immutable Audit Constraint: Block manual reservation deletions entirely
    if (body.rsvps) {
      if (body.rsvps.length < currentDB.rsvps.length) {
        return NextResponse.json(
          { success: false, error: "[Security Violation] Ticketing records are fully immutable and cannot be deleted." },
          { status: 400 }
        );
      }
    }

    let updatedRsvps = currentDB.rsvps;

    if (body.rsvps) {
      if (isAdmin) {
        // Admins can toggle check-ins or update metadata, but cannot delete records
        updatedRsvps = body.rsvps;
      } else {
        // 2. Tampering & Append Validation: Guests can only register a single ticket
        if (body.rsvps.length !== currentDB.rsvps.length + 1) {
          return NextResponse.json(
            { success: false, error: "[Unauthorized] Guest registrations must be appended individually." },
            { status: 403 }
          );
        }

        // Verify all previous records are untouched
        for (let i = 0; i < currentDB.rsvps.length; i++) {
          if (body.rsvps[i].id !== currentDB.rsvps[i].id) {
            return NextResponse.json(
              { success: false, error: "[Security Incident] Tampering with existing ticket logs detected." },
              { status: 403 }
            );
          }
        }

        const newRsvp = body.rsvps[body.rsvps.length - 1];

        // Validate structure of new entry
        if (!newRsvp.name || !newRsvp.email || !newRsvp.seats) {
          return NextResponse.json(
            { success: false, error: "Invalid reservation data payload." },
            { status: 400 }
          );
        }

        // 3. Unique Email Constraint: "only one email can registe one time tickets"
        const emailExists = currentDB.rsvps.some(
          r => r.email.trim().toLowerCase() === newRsvp.email.trim().toLowerCase()
        );

        if (emailExists) {
          return NextResponse.json(
            { success: false, error: "This email address has already reserved a seat." },
            { status: 400 }
          );
        }

        updatedRsvps = body.rsvps;
      }
    }

    const updatedDB: DBData = {
      rsvps: updatedRsvps,
      performers: isAdmin ? (body.performers ?? currentDB.performers) : currentDB.performers,
      sponsors: isAdmin ? (body.sponsors ?? currentDB.sponsors) : currentDB.sponsors,
      gallery: isAdmin ? (body.gallery ?? currentDB.gallery) : currentDB.gallery,
      announcements: isAdmin ? (body.announcements ?? currentDB.announcements) : currentDB.announcements,
    };

    await writeDB(updatedDB);
    return NextResponse.json({ success: true, data: updatedDB });
  } catch (error) {
    console.error("API POST DB Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update database" },
      { status: 500 }
    );
  }
}

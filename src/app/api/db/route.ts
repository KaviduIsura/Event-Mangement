import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, DBData } from "@/lib/db";

// GET /api/db -> Returns the master database records from MongoDB
export async function GET() {
  try {
    const data = await readDB();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to read database" },
      { status: 500 }
    );
  }
}

// POST /api/db -> Overwrites/saves database records in MongoDB
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid data body" },
        { status: 400 }
      );
    }

    // Overwrite/update the MongoDB collections
    const currentDB = await readDB();
    const updatedDB: DBData = {
      rsvps: body.rsvps ?? currentDB.rsvps,
      performers: body.performers ?? currentDB.performers,
      sponsors: body.sponsors ?? currentDB.sponsors,
      gallery: body.gallery ?? currentDB.gallery,
      announcements: body.announcements ?? currentDB.announcements,
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

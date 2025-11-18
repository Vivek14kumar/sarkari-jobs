import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ResultAdmit from "../models/result-admit";


// -----------------------------------------------------------
// 🔥 AUTO NOTIFICATION HELPER (POST ONLY)
// -----------------------------------------------------------
async function sendAutoNotification(record) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sendNotification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: record.title_en,
        body: `${record.title_hi} – ${record.category} released. Tap to view.`,
        url: `https://resultshub.in/results/${record.slug}`,
        data: {
          id: record._id.toString(),
          category: record.category,
        },
      }),
    });

    console.log("📢 Auto Notification Sent:", record.title_en);

  } catch (err) {
    console.error("❌ Auto Notification Failed:", err);
  }
}



// -----------------------------------------------------------
// ✅ GET: Fetch all records
// -----------------------------------------------------------
export async function GET() {
  try {
    await connectToDB();
    const records = await ResultAdmit.find().sort({ createdAt: -1 });

    return NextResponse.json(records);

  } catch (error) {
    console.error("GET error:", error);

    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}



// -----------------------------------------------------------
// ✅ POST: Add new record + AUTO NOTIFICATION
// -----------------------------------------------------------
export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const newRecord = new ResultAdmit(body);
    await newRecord.save();

    // 🔥 Auto Notification Trigger
    sendAutoNotification(newRecord);  // NO await → fast API response

    return NextResponse.json(
      {
        message: `${body.type} added successfully`,
        record: newRecord,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      { error: "Failed to save record" },
      { status: 500 }
    );
  }
}



// -----------------------------------------------------------
// ✅ PUT: Update (NO notification here)
// -----------------------------------------------------------
export async function PUT(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await req.json();
    const updated = await ResultAdmit.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Record updated successfully",
      record: updated,
    });

  } catch (error) {
    console.error("PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}



// -----------------------------------------------------------
// ✅ DELETE: Remove (NO notification here)
// -----------------------------------------------------------
export async function DELETE(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const deleted = await ResultAdmit.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record deleted successfully" });

  } catch (error) {
    console.error("DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}

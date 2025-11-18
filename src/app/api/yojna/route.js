import { connectToDB } from "@/lib/mongodb";
import Yojna from "../models/Yojna";


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
        body: `${record.title_hi} – New Yojna update available. Tap to view.`,
        url: `https://resultshub.in/yojna/${record.slug}`,
        data: {
          id: record._id.toString(),
          category: "Yojna",
        },
      }),
    });

    console.log("📢 Yojna Notification Sent:", record.title_en);
    
  } catch (err) {
    console.error("❌ Yojna Notification Failed:", err);
  }
}



// -----------------------------------------------------------
// ✅ POST: Add Yojna + Auto Notification
// -----------------------------------------------------------
export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();

    // Validate required fields
    if (!data.title_en || !data.title_hi || !data.description_en || !data.description_hi) {
      return new Response(
        JSON.stringify({ error: "Title and Description are required." }),
        { status: 400 }
      );
    }

    const newYojna = new Yojna(data);
    await newYojna.save();

    // 🔥 Auto Notification Trigger (only POST)
    sendAutoNotification(newYojna); // Not awaiting → fast response

    return new Response(
      JSON.stringify({ message: "Yojna added successfully", yojna: newYojna }),
      { status: 201 }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}



// -----------------------------------------------------------
// ✅ GET: Fetch Yojna (No Notification)
// -----------------------------------------------------------
export async function GET() {
  try {
    await connectToDB();

    const yojnas = await Yojna.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(yojnas), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

import Job from "@/app/api/models/Job";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb.js";

// 🔥 Helper: Send notification through your existing route
async function sendAutoNotification(job) {
  try {
    // Send to your own API route
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendNotification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: job.title,
        body: `New ${job.category} recruitment released. Tap to view details.`,
        url: `https://resultshub.in/jobs/${job.slug}`,
        data: {
          jobId: job._id.toString(),
          category: job.category,
        }
      }),
    });

    console.log("📢 Notification sent for:", job.title);
  } catch (err) {
    console.error("❌ Notification sending failed:", err);
  }
}

// 🟢 Create a new job
export async function POST(req) {
  try {
    await connectToDB();
    const data = await req.json();

    // Create new job document
    const newJob = await Job.create(data);

    // 🔥 Fire notification (non-blocking)
    sendAutoNotification(newJob);
    
    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Error saving job:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🟣 Get all jobs
export async function GET() {
  try {
    await connectToDB();
    const jobs = await Job.find().sort({ createdAt: -1 });

    // ✅ Always return valid JSON, even if no jobs found
    if (!jobs || jobs.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json( { success: false, error: error.message || "Error fetching jobs" },
      { status: 500 });
  }
}

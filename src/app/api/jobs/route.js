import Job from "@/app/api/models/Job";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb.js";

// 🟢 Create a new job
export async function POST(req) {
  try {
    await connectToDB();
    const data = await req.json();

    // Create new job document
    const newJob = await Job.create(data);

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
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

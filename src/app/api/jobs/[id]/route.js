import Job from "@/app/api/models/Job";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb.js";
import mongoose from "mongoose";

// Get a job by ID
export async function GET(req, context) {
  try {
    await connectToDB();

    const { id } = context.params; // ✅ Must await
    let job;
    //const job = await Job.findById(id);
    // Check if it's a valid ObjectId → admin side
    if (mongoose.Types.ObjectId.isValid(id)) {
      job = await Job.findById(id);
    } else {
      // Otherwise → treat as slug (for SEO/frontend)
      job = await Job.findOne({ slug: id });
    } 
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update a job
export async function PUT(req, context) {
  try {
    await connectToDB();
    const { id } = await context.params; // ✅ await here too
    const data = await req.json();

    const updatedJob = await Job.findByIdAndUpdate(id, data, { new: true });
    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a job
export async function DELETE(req, context) {
  try {
    await connectToDB();
    const { id } = await context.params; // ✅ await again

    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: deletedJob });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ResultAdmit from "../models/result-admit";

// ✅ GET: Fetch all records
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

// ✅ POST: Add a new record
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const newRecord = new ResultAdmit(body);
    await newRecord.save();
    return NextResponse.json(
      { message: `${body.type} added successfully`, record: newRecord },
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

// ✅ PUT: Update a record by ID
export async function PUT(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updatedRecord = await ResultAdmit.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedRecord) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Record updated successfully",
      record: updatedRecord,
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a record by ID
export async function DELETE(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const deleted = await ResultAdmit.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
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

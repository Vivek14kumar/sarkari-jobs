import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ResultAdmit from "@/app/api/models/result-admit";
import mongoose from "mongoose";

export async function GET(request, context) {
  try {
    await connectToDB();
    const { id } = context.params;

    let card;

    // ✅ Check if param is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      card = await ResultAdmit.findById(id);
    } else {
      // ✅ Otherwise, treat it as a slug
      card = await ResultAdmit.findOne({ slug: id });
    }

    if (!card) {
      return NextResponse.json({ error: "Admit Card not found" }, { status: 404 });
    }

    return NextResponse.json(card, { status: 200 });
  } catch (error) {
    console.error("Error fetching admit card:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

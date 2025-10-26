import { connectToDB } from "@/lib/mongodb";
import Yojna from "../models/Yojna";

export async function POST(req) {
  try {
    await connectToDB();
    const data = await req.json();

    // Validate required fields
    if (!data.title_en || !data.title_hi || !data.description_en || !data.description_hi) {
      return new Response(JSON.stringify({ error: "Title and Description are required." }), { status: 400 });
    }

    const newYojna = new Yojna(data);
    await newYojna.save();

    return new Response(JSON.stringify({ message: "Yojna added successfully", yojna: newYojna }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDB();
    const yojnas = await Yojna.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(yojnas), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

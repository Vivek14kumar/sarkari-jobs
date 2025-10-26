import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Job from "../models/Job";
import resultAdmit from "../models/result-admit";
import Yojna from "../models/Yojna";

export async function GET(request) {
  await connectToDB();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) return NextResponse.json([]);

  try {
    const jobs = await Job.find({ title_en: { $regex: query, $options: "i" } }).limit(5);
    const results = await resultAdmit.find({ title_en: { $regex: query, $options: "i" } }).limit(5);
    const yojnas = await Yojna.find({ title_en: { $regex: query, $options: "i" } }).limit(5);

    const suggestions = [
      ...jobs.map(j => ({ name: j.title_en, url: `/jobs/${j._id}`, type: "Job" })),
      ...results.map(r => ({ name: r.title_en, url: `/results/${r._id}`, type: "Result" })),
      ...yojnas.map(y => ({ name: y.title_en, url: `/yojna/${y._id}`, type: "Yojna" })),
    ];

    return NextResponse.json(suggestions);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}

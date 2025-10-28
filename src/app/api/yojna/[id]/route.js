import { connectToDB } from "@/lib/mongodb";
import Yojna from "../../models/Yojna";

// ✅ Update Yojna
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const data = await req.json();

    const updatedYojna = await Yojna.findByIdAndUpdate(id, data, { new: true });
    if (!updatedYojna)
      return new Response(JSON.stringify({ error: "Yojna not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Yojna updated", yojna: updatedYojna }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ❌ Delete Yojna
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const deleted = await Yojna.findByIdAndDelete(id);

    if (!deleted)
      return new Response(JSON.stringify({ error: "Yojna not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Yojna deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

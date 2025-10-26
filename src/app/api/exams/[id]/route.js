import connectMongo from "@/utils/connectMongo";
import Exam from "@/models/Exam";

export async function DELETE(req, { params }) {
  try {
    await connectMongo();
    await Exam.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to delete exam" }), { status: 500 });
  }
}

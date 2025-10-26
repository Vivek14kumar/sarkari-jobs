import mongoose from "mongoose";

const resultAdmitSchema = new mongoose.Schema(
  {
    type: String, // Result or Admit Card
    title_en: String,
    title_hi: String,
    category: String,
    postDate: String,
    link: String,
    extraInfo: [
      {
        key: String,
        value: String,
      },
    ],
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite error during hot reloads in Next.js
export default mongoose.models.ResultAdmit ||
  mongoose.model("ResultAdmit", resultAdmitSchema);

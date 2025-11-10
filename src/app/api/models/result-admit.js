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
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

resultAdmitSchema.pre("save", function (next) {
  if (!this.slug && this.title_en) {
    this.slug = this.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// ✅ Prevent model overwrite error during hot reloads in Next.js
export default mongoose.models.ResultAdmit ||
  mongoose.model("ResultAdmit", resultAdmitSchema);

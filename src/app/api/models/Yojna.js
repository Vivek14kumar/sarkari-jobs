import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const linkSchema = new mongoose.Schema({
  type: String,
  url: String,
});

const yojnaSchema = new mongoose.Schema(
  {
    title_en: { type: String, required: true },
    title_hi: { type: String, required: true },
    description_en: { type: String, required: true },
    description_hi: { type: String, required: true },
    eligibility: [String],
    links: [linkSchema],
    documents: [String],
    faq: [faqSchema],
    otherDetails: [String],
    thumbnail: String, // added thumbnail
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

yojnaSchema.pre("save", function (next) {
  if (!this.slug && this.title_en) {
    this.slug = this.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.models.Yojna || mongoose.model("Yojna", yojnaSchema);

import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title_en: { type: String, required: true },
    title_hi: { type: String },

    category: { type: String },

    startDate: { type: String },
    lastDate: { type: String },
    examDate: { type: String },
    resultDate: { type: String },
    feeLastDate: { type: String },
    totalPosts: {type: String},

    officialLink: { type: String },
    applyLink: { type: String },
    notificationLink: { type: String },
    syllabusLink: { type: String },

    // 🆕 Description in both languages
    description_en: { type: String },
    description_hi: { type: String },

    // Extra info (existing)
    extra_info: [
      {
        key: String,
        value: String,
      },
    ],

    // 🆕 Vacancy Table
    vacancy_table: [
      {
        postName: String,
        categoryName: String,
        noOfPost: String,
      },
    ],

    // 🆕 Eligibility Criteria
    eligibility: { type: String },

    // 🆕 Application Fee (Dynamic)
    application_fees: [
      {
        category: String,
        fee: String,
      },
    ],

    // 🆕 Age Limit (Min / Max / Relaxation)
    age_limit: [
      {
      min: String,
      max: String,
      relaxation: String,
    },
  ],

    // 🆕 Payment Modes (Multiple options)
    payment_modes: [{ type: String }],
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

JobSchema.pre("save", function (next) {
  if (!this.slug && this.title_en) {
    this.slug = this.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);

"use client";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";
import Link from "next/link";

export default function JobCard({ job }) {
  const categoryColors = {
    "Central Govt": "bg-blue-100 text-blue-800",
    "State Govt": "bg-green-100 text-green-800",
    "SSC": "bg-purple-100 text-purple-800",
    "Railway": "bg-orange-100 text-orange-800",
  };

  // Format date as dd-MMM-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const totalPost = job.totalPosts
    ? Number(job.totalPosts).toLocaleString("en-IN")
    : "N/A";

  // --- Age Limit (show one min and one max) ---
  let minAge = "-";
  let maxAge = "-";

  if (job.age_limit?.length > 0) {
    const minAges = job.age_limit
      .map((a) => parseInt(a.min))
      .filter((num) => !isNaN(num));

    const maxAges = job.age_limit
      .map((a) => {
        const num = parseInt(a.max);
        return !isNaN(num) ? num : null;
      })
      .filter((num) => num !== null);

    minAge = minAges.length > 0 ? Math.min(...minAges) : "-";
    maxAge = maxAges.length > 0 ? Math.max(...maxAges) : "-";
  }

  // --- Application Fees (show min and max) ---
let feesText = "-";
if (job.application_fees?.length > 0) {
  const feeValues = job.application_fees
    .map(f => parseInt(f.fee))
    .filter(num => !isNaN(num));

  if (feeValues.length > 0) {
    const minFee = Math.min(...feeValues);
    const maxFee = Math.max(...feeValues);

    // If both are the same, show only one value
    feesText = minFee === maxFee ? `₹${minFee}` : `₹${minFee} - ₹${maxFee}`;
  }
}


  // Detect if job is new (within 7 days)
  const isNew = (() => {
    const jobDate = new Date(job.createdAt);
    const now = new Date();
    const diffDays = (now - jobDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  })();

  return (
    <article
      key={job._id}
      className="relative bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300 flex flex-col overflow-hidden max-w-sm mx-auto"
      itemScope
      itemType="https://schema.org/JobPosting"
    >
      {/* Corner Ribbon */}
      {isNew && (
        <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
          <div className="absolute top-2 -left-8 w-26 h-6 bg-red-500 text-white font-bold text-sm flex items-center justify-center transform -rotate-45 shadow-md">
            NEW
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Title */}
        <div>
          <h2
            itemProp="title"
            className="text-lg font-semibold text-blue-700 hover:underline mb-1 ml-4"
          >
            {job.title_en}
          </h2>
          {job.title_hi && (
            <p className="text-gray-500 text-sm mb-3 ml-4">{job.title_hi}</p>
          )}

          {/* Category & Dates */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                categoryColors[job.category] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {job.category}
            </span>
            {job.startDate && job.lastDate && (
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <FaCalendarAlt /> {formatDate(job.startDate)} -{" "}
                {formatDate(job.lastDate)}
              </span>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-5">
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <FaClock /> Last Date: {formatDate(job.lastDate)}
            </div>

            {/* Fees */}
            <div className="flex items-start gap-1 text-sm">
              <FaMoneyBillWave className="text-green-500 mt-1" />
              <div>
                <span className="font-medium">Fees:</span>{" "}
                <span className="text-xs font-bold">{feesText !== "-" ? feesText : "-"}</span>
              </div>
            </div>

            {/* Age Limit */}
            <div>
              <FaInfoCircle className="inline text-indigo-500 mr-1" />
              Age: <span className="font-medium">{minAge} - {maxAge}</span> yrs
            </div>

            {/* Total Posts */}
            <div className="font-bold">
              Total Posts: <span className="text-blue-700">{totalPost}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-auto">
          <Link
            href={`/jobs/${job.slug ||job._id}`}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition w-1/2 text-center"
          >
            View Details
          </Link>

          {job.officialLink && (
            <a
              href={job.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition w-1/2 text-center ml-2"
            >
              Official Site
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

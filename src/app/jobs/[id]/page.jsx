"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserGraduate,
  FaUsers,
  FaArrowLeft,
  FaLink,
  FaGlobe,
  FaInfoCircle,
  FaClipboardList,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";
import Link from "next/link";
import SEOHead from "@/components/SEOHead";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/jobs/${id}`)
        .then((res) => setJob(res.data))
        .catch((err) => console.error("Error loading job details:", err));
    }
  }, [id]);

  if (!job) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">
          {language === "en"
            ? "Loading job details..."
            : "नौकरी विवरण लोड हो रहा है..."}
        </p>
      </div>
    );
  }

  const lastDate = job.lastDate
    ? new Date(job.lastDate).toLocaleDateString("en-IN")
    : "—";
  const startDate = job.startDate
    ? new Date(job.startDate).toLocaleDateString("en-IN")
    : "—";
  const feeLastDate = job.feeLastDate
    ? new Date(job.feeLastDate).toLocaleDateString("en-IN")
    : "—";

  const title = language === "en" ? job.title_en : job.title_hi;
  const description = language === "en" ? job.description_en : job.description_hi;
  const ageLimits = job.age_limit || [];

  return (
    <>
    <SEOHead
        title={`${job.title} - Apply Online | ResultsHub.in`}
        description={`Apply online for ${job.title}. Check eligibility, important dates, fees, and official notification.`}
        image={job.image || "/default-og-image.jpg"}
        url={`https://resultshub.in/jobs/${job.slug}`}
      />
    <main className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10 my-8 border border-gray-200">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="flex items-center text-blue-700 hover:text-blue-900 font-semibold transition"
        >
          <FaArrowLeft className="mr-2" />{" "}
          {language === "en" ? "Back to Jobs" : "वापस जॉब्स पर"}
        </Link>

        <button
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full hover:from-gray-200 hover:to-gray-300 transition"
        >
          <FaGlobe /> {language === "en" ? "Hindi" : "English"}
        </button>
      </div>

      {/* Title */}
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{title}</h1>
        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
          {job.category}
        </span>
      </header>

      {/* Important Dates */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-700">
          <FaCalendarAlt className="text-blue-600" />
          <span>
            <strong>{language === "en" ? "Start Date:" : "आरंभ तिथि:"}</strong>{" "}
            {startDate}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaCalendarAlt className="text-red-600" />
          <span>
            <strong>{language === "en" ? "Last Date:" : "अंतिम तिथि:"}</strong>{" "}
            {lastDate}
          </span>
        </div>
        {job.examDate && (
          <div className="flex items-center gap-2 text-gray-700">
            <FaCalendarAlt className="text-green-600" />
            <span>
              <strong>{language === "en" ? "Exam Date:" : "परीक्षा तिथि:"}</strong>{" "}
              {job.examDate}
            </span>
          </div>
        )}
      </section>

      {/* Description */}
      {description && (
        <section className="mb-6 bg-gray-50 p-5 rounded-lg border-l-4 border-blue-400 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaInfoCircle className="text-blue-600" />{" "}
            {language === "en" ? "Description" : "विवरण"}
          </h3>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </section>
      )}
{/* Eligibility Section */}
{job.eligibility && (
  <section className="mb-6 bg-gray-50 p-5 rounded-lg border-gray-500 border-l-4 shadow-sm  ">
    <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
      <FaUserGraduate className="text-blue-600" />
      {language === "en" ? "Eligibility" : "योग्यता"}
    </h3>

    {/* Split only once at the first Hindi character after English */}
    {(() => {
      const hindiIndex = job.eligibility.search(/[\u0900-\u097F]/);
      if (hindiIndex === -1) {
        // No Hindi text, return the whole text
        return [job.eligibility];
      }
      // Split into two parts: before Hindi, and from first Hindi onward
      return [
        job.eligibility.slice(0, hindiIndex).trim(),
        job.eligibility.slice(hindiIndex).trim(),
      ];
    })().map((part, index) => (
      <p key={index} className="text-gray-800 mb-2 leading-relaxed">
        {part}
      </p>
    ))}
  </section>
)}


      {/* Age Limit */}
      {ageLimits.length > 0 && (
        <section className="mb-6 bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-400 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaUsers className="text-yellow-600" />{" "}
            {language === "en" ? "Age Limit" : "आयु सीमा"}
          </h3>
          {ageLimits.map((age) => (
            <>
            <p key={age._id} className="text-gray-700">
              {age.min && (<span className="mr-4">
                <strong className="text-gray-700">
                  {language === "en" ? "Minimum Age:" : "न्यूनतम आयु:"}
                </strong>{" "}
                {age.min}
              </span>)}
              {age.max && (<span>
                <strong className="text-gray-700">
                  {language === "en" ? "Maximum Age:" : "अधिकतम आयु:"}
                </strong>{" "}
                {age.max}
              </span>
            )}
            </p>
            {age.relaxation && (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-1">
                <FaUsers className="text-blue-500 text-sm" />
                {language === "en" ? "Age Relaxation" : "आयु में छूट"}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {age.relaxation}
              </p>
            </div>
          )}
            </>
          ))}
        </section>
      )}

      {/* Extra Info (All Fields) */}
      {job.extra_info?.length > 0 && (
        <section className="mb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {job.extra_info.map((info) => {
            const points = info.value
              ?.split(/[,.\n]/)
              .map((item) => item.trim())
              .filter((item) => item.length > 0);

            return (
              <div
                key={info._id}
                className="flex flex-col gap-2 bg-indigo-50 p-4 rounded-lg shadow-sm border-l-4 border-indigo-400 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                  <FaClipboardList /> {info.key.trim()}
                </div>
                {points.length > 1 ? (
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 text-sm">{info.value}</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Application Fee & Payment Modes */}
      {(job.payment_modes?.length > 0 ||
        job.application_fees?.length > 0 ||
        job.feeLastDate) && (
        <section className="mb-6 bg-green-50 p-5 rounded-lg border-l-4 border-green-400 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FaMoneyBillWave className="text-green-600" />
            {language === "en"
              ? "Application Fee & Payment Modes"
              : "आवेदन शुल्क और भुगतान के तरीके"}
          </h3>

          {job.application_fees?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
              {job.application_fees.map((fee, i) => (
                <li key={i}>
                  {language === "en"
                    ? `${fee.category}: ₹${fee.fee}`
                    : `${fee.category} : ₹${fee.fee}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 mb-3">
              {language === "en"
                ? "No fee information available."
                : "शुल्क की जानकारी उपलब्ध नहीं है।"}
            </p>
          )}

          {job.feeLastDate && (
            <p className="text-gray-700 mb-3">
              <strong>
                {language === "en"
                  ? "Fee Payment Last Date:"
                  : "शुल्क भुगतान की अंतिम तिथि:"}
              </strong>{" "}
              {feeLastDate}
            </p>
          )}

          {job.payment_modes?.length > 0 && (
            <div className="text-gray-700">
              <strong>
                {language === "en" ? "Payment Modes:" : "भुगतान के तरीके:"}
              </strong>{" "}
              {job.payment_modes.join(", ")}
            </div>
          )}
        </section>
      )}

      {/* Vacancy Table */}
      {job.vacancy_table?.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaBook className="text-blue-600" />
            {language === "en" ? "Vacancy Details" : "रिक्ति विवरण"}
          </h3>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full text-sm text-gray-700 border-collapse">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">
                    {language === "en" ? "Post Name" : "पद का नाम"}
                  </th>
                  <th className="px-4 py-2 text-left">
                    {language === "en" ? "Category" : "श्रेणी"}
                  </th>
                  <th className="px-4 py-2 text-left">
                    {language === "en" ? "No. of Posts" : "पदों की संख्या"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {job.vacancy_table.map((v, i) => (
                  <tr
                    key={v._id}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
                  >
                    <td className="px-4 py-2">{v.postName}</td>
                    <td className="px-4 py-2">{v.categoryName}</td>
                    <td className="px-4 py-2">{v.noOfPost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-700 mt-2 font-medium">
            <strong>{language === "en" ? "Total Posts:" : "कुल पद:"}</strong>{" "}
            {job.totalPosts}
          </p>
        </section>
      )}

      {/* Links Section */}
      <section className="flex flex-wrap gap-4 mt-6">
        {job.applyLink && (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaCheckCircle />{" "}
            {language === "en" ? "Apply Online" : "ऑनलाइन आवेदन करें"}
          </a>
        )}
        {job.officialLink && (
          <a
            href={job.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg text-sm hover:bg-blue-800 transition flex items-center gap-2"
          >
            <FaLink />{" "}
            {language === "en" ? "Official Website" : "आधिकारिक वेबसाइट"}
          </a>
        )}
      </section>
    </main>
    </>
  );
}

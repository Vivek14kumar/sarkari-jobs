"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LatestJobs from "@/components/LatestJobs";
import SEOHead from "@/components/SEOHead";

const itemsPerLoad = 4;

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [results, setResults] = useState([]);
  const [yojnas, setYojnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHeading, setCurrentHeading] = useState(0);

  // For "Load More"
  const [visibleAdmitCards, setVisibleAdmitCards] = useState(itemsPerLoad);
  const [visibleResults, setVisibleResults] = useState(itemsPerLoad);
  const [visibleYojnas, setVisibleYojnas] = useState(itemsPerLoad);

  const headings = ["Welcome to Results Hub", "रिजल्ट हब में आपका स्वागत है"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeading((prev) => (prev + 1) % headings.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resMain = await fetch("/api/result-admit");
        const dataMain = await resMain.json();

        setJobs(dataMain.filter((item) => item.type?.toLowerCase() === "job"));
        setAdmitCards(
          dataMain.filter((item) => item.type?.toLowerCase() === "admit card")
        );
        setResults(
          dataMain.filter((item) => item.type?.toLowerCase() === "result")
        );

        const resYojna = await fetch("/api/yojna");
        const dataYojna = await resYojna.json();
        setYojnas(dataYojna);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Reusable Card Section
  const CardSection = ({
    title,
    items,
    buttonText,
    buttonColor,
    fallbackLink,
    visibleCount,
    setVisibleCount,
    viewAllLink,
  }) => {
    const visibleItems = items.slice(0, visibleCount);
    const canLoadMore = visibleCount < items.length;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 rounded-full text-center p-1 bg-[#f6e7d2]">
          {title}
        </h2>
        {visibleItems.length === 0 ? (
          <p className="text-gray-500 py-4">No {title} found.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleItems.map((item) => {
                // ✅ Special layout for Sarkari Yojana cards
                if (title.includes("Yojana")) {
                  return (
                    <Link
  key={item._id}
  href={`/yojna/${item.slug || item._id}`}
  className="relative group block rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2"
>
  {/* Image */}
  {(item.image || item.thumbnail) ? (
    <div className="relative w-full h-46 overflow-hidden">
      <img
        src={item.image || item.thumbnail}
        alt={item.title_en || "Sarkari Yojana"}
        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        width={1280}
        height={720}
      />
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
    </div>
  ) : (
    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
      No Image
    </div>
  )}

  {/* Title */}
  <div className="p-4 text-center relative z-10 -mt-6 top-2">
    <h3 className="font-extrabold text-lg sm:text-2xl  drop-shadow-lg mb-1 line-clamp-2 ">
      {item.title_en}
    </h3>
    <p className="text-xl sm:text-base drop-shadow-md line-clamp-2">
      {item.title_hi}
    </p>
  </div>

  {/* "New" Ribbon Badge */}
  {new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
    <div className="absolute bottom-3 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-tr-xl rounded-br-xl shadow-lg">
      NEW
    </div>
  )}

  {/* Hover effect for shadow */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</Link>

                  );
                }

                // ✅ Default layout for Jobs, Results, Admit Cards
                const postDate = item.postDate || item.createdAt;
                const isNew = (() => {
                  if (!postDate) return false;
                  const now = new Date();
                  const post = new Date(postDate);
                  const diffDays = (now - post) / (1000 * 60 * 60 * 24);
                  return diffDays <= 7;
                })();

                const isEmptyLink = !item.link || item.link.trim() === "";
                const buttonHref = isEmptyLink ? fallbackLink : item.link;
                const buttonLabel = isEmptyLink ? "View All" : buttonText;

                return (
                  <div
                    key={item._id}
                    className="relative group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 transition-opacity duration-500"></div>

                    {/* Badges */}
                    <div className="absolute top-1 right-1 flex flex-col gap-1 z-20">
                      {isNew && (
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg text-center">
                          NEW
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 relative z-10 top-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition ">
                        {item.title_en}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {item.title_hi}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800 px-2 py-1 rounded-full shadow-sm">
                          {item.category || title}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          📅{" "}
                          {postDate
                            ? new Date(postDate)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")
                            : "Date N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="border-t p-4 bg-gray-50 flex justify-center relative z-10">
                      <Link
                        href={buttonHref}
                        target={isEmptyLink ? "_self" : "_blank"}
                        className={`w-full flex items-center justify-center gap-2 ${buttonColor} text-white py-2 rounded-xl font-semibold shadow-md transition duration-300`}
                      >
                        {buttonLabel}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Button */}
            {viewAllLink && (
              <div className="flex justify-center mt-6">
                <Link
                  href={viewAllLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-semibold shadow transition"
                >
                  View All
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  return (
    <>
      <SEOHead
        title="ResultsHub.in - Latest Sarkari Results & Government Jobs 2025"
        description="Check the latest Sarkari Results, Admit Cards, and Government Job Notifications in English & Hindi."
        keywords="Sarkari Result, Latest Jobs 2025, Admit Card, Govt Jobs, Sarkari Naukri"
        image="/images/home-og.jpg"
        url="https://resultshub.in"
      />

      <main className="max-w-6xl mx-auto p-4">
        {/* Animated Heading */}
        <div className="relative h-16 mb-12 overflow-hidden">
          {headings.map((text, index) => (
            <h1
              key={index}
              className={`absolute top-0 left-0 w-full text-4xl font-extrabold text-center text-blue-800 h-18 flex items-center justify-center transition-all duration-700 text-[28px] md:text-5xl
                ${
                  index === currentHeading
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-full"
                }
              `}
            >
              {text}
            </h1>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Latest Jobs */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-blue-800 mb-4  rounded-full text-center p-1 bg-[#f6e7d2]">
                Latest Jobs / नवीनतम नौकरियाँ
              </h2>
              <LatestJobs limit={4} />

              {/* ✅ ADD THIS BELOW */}
  {jobs.length > 0 && (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          jobs.slice(0, 4).map((job) => ({
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            title: job.title_en,
            description:
              job.description_en ||
              "Check complete details for the latest government recruitment.",
            hiringOrganization: {
              "@type": "Organization",
              name:
                job.extra_info?.find((item) =>
                  item.key.toLowerCase().includes("hiring organization")
                )?.value || "ResultsHub",
              sameAs: "https://resultshub.in/",
              logo: "https://resultshub.in/logo.png",
            },
            datePosted: new Date(job.startDate).toISOString().split("T")[0],
            validThrough: new Date(job.lastDate).toISOString().split("T")[0],
            employmentType: "FULL_TIME",
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality:
                  job.extra_info?.find((item) =>
                    item.key.toLowerCase().includes("job location")
                  )?.value || "India",
                addressCountry: "IN",
              },
            },
            totalJobOpenings: job.totalPosts,
            url: `https://resultshub.in/jobs/${job.slug}`,
            identifier: {
              "@type": "PropertyValue",
              name: "ResultsHub",
              value: job._id,
            },
          }))
        ),
      }}
    />
  )}
              <div className="flex justify-center mt-6">
                <Link
                  href="/jobs"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-semibold shadow transition"
                >
                  View All Jobs
                </Link>
              </div>
            </section>

            {/* Admit Cards */}
            <CardSection
              title="Admit Cards / प्रवेश पत्र"
              items={admitCards}
              buttonText="Download Admit Card"
              buttonColor="bg-green-600 hover:bg-green-700"
              fallbackLink="/admit-cards"
              visibleCount={visibleAdmitCards}
              setVisibleCount={setVisibleAdmitCards}
              viewAllLink="/admit-cards"
            />

            {/* Results */}
            <CardSection
              title="Results / परिणाम"
              items={results}
              buttonText="View Result"
              buttonColor="bg-blue-600 hover:bg-blue-700"
              fallbackLink="/results"
              visibleCount={visibleResults}
              setVisibleCount={setVisibleResults}
              viewAllLink="/results"
            />

            {/* Sarkari Yojana */}
            <CardSection
              title="Sarkari Yojana / सरकारी योजना"
              items={yojnas}
              buttonText="Read More"
              buttonColor="bg-yellow-500 hover:bg-yellow-600"
              fallbackLink="/yojna"
              visibleCount={visibleYojnas}
              setVisibleCount={setVisibleYojnas}
              viewAllLink="/yojna"
            />
          </>
        )}
      </main>
    </>
  );
}

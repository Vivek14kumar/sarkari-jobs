"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LatestJobs from "@/components/LatestJobs";
//import BreakingNewsBar from "@/components/BreakingNewsBar";
import SEOHead from "@/components/SEOHead";

const jobsPerLoad = 4;

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [results, setResults] = useState([]);
  const [yojnas, setYojnas] = useState([]); // state for Sarkari Yojana
  const [loading, setLoading] = useState(true);
  const [visibleJobs, setVisibleJobs] = useState(jobsPerLoad);

  const headings = ["Welcome to Results Hub", "रिजल्ट हब में आपका स्वागत है"];
  const [currentHeading, setCurrentHeading] = useState(0);

  // inside your HomePage function
  const latestNotifications = [...jobs, ...admitCards, ...results]
  .sort((a, b) => new Date(b.postDate || b.createdAt) - new Date(a.postDate || a.createdAt))
  .slice(0, 10); // show top 10 latest items

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentHeading(prev => (prev + 1) % headings.length);
  }, 7000); // change every 7 seconds
  return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Jobs, Admit Cards, Results
        const resMain = await fetch("/api/result-admit");
        const dataMain = await resMain.json();

        const jobData = dataMain.filter(item => item.type?.toLowerCase() === "job");
        const admitData = dataMain.filter(item => item.type?.toLowerCase() === "admit card");
        const resultData = dataMain.filter(item => item.type?.toLowerCase() === "result");

        setJobs(jobData);
        setAdmitCards(admitData);
        setResults(resultData);

        // Fetch Yojanas from /api/yojna
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

  const CardSection = ({ title, items, buttonText, buttonColor }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 py-4">No {title} found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => {
            const postDate = item.postDate || item.createdAt;

            const isNew = (() => {
              if (!postDate) return false;
              const now = new Date();
              const post = new Date(postDate);
              const diffDays = (now - post) / (1000 * 60 * 60 * 24);
              return diffDays <= 7;
            })();

            {/*const isLive = (() => {
              if (!postDate) return false;
              const now = new Date();
              const post = new Date(postDate);
              const diffDays = (now - post) / (1000 * 60 * 60 * 24);
              return diffDays <= 3;
            })();*/}

            return (
              <div
                key={item._id}
                className="relative group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 transition-opacity duration-500"></div>

                {/* Badges */}
                <div className="absolute top-12 md:top-4 right-4 flex flex-col gap-1 z-20">
                  {isNew && (
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg text-center">
                      NEW
                    </div>
                  )}
                  {/*isLive && (
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg text-center">
                      LIVE
                    </div>
                  )*/}
                </div>

                {/* Content */}
                <div className="p-5 relative z-10">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition">
                    {item.title_en}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.title_hi}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800 px-2 py-1 rounded-full shadow-sm">
                      {item.category || title}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      📅 {postDate || "Date N/A"}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <div className="border-t p-4 bg-gray-50 flex justify-center relative z-10">
                  <Link
                    href={item.link || "#"}
                    target="_blank"
                    className={`w-full flex items-center justify-center gap-2 ${buttonColor} text-white py-2 rounded-xl font-semibold shadow-md transition duration-300`}
                  >
                    {buttonText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );

  return (
    <>
      <SEOHead
        title="Sarkari Portal 2025 | Jobs, Admit Cards, Results, Yojana"
        description="Browse latest government jobs, admit cards, results, and Sarkari Yojana. All updates in English & Hindi. UPSC, SSC, Railway, and State Govt."
      />

      <main className="max-w-6xl mx-auto p-4">
        <div className="relative h-16 mb-12 overflow-hidden">
  {headings.map((text, index) => (
    <h1
      key={index}
      className={`absolute top-0 left-0 w-full text-4xl font-extrabold text-center text-blue-800 h-18 flex items-center justify-center transition-all duration-700 text-[28px] md:text-5xl
        ${index === currentHeading ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}
      `}
    >
      {text}
    </h1>
  ))}
</div>




         {/* Breaking News Bar */}
    {/*!loading && <BreakingNewsBar notifications={latestNotifications} />*/}
    
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Latest Jobs */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Latest Jobs / नवीनतम नौकरियाँ</h2>
              <LatestJobs limit={4} />
            </section>

            {/* Admit Cards */}
            <CardSection
              title="Admit Cards / प्रवेश पत्र"
              items={admitCards}
              buttonText="Download Admit Card"
              buttonColor="bg-green-600 hover:bg-green-700"
            />

            {/* Results */}
            <CardSection
              title="Results / परिणाम"
              items={results}
              buttonText="View Result"
              buttonColor="bg-blue-600 hover:bg-blue-700"
            />

            {/* Sarkari Yojana */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Sarkari Yojana / सरकारी योजना</h2>
              {yojnas.length === 0 ? (
                <p className="text-gray-500 py-4">No Yojanas found.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {yojnas.map(item => (
                    <div
                      key={item._id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      <Link
                        href={`/yojna/${item._id}`}
                        className="block w-full h-full"
                      >
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt={item.title_en}
                            className="w-full h-40 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition">
                            {item.title_en}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.title_hi}</p>
                        </div>
                      </Link>

                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

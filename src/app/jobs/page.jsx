"use client";
import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import SEOHead from "@/components/SEOHead";

const categories = ["All", "Central Govt", "State Govt", "SSC", "Railway"];
const jobsPerLoad = 6; // You can adjust this

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [visibleJobs, setVisibleJobs] = useState(jobsPerLoad);
  const [fadeKey, setFadeKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        const uniqueJobs = Array.from(new Map(data.map(j => [j._id, j])).values());
        setJobs(uniqueJobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on category
  const filteredJobs = filter === "All" ? jobs : jobs.filter(job => job.category === filter);
  const currentJobs = filteredJobs.slice(0, visibleJobs);

  const handleFilterChange = (cat) => {
    setFilter(cat);
    setVisibleJobs(jobsPerLoad);
    setFadeKey(prev => prev + 1);
  };

  const loadMoreJobs = () => setVisibleJobs(prev => prev + jobsPerLoad);

  // Skeleton loader component matching JobCard height
  const SkeletonJobCard = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col justify-between min-h-[200px] animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
      <div className="flex justify-between mt-auto">
        <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <>
      <SEOHead
        title="All Government Jobs 2025 | Sarkari Result"
        description="daa exam form fee, dda mts recruitment, Browse all latest government jobs, admit cards, and results in English & Hindi. Find updates for UPSC, SSC, Railway, and State Government jobs. Check DDA MTS Recruitment 2025 details including exam date, eligibility, age limit, and form fee, Apply online through the official DDA portal. candidates must have passed the intermediate (12th) examination from a recognized board or institution and should possess knowledge of stenography, for detailed information regarding eligibility, requirements, and other conditions, applicants are advised to carefully read the official notification."
      />

      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          All Latest Government Jobs / नवीनतम सरकारी नौकरियां
        </h1>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-8 gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-transform duration-200 ${
                filter === cat 
                  ? "bg-blue-700 text-white shadow-md scale-105" 
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:scale-105"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div key={fadeKey} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading 
            ? Array.from({ length: jobsPerLoad }).map((_, i) => <SkeletonJobCard key={i} />)
            : currentJobs.map((job, index) => (
                <div
                  key={job._id}
                  className="opacity-0 translate-y-4 animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <JobCard job={job} />
                </div>
              ))
          }
        </div>

        {/* Load More Button */}
        {!loading && visibleJobs < filteredJobs.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMoreJobs}
              className="px-6 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition transform hover:scale-105"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s forwards; }
      `}</style>
    </>
  );
}

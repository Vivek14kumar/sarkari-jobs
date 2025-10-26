"use client";
import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import SEOHead from "@/components/SEOHead";

const categories = ["All", "Central Govt", "State Govt", "SSC", "Railway"];
const jobsPerLoad = 3;

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
        // Remove duplicates if any
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

  if (loading) return <p className="text-center py-10 text-gray-500">Loading jobs...</p>;
  if (jobs.length === 0) return <p className="text-center py-10 text-gray-500">No jobs available.</p>;

  return (
    <>
      <SEOHead
        title="All Government Jobs 2025 | Sarkari Result"
        description="Browse all latest government jobs, admit cards, and results in English & Hindi. Find updates for UPSC, SSC, Railway, and State Government jobs."
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

        {/* Jobs Grid with animation */}
        <div key={fadeKey} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeGrid">
          {currentJobs.map((job, index) => (
            <div
              key={job._id}
              className="opacity-0 translate-y-4 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleJobs < filteredJobs.length && (
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
        @keyframes fadeGrid {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s forwards; }
        .animate-fadeGrid { animation: fadeGrid 0.3s ease-out; }
      `}</style>
    </>
  );
}

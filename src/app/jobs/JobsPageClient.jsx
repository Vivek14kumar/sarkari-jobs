"use client";
import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import JobSkeleton from "@/components/JobSkeleton";

const categories = ["All", "Central Govt", "State Govt", "SSC", "Railway"];
const jobsPerLoad = 4;

export default function JobsClient({ jobs }) {
  const [filter, setFilter] = useState("All");
  const [visibleJobs, setVisibleJobs] = useState(jobsPerLoad);
  const [fadeKey, setFadeKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const filteredJobs =
    filter === "All" ? jobs : jobs.filter(job => job.category === filter);

  const currentJobs = filteredJobs.slice(0, visibleJobs);

  // 🔥 Show skeleton for 500ms on filter change
  const handleFilterChange = (cat) => {
    setLoading(true);
    setFilter(cat);
    setVisibleJobs(jobsPerLoad);
    setFadeKey(prev => prev + 1);

    setTimeout(() => setLoading(false), 500);
  };

  // 🔥 Show skeleton on first load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);

  const loadMoreJobs = () => {
    setVisibleJobs(prev => prev + jobsPerLoad);
  };

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        All Latest Government Jobs / नवीनतम सरकारी नौकरियां
      </h1>

      {/* Filter Buttons */}
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

      {/* 🔥 Show Skeleton When Loading */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: jobsPerLoad }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div key={fadeKey} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      )}

      {/* Load More */}
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

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s forwards;
        }
      `}</style>
    </main>
  );
}

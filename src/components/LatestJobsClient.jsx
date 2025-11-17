'use client';

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import SEOHead from "@/components/SEOHead";
import { HomeJobSchema } from "@/components/HomeJobSchema";

export default function LatestJobsClient({ initialJobs = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [visibleCount, setVisibleCount] = useState(initialJobs.length);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const visibleJobs = jobs.slice(0, visibleCount);

  // Update JSON-LD dynamically if "Load More" is clicked
  useEffect(() => {
    const scriptId = "jobs-json-ld";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      document.head.appendChild(script);
    }

    script.innerHTML = JSON.stringify(visibleJobs.map(HomeJobSchema));
  }, [visibleJobs]);

  if (!jobs || jobs.length === 0) {
    return <p className="text-center py-10 text-gray-500">No jobs found.</p>;
  }

  return (
    <>
    <SEOHead
        title="ResultsHub.in - Latest Sarkari Results & Government Jobs 2025"
        description="Check the latest Sarkari Results, Admit Cards, and Government Job Notifications in English & Hindi."
        keywords="Sarkari Result, Latest Jobs 2025, Admit Card, Govt Jobs, Sarkari Naukri"
        image="/images/home-og.jpg"
        url="https://resultshub.in"
      />
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleJobs.map((job) => (
          <JobCard key={job._id} job={job} className="flex-1" />
        ))}
      </div>

      {visibleCount < jobs.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-semibold shadow transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
    </>
  );
}

'use client';

import { useState } from "react";
import JobCard from "@/components/JobCard";
import SEOHead from "@/components/SEOHead";

export default function LatestJobsClient({ initialJobs = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [visibleCount, setVisibleCount] = useState(initialJobs.length);

  const handleLoadMore = () => setVisibleCount(prev => prev + 6);

  const visibleJobs = jobs.slice(0, visibleCount);

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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleJobs.map(job => (
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
    </>
  );
}

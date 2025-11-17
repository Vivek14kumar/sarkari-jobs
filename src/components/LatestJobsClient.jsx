'use client';

import { useState } from "react";
import JobCard from "@/components/JobCard";
import { HomeJobSchema } from "@/components/HomeJobSchema";

export default function LatestJobsClient({ initialJobs = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const visibleJobs = jobs.slice(0, visibleCount);

  if (!jobs || jobs.length === 0) {
    return <p className="text-center py-10 text-gray-500">No jobs found.</p>;
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleJobs.map((job) => (
          <div
            key={job._id}
            className="flex flex-col h-full min-h-[300px]"
          >
            <JobCard job={job} className="flex-1" />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(HomeJobSchema(job)),
              }}
            />
          </div>
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
  );
}

"use client";
import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";

export default function LatestJobs({ limit = 4 }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        // Remove duplicates if any
        const uniqueJobs = Array.from(new Map(data.map(j => [j._id, j])).values());
        setJobs(uniqueJobs.slice(0, limit)); // only show limited jobs
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [limit]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading jobs...</p>;
  if (jobs.length === 0) return <p className="text-center py-10 text-gray-500">No jobs found.</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {jobs.map(job => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}

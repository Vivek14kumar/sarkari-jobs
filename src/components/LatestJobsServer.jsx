// components/LatestJobsServer.jsx
import LatestJobsClient from "./LatestJobsClient";

export default async function LatestJobsServer({ limit = 6 }) {
  let jobs = [];

  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://resultshub.in";
    const res = await fetch(`${base}/api/jobs`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch jobs");

    const data = await res.json();
    const uniqueJobs = Array.from(new Map(data.map(j => [j._id, j])).values());
    jobs = uniqueJobs.slice(0, limit);
  } catch (err) {
    console.error(err);
  }

  return <LatestJobsClient initialJobs={jobs} />;
}

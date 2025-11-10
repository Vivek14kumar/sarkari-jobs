import { connectToDB } from "@/lib/mongodb";
import Job from "@/app/models/Job";
import ResultAdmit from "@/app/models/result-admit";
import Yojna from "@/app/models/Yojna";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  await connectToDB();

  const baseUrl = "https://resultshub.in";

  // Fetch data
  const [jobs, results, yojnas] = await Promise.all([
    Job.find({}, "slug updatedAt"),
    ResultAdmit.find({}, "slug updatedAt"),
    Yojna.find({}, "slug updatedAt"),
  ]);

  // Generate URLs for Jobs
  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: job.updatedAt,
    changefreq: "daily",
    priority: 0.9,
  }));

  // Generate URLs for Results/Admits
  const resultUrls = results.map((res) => ({
    url: `${baseUrl}/results/${res.slug}`,
    lastModified: res.updatedAt,
    changefreq: "daily",
    priority: 0.8,
  }));

  // Generate URLs for Yojnas
  const yojnaUrls = yojnas.map((yojna) => ({
    url: `${baseUrl}/yojna/${yojna.slug}`,
    lastModified: yojna.updatedAt,
    changefreq: "weekly",
    priority: 0.7,
  }));

  // Static pages (home, category, etc.)
  const staticUrls = [
    { url: `${baseUrl}/`, changefreq: "daily", priority: 1.0 },
    { url: `${baseUrl}/jobs`, changefreq: "daily", priority: 0.8 },
    { url: `${baseUrl}/results`, changefreq: "daily", priority: 0.8 },
    { url: `${baseUrl}/admit-cards`, changefreq: "daily", priority: 0.8 },
    { url: `${baseUrl}/yojna`, changefreq: "weekly", priority: 0.7 },
  ];

  // Combine all
  return [
    ...staticUrls,
    ...jobUrls,
    ...resultUrls,
    ...yojnaUrls,
  ];
}

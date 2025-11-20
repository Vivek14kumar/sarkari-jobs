import SEOHead from "@/components/SEOHead";
import JobsClient from "./JobsPageClient";
import Canonical from "@/components/Canonical";
import { HomeJobSchema } from "@/components/HomeJobSchema";

async function getJobs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Array.from(new Map(data.map(j => [j._id, j])).values());
}

export default async function JobsPage() {
  const jobs = await getJobs();

  // 🔥 Remove duplicates ONLY for JSON-LD (UI shows all)
const uniqueForSchema = Array.from(
  new Map(jobs.map(job => [job.slug || job.title, job])).values()
);

const jobsJsonLD = {
  "@context": "https://schema.org",
  "@graph": uniqueForSchema.map(job => HomeJobSchema(job))
};

  return (
    <>
      <head>
        <Canonical url={`https://resultshub.in/jobs`}/>
      </head>
      
      <SEOHead
        title="All Government Jobs 2025 | Sarkari Result"
        description="daa exam form fee, dda mts recruitment, Browse all latest government jobs."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsJsonLD) }}
      />

      <JobsClient jobs={jobs} />
    </>
  );
}

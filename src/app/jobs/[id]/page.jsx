// app/jobs/[id]/page.jsx
import JobClient from "./JobClient";
import JobSEO from "@/components/JobSEO";
import SEOHead from "@/components/SEOHead";
import { notFound } from "next/navigation";

export default async function JobDetailsPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams;

  // Fetch job on server so JSON-LD is SSR'd
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const res = await fetch(`${base}/api/jobs/${id}`, { cache: "no-store" });

  if (!res.ok) {
    // handle not found or error
    return notFound();
  }

  const job = await res.json();

  return (
    <>
      {/* SSR JSON-LD for Google */}
      <JobSEO jobData={job} />

      {/* Social/meta head (optional) */}
      <SEOHead
        title={`${job.title_en || job.title} - Apply Online | ResultsHub.in`}
        description={
          job.description_en
            ? job.description_en.slice(0, 150)
            : `Apply online for ${job.title_en || job.title}.`
        }
        image={job.image || "/default-og-image.jpg"}
        url={`https://resultshub.in/jobs/${job.slug}`}
      />

      {/* Client UI */}
      <JobClient job={job} />
    </>
  );
}

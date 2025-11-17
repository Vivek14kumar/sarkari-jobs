export default function HomeJobSchema({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  const schema = jobs.slice(0, 4).map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title_en,
    "description": job.description_en || job.title_hi,
    "datePosted": job.createdAt,
    "validThrough": job.lastDate,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.extra_info?.find(x => x.key.includes("Hiring"))?.value || "",
      "sameAs": job.officialLink || "",
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.extra_info?.find(x => x.key.includes("Job Location"))?.value || "",
        "addressCountry": "IN",
      }
    },
    "totalJobOpenings": Number(job.totalPosts) || undefined,
    "url": `https://resultshub.in/jobs/${job.slug}`
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

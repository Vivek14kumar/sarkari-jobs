// components/HomeJobSchema.jsx
export default function HomeJobSchema({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  const schema = jobs.slice(0, 4).map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title_en,
    "description": job.description_en || job.title_hi,
    "datePosted": job.startDate || job.createdAt,
    "validThrough": job.lastDate || "",
    "employmentType": "Full-Time",
    "hiringOrganization": {
      "@type": "Organization",
      "name":
        job.extra_info?.find((x) =>
          x.key.toLowerCase().includes("hiring")
        )?.value || "Organization Not Available",
      "sameAs": job.officialLink || ""
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality":
          job.extra_info?.find((x) =>
            x.key.toLowerCase().includes("location")
          )?.value || "",
        "addressCountry": "IN"
      }
    },
    "totalJobOpenings": Number(job.totalPosts) || undefined,
    "url": `https://resultshub.in/jobs/${job.slug}`
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

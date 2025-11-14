// src/components/JobSEO.jsx
export default function JobSEO({ jobData }) {
  if (!jobData) return null;

  const datePosted = jobData.startDate ? new Date(jobData.startDate).toISOString().split("T")[0] : undefined;
  const validThrough = jobData.lastDate ? new Date(jobData.lastDate).toISOString().split("T")[0] : undefined;

  const hiringOrganization =
    jobData.extra_info?.find((item) =>
      item.key.toLowerCase().includes("hiring organization") || item.key.toLowerCase().includes("company")
    )?.value || "ResultsHub";

  const jobLocation =
    jobData.extra_info?.find((item) => item.key.toLowerCase().includes("job location"))?.value || "India";

  const employmentType =
    jobData.extra_info?.find((item) => item.key.toLowerCase().includes("employment type"))?.value || "Full-time";

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: jobData.title_en || jobData.title,
    description: jobData.description_en || jobData.title_en || "Latest government job update by ResultsHub.",
    hiringOrganization: {
      "@type": "Organization",
      name: hiringOrganization,
      sameAs: jobData.officialLink || "https://resultshub.in/",
      logo: "https://resultshub.in/logo.png",
    },
    datePosted,
    validThrough,
    employmentType,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: jobLocation,
        addressCountry: "IN",
      },
    },
    identifier: {
      "@type": "PropertyValue",
      name: "ResultsHub",
      value: jobData._id,
    },
    directApply: true,
    totalJobOpenings: jobData.totalPosts || undefined,
    url: `https://resultshub.in/jobs/${jobData.slug}`,
    applicationUrl: jobData.applyLink || undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

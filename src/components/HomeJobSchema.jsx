"use client";

export default function HomeJobSchema({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  const jobSchema = jobs.map((job) => {
    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",

      // REQUIRED
      title: job.title_en || "Government Job Notification",
      description:
        job.full_description ||
        job.short_description ||
        job.title_en ||
        "Government job vacancy. Check eligibility, application process, and important dates.",

      datePosted: job.postDate
        ? new Date(job.postDate).toISOString()
        : new Date().toISOString(),

      hiringOrganization: {
        "@type": "Organization",
        name: job.organization || "Government of India",
        sameAs: "https://resultshub.in",
      },

      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location || "India",
          addressRegion: "IN",
          addressCountry: "IN",
        },
      },

      // OPTIONAL BUT GOOD FOR GOOGLE
      employmentType: job.employmentType || "Full-time",
      validThrough: job.lastDate
        ? new Date(job.lastDate).toISOString()
        : undefined,

      baseSalary: job.salary
        ? {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              value: job.salary,
              unitText: "MONTH",
            },
          }
        : undefined,

      // LINKS
      url: `https://resultshub.in/jobs/${job.slug || job._id}`,
    };
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
    />
  );
}

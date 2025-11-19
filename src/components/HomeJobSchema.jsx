export function HomeJobSchema(job) {
  const datePosted = job.startDate
    ? new Date(job.startDate).toISOString().split("T")[0]
    : new Date(job.createdAt || Date.now()).toISOString().split("T")[0];

  const validThrough = job.lastDate
    ? new Date(job.lastDate).toISOString().split("T")[0]
    : undefined;

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",

    title: job.title_en || job.title || "Job Vacancy",
    description:
      job.description_en ||
      job.description_hi ||
      `${job.title_en || job.title} - Latest government job notification.`,

    datePosted,
    validThrough,

    employmentType: (job.employmentType || "FULL_TIME").toUpperCase(),

    hiringOrganization: {
      "@type": "Organization",
      name: job.hiringOrg || "Government of India",
      sameAs: job.officialLink || job.applyLink || "https://resultshub.in",
      logo: "https://resultshub.in/logo.png",
    },

    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "India",
        addressCountry: "IN",
      },
    },

    identifier: {
      "@type": "PropertyValue",
      name: "ResultsHub",
      value: job._id,
    },

    totalJobOpenings: job.totalPosts || undefined,

    url: `https://resultshub.in/jobs/${job.slug}`,
  };
}

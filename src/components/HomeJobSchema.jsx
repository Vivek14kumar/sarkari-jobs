export function HomeJobSchema(job) {
  const hiringOrg = job.extra_info?.find(i =>
    i.key?.toLowerCase()?.includes("hiring")
  );
  const jobLoc = job.extra_info?.find(i =>
    i.key?.toLowerCase()?.includes("location")
  );

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",

    // Job title and description
    title: job.title_en || "Job Vacancy",
    description:
      job.description_en ||
      job.description_hi ||
      `${job.title_en || "Job"} - Check eligibility, important dates, and apply online.`,

    // Dates
    datePosted: job.startDate || new Date().toISOString().split("T")[0],
    validThrough: job.lastDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],

    // Employment type
    employmentType: (job.employmentType || "FULL_TIME").toUpperCase(),

    // Salary (optional)
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            value: job.salary,
            unitText: "MONTH"
          }
        }
      : undefined,

    // Hiring organization
    hiringOrganization: {
      "@type": "Organization",
      name: hiringOrg?.value || "Organization Name",
      sameAs: job.officialLink || job.applyLink || "https://example.com"
    },

    // Job location
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: jobLoc?.street || "Street Name",
        addressLocality: jobLoc?.value || "City",
        addressRegion: jobLoc?.value || "State",
        postalCode: jobLoc?.postalCode || "000000",
        addressCountry: "IN"
      }
    },

    // Applicant location requirements
    applicantLocationRequirements: {
      "@type": "Country",
      name: "India"
    },

    totalJobOpenings: job.totalPosts || 1,
    jobBenefits: job.jobBenefits || "As per organization rules"
  };
}

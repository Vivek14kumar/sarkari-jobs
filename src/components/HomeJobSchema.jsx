export function HomeJobSchema(job) {
  // Extract hiring organization and job location
  const hiringOrg = job.extra_info?.find(i =>
    i.key?.toLowerCase()?.includes("hiring")
  );
  const jobLoc = job.extra_info?.find(i =>
    i.key?.toLowerCase()?.includes("location")
  );

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",

    title: job.title_en || "Job Vacancy",
    description:
      job.description_en ||
      job.description_hi ||
      `${job.title_en} - Check eligibility, important dates, and apply online.`,

    datePosted: job.startDate || new Date().toISOString().split("T")[0],
    validThrough: job.lastDate || undefined,
    employmentType: job.employmentType || "Full-Time",

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

    hiringOrganization: {
      "@type": "Organization",
      name: hiringOrg?.value ,
      sameAs: job.officialLink || job.applyLink 
    },

    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: jobLoc?.value,
        addressRegion: jobLoc?.value ,
        addressCountry: "IN"
      }
    },

    applicantLocationRequirements: {
      "@type": "Country",
      name: "India"
    },

    totalJobOpenings: job.totalPosts || "Not Specified",
    jobBenefits: "As per organization rules"
  };
}

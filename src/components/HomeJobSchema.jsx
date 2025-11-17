export function HomeJobSchema(job) {
  // Extract values from extra_info
  const hiringOrg = job.extra_info?.find(i => i.key.toLowerCase().includes("hiring"));
  const jobLoc = job.extra_info?.find(i => i.key.toLowerCase().includes("location"));

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",

    // Basic Info
    title: job.title_en,
    description: job.description_en || job.description_hi || job.title_en,

    // Dates
    datePosted: job.startDate,
    validThrough: job.lastDate,

    // Optional
    employmentType: "Full-Time",               // fallback default
    baseSalary: {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": 0,
        "unitText": "MONTH"
      }
    },

    // Hiring Org
    hiringOrganization: {
      "@type": "Organization",
      name: hiringOrg?.value || "Recruiting Department",
      sameAs: job.officialLink || job.applyLink || ""
    },

    // Job Location
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: jobLoc?.value || "India",
        addressRegion: jobLoc?.value || "India",
        addressCountry: "IN"
      }
    },

    // Additional metadata
    applicantLocationRequirements: {
      "@type": "Country",
      name: "India"
    }
  };
}

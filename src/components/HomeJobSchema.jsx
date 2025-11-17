export default function HomeJobSchema({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  const jobList = jobs.slice(0, 6).map((job, index) => {
    const hiringOrg =
      job.extra_info?.find(x =>
        x.key.toLowerCase().includes("hiring organization")
      )?.value || "Government Organization";

    const jobLocation =
      job.extra_info?.find(x =>
        x.key.toLowerCase().includes("job location")
      )?.value || "India";

    return {
      "@type": "JobPosting",
      "position": index + 1,

      // Required fields
      "title": job.title_en || "Government Job",
      "description":
        job.description_en ||
        job.description_hi ||
        `Latest update: ${job.title_en} – visit ResultsHub.in for full details.`,

      "datePosted": job.startDate || new Date().toISOString(),
      "validThrough": job.lastDate || job.startDate || new Date().toISOString(),
      "employmentType": "FULL_TIME",

      // Hiring org
      "hiringOrganization": {
        "@type": "Organization",
        "name": hiringOrg,
        "url": job.officialLink || "https://resultshub.in",
        "logo": "https://resultshub.in/logo.png"
      },

      // Job Location
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": jobLocation,
          "addressRegion": jobLocation,
          "addressCountry": "IN"
        }
      },

      // Salary (optional)
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salary || "0",
          "unitText": "MONTH"
        }
      },

      "totalJobOpenings": Number(job.totalPosts) || 1,
      "url": `https://resultshub.in/jobs/${job.slug}`
    };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": jobList
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

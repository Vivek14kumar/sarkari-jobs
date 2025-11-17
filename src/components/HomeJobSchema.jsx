// components/HomeJobSchema.jsx
export default function HomeJobSchema({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  const jobList = jobs.slice(0, 4).map((job, index) => {
    const hiringOrg =
      job.extra_info?.find(x =>
        x.key.toLowerCase().includes("hiring organization")
      )?.value || "ResultsHub";

    const jobLocation =
      job.extra_info?.find(x =>
        x.key.toLowerCase().includes("job location")
      )?.value || "India";

    return {
      "@type": "JobPosting",
      "position": index + 1,
      "title": job.title_en,
      "description": job.description_en || job.description_hi ||  "Latest government job update by ResultsHub.",
      "datePosted": job.startDate,
      "validThrough": job.lastDate || job.startDate,
      "employmentType": "FULL_TIME",

      "hiringOrganization": {
        "@type": "Organization",
        "name": hiringOrg,
        "url": job.officialLink || "https://resultshub.in",
        "logo": "https://resultshub.in/logo.png"
      },

      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": jobLocation,
          "addressRegion": jobLocation,
          "addressCountry": "IN"
        }
      },

      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": "0",
          "unitText": "MONTH"
        }
      },

      "totalJobOpenings": Number(job.totalPosts) || 0,
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

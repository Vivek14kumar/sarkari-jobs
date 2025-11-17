// components/JobPostingSchema.jsx
export default function JobPostingSchema({ job }) {
  if (!job) return null;

  // Extract Hiring Organization
  const hiringOrg =
    job.extra_info?.find(x =>
      x.key.toLowerCase().includes("hiring organization")
    )?.value || "Govt Organization";

  // Extract Job Location
  const jobLocation =
    job.extra_info?.find(x =>
      x.key.toLowerCase().includes("job location")
    )?.value || "India";

  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",

    "title": job.title_en || job.title_hi,
    "description":
      job.description_en ||
      job.description_hi ||
      `${job.title_en} - Latest government job update.`,

    "datePosted": job.startDate,
    "validThrough": job.lastDate || job.startDate,
    "employmentType": "FULL_TIME",

    "hiringOrganization": {
      "@type": "Organization",
      "name": hiringOrg,
      "sameAs": job.officialLink || "https://resultshub.in",
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
        "value": 0,
        "unitText": "MONTH"
      }
    },

    "totalJobOpenings": Number(job.totalPosts) || 0,

    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "India"
    },

    "industry": job.category || "Government Job",
    "url": `https://resultshub.in/jobs/${job.slug}`
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

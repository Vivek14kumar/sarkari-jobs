export default function HomeJobSchema({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  const jobList = jobs.slice(0, 6).map((job, index) => {
    // -----------------------------
    // ⭐ SAFE FALLBACK HELPERS
    // -----------------------------
    const getISO = (d) => {
      if (!d) return new Date().toISOString().split("T")[0];
      const date = new Date(d);
      return isNaN(date) ? new Date().toISOString().split("T")[0] : date.toISOString().split("T")[0];
    };

    // Safe description (minimum ~50 words requirement)
    const makeDescription = () => {
      const desc = job.description_en || job.description_hi;
      if (desc && desc.length > 80) return desc;

      return `${job.title_en} - Read full notification including eligibility, age limit, syllabus, important dates, 
      application fee, selection process, exam pattern, salary details, total vacancies and how to apply online. 
      Get the official PDF and complete details on ResultsHub.in.`;
    };

    // Safe Hiring Organization
    const hiringOrg =
      job.extra_info?.find((x) =>
        x.key?.toLowerCase().includes("hiring organization")
      )?.value || "Government of India";

    // Safe Location
    const jobLocation =
      job.extra_info?.find((x) =>
        x.key?.toLowerCase().includes("location")
      )?.value || "India";

    return {
      "@type": "JobPosting",
      "position": index + 1,

      // -----------------------------
      // ⭐ REQUIRED FIELDS
      // -----------------------------
      "title": job.title_en || "Government Job",
      "description": makeDescription(),

      "datePosted": getISO(job.startDate),
      "validThrough": getISO(job.lastDate),

      // Employment Type (safe default)
      "employmentType":
        job.extra_info?.find((x) =>
          x.key?.toLowerCase().includes("employment")
        )?.value || "FULL_TIME",

      // -----------------------------
      // ⭐ Hiring Organization
      // -----------------------------
      "hiringOrganization": {
        "@type": "Organization",
        "name": hiringOrg,
        "url": job.officialLink || "https://resultshub.in",
        "logo": "https://resultshub.in/logo.png"
      },

      // -----------------------------
      // ⭐ Location (Required!)
      // -----------------------------
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": jobLocation,
          "addressRegion": jobLocation,
          "addressCountry": "IN"
        }
      },

      // -----------------------------
      // ⭐ OPTIONAL BUT VERY GOOD FOR SEO
      // -----------------------------
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salary || 0,
          "unitText": "MONTH"
        }
      },

      "totalJobOpenings": Number(job.totalPosts) || 1,
      "url": `https://resultshub.in/jobs/${job.slug}`
    };
  });

  // -----------------------------
  // ⭐ ItemList Wrapper (Correct!)
  // -----------------------------
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

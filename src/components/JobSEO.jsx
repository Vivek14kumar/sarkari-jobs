import Head from "next/head";

export default function JobSEO({ jobData }) {
  const datePosted = new Date(jobData.startDate).toISOString().split("T")[0];
  const validThrough = new Date(jobData.lastDate).toISOString().split("T")[0];

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            title: jobData.title_en,
            description: jobData.description_en,
            hiringOrganization: {
              "@type": "Organization",
              name:
                jobData.extra_info?.find(
                  (item) =>
                    item.key.toLowerCase().includes("hiring organization") ||
                    item.key.toLowerCase().includes("company")
                )?.value || "ResultsHub",
              sameAs: "https://resultshub.in/",
              logo: "https://resultshub.in/logo.png",
            },
            datePosted, // ✅ updated from startDate
            validThrough, // ✅ updated from lastDate
            employmentType:
              jobData.extra_info?.find((item) =>
                item.key.toLowerCase().includes("employment type")
              )?.value || "Full-time",
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality:
                  jobData.extra_info?.find((item) =>
                    item.key.toLowerCase().includes("job location")
                  )?.value || "India",
                addressCountry: "IN",
              },
            },
            identifier: {
              "@type": "PropertyValue",
              name: "ResultsHub",
              value: jobData._id,
            },
            directApply: true,
            hiringOrganizationDescription: "India’s trusted government job portal",
            applicantLocationRequirements: {
              "@type": "Country",
              name: "India",
            },
            url: `https://resultshub.in/jobs/${jobData.slug}`,
          }),
        }}
      />
    </Head>
  );
}

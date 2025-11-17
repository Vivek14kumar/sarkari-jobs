// HomeJobSchema.jsx
export default function HomeJobSchema({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  const listItems = jobs.slice(0, 6).map((job, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": job.title_en,
    "url": `https://resultshub.in/jobs/${job.slug}`
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": listItems
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

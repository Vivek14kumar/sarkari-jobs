import Head from "next/head";

export default function SEOHead({
  title = "ResultsHub.in - Latest Sarkari Results, Jobs & Admit Cards",
  description = "Get all the latest Sarkari Results, Government Jobs, Admit Cards, and Government Schemes at ResultsHub.in. Stay updated with daily job alerts and notifications.",
  keywords = "daa exam form fee, dda mts recruitment,Sarkari Result, Sarkari Naukri, Results Bharat Govt Jobs, Admit Card, Sarkari Exam, Government Schemes, Sarkari Result 2025",
  image = "/default-og-image.jpg", // place in /public folder
  url = "https://resultshub.in",
}) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ResultsHub.in" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical URL (for SEO ranking consistency) */}
      <link rel="canonical" href={url} />
    </Head>
  );
}

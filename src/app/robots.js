export const dynamic = "force-dynamic";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"], // block admin/api routes
      },
    ],
    sitemap: "https://resultshub.in/sitemap.xml",
    host: "https://resultshub.in",
  };
}

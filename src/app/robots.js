export const dynamic = "force-dynamic";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/jobs", "/api/result-admit","/api/yojna","/api/search"],
        disallow: ["/admin"], // block admin/api routes
      },
    ],
    sitemap: "https://resultshub.in/sitemap.xml",
    //host: "https://resultshub.in",
  };
}

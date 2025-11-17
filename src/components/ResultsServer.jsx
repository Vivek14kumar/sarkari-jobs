// components/ResultsServer.jsx
import ResultsClient from "./ResultsClient";

export default async function ResultsServer({ limit = 6 }) {
  let results = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/result-admit`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch results");

    const data = await res.json();
    results = data.filter(i => i.type?.toLowerCase() === "result").slice(0, limit);
  } catch (err) {
    console.error(err);
  }

  return <ResultsClient initialResults={results} />;
}

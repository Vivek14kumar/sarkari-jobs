// components/AdmitCardsServer.jsx
import AdmitCardsClient from "./AdmitCardsClient";

export default async function AdmitCardsServer({ limit = 6 }) {
  let admitCards = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/result-admit`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch admit cards");

    const data = await res.json();
    admitCards = data.filter(i => i.type?.toLowerCase() === "admit card").slice(0, limit);
  } catch (err) {
    console.error(err);
  }

  return <AdmitCardsClient initialCards={admitCards} />;
}

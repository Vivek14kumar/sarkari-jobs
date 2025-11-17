// components/YojnasServer.jsx
import YojnasClient from "./YojnasClient";

export default async function YojnasServer({ limit = 6 }) {
  let yojnas = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/yojna`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch yojnas");

    const data = await res.json();
    yojnas = data.slice(0, limit);
  } catch (err) {
    console.error(err);
  }

  return <YojnasClient initialYojnas={yojnas} />;
}

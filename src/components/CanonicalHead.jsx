"use client";
import Head from "next/head";
import { usePathname } from "next/navigation";

export default function CanonicalHead() {
  const pathname = usePathname();

  // Create canonical URL based on the current path
  const baseUrl = "https://resultshub.in";
  const canonicalUrl =
    pathname === "/" ? baseUrl : `${baseUrl}${pathname.replace(/\/$/, "")}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

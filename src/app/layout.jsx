import "./globals.css";
import { Inter } from "next/font/google";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Results Hub | Sarkari Results, Jobs & Admit Cards",
  description:
    "Get the latest Sarkari Results, Government Jobs, Admit Cards, and Schemes in English & Hindi at Results Hub. Stay updated daily!",
  keywords:
    "Sarkari Result, Sarkari Naukri, Govt Jobs, Sarkari Exam, Admit Card, Sarkari Results 2025, Government Schemes",
  openGraph: {
    title: "Results Hub - Sarkari Results & Jobs 2025",
    description:
      "Find the latest Government Jobs, Admit Cards, and Results at ResultsHub.in. Fast updates in English & Hindi.",
    url: "https://resultshub.in",
    siteName: "ResultsHub.in",
    images: [
      {
        url: "https://resultshub.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ResultsHub.in",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen`}>
        {/* Navbar wrapper handles client-side navbar switching */}
        <NavbarWrapper />

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />
         {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}

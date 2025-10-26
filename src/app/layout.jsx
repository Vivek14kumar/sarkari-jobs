import "./globals.css";
import { Inter } from "next/font/google";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Results Hub",
  description: "Latest Government Jobs, Results, Admit Cards in English & Hindi",
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
      </body>
    </html>
  );
}

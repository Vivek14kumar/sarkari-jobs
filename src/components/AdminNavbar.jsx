"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const [showMobileNav, setShowMobileNav] = useState(true);
  const router = useRouter();

  let lastScroll = 0;

  // Hide/show mobile nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        setShowMobileNav(false);
      } else {
        setShowMobileNav(true);
      }
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    console.log("Logging out"); // Debug
    localStorage.removeItem("adminToken"); // clear admin auth
    router.push("/admin");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:px-6">
        {/* Left Section (Logo + Title) */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/admin/dashboard")}
        >
          <img
            src="/logo.png"
            alt="Admin Panel"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
            Admin Panel
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4 text-black font-medium">
          <Link href="/admin/dashboard" className="hover:text-blue-800 transition">Dashboard</Link>
          <Link href="/admin/add-job" className="hover:text-blue-800 transition">Add Job</Link>
          <Link href="/admin/add-yojna" className="hover:text-blue-800 transition">Add Yojna</Link>
          <Link href="/admin/result-admit" className="hover:text-blue-800 transition">Add Result/Admit</Link>
          <button
            onClick={handleLogout}
            className="hover:bg-red-600 hover:text-white transition text-red-500 border rounded px-3 py-1"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Mobile Floating Nav */}
      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden transition-transform duration-300 ease-in-out ${
          showMobileNav ? "translate-y-0" : "translate-y-24"
        }`}
      >
        <div className="bg-blue-900 rounded-full shadow-lg px-5 py-3 flex justify-between items-center space-x-6">
          <Link href="/admin/dashboard" className="text-white text-sm font-medium">Dashboard</Link>
          <Link href="/admin/add-job" className="text-white text-sm font-medium">Add Job</Link>
          <Link href="/admin/add-yojna" className="text-white text-sm font-medium">Add Yojna</Link>
          <Link href="/admin/result-admit" className="text-white text-sm font-medium">Add Result/Admit</Link>
          <button
            onClick={handleLogout}
            className="text-white text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

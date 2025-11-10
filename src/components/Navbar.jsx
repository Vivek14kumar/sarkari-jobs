"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaSearch } from 'react-icons/fa';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // <-- detect current route

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

  // Fetch search suggestions dynamically
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };
    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (url) => {
    router.push(url);
    setSearchQuery("");
    setSuggestions([]);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Results", href: "/results" },
    { name: "Admit Cards", href: "/admit-cards" },
    { name: "Gov Scheme", href: "/yojna" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-3 px-4 md:px-6 space-y-3 md:space-y-0">
  {/* Left Section (Logo + Title) */}
  <div
    className="flex items-center space-x-2 cursor-pointer"
    onClick={() => router.push("/")}
  >
    <img
      src="/logo.png"
      alt="Results Hub"
      className="w-9 h-9 object-contain"
    />
    <h1 className="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
      Results Hub
    </h1>
  </div>

  {/* Search Bar (Visible Below Logo on Mobile, Inline on Desktop) */}
  <div className="w-full md:w-auto flex flex-1 md:mx-6 relative">
    <input
      type="text"
      placeholder="Search jobs, results..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      className="w-full border border-gray-300 rounded-l-full py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm md:text-base"
    />
    <button
      onClick={handleSearch}
      className="bg-blue-600 text-white px-4 md:px-5 rounded-r-full hover:bg-blue-700 transition-shadow shadow hover:shadow-md text-sm md:text-base"
    >
      <FaSearch />
    </button>

    {suggestions.length > 0 && (
      <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-lg mt-1 rounded-lg max-h-64 overflow-auto z-50">
        {suggestions.map((item, index) => (
          <li
            key={index}
            onClick={() => handleSelectSuggestion(item.url)}
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex justify-between items-center transition"
          >
            <span>{item.name}</span>
            <span className="text-xs text-gray-500">{item.type}</span>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Desktop Menu */}
  <nav className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`transition ${
          pathname === link.href
            ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
            : "hover:text-blue-600"
        }`}
      >
        {link.name}
      </Link>
    ))}
  </nav>
</div>


      {/* Mobile Floating Nav */}
      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden transition-transform duration-300 ease-in-out ${
          showMobileNav ? "translate-y-0" : "translate-y-24"
        }`}
      >
        <div className="bg-gray-900 rounded-full shadow-lg px-5 py-5 flex justify-between items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href
                  ? "text-blue-400 font-semibold"
                  : "text-white hover:text-blue-300"
              }`}
            >
              {link.name.split(" ")[0]} {/* Short name for mobile */}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

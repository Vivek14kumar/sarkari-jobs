"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaExternalLinkAlt, FaSearch } from "react-icons/fa";
import SEOHead from "@/components/SEOHead";
import Canonical from "@/components/Canonical";

const ResultPage = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/result-admit");
        const resultData = res.data.filter((item) => item.type === "Result");
        setResults(resultData);
        setFilteredResults(resultData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  useEffect(() => {
    let filtered = results;
    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (item) => item.category && item.category === categoryFilter
      );
    }
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title_hi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredResults(filtered);
  }, [searchTerm, categoryFilter, results]);

  const categories = ["All", ...new Set(results.map((item) => item.category))];

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow animate-pulse border border-gray-100 p-5 flex flex-col justify-between">
      <div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="h-9 bg-gray-200 rounded mt-6"></div>
    </div>
  );

  // NEW Badge: posted within last 7 days
  const isNew = (postDate) => {
    if (!postDate) return false;
    const today = new Date();
    const post = new Date(postDate);
    const diffTime = Math.abs(today - post);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // LIVE Badge: currently active (use startDate <= today <= endDate)
  const isLive = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return today >= start && today <= end;
  };

  return (
    <>
    <head>
      <Canonical url={`https://resultshub.in/results`}/>
    </head>
    <SEOHead
        title="Latest Sarkari Results 2025 | Government Exam Results | ResultsHub.in"
        description="Check all latest Sarkari Results 2025 including SSC, UPSC, Railway, Bank, Police, and other government exam results in English and Hindi at ResultsHub.in."
        keywords="Sarkari Result 2025, Government Results, Exam Results, SSC Result, UPSC Result, Railway Result, Bank Result, Police Result, Sarkari Exam, Resultshub"
        image="https://resultshub.in/og-image.png"
      />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 tracking-tight drop-shadow-sm">
          🎯 Results
        </h1>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-lg rounded-2xl p-4 mb-8 gap-4 border border-gray-100">
          <div className="relative w-full sm:w-1/2">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or Hindi name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results / Loader */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center text-gray-500 py-16 text-lg">
            No Results Found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResults.map((result) => (
              <div
                key={result._id}
                className="relative group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient glow overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 transition-opacity duration-500"></div>

                <div className="p-6 relative z-10">
                  {/* NEW Badge */}
                  {isNew(result.postDate) && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg z-20">
                      NEW
                    </div>
                  )}

                  {/* LIVE Badge */}
                  {isLive(result.startDate, result.endDate) && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg z-20">
                      LIVE
                    </div>
                  )}

                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition">
                    {result.title_en}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {result.title_hi}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-full shadow-sm">
                      {result.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      📅 {result.postDate ? new Date(result.postDate).toLocaleDateString("en-GB").replace(/\//g, "-"):"Date N/A"}
                    </span>
                  </div>
                </div>

                <div className="border-t p-4 bg-gray-50 flex justify-center relative z-10">
  {result.link && result.postDate ? (
    <Link
      href={result.link}
      target="_blank"
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition duration-300 font-semibold shadow-md"
    >
      View Result <FaExternalLinkAlt size={14} />
    </Link>
  ) : (
    <button
      disabled
      className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-700 py-2 rounded-xl cursor-not-allowed font-semibold shadow-md"
    >
      Update Soon...
    </button>
  )}
</div>


                {/* Subtle corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-300/30 to-transparent rounded-bl-full blur-2xl group-hover:opacity-70 opacity-0 transition-all duration-700"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ResultPage;

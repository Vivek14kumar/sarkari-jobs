"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import Canonical from "@/components/Canonical";

export default function YojnaListPage() {
  const [yojnas, setYojnas] = useState([]);
  const [filteredYojnas, setFilteredYojnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchYojnas() {
      try {
        const res = await fetch("/api/yojna");
        const data = await res.json();
        setYojnas(data);
        setFilteredYojnas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchYojnas();
  }, []);

  const categories = ["All", ...new Set(yojnas.map((y) => y.category).filter(Boolean))];

  useEffect(() => {
    let result = yojnas;

    if (selectedCategory !== "All") {
      result = result.filter((y) => y.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (y) =>
          y.title_en?.toLowerCase().includes(query) ||
          y.title_hi?.toLowerCase().includes(query)
      );
    }

    setFilteredYojnas(result);
  }, [searchQuery, selectedCategory, yojnas]);

  if (loading)
    return (
      <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-72"></div>
        ))}
      </main>
    );

  return (
    <>
    <head>
      <Canonical url={`https://resultshub.in/yojna`}/>
    </head>
    
     <SEOHead
        title="Government Schemes 2025 | Sarkari Yojana | Results Hub"
        description="Get the latest updates on all Government Schemes (Sarkari Yojana) in India. Check eligibility, benefits, and application links for central and state yojanas at ResultsHub.in."
        keywords="Government Schemes 2025, Sarkari Yojana, PM Kisan, Ayushman Bharat, PM Awas Yojana, Beti Bachao Beti Padhao, PMEGP, Government Schemes in India, Resultshub"
        image="https://resultshub.in/og-image.png" // optional
      />
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-10">
        🌿 Sarkari Yojnas
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
        <input
          type="text"
          placeholder="🔍 Search Yojna by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-2/3 px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none shadow-sm transition-all duration-300 hover:shadow-md"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/3 px-5 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-green-500 outline-none shadow-sm transition-all duration-300 hover:shadow-md"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      {filteredYojnas.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10 italic animate-pulse">
          😔 No Yojnas match your search or filter.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredYojnas.map((y) => (
            <Link
              key={y._id}
              href={`/yojna/${y.slug || y._id}`}
              className="group relative block rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-green-50 to-green-100"
            >
              {/* Thumbnail */}
              {y.thumbnail ? (
                <div className="h-45 w-full overflow-hidden relative">
                  <img
                    src={y.thumbnail}
                    alt={y.title_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                    width={1280}
                    height={720}
                  />
                  
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white text-xl font-bold">
                  No Image
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-800 transition-colors">
                  {y.title_en}
                </h2>
                <h3 className="text-sm text-gray-600 italic">{y.title_hi}</h3>
                <p className="mt-3 text-gray-700 line-clamp-3 text-sm leading-relaxed">
                  {y.description_en}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-green-700 font-semibold hover:underline cursor-pointer">
                    Read More →
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(y.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
    </>
  );
}

'use client';
import { useState } from "react";
import Link from "next/link";

export default function ResultsClient({ initialResults = [] }) {
  const [results, setResults] = useState(initialResults);
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleItems = results.slice(0, visibleCount);

  if (!results.length) return <p className="text-center py-10 text-gray-500">No Results found.</p>;

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleItems.map((item) => {
          const postDate = item.postDate || item.createdAt;
          const isNew = postDate && (new Date() - new Date(postDate)) / (1000*60*60*24) <= 7;
          const buttonHref = item.link?.trim() ? item.link : "/results";

          return (
            <div key={item._id} className="relative group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Hover Gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 transition-opacity duration-500"></div>

              {/* Badges */}
              {isNew && <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg text-center">NEW</div>}

              {/* Content */}
              <div className="p-5 relative z-10 top-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700">{item.title_en}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.title_hi}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800 px-2 py-1 rounded-full shadow-sm">{item.category || "Result"}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">📅 {postDate ? new Date(postDate).toLocaleDateString("en-GB").replace(/\//g, "-") : "Date N/A"}</span>
                </div>
              </div>

              {/* Button */}
              <div className="border-t p-4 bg-gray-50 flex justify-center relative z-10">
                <Link href={buttonHref} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold shadow-md transition duration-300">
                  View Result
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < results.length && (
        <div className="flex justify-center mt-6">
          <button onClick={() => setVisibleCount(prev => prev + 6)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-semibold shadow">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

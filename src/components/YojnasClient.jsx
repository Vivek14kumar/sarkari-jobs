'use client';
import { useState } from "react";
import Link from "next/link";

export default function YojnasClient({ initialYojnas = [] }) {
  const [yojnas, setYojnas] = useState(initialYojnas);
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleItems = yojnas.slice(0, visibleCount);

  if (!yojnas.length) return <p className="text-center py-10 text-gray-500">No Yojnas found.</p>;

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleItems.map((item) => {
          const postDate = item.createdAt;
          const isNew = postDate && (new Date() - new Date(postDate)) / (1000*60*60*24) <= 7;
          const buttonHref = `/yojna/${item.slug || item._id}`;

          return (
            <Link
              key={item._id}
              href={buttonHref}
              className="relative group block rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-transform duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              {(item.image || item.thumbnail) ? (
                <div className="relative w-full h-46 overflow-hidden">
                  <img
                    src={item.image || item.thumbnail}
                    alt={item.title_en || "Sarkari Yojana"}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}

              {/* Title */}
              <div className="p-4 text-center relative z-10 -mt-6 top-2">
                <h3 className="font-extrabold text-lg sm:text-2xl drop-shadow-lg mb-1 line-clamp-2">{item.title_en}</h3>
                <p className="text-xl sm:text-base drop-shadow-md line-clamp-2">{item.title_hi}</p>
              </div>

              {/* New Ribbon */}
              {isNew && <div className="absolute bottom-3 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-tr-xl rounded-br-xl shadow-lg">NEW</div>}

              {/* Hover Shadow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          );
        })}
      </div>

      {visibleCount < yojnas.length && (
        <div className="flex justify-center mt-6">
          <button onClick={() => setVisibleCount(prev => prev + 6)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2 rounded-xl font-semibold shadow">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

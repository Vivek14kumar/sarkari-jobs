// BreakingNewsBar.jsx
"use client";

import React from "react";
import Link from "next/link";

export default function BreakingNewsBar({ notifications }) {
  return (
    <div className="bg-red-600 text-white py-2 px-4 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {notifications.map((item, index) => (
          <Link
  key={index}
  href={`/jobs/${item._id}`}
  className="mx-4 hover:underline font-medium text-white hover:text-yellow-200 transition"
>
  {item.title_en || item.title_hi}
</Link>

        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

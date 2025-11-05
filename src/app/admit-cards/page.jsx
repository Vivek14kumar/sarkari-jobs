"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import SEOHead from "@/components/SEOHead";

const AdmitCardPage = () => {
  const [admitCards, setAdmitCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmitCards = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/result-admit");
        const admitData = res.data.filter((item) => item.type === "Admit Card");
        setAdmitCards(admitData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admit cards:", error);
        setLoading(false);
      }
    };
    fetchAdmitCards();
  }, []);

  // NEW Badge: posted within last 7 days
  const isNew = (postDate) => {
    if (!postDate) return false;
    const today = new Date();
    const post = new Date(postDate);
    const diffTime = Math.abs(today - post);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow animate-pulse border border-gray-100 p-6 flex flex-col justify-between min-h-[300px]">
      <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
      <div className="flex justify-between mt-auto">
        <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
      </div>
      <div className="mt-4 h-10 bg-gray-300 rounded w-full"></div>
      <div className="mt-2 h-10 bg-gray-300 rounded w-full"></div>
    </div>
  );

  return (
    <>
    <SEOHead
        title="Sarkari Admit Card 2025 | Download Exam Hall Tickets | ResultsHub.in"
        description="Download Sarkari Admit Cards 2025 for SSC, UPSC, Railway, Bank, Police, and other government exams. Get official exam date, hall ticket, and instructions at ResultsHub.in."
        keywords="Sarkari Result, Sarkari Admit Card 2025, Government Exam Admit Card, SSC Admit Card, UPSC Hall Ticket, Railway Admit Card, Police Exam Admit Card, Sarkari Exam, Resultshub"
        image="https://resultshub.in/og-image.png"
      />
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-8 tracking-tight drop-shadow-sm">
          🎫 Admit Cards
        </h1>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : admitCards.length === 0 ? (
          <div className="text-center text-gray-500 py-16 text-lg">
            No Admit Cards Found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {admitCards.map((card) => (
              <div
                key={card._id}
                className="relative group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-full"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-400/10 via-teal-400/10 to-blue-400/10 transition-opacity duration-500"></div>

                <div className="p-6 relative z-10 flex-1 flex flex-col justify-between min-h-[220px]">
                  {/* NEW Badge */}
                  {isNew(card.postDate) && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg z-20">
                      NEW
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition">
                      {card.title_en}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {card.title_hi}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="text-xs font-medium bg-gradient-to-r from-green-100 to-teal-200 text-green-800 px-2 py-1 rounded-full shadow-sm">
                      {card.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      📅 {card.postDate
                          ? new Date(card.postDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                          : "Date N/A"}
                    </span>
                  </div>
                </div>

                <div className="border-t p-4 bg-gray-50 flex flex-col gap-3 justify-center relative z-10">
                  {card.link ? (
                    <Link
                      href={card.link}
                      target="_blank"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-xl hover:from-teal-700 hover:to-green-700 transition duration-300 font-semibold shadow-md"
                    >
                      Download Admit Card <FaExternalLinkAlt size={14} />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-600 py-2 rounded-xl font-semibold shadow-inner cursor-not-allowed"
                    >
                      Download Admit Card <FaExternalLinkAlt size={14} />
                    </button>
                  )}

                  <Link
                    href={`/admit-cards/${card._id}`}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl hover:from-indigo-600 hover:to-blue-500 transition duration-300 font-semibold shadow-md"
                  >
                    View More
                  </Link>
                </div>

                {/* Subtle corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-300/30 to-transparent rounded-bl-full blur-2xl group-hover:opacity-70 opacity-0 transition-all duration-700"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AdmitCardPage;

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
//import Canonical from "@/components/Canonical";

const AdmitCardDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchCard = async () => {
      try {
        // ✅ Use either slug or id directly from params
        const identifier = params.slug || params.id;

        if (!identifier) return;

        // ✅ Hit backend route that supports both slug & id
        const res = await axios.get(`/api/result-admit/${identifier}`);
        setCard(res.data);
      } catch (err) {
        console.error("Error fetching admit card:", err);
        setCard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [params.slug, params.id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!card) return <div className="text-center py-20">Admit Card Not Found</div>;

  return (
    <>
    {/*<head>
      <Canonical url={`https://resultshub.in/admit-cards/${slug}`}/>
    </head>*/}
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-green-50 via-white to-teal-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{card.title_en}</h1>
        <p className="text-gray-700 mb-4">{card.title_hi}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full shadow-sm">
            {card.category}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            📅 {card.postDate
                ? new Date(card.postDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                : "Date N/A"}
          </span>
        </div>

        {card.extraInfo && card.extraInfo.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Details:</h2>
            <ul className="list-disc list-inside space-y-1">
              {card.extraInfo.map((info) => (
                <li key={info._id}>
                  <span className="font-medium">{info.key}:</span>{" "}
                  {info.value.startsWith("http") ? (
                    <a
                      href={info.value}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Click Here
                    </a>
                  ) : (
                    info.value
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {card.link && (
          <div className="mt-6">
            <a
              href={card.link}
              target="_blank"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Download Admit Card
            </a>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="mt-4 inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Go Back
        </button>
      </div>
    </div>
    </>
  );
};

export default AdmitCardDetails;

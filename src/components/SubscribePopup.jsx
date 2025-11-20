"use client";
import { useEffect, useState } from "react";
import { initFirebase, requestNotificationToken } from "@/lib/firebase";

export default function SubscribePopup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
  initFirebase();

  // 1) Do not show if already subscribed
  if (localStorage.getItem("notif-subscribed") === "1") return;

  // 2) Do not show on certain pages
  const blockedPages = ["/privacy", "/terms", "/contact"];
  if (blockedPages.includes(window.location.pathname)) return;

  // 3) If browser notifications already enabled → no popup
  if (Notification.permission === "granted") return;

  // 4) Limit popup to 3 times per day
  const viewData = JSON.parse(localStorage.getItem("notif-views") || "{}");
  const today = new Date().toDateString();

  if (viewData.date === today && viewData.count >= 3) return;

  // 5) Show again after 2 hours if Later was clicked
  const next = localStorage.getItem("notif-next-popup");
  const now = Date.now();

  if (next && now < Number(next)) return;

  // 6) Update popup view counter
  const updated = {
    date: today,
    count: viewData.date === today ? viewData.count + 1 : 1,
  };
  localStorage.setItem("notif-views", JSON.stringify(updated));

  setTimeout(() => setOpen(true), 1000);
}, []);


  const handleSubscribe = async () => {
  try {
    setStatus("asking");

    // Ask permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("denied");
      return;
    }

    // Immediately show "subscribing..." to user
    setStatus("fetching-token");

    // FAST: token creation starts immediately
    const tokenPromise = requestNotificationToken();

    // Don’t wait for popup close, only close after success
    const token = await tokenPromise;

    if (!token) {
      setStatus("error");
      return;
    }

    // FAST: send to backend (non-blocking)
    fetch("/api/saveToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    // Save status
    localStorage.setItem("notif-subscribed", "1");

    setStatus("subscribed");

    // Close after 500ms (feel instant)
    setTimeout(() => setOpen(false), 500);

  } catch (error) {
    console.log("Subscribe error:", error);
    setStatus("error");
  }
};


  const handleClose = () => {
  const nextTime = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
  localStorage.setItem("notif-next-popup", nextTime);
  setOpen(false);
};


  if (!open) return null;

  return (
  <div className="fixed top-0 inset-x-0 z-50 flex justify-center animate-slideDown">
    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl mx-auto 
      border-b border-gray-200 dark:border-gray-700 shadow-md rounded-b-3xl 
      px-5 py-4 flex items-start gap-4">

      {/* Icon */}
      <div className="p-2 rounded-xl bg-blue-600/10">
        <img src="/bell.svg" className="w-8 h-8" />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Get Instant Government Jobs, Yojna, Admit Cards, Results Alerts  
        </h3>

        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-snug">
          सरकारी नौकरी, योजना, एडमिट कार्ड, रिजल्ट — सबकुछ सबसे पहले पाएं!  
        </p>

        {/* Buttons */}
        <div className="mt-3 flex gap-3">
          <button
            onClick={handleSubscribe}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
            text-white text-sm font-semibold shadow-md shadow-blue-600/20 
            hover:opacity-90 transition-all"
          >
            {status === "asking" ? "Requesting..." : "Allow Notifications"}
          </button>

          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border text-sm text-gray-700 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Later
          </button>
        </div>

        {/* Status Messages */}
        {status === "denied" && (
          <p className="mt-2 text-xs text-red-600">
            Notifications blocked — enable manually.  
            (आपने Allow नहीं किया)
          </p>
        )}

        {status === "fetching-token" && (
          <p className="mt-2 text-xs text-blue-600">
            Subscribing… please wait 1 sec
          </p>
        )}

        {status === "subscribed" && (
          <p className="mt-2 text-xs text-green-600 font-medium">
            You're subscribed — Thank you! ❤️  
            (आप सफलतापूर्वक जुड़ गए)
          </p>
        )}
      </div>
    </div>

    {/* Animations */}
    <style>{`
      .animate-slideDown {
        animation: slideDown 0.45s ease-out;
      }
      @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `}</style>
  </div>
);

}

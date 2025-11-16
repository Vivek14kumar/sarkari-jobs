"use client";
import { useEffect, useState } from "react";
import { initFirebase, requestNotificationToken } from "@/lib/firebase";

export default function SubscribePopup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    initFirebase();
    // show popup to users who haven't dismissed (simple: show once)
    const dismissed = localStorage.getItem("notif-dismissed");
    if (!dismissed) setTimeout(() => setOpen(true), 1200);
  }, []);

  const handleSubscribe = async () => {
  setStatus("asking");

  // ⚠ MUST BE FIRST — inside user click
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    setStatus("denied");
    return;
  }

  // Now safe to request FCM token
  const token = await requestNotificationToken();

  if (!token) {
    setStatus("denied");
    return;
  }

  const res = await fetch("/api/saveToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (res.ok) {
    setStatus("subscribed");
    localStorage.setItem("notif-dismissed", "1");
    setTimeout(() => setOpen(false), 900);
  } else {
    setStatus("error");
  }
};

  const handleClose = () => {
    localStorage.setItem("notif-dismissed", "1");
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

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 max-w-md w-11/12 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <img src="/icons/bell.svg" alt="alerts" className="w-14 h-14"/>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Get Instant Job Alerts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Tap <strong>Allow</strong> so you never miss high paying government jobs.</p>

            <div className="mt-4 flex gap-3">
              <button onClick={handleSubscribe} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium">
                {status === "asking" ? "Waiting..." : "Allow Notification"}
              </button>
              <button onClick={handleClose} className="py-2 px-4 rounded-xl border">Maybe Later</button>
            </div>

            {status === "denied" && <p className="mt-2 text-xs text-red-600">You denied notifications. Ask users to enable from browser settings.</p>}
            {status === "subscribed" && <p className="mt-2 text-xs text-green-600">You're subscribed — thank you!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

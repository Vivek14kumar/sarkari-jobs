"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("✔ SW Registered"))
        .catch((err) =>
          console.error("❌ SW registration error:", err)
        );
    }
  }, []);

  return null;
}

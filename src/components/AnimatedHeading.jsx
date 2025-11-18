"use client";

import { useState, useEffect } from "react";

export default function AnimatedHeading() {
  const headings = [
    "Welcome to Results Hub",
    "रिजल्ट हब में आपका स्वागत है"
  ];

  const [currentHeading, setCurrentHeading] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setCurrentHeading((prev) => (prev + 1) % headings.length);
        setAnimate(true);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1
      className={`text-4xl text-blue-800 font-bold text-center mb-10 transform transition-all duration-500 ${
        animate
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-3"
      }`}
    >
      {headings[currentHeading]}
    </h1>
  );
}

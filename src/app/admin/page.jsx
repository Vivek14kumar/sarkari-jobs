"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function AdminLogin() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded admin credentials
    if (email === "admin@sarkari.com" && password === "admin123") {
      // Save login status in localStorage
      localStorage.setItem("adminToken", "loggedIn");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

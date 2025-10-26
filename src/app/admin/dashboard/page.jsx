"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import useAdminAuth from "../hooks/useAdminAuth";

export default function AdminDashboard() {
  useAdminAuth();
  const [jobs, setJobs] = useState([]);
  const [yojna, setYojna] = useState([]);
  const [results, setResults] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ---------- Route Protection ----------
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin"); // redirect to login if not logged in
    }
  }, [router]);

  // ---------- Fetch Dashboard Data ----------
  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, yojnaRes, resultAdmitRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/yojna"),
          fetch("/api/result-admit"),
        ]);

        const [jobsData, yojnaData, resultAdmitData] = await Promise.all([
          jobsRes.json(),
          yojnaRes.json(),
          resultAdmitRes.json(),
        ]);

        const resultData = resultAdmitData.filter((r) => r.type === "Result");
        const admitData = resultAdmitData.filter((r) => r.type === "Admit Card");

        setJobs(jobsData);
        setYojna(yojnaData);
        setResults(resultData);
        setAdmitCards(admitData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <>
      <SEOHead
        title="Admin Dashboard | Sarkari Portal"
        description="Manage Jobs, Results, Admit Cards, and Yojna"
      />

      

      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard title="Total Jobs" count={jobs.length} color="text-blue-700" />
          <SummaryCard title="Total Sarkari Yojna" count={yojna.length} color="text-green-600" />
          <SummaryCard title="Total Results" count={results.length} color="text-purple-600" />
          <SummaryCard title="Total Admit Cards" count={admitCards.length} color="text-orange-600" />
        </div>

        {/* Add Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          <AddButton href="/admin/add-job" title="Add Job" color="bg-blue-700" />
          <AddButton href="/admin/add-yojna" title="Add Yojna" color="bg-green-600" />
          <AddButton href="/admin/result-admit" title="Add Result / Admit" color="bg-purple-600" />
        </div>

        {/* Tables */}
        <DataTable
          title="Recent Jobs"
          data={jobs}
          keys={["_id", "title_en", "category"]}
          viewAllLink="/admin/manage-jobs"
          search={search}
          setSearch={setSearch}
        />
        <DataTable
          title="Recent Results"
          data={results}
          keys={["_id", "title_en", "category"]}
          viewAllLink="/admin/manage-results"
          search={search}
          setSearch={setSearch}
        />
        <DataTable
          title="Recent Admit Cards"
          data={admitCards}
          keys={["_id", "title_en", "category"]}
          viewAllLink="/admin/manage-admit"
          search={search}
          setSearch={setSearch}
        />
        <DataTable
          title="Recent Sarkari Yojna"
          data={yojna}
          keys={["_id", "title_en"]}
          viewAllLink="/admin/manage-yojna"
          search={search}
          setSearch={setSearch}
        />
      </main>
    </>
  );
}

/* ----------------- Sub Components ----------------- */

function SummaryCard({ title, count, color }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className={`text-3xl font-bold ${color}`}>{count}</p>
    </div>
  );
}

function AddButton({ href, title, color }) {
  return (
    <Link
      href={href}
      className={`${color} hover:opacity-90 text-white shadow-lg rounded-xl p-6 flex flex-col items-center transition`}
    >
      <h2 className="text-sm mb-2">{title}</h2>
      <p className="text-2xl font-bold">+</p>
    </Link>
  );
}

function DataTable({ title, data, keys, viewAllLink, search, setSearch }) {
  const filteredData = data.filter((item) =>
    keys.some((key) =>
      item[key]?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <section className="bg-white shadow-md rounded-xl p-6 mb-10 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 rounded w-full sm:w-1/3"
      />

      {filteredData.length === 0 ? (
        <p className="text-gray-500 text-sm">No records found.</p>
      ) : (
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-gray-100">
              {keys.map((key) => (
                <th key={key} className="py-2 px-4 border-b capitalize">
                  {key === "_id" ? "ID" : key.replace("_", " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 5).map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                {keys.map((key) => (
                  <td key={key} className="py-2 px-4 border-b truncate max-w-[250px]">
                    {item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

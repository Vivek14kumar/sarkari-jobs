"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdmitCardPage() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      const res = await axios.get("/api/exams");
      setExams(res.data);
    };
    fetchExams();
  }, []);

  const filtered = exams.filter(exam =>
    exam.exam_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admit Cards & Answer Keys</h1>
      <input
        type="text"
        placeholder="Search Exam"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {filtered.map((exam) => (
        <div key={exam._id} className="p-4 bg-white rounded shadow mb-4 flex justify-between items-center">
          <div>
            <h2 className="font-bold">{exam.exam_name}</h2>
            <p className="text-sm text-gray-500">Release Date: {new Date(exam.release_date).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <a href={exam.admit_card_link} target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800">
              Admit Card
            </a>
            <a href={exam.answer_key_link} target="_blank" rel="noopener noreferrer" className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800">
              Answer Key
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

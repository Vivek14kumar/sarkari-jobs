"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import Swal from "sweetalert2";
import Link from "next/link";
import useAdminAuth from "../hooks/useAdminAuth";

const AdminResultAdmitCard = () => {
  useAdminAuth();

  const [formData, setFormData] = useState({
    type: "Result",
    title_en: "",
    title_hi: "",
    category: "",
    postDate: "",
    link: "",
    extraInfo: [],
  });

  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  // ✅ Fetch all records
  const fetchRecords = async () => {
    try {
      const res = await axios.get("/api/result-admit");
      setRecords(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle extra info field changes
  const handleExtraChange = (index, field, value) => {
    const updated = [...formData.extraInfo];
    updated[index][field] = value;
    setFormData({ ...formData, extraInfo: updated });
  };

  // ✅ Add new extra info field
  const addExtraField = () => {
    setFormData({
      ...formData,
      extraInfo: [...formData.extraInfo, { key: "", value: "" }],
    });
  };

  // ✅ Remove extra info field
  const removeExtraField = (index) => {
    const updated = formData.extraInfo.filter((_, i) => i !== index);
    setFormData({ ...formData, extraInfo: updated });
  };

  // ✅ Submit form (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/result-admit?id=${editId}`, formData);
        Swal.fire("Updated!", "Record updated successfully!", "success");
      } else {
        await axios.post("/api/result-admit", formData);
        Swal.fire("Added!", `${formData.type} added successfully!`, "success");
      }

      // Reset
      setFormData({
        type: "Result",
        title_en: "",
        title_hi: "",
        category: "",
        postDate: "",
        link: "",
        extraInfo: [],
      });
      setEditId(null);
      fetchRecords();
    } catch (err) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // ✅ Edit record
  const handleEdit = (item) => {
    setFormData({
      type: item.type,
      title_en: item.title_en,
      title_hi: item.title_hi,
      category: item.category,
      postDate: item.postDate,
      link: item.link,
      extraInfo: item.extraInfo || [],
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete record
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/result-admit?id=${id}`);
        Swal.fire("Deleted!", "Record deleted successfully.", "success");
        fetchRecords();
      } catch (err) {
        Swal.fire("Error", "Failed to delete record!", "error");
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        {editId ? "Edit Result / Admit Card" : "Add Result / Admit Card"}
      </h2>

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-md"
      >
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Result">Result</option>
          <option value="Admit Card">Admit Card</option>
        </select>

        <input
          type="text"
          name="title_en"
          value={formData.title_en}
          onChange={handleChange}
          placeholder="Title (English)"
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="title_hi"
          value={formData.title_hi}
          onChange={handleChange}
          placeholder="Title (Hindi)"
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category (e.g. UP, Bihar)"
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="postDate"
          value={formData.postDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="Official Website / Download Link"
          className="border p-2 rounded"
        />

        {/* ✅ Extra Info Section */}
        <div className="col-span-2 border rounded-lg p-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-blue-600">Extra Information</h3>
            <button
              type="button"
              onClick={addExtraField}
              className="flex items-center gap-2 bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
            >
              <FaPlus /> Add
            </button>
          </div>

          {formData.extraInfo.length === 0 ? (
            <p className="text-gray-500 text-sm">No extra info added yet.</p>
          ) : (
            formData.extraInfo.map((info, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-2 mb-2 items-center"
              >
                <input
                  type="text"
                  value={info.key}
                  onChange={(e) =>
                    handleExtraChange(index, "key", e.target.value)
                  }
                  placeholder="Field Name (e.g. Exam Date)"
                  className="border p-2 rounded text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={info.value}
                    onChange={(e) =>
                      handleExtraChange(index, "value", e.target.value)
                    }
                    placeholder="Field Value (e.g. 10 Nov 2025)"
                    className="border p-2 rounded text-sm flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtraField(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          type="submit"
          className={`col-span-2 ${
            editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded transition`}
        >
          {editId ? "Update Record" : `Save ${formData.type}`}
        </button>
      </form>

      <Link
        href="/admin/dashboard"
        className="text-green-600 hover:underline inline-block mt-4"
      >
        ← Back to Dashboard
      </Link>

      {/* ✅ Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">All Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="border p-2">Type</th>
                <th className="border p-2">Title (EN)</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item._id} className="text-sm">
                  <td className="border p-2">{item.type}</td>
                  <td className="border p-2">{item.title_en}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.postDate}</td>
                  <td className="border p-2 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-3">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminResultAdmitCard;

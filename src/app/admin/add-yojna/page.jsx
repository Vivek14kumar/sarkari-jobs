"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAdminAuth from "../hooks/useAdminAuth";

export default function AddYojnaPage() {
  useAdminAuth();

  const emptyYojna = {
    title_en: "",
    title_hi: "",
    description_en: "",
    description_hi: "",
    eligibility: [""],
    links: [{ type: "Apply Link", url: "" }, { type: "Official Link", url: "" }],
    documents: [""],
    faq: [{ question: "", answer: "" }],
    otherDetails: [""],
    thumbnail: null,
  };

  const [yojnaData, setYojnaData] = useState(emptyYojna);
  const [yojnas, setYojnas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==============================
  // 🔹 Fetch all Yojnas
  // ==============================
  const fetchYojnas = async () => {
    try {
      const res = await fetch("/api/yojna");
      const data = await res.json();
      if (res.ok) setYojnas(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchYojnas();
  }, []);

  // ==============================
  // 🔹 Handlers for Input / Array
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setYojnaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const updatedArray = [...yojnaData[arrayName]];
    if (typeof updatedArray[index] === "object") {
      updatedArray[index][field] = value;
    } else {
      updatedArray[index] = value;
    }
    setYojnaData((prev) => ({ ...prev, [arrayName]: updatedArray }));
  };

  const handleAddField = (arrayName, template = "") => {
    setYojnaData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template],
    }));
  };

  const handleRemoveField = (arrayName, index) => {
    const updatedArray = [...yojnaData[arrayName]];
    updatedArray.splice(index, 1);
    setYojnaData((prev) => ({ ...prev, [arrayName]: updatedArray }));
  };

  const handleDragEnd = (result, arrayName) => {
    if (!result.destination) return;
    const items = Array.from(yojnaData[arrayName]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setYojnaData((prev) => ({ ...prev, [arrayName]: items }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) setYojnaData((prev) => ({ ...prev, thumbnail: file }));
  };

  // ==============================
  // 🔹 Submit (Add / Update)
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataToSend = { ...yojnaData };

      // Convert thumbnail to base64 if file selected
      if (yojnaData.thumbnail instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(yojnaData.thumbnail);
        reader.onloadend = async () => {
          dataToSend.thumbnail = reader.result;
          await saveYojna(dataToSend);
        };
      } else {
        await saveYojna(dataToSend);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveYojna = async (dataToSend) => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/yojna/${editingId}` : "/api/yojna";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const responseData = await res.json();

    if (res.ok) {
      alert(editingId ? "Yojna updated!" : "Yojna added successfully!");
      resetForm();
      fetchYojnas();
    } else {
      alert(responseData.error || "Something went wrong");
    }
  };

  // ==============================
  // 🔹 Delete Yojna
  // ==============================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Yojna?")) return;
    try {
      const res = await fetch(`/api/yojna/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Yojna deleted!");
        fetchYojnas();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // 🔹 Edit Yojna
  // ==============================
  const handleEdit = (yojna) => {
    setYojnaData(yojna);
    setEditingId(yojna._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==============================
  // 🔹 Reset Form
  // ==============================
  const resetForm = () => {
    setYojnaData(emptyYojna);
    setEditingId(null);
  };

  // ==============================
  // 🔹 Render Section Function
  // ==============================
  const renderSection = (title, arrayName, isObject = false, fields = []) => (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <DragDropContext onDragEnd={(result) => handleDragEnd(result, arrayName)}>
        <Droppable droppableId={arrayName}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {yojnaData[arrayName].map((item, index) => (
                <Draggable key={index} draggableId={`${arrayName}-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border p-2 rounded-lg flex flex-col gap-2 bg-gray-50"
                    >
                      {isObject
                        ? fields.map((f) =>
                            f.type === "textarea" ? (
                              <textarea
                                key={f.name}
                                placeholder={f.placeholder}
                                value={item[f.name]}
                                onChange={(e) =>
                                  handleArrayChange(index, f.name, e.target.value, arrayName)
                                }
                                className="border rounded-lg p-2 focus:ring-2 focus:ring-green-500 w-full"
                              />
                            ) : (
                              <input
                                key={f.name}
                                type={f.type || "text"}
                                placeholder={f.placeholder}
                                value={item[f.name]}
                                onChange={(e) =>
                                  handleArrayChange(index, f.name, e.target.value, arrayName)
                                }
                                className="border rounded-lg p-2 focus:ring-2 focus:ring-green-500 w-full"
                              />
                            )
                          )
                        : (
                          <input
                            type="text"
                            placeholder={`${title} ${index + 1}`}
                            value={item}
                            onChange={(e) =>
                              handleArrayChange(index, null, e.target.value, arrayName)
                            }
                            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                          />
                        )}
                      <button
                        type="button"
                        onClick={() => handleRemoveField(arrayName, index)}
                        className="text-red-600 hover:underline self-start"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        type="button"
        onClick={() =>
          handleAddField(
            arrayName,
            isObject ? Object.fromEntries(fields.map((f) => [f.name, ""])) : ""
          )
        }
        className="text-green-600 hover:underline mt-2"
      >
        + Add {title}
      </button>
    </div>
  );

  // ==============================
  // 🔹 Render UI
  // ==============================
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">
        {editingId ? "Edit Sarkari Yojna" : "Add Sarkari Yojna"}
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-md bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title_en"
            placeholder="Yojna Title (English)"
            value={yojnaData.title_en}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="title_hi"
            placeholder="Yojna Title (Hindi)"
            value={yojnaData.title_hi}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            name="description_en"
            placeholder="Yojna Description (English)"
            value={yojnaData.description_en}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          />
          <textarea
            name="description_hi"
            placeholder="Yojna Description (Hindi)"
            value={yojnaData.description_hi}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Thumbnail */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Thumbnail</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="border rounded-lg p-2 w-full"
          />
          {yojnaData.thumbnail && (
            <img
              src={
                yojnaData.thumbnail instanceof File
                  ? URL.createObjectURL(yojnaData.thumbnail)
                  : yojnaData.thumbnail
              }
              alt="Thumbnail Preview"
              className="mt-2 w-48 h-32 object-cover rounded-md border"
            />
          )}
        </div>

        {/* Dynamic Sections */}
        {renderSection("Eligibility", "eligibility")}
        {renderSection("Links", "links", true, [
          { name: "type", placeholder: "Link Type" },
          { name: "url", placeholder: "URL", type: "url" },
        ])}
        {renderSection("Important Documents", "documents")}
        {renderSection("FAQ", "faq", true, [
          { name: "question", placeholder: "Question" },
          { name: "answer", placeholder: "Answer", type: "textarea" },
        ])}
        {renderSection("Other Details", "otherDetails")}

        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : editingId ? "Update Yojna" : "Add Yojna"}
          </button>
          <Link href="/admin/dashboard" className="text-green-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </form>

      {/* Yojna List */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">All Yojnas</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="border p-2">Title (EN)</th>
                <th className="border p-2">Title (HI)</th>
                <th className="border p-2">Created</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {yojnas.map((y) => (
                <tr key={y._id}>
                  <td className="border p-2">{y.title_en}</td>
                  <td className="border p-2">{y.title_hi}</td>
                  <td className="border p-2">
                    {new Date(y.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(y)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(y._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {yojnas.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-3 text-gray-500">
                    No Yojna found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

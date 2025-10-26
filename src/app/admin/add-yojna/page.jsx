"use client";
import { useState } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAdminAuth from "../hooks/useAdminAuth";

export default function AddYojnaPage() {
  useAdminAuth();
  const [yojnaData, setYojnaData] = useState({
    title_en: "",
    title_hi: "",
    description_en: "",
    description_hi: "",
    eligibility: [""],
    links: [{ type: "Apply Link", url: "" }, { type: "Official Link", url: "" }],
    documents: [""],
    faq: [{ question: "", answer: "" }],
    otherDetails: [""],
    thumbnail: null, // added thumbnail
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let dataToSend = { ...yojnaData };

      // Convert thumbnail to Base64 if present
      if (yojnaData.thumbnail) {
        const reader = new FileReader();
        reader.readAsDataURL(yojnaData.thumbnail);
        reader.onloadend = async () => {
          dataToSend.thumbnail = reader.result;

          const res = await fetch("/api/yojna", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
          });

          if (res.ok) {
            alert("Yojna added successfully!");
            resetForm();
          } else {
            const error = await res.json();
            alert(error.error);
          }
        };
      } else {
        const res = await fetch("/api/yojna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        if (res.ok) {
          alert("Yojna added successfully!");
          resetForm();
        } else {
          const error = await res.json();
          alert(error.error);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setYojnaData({
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
    });
  };

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

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Add Sarkari Yojna</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titles */}
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

        {/* Descriptions */}
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
              src={URL.createObjectURL(yojnaData.thumbnail)}
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Add Yojna
          </button>
          <Link href="/admin/dashboard" className="text-green-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </form>
    </main>
  );
}

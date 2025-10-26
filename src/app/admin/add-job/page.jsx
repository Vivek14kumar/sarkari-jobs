"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import useAdminAuth from "../hooks/useAdminAuth";

export default function JobManagerPage() {
  useAdminAuth();
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobData, setJobData] = useState({
    title_en: "",
    title_hi: "",
    category: "",
    startDate: "",
    lastDate: "",
    examDate: "",
    resultDate: "",
    feeLastDate: "",
    description_en: "",
    description_hi: "",
    officialLink: "",
    applyLink: "",
    notificationLink: "",
    syllabusLink: "",
  });

  const [extraInfo, setExtraInfo] = useState([{ key: "", value: "" }]);
  const [tableData, setTableData] = useState([{ postName: "", categoryName: "", noOfPost: "" }]);
  const [eligibility, setEligibility] = useState("");
  const [applicationFees, setApplicationFees] = useState([{ category: "", fee: "" }]);
  const [ageLimits, setAgeLimits] = useState([{ min: "", max: "", relaxation: "" }]);
  const [paymentModes, setPaymentModes] = useState({
    DebitCard: false,
    CreditCard: false,
    InternetBanking: false,
    IMPS: false,
    UPI: false,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtraChange = (index, field, value) => {
    const updated = [...extraInfo];
    updated[index][field] = value;
    setExtraInfo(updated);
  };

  const addExtraField = () => setExtraInfo([...extraInfo, { key: "", value: "" }]);
  const removeExtraField = (index) => setExtraInfo(extraInfo.filter((_, i) => i !== index));

  const handleTableChange = (index, field, value) => {
    const updated = [...tableData];
    updated[index][field] = value;
    setTableData(updated);
  };

  const addTableRow = () => setTableData([...tableData, { postName: "", categoryName: "", noOfPost: "" }]);
  const removeTableRow = (index) => setTableData(tableData.filter((_, i) => i !== index));

  const handleApplicationFeeChange = (index, field, value) => {
    const updated = [...applicationFees];
    updated[index][field] = value;
    setApplicationFees(updated);
  };

  const addApplicationFeeField = () => setApplicationFees([...applicationFees, { category: "", fee: "" }]);
  const removeApplicationFeeField = (index) => setApplicationFees(applicationFees.filter((_, i) => i !== index));

  const handleAgeLimitChange = (index, field, value) => {
    const updated = [...ageLimits];
    updated[index][field] = value;
    setAgeLimits(updated);
  };

  const addAgeLimitField = () => setAgeLimits([...ageLimits, { min: "", max: "", relaxation: "" }]);
  const removeAgeLimitField = (index) => setAgeLimits(ageLimits.filter((_, i) => i !== index));

  const handlePaymentModeChange = (mode) => {
    setPaymentModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...jobData,
      extra_info: extraInfo.filter((f) => f.key && f.value),
      vacancy_table: tableData.filter((row) => row.postName && row.categoryName && row.noOfPost),
      application_fees: applicationFees.filter((f) => f.category && f.fee),
      age_limit: ageLimits.filter((f) => f.min || f.max || f.relaxation),
      eligibility,
      payment_modes: Object.keys(paymentModes).filter((k) => paymentModes[k]),
    };

    try {
      let res;
      if (editingJobId) {
        res = await fetch(`/api/jobs/${editingJobId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
      } else {
        res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
      }

      if (res.ok) {
        alert(editingJobId ? "✅ Job updated!" : "✅ Job added!");
        resetForm();
        fetchJobs();
      } else {
        const err = await res.json();
        alert("❌ " + err.error);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job._id);
    setJobData({
      title_en: job.title_en,
      title_hi: job.title_hi,
      category: job.category,
      startDate: job.startDate,
      lastDate: job.lastDate,
      examDate: job.examDate || "",
      resultDate: job.resultDate || "",
      feeLastDate: job.feeLastDate || "",
      description_en: job.description_en || "",
      description_hi: job.description_hi || "",
      officialLink: job.officialLink,
      applyLink: job.applyLink,
      notificationLink: job.notificationLink,
      syllabusLink: job.syllabusLink,
    });
    setExtraInfo(job.extra_info?.length ? job.extra_info : [{ key: "", value: "" }]);
    setTableData(job.vacancy_table?.length ? job.vacancy_table : [{ postName: "", categoryName: "", noOfPost: "" }]);
    setApplicationFees(job.application_fees?.length ? job.application_fees : [{ category: "", fee: "" }]);
    setAgeLimits(job.age_limit?.length ? job.age_limit : [{ min: "", max: "", relaxation: "" }]);
    setEligibility(job.eligibility || "");
    setPaymentModes({
      DebitCard: job.payment_modes?.includes("DebitCard") || false,
      CreditCard: job.payment_modes?.includes("CreditCard") || false,
      InternetBanking: job.payment_modes?.includes("InternetBanking") || false,
      IMPS: job.payment_modes?.includes("IMPS") || false,
      UPI: job.payment_modes?.includes("UPI") || false,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("✅ Job deleted!");
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingJobId(null);
    setJobData({
      title_en: "",
      title_hi: "",
      category: "",
      startDate: "",
      lastDate: "",
      examDate: "",
      resultDate: "",
      feeLastDate: "",
      totalPosts: "",
      description_en: "",
      description_hi: "",
      officialLink: "",
      applyLink: "",
      notificationLink: "",
      syllabusLink: "",
    });
    setExtraInfo([{ key: "", value: "" }]);
    setTableData([{ postName: "", categoryName: "", noOfPost: "" }]);
    setApplicationFees([{ key: "", value: "" }]);
    setAgeLimits([{ min: "", max: "", relaxation: "" }]);
    setEligibility("");
    setPaymentModes({
      DebitCard: false,
      CreditCard: false,
      InternetBanking: false,
      IMPS: false,
      UPI: false,
    });
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Job Manager</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-blue-700">{editingJobId ? "Edit Job" : "Add New Job"}</h2>

        {/* Basic Info */}
        <input name="title_en" placeholder="Job Title (English)" value={jobData.title_en} onChange={handleChange} required className="w-full border rounded-lg p-2" />
        <input name="title_hi" placeholder="Job Title (Hindi)" value={jobData.title_hi} onChange={handleChange} required className="w-full border rounded-lg p-2" />
        <input name="category" placeholder="Category" value={jobData.category} onChange={handleChange} required className="w-full border rounded-lg p-2" />

        <div className="grid grid-cols-2 gap-4">
  {/* Start Date */}
  <div className="flex flex-col">
    <label htmlFor="startDate" className="text-sm font-medium mb-1">Start Date</label>
    <input
      type="date"
      id="startDate"
      name="startDate"
      value={jobData.startDate}
      onChange={handleChange}
      className="border rounded-lg p-2"
    />
  </div>

  {/* Last Date */}
  <div className="flex flex-col">
    <label htmlFor="lastDate" className="text-sm font-medium mb-1">Last Date</label>
    <input
      type="date"
      id="lastDate"
      name="lastDate"
      value={jobData.lastDate}
      onChange={handleChange}
      className="border rounded-lg p-2"
    />
  </div>

  {/* Exam Date */}
  <div className="flex flex-col">
    <label htmlFor="examDate" className="text-sm font-medium mb-1">Exam Date</label>
    <input
      type="text"
      id="examDate"
      name="examDate"
      value={jobData.examDate}
      onChange={handleChange}
      placeholder="Exam Date"
      className="border rounded-lg p-2"
    />
  </div>

  {/* Result Date */}
  <div className="flex flex-col">
    <label htmlFor="resultDate" className="text-sm font-medium mb-1">Result Date</label>
    <input
      type="text"
      id="resultDate"
      name="resultDate"
      value={jobData.resultDate}
      onChange={handleChange}
      placeholder="Result Date"
      className="border rounded-lg p-2"
    />
  </div>

  {/* Fee Payment Last Date */}
  <div className="flex flex-col">
    <label htmlFor="feeLastDate" className="text-sm font-medium mb-1">Fee Payment Last Date</label>
    <input
      type="date"
      id="feeLastDate"
      name="feeLastDate"
      value={jobData.feeLastDate}
      onChange={handleChange}
      className="border rounded-lg p-2"
    />
  </div>
  {/* Total Posts */}
  <div className="flex flex-col">
    <label htmlFor="totalPost" className="text-sm font-medium mb-1">Total Posts</label>
    <input
      type="text"
      id="totalPosts"
      name="totalPosts"
      value={jobData.totalPosts}
      onChange={handleChange}
      placeholder="Total Posts"
      className="border rounded-lg p-2"
    />
  </div>

</div>
        {/*Links*/}
        <input type="url" name="officialLink" value={jobData.officialLink} onChange={handleChange} placeholder="Official Link"className="border rounded-lg p-2 mr-0.5"/>
        <input type="url" name="applyLink" value={jobData.applyLink} onChange={handleChange} placeholder="Apply Link"className="border rounded-lg p-2 mr-0.5"/>
        <input type="url" name="notificationLink" value={jobData.notificationLink} onChange={handleChange} placeholder="Notification Link"className="border rounded-lg p-2 mr-0.5"/>
        <input type="url" name="syllabusLink" value={jobData.syllabusLink} onChange={handleChange} placeholder="Syllabus Link"className="border rounded-lg p-2"/>
        {/* Description */}
        <textarea name="description_en" placeholder="Description (English)" value={jobData.description_en} onChange={handleChange} className="w-full border rounded-lg p-2" />
        <textarea name="description_hi" placeholder="Description (Hindi)" value={jobData.description_hi} onChange={handleChange} className="w-full border rounded-lg p-2" />

        {/* Vacancy Table */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Vacancy Details</h3>
          {tableData.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <input placeholder="Post Name" value={row.postName} onChange={(e) => handleTableChange(i, "postName", e.target.value)} className="border rounded-lg p-2" />
              <input placeholder="Category Name" value={row.categoryName} onChange={(e) => handleTableChange(i, "categoryName", e.target.value)} className="border rounded-lg p-2" />
              <input placeholder="No. of Post" value={row.noOfPost} onChange={(e) => handleTableChange(i, "noOfPost", e.target.value)} className="border rounded-lg p-2" />
              <button type="button" onClick={() => removeTableRow(i)} className="bg-red-600 text-white px-2 rounded-lg">X</button>
            </div>
          ))}
          <button type="button" onClick={addTableRow} className="bg-blue-600 text-white px-4 py-1 rounded-lg">+ Add Row</button>
        </div>

        {/* Application Fee Section */}
<div className="border-t pt-4">
  <h3 className="text-lg font-semibold text-blue-700 mb-2">Application Fee</h3>

  {applicationFees.map((item, i) => (
    <div key={i} className="flex gap-2 mb-2">
      <input
        type="text"
        placeholder="Category (e.g., General / OBC)"
        value={item.category}
        onChange={(e) => handleApplicationFeeChange(i, "category", e.target.value)}
        className="border rounded-lg p-2 w-1/2"
      />
      <input
        type="text"
        placeholder="Fee (e.g., ₹100)"
        value={item.fee}
        onChange={(e) => handleApplicationFeeChange(i, "fee", e.target.value)}
        className="border rounded-lg p-2 w-1/2"
      />
      <button
        type="button"
        onClick={() => removeApplicationFeeField(i)}
        className="bg-red-600 text-white px-2 rounded-lg"
      >
        X
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={addApplicationFeeField}
    className="bg-blue-600 text-white px-4 py-1 rounded-lg"
  >
    + Add Fee
  </button>
</div>


        {/* Age Limit */}
<div className="border-t pt-4">
  <h3 className="text-lg font-semibold text-blue-700 mb-2">Age Limit</h3>
  {ageLimits.map((item, i) => (
    <div key={i} className="grid grid-cols-4 gap-2 mb-2">
      <input
        placeholder="Min Age"
        value={item.min}
        onChange={(e) => handleAgeLimitChange(i, "min", e.target.value)}
        className="border rounded-lg p-2"
      />
      <input
        placeholder="Max Age"
        value={item.max}
        onChange={(e) => handleAgeLimitChange(i, "max", e.target.value)}
        className="border rounded-lg p-2"
      />
      <input
        placeholder="Relaxation Details"
        value={item.relaxation}
        onChange={(e) =>
          handleAgeLimitChange(i, "relaxation", e.target.value)
        }
        className="border rounded-lg p-2"
      />
      <button
        type="button"
        onClick={() => removeAgeLimitField(i)}
        className="bg-red-600 text-white px-2 rounded-lg"
      >
        X
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={addAgeLimitField}
    className="bg-blue-600 text-white px-4 py-1 rounded-lg"
  >
    + Add Age Field
  </button>
</div>


        {/* Eligibility */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Eligibility Criteria</h3>
          <textarea placeholder="Eligibility details" value={eligibility} onChange={(e) => setEligibility(e.target.value)} className="w-full border rounded-lg p-2"></textarea>
        </div>

        {/* Payment Modes */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Payment Modes</h3>
          <div className="flex flex-wrap gap-4">
            {Object.keys(paymentModes).map((mode) => (
              <label key={mode} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={paymentModes[mode]}
                  onChange={() => handlePaymentModeChange(mode)}
                />
                {mode.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
          </div>
        </div>

        {/* Extra Info */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Extra Information</h3>
          {extraInfo.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input placeholder="Field Name" value={item.key} onChange={(e) => handleExtraChange(i, "key", e.target.value)} className="w-1/2 border rounded-lg p-2" />
              <input placeholder="Field Value" value={item.value} onChange={(e) => handleExtraChange(i, "value", e.target.value)} className="w-1/2 border rounded-lg p-2" />
              <button type="button" onClick={() => removeExtraField(i)} className="bg-red-600 text-white px-2 rounded-lg">X</button>
            </div>
          ))}
          <button type="button" onClick={addExtraField} className="bg-blue-600 text-white px-4 py-1 rounded-lg">+ Add Field</button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded-lg">{editingJobId ? "Update Job" : "Add Job"}</button>
          <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-400 text-white rounded-lg">Reset</button>
        </div>
      </form>
       <Link href="/admin/dashboard" className="text-green-600 hover:underline">Back to Dashboard</Link>
      {/* Job List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">All Jobs</h2>
        <table className="w-full border">
          <thead className="bg-blue-200">
            <tr>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Start Date</th>
              <th className="border px-2 py-1">Last Date</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td className="border px-2 py-1">{job.title_en}</td>
                <td className="border px-2 py-1">{job.category}</td>
                <td className="border px-2 py-1">{job.startDate}</td>
                <td className="border px-2 py-1">{job.lastDate}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button onClick={() => handleEdit(job)} className="bg-yellow-500 px-2 py-1 rounded-lg text-white">Edit</button>
                  <button onClick={() => handleDelete(job._id)} className="bg-red-600 px-2 py-1 rounded-lg text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

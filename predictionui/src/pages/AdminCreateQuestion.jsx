import React, { useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const AdminCreateQuestion = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "", // manually input
    prediction_type: "binary",
  });

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const payload = {
        ...form,
        keywords: form.keywords
          ? form.keywords.split(",").map((k) => k.trim().toLowerCase())
          : [],
      };
  
      await api.post("/questions/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("✅ Question created!");
      setForm({
        title: "",
        description: "",
        category_id: "",
        prediction_type: "binary",
        keywords: "",
      });
    } catch (err) {
      console.error("❌ Failed to create question", err);
      alert("Failed to create question");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">Create New Question</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category ID (enter manually)</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <label>Keywords (comma-separated)</label>
            <input
            type="text"
            name="keywords"
            value={form.keywords}
            onChange={(e) =>
              setForm({ ...form, keywords: e.target.value })
                }
            className="border p-2 rounded w-full"
                  />
            </div>

          <div>
            <label className="block text-sm font-medium">Prediction Type</label>
            <select
              className="w-full border p-2 rounded"
              value={form.prediction_type}
              onChange={(e) => setForm({ ...form, prediction_type: e.target.value })}
            >
              <option value="binary">Binary (Yes/No)</option>
              <option value="range">Range</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateQuestion;

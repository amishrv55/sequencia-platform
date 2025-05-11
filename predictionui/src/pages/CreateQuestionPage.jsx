import React, { useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";
const CreateQuestionPage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    prediction_type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/questions/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Question created!");
    } catch (err) {
      alert("❌ Failed to create question");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Category ID"
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: parseInt(e.target.value) })}
          className="w-full border p-2 rounded"
        />

        {/* ✅ Prediction Type Dropdown */}
        <select
          value={form.prediction_type}
          onChange={(e) => setForm({ ...form, prediction_type: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Prediction Type</option>
          <option value="binary">Yes / No</option>
          <option value="range">Range (min-max)</option>
        </select>

        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded">
          Submit Question
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateQuestionPage;

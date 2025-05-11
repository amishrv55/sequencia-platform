// src/pages/TickerForm.jsx
import React, { useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const TickerForm = () => {
  const [form, setForm] = useState({
    name: "",
    value: "",
    icon_url: "",
  });
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/tickers/", form);
      setSuccess("✅ Ticker added successfully!");
      setForm({ name: "", value: "", icon_url: "" });
    } catch (err) {
      setSuccess("❌ Failed to add ticker. Check console.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-4">➕ Add New Ticker</h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Ticker Name (e.g., Bitcoin Price)"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="value"
            placeholder="Ticker Value (e.g., $72,000)"
            className="w-full border p-2 rounded"
            value={form.value}
            onChange={handleChange}
          />
          <input
            name="icon_url"
            placeholder="Icon URL (optional)"
            className="w-full border p-2 rounded"
            value={form.icon_url}
            onChange={handleChange}
          />
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Submit Ticker
          </button>

          {success && (
            <p className="text-sm text-green-600 font-medium">{success}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TickerForm;

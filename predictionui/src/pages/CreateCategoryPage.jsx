// src/pages/CreateCategoryPage.jsx
import React, { useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const CreateCategoryPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    domain: "" // Added domain field
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data, including domain (which can be empty)
      await api.post("/categories/", {
        ...form,
        domain: form.domain || null // Send null if empty
      });
      alert("✅ Category created!");
      // Reset form including domain field
      setForm({ name: "", description: "", domain: "" });
    } catch (err) {
      console.error("❌ Error creating category:", err);
      alert("Failed to create category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4">Create New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              name="name"
              placeholder="e.g., Artificial Intelligence"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the category"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain (optional)
            </label>
            <input
              name="domain"
              placeholder="e.g., Technology, Science, Business"
              value={form.domain}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Helps users filter categories by domain
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryPage;
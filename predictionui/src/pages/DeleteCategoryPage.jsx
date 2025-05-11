// src/pages/DeleteCategoryPage.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const DeleteCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories/");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${selectedId}`);
      alert("✅ Category deleted");
      setCategories((prev) => prev.filter((cat) => cat.id !== selectedId));
    } catch (err) {
      console.error("❌ Failed to delete category", err);
      alert("Error deleting category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4">Delete Category</h2>
        <select
          className="w-full border p-2 mb-4 rounded"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteCategoryPage;

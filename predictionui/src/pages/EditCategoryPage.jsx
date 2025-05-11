import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    domain: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get(`/categories/${id}`);
        setForm({
          name: response.data.name,
          description: response.data.description || "",
          domain: response.data.domain || ""
        });
      } catch (err) {
        setError("Failed to load category");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload with proper null/undefined handling
      const payload = {
        name: form.name,
        description: form.description || undefined,
        domain: form.domain || undefined
      };

      await api.put(`/categories/${id}`, payload);
      alert("✅ Category updated successfully!");
      navigate("/admin/categories");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update category");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4">Edit Category</h2>
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
              Description
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the category"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
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

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;
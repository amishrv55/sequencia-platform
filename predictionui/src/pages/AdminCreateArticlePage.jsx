import React, { useState } from "react";
import Header from "../components/Header";
import api from "../api/axiosInstance";

const AdminCreateArticlePage = () => {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    image_url: "",
    keywords: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const payload = {
        title: form.title,
        summary: form.summary,
        content: form.content,
        image_url: form.image_url?.trim() || "",
  
        // ✅ Safe split if keywords is provided
        keywords: form.keywords
          ? form.keywords.split(",").map((k) => k.trim().toLowerCase())
          : [],
      };
  
      await api.post("/articles/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("✅ Article submitted!");
      setForm({ title: "", content: "", image_url: "", keywords: "" });
  
    } catch (err) {
      console.error("❌ Failed to post article", err);
      alert("Error posting article");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">Post New Article</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="border p-2 rounded w-full h-40"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Image URLs (comma-separated)</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Keywords (comma-separated)</label>
            <input
              type="text"
              name="keywords"
              value={form.keywords}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
            Submit Article
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateArticlePage;

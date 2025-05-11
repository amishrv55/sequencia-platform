import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";

function EditQuestionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    prediction_type: "",
    actual_binary: "",
    actual_range_min: "",
    actual_range_max: "",
    image_url: "",
    file_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/${id}`);
        setForm({
          title: res.data.title || "",
          description: res.data.description || "",
          category_id: res.data.category_id || "",
          prediction_type: res.data.prediction_type || "",
          actual_binary: res.data.actual_binary || "",
          actual_range_min: res.data.actual_range_min || "",
          actual_range_max: res.data.actual_range_max || "",
          image_url: res.data.image_url || "",
          file_url: res.data.file_url || ""
        });
      } catch (err) {
        setError("Failed to load question");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value === "" ? null : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload with proper null/undefined handling
      const payload = {
        title: form.title || undefined,
        description: form.description || undefined,
        category_id: form.category_id ? parseInt(form.category_id) : undefined,
        prediction_type: form.prediction_type || undefined,
        actual_binary: form.actual_binary || undefined,
        actual_range_min: form.actual_range_min !== "" ? form.actual_range_min : undefined,
        actual_range_max: form.actual_range_max !== "" ? form.actual_range_max : undefined,
        image_url: form.image_url || undefined,
        file_url: form.file_url || undefined
      };

      await api.put(`/questions/${id}`, payload);
      navigate("/admin/questions/edit");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update question");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category ID</label>
          <input
            name="category_id"
            type="number"
            value={form.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Prediction Type</label>
          <select
            name="prediction_type"
            value={form.prediction_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select type</option>
            <option value="binary">Binary</option>
            <option value="range">Range</option>
          </select>
        </div>

        {form.prediction_type === "binary" && (
          <div>
            <label className="block mb-1 font-medium">Actual Binary Result</label>
            <select
              name="actual_binary"
              value={form.actual_binary}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select result</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        )}

        {form.prediction_type === "range" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Range Min</label>
              <input
                name="actual_range_min"
                type="number"
                step="0.01"
                value={form.actual_range_min || ""}
                onChange={handleNumberChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Range Max</label>
              <input
                name="actual_range_max"
                type="number"
                step="0.01"
                value={form.actual_range_max || ""}
                onChange={handleNumberChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">File URL</label>
          <input
            name="file_url"
            value={form.file_url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditQuestionForm;
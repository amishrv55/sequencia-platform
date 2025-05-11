import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const AdminSetOutcome = () => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    actual_binary: "",
    actual_range_min: "",
    actual_range_max: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get("/questions/");
        setQuestions(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch questions", err);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const payload = selected.prediction_type === "binary"
      ? { actual_binary: form.actual_binary.toLowerCase() }
      : {
          actual_range_min: parseFloat(form.actual_range_min),
          actual_range_max: parseFloat(form.actual_range_max),
        };

    try {
      await api.patch(`/questions/${selected.id}/resolve`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Outcome updated and scored!");
    } catch (err) {
      console.error("❌ Error setting outcome", err);
      alert("Failed to set outcome");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Set Actual Outcome</h1>

        {/* Question Selector */}
        <select
          value={selected?.id || ""}
          onChange={(e) => {
            const q = questions.find((q) => q.id === parseInt(e.target.value));
            setSelected(q);
          }}
          className="w-full border rounded px-4 py-2 mb-6"
        >
          <option value="">Select Question</option>
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title} ({q.prediction_type})
            </option>
          ))}
        </select>

        {selected && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {selected.prediction_type === "binary" ? (
              <select
                value={form.actual_binary}
                onChange={(e) => setForm({ ...form, actual_binary: e.target.value })}
                className="w-full border rounded px-4 py-2"
                required
              >
                <option value="">Select Outcome</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            ) : (
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Actual Min"
                  value={form.actual_range_min}
                  onChange={(e) => setForm({ ...form, actual_range_min: e.target.value })}
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Actual Max"
                  value={form.actual_range_max}
                  onChange={(e) => setForm({ ...form, actual_range_max: e.target.value })}
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Submit Outcome
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSetOutcome;

import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const UnsetOutcomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/questions/").then((res) => setQuestions(res.data));
  }, []);

  const handleUnset = async () => {
    try {
      await api.patch(`/questions/${selectedId}/unset-outcome`);
      setMessage("✅ Outcome and scores reset!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to reset outcome");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">🚫 Unset Actual Outcome</h2>
        <select
          className="border p-2 w-full mb-4"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Select question</option>
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleUnset}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Reset Outcome
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default UnsetOutcomePage;

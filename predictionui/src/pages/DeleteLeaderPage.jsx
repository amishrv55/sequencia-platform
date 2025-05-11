import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const DeleteLeaderPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all leaders on component mount
  useEffect(() => {
    api.get("/leaders/")
      .then((res) => setLeaders(res.data))
      .catch((err) => {
        console.error("Error fetching leaders:", err);
        setMessage("❌ Failed to load leaders");
      });
  }, []);

  // Handle deletion
  const handleDelete = async () => {
    if (!selectedId) {
      setMessage("❗ Please select a leader to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this leader?")) return;

    try {
      await api.delete(`/leaders/${selectedId}`);
      setMessage("✅ Leader deleted successfully!");
      // Refresh the list of leaders after deletion
      setLeaders(leaders.filter((leader) => leader.id !== Number(selectedId)));
      setSelectedId(""); // Reset selection
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete leader");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">🗑 Delete Leader</h2>

        <select
          className="border p-2 w-full mb-4"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Select a leader</option>
          {leaders.map((leader) => (
            <option key={leader.id} value={leader.id}>
              {leader.name || `Leader #${leader.id}`}
            </option>
          ))}
        </select>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default DeleteLeaderPage;

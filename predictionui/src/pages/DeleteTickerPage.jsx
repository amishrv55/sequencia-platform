import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const DeleteTickerPage = () => {
  const [tickers, setTickers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/tickers/").then((res) => setTickers(res.data));
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/tickers/${selectedId}`);
      setMessage("✅ Ticker deleted successfully.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete ticker");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">🗑 Delete Ticker</h2>
        <select
          className="border p-2 w-full mb-4"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Select a ticker</option>
          {tickers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
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

export default DeleteTickerPage;

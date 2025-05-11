import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const AdminUpdateTicker = () => {
  const [tickers, setTickers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    name: "",
    value: "",
    icon_url: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await api.get("/tickers/");
        setTickers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch tickers", err);
      }
    };
    fetchTickers();
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    const ticker = tickers.find((t) => t.id === parseInt(id));
    if (ticker) {
      setForm({
        name: ticker.name,
        value: ticker.value,
        icon_url: ticker.icon_url || "",
      });
    } else {
      setForm({ name: "", value: "", icon_url: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      value: form.value,
      icon_url: form.icon_url,
    };

    try {
      if (selectedId) {
        await api.patch(`/tickers/${selectedId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Ticker updated!");
      } else {
        await api.post("/tickers/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Ticker created!");
      }

      setForm({ name: "", value: "", icon_url: "" });
      setSelectedId("");
      const res = await api.get("/tickers/");
      setTickers(res.data);
    } catch (err) {
      console.error("❌ Error saving ticker", err);
      alert("Failed to update ticker");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Update or Add Ticker</h1>

        {/* Ticker Selector */}
        <select
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full border rounded px-4 py-2 mb-6"
        >
          <option value="">➕ Create New Ticker</option>
          {tickers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Ticker Name"
            className="w-full border rounded px-4 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Ticker Value"
            className="w-full border rounded px-4 py-2"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="Icon URL (optional)"
            className="w-full border rounded px-4 py-2"
            value={form.icon_url}
            onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            {selectedId ? "Update Ticker" : "Create Ticker"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateTicker;

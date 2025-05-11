// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [predictions, setPredictions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const predictionRes = await api.get("/predictions/by-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPredictions(predictionRes.data);
      } catch (err) {
        console.error("❌ Error loading profile:", err);
      }
    };

    fetchData();
  }, [token]);

  const correct = predictions.filter(p => p.score?.value === 1).length;
  const total = predictions.length;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">My Profile</h1>
          <Link
            to="/profile/edit"
            className="text-blue-500 hover:underline text-sm"
          >
            ✏️ Edit Profile
          </Link>
        </div>

        {/* USER INFO */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800">User Info</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Education:</strong> {user.profile?.education || "N/A"}</p>
          <p><strong>Bio:</strong> {user.profile?.bio || "N/A"}</p>
          <p><strong>Years of Experience:</strong> {user.profile?.experience_years || "N/A"}</p>
          <p><strong>Achievements:</strong> {user.profile?.achievements || "N/A"}</p>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex gap-6">
          <div>
            <p className="text-sm text-gray-500">Total Predictions</p>
            <h3 className="text-xl font-bold text-indigo-600">{total}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">Correct Predictions</p>
            <h3 className="text-xl font-bold text-green-600">{correct}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">Accuracy</p>
            <h3 className="text-xl font-bold text-blue-600">{accuracy}%</h3>
          </div>
        </div>

        {/* PREDICTIONS LIST */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Predictions</h2>
          {predictions.length === 0 ? (
            <p className="text-gray-500">You haven't made any predictions yet.</p>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Question</th>
                  <th className="p-2">Prediction Type</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">Confidence</th>
                  <th className="p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.question?.title}</td>
                    <td className="p-2">{p.question?.prediction_type}</td>
                    <td className="p-2">
                      {p.predicted_binary ||
                        `${p.predicted_range_min} – ${p.predicted_range_max}`}
                    </td>
                    <td className="p-2">{p.confidence}%</td>
                    <td className="p-2">
                      {p.score ? (p.score.value === 1 ? "✅" : "❌") : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard/");
        setLeaders(res.data);
      } catch (err) {
        console.error("❌ Error loading leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">🏆 Leaderboard</h1>

        {leaders.length === 0 ? (
          <p>No prediction data available yet.</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Name</th>
                <th className="p-3">Correct</th>
                <th className="p-3">Total</th>
                <th className="p-3">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((user, index) => (
                <tr key={user.user_id} className="border-t">
                  <td className="p-3 font-bold text-indigo-600">{index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.correct}</td>
                  <td className="p-3">{user.total}</td>
                  <td className="p-3">{user.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;

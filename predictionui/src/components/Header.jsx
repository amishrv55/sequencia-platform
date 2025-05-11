import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

const Header = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [token]);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          <Link to="/">ForecastPro</Link>
        </h1>
        <nav className="space-x-4 flex items-center text-gray-700">
          <Link to="/" className="hover:text-indigo-500">Home</Link>
          <Link to="/categories" className="hover:text-indigo-500">Categories</Link>
          <Link to="/leaders" className="hover:text-indigo-500">Leaders</Link>
          <Link 
            to="/analysis"
            className="px-4 py-2 text-gray-700 hover:text-indigo-600"
          >
            Our Analysis
          </Link>
          <Link to="/leaderboard" className="hover:text-indigo-500">Leaderboard</Link>
          {token && user?.is_admin && (
            <Link to="/admin" className="hover:text-indigo-500">Admin</Link>
          )}

          {!token ? (
            <Link to="/login" className="hover:text-indigo-500">Login</Link>
          ) : (
            <>
              <Link to="/profile" className="hover:text-indigo-500">My Profile</Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
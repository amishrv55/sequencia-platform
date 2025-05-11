import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",  // ✅ Add this
          },
        }
      );
  
      const token = response.data.access_token;
      localStorage.setItem("token", `Bearer ${token}`);
      navigate("/"); // ✅ Redirect to home after login
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials or server error");
    }
  };  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

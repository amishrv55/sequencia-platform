import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const EditProfilePage = () => {
  const [form, setForm] = useState({
    education: "",
    bio: "",
    location: "",
    achievements: "",
    experience_years: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🟡 Fetch profile data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put("/profile/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Profile updated!");
      setTimeout(() => navigate("/profile"), 1000); // redirect
    } catch (err) {
      console.error("Failed to update profile", err);
      setMessage("❌ Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">Edit Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Education" name="education" value={form.education} onChange={handleChange} />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} />
          <Input label="Years of Experience" name="experience_years" value={form.experience_years} onChange={handleChange} type="number" />
          <Textarea label="Bio" name="bio" value={form.bio} onChange={handleChange} />
          <Textarea label="Achievements" name="achievements" value={form.achievements} onChange={handleChange} />

          {message && <p className="text-sm">{message}</p>}
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" type="submit">
            Save Changes
          </button>
        </form>
      )}
    </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      rows={3}
      value={value || ""}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded"
    />
  </div>
);

export default EditProfilePage;

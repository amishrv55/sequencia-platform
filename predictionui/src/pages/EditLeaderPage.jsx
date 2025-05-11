import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LeaderForm from "../components/LeaderForm";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

const EditLeaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaderData, setLeaderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch leader info when component mounts
  useEffect(() => {
    const fetchLeader = async () => {
      try {
        const res = await api.get(`/leaders/${id}`);
        setLeaderData(res.data);
      } catch (err) {
        console.error("Error fetching leader data:", err);
        toast.error("Failed to fetch leader details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeader();
  }, [id]);

  const handleFormSuccess = () => {
    toast.success("Leader updated successfully");
    navigate("/leaders");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Edit Leader</h1>
        <LeaderForm initialData={leaderData} onSuccess={handleFormSuccess} />
      </div>
    </div>
  );
};

export default EditLeaderPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LeaderForm from "../components/LeaderForm";
import { toast } from "react-toastify";

const CreateLeaderPage = () => {
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    toast.success("Leader created successfully");
    navigate("/leaders"); // Navigate back to leaders list page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Add New Leader</h1>
        <LeaderForm onSuccess={handleFormSuccess} />
      </div>
    </div>
  );
};

export default CreateLeaderPage;

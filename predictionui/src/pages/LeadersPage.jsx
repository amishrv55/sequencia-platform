import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";
import LeaderCard from "../components/LeaderCard";
import LeaderForm from "../components/LeaderForm";
import Modal from "../components/Modal";
import { toast } from "react-toastify";

const LeadersPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/leaders/");
      setLeaders(response.data);
    } catch (err) {
      console.error("Error fetching leaders:", err);
      toast.error("Failed to load leaders");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leader) => {
    setEditingLeader(leader);
    setIsFormOpen(true);
  };

  const handleDelete = async (leaderId) => {
    if (window.confirm("Are you sure you want to delete this leader?")) {
      try {
        setDeletingId(leaderId);
        await api.delete(`/leaders/${leaderId}`);
        
        // Optimistic UI update
        setLeaders(leaders.filter(leader => leader.id !== leaderId));
        
        toast.success("Leader deleted successfully");
      } catch (err) {
        console.error("Error deleting leader:", err);
        toast.error("Failed to delete leader");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingLeader(null);
    fetchLeaders();
    toast.success(
      editingLeader ? "Leader updated successfully" : "Leader created successfully"
    );
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">World Leaders</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Add New Leader
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <div key={leader.id} className="relative">
              <LeaderCard 
                leader={leader}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === leader.id}
              />
            </div>
          ))}
        </div>

        <Modal 
          isOpen={isFormOpen} 
          onClose={() => {
            setIsFormOpen(false);
            setEditingLeader(null);
          }}
        >
          <h2 className="text-xl font-bold mb-4">
            {editingLeader ? "Edit Leader" : "Add New Leader"}
          </h2>
          <LeaderForm 
            onSuccess={handleFormSuccess} 
            initialData={editingLeader} 
          />
        </Modal>
      </div>
    </div>
  );
};

export default LeadersPage;
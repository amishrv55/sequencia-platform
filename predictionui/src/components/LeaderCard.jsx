import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LeaderCard = ({ leader, onEdit, onDelete}) => {
  const [activeTab, setActiveTab] = useState("bio");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(leader.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTimelineClick = (e) => {
    e.preventDefault();
    navigate(`/timeline-search?leader=${encodeURIComponent(leader.name)}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex p-4">
        <img 
          src={`http://localhost:8000${leader.image_url}`}
          alt={leader.name}
          className="w-16 h-16 rounded-full object-cover mr-4"
          onError={(e) => {
            e.target.src = '/default-profile.jpg';
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{leader.name}</h3>
          <p className="text-sm text-gray-600">{leader.title}</p>
        </div>
      </div>
      
      <div className="border-t">
        <div className="flex">
          <button
            onClick={() => setActiveTab("bio")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "bio" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-gray-500"
            }`}
          >
            Biography
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "timeline" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-gray-500"
            }`}
          >
            Timeline
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === "bio" ? (
          <p className="text-sm text-gray-700">{leader.description}</p>
        ) : (
          <button 
            onClick={handleTimelineClick}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View Full Timeline →
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(leader);
          }}
          className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Edit leader"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-1 rounded-full transition-colors ${
            isDeleting 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
          aria-label="Delete leader"
        >
          {isDeleting ? (
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default LeaderCard;
// src/pages/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AdminCard title="➕ Create New Question" link="/admin/questions/create" />
          <AdminCard title="🎯 Set Actual Outcome" link="/admin/questions/resolve" />
          <AdminCard title="📈 Update Ticker Values" link="/admin/tickers/update" />
          <AdminCard title="📰 Post Article/Blog" link="/admin/articles/create" />
          <AdminCard title="🗑 Delete Question" link="/admin/delete-question" />
          <AdminCard title="🔄 Unset Outcome" link="/admin/unset-outcome" />
          <AdminCard title="🗑 Delete Ticker" link="/admin/delete-ticker" />
          <AdminCard title="➕ Create Category" link="/admin/category/create" />
          <AdminCard title="🗑️ Delete Category" link="/admin/category/delete" />
          <AdminCard title="🗑️ Create Article" link="/admin/create-article" />
          <AdminCard title="✏️ Edit Questions" link="/admin/questions/edit" />
          <AdminCard title="✏️ Create Leader" link="/admin/leader/create" />
          <AdminCard title="✏️ Delete Leader" link="/admin/delete-leader" />
          <AdminCard title="✏️ Edit Leader" link="/admin/leader/edit" />
          <AdminCard 
            title="✨ Create Rich Article" 
            link="/admin/articles/create-rich" 
          />
          <AdminCard title="📋 Manage Categories" link="/admin/categories" />
          <AdminCard 
            title="📝 Manage Articles" 
            link="/admin/articles/manage" 
            description="View, edit, and delete all articles"
          />
          <AdminCard 
          title="🗑 Delete Articles" 
          link="/admin/articles/delete" 
          description="Bulk delete articles"
          />

        </div>
      </div>
    </div>
  );
};

const AdminCard = ({ title, link }) => (
  <Link
    to={link}
    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition duration-300 border"
  >
    <h3 className="text-lg font-semibold text-indigo-600">{title}</h3>
  </Link>
);

export default AdminDashboard;

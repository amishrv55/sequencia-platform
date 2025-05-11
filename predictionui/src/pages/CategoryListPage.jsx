import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-6xl mx-auto p-6"> {/* Increased max-width */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Categories</h1>
          <Link
            to="/admin/category/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create New Category
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 truncate">{category.name}</div>
                    <div className="text-sm text-gray-500 truncate">{category.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    {category.domain && (
                      <div className="flex items-center min-w-0"> {/* Added container div */}
                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full truncate max-w-full">
                          {category.domain}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/category/edit/${category.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => console.log('Delete', category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryListPage;
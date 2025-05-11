import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import api from '../api/axiosInstance';
import Header from '../components/Header';

const AdminArticlesManage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        setArticles(response.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await api.delete(`/articles/${articleId}`);
      setArticles(articles.filter(article => article.id !== articleId));
      setSuccessMessage('Article deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      setDeleteError(null);
    } catch (err) {
      setDeleteError(err.response?.data?.detail || 'Failed to delete article');
      console.error('Delete failed:', err);
    }
  };

  {deleteError && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {deleteError}
    </div>
  )}
  {successMessage && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {successMessage}
    </div>
  )}

  if (loading) return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Articles</h1>
        
        <div className="mb-6">
        <div className="mb-6 flex space-x-4">
  <Link 
    to="/admin/articles/create-rich" 
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
  >
    Create New Article
  </Link>
  <Link 
    to="/admin/articles/delete" 
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Bulk Delete Articles
  </Link>
</div>
        </div>
        // Improve loading state

  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  </div>


        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/articles/${article.id}`} 
                      className="text-indigo-600 hover:underline"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link
                      to={`/admin/articles/edit/${article.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:underline"
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

export default AdminArticlesManage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Header from '../components/Header';

const EditArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/articles/${id}`, article);
      navigate('/admin/articles/manage');
    } catch (err) {
      setError('Failed to update article');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Title</label>
            <input
              value={article.title}
              onChange={(e) => setArticle({...article, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          {/* Add other fields similarly */}
          
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditArticlePage;
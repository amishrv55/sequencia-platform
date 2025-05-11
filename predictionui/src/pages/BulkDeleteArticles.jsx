import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import Header from '../components/Header';

const BulkDeleteArticles = () => {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        setArticles(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleDelete = async () => {
    if (!selected.length || !window.confirm(`Delete ${selected.length} articles?`)) return;
    
    try {
      await Promise.all(
        selected.map(id => api.delete(`/articles/${id}`))
      );
      setArticles(articles.filter(a => !selected.includes(a.id)));
      setSelected([]);
    } catch (err) {
      console.error('Deletion failed:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bulk Delete Articles</h1>
          {selected.length > 0 && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Selected ({selected.length})
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.length === articles.length}
                    onChange={(e) => 
                      setSelected(e.target.checked ? articles.map(a => a.id) : [])
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-t">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(article.id)}
                      onChange={(e) => 
                        setSelected(prev => e.target.checked
                          ? [...prev, article.id]
                          : prev.filter(id => id !== article.id)
                        )
                      }
                    />
                  </td>
                  <td className="px-6 py-4">{article.title}</td>
                  <td className="px-6 py-4">
                    {new Date(article.created_at).toLocaleDateString()}
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

export default BulkDeleteArticles;
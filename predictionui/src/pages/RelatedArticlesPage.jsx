import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Updated import
import api from "../api/axiosInstance";
import Header from "../components/Header";

const RelatedArticlesPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate(); // Added this line
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const response = await api.get(`/articles/related/${questionId}`);
        setArticles(response.data);
      } catch (err) {
        setError("Failed to fetch related articles");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [questionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Must Read Articles</h1>
        
        {articles.length === 0 ? (
          <p>No related articles found for this question.</p>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                {article.summary && (
                  <p className="text-gray-600 mb-4">{article.summary}</p>
                )}
                {article.keywords && article.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.keywords.map((keyword, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-500 mb-2">
                  Published: {new Date(article.created_at).toLocaleDateString()}
                </div>
                <button 
                  onClick={() => navigate(`/articles/${article.id}`)} // Now properly defined
                  className="text-indigo-600 hover:underline"
                >
                  Read full article
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedArticlesPage;
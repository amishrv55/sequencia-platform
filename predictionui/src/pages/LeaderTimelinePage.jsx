import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";
import { toast } from "react-toastify";

function LeaderTimelinePage() {
  const { leaderName } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        if (!leaderName) {
          throw new Error("No leader name provided");
        }

        setLoading(true);
        setError(null);
        
        const response = await api.get(`/articles/timeline-articles`, {
          params: {
            leader: leaderName
          }
        });

        if (!response.data) {
          throw new Error("No data received from server");
        }

        setArticles(response.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(err.message);
        toast.error(`Failed to load articles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [leaderName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Header />
        <div className="max-w-6xl mx-auto p-6 text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-8">
          Timeline for {decodeURIComponent(leaderName)}
        </h1>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500">
            No timeline articles found for this leader
          </p>
        ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-4">{article.summary}</p>
                {article.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 px-2 py-1 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderTimelinePage;
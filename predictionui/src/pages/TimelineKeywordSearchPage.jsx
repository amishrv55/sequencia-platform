import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";
import ArticleCard from "../components/ArticleCard";

const TimelineKeywordSearchPage = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userKeyword, setUserKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const REQUIRED_KEYWORD = "Timeline";

  // Get leader name from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const leaderParam = params.get("leader");
    if (leaderParam) {
      setUserKeyword(decodeURIComponent(leaderParam));
      setHasSearched(true);
    }
  }, [location]);

  // Fetch articles and filter
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        const articles = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setAllArticles(articles);
        
        // Filter if we have a leader name from URL
        if (userKeyword) {
          const results = articles.filter(article => {
            const hasTimeline = article.keywords?.some(
              kw => kw.toLowerCase() === REQUIRED_KEYWORD.toLowerCase()
            );
            const hasUserKeyword = article.keywords?.some(
              kw => kw.toLowerCase().includes(userKeyword.toLowerCase())
            );
            return hasTimeline && hasUserKeyword;
          });
          setFilteredArticles(results);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [userKeyword]);

  // ... (rest of your component remains the same, just use the filteredArticles)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {userKeyword ? `${userKeyword}'s Timeline` : "Timeline Search"}
        </h1>
        
        {/* Search Input - now optional since we get value from URL */}
        <div className="mb-8">
          <input
            type="text"
            value={userKeyword}
            onChange={(e) => {
              setUserKeyword(e.target.value);
              navigate(`/timeline-search?leader=${encodeURIComponent(e.target.value)}`);
            }}
            placeholder="Search timeline articles..."
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Results display */}
        {hasSearched && (
          <div className="space-y-6">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No timeline articles found for "{userKeyword}"
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  Found {filteredArticles.length} timeline articles
                </p>
                {filteredArticles.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    highlightKeywords={[REQUIRED_KEYWORD, userKeyword]}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineKeywordSearchPage;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const OurAnalysisPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [allKeywords, setAllKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        // Sort by created_at descending (newest first)
        const sortedArticles = response.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setArticles(sortedArticles);
        setFilteredArticles(sortedArticles);
        
        // Extract all unique keywords
        const keywords = new Set();
        response.data.forEach(article => {
          article.keywords?.forEach(keyword => keywords.add(keyword));
        });
        setAllKeywords(Array.from(keywords));
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let results = articles;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase())))
    }
    
    // Apply keyword filter
    if (selectedKeyword) {
      results = results.filter(article =>
        article.keywords?.includes(selectedKeyword))
    }
    
    setFilteredArticles(results);
  }, [searchTerm, selectedKeyword, articles]);

  if (loading) return <div className="min-h-screen bg-gray-50"><Header /><div className="p-6">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Our Analysis</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        {/* Keyword Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedKeyword("")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedKeyword === "" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {allKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => setSelectedKeyword(keyword)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedKeyword === keyword
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {keyword}
            </button>
          ))}
        </div>
        
        {/* Articles List */}
        <div className="space-y-6">
          {filteredArticles.length === 0 ? (
            <p className="text-gray-500">No articles found matching your criteria.</p>
          ) : (
            filteredArticles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {article.image_url && (
                    <div className="md:w-1/3">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className={`${article.image_url ? "md:w-2/3" : "w-full"}`}>
                    <h2 className="text-2xl font-bold mb-2">
                      <Link to={`/articles/${article.id}`} className="hover:text-indigo-600">
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-gray-500 text-sm mb-3">
                      Published: {new Date(article.created_at).toLocaleDateString()}
                    </p>
                    {article.summary && (
                      <p className="text-gray-700 mb-4">{article.summary}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {article.keywords?.map((keyword) => (
                        <span 
                          key={keyword} 
                          className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OurAnalysisPage;
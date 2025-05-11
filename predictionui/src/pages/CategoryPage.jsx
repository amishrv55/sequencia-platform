import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [uniqueDomains, setUniqueDomains] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (domainFilter) params.domain = domainFilter;
        
        const response = await api.get("/categories/", { params });
        setCategories(response.data);
        
        // Extract unique domains from categories
        const domains = [...new Set(
          response.data
            .map(cat => cat.domain)
            .filter(domain => domain)
        )].sort();
        setUniqueDomains(domains);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCategories, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, domainFilter]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="min-h-screen px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-700">Explore Categories</h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Domain Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-medium">Filter by domain:</span>
              <button
                onClick={() => setDomainFilter("")}
                className={`px-4 py-2 rounded-full text-sm ${
                  domainFilter === ""
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {uniqueDomains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setDomainFilter(domain)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    domainFilter === domain
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No categories found matching your criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition"
                >
                  {cat.domain && (
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full mb-2 inline-block">
                      {cat.domain}
                    </span>
                  )}
                  <h2 className="text-xl font-semibold text-indigo-600">{cat.name}</h2>
                  <p className="text-gray-600 text-sm mt-2">{cat.description}</p>
                  <a
                    href={`/categories/${cat.name.toLowerCase()}`}
                    className="mt-4 inline-block bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
                  >
                    View Questions
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
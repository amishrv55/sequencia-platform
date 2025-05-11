import React, { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import Header from "../components/Header";
import api from "../api/axiosInstance";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [tickers, setTickers] = useState([]);
  const [featuredQuestion, setFeaturedQuestion] = useState(null);

  // Categories data - can be moved to a config file if needed
  const categories = [
    {
      id: "South Korea Presidential Elections 2025",
      title: "South Korea Presidential Elections 2025",
      description: "Global policy, diplomacy, and international elections",
      icon: "🏛️",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "Bihar Elections 2025 - India",
      title: "Bihar Elections 2025 - India",
      description: "Disruptive events, global security, and areas of conflict",
      icon: "🪖",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "US-China Trade War",
      title: "US-China Trade War",
      description: "Financial markets, stock manipulation, and supply chain",
      icon: "💹",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "Artificial Intelligence Impact on Job Market",
      title: "Artificial Intelligence Impact on Job Market",
      description: "Beliefs, values, customs, and behaviors within society",
      icon: "👥",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: 5,
      title: "Information",
      description: "Influence operations, technology, and conservation platforms",
      icon: "📡",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      id: 6,
      title: "Infrastructure",
      description: "Transportation networks, cybersecurity, and facilities protection",
      icon: "🏗️",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      id: 7,
      title: "Physical Environment",
      description: "Natural disasters, resource supplies, and climate change",
      icon: "🌍",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    }
  ];

  // Fetch tickers
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await api.get("/tickers/");
        setTickers(res.data);
      } catch (err) {
        console.error("❌ Error fetching tickers:", err);
      }
    };
    fetchTickers();
  }, []);

  // Fetch featured question
  const fetchFeatured = async () => {
    try {
      const res = await api.get("/questions/featured");
      setFeaturedQuestion(res.data);
    } catch (err) {
      console.error("❌ Error fetching featured question:", err);
    }
  };

  useEffect(() => {
    fetchFeatured(); // Initial load
    const interval = setInterval(fetchFeatured, 30000); // Every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <Header />

      {/* Hero / Featured Question */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16 px-4 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-indigo-100 font-medium mb-2">FEATURED PREDICTION</p>
          {featuredQuestion ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                {featuredQuestion.title}
              </h1>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => window.location.href = "/categories"}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Explore All Questions
                </button>
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-pulse text-indigo-200">Loading featured question...</div>
            </div>
          )}
        </div>
      </section>

      {/* Hero Image Slider */}
      <div className="mt-12 px-4">
        <HeroSlider />
      </div>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore forecasts across different operational environments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tickers Section */}
      {tickers.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Approval Ratings of World Leaders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {tickers.map((ticker) => (
                <MetricCard
                  key={ticker.id}
                  title={ticker.name}
                  value={ticker.value}
                  iconUrl={ticker.icon_url}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">ForecastPro</h3>
            <p className="mb-6">Predict Smart. Win Credibility.</p>
            <p className="text-sm">© {new Date().getFullYear()} ForecastPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ✅ Category Card Component
const CategoryCard = ({ category }) => (
  <Link 
    to={`/categories/${category.id}`} 
    className={`group block rounded-xl ${category.bgColor} border ${category.borderColor} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
  >
    <div className="flex items-start">
      <span className="text-3xl mr-4">{category.icon}</span>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {category.title}
        </h3>
        <p className="text-gray-600">{category.description}</p>
      </div>
    </div>
  </Link>
);

// ✅ Ticker Card
const MetricCard = ({ title, value, iconUrl }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
    {iconUrl && <img src={iconUrl} alt={title} className="w-10 h-10 mx-auto mb-3" />}
    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
    <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
  </div>
);

export default HomePage;
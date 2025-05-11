import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError("Failed to fetch article");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return <div>Article not found</div>;

  const renderContent = () => {
    if (!article.content) return null;
    
    // Handle both string (legacy) and array (new) content formats
    if (typeof article.content === 'string') {
      return <div className="prose">{article.content}</div>;
    }

    // Handle JSON content blocks
    return article.content.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return <p key={index} className="mb-4">{block.data.text}</p>;
        case 'heading':
          return <h3 key={index} className="text-xl font-bold mb-3">{block.data.text}</h3>;
        case 'image':
          return (
            <div key={index} className="my-4">
              <img 
                src={block.data.url} 
                alt={block.data.caption || ''}
                className="w-full rounded-lg"
              />
              {block.data.caption && (
                <p className="text-sm text-gray-500 mt-2">{block.data.caption}</p>
              )}
            </div>
          );
        case 'table':
          return (
            <div key={index} className="overflow-x-auto my-4">
              <table className="min-w-full border">
                <thead>
                  <tr>
                    {block.data.headers.map((header, i) => (
                      <th key={i} className="border p-2">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.data.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border p-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        
        {article.summary && (
          <p className="text-lg text-gray-600 mb-6">{article.summary}</p>
        )}

        {article.image_url && (
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="prose max-w-none">
          {renderContent()}
        </div>

        {article.keywords && article.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {article.keywords.map((keyword, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;
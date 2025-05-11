import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
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
  );
};

export default ArticleCard;
// src/pages/QuestionDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { format } from "date-fns";
import Header from "../components/Header";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/${id}`);
        setQuestion(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch question detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!question) return <div className="p-6 text-red-600">Question not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">{question.title}</h1>
      <p className="text-gray-600 mb-4">{question.description}</p>

      {/* Optional Fields */}
      {question.image_url && (
        <div className="mb-4">
          <img src={question.image_url} alt="related" className="rounded max-h-80" />
        </div>
      )}
      {question.file_url && (
        <a
          href={question.file_url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline mb-4 block"
        >
          View Attached File
        </a>
      )}

<div className="text-sm text-gray-500 mt-4">
  <p><strong>Category:</strong> {question.category?.name || "N/A"}</p>
  <p><strong>Type:</strong> {question.prediction_type}</p>
  
  <p><strong>Posted on:</strong> {question.created_at ? format(new Date(question.created_at), 'PPpp') : "N/A"}</p>
</div>


      <div className="mt-6">
        <p className="text-gray-800 text-lg italic">
          More analysis & explanations coming soon...
        </p>
      </div>
    </div>
    </div>
  );
};

export default QuestionDetailPage;

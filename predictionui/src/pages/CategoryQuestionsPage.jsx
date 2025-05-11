import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const CategoryQuestionsPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/questions/category/${categorySlug}`);
        setQuestions(response.data);
      } catch (err) {
        console.error("❌ Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categorySlug]);

  const updateForm = (questionId, data) => {
    setFormState((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ...data,
      },
    }));
  };

  const submitPrediction = async (questionId) => {
    const data = formState[questionId];
    if (!data || (!data.predicted_binary && (!data.predicted_range_min || !data.predicted_range_max))) {
      alert("Please enter a valid prediction");
      return;
    }

    try {
      await api.post("/predictions/", {
        question_id: questionId,
        ...data,
        confidence: parseInt(data.confidence || 70),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Prediction submitted!");
    } catch (error) {
      console.error("❌ Prediction failed:", error);
      alert("Prediction failed");
    }
  };

  const toggleComments = async (questionId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));

    if (!comments[questionId]) {
      try {
        const res = await api.get(`/comments/question/${questionId}`);
        setComments((prev) => ({
          ...prev,
          [questionId]: res.data,
        }));
      } catch (err) {
        console.error("❌ Failed to load comments:", err);
      }
    }
  };

  const handleCommentSubmit = async (questionId) => {
    try {
      await api.post("/comments/", {
        question_id: questionId,
        comment_text: newComment[questionId],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewComment((prev) => ({ ...prev, [questionId]: "" }));
      toggleComments(questionId); // Reload
      toggleComments(questionId);
    } catch (err) {
      console.error("❌ Comment submit failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold capitalize text-indigo-700 mb-6">
          {categorySlug} Predictions
        </h1>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          questions
            .filter((q) =>
              q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((q) => (
              <div key={q.id} className="bg-white p-5 rounded shadow mb-6">
                <h2 className="text-xl font-semibold">{q.title}</h2>
                <p className="text-gray-600 text-sm">{q.description}</p>

                {/* Prediction Input */}
                {q.prediction_type === "binary" && (
                  <div className="mt-3 flex gap-4">
                    <button onClick={() => updateForm(q.id, { predicted_binary: "Yes" })} className="bg-green-500 text-white px-4 py-2 rounded">Yes</button>
                    <button onClick={() => updateForm(q.id, { predicted_binary: "No" })} className="bg-red-500 text-white px-4 py-2 rounded">No</button>
                  </div>
                )}

                {q.prediction_type === "range" && (
                  <div className="mt-3 flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      onChange={(e) => updateForm(q.id, { predicted_range_min: parseFloat(e.target.value) })}
                      className="border p-2 rounded w-24"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      onChange={(e) => updateForm(q.id, { predicted_range_max: parseFloat(e.target.value) })}
                      className="border p-2 rounded w-24"
                    />
                  </div>
                )}

                <div className="mt-2">
                  <label className="text-sm">Confidence (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    defaultValue={70}
                    onChange={(e) => updateForm(q.id, { confidence: e.target.value })}
                    className="ml-2 border rounded px-2 py-1 w-24"
                  />
                </div>

                <button
                  onClick={() => submitPrediction(q.id)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Submit Prediction
                </button>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => navigate(`/questions/${q.id}`)}
                    className="text-indigo-600 hover:underline"
                  >
                    Read Detailed Analysis
                  </button>

                  <button
                    onClick={() => toggleComments(q.id)}
                    className="text-gray-600 hover:underline"
                  >
                    {expandedComments[q.id] ? "Hide Comments" : "View Comments"}
                  </button>

                  <Link
                    to={`/questions/${q.id}/insight`}
                    className="text-blue-600 hover:underline"
                  >
                    View Predictions
                  </Link>
                  <Link to={`/questions/${q.id}/related-articles`} className="text-indigo-600 hover:underline">
                    Must Read
                  </Link>
                </div>

                {/* Comments Section */}
                {expandedComments[q.id] && (
                  <div className="mt-4 border-t pt-4">
                    <textarea
                      placeholder="Write your comment..."
                      className="w-full border p-2 rounded mb-2"
                      value={newComment[q.id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                    />
                    <button
                      onClick={() => handleCommentSubmit(q.id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded mb-4"
                    >
                      Post Comment
                    </button>

                    {/* Render Comments */}
                    <div className="space-y-2">
                      {(comments[q.id] || []).map((c) => (
                        <div key={c.id} className="bg-gray-100 p-2 rounded">
                          <p className="text-sm">{c.comment_text}</p>
                          <span className="text-xs text-gray-500">— User {c.user_id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default CategoryQuestionsPage;
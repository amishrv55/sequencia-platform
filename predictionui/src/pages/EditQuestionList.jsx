import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

function EditQuestionList() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/questions/")
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Failed to load questions", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Questions</h2>
      {questions.map(q => (
        <div key={q.id} className="border p-3 mb-3 rounded">
          <h3 className="text-lg font-semibold">{q.title}</h3>
          <button
            className="mt-2 text-blue-600 underline"
            onClick={() => navigate(`/admin/questions/edit/${q.id}`)}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}

export default EditQuestionList;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Header from "../components/Header";
import RichArticleEditor from "../components/RichArticleEditor";

const CreateRichArticlePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: [],
    image_url: "",
    approval_rating: "",
    sentiment_score: "",
    keywords: []
  });
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [error, setError] = useState(null);

  const addContentBlock = (type, data) => {
    setForm(prev => ({
      ...prev,
      content: [...prev.content, { type, data }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert content blocks to plain objects
      const payload = {
        title: form.title,
        summary: form.summary,
        content: form.content.map(block => ({
          type: block.type,
          data: block.data
        })),
        image_url: form.image_url || null,
        approval_rating: form.approval_rating ? parseFloat(form.approval_rating) : null,
        sentiment_score: form.sentiment_score ? parseFloat(form.sentiment_score) : null,
        keywords: form.keywords
      };
  
      const response = await api.post("/articles/", payload);
      alert("Article created successfully!");
      navigate("/admin/articles");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 422) {
          const errorDetails = err.response.data.detail;
          if (Array.isArray(errorDetails)) {
            const formattedErrors = errorDetails.map(error => 
              `${error.loc.join('.')}: ${error.msg}`
            );
            setError(formattedErrors.join('\n'));
          } else {
            setError(errorDetails);
          }
        } else {
          setError(err.response.data.message || "Failed to create article");
        }
      } else {
        setError("Network error - please try again");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({...form, summary: e.target.value})}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Featured Image URL</label>
            <input
              value={form.image_url}
              onChange={(e) => setForm({...form, image_url: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Approval Rating (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.approval_rating}
                onChange={(e) => setForm({...form, approval_rating: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Sentiment Score (-1 to 1)</label>
              <input
                type="number"
                min="-1"
                max="1"
                step="0.1"
                value={form.sentiment_score}
                onChange={(e) => setForm({...form, sentiment_score: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Keywords</label>
            <div className="flex gap-2">
              <input
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Add keyword"
              />
              <button
                type="button"
                onClick={() => {
                  if (currentKeyword.trim()) {
                    setForm({
                      ...form,
                      keywords: [...form.keywords, currentKeyword.trim()]
                    });
                    setCurrentKeyword("");
                  }
                }}
                className="bg-gray-200 px-4 rounded"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.keywords.map((kw, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {kw}
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        keywords: form.keywords.filter((_, idx) => idx !== i)
                      });
                    }}
                    className="ml-1 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Content *</label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addContentBlock("paragraph", { text: "" })}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded"
                >
                  Add Paragraph
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock("heading", { text: "" })}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded"
                >
                  Add Heading
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock("image", { url: "", caption: "" })}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded"
                >
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock("table", { 
                    headers: ["Header 1", "Header 2"], 
                    rows: [["Data 1", "Data 2"]] 
                  })}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded"
                >
                  Add Table
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock("chart", { 
                    chartType: "bar",
                    labels: ["Jan", "Feb", "Mar"],
                    datasets: [{
                      label: "Dataset 1",
                      data: [10, 20, 30]
                    }]
                  })}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded"
                >
                  Add Chart
                </button>
              </div>

              {form.content.map((block, index) => (
                <div key={index} className="border p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{block.type}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setForm({
                          ...form,
                          content: form.content.filter((_, i) => i !== index)
                        });
                      }}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  {block.type === "paragraph" && (
                    <textarea
                      value={block.data.text}
                      onChange={(e) => {
                        const newContent = [...form.content];
                        newContent[index].data.text = e.target.value;
                        setForm({...form, content: newContent});
                      }}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  )}

                  {block.type === "heading" && (
                    <input
                      type="text"
                      value={block.data.text}
                      onChange={(e) => {
                        const newContent = [...form.content];
                        newContent[index].data.text = e.target.value;
                        setForm({...form, content: newContent});
                      }}
                      className="w-full p-2 border rounded"
                    />
                  )}

                  {block.type === "image" && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={block.data.url}
                        onChange={(e) => {
                          const newContent = [...form.content];
                          newContent[index].data.url = e.target.value;
                          setForm({...form, content: newContent});
                        }}
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Caption"
                        value={block.data.caption}
                        onChange={(e) => {
                          const newContent = [...form.content];
                          newContent[index].data.caption = e.target.value;
                          setForm({...form, content: newContent});
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}

                  {block.type === "table" && (
                    <div className="space-y-2">
                      <div>
                        <label className="block mb-1">Headers</label>
                        <div className="flex gap-2">
                          {block.data.headers.map((header, i) => (
                            <input
                              key={i}
                              type="text"
                              value={header}
                              onChange={(e) => {
                                const newContent = [...form.content];
                                newContent[index].data.headers[i] = e.target.value;
                                setForm({...form, content: newContent});
                              }}
                              className="p-2 border rounded"
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newContent = [...form.content];
                              newContent[index].data.headers.push("");
                              setForm({...form, content: newContent});
                            }}
                            className="bg-gray-200 px-2 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1">Rows</label>
                        {block.data.rows.map((row, i) => (
                          <div key={i} className="flex gap-2 mb-2">
                            {row.map((cell, j) => (
                              <input
                                key={j}
                                type="text"
                                value={cell}
                                onChange={(e) => {
                                  const newContent = [...form.content];
                                  newContent[index].data.rows[i][j] = e.target.value;
                                  setForm({...form, content: newContent});
                                }}
                                className="p-2 border rounded"
                              />
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newContent = [...form.content];
                                newContent[index].data.rows.splice(i, 1);
                                setForm({...form, content: newContent});
                              }}
                              className="bg-red-100 text-red-800 px-2 rounded"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newContent = [...form.content];
                            newContent[index].data.rows.push(
                              Array(block.data.headers.length).fill("")
                            );
                            setForm({...form, content: newContent});
                          }}
                          className="bg-gray-200 px-2 py-1 rounded text-sm"
                        >
                          Add Row
                        </button>
                      </div>
                    </div>
                  )}

                  {block.type === "chart" && (
                    <div className="space-y-2">
                      <select
                        value={block.data.chartType}
                        onChange={(e) => {
                          const newContent = [...form.content];
                          newContent[index].data.chartType = e.target.value;
                          setForm({...form, content: newContent});
                        }}
                        className="w-full p-2 border rounded"
                      >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="pie">Pie Chart</option>
                      </select>
                      
                      <div>
                        <label className="block mb-1">Labels</label>
                        <div className="flex gap-2 flex-wrap">
                          {block.data.labels.map((label, i) => (
                            <div key={i} className="flex items-center">
                              <input
                                type="text"
                                value={label}
                                onChange={(e) => {
                                  const newContent = [...form.content];
                                  newContent[index].data.labels[i] = e.target.value;
                                  setForm({...form, content: newContent});
                                }}
                                className="p-2 border rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newContent = [...form.content];
                                  newContent[index].data.labels.splice(i, 1);
                                  // Also remove corresponding data points
                                  newContent[index].data.datasets.forEach(ds => {
                                    ds.data.splice(i, 1);
                                  });
                                  setForm({...form, content: newContent});
                                }}
                                className="ml-1 bg-red-100 text-red-800 px-2 rounded"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newContent = [...form.content];
                              newContent[index].data.labels.push("");
                              // Add corresponding data points
                              newContent[index].data.datasets.forEach(ds => {
                                ds.data.push(0);
                              });
                              setForm({...form, content: newContent});
                            }}
                            className="bg-gray-200 px-2 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block mb-1">Datasets</label>
                        {block.data.datasets.map((dataset, i) => (
                          <div key={i} className="mb-4 p-3 border rounded">
                            <div className="flex justify-between mb-2">
                              <span>Dataset {i + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newContent = [...form.content];
                                  newContent[index].data.datasets.splice(i, 1);
                                  setForm({...form, content: newContent});
                                }}
                                className="text-red-500"
                              >
                                Remove Dataset
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Dataset label"
                                value={dataset.label}
                                onChange={(e) => {
                                  const newContent = [...form.content];
                                  newContent[index].data.datasets[i].label = e.target.value;
                                  setForm({...form, content: newContent});
                                }}
                                className="w-full p-2 border rounded"
                              />
                              
                              <div>
                                <label className="block mb-1">Data Points</label>
                                <div className="flex gap-2 flex-wrap">
                                  {dataset.data.map((point, j) => (
                                    <div key={j} className="flex items-center">
                                      <input
                                        type="number"
                                        value={point}
                                        onChange={(e) => {
                                          const newContent = [...form.content];
                                          newContent[index].data.datasets[i].data[j] = Number(e.target.value);
                                          setForm({...form, content: newContent});
                                        }}
                                        className="p-2 border rounded w-20"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => {
                            const newContent = [...form.content];
                            newContent[index].data.datasets.push({
                              label: `Dataset ${newContent[index].data.datasets.length + 1}`,
                              data: Array(block.data.labels.length).fill(0)
                            });
                            setForm({...form, content: newContent});
                          }}
                          className="bg-gray-200 px-2 py-1 rounded text-sm"
                        >
                          Add Dataset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Article
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRichArticlePage;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  Legend, PieChart, Pie, Cell, LineChart, Line, ReferenceLine
} from "recharts";
import Header from "../components/Header";

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

const PredictionInsightPage = () => {
  const { questionId } = useParams();
  const [predictions, setPredictions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const qRes = await api.get(`/questions/${questionId}`);
      setQuestion(qRes.data);

      const res = await api.get(`/predictions/question/${questionId}`);
      setPredictions(res.data);

      // Fetch time series data if available
      try {
        const tsRes = await api.get(`/predictions/timeseries/${questionId}`);
        setTimeSeriesData(tsRes.data);
      } catch (err) {
        console.log("Time series data not available");
      }
    };

    fetchData();
  }, [questionId]);

  // Process binary predictions
  const binaryStats = predictions.reduce((acc, p) => {
    if (p.predicted_binary === "yes") {
      acc.yesCount++;
      acc.yesConfidenceTotal += p.confidence || 0;
    } else if (p.predicted_binary === "no") {
      acc.noCount++;
      acc.noConfidenceTotal += p.confidence || 0;
    }
    return acc;
  }, { yesCount: 0, noCount: 0, yesConfidenceTotal: 0, noConfidenceTotal: 0 });

  const binaryChartData = [
    {
      name: "Yes",
      count: binaryStats.yesCount,
      avgConfidence: binaryStats.yesCount > 0 
        ? Math.round(binaryStats.yesConfidenceTotal / binaryStats.yesCount) 
        : 0,
    },
    {
      name: "No",
      count: binaryStats.noCount,
      avgConfidence: binaryStats.noCount > 0 
        ? Math.round(binaryStats.noConfidenceTotal / binaryStats.noCount) 
        : 0,
    },
  ];

  // Process range predictions
  const rangeData = predictions.reduce((acc, p) => {
    if (p.predicted_range_min !== undefined && p.predicted_range_max !== undefined) {
      const midPoint = (p.predicted_range_min + p.predicted_range_max) / 2;
      const range = Math.ceil(midPoint / 10) * 10; // Group by 10s
      const key = `${range-10}-${range}`;
      
      if (!acc[key]) {
        acc[key] = { count: 0, minTotal: 0, maxTotal: 0, confidenceTotal: 0 };
      }
      acc[key].count++;
      acc[key].minTotal += p.predicted_range_min;
      acc[key].maxTotal += p.predicted_range_max;
      acc[key].confidenceTotal += p.confidence || 0;
    }
    return acc;
  }, {});

  const rangeChartData = Object.entries(rangeData).map(([range, stats]) => ({
    range,
    count: stats.count,
    avgMin: stats.minTotal / stats.count,
    avgMax: stats.maxTotal / stats.count,
    avgConfidence: stats.confidenceTotal / stats.count,
  })).sort((a, b) => parseFloat(a.range.split('-')[0]) - parseFloat(b.range.split('-')[0]));

  // Calculate overall statistics
  const totalPredictions = predictions.length;
  const avgConfidence = predictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / totalPredictions || 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">
          Prediction Insights Dashboard
        </h1>

        {question && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
            <p className="text-gray-600 mb-4">{question.description}</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-indigo-50 px-4 py-2 rounded">
                <span className="text-sm text-indigo-600">Type:</span> 
                <span className="ml-2 font-medium">{question.prediction_type}</span>
              </div>
              <div className="bg-indigo-50 px-4 py-2 rounded">
                <span className="text-sm text-indigo-600">Total Predictions:</span> 
                <span className="ml-2 font-medium">{totalPredictions}</span>
              </div>
              <div className="bg-indigo-50 px-4 py-2 rounded">
                <span className="text-sm text-indigo-600">Avg Confidence:</span> 
                <span className="ml-2 font-medium">{Math.round(avgConfidence)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Time Series Chart (if data available) */}
        {timeSeriesData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4">Prediction Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={question?.prediction_type === "binary" ? [0, 100] : ['auto', 'auto']} />
                <Tooltip />
                <Legend />
                {question?.prediction_type === "binary" ? (
                  <Line 
                    type="monotone" 
                    dataKey="yesPercentage" 
                    name="% Yes" 
                    stroke="#6366F1" 
                    strokeWidth={2} 
                    dot={{ r: 3 }}
                  />
                ) : (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="avgMin" 
                      name="Average Min" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgMax" 
                      name="Average Max" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Binary Prediction Insights */}
        {question?.prediction_type === "binary" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Vote Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={binaryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {binaryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Votes vs Confidence</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={binaryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="count" 
                    name="Vote Count" 
                    fill="#6366F1" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="avgConfidence" 
                    name="Avg Confidence (%)" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Range Prediction Insights */}
        {question?.prediction_type === "range" && rangeChartData.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Prediction Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={rangeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Number of Predictions" 
                    fill="#6366F1" 
                    radius={[4, 4, 0, 0]}
                  />
                  <ReferenceLine 
                    y={0} 
                    stroke="#000" 
                    ifOverflow="extendDomain" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Average Prediction Ranges</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={rangeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="avgMin" 
                    name="Average Min" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="avgMax" 
                    name="Average Max" 
                    fill="#F59E0B" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Prediction Confidence Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={predictions.map(p => ({ ...p, confidence: p.confidence || 0 }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="confidence" 
                type="number" 
                domain={[50, 100]} 
                label={{ value: 'Confidence (%)', position: 'insideBottomRight' }}
              />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="count" 
                name="Number of Predictions" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              >
                {predictions.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.predicted_binary === "yes" ? '#6366F1' : '#EF4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PredictionInsightPage;
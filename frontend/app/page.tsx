"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./styles.css";  // Import the CSS file

// Define the structure of CSV row data
interface CsvRow {
  timestamp: number;
  x: number;
  y: number;
  z: number;
  norm: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);

  // Fetch stats on page load to show previously uploaded data
  useEffect(() => {
    fetchStats();
  }, []);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/upload/", formData);
      setUploadSuccess(true);
      alert("File uploaded successfully! Click 'Get Stats' to see results.");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/stats/");
      setStats(res.data);

      // Generate synthetic CSV data for visualization
      if (res.data.length > 0) {
        const latestStats = res.data[res.data.length - 1]; // Use latest uploaded data
        const generatedData = Array.from({ length: 50 }, (_, i) => ({
          timestamp: i,
          x: latestStats.mean_x + Math.sin(i / 5) * latestStats.std_x,
          y: latestStats.mean_y + Math.cos(i / 5) * latestStats.std_y,
          z: latestStats.mean_z + Math.sin(i / 5) * latestStats.std_z,
          norm: Math.sqrt(
            Math.pow(latestStats.mean_x, 2) +
            Math.pow(latestStats.mean_y, 2) +
            Math.pow(latestStats.mean_z, 2)
          )
        }));
        setCsvData(generatedData);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div className="container">
      <h1>CSV File Uploader & Data Visualization</h1>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={uploadFile}>Upload</button>
      <button onClick={fetchStats} disabled={!uploadSuccess}>Get Stats</button>

      <h2>Results:</h2>
      {stats.length === 0 ? <p>No results yet. Upload a file or refresh to see old results.</p> :
        <ul>
          {stats.map((s, i) => (
            <li key={i}>
              <strong>Min X:</strong> {s.min_x}, <strong>Max X:</strong> {s.max_x},
              <strong>Mean X:</strong> {s.mean_x}, <strong>Median X:</strong> {s.median_x},
              <strong>Std X:</strong> {s.std_x}, <strong>Norm:</strong> {s.norm}
            </li>
          ))}
        </ul>
      }

      <h2>Data Visualization</h2>
      {csvData.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={csvData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="x" stroke="#8884d8" />
              <Line type="monotone" dataKey="y" stroke="#82ca9d" />
              <Line type="monotone" dataKey="z" stroke="#ffc658" />
              <Line type="monotone" dataKey="norm" stroke="#ff0000" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import MetadataDetails from "./MetadataDetails";

const API = "http://localhost:8000";

interface Dataset {
  file_name: string;
  dataset_title?: string;
  description?: string;
  category?: string;
  tags?: string;
  row_labels?: string;
  update_frequency?: string;
  data_provided_by?: string;
  contact_email?: string;
  licensing?: string;
  data_dictionary?: string;
  resource_name?: string;
  last_updated_date?: string;
  editing?: boolean; // local-only flag for UI state
}

function Overview() {
  const [inventory, setInventory] = useState<Dataset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // Load data
  const refreshInventory = async () => {
    const res = await axios.get(`${API}/inventory`);
    setInventory(res.data);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");
    const form = new FormData();
    form.append("file", file);
    await axios.post(`${API}/upload`, form);
    await refreshInventory();
    setFile(null);
  };

  useEffect(() => {
    refreshInventory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">📘 Landover Hills Data Inventory System</h1>

      <div className="mb-6 bg-white p-4 rounded-lg shadow flex items-center">
        <input
          type="file"
          accept="*/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mr-3 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload File
        </button>
        <button
          onClick={() => window.open(`${API}/export`)}
          className="ml-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="p-2">File</th>
              <th className="p-2">Dataset Title</th>
              <th className="p-2">Update Frequency</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{item.file_name}</td>
                <td className="p-2">{item.dataset_title || "—"}</td>
                <td className="p-2">{item.update_frequency || "—"}</td>
                <td className="p-2">
                  <button
                    onClick={() => navigate(`/details/${encodeURIComponent(item.file_name)}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    🔍 View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/details/:file_name" element={<MetadataDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
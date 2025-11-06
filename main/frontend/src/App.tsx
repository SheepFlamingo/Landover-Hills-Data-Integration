import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000"; // your FastAPI backend

interface Dataset {
  file_name: string;
  dataset_name?: string;
  description?: string;
  department?: string;
  format?: string;
  update_frequency?: string;
  public?: string;
  metadata_status?: string;
  notes?: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [inventory, setInventory] = useState<Dataset[]>([]);

  // Load inventory from backend
  const refreshInventory = async () => {
    const res = await axios.get(`${API}/inventory`);
    setInventory(res.data);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    const form = new FormData();
    form.append("file", file);
    await axios.post(`${API}/upload`, form);
    await refreshInventory();
    setFile(null);
  };

  // Handle metadata save
  const handleMetadataSubmit = async (item: Dataset) => {
    const form = new FormData();
    Object.entries(item).forEach(([k, v]) => form.append(k, v as string));
    await axios.post(`${API}/metadata`, form);
    await refreshInventory();
  };

  // Handle export to Excel
  const handleExport = async () => {
    window.open(`${API}/export`);
  };

  // Refresh inventory on load
  useEffect(() => {
    refreshInventory();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "1rem" }}>📂 Landover Hills Data Inventory System</h1>

      <div style={{ marginBottom: "1.5rem", background: "#fff", padding: "1rem", borderRadius: "8px" }}>
        <input
          type="file"
          accept="*/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ marginRight: "1rem" }}
        />
        <button onClick={handleUpload}>Upload File</button>
        <button onClick={handleExport} style={{ marginLeft: "1rem" }}>Export to Excel</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
        <thead>
          <tr style={{ backgroundColor: "#222", color: "white" }}>
            <th style={{ padding: "8px" }}>File Name</th>
            <th>Dataset Name</th>
            <th>Description</th>
            <th>Department</th>
            <th>Format</th>
            <th>Update Frequency</th>
            <th>Public</th>
            <th>Metadata Status</th>
            <th>Notes</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px" }}>{item.file_name}</td>
              <td><input onChange={(e) => item.dataset_name = e.target.value} defaultValue={item.dataset_name || ""} /></td>
              <td><input onChange={(e) => item.description = e.target.value} defaultValue={item.description || ""} /></td>
              <td><input onChange={(e) => item.department = e.target.value} defaultValue={item.department || ""} /></td>
              <td><input onChange={(e) => item.format = e.target.value} defaultValue={item.format || ""} /></td>
              <td><input onChange={(e) => item.update_frequency = e.target.value} defaultValue={item.update_frequency || ""} /></td>
              <td><input onChange={(e) => item.public = e.target.value} defaultValue={item.public || ""} /></td>
              <td><input onChange={(e) => item.metadata_status = e.target.value} defaultValue={item.metadata_status || ""} /></td>
              <td><input onChange={(e) => item.notes = e.target.value} defaultValue={item.notes || ""} /></td>
              <td>
                <button onClick={() => handleMetadataSubmit(item)}>💾</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
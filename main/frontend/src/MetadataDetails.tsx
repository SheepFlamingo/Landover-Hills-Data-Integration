import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
}

export default function MetadataDetails() {
  const { file_name } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Dataset | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API}/inventory`);
      const found = res.data.find(
        (d: Dataset) => d.file_name === decodeURIComponent(file_name || "")
      );
      setData(found || null);
    };
    fetchData();
  }, [file_name]);

  if (!data) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h2 className="text-xl font-bold mb-6">📋 Metadata Details</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full border border-gray-200 text-sm">
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key} className="border-t">
                <td className="font-semibold p-2 capitalize">{key.replace(/_/g, " ")}</td>
                <td className="p-2">{value || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ⬅ Back to Overview
      </button>
    </div>
  );
}
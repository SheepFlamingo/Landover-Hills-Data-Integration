import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://127.0.0.1:8000";

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
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Dataset | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API}/inventory`);
      const found = res.data.find(
        (d: Dataset) => d.file_name === decodeURIComponent(file_name || "")
      );
      setData(found || null);
      setForm(found || null);
    };
    fetchData();
  }, [file_name]);

  if (!data || !form) return <p className="p-8">Loading...</p>;

  const metadataFields = [
    {
      name: "Dataset Title",
      desc: "Concise, descriptive name of the dataset that reflects its contents. Avoid abbreviations.",
      key: "dataset_title",
    },
    {
      name: "Description",
      desc: "Detailed summary explaining what the dataset contains, its purpose, and how it can be used. Mention data sources and update frequency.",
      key: "description",
    },
    {
      name: "Category",
      desc: "Broad classification under which the dataset falls in the portal.",
      key: "category",
    },
    {
      name: "Tags / Keywords",
      desc: "Comma-separated keywords to help users search and discover the dataset easily.",
      key: "tags",
    },
    {
      name: "Row Labels",
      desc: "The key field that uniquely identifies each record or entry in the dataset.",
      key: "row_labels",
    },
    {
      name: "Update Frequency",
      desc: "How often the dataset is refreshed or updated.",
      key: "update_frequency",
    },
    {
      name: "Data Provided By (Agency / Department)",
      desc: "The official county department, office, or agency responsible for producing or maintaining the dataset.",
      key: "data_provided_by",
    },
    {
      name: "Contact Email",
      desc: "Email address for questions or feedback about the dataset.",
      key: "contact_email",
    },
    {
      name: "Licensing & Attribution",
      desc: "Specify data usage rights and attribution requirements.",
      key: "licensing",
    },
    {
      name: "Data Dictionary / Attachments",
      desc: "Upload or link any supporting documentation explaining data fields, codes, or classifications.",
      key: "data_dictionary",
    },
    {
      name: "Resource Name",
      desc: "Name of the source of the dataset.",
      key: "resource_name",
    },
    {
      name: "Last Updated Date",
      desc: "The date when the dataset or metadata was last modified.",
      key: "last_updated_date",
    },
  ];

  const handleChange = (key: keyof Dataset, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleToggleEdit = async () => {
    if (isEditing && form) {
      // Save changes
      try {
        await axios.post(`${API}/metadata`, form);
        setData(form);
      } catch (error) {
        console.error("Failed to save metadata", error);
        // Optionally handle error feedback here
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h2 className="text-xl font-bold mb-6">📋 Metadata Details</h2>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Field Name</th>
              <th className="p-2 text-left">Definition / Description</th>
              <th className="p-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {metadataFields.map((f, idx) => (
              <tr key={idx} className="border-t">
                <td className="font-semibold p-2">{f.name}</td>
                <td className="p-2 text-gray-700">{f.desc}</td>
                <td className="p-2 bg-gray-50">
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      value={form[f.key as keyof Dataset] || ""}
                      onChange={(e) => handleChange(f.key as keyof Dataset, e.target.value)}
                    />
                  ) : form[f.key as keyof Dataset] ? (
                    <span>{form[f.key as keyof Dataset]}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleToggleEdit}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isEditing ? "Save Changes" : "Edit Metadata"}
      </button>

      {!isEditing && (
        <button
          onClick={() => navigate("/")}
          className="mt-6 ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ⬅ Back to Overview
        </button>
      )}
    </div>
  );
}
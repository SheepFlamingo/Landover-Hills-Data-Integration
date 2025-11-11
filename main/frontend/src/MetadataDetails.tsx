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
  const [form, setForm] = useState<Dataset | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API}/inventory`);
      const found = res.data.find(
        (d: Dataset) => d.file_name === decodeURIComponent(file_name || "")
      );
      setForm(found || null);
    };
    fetchData();
  }, [file_name]);

  if (!form) return <p className="p-8">Loading...</p>;

  const handleChange = (key: keyof Dataset, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (form) {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v as string));
      await axios.post(`${API}/metadata`, formData);
      setIsEditing(false);
    }
  };

  const metadataFields = [
    {
      key: "dataset_title",
      name: "Dataset Title",
      description:
        "Concise, descriptive name of the dataset that reflects its contents. Avoid abbreviations.",
      example: "Town of XYZ",
    },
    {
      key: "description",
      name: "Description",
      description:
        "Detailed summary explaining what the dataset contains, its purpose, and how it can be used. Mention data sources and update frequency.",
      example:
        "This dataset contains information about the programs of Town XYZ.",
    },
    {
      key: "category",
      name: "Category",
      description:
        "Broad classification under which the dataset falls in the portal.",
      example:
        "Public Safety / Health / Transportation / Finance / Environment",
    },
    {
      key: "tags",
      name: "Tags / Keywords",
      description:
        "Comma-separated keywords to help users search and discover the dataset easily.",
      example: "crime, police, incidents, safety, pgcounty, Town XYZ",
    },
    {
      key: "row_labels",
      name: "Row Labels",
      description:
        "The key field that uniquely identifies each record or entry in the dataset.",
      example: "Incident ID / Permit Number / Case ID",
    },
    {
      key: "update_frequency",
      name: "Update Frequency",
      description: "How often the dataset is refreshed or updated.",
      example: "Monthly / Quarterly / Annually / As Needed",
    },
    {
      key: "data_provided_by",
      name: "Data Provided By (Agency / Department)",
      description:
        "The official county department, office, or agency responsible for producing or maintaining the dataset.",
      example: "Town of XYZ",
    },
    {
      key: "contact_email",
      name: "Contact Email",
      description:
        "Email address for questions or feedback about the dataset.",
      example: "dataservices@pgcmd.gov",
    },
    {
      key: "licensing",
      name: "Licensing & Attribution",
      description:
        "Specify data usage rights and attribution requirements.",
      example: "Prince George’s County Government",
    },
    {
      key: "data_dictionary",
      name: "Data Dictionary / Attachments",
      description:
        "Upload or link any supporting documentation explaining data fields, codes, or classifications.",
      example: "Dataset CSV File for Data Definitions",
    },
    {
      key: "resource_name",
      name: "Resource Name",
      description: "Name of the source of the dataset.",
      example: "TOWNXYZ.Budgets",
    },
    {
      key: "last_updated_date",
      name: "Last Updated Date",
      description:
        "The date when the dataset or metadata was last modified.",
      example: "2025-09-29",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h2 className="text-xl font-bold mb-6">
        📋 Metadata for: {form.file_name}
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left w-1/5">Field Name</th>
              <th className="p-2 text-left w-2/5">Definition / Description</th>
              <th className="p-2 text-left w-1/5">Example / Guidance</th>
              <th className="p-2 text-left w-1/5">
                To be Filled by Reporting Agency / Team
              </th>
            </tr>
          </thead>
          <tbody>
            {metadataFields.map((f) => (
              <tr key={f.key} className="border-t align-top">
                <td className="font-semibold p-2">{f.name}</td>
                <td className="p-2 text-gray-700">{f.description}</td>
                <td className="p-2 text-gray-500 italic">{f.example}</td>
                <td className="p-2 bg-gray-50">
                  {isEditing ? (
                    <input
                      type="text"
                      value={form[f.key as keyof Dataset] || ""}
                      onChange={(e) =>
                        handleChange(f.key as keyof Dataset, e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span>{form[f.key as keyof Dataset] || "—"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing ? (
        <button
          onClick={handleSave}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          💾 Save Changes
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ✏️ Edit Metadata
        </button>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-6 ml-3 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        ⬅ Back to Overview
      </button>
    </div>
  );
}
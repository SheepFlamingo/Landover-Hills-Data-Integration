import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CATEGORIES } from "./constants/categories";

const API = process.env.REACT_APP_API_URL || "https://landover-hills-data-integration-api.onrender.com";

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
  const location = useLocation();
  const initialDataset =
    (location.state as { dataset?: Dataset } | undefined)?.dataset || null;
  const [form, setForm] = useState<Dataset | null>(initialDataset);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API}/inventory`);
      const found = res.data.find(
        (d: Dataset) => d.file_name === decodeURIComponent(file_name || "")
      );
      setForm(found || initialDataset);
    };
    fetchData();
  }, [file_name, initialDataset]);

  useEffect(() => {
    if (initialDataset) {
      setForm(initialDataset);
    }
  }, [initialDataset]);

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

  if (!form)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading metadata...</p>
        </div>
      </div>
    );

  const getPlaceholder = (key: string): string => {
    const placeholders: { [key: string]: string } = {
      dataset_title: "e.g., Town of XYZ",
      description: "e.g., This dataset contains information about the programs of Town XYZ.",
      category: "e.g., Public Safety / Health / Transportation / Finance / Environment",
      tags: "e.g., crime, police, incidents, safety, pgcounty, 310, Town XYZ",
      row_labels: "e.g., Incident ID / Permit Number / Case ID",
      update_frequency: "e.g., Monthly / Quarterly / Annually / As Needed",
      data_provided_by: "e.g., Town of XYZ",
      contact_email: "e.g., data@yourmunicipality.gov",
      licensing: "e.g., Your Municipality Name",
      data_dictionary: "e.g., Dataset CSV File for Data Definitions",
      resource_name: "e.g., TOWNXYZ.Budgets",
      last_updated_date: "e.g., 2025-09-29",
    };
    return placeholders[key] || "Enter value...";
  };

  const metadataFields = [
    {
      label: "Dataset Title",
      key: "dataset_title",
      description: "Concise, descriptive name of the dataset that reflects its contents. Avoid abbreviations.",
      example: "Town of XYZ"
    },
    {
      label: "Description",
      key: "description",
      description: "Detailed summary explaining what the dataset contains, its purpose, and how it can be used. Mention data sources and update frequency.",
      example: "This dataset contains information about the programs of Town XYZ."
    },
    {
      label: "Category",
      key: "category",
      description: "Broad classification under which the dataset falls in the portal.",
      example: "Public Safety / Health / Transportation / Finance / Environment"
    },
    {
      label: "Tags / Keywords",
      key: "tags",
      description: "Comma-separated keywords to help users search and discover the dataset easily.",
      example: "crime, police, incidents, safety, pgcounty, 310, Town XYZ"
    },
    {
      label: "Row Labels",
      key: "row_labels",
      description: "The key field that uniquely identifies each record or entry in the dataset.",
      example: "Incident ID / Permit Number / Case ID"
    },
    {
      label: "Update Frequency",
      key: "update_frequency",
      description: "How often the dataset is refreshed or updated.",
      example: "Monthly / Quarterly / Annually / As Needed"
    },
    {
      label: "Data Provided By (Agency / Department)",
      key: "data_provided_by",
      description: "The official county department, office, or agency responsible for producing or maintaining the dataset.",
      example: "Town of XYZ"
    },
    {
      label: "Contact Email",
      key: "contact_email",
      description: "Email address for questions or feedback about the dataset.",
        example: "data@yourmunicipality.gov"
    },
    {
      label: "Licensing & Attribution",
      key: "licensing",
      description: "Specify data usage rights and attribution requirements.",
        example: "Your Municipality Name"
    },
    {
      label: "Data Dictionary / Attachments",
      key: "data_dictionary",
      description: "Upload or link any supporting documentation explaining data fields, codes, or classifications.",
      example: "Dataset CSV File for Data Definitions"
    },
    {
      label: "Resource Name",
      key: "resource_name",
      description: "Name of the source of the dataset.",
      example: "TOWNXYZ.Budgets"
    },
    {
      label: "Last Updated Date",
      key: "last_updated_date",
      description: "The date when the dataset or metadata was last modified.",
      example: "2025-09-29"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      <header className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 text-white py-8 shadow-xl border-b-4 border-indigo-900/20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Metadata Editor</h1>
              <p className="text-blue-100 text-sm mt-1">Edit dataset information</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl backdrop-blur-md transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
          >
            Back to Overview
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-12 px-6 pb-12">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-6 border-b border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Dataset Metadata
            </h2>
            <p className="text-indigo-700 font-semibold text-lg">
              {form.file_name}
            </p>
          </div>

          {/* Metadata Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 border-b-2 border-indigo-200">
                  <th className="p-5 text-left font-bold text-gray-800 w-1/4 text-base">Field</th>
                  <th className="p-5 text-left font-bold text-gray-800 w-2/5 text-base">Description & Examples</th>
                  <th className="p-5 text-left font-bold text-gray-800 text-base">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {metadataFields.map((field) => (
                  <tr key={field.key} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-150 group">
                    <td className="p-5 font-semibold text-gray-700 group-hover:text-indigo-700 align-top">
                      {field.label}
                    </td>
                    <td className="p-5 align-top">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {field.description}
                        </p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-3 rounded-r-lg">
                          <p className="text-xs font-semibold text-indigo-700 mb-1">Example:</p>
                          <p className="text-sm text-indigo-800 font-medium italic">
                            {field.example}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 align-top">
                      {isEditing ? (
                        field.key === "category" ? (
                          <select
                            value={(form[field.key as keyof Dataset] as string) || ""}
                            onChange={(e) =>
                              handleChange(field.key as keyof Dataset, e.target.value)
                            }
                            className="border-2 border-gray-300 rounded-xl px-4 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium text-gray-700 hover:border-indigo-400 bg-white"
                          >
                            <option value="">— Select Category —</option>
                            {CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={form[field.key as keyof Dataset] || ""}
                            onChange={(e) =>
                              handleChange(field.key as keyof Dataset, e.target.value)
                            }
                            className="border-2 border-gray-300 rounded-xl px-4 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium text-gray-700 hover:border-indigo-400"
                            placeholder={getPlaceholder(field.key)}
                          />
                        )
                      ) : (
                        <span className="text-gray-800 font-medium">
                          {field.key === "category" && form[field.key as keyof Dataset] ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                              {form[field.key as keyof Dataset]}
                            </span>
                          ) : (
                            form[field.key as keyof Dataset] || (
                              <span className="text-gray-400 italic">—</span>
                            )
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-gray-200 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold hover:scale-105"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold hover:scale-105"
              >
                Edit Metadata
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

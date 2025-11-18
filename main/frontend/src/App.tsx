import React, { useState, useEffect } from "react";
import axios from "axios";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import MetadataDetails from "./MetadataDetails";

const API = "http://127.0.0.1:8000";

interface Dataset {
  file_name: string;
  dataset_title?: string;
  uploaded?: string;
  category?: string;
}

const CATEGORIES = [
  "Administrative",
  "Agriculture",
  "Biota",
  "Boundaries",
  "Budget",
  "Business & Economy",
  "Demographic",
  "Education",
  "Elevation",
  "Energy and Environment",
  "Geoscientific",
  "Government",
  "Health and Human Services",
  "Historic",
  "Housing",
  "Hydrology",
  "Imagery",
  "Location",
  "Military",
  "Planning",
  "Public Safety",
  "Society",
  "Structure",
  "Transportation",
  "Utility",
  "Weather"
].sort();

function Overview() {
  const [inventory, setInventory] = useState<Dataset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [townName, setTownName] = useState<string>(() => {
    const saved = localStorage.getItem("townName");
    return saved || "";
  });
  const [showTownModal, setShowTownModal] = useState(() => {
    return !localStorage.getItem("townName");
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();

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

  const handleTownSubmit = () => {
    if (townName.trim()) {
      localStorage.setItem("townName", townName.trim());
      setShowTownModal(false);
    }
  };

  useEffect(() => {
    refreshInventory();
  }, []);

  const filteredInventory = selectedCategory
    ? inventory.filter((item) => item.category === selectedCategory)
    : inventory;

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleCategoryChange = async (fileName: string, newCategory: string) => {
    try {
      const formData = new FormData();
      formData.append("file_name", fileName);
      formData.append("category", newCategory);
      
      // Get existing metadata for this file
      const existingItem = inventory.find(item => item.file_name === fileName);
      if (existingItem) {
        formData.append("dataset_title", existingItem.dataset_title || "");
        formData.append("description", (existingItem as any).description || "");
        formData.append("tags", (existingItem as any).tags || "");
        formData.append("row_labels", (existingItem as any).row_labels || "");
        formData.append("update_frequency", (existingItem as any).update_frequency || "");
        formData.append("data_provided_by", (existingItem as any).data_provided_by || "");
        formData.append("contact_email", (existingItem as any).contact_email || "");
        formData.append("licensing", (existingItem as any).licensing || "");
        formData.append("data_dictionary", (existingItem as any).data_dictionary || "");
        formData.append("resource_name", (existingItem as any).resource_name || "");
        formData.append("last_updated_date", (existingItem as any).last_updated_date || "");
      }
      
      await axios.post(`${API}/metadata`, formData);
      await refreshInventory();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-filter-container')) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      {/* Town Selection Modal */}
      {showTownModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h2>
            <p className="text-gray-600 mb-6">
              Please enter your municipality name to get started.
            </p>
            <input
              type="text"
              value={townName}
              onChange={(e) => setTownName(e.target.value)}
              placeholder="e.g., Town of Landover Hills"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onKeyPress={(e) => e.key === "Enter" && handleTownSubmit()}
              autoFocus
            />
            <button
              onClick={handleTownSubmit}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 text-white py-8 shadow-xl border-b-4 border-indigo-900/20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {townName || "Municipality"} Data Inventory
              </h1>
              <p className="text-blue-100 text-sm mt-1">Municipal Data Integration Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                localStorage.removeItem("townName");
                setShowTownModal(true);
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-200 text-sm font-medium"
            >
              Change Municipality
            </button>
            <button
              onClick={() => window.open(`${API}/export`)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl backdrop-blur-md transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </header>

      {/* Upload Section */}
      <div className="max-w-7xl mx-auto mt-12 px-6">
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/60 hover:shadow-3xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload New Dataset
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="*/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl px-6 py-4 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-200 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      {file ? file.name : "Choose a file..."}
                    </span>
                    <span className="text-indigo-600 font-semibold">Browse</span>
                  </div>
                </label>
                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold hover:scale-105"
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-10 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/60 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Dataset Inventory</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredInventory.length} of {inventory.length} dataset{inventory.length !== 1 ? 's' : ''} {selectedCategory ? `in ${selectedCategory}` : 'available'}
                </p>
              </div>
              <div className="relative w-full sm:w-64 category-filter-container">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Category
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedCategory ? selectedCategory : categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setShowCategoryDropdown(true);
                      if (e.target.value !== selectedCategory) {
                        setSelectedCategory("");
                      }
                    }}
                    onFocus={() => {
                      setShowCategoryDropdown(true);
                      if (selectedCategory) {
                        setCategorySearch(selectedCategory);
                      }
                    }}
                    placeholder="Search or select category..."
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  />
                  {selectedCategory && (
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        setCategorySearch("");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                      title="Clear filter"
                    >
                      ×
                    </button>
                  )}
                  {showCategoryDropdown && filteredCategories.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {filteredCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setCategorySearch("");
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-sm"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 text-white">
                <tr>
                  <th className="p-5 text-left font-semibold text-base">File Name</th>
                  <th className="p-5 text-left font-semibold text-base">Dataset Title</th>
                  <th className="p-5 text-left font-semibold text-base">Category</th>
                  <th className="p-5 text-left font-semibold text-base">Uploaded</th>
                  <th className="p-5 text-left font-semibold text-base">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-150 group"
                    >
                      <td className="p-5 font-semibold text-gray-800 group-hover:text-indigo-700">
                        <a
                          href={`${API}/files/${encodeURIComponent(item.file_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
                        >
                          {item.file_name}
                        </a>
                      </td>
                      <td className="p-5 text-gray-700">{item.dataset_title || <span className="text-gray-400 italic">—</span>}</td>
                      <td className="p-5 text-gray-700">
                        <select
                          value={item.category || ""}
                          onChange={(e) => handleCategoryChange(item.file_name, e.target.value)}
                          className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer min-w-[180px]"
                        >
                          <option value="">— Select Category —</option>
                          {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-5 text-gray-700">
                        {item.uploaded ? (
                          <span className="font-medium">
                            {new Date(item.uploaded).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric'
                            })}
                            <span className="text-gray-500 text-xs ml-2">
                              {new Date(item.uploaded).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="p-5">
                        <button
                          onClick={() =>
                            navigate(`/details/${encodeURIComponent(item.file_name)}`)
                          }
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium hover:scale-105"
                        >
                          View Metadata
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-400 rounded"></div>
                        </div>
                        <div className="text-gray-500 text-lg font-medium">
                          {selectedCategory ? `No datasets found in ${selectedCategory}` : "No datasets found"}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {selectedCategory ? "Try selecting a different category" : "Upload a file to begin building your inventory"}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 py-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-medium">© 2025 {townName || "Municipality"} | Data Integration Portal</p>
          <p className="text-sm text-gray-500 mt-2">Empowering data-driven decisions</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/details/:file_name" element={<MetadataDetails />} />
      </Routes>
    </Router>
  );
}

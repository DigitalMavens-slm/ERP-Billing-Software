import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppLocation } from "../../Context/LocationContext";
const API_URL=import.meta.env.VITE_API_URL

export default function SubCategoryForm() {
  const {location,Goback} = useAppLocation();

  const [subCategoryName, setSubCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // 🔹 Fetch all subcategories
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/subcategories`);
      setSubCategories(res.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // 🔹 POST subcategory
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryName.trim() || !selectedCategory) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/subcategories`, {
        name: subCategoryName,
        categoryId: selectedCategory,
      });
      setMessage("Sub-category added successfully!");
      setSubCategoryName("");
      setSelectedCategory("");
      fetchSubCategories();
    } catch (err) {
      console.error(err);
      setMessage("Error adding sub-category");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 DELETE subcategory
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/subcategories/${id}`);
      fetchSubCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <>
    {location.pathname === "/setting/subcategory" && (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        
        <button
          onClick={Goback}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Sub-Category Management
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 p-4 rounded-lg border"
        >
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            placeholder="Enter sub-category name"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Add Sub-Category"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}

        <ul className="mt-6 space-y-3">
          {subCategories.map((s) => (
            <li
              key={s._id}
              className="flex justify-between items-center p-3 border rounded-md bg-gray-50"
            >
              <div>
                <span className="font-medium">{s.name}</span>{" "}
                <span className="text-gray-500 text-sm">
                  (
                  {categories.find((c) => c._id === s.categoryId)?.name ||
                    "No Category"}
                  )
                </span>
              </div>

              <button
                onClick={() => handleDelete(s._id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);

}

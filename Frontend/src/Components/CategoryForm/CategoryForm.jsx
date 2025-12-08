import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../api"
import { useAppLocation } from "../../Context/LocationContext";
import { ImportExcel } from "../../Utills/ImportExcel";
import { ExportExcel } from "../../Utills/ExportExcel";

// const API_URL = import.meta.env.VITE_API_URL;

export default function CategoryForm() {
  const { location, Goback } = useAppLocation();

  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      await api.post(`/api/categories`, { name: categoryName });
      setMessage("Category added successfully!");
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      setMessage("Error adding category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {location.pathname === "/setting/category" && (
        <div className="p-5 max-w-3xl mx-auto bg-white shadow-md rounded-xl mt-4">
          
          {/* Back Button */}
          <button
            onClick={Goback}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ⬅ Back
          </button>

          <h2 className="text-2xl font-semibold mb-4">Category Management</h2>

          {/* Add Category Form */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 items-center mb-5"
          >
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Add"}
            </button>
          </form>

          {message && (
            <p className="mb-4 text-green-600 font-medium">{message}</p>
          )}

          {/* Category List */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 font-medium">Category Name</th>
                  <th className="p-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{c.name}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center p-4 text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Import / Export Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await ImportExcel("Category", file);
                fetchCategories();
              }}
              className="flex items-center gap-3 mb-4"
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".xlsx, .xls"
                className="border p-2 rounded w-full bg-white"
              />
              <button
                type="submit"
                disabled={!file}
                className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 disabled:bg-gray-300"
              >
                Import Excel
              </button>
            </form>

            <button
              onClick={() => ExportExcel("Category")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full"
            >
              Export Excel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

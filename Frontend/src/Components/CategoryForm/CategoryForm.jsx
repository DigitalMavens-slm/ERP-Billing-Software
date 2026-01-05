// import React, { useState, useEffect } from "react";
// import api from "../../api"
// import { useAppLocation } from "../../Context/LocationContext";
// import { ImportExcel } from "../../Utills/ImportExcel";
// import { ExportExcel } from "../../Utills/ExportExcel";


// export default function CategoryForm() {
//   const { location, Goback } = useAppLocation();

//   const [categoryName, setCategoryName] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState("");

//   const fetchCategories = async () => {
//     try {
//       const res = await api.get(`/api/categories`);
//       setCategories(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!categoryName.trim()) return;

//     setLoading(true);
//     try {
//       await api.post(`/api/categories`, { name: categoryName });
//       setMessage("Category added successfully!");
//       setCategoryName("");
//       fetchCategories();
//     } catch (err) {
//       console.error(err);
//       setMessage("Error adding category");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/api/categories/${id}`);
//       fetchCategories();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       {location.pathname === "/setting/category" && (
//         <div className="p-5 max-w-3xl mx-auto bg-white shadow-md rounded-xl mt-4">
          
//           {/* Back Button */}
//           <button
//             onClick={Goback}
//             className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//           >
//             ⬅ Back
//           </button>

//           <h2 className="text-2xl font-semibold mb-4">Category Management</h2>

//           {/* Add Category Form */}
//           <form
//             onSubmit={handleSubmit}
//             className="flex gap-3 items-center mb-5"
//           >
//             <input
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               placeholder="Enter category name"
//               className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               {loading ? "Saving..." : "Add"}
//             </button>
//           </form>

//           {message && (
//             <p className="mb-4 text-green-600 font-medium">{message}</p>
//           )}

//           {/* Category List */}
//           <div className="border rounded-lg overflow-hidden">
//             <table className="w-full">
//               <thead className="bg-gray-100 text-left">
//                 <tr>
//                   <th className="p-3 font-medium">Category Name</th>
//                   <th className="p-3 font-medium text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categories.map((c) => (
//                   <tr
//                     key={c._id}
//                     className="border-t hover:bg-gray-50 transition"
//                   >
//                     <td className="p-3">{c.name}</td>
//                     <td className="p-3 text-center">
//                       <button
//                         onClick={() => handleDelete(c._id)}
//                         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {categories.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan="2"
//                       className="text-center p-4 text-gray-500"
//                     >
//                       No categories found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Import / Export Section */}
//           <div className="mt-6 p-4 bg-gray-50 rounded-lg border">

//             <form
//               onSubmit={async (e) => {
//                 e.preventDefault();
//                 await ImportExcel("Category", file);
//                 fetchCategories();
//               }}
//               className="flex items-center gap-3 mb-4"
//             >
//               <input
//                 type="file"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 accept=".xlsx, .xls"
//                 className="border p-2 rounded w-full bg-white"
//               />
//               <button
//                 type="submit"
//                 disabled={!file}
//                 className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 disabled:bg-gray-300"
//               >
//                 Import Excel
//               </button>
//             </form>

//             <button
//               onClick={() => ExportExcel("Category")}
//               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full"
//             >
//               Export Excel
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




import React, { useState, useEffect } from "react";
import api from "../../api";
import { useAppLocation } from "../../Context/LocationContext";
import { ImportExcel } from "../../Utills/ImportExcel";
import { ExportExcel } from "../../Utills/ExportExcel";
import ToggleActions from "../ToggleActions";

export default function CategoryForm() {
  const { location, Goback } = useAppLocation();

  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showList, setShowList] = useState(false);

  // 🔹 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Add category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      await api.post("/api/categories", { name: categoryName });
      setMessage("✅ Category added successfully");
      setCategoryName("");
      fetchCategories();
    } catch {
      setMessage("❌ Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete category
  const handleDelete = async (id) => {
    await api.delete(`/api/categories/${id}`);
    fetchCategories();
  };

  if (location.pathname !== "/setting/category") return null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* HEADER */}
      <div className="bg-white shadow rounded-xl p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={Goback}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Category Management
          </h1>
        </div>

        <ToggleActions
          leftLabel="New Category"
          rightLabel="Category List"
          isRightActive={showList}
          onLeftClick={() => setShowList(false)}
          onRightClick={() => setShowList(true)}
        />
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white shadow rounded-xl p-6 space-y-6">
        {message && (
          <div className="text-center text-sm bg-gray-100 p-2 rounded">
            {message}
          </div>
        )}

        {/* ADD CATEGORY */}
        {!showList && (
          <>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-gray-50 p-6 rounded-lg border"
            >
              

              <div className="flex flex-col md:flex-row gap-4 items-end">
  {/* Input Field */}
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Category Name
    </label>
    <input
      value={categoryName}
      onChange={(e) => setCategoryName(e.target.value)}
      placeholder="Enter category name"
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 whitespace-nowrap"
  >
    {loading ? "Saving..." : "Add Category"}
  </button>
</div>



            </form>

            {/* IMPORT / EXPORT */}
            <div className="bg-gray-50 border rounded-lg p-5 space-y-4">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await ImportExcel("Category", file);
                  fetchCategories();
                }}
                className="flex flex-col md:flex-row gap-3"
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".xlsx,.xls"
                  className="border rounded-lg px-3 py-2 w-auto bg-white"
                />
                <button
                  type="submit"
                  disabled={!file}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                >
                  Import Excel
                </button>
              <button
                onClick={() => ExportExcel("Category")}
                className="w-auto bg-purple-600 text-white px-2 py-2 rounded-lg hover:bg-purple-700"
              >
                Export Excel
              </button>
              </form>

            </div>
          </>
        )}


        {showList && (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm font-medium">
                    Category Name
                  </th>
                  <th className="p-3 text-center text-sm font-medium">
                    Action
                  </th>
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
                        className="text-red-600 text-sm hover:underline"
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
        )}
      </div>
    </div>
  );
}

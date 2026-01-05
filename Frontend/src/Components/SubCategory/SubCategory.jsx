// import React, { useState, useEffect } from "react";
// // import axios from "axios";
// import { useAppLocation } from "../../Context/LocationContext";
// import api from "../../api"
// import PageActions from "../PageActions";
// import ToggleActions from "../ToggleActions"

// export default function SubCategoryForm() {
//   const {location,Goback} = useAppLocation();

//   const [subCategoryName, setSubCategoryName] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [subCategories, setSubCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

  
//   const fetchCategories = async () => {
//     try {
//       const res = await api.get(`/api/categories`);
//       setCategories(res.data);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // 🔹 Fetch all subcategories
//   const fetchSubCategories = async () => {
//     try {
//       const res = await api.get(`/api/subcategories`);
//       setSubCategories(res.data);
//     } catch (err) {
//       console.error("Error fetching subcategories:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchSubCategories();
//   }, []);

//   // 🔹 POST subcategory
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!subCategoryName.trim() || !selectedCategory) return;

//     setLoading(true);
//     try {
//       await api.post(`/api/subcategories`, {
//         name: subCategoryName,
//         categoryId: selectedCategory,
//       });
//       setMessage("Sub-category added successfully!");
//       setSubCategoryName("");
//       setSelectedCategory("");
//       fetchSubCategories();
//     } catch (err) {
//       console.error(err);
//       setMessage("Error adding sub-category");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 DELETE subcategory
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/api/subcategories/${id}`);
//       fetchSubCategories();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const [showList, setShowList] = useState(false);
//   return (
//   <>

// <ToggleActions
//   leftLabel="New Brand"
//   rightLabel="Brand List"
//   isRightActive={showList}
//   onLeftClick={() => setShowList(false)}
//   onRightClick={() => setShowList(true)}
// />
//     {location.pathname === "/setting/subcategory" && (
//       <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        
       
// {!showList&&(
//   <>
//    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//           Sub-Category Management
//         </h2> 
//         <button
//           onClick={Goback}
//           className="mb-4 text-sm text-blue-600 hover:underline"
//         >
//           ← Back
//         </button>
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4 bg-gray-50 p-4 rounded-lg border"
//         >
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             required
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <input
//             value={subCategoryName}
//             onChange={(e) => setSubCategoryName(e.target.value)}
//             placeholder="Enter sub-category name"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//           >
//             {loading ? "Saving..." : "Add Sub-Category"}
//           </button>
//         </form>
//          </>
//         )}
       

//         {message && (
//           <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
//             {message}
//           </div>
//         )}
//       {showList&&(
//         <ul className="mt-6 space-y-3">
//           {subCategories.map((s) => (
//             <li
//               key={s._id}
//               className="flex justify-between items-center p-3 border rounded-md bg-gray-50"
//             >
//               <div>
//                 <span className="font-medium">{s.name}</span>{" "}
//                 <span className="text-gray-500 text-sm">
//                   (
//                   {categories.find((c) => c._id === s.categoryId)?.name ||
//                     "No Category"}
//                   )
//                 </span>
//               </div>

//               <button
//                 onClick={() => handleDelete(s._id)}
//                 className="text-red-600 hover:text-red-800 text-sm"
//               >
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//         )}
//       {/* )} */}
//       </div>
//     )}
//   </>
// );

// }


import React, { useState, useEffect } from "react";
import { useAppLocation } from "../../Context/LocationContext";
import api from "../../api";
import ToggleActions from "../ToggleActions";

export default function SubCategoryForm() {
  const { location, Goback } = useAppLocation();

  const [subCategoryName, setSubCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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

  // 🔹 Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const res = await api.get("/api/subcategories");
      setSubCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // 🔹 Add subcategory
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryName.trim() || !selectedCategory) return;

    setLoading(true);
    try {
      await api.post("/api/subcategories", {
        name: subCategoryName,
        categoryId: selectedCategory,
      });
      setMessage("✅ Sub-category added successfully");
      setSubCategoryName("");
      setSelectedCategory("");
      fetchSubCategories();
    } catch {
      setMessage("❌ Failed to add sub-category");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete subcategory
  const handleDelete = async (id) => {
    await api.delete(`/api/subcategories/${id}`);
    fetchSubCategories();
  };

  if (location.pathname !== "/setting/subcategory") return null;

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
            Sub-Category Management
          </h1>
        </div>

        <ToggleActions
          leftLabel="New Sub-Category"
          rightLabel="Sub-Category List"
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

        {/* ADD FORM */}
        {!showList && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-50 p-6 rounded-lg border"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sub-Category Name
              </label>
              <input
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="Enter sub-category name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Add Sub-Category"}
            </button>
          </form>
        )}

        {/* LIST */}
        {showList && (
          <ul className="space-y-3">
            {subCategories.map((s) => (
              <li
                key={s._id}
                className="flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    {
                      categories.find(
                        (c) => c._id === s.categoryId
                      )?.name || "No Category"
                    }
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

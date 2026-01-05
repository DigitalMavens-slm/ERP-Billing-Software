// import React, { useState, useEffect } from "react";
// import { useAppLocation } from "../Context/LocationContext";
// import { ExportExcel } from "../Utills/ExportExcel";
// import { ImportExcel } from "../Utills/ImportExcel";
// import PageActions from "../Components/PageActions"

// import api from "../api.js"



// export default function BrandForm() {
//   const [brandName, setBrandName] = useState("");
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//  const[file,setFile]=useState(null)
//   const {location,Goback}=useAppLocation()
//   const [showList, setShowList] = useState(false);


//   // GET brands
//   const fetchBrands = async () => {
//     try {
//       const res = await api.get(`/api/brands`);
//       setBrands(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   // POST brand
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!brandName.trim()) return;

//     setLoading(true);
//     try {
//       await api.post(`/api/brands`, { name: brandName });
//       setMessage("Brand added successfully!");
//       setBrandName("");
//       fetchBrands();
//     } catch (err) {
//       console.error(err);
//       setMessage("Error adding brand");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // DELETE brand
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/api/brands/${id}`);
//       fetchBrands();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
 
//       <div className="flex gap-3 justify-between">

//   <button
//     onClick={() => setShowList(false)}
//     className={`px-4 py-2 rounded ${!showList ? "bg-green-600 text-white" : "bg-gray-200"}`}
//   >
//     New Brand
//   </button>
//   <button
//     onClick={() => setShowList(true)}
//     className={`px-4 py-2 rounded ${showList ? "bg-blue-600 text-white" : "bg-gray-200"}`}
//   >
//     Brand List
//   </button>
// </div>


//     {location.pathname === "/setting/brand" &&

// <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">


// {!showList&&(
//   <>
//   <div className="flex items-center justify-between">
//     <button
//       onClick={Goback}
//       className="flex items-center text-white gap-2 bg-red-600 px-4 py-2 rounded hover:bg-gray-300"
//     >
//       ← Back
//     </button>
//     <h2 className="text-2xl font-bold">Brand Management</h2>
//     <div className="w-[80px]"></div> 
//   </div>
//   <div className="flex flex-col md:flex-row gap-4">

//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col md:flex-row items-center gap-3 w-full"
//     >
//       <input
//         value={brandName}
//         onChange={(e) => setBrandName(e.target.value)}
//         placeholder="Enter brand name"
//         className="border p-2 rounded w-full"
//       />
//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
//       >
//         {loading ? "Saving..." : "Add Brand"}
//       </button>
//     </form>

//     <form onSubmit={async (e) => {
//         e.preventDefault();
//         await ImportExcel("Brand", file);
//         fetchBrands();
//       }}
//       className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto"
//     >
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".xlsx, .xls"
//         className="border p-2 rounded w-full"
//       />
//       <button type="submit" disabled={!file}
//         className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
//       >
//         Import Excel
//       </button>
//     </form>
//   </div>
// </>
// )}

//   {message && (
//     <div className="p-2 bg-gray-100 rounded border text-center">{message}</div>
//   )}

//  {showList &&(
//   <>
//       <h2 className="text-2xl font-bold">Brand List</h2>

//   <ul className="space-y-2">
//     {brands.map((b) => (
//       <li
//         key={b._id}
//         className="flex justify-between items-center bg-gray-50 p-2 rounded border"
//       >
//         {b.name}
//         <button
//           onClick={() => handleDelete(b._id)}
//           className="text-red-600 hover:text-red-800"
//         >
//           Delete
//         </button>
//       </li>
//     ))}
//   </ul>
//   </>
//   )}

//   {/* EXPORT EXCEL (BOTTOM RIGHT) */}
//   <div className="flex justify-end pt-4">
//     <button
//       onClick={() => ExportExcel("Brand")}
//       className="bg-gray-800 text-white px-5 py-2 rounded shadow hover:bg-black"
//     >
//       Export Excel
//     </button>
//   </div>
// </div>

//     }</>
//   );
// }




import React, { useState, useEffect } from "react";
import { useAppLocation } from "../Context/LocationContext";
import { ExportExcel } from "../Utills/ExportExcel";
import { ImportExcel } from "../Utills/ImportExcel";
import api from "../api.js";

export default function BrandForm() {
  const [brandName, setBrandName] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showList, setShowList] = useState(false);

  const { location, Goback } = useAppLocation();

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/brands");
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    setLoading(true);
    try {
      await api.post("/api/brands", { name: brandName });
      setMessage("✅ Brand added successfully");
      setBrandName("");
      fetchBrands();
    } catch {
      setMessage("❌ Failed to add brand");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/brands/${id}`);
    fetchBrands();
  };

  if (location.pathname !== "/setting/brand") return null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 flex justify-between items-center">
        <button
          onClick={Goback}
          className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800">
          Brand Management
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowList(false)}
            className={`px-4 py-2 rounded text-sm ${
              !showList
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            New Brand
          </button>
          <button
            onClick={() => setShowList(true)}
            className={`px-4 py-2 rounded text-sm ${
              showList
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Brand List
          </button>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        {message && (
          <div className="text-center text-sm bg-gray-100 p-2 rounded">
            {message}
          </div>
        )}

        {/* ADD BRAND */}
        {!showList && (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="border rounded-lg px-4 py-0 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-0 rounded-lg hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Add Brand"}
              </button>
            </form>

            {/* IMPORT */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await ImportExcel("Brand", file);
                fetchBrands();
              }}
              className="flex flex-col md:flex-row gap-4 items-center"
            >
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <button
                type="submit"
                disabled={!file}
                className="bg-green-600 text-white px-6 py-0 rounded-lg hover:bg-green-700"
              >
                Import Excel
              </button>
            </form>
          </>
        )}

        {/* BRAND LIST */}
        {showList && (
          <>
            <h2 className="text-xl font-semibold">Brand List</h2>

            <ul className="space-y-3">
              {brands.map((b) => (
                <li
                  key={b._id}
                  className="flex justify-between items-center border rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                  <span className="font-medium">{b.name}</span>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* EXPORT */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => ExportExcel("Brand")}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-black"
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}

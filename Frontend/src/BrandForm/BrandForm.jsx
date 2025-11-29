import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppLocation } from "../Context/LocationContext";
import { ExportExcel } from "../Utills/ExportExcel";
import { ImportExcel } from "../Utills/ImportExcel";
// import {Brand} from "../../../Backend/Model/BrandModel"
const API_URL=import.meta.env.VITE_API_URL



export default function BrandForm() {
  const [brandName, setBrandName] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
 const[file,setFile]=useState(null)
  const {location,Goback}=useAppLocation()

  // GET brands
  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/brands`);
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // POST brand
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/brands`, { name: brandName });
      setMessage("Brand added successfully!");
      setBrandName("");
      fetchBrands();
    } catch (err) {
      console.error(err);
      setMessage("Error adding brand");
    } finally {
      setLoading(false);
    }
  };

  // DELETE brand
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/brands/${id}`);
      fetchBrands();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    {location.pathname === "/setting/brand" &&

//     <div className="brand-form-wrap">
//           <button onClick={Goback}>back</button>
//       <h2>Brand Management</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           value={brandName}
//           onChange={(e) => setBrandName(e.target.value)}
//           placeholder="Enter brand name"
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Saving..." : "Add Brand" }
//         </button>
//       </form>

//       {message && <div>{message}</div>}

//       <ul>
//         {brands.map((b) => (
//           <li key={b._id}>
//             {b.name}{" "}
//             <button onClick={() => handleDelete(b._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>


// <div style={{ marginTop: "20px" }}>
//   <form
//     onSubmit={async (e) => {
//       e.preventDefault();
//       await ImportExcel("Brand", file);
//       fetchBrands(); 
//     }}
//   >
//     <input
//       type="file"
//       onChange={(e) => setFile(e.target.files[0])}
//       accept=".xlsx, .xls"
//     />
//     <button type="submit" disabled={!file}>
//       Import Excel
//     </button>
//   </form>
// </div>




// {/* <button onClick={() => window.open(`${API_URL}/api/brands/export/excel`)}>Export Excel</button> */}
// <button onClick={ () => ExportExcel("Brand") }>Export Excel</button>
// {/* <button onClick={()=> ImportExcel("Brand",file) }>Import Excel</button> */}

//     </div>



<div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">

  {/* HEADER AREA */}
  <div className="flex items-center justify-between">
    <button
      onClick={Goback}
      className="flex items-center text-white gap-2 bg-red-600 px-4 py-2 rounded hover:bg-gray-300"
    >
      ← Back
    </button>
    <h2 className="text-2xl font-bold">Brand Management</h2>
    <div className="w-[80px]"></div> {/* space balance for symmetry */}
  </div>

  {/* ADD + IMPORT SECTION SIDE BY SIDE */}
  <div className="flex flex-col md:flex-row gap-4">

    {/* ADD BRAND */}
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-center gap-3 w-full"
    >
      <input
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        placeholder="Enter brand name"
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
      >
        {loading ? "Saving..." : "Add Brand"}
      </button>
    </form>

    {/* IMPORT EXCEL */}
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await ImportExcel("Brand", file);
        fetchBrands();
      }}
      className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto"
    >
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".xlsx, .xls"
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={!file}
        className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
      >
        Import Excel
      </button>
    </form>
  </div>

  {/* MESSAGE */}
  {message && (
    <div className="p-2 bg-gray-100 rounded border text-center">{message}</div>
  )}

  {/* BRAND LIST */}
  <ul className="space-y-2">
    {brands.map((b) => (
      <li
        key={b._id}
        className="flex justify-between items-center bg-gray-50 p-2 rounded border"
      >
        {b.name}
        <button
          onClick={() => handleDelete(b._id)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </li>
    ))}
  </ul>

  {/* EXPORT EXCEL (BOTTOM RIGHT) */}
  <div className="flex justify-end pt-4">
    <button
      onClick={() => ExportExcel("Brand")}
      className="bg-gray-800 text-white px-5 py-2 rounded shadow hover:bg-black"
    >
      Export Excel
    </button>
  </div>
</div>

    }</>
  );
}

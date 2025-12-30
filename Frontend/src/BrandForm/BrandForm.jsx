import React, { useState, useEffect } from "react";
import { useAppLocation } from "../Context/LocationContext";
import { ExportExcel } from "../Utills/ExportExcel";
import { ImportExcel } from "../Utills/ImportExcel";
import PageActions from "../Components/PageActions"

import api from "../api.js"



export default function BrandForm() {
  const [brandName, setBrandName] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
 const[file,setFile]=useState(null)
  const {location,Goback}=useAppLocation()
  const [showList, setShowList] = useState(false);


  // GET brands
  const fetchBrands = async () => {
    try {
      const res = await api.get(`/api/brands`);
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
      await api.post(`/api/brands`, { name: brandName });
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
      await api.delete(`/api/brands/${id}`);
      fetchBrands();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
   {/* <PageActions/> */}

   {/* <button onClick={()=>setShowList(true)}>Brandlist</button>
      <button onClick={()=>setShowList(false)}> New Brand</button> */}

      <div className="flex gap-3 justify-between">

  <button
    onClick={() => setShowList(false)}
    className={`px-4 py-2 rounded ${
      !showList ? "bg-green-600 text-white" : "bg-gray-200"
    }`}
  >
    New Brand
  </button>
  <button
    onClick={() => setShowList(true)}
    className={`px-4 py-2 rounded ${
      showList ? "bg-blue-600 text-white" : "bg-gray-200"
    }`}
  >
    Brand List
  </button>
</div>


    {location.pathname === "/setting/brand" &&

<div className="p-4 md:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">

  {/* HEADER AREA */}
  {/* <div className="flex items-center justify-between">
    <button
      onClick={Goback}
      className="flex items-center text-white gap-2 bg-red-600 px-4 py-2 rounded hover:bg-gray-300"
    >
      ← Back
    </button>
    <h2 className="text-2xl font-bold">Brand Management</h2>
    <div className="w-[80px]"></div> 
  </div> */}
{!showList&&(
  <div className="flex flex-col md:flex-row gap-4">

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

    <form onSubmit={async (e) => {
        e.preventDefault();
        await ImportExcel("Brand", file);
        fetchBrands();
      }}
      className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto"
    >
      <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".xlsx, .xls"
        className="border p-2 rounded w-full"
      />
      <button type="submit" disabled={!file}
        className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
      >
        Import Excel
      </button>
    </form>
  </div>

)}

  {message && (
    <div className="p-2 bg-gray-100 rounded border text-center">{message}</div>
  )}

 {showList &&(
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
  </ul>)}

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

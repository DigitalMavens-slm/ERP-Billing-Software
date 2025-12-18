import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useAppLocation } from "../../Context/LocationContext";
import api from "../../api"
import { Trash2 } from "lucide-react";

// const API_URL = import.meta.env.VITE_API_URL;

export default function ProductForm() {
  const { location, Goback } = useAppLocation();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [productData, setProductData] = useState({
    name: "",
    categoryId: "",
    subCategoryId: "",
    brandId: "",
    mrp: "",
    purchaseRate: "",
    saleRate: "",
    gst: "",
    hsncode: "",
    unit: "",
    commission: "",
    minOrderQty: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const[products,setProducts]=useState([])

  // Fetch All Dropdown Data
  const fetchAllData = async () => {
    try {
      const [catRes, subRes, brandRes] = await Promise.all([
        api.get(`/api/categories`),
        api.get(`/api/subcategories`),
        api.get(`/api/brands`),
      ]);

      setCategories(catRes.data);
      setSubCategories(subRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  

const fetchProducts=async()=>{
  try{
    const res=await api.get("/api/products")
    setProducts(res.data)
  }
  catch(err){
    console.log(err)
  }
}
  useEffect(() => {
    fetchAllData();
    fetchProducts();
  }, []);

  // Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Submit Product
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!productData.name.trim()) return;

  setLoading(true);
  const cleanedData = {
  ...productData,
  categoryId: productData.categoryId || null,
  subCategoryId: productData.subCategoryId || null,
  brandId: productData.brandId || null,
  gst: productData.gst || 0,
};

try {
  await api.post(`/api/products`,cleanedData,);

    setMessage("Product added successfully!");

    setProductData({
      name: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      mrp: "",
      purchaseRate: "",
      saleRate: "",
      gst: "",
      hsncode: "",
      unit: "",
      commission: "",
      minOrderQty: "",
    });

    fetchAllData();
    fetchProducts()

  } catch (err) {
    console.error(err);
    setMessage("Error adding product");
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    await api.delete(`/api/products/${id}`);
    setProducts(products.filter((p) => p._id !== id)); // UI update
  } catch (err) {
    console.error("Delete Error:", err);
  }
};


  return (
    <>
      {location.pathname === "/setting/product" && (
        <div className="max-w-5xl mx-auto bg-white p-6 mt-4 shadow-lg rounded-xl">

          {/* Back Button */}
          <button
            onClick={Goback}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            ⬅ Back
          </button>

          <h2 className="text-3xl font-semibold mb-6">Product Management</h2>

          {/* Product Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* Category */}
            <select
              name="categoryId"
              value={productData.categoryId}
              onChange={handleChange}
              required
              className="border p-3 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Sub Category */}
            <select
              name="subCategoryId"
              value={productData.subCategoryId}
              onChange={handleChange}
              className="border p-3 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sub-Category</option>
              {subCategories
                .filter((s) => s.categoryId === productData.categoryId)
                .map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
            </select>

            {/* Brand */}
            <select
              name="brandId"
              value={productData.brandId}
              onChange={handleChange}
              className="border p-3 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              name="mrp"
              type="number"
              value={productData.mrp}
              onChange={handleChange}
              placeholder="MRP"
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="purchaseRate"
              type="number"
              value={productData.purchaseRate}
              onChange={handleChange}
              placeholder="Purchase Rate"
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="saleRate"
              type="number"
              value={productData.saleRate}
              onChange={handleChange}
              placeholder="Sale Rate"
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />

           <select
  name="gst"
  value={productData.gst}
  onChange={handleChange}
  className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select GST %</option>
  <option value={0}>0%</option>
  <option value={5}>5%</option>
  <option value={12}>12%</option>
  <option value={18}>18%</option>
  <option value={28}>28%</option>
</select>

            <input
              name="hsncode"
              value={productData.hsncode}
              onChange={handleChange}
              placeholder="HSN Code"
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />

          
            <select
  name="unit"
  value={productData.unit}
  onChange={handleChange}
  className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select Unit</option>
  <option value="pcs">Pieces (pcs)</option>
  <option value="box">Box</option>
  <option value="kg">Kilogram (kg)</option>
  <option value="g">Gram (g)</option>
  <option value="ltr">Litre (ltr)</option>
  <option value="ml">Millilitre (ml)</option>
  <option value="dozen">Dozen</option>
  <option value="packet">Packet</option>
  <option value="set">Set</option>
</select>


            <input
              name="commission"
              type="number"
              value={productData.commission}
              onChange={handleChange}
              placeholder="Commission %"
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="minOrderQty"
              type="number"
              value={productData.minOrderQty}
              onChange={handleChange}
              placeholder="Min Order Quantity"
              className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500"
            />

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Add Product"}
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              {message}
            </div>
          )}
        </div>
      )}

     
     {/* <div className="space-y-3">
   {products.map((product) => (
     <div
       key={product._id}
       className="flex justify-between items-center p-4 bg-white shadow rounded-lg border hover:bg-gray-50 transition"
     >
       <h3 className="text-lg font-semibold">{product.name}</h3>

       <button
         onClick={() => handleDelete(product._id)}
         className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition"
       >
         <Trash2 size={20} />
       </button>
     </div>
   ))}
</div> */}

{/* ================= PRODUCT LIST ================= */}
<div className="mt-6">

  {/* -------- Desktop / Tablet (Table view) -------- */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full border border-gray-200 rounded-lg">
      <thead className="bg-gray-100 text-sm text-gray-700">
        <tr>
          <th className="p-3 text-left">Product</th>
          <th className="p-3 text-right">MRP</th>
          <th className="p-3 text-right">Purchase</th>
          <th className="p-3 text-right">Sale</th>
          <th className="p-3 text-center">Unit</th>
          <th className="p-3 text-center">GST</th>
          <th className="p-3 text-center">Action</th>
        </tr>
      </thead>

      <tbody className="text-sm">
        {products.map((product) => (
          <tr
            key={product._id}
            className="border-t hover:bg-gray-50 transition"
          >
            <td className="p-3 font-medium">{product.name}</td>
            <td className="p-3 text-right">₹{product.mrp}</td>
            <td className="p-3 text-right">₹{product.purchaseRate}</td>
            <td className="p-3 text-right font-semibold text-green-600">
              ₹{product.saleRate}
            </td>
            <td className="p-3 text-center">{product.unit}</td>
            <td className="p-3 text-center">{product.gst}%</td>
            <td className="p-3 text-center">
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* -------- Mobile View (Card style) -------- */}
  <div className="md:hidden space-y-3">
    {products.map((product) => (
      <div
        key={product._id}
        className="border rounded-lg p-4 bg-white shadow"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <button
            onClick={() => handleDelete(product._id)}
            className="text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-gray-500">MRP</span>
          <span className="text-right">₹{product.mrp}</span>

          <span className="text-gray-500">Purchase</span>
          <span className="text-right">₹{product.purchaseRate}</span>

          <span className="text-gray-500">Sale</span>
          <span className="text-right font-semibold text-green-600">
            ₹{product.saleRate}
          </span>

          <span className="text-gray-500">Unit</span>
          <span className="text-right">{product.unit}</span>

          <span className="text-gray-500">GST</span>
          <span className="text-right">{product.gst}%</span>
        </div>
      </div>
    ))}
  </div>

</div>


    </>
  );
}


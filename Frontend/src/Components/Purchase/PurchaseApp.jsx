import React, { useState, useEffect ,} from "react";
// import axios from "axios";
// import "./PurchaseApp.css";
import {useSuggestion} from "../../Context/KeyBoardContext"
import { useNavigate } from "react-router-dom";
// const API_URL = import.meta.env.VITE_API_URL;
import api from "../../api"

const PurchaseApp = () => {
  const navigate = useNavigate();

  const {
  suggestions,
  setSuggestions,
  highlightIndex,
  handleKeyDown,
  suggestionRefs,
} = useSuggestion();


  // 🔹 Basic Details
  const [billNum, setBillNum] = useState("");
  const [date, setDate] = useState("");
  const [purchaseType, setPurchaseType] = useState("Purchase");
  const [supplierName, setSupplierName] = useState("");
  const [supplierDetails, setSupplierDetails] = useState({
    supplierId: "",
    name:"",
    phone: "",
    gstin: "",
    email: "",
    address: "",
  });

  // 🔹 Configuration
  const [billType, setBillType] = useState("Cash");
  const [gstType, setGstType] = useState("GST");
  const [amountType, setAmountType] = useState("Excluding Tax");

  // 🔹 Data Lists
  const [productsList, setProductsList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedName,setSelectedName] = useState("")

  // 🔹 Product Item
  const [item, setItem] = useState({
    product: "",
    qty: 0,
    mrp: 0,
    rate: 0,
    dis: 0,
    tax: 0,
  });

  const [items, setItems] = useState([]);

  // ✅ Fetch all Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/api/products`);
        setProductsList(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Fetch all Suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get(`/api/suppliers`);
        setSuppliersList(res.data);
        // console.log(suppliersList.name)
      } catch (err) {
        console.error("❌ Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // ✅ Auto Bill No + Date
  useEffect(() => {
    const fetchNextBillNum = async () => {
      try {
        const financialYear =
        localStorage.getItem("financialYear") || "2024-2025";
        const res = await api.get(`/api/buy/billnum`,{
        headers: {
          "x-financial-year": financialYear,
        },
      });
        setBillNum(res.data.nextBillNum);
      } catch (err) {
        console.error("Error fetching bill number:", err);
        setBillNum("BILL0001");
      }
      setDate(new Date().toISOString().split("T")[0]);
    };
    fetchNextBillNum();
  },);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔹 Supplier Suggestion
if (name === "supplier") {
  setSupplierName(value);

  if (value.trim().length > 0) {
    const filtered = suppliersList.filter((s) =>
      (s.supplierName || s.name || "")
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  } else {
    setFilteredSuppliers([]);
  }
  return;
}

    // 🔹 Product Suggestion
    if (name === "product") {
      setItem((prev) => ({ ...prev, product: value }));
      if (value.trim().length > 0) {
        const filtered = productsList.filter((p) =>
          p.name?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts([]);
      }
      return;
    }

    setItem((prev) => ({
      ...prev,
      [name]: ["qty", "mrp", "rate", "dis"].includes(name)
        ? Number(value)
        : value,
    }));
  };

 


  const selectSupplier = (name) => {
  // setSupplierName(name);

  const selected =
  suppliersList.find(
    (s) => s.supplierName === name || s.name === name
  );


  if (selected) {
    setSupplierDetails({
      supplierId: selected._id,
      // name:selected.name || "",
      phone: selected.phone || "",
      gstin: selected.gstin || "",
      email: selected.email || "",
      address: selected.address || "",
    });
    setSelectedName(selected.name || "")
   
  }

  setFilteredSuppliers([]);
};

  // ✅ Select Product
  const selectProduct = (selectedName) => {
    const selected = productsList.find((p) => p.name === selectedName);
    if (selected) {
      setItem({
        ...item,
        productId: selected._id, 
        product: selected.name,
        mrp: selected.mrp || 0,
        rate: selected.purchaseRate || 0,
        tax: selected.gst || 0,
      });
    }
    setFilteredProducts([]);
  };

  // ✅ Add Item
  const addItem = () => {
    if (!item.product.trim()) return alert("Product Name required!");
    if (item.qty <= 0) return alert("Quantity must be > 0!");
    if (item.rate <= 0) return alert("Rate must be > 0!");
      if (!item.productId) {
    return alert("Please add product, don’t type manually!");
  }
    setItems((prev) => [...prev, item]);
    setItem({ product: "", qty: 0, mrp: 0, rate: 0, dis: 0, tax: 0 });
  };

  // ✅ Delete Item
  const deleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Calculate Tax Logic
  const calculateItemBreakdown = (itm) => {
    const discountAmount = (itm.rate * itm.qty * itm.dis) / 100;
    const gstPercent = Number(itm.tax) || 0;
    let baseAmount = 0;
    let taxAmount = 0;
    let totalAmount = 0;

    if (amountType === "Including Tax") {
      const gross = itm.rate * itm.qty - discountAmount;
      baseAmount = gross / (1 + gstPercent / 100);
      taxAmount = gross - baseAmount;
      totalAmount = gross;
    } else {
      baseAmount = itm.rate * itm.qty - discountAmount;
      taxAmount = (baseAmount * gstPercent) / 100;
      totalAmount = baseAmount + taxAmount;
    }

    return { baseAmount, taxAmount, totalAmount };
  };

  const subtotal = items.reduce(
    (acc, itm) => acc + calculateItemBreakdown(itm).totalAmount,
    0
  );
  const quantity = items.reduce((acc, itm) => acc + itm.qty, 0);

  // ✅ Save Purchase
  const handleSave = async () => {
    if (items.length === 0) return alert("No items added!");
    // if (!supplierName.trim()) return alert("Supplier Name required!");

     if (!supplierDetails.supplierId) {
    return alert("Please select a valid supplier from suggestions!");
  }

    const purchaseData = {
      companyId : "",
      supplierId: supplierDetails.supplierId,
      billNum,
      date,
      purchaseType,
      // supplierName,
      supplierName: selectedName,
      billType,
      gstType,
      amountType,
      items,
      subtotal,
      totalQty: quantity,
    };

    try {
     const res= await api.post(`/api/purchases`, purchaseData,);
      setBillNum(res.data.nextBillNum);
    setDate(new Date().toISOString().split("T")[0]);
      alert("PURCHASE BILL GENERATED")
      setSelectedName("")
      // navigate("/purchase-details", { state: { purchaseData, supplierDetails } });
      setItems([])
      // setBillNum(res.data.billNum)
      // setBillNum(res.data.data.billNum);
      
    } catch (err) {
      console.error("Error saving purchase:", err);
      alert("Error saving purchase!");
    }
  };

return (
  <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-br from-slate-100 to-slate-200">

    {/* ---------- CARD: BILL DETAILS ---------- */}
    <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-5 mb-6 border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">🧾 Bill Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-slate-600">Bill No</label>
          <input
            value={billNum}
            readOnly
            className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Purchase Type</label>
          <select
            value={purchaseType}
            onChange={(e) => setPurchaseType(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          >
            <option>Purchase</option>
            <option>Purchase Return</option>
          </select>
        </div>
      </div>
    </div>
{/* ---------- CARD: SUPPLIER ---------- */}
<div className="relative bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-5 mb-6 border border-slate-200 overflow-visible z-10">

  <h2 className="text-xl font-semibold mb-4 text-slate-700">👤 Supplier Details</h2>

  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

    {/* Supplier Name */}
    <div className="relative overflow-visible z-[9999]">

      <label className="text-sm text-slate-600">Supplier *</label>

      <input
        name="supplier"
        value={selectedName}
        onChange={handleChange}
        onClick={() => setFilteredSuppliers(suppliersList)}
        onFocus={() => setFilteredSuppliers(suppliersList)}
        onKeyDown={(e) => handleKeyDown(e, selectSupplier)}
        className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />

      {/* Suggestion Dropdown */}
      {filteredSuppliers.length > 0 && (
        <ul className="absolute top-full left-0 z-[99999] bg-white border shadow-xl rounded-xl w-full mt-1 max-h-56 overflow-y-auto">

          {filteredSuppliers.map((s, idx) => (
            <li
              key={s._id}
              onClick={() => selectSupplier(s.name || s.supplierName)}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                idx === highlightIndex ? "bg-blue-200" : ""
              }`}
            >
              {s.name || s.supplierName}
            </li>
          ))}

          <button
            onClick={() => navigate("/setting/supplier")}
            className="w-full py-2 bg-green-100 hover:bg-green-200"
          >
            ➕ Add New Supplier
          </button>

        </ul>
      )}
    </div>

    {/* Bill Type */}
    <div>
      <label className="text-sm text-slate-600">Bill Type</label>
      <select
        value={billType}
        onChange={(e) => setBillType(e.target.value)}
        className="w-full mt-1 px-3 py-2 border rounded-xl"
      >
        <option>Cash</option>
        <option>Credit</option>
      </select>
    </div>

    {/* GST Type */}
    <div>
      <label className="text-sm text-slate-600">GST Type</label>
      <select
        value={gstType}
        onChange={(e) => setGstType(e.target.value)}
        className="w-full mt-1 px-3 py-2 border rounded-xl"
      >
        <option>GST</option>
        <option>IGST</option>
        {/* <option>No Tax</option> */}
      </select>
    </div>

    {/* Amount Type */}
    <div>
      <label className="text-sm text-slate-600">Amount Type</label>
      <select
        value={amountType}
        onChange={(e) => setAmountType(e.target.value)}
        className="w-full mt-1 px-3 py-2 border rounded-xl"
      >
        {/* <option>No Tax</option> */}
        <option>Including Tax</option>
        <option>Excluding Tax</option>
      </select>
    </div>

  </div>
</div>

{/* ---------- CARD: ADD PRODUCT ---------- */}
<div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-5 mb-6 border border-slate-200 overflow-visible">
  <h2 className="text-xl font-semibold mb-4 text-slate-700">📦 Add Product</h2>

  <div className="grid grid-cols-2 md:grid-cols-7 gap-3 items-center">

    {/* Product search */}
    <div className="relative overflow-visible col-span-2 md:col-span-1">
      <input
        name="product"
        value={item.product}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
      />

      {filteredProducts.length > 0 && (
        <ul className="absolute z-[9999] bg-white border shadow-xl rounded-xl w-full mt-1 max-h-48 overflow-y-auto">
          {filteredProducts.map((p) => (
            <li
              key={p._id}
              onClick={() => selectProduct(p.name)}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>

    <input name="qty" value={item.qty} onChange={handleChange} type="number"
      placeholder="Qty" className="px-3 py-2 border rounded-xl" />

    <input name="mrp" value={item.mrp} onChange={handleChange} type="number"
      placeholder="MRP" className="px-3 py-2 border rounded-xl" />

    <input name="rate" value={item.rate} onChange={handleChange} type="number"
      placeholder="Rate" className="px-3 py-2 border rounded-xl" />

    <input name="dis" value={item.dis} onChange={handleChange} type="number"
      placeholder="DIS %" className="px-3 py-2 border rounded-xl" />

    <select name="tax" value={item.tax} onChange={handleChange}
      className="px-3 py-2 border rounded-xl">
      <option>0</option>
      <option>5</option>
      <option>12</option>
      <option>18</option>
      <option>28</option>
    </select>

    <button
      onClick={addItem}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
    >
      Add
    </button>
  </div>
</div>


    {/* ---------- CARD: TABLE ---------- */}
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-5 mb-6 border border-slate-200">
      <div className="overflow-auto max-h-[350px]">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-100 shadow-sm">
            <tr className="text-slate-700 border-b">
              <th className="py-2">Product</th>
              <th>Qty</th>
              <th>MRP</th>
              <th>Rate</th>
              <th>DIS%</th>
              <th>GST%</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((itm, i) => (
              <tr key={i} className="border-b hover:bg-slate-50">
                <td className="py-2">{itm.product}</td>
                <td>{itm.qty}</td>
                <td>₹{itm.mrp}</td>
                <td>₹{itm.rate}</td>
                <td>{itm.dis}%</td>
                <td>{itm.tax}%</td>
                <td>₹{calculateItemBreakdown(itm).totalAmount.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => deleteItem(i)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* ---------- FOOTER SUMMARY ---------- */}
    <div className="bg-white/80 backdrop-blur-xl shadow-md rounded-2xl p-5 flex justify-between text-lg border border-slate-200">
      <div>Total Qty: {quantity}</div>
      <div className="font-semibold text-green-700">Payable: ₹{subtotal.toFixed(2)}</div>
    </div>

    {/* ---------- SAVE BUTTON ---------- */}
    <div className="text-right mt-6">
      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-lg shadow-md"
      >
        Save Purchase
      </button>
    </div>

  </div>
);

};

export default PurchaseApp;

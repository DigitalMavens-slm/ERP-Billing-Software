import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate, useLocation,useParams } from "react-router-dom";
import { useSuggestion } from "../../Context/KeyBoardContext";

// const API_URL = import.meta.env.VITE_API_URL;
import api from "../../api"

const EditPurchase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const purchaseId = location.state?.purchaseId || params.id; // 👈 Passed from table page

  const {
    suggestions,
    setSuggestions,
    highlightIndex,
    handleKeyDown,
    suggestionRefs,
  } = useSuggestion();

  // BASIC DETAILS
  const [billNum, setBillNum] = useState("");
  const [date, setDate] = useState("");
  const [purchaseType, setPurchaseType] = useState("Purchase");
  const [supplierName, setSupplierName] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const [supplierDetails, setSupplierDetails] = useState({
    supplierId: "",
    phone: "",
    gstin: "",
    email: "",
    address: "",
  });

  // CONFIG
  const [billType, setBillType] = useState("Cash");
  const [gstType, setGstType] = useState("GST");
  const [amountType, setAmountType] = useState("Excluding Tax");

  // DATA LISTS
  const [productsList, setProductsList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  // PRODUCT ITEM
  const [item, setItem] = useState({
    product: "",
    qty: 0,
    mrp: 0,
    rate: 0,
    dis: 0,
    tax: 0,
  });

  const [items, setItems] = useState([]);

  // -----------------------------
  // FETCH ALL DATA
  // -----------------------------
  useEffect(() => {
    api.get(`/api/products`)
      .then(res => setProductsList(res.data))
      .catch(console.error);

    api.get(`/api/suppliers`)
      .then(res => setSuppliersList(res.data))
      .catch(console.error);

  }, []);

  // -----------------------------
  // LOAD EXISTING PURCHASE
  // -----------------------------
  useEffect(() => {
  if (!purchaseId) {
    console.warn("⚠️ No purchaseId received!");
    return;
  }

  const fetchPurchase = async () => {
    try {
      const res = await api.get(`/api/purchases/${purchaseId}`);

      const p = res.data;

      console.log("Fetched purchase:", p);

      if (!p) {
        console.error("❌ No purchase data returned from server.");
        return;
      }

      // Set basic fields safely
      setBillNum(p.data.billNum || "");
      
      setDate(p.data.date ? p.data.date.split("T")[0] : "");
      setPurchaseType(p.data.purchaseType || "");
      setBillType(p.data.billType || "");
      setGstType(p.data.gstType || "");
      setAmountType(p.data.amountType || "");

      // Supplier safe checks
      console.log("new " + p.data)
      if (p.data.supplier) {
        setSupplierDetails({
          supplierId: p.data.supplierId || "",
          phone: p.data.supplierName || "",
          gstin: p.data.supplier.gstin || "",
          email: p.data.supplier.email || "",
          address: p.data.supplier.address || "",
        });

        setSelectedName(p.data.supplier.name || "");
      } else {
        console.warn("⚠️ No supplier object found in purchase.");
      }

      // Items safe check
      setItems(Array.isArray(p.data.items) ? p.data.items : []);

    } catch (err) {
      console.error("❌ Error loading purchase:", err);
    }
  };

  fetchPurchase();
}, [purchaseId]);


  // -----------------------------
  // HANDLE INPUT CHANGE
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // SUPPLIER SUGGESTION
    if (name === "supplier") {
      setSelectedName(value);

      if (value.trim()) {
        setFilteredSuppliers(
          suppliersList.filter(s =>
            (s.name || s.supplierName)
              ?.toLowerCase()
              .includes(value.toLowerCase())
          )
        );
      } else setFilteredSuppliers([]);

      return;
    }

    // PRODUCT SUGGESTION
    if (name === "product") {
      setItem(prev => ({ ...prev, product: value }));

      if (value.trim()) {
        setFilteredProducts(
          productsList.filter(p =>
            p.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      } else setFilteredProducts([]);

      return;
    }

    setItem(prev => ({
      ...prev,
      [name]: ["qty", "mrp", "rate", "dis"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  // SELECT SUPPLIER
  const selectSupplier = (name) => {
    const s = suppliersList.find(
      x => x.name === name || x.supplierName === name
    );

    if (s) {
      setSupplierDetails({
        supplierId: s._id,
        phone: s.phone,
        gstin: s.gstin,
        email: s.email,
        address: s.address,
      });
    }

    setSelectedName(name);
    setFilteredSuppliers([]);
  };

  // SELECT PRODUCT
  const selectProduct = (name) => {
    const p = productsList.find(x => x.name === name);

    if (p) {
      setItem({
        product: p.name,
        mrp: p.mrp || 0,
        rate: p.purchaseRate || 0,
        qty: 1,
        dis: 0,
        tax: p.gst || 18,
      });
    }

    setFilteredProducts([]);
  };

  // ADD ITEM
  const addItem = () => {
    if (!item.product.trim()) return alert("Product required!");
    if (item.qty <= 0) return alert("Qty must be > 0!");

    setItems(prev => [...prev, item]);
    setItem({ product: "", qty: 0, mrp: 0, rate: 0, dis: 0, tax: 0 });
  };

  // DELETE ITEM
  const deleteItem = (i) => {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  };

  // CALCULATION
  const calculateItemBreakdown = (itm) => {
    const discountAmount = (itm.rate * itm.qty * itm.dis) / 100;
    const gstPercent = Number(itm.tax);
    let baseAmount = itm.rate * itm.qty - discountAmount;
    let taxAmount = (baseAmount * gstPercent) / 100;
    return { totalAmount: baseAmount + taxAmount };
  };

  const subtotal = items.reduce(
    (acc, itm) => acc + calculateItemBreakdown(itm).totalAmount,
    0
  );
  const quantity = items.reduce((acc, itm) => acc + itm.qty, 0);

  // -----------------------------
  // UPDATE PURCHASE
  // -----------------------------
  const handleUpdate = async () => {
    if (!supplierDetails.supplierId)
      return alert("Please select a valid supplier!");

    const updated = {
      supplierId: supplierDetails.supplierId,
      supplierName: selectedName,
      date,
      purchaseType,
      billType,
      gstType,
      amountType,
      items,
      subtotal,
      totalQty: quantity,
    };

    try {
      await api.put(`/api/purchases/${purchaseId}`,updated);

      alert("Purchase Updated Successfully!");
      navigate("/purchaselist");

    } catch (err) {
      console.error(err);
      alert("Error updating purchase!");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-br from-slate-100 to-slate-200">

      {/* BILL DETAILS */}
      <div className="bg-white/80 shadow-lg rounded-2xl p-5 mb-6 border">
        <h2 className="text-xl font-semibold mb-4">🧾 Edit Purchase Bill</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm">Bill No</label>
            <input value={billNum} readOnly className="w-full input" />
          </div>

          <div>
            <label className="text-sm">Date</label>
            <input type="date" value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full input"
            />
          </div>

          <div>
            <label className="text-sm">Type</label>
            <select value={purchaseType}
              onChange={(e) => setPurchaseType(e.target.value)}
              className="w-full input"
            >
              <option>Purchase</option>
              <option>Purchase Return</option>
            </select>
          </div>
        </div>
      </div>

      {/* SUPPLIER CARD */}
      <div className="relative bg-white/80 shadow-lg rounded-2xl p-5 mb-6 border">

        <h2 className="text-xl font-semibold mb-4">👤 Supplier</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          <div className="relative">
            <label className="text-sm">Supplier *</label>
            <input
              name="supplier"
              value={selectedName}
              onChange={handleChange}
              onClick={() => setFilteredSuppliers(suppliersList)}
              onFocus={() => setFilteredSuppliers(suppliersList)}
              onKeyDown={(e) => handleKeyDown(e, selectSupplier)}
              className="w-full input"
            />

            {filteredSuppliers.length > 0 && (
              <ul className="dropdown">
                {filteredSuppliers.map((s, idx) => (
                  <li
                    key={s._id}
                    onClick={() => selectSupplier(s.name || s.supplierName)}
                    className={`dropdown-item ${idx === highlightIndex ? "bg-blue-200" : ""
                      }`}
                  >
                    {s.name || s.supplierName}
                  </li>
                ))}

                <button
                  onClick={() => navigate("/setting/customer")}
                  className="w-full py-2 bg-green-100 hover:bg-green-200"
                >
                  ➕ Add Supplier
                </button>
              </ul>
            )}
          </div>

          <div>
            <label className="text-sm">Bill Type</label>
            <select
              value={billType}
              onChange={(e) => setBillType(e.target.value)}
              className="w-full input"
            >
              <option>Cash</option>
              <option>Credit</option>
            </select>
          </div>

          <div>
            <label className="text-sm">GST Type</label>
            <select
              value={gstType}
              onChange={(e) => setGstType(e.target.value)}
              className="w-full input"
            >
              <option>GST</option>
              <option>IGST</option>
              <option>No Tax</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Amount Type</label>
            <select
              value={amountType}
              onChange={(e) => setAmountType(e.target.value)}
              className="w-full input"
            >
              <option>No Tax</option>
              <option>Including Tax</option>
              <option>Excluding Tax</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCT ADD */}
      <div className="bg-white/80 shadow-lg rounded-2xl p-5 mb-6 border">
        <h2 className="text-xl font-semibold mb-4">📦 Add Product</h2>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">

          <div className="relative">
            <input
              name="product"
              value={item.product}
              onChange={handleChange}
              placeholder="Product"
              className="input"
            />

            {filteredProducts.length > 0 && (
              <ul className="dropdown">
                {filteredProducts.map((p) => (
                  <li
                    key={p._id}
                    onClick={() => selectProduct(p.name)}
                    className="dropdown-item"
                  >
                    {p.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input name="qty" value={item.qty} onChange={handleChange} type="number" placeholder="Qty" className="input" />
          <input name="mrp" value={item.mrp} onChange={handleChange} type="number" placeholder="MRP" className="input" />
          <input name="rate" value={item.rate} onChange={handleChange} type="number" placeholder="Rate" className="input" />
          <input name="dis" value={item.dis} onChange={handleChange} type="number" placeholder="DIS%" className="input" />

          <select name="tax" value={item.tax} onChange={handleChange} className="input">
            <option>0</option>
            <option>5</option>
            <option>12</option>
            <option>18</option>
            <option>28</option>
          </select>

          <button onClick={addItem} className="btn-blue">Add</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/90 shadow-lg rounded-2xl p-5 mb-6 border">
        <table className="w-full">
          <thead className="bg-slate-100 sticky top-0">
            <tr>
              <th>Product</th>
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
              <tr key={i} className="border-b">
                <td>{itm.product}</td>
                <td>{itm.qty}</td>
                <td>₹{itm.mrp}</td>
                <td>₹{itm.rate}</td>
                <td>{itm.dis}%</td>
                <td>{itm.tax}%</td>
                <td>{calculateItemBreakdown(itm).totalAmount.toFixed(2)}</td>

                <td>
                  <button
                    onClick={() => deleteItem(i)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* SUMMARY */}
      <div className="bg-white/80 shadow rounded-2xl p-5 flex justify-between text-lg">
        <div>Total Qty: {quantity}</div>
        <div className="font-semibold text-green-700">Payable: ₹{subtotal.toFixed(2)}</div>
      </div>

      <div className="text-right mt-6">
        <button
          onClick={handleUpdate}
          className="btn-green text-lg px-6 py-3"
        >
          Update Purchase
        </button>
      </div>

    </div>
  );
};

export default EditPurchase;

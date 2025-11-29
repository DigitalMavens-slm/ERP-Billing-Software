import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./InvoiceApp.css";

import { useNavigate } from "react-router-dom";
import { useSuggestions } from "../Context/SuggestionContext";

const API_URL = import.meta.env.VITE_API_URL;

const InvoiceApp = () => {
  const navigate = useNavigate();
  const { setCustomerId } = useSuggestions();
  const [invoiceNum, setInvoiceNum] = useState("");
  const [date, setDate] = useState("");
  const [invoiceType, setInvoiceType] = useState("Invoice");
  const [customerName, setCustomerName] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
  customerId: "" ,  
  phone: "",
  gstin: "",
  email: "",
  address: "",
});
// console.log(customerDetails);

  const [billType, setBillType] = useState("Cash");
  const [gstType, setGstType] = useState("GST");
  const [amountType, setAmountType] = useState("Excluding Tax");

  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [item, setItem] = useState({
    product: "",
    qty: 0,
    mrp: 0,
    rate: 0,
    dis: 0,
    tax: 0,
  });

  const [payment, setPayment] = useState({
  billType: "Cash", // Default
  receivedAmount: 0,
  balanceAmount: 0,
  paymentStatus: "Pending",
  upiId: "",
  bankName: "",
  transactionId: "",
});


  const [items, setItems] = useState([]);

  // 🔹 Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProductsList(res.data);
        // console.log(res.data)
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Fetch Customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/customers`);
        // console.log(res.data)
        setCustomersList(res.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  // 🔹 Auto-generate Invoice No & Date
 useEffect(() => {
  const fetchNextInvoiceNum = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/invoices/next-invoice-num`);
      setInvoiceNum(res.data.nextInvoiceNum);
    } catch (err) {
      console.error("Error fetching invoice number:", err);
      setInvoiceNum("INV0001"); // fallback
    }

    setDate(new Date().toISOString().split("T")[0]);
  };

  fetchNextInvoiceNum();
}, []);


  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "customer") {
    setCustomerName(value);
    if (value.trim() === "") {
      setFilteredCustomers(customersList);
    } else {
      const filtered = customersList.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
    return;
  }

  if (name === "product") {
    setItem((prev) => ({ ...prev, product: value }));

    if (value.trim() === "") {
      setFilteredProducts(productsList);
    } else {
      const filtered = productsList.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    return;
  }
    setItem((prev) => ({
      ...prev,
      [name]:
        name === "qty" || name === "mrp" || name === "rate" || name === "dis"
          ? Number(value)
          : value,
    }));
  };

  // 🔹 When input clicked — show all products
  const handleProductClick = () => {
    setFilteredProducts(productsList);
    // setFilteredProducts(customersList)
  };


const selectCustomer = (name) => {
  setCustomerName(name);
  const selected = customersList.find((c) => c.name === name);
  if (selected) {
    setCustomerDetails({
      phone: selected.phone,
      gstin: selected.gstin,
      email: selected.email,
      address: selected.billingAddress,
      customerId:selected._id
    });
    console.log(selected._id)
  }
  setFilteredCustomers([]); // hide suggestion list
};


  // 🔹 Select Product → Auto fill MRP, Rate, GST
  const selectProduct = (selectedName) => {
    const selected = productsList.find((p) => p.name === selectedName);
    if (selected) {
      setItem({
        ...item,
        product: selected.name,
        mrp: selected.mrp || 0,
        rate: selected.saleRate || 0,
        tax: selected.gst || 18,
      });
    }
    setFilteredProducts([]);
  };

  // 🔹 Add Item
  const addItem = () => {
    if (!item.product.trim()) return alert("Product Name required!");
    if (item.qty <= 0) return alert("Quantity must be > 0!");
    if (item.rate <= 0) return alert("Rate must be > 0!");

    setItems((prev) => [...prev, item]);
    setItem({ product: "", qty: 0, mrp: 0, rate: 0, dis: 0, tax: 0 });
  };

  // 🔹 Delete Item
  const deleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Tax Logic
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

  const subtotal = items.reduce((acc, itm) => acc + calculateItemBreakdown(itm).totalAmount,0);

  const quantity = items.reduce((acc, itm) => acc + itm.qty, 0);

   const handleSave = async () => {
    if (items.length === 0) return alert("No items added!");
    if (!customerName.trim()) return alert("Customer Name required!");

    const invoiceData = {
       customerId: customerDetails.customerId,
      invoiceNum,
      date,
      invoiceType,
      customerName,
      billType,
      gstType,
      amountType,
      items,
      subtotal,
      totalQty:quantity,
      // payment
    };

    try {
      // 🔹 Save to DB
     const res= await axios.post(`${API_URL}/api/invoices`, invoiceData);
      setCustomerId(customerDetails.customerId);
       console.log(res)
      
      navigate("/invoice-details", { state: { invoiceData ,customerDetails,} });


    } catch (err) {
      console.error("Error saving invoice:", err);
      alert("Error saving invoice!");
    }
  }

 return (
    <div className="w-full p-4 space-y-6">

      {/* HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="flex flex-col">
          <label>Invoice No *</label>
          <input className="input" value={invoiceNum} readOnly />
        </div>

        <div className="flex flex-col">
          <label>Date *</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label>Invoice Type *</label>
          <select
            className="input"
            value={invoiceType}
            onChange={(e) => setInvoiceType(e.target.value)}
          >
            <option value="Invoice">Invoice</option>
            <option value="Proforma Invoice">Proforma Invoice</option>
          </select>
        </div>
      </div>

      {/* CUSTOMER DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="flex flex-col relative">
          <label>Customer Name *</label>
          <input
            className="input"
            placeholder="Enter Customer Name"
            value={customerName}
            name="customer"
            autoComplete="off"
            onChange={handleChange}
          />

          {filteredCustomers.length > 0 && (
            <ul className="absolute bg-white shadow rounded w-full max-h-40 overflow-y-auto z-20">
              {filteredCustomers.map((c) => (
                <li
                  key={c._id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => selectCustomer(c.name)}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col">
          <label>Bill Type *</label>
          <select
            className="input"
            value={billType}
            onChange={(e) => {
              setBillType(e.target.value);
              setPayment((prev) => ({ ...prev, billType: e.target.value }));
            }}
          >
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label>GST Type *</label>
          <select
            className="input"
            value={gstType}
            onChange={(e) => setGstType(e.target.value)}
          >
            <option value="GST">GST</option>
            <option value="IGST">IGST</option>
            <option value="NOTax">No Tax</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label>All Amounts Are *</label>
          <select
            className="input"
            value={amountType}
            onChange={(e) => setAmountType(e.target.value)}
          >
            <option value="No Tax">No Tax</option>
            <option value="Including Tax">Including Tax</option>
            <option value="Excluding Tax">Excluding Tax</option>
          </select>
        </div>
      </div>

      {/* ITEM INPUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">

        <div className="relative">
          <input
            className="input"
            placeholder="Product Name"
            name="product"
            value={item.product}
            onClick={handleProductClick}
            onChange={handleChange}
            autoComplete="off"
          />
          {filteredProducts.length > 0 && (
            <ul className="absolute z-20 w-full bg-white shadow rounded max-h-40 overflow-y-auto">
              {filteredProducts.map((p) => (
                <li
                  key={p._id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selectProduct(p.name)}
                >
                  {p.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input className="input" name="qty" placeholder="QTY" type="number" value={item.qty} onChange={handleChange} />
        <input className="input" name="mrp" placeholder="MRP" type="number" value={item.mrp} onChange={handleChange} />
        <input className="input" name="rate" placeholder="Rate" type="number" value={item.rate} onChange={handleChange} />
        <input className="input" name="dis" placeholder="DIS %" type="number" value={item.dis} onChange={handleChange} />

        <select className="input" name="tax" value={item.tax} onChange={handleChange}>
          <option value="0">0</option>
          <option value="5">5</option>
          <option value="12">12</option>
          <option value="18">18</option>
          <option value="28">28</option>
        </select>

        <button className="bg-blue-600 text-white px-4 rounded" onClick={addItem}>Add</button>
      </div>

      {/* ITEM TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="border p-2">PRODUCT NAME</th>
              <th className="border p-2">QTY</th>
              <th className="border p-2">MRP</th>
              <th className="border p-2">RATE</th>
              <th className="border p-2">DIS%</th>
              <th className="border p-2">GST%</th>
              <th className="border p-2">TOTAL</th>
              <th className="border p-2">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {items.map((itm, idx) => (
              <tr key={idx}>
                <td className="border p-2">{itm.product}</td>
                <td className="border p-2">{itm.qty}</td>
                <td className="border p-2">₹{itm.mrp}</td>
                <td className="border p-2">₹{itm.rate}</td>
                <td className="border p-2">{itm.dis}%</td>
                <td className="border p-2">{itm.tax}%</td>
                <td className="border p-2">₹{calculateItemBreakdown(itm).totalAmount.toFixed(2)}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => deleteItem(idx)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col md:flex-row justify-between font-bold text-lg">
        <div>Total Qty: {quantity}</div>
        <div className="text-blue-600">Payable: ₹{subtotal.toFixed(2)}</div>
      </div>

      <div className="text-right">
        <button className="bg-green-600 text-white px-5 py-2 rounded" onClick={handleSave}>
          Save & View Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceApp;



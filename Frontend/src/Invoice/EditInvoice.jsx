import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api"; // your axios instance

const EditInvoice = () => {
  const navigate = useNavigate();
  const params = useParams();
//   const params = params.id;
  const location = useLocation();
  const invoiceId=location.state?.invoiceId || params.id
  console.log(invoiceId)

  // Basic
  const [invoiceNum, setInvoiceNum] = useState("");
  const [date, setDate] = useState("");
  const [invoiceType, setInvoiceType] = useState("Invoice");

  // Customer
  const [customerName, setCustomerName] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    customerId: "",
    phone: "",
    gstin: "",
    email: "",
    address: "",
  });

  // Config
  const [billType, setBillType] = useState("Cash");
  const [gstType, setGstType] = useState("GST");
  const [amountType, setAmountType] = useState("Excluding Tax");

  // Lists & suggestions
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Item input
  const [item, setItem] = useState({
    productId: "",
    product: "",
    qty: 0,
    mrp: 0,
    rate: 0,
    dis: 0,
    tax: 0,
  });

  // Items in invoice
  const [items, setItems] = useState([]);

  // Load product & customer master lists
  useEffect(() => {
    api.get("/api/products")
      .then((res) => setProductsList(res.data || []))
      .catch(console.error);

    api.get("/api/customers")
      .then((res) => setCustomersList(res.data || []))
      .catch(console.error);
  }, []);

  // Load invoice to edit
  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/api/invoices/${invoiceId}`);
        const payload = res.data; // adapt if your response shape differs
        const p = payload?.data || payload; // try both shapes

        if (!p) {
          console.error("No invoice data returned");
          return;
        }

        // Basic fields
        setInvoiceNum(p.invoiceNum || p.invoiceNo || "");
        setDate(p.date ? p.date.split("T")[0] : "");
        setInvoiceType(p.invoiceType || "Invoice");
        setBillType(p.billType || "Cash");
        setGstType(p.gstType || "GST");
        setAmountType(p.amountType || "Excluding Tax");

        // Customer (safe)
        if (p.customerId || p.customer) {
          setCustomerDetails({
            customerId: p.customerId || p.customer?._id || "",
            phone: p.customer?.phone || p.phone || "",
            gstin: p.customer?.gstin || p.gstin || "",
            email: p.customer?.email || p.email || "",
            address: p.customer?.billingAddress || p.address || "",
          });
          setCustomerName(p.customerName || p.customer?.name || "");
        }

        // Items: ensure productId present for each item
        const normalizedItems = Array.isArray(p.items)
          ? p.items.map((it) => {
              // If item stored as { product: { _id, name } } or { productId } or { product }
              const productId =
                it.productId ||
                (it.product && (it.product._id || it.product.id)) ||
                undefined;

              // If still undefined, try to match by product name to assign id
              let finalProductId = productId;
              if (!finalProductId && it.product) {
                const matched = productsList.find(
                  (pr) =>
                    pr.name &&
                    it.product &&
                    pr.name.toLowerCase() === String(it.product).toLowerCase()
                );
                if (matched) finalProductId = matched._id;
              }

              return {
                productId: finalProductId || "", // keep empty string if not found; we'll validate later
                product: it.product?.name || it.product || it.productName || "",
                qty: it.qty || it.quantity || 0,
                mrp: it.mrp || 0,
                rate: it.rate || it.saleRate || it.purchaseRate || 0,
                dis: it.dis || it.discount || 0,
                tax: it.tax || it.gst || 0,
              };
            })
          : [];

        setItems(normalizedItems);
      } catch (err) {
        console.error("Error loading invoice:", err);
      }
    };

    fetchInvoice();
  }, [invoiceId, productsList]); // productsList used to try match ids when loading

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Customer suggestion
    if (name === "customer") {
      setCustomerName(value);
      if (!value.trim()) {
        setFilteredCustomers(customersList);
      } else {
        setFilteredCustomers(
          customersList.filter((c) =>
            (c.name || "")
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          )
        );
      }
      return;
    }

    // Product suggestion
    if (name === "product") {
      setItem((prev) => ({ ...prev, product: value }));

      if (!value.trim()) {
        setFilteredProducts(productsList);
      } else {
        setFilteredProducts(
          productsList.filter((p) =>
            (p.name || "").toLowerCase().includes(value.toLowerCase())
          )
        );
      }
      return;
    }

    // numeric fields
    setItem((prev) => ({
      ...prev,
      [name]:
        ["qty", "mrp", "rate", "dis"].includes(name) ? Number(value) : value,
    }));
  };

  // Select customer from suggestions
  const selectCustomer = (name) => {
    setCustomerName(name);
    const selected = customersList.find((c) => c.name === name);
    if (selected) {
      setCustomerDetails({
        customerId: selected._id,
        phone: selected.phone || "",
        gstin: selected.gstin || "",
        email: selected.email || "",
        address: selected.billingAddress || "",
      });
    }
    setFilteredCustomers([]);
  };

  // Select product from suggestions
  const selectProduct = (name) => {
    const p = productsList.find((x) => x.name === name);
    if (!p) return;

    setItem({
      productId: p._id,
      product: p.name,
      qty: 1,
      mrp: p.mrp || 0,
      rate: p.saleRate || p.purchaseRate || 0,
      dis: 0,
      tax: p.gst || 0,
    });
    setFilteredProducts([]);
  };

  // Add item: enforce productId present
  const addItem = () => {
    if (!item.productId) {
      // try auto-match by name (case-insensitive)
      const match = productsList.find(
        (p) =>
          p.name &&
          item.product &&
          p.name.toLowerCase() === item.product.toString().toLowerCase()
      );
      if (match) {
        item.productId = match._id;
      } else {
        return alert("Please select product from dropdown (do not type manually).");
      }
    }

    if (!item.product || !String(item.product).trim())
      return alert("Product required!");

    if (!item.qty || item.qty <= 0) return alert("Qty must be > 0!");
    if (!item.rate || item.rate <= 0) return alert("Rate must be > 0!");

    // push safe copy
    const newItem = {
      productId: item.productId,
      product: item.product,
      qty: item.qty,
      mrp: item.mrp,
      rate: item.rate,
      dis: item.dis || 0,
      tax: item.tax || 0,
    };

    setItems((prev) => [...prev, newItem]);

    // reset input
    setItem({ productId: "", product: "", qty: 0, mrp: 0, rate: 0, dis: 0, tax: 0 });
  };

  // Delete
  const deleteItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Calculation
  const calculateItemBreakdown = (itm) => {
    const discountAmount = (itm.rate * itm.qty * (itm.dis || 0)) / 100;
    const gstPercent = Number(itm.tax || 0);
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

  const subtotal = items.reduce((acc, it) => acc + calculateItemBreakdown(it).totalAmount, 0);
  const quantity = items.reduce((acc, it) => acc + (it.qty || 0), 0);

  // Update invoice
  const handleUpdate = async () => {
    // validations
    if (!customerDetails.customerId)
      return alert("Please select a valid customer from suggestions!");

    if (!items.length) return alert("Please add at least one item!");

    // ensure every item has productId: try best-effort to fill using productsList
    const validatedItems = items.map((it) => {
      if (!it.productId) {
        const match = productsList.find(
          (p) => p.name && p.name.toLowerCase() === String(it.product).toLowerCase()
        );
        if (match) it.productId = match._id;
      }
      return it;
    });

    // final check
    const missing = validatedItems.find((it) => !it.productId);
    if (missing) return alert("One or more items missing productId. Please re-select product from dropdown.");

    const payload = {
      customerId: customerDetails.customerId,
      invoiceNum,
      date,
      invoiceType,
      customerName,
      billType,
      gstType,
      amountType,
      items: validatedItems,
      subtotal,
      totalQty: quantity,
    };

    try {
      await api.put(`/api/invoices/${invoiceId}`, payload);
      alert("Invoice updated successfully!");
      navigate("/invoicelist");
    } catch (err) {
      console.error("Error updating invoice:", err);
      alert("Error updating invoice!");
    }
  };

  return (
    <div className="w-full p-4 space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label>Invoice No</label>
          <input className="input" value={invoiceNum} readOnly />
        </div>

        <div>
          <label>Date</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label>Invoice Type</label>
          <select className="input" value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)}>
            <option>Invoice</option>
            <option>Proforma Invoice</option>
          </select>
        </div>
      </div>

      {/* Customer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <label>Customer Name</label>
          <input
            className="input"
            name="customer"
            value={customerName}
            onChange={handleChange}
            autoComplete="off"
            onClick={() => setFilteredCustomers(customersList)}
            onFocus={() => setFilteredCustomers(customersList)}
          />
          {filteredCustomers.length > 0 && (
            <ul className="absolute z-30 bg-white w-full shadow rounded max-h-40 overflow-y-auto">
              {filteredCustomers.map((c) => (
                <li key={c._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectCustomer(c.name)}>
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label>Bill Type</label>
          <select className="input" value={billType} onChange={(e) => setBillType(e.target.value)}>
            <option>Cash</option>
            <option>Credit</option>
          </select>
        </div>

        <div>
          <label>GST Type</label>
          <select className="input" value={gstType} onChange={(e) => setGstType(e.target.value)}>
            <option>GST</option>
            <option>IGST</option>
            <option>No Tax</option>
          </select>
        </div>

        <div>
          <label>Amount Type</label>
          <select className="input" value={amountType} onChange={(e) => setAmountType(e.target.value)}>
            <option>No Tax</option>
            <option>Including Tax</option>
            <option>Excluding Tax</option>
          </select>
        </div>
      </div>

      {/* Add product */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="relative">
          <input
            className="input"
            placeholder="Product Name"
            name="product"
            value={item.product}
            onChange={handleChange}
            onClick={() => setFilteredProducts(productsList)}
            autoComplete="off"
          />
          {filteredProducts.length > 0 && (
            <ul className="absolute z-30 bg-white w-full shadow rounded max-h-40 overflow-y-auto">
              {filteredProducts.map((p) => (
                <li key={p._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectProduct(p.name)}>
                  {p.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input className="input" name="qty" type="number" placeholder="Qty" value={item.qty} onChange={handleChange} />
        <input className="input" name="mrp" type="number" placeholder="MRP" value={item.mrp} onChange={handleChange} />
        <input className="input" name="rate" type="number" placeholder="Rate" value={item.rate} onChange={handleChange} />
        <input className="input" name="dis" type="number" placeholder="DIS%" value={item.dis} onChange={handleChange} />

        <select className="input" name="tax" value={item.tax} onChange={handleChange}>
          <option value="0">0</option>
          <option value="5">5</option>
          <option value="12">12</option>
          <option value="18">18</option>
          <option value="28">28</option>
        </select>

        <button className="bg-blue-600 text-white px-4 rounded" onClick={addItem}>
          Add
        </button>
      </div>

      {/* Items table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="border p-2">PRODUCT</th>
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
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => deleteItem(idx)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row justify-between font-bold text-lg">
        <div>Total Qty: {quantity}</div>
        <div className="text-blue-600">Payable: ₹{subtotal.toFixed(2)}</div>
      </div>

      <div className="text-right">
        <button className="bg-green-600 text-white px-5 py-2 rounded" onClick={handleUpdate}>
          Update Invoice
        </button>
      </div>
    </div>
  );
};

export default EditInvoice;

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handlePrint, handleDownloadPDF } from "../Utills/AllPrinter";
// import axios from "axios";
import { useSuggestions } from "../Context/SuggestionContext";
import api from "../api";

const InvoiceDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setCustomerId } = useSuggestions();

  const invoice = state?.invoiceData;
  const customer = state?.customerDetails;

  useEffect(() => {
    if (customer?.customerId) setCustomerId(customer.customerId);
  }, [customer]);

  if (!invoice) return <h3 className="text-center mt-20 text-xl">No Invoice Data Found!</h3>;

  const totalAmount = invoice.items.reduce(
    (acc, itm) => acc + itm.qty * itm.rate,
    0
  );

  const sendMail = async () => {
    try {
      const response = await api.post("/api/invoice/send", {
        customerEmail: customer.email,
        invoice: {
          invoiceNum: invoice.invoiceNum,
          date: invoice.date,
          customerName: invoice.customerName,
          billType: invoice.billType,
          gstType: invoice.gstType,
          items: invoice.items,
          subtotal: totalAmount.toFixed(2),
        },
      });

      alert(response.data.success ? "✅ Email Sent!" : "❌ Failed to Send Email");
    } catch (err) {
      alert("❌ Something went wrong!");
    }
  };

  return (
  <div
    id="invoice-details"
    className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4"
  >

    {/* HEADER */}
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
      📄 Invoice Details
    </h2>

    {/* TOP DETAILS BOX */}
<div className="bg-gray-50 rounded-lg shadow-sm p-3 sm:p-5 text-sm sm:text-base">

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* LEFT */}
    <div className="space-y-1">
      <p><b>Invoice No:</b> {invoice.invoiceNum}</p>
      <p><b>Date:</b> {invoice.date}</p>
      <p><b>Bill Type:</b> {invoice.billType}</p>
      <p><b>GST Type:</b> {invoice.gstType}</p>
    </div>

    {/* RIGHT */}
    <div className="space-y-1">
      <p><b>Customer:</b> {invoice.customerName}</p>
      <p><b>Phone:</b> {customer.phone}</p>
      <p className="break-all">
        <b>Email:</b> {customer.email}
      </p>
      <p><b>GST:</b> {customer.gst || "-"}</p>
    </div>

    {/* ADDRESS */}
    <div className="md:col-span-2 border-t pt-2">
      <p><b>Address:</b></p>
      <p className="text-gray-700 leading-relaxed">
        {customer.address.line1}, {customer.address.line2}<br />
        {customer.address.city} - {customer.address.pincode}
      </p>
    </div>

  </div>
</div>


    {/* ITEMS - DESKTOP TABLE */}
<div className="hidden sm:block mt-6 overflow-x-auto">
  <table className="min-w-[650px] w-full border rounded-lg shadow-sm text-sm">
    <thead className="bg-gray-800 text-white">
      <tr>
        <th className="p-2">#</th>
        <th className="p-2">Product</th>
        <th className="p-2">Qty</th>
        <th className="p-2">MRP</th>
        <th className="p-2">Rate</th>
        <th className="p-2">Dis%</th>
        <th className="p-2">GST%</th>
        <th className="p-2">Total</th>
      </tr>
    </thead>

    <tbody>
      {invoice.items.map((itm, i) => (
        <tr key={i} className="text-center border-b">
          <td className="p-2">{i + 1}</td>
          <td className="p-2 font-medium">{itm.product}</td>
          <td className="p-2">{itm.qty}</td>
          <td className="p-2">₹{itm.mrp}</td>
          <td className="p-2">₹{itm.rate}</td>
          <td className="p-2">{itm.dis}%</td>
          <td className="p-2">{itm.tax}%</td>
          <td className="p-2 font-semibold">
            ₹{(itm.qty * itm.rate).toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* ITEMS - MOBILE CARD VIEW */}
<div className="sm:hidden mt-6 space-y-3">
  {invoice.items.map((itm, i) => (
    <div
      key={i}
      className="border rounded-lg p-3 shadow-sm bg-white text-sm"
    >
      <div className="flex justify-between mb-1">
        <span className="font-semibold">{itm.product}</span>
        <span>#{i + 1}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <p><b>Qty:</b> {itm.qty}</p>
        <p><b>MRP:</b> ₹{itm.mrp}</p>
        <p><b>Rate:</b> ₹{itm.rate}</p>
        <p><b>Dis%:</b> {itm.dis}%</p>
        <p><b>GST%:</b> {itm.tax}%</p>
        <p className="font-semibold">
          <b>Total:</b> ₹{(itm.qty * itm.rate).toFixed(2)}
        </p>
      </div>
    </div>
  ))}
</div>


    {/* TOTAL BOX */}
    <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg shadow-md text-right text-sm sm:text-base">
      <p><b>Sub Total:</b> ₹{totalAmount.toFixed(2)}</p>
      <p><b>Round Off:</b> ₹{invoice.roundOff.toFixed(2)}</p>
      <p className="text-lg sm:text-xl font-bold">
        <b>Payable Amount:</b>{" "}
        ₹{(totalAmount + Number(invoice.roundOff)).toFixed(2)}
      </p>
    </div>

    {/* ACTION BUTTONS */}
    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">

      <button
        onClick={() => navigate("/invoicecreate")}
        className="w-full sm:w-auto px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Back to Invoice
      </button>

      <button
        onClick={() =>
          handleDownloadPDF("invoice-details", "Invoice-" + invoice.invoiceNum)
        }
        className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
      >
        📄 Download PDF
      </button>

      <button
        onClick={sendMail}
        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        📧 Send Mail
      </button>

    </div>

  </div>
);

};

export default InvoiceDetails;

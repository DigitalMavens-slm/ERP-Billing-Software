import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import api from "../api"


const InvoiceView = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isPrintMode = query.get("print") === "true";

  const [invoice, setInvoice] = useState(null);
   const [userCompanyDetails,setUserCompanyDetails]=useState("")
  console.log(userCompanyDetails)
  const { companyName,address,
mobile1,
email,
gstNo
}=userCompanyDetails
  // console.log(invoice)
  const componentRef = useRef(null);

 

  const handlePrint = useReactToPrint({
  contentRef:  componentRef,
  documentTitle: `invoice_${id}`,
  removeAfterPrint: true,
});


  useEffect(() => {
  const fetchCompanySettings = async () => {
    try {
      const res = await api.get("/api/company-settings");
      setUserCompanyDetails(res.data); // 🔥 company settings details
    } catch (err) {
      console.log("Company settings fetch error:", err);
    }
  };

  fetchCompanySettings();
}, []);

  useEffect(() => {
    api.get(`/api/invoices/${id}`)
      .then((res) => setInvoice(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);



  useEffect(() => {
  if (!invoice || !isPrintMode) return;

  const timer = setTimeout(() => {
    if (componentRef.current) {
      handlePrint();
    } else {
      console.error("Print ref not ready");
    }
  }, 1000); // 🔥 500 romba kammi, 1000 safe

  return () => clearTimeout(timer);
}, [invoice, isPrintMode, handlePrint]);


  if (!invoice) return <div>Loading...</div>;


return (
  <div className="bg-blue-50 min-h-screen p-6">
    {/* PRINT AREA */}
    <div
      ref={componentRef}
      className="mx-auto max-w-4xl bg-white p-8 border border-gray-200 font-sans"
    >
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center border-b-4 border-blue-600 pb-4 mb-6">
        {/* LEFT: LOGO + COMPANY */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center text-xl font-bold rounded-lg">
            LOGO
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-600">
              {companyName}
            </h2>
            <p className="text-sm text-gray-600">
                {address.street} ,{address.city},<br/>{address.state},{address.pincode}<br /> 
               <b>GSTIN:</b>{gstNo}<br />
                <b>Phone:</b> {mobile1}<br /> 
                 <b>Email:</b> {email}<br /> 
            </p>
          </div>
        </div>

      </div>

      {/* ===== CUSTOMER DETAILS ===== */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* BILL TO */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Bill To
          </h3>
          <p className="font-semibold">{invoice.customerName}</p>
          <p>{invoice.customerId.billingAddress.line1}</p>
          <p>
            {invoice.customerId.billingAddress.city},{" "}
            {invoice.customerId.billingAddress.state} –{" "}
            {invoice.customerId.billingAddress.pincode}
          </p>
          <p>GSTIN: {invoice.customerId.gstin}</p>
          <p>Phone: {invoice.customerId.phone}</p>
        </div>

        {/* SHIP TO */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Ship To
          </h3>
          <p>{invoice.customerId.shippingAddress.line1}</p>
          <p>
            {invoice.customerId.shippingAddress.city},{" "}
            {invoice.customerId.shippingAddress.state} –{" "}
            {invoice.customerId.shippingAddress.pincode}
          </p>
        </div>

         <div className="text-right">
          <h1 className="text-3xl font-bold text-blue-600">INVOICE</h1>
          <p className="text-sm">
            <b>No:</b> {invoice.invoiceNum}
          </p>
          <p className="text-sm">
            <b>Date:</b> {invoice.date.slice(0, 10)}
          </p>
        </div>
      </div>

      {/* ===== ITEMS TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">Rate</th>
              <th className="p-3 text-center">GST %</th>
              <th className="p-3 text-center">GST Amt</th>
              <th className="p-3 text-center">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item) => {
              const base = item.qty * item.rate;
              const gst = (base * item.tax) / 100;
              const total = base + gst;

              return (
                <tr
                  key={item._id}
                  className="border-b text-sm hover:bg-blue-50"
                >
                  <td className="p-3">{item.product}</td>
                  <td className="p-3 text-center">{item.qty}</td>
                  <td className="p-3 text-center">₹{item.rate}</td>
                  <td className="p-3 text-center">{item.tax}%</td>
                  <td className="p-3 text-center">
                    ₹{gst.toFixed(2)}
                  </td>
                  <td className="p-3 text-center font-semibold">
                    ₹{total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== GRAND TOTAL ===== */}
      <div className="flex justify-end mt-6">
        <div className="text-right">
          <p className="text-lg font-semibold">Grand Total</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{invoice.subtotal}
          </p>
        </div>
      </div>

      <hr className="my-8" />

      {/* ===== FOOTER ===== */}
      <div className="grid grid-cols-3 gap-6 text-sm">
        {/* BANK */}
        <div>
          <h4 className="font-semibold text-blue-600 mb-1">
            Bank Details
          </h4>
          <p>SBI</p>
          <p>A/C: 1234567890</p>
          <p>IFSC: SBIN000123</p>
        </div>

        {/* TERMS */}
        <div className="text-center">
          <h4 className="font-semibold text-blue-600 mb-1">
            Terms & Conditions
          </h4>
          <p>
            Goods once sold will not be taken back. <br />
            Payment within 7 days.
          </p>
        </div>

        {/* SIGN */}
        <div className="text-right">
          <p>For <b>Your Company</b></p>
          <div className="h-10 border-b border-gray-800 mt-4"></div>
          <p className="mt-1">Authorized Signature</p>
        </div>
      </div>
    </div>

    {/* PRINT BUTTON */}
    {!isPrintMode && (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
    if (!componentRef.current) {
      alert("Invoice not ready to print");
      return;
    }
    handlePrint();
  }}
  className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
        >
          Download / Print Invoice
        </button>
      </div>
    )}
  </div>
);


};

export default InvoiceView;





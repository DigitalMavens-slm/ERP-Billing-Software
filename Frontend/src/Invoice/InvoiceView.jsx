import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import api from "../api";

const InvoiceView = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isPrintMode = query.get("print") === "true";

  const [invoice, setInvoice] = useState(null);

  const [userCompanyDetails, setUserCompanyDetails] = useState({
    companyName: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    mobile1: "",
    email: "",
    gstNo: "",
  });

  const { companyName, address, mobile1, email, gstNo } =
    userCompanyDetails || {};

  const componentRef = useRef(null);


  useEffect(() => {
    api
      .get(`/api/invoices/${id}`)
      .then((res) => setInvoice(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        const res = await api.get("/api/company-settings");
        setUserCompanyDetails(res.data);
      } catch (err) {
        console.log("Company settings fetch error:", err);
      }
    };
    fetchCompanySettings();
  }, []);


  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `invoice_${id}`,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (!invoice || !isPrintMode) return;

    const timer = setTimeout(() => {
      if (componentRef.current) handlePrint();
    }, 800);

    return () => clearTimeout(timer);
  }, [invoice, isPrintMode, handlePrint]);

  if (!invoice) return <div>Loading...</div>;


  let subtotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  invoice.items.forEach((item) => {
    const taxable = item.qty * item.rate;

    if (item.taxType === "IGST") {
      const igst = (taxable * item.tax) / 100;
      igstTotal += igst;
      subtotal += taxable;
    } else {
      const cgst = (taxable * item.tax) / 200;
      const sgst = (taxable * item.tax) / 200;
      cgstTotal += cgst;
      sgstTotal += sgst;
      subtotal += taxable;
    }
  });

  const grandTotal = subtotal + cgstTotal + sgstTotal + igstTotal;


  return (
    <div className="bg-blue-50 min-h-screen p-6">
      <div
        ref={componentRef}
        className="mx-auto max-w-4xl bg-white p-8 border font-sans"
      >
        {/* ===== HEADER ===== */}
        <div className="flex justify-between border-b-4 border-blue-600 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">
              {companyName}
            </h2>
            <p className="text-sm">
              {address?.street}, {address?.city} <br />
              {address?.state} - {address?.pincode} <br />
              <b>GSTIN:</b> {gstNo} <br />
              <b>Phone:</b> {mobile1} <br />
              <b>Email:</b> {email}
            </p>
          </div>
        </div>

       


          <div className="grid grid-cols-3 gap-6 mb-6">
  <div>
    <h3 className="font-semibold text-blue-600 mb-1">Bill To</h3>
    <p className="font-medium">{invoice.customerName}</p>
    <p>{invoice.customerId?.billingAddress?.line1}</p>
    <p>
      {invoice.customerId?.billingAddress?.city},{" "}
      {invoice.customerId?.billingAddress?.state} -{" "}
      {invoice.customerId?.billingAddress?.pincode}
    </p>
    <p>GSTIN: {invoice.customerId?.gstin}</p>
    <p>Phone: {invoice.customerId?.phone}</p>
  </div>

  <div>
    <h3 className="font-semibold text-blue-600 mb-1">Ship To</h3>
    <p>{invoice.customerId?.shippingAddress?.line1}</p>
    <p>
      {invoice.customerId?.shippingAddress?.city},{" "}
      {invoice.customerId?.shippingAddress?.state} -{" "}
      {invoice.customerId?.shippingAddress?.pincode}
    </p>
  </div>

  {/* ===== INVOICE INFO ===== */}
  <div className="text-right">
    <h1 className="text-3xl font-bold text-blue-600">INVOICE</h1>
    <p>
      <b>No:</b> {invoice.invoiceNum}
    </p>
    <p>
      <b>Date:</b> {invoice.date.slice(0, 10)}
    </p>
  </div>
</div>


        <table className="w-full border text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">Hsn Code</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">GST%</th>
              <th className="border p-2">Taxable</th>
              <th className="border p-2">CGST </th>
              <th className="border p-2">SGST</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>

          <tbody>

            {invoice.items.map((item, i) => {
              console.log(item)
              const taxable = item.qty * item.rate;

              let cgst = 0,
                sgst = 0,
                igst = 0,
                total = 0;

              if (item.taxType === "IGST") {
                igst = (taxable * item.tax) / 100;
                total = taxable + igst;
              } else {
                cgst = (taxable * item.tax) / 200;
                sgst = (taxable * item.tax) / 200;
                total = taxable + cgst + sgst;
              }

              return (
                <tr key={i}>
                  <td className="border p-2">{item.product}</td>
                  <td className="border p-2">{item.productId?.hsncode}</td>
                  <td className="border p-2 text-center">{item.qty}</td>
                  <td className="border p-2 text-center">{item.productId?.unit}</td>
                  <td className="border p-2 text-right">₹{item.rate}</td>
                  <td className="border p-2 text-center">{item.tax}%</td>

                  <td className="border p-2 text-right">
                    ₹{taxable.toFixed(2)}
                  </td>

                  <td className="border p-2 text-right">
                    {item.taxType === "IGST"
                      ? `IGST ₹${igst.toFixed(2)}`
                      : `₹${cgst.toFixed(2)}`}
                  </td>

                  <td className="border p-2 text-right">
                    {item.taxType === "IGST"
                      ? "-"
                      : `₹${sgst.toFixed(2)}`}
                  </td>

                  <td className="border p-2 text-right font-bold">
                    ₹{total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-1/3 text-sm border-t pt-3">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </p>

            {igstTotal > 0 ? (
              <p className="flex justify-between">
                <span>IGST</span>
                <span>₹{igstTotal.toFixed(2)}</span>
              </p>
            ) : (
              <>
                <p className="flex justify-between">
                  <span>CGST</span>
                  <span>₹{cgstTotal.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>SGST</span>
                  <span>₹{sgstTotal.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>RoundOff</span>
                  <span>₹{invoice.roundOff}</span>
                </p>
              </>
            )}
            <p className="flex justify-between font-bold text-blue-600 text-lg">
              <span>Grand Total</span>
              {/* <span>₹{grandTotal+invoice.roundOff.toFixed(2)}</span> */}
              <span>₹{(grandTotal + Number(invoice.roundOff)).toFixed(2)}</span>

            </p>
          </div>
        </div>
      </div>

      {!isPrintMode && (
        <div className="text-center mt-6">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Download / Print Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceView;



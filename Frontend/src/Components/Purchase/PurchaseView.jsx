
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import api from "../../api";

const PurchaseView = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isPrintMode = query.get("print") === "true";

  const [purchase, setPurchase] = useState(null);
  console.log("Purchase Data:", purchase);
  const [userCompanyDetails, setUserCompanyDetails] = useState({
    companyName: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    bankDetails: {
      accountNumber: "",
      bankName: "",
      ifsc: "",
    },
    mobile1: "",
    email: "",
    gstNo: "",
  });

  const { companyName, address, mobile1, email, gstNo } =
    userCompanyDetails || {};

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `purchase_${id}`,
    removeAfterPrint: true,
  });

  useEffect(() => {
    api
      .get(`/api/purchases/${id}`)
      .then((res) => setPurchase(res.data.data))
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

  useEffect(() => {
    if (!purchase || !isPrintMode) return;

    const timer = setTimeout(() => {
      if (componentRef.current) handlePrint();
    }, 800);

    return () => clearTimeout(timer);
  }, [purchase, isPrintMode, handlePrint]);

  if (!purchase) return <div>Loading...</div>;

  // TOTAL CALCULATION
  let subtotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;

  purchase.items.forEach((item) => {
    const taxable = item.qty * item.rate;
    const cgst = (taxable * item.tax) / 200;
    const sgst = (taxable * item.tax) / 200;

    subtotal += taxable;
    cgstTotal += cgst;
    sgstTotal += sgst;
  });

  const grandTotal = subtotal + cgstTotal + sgstTotal;

return (
  <div className="bg-blue-50 min-h-screen p-3 sm:p-4 md:p-6">

    <div
      ref={componentRef}
      className="mx-auto max-w-4xl bg-white p-4 sm:p-6 md:p-8 border font-sans"
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 border-b-4 border-blue-600 pb-4 mb-6">

        <div className="flex gap-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white flex items-center justify-center font-bold rounded">
            LOGO
          </div>

          <div className="text-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-600">
              {companyName}
            </h2>
            <p className="leading-relaxed">
              {address?.street}, {address?.city}<br />
              {address?.state} - {address?.pincode}<br />
              <b>GSTIN:</b> {gstNo}<br />
              <b>Phone:</b> {mobile1}<br />
              <b>Email:</b> {email}
            </p>
          </div>
        </div>
      </div>

      {/* ================= SUPPLIER + BILL ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">

        <div>
          <h3 className="font-semibold text-blue-600 mb-1">
            Supplier
          </h3>
          <p>{purchase.supplierName}</p>
          <p>{purchase.supplierId?.address}</p>
          <p>GSTIN: {purchase.supplierId?.gstin}</p>
          <p>Phone: {purchase.supplierId?.phone}</p>
        </div>

        <div className="sm:text-right">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            PURCHASE
          </h1>
          <p><b>No:</b> {purchase.billNum}</p>
          <p><b>Date:</b> {purchase.date.slice(0, 10)}</p>
        </div>
      </div>

      {/* ================= ITEMS TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2 hidden sm:table-cell">HSN</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2 hidden sm:table-cell">Unit</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2 hidden md:table-cell">Taxable</th>
              <th className="border p-2">CGST / IGST</th>
              <th className="border p-2 hidden sm:table-cell">SGST</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {purchase.items.map((item, i) => {
              const taxable = item.qty * item.rate;

              let cgst = 0, sgst = 0, igst = 0, total = 0;

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
                  <td className="border p-2 hidden sm:table-cell">
                    {item.productId?.hsncode || "-"}
                  </td>
                  <td className="border p-2 text-center">{item.qty}</td>
                  <td className="border p-2 text-center hidden sm:table-cell">
                    {item.unit}
                  </td>
                  <td className="border p-2 text-right">₹{item.rate}</td>
                  <td className="border p-2 text-right hidden md:table-cell">
                    ₹{taxable.toFixed(2)}
                  </td>

                  <td className="border p-2 text-center">
                    {item.taxType === "IGST"
                      ? `IGST ₹${igst.toFixed(2)}`
                      : `₹${cgst.toFixed(2)}`}
                  </td>

                  <td className="border p-2 text-center hidden sm:table-cell">
                    {item.taxType === "IGST" ? "-" : `₹${sgst.toFixed(2)}`}
                  </td>

                  <td className="border p-2 text-right font-semibold">
                    ₹{total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= TOTALS ================= */}
      <div className="flex justify-end mt-6">
        <div className="w-full sm:w-1/2 md:w-1/3 text-sm border-t pt-3">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>CGST</span>
            <span>₹{cgstTotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>SGST</span>
            <span>₹{sgstTotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between font-bold text-blue-600 text-lg">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </p>
        </div>
      </div>

      <hr className="my-6" />

      {/* ================= FOOTER ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-blue-600">Bank Details</h4>
          <p>{userCompanyDetails.bankDetails.accountNumber}</p>
          <p>{userCompanyDetails.bankDetails.bankName}</p>
          <p>{userCompanyDetails.bankDetails.ifsc}</p>
        </div>

        <div className="sm:text-center">
          <b>Terms & Conditions</b><br />
          Goods once sold will not be taken back.<br />
          Payment within 7 days.
        </div>

        <div className="sm:text-right">
          <p>For <b>Your Company</b></p>
          <div className="border-b mt-6"></div>
          <p>Authorised Signatory</p>
        </div>
      </div>
    </div>

    {!isPrintMode && (
      <div className="text-center mt-6">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Download / Print
        </button>
      </div>
    )}
  </div>
);

};

export default PurchaseView;

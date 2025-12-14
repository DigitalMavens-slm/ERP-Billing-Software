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
  // console.log(purchase)
  const [userCompanyDetails,setUserCompanyDetails]=useState(
    {
  companyName: "",
  address: {
    street: "",
    city: "",
    state: "",
    pincode: ""
  },
  
bankDetails:{
accountNumber:"",
bankName: "",
ifsc: "",
  mobile1: "",
  email: "",
  gstNo: ""
}}
  )

const {
  companyName = "",
  address = {},
  mobile1 = "",
  email = "",
  gstNo = ""
} = userCompanyDetails || {};

console.log(userCompanyDetails)
  const componentRef = useRef(null);

  // PRINT HANDLER (SAME AS INVOICE)
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `purchase_${id}`,
    removeAfterPrint: true,
  });

  // FETCH PURCHASE
  useEffect(() => {
    api.get(`/api/purchases/${id}`)
      .then((res) => setPurchase(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);

 


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


  // AUTO PRINT
  useEffect(() => {
    if (!purchase || !isPrintMode) return;

    const timer = setTimeout(() => {
      if (componentRef.current) {
        handlePrint();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [purchase, isPrintMode, handlePrint]);

  if (!purchase) return <div>Loading...</div>;

  return (
    <div className="bg-blue-50 min-h-screen p-6">
      {/* PRINT AREA */}
      <div
        ref={componentRef}
        className="mx-auto max-w-4xl bg-white p-8 border border-gray-200 font-sans"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-4 border-blue-600 pb-4 mb-6">
          {/* COMPANY */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center text-xl font-bold rounded-lg">
              LOGO
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-600">
                {companyName}
              </h2>
              <p className="text-sm text-gray-600">
                {address?.street} ,{address?.city},<br/>{address?.state},{address?.pincode}<br /> 
               <b>GSTIN:</b>{gstNo}<br />
                <b>Phone:</b> {mobile1}<br /> 
                 <b>Email:</b> {email}<br /> 
              </p>
            </div>
          </div>
        </div>

        {/* SUPPLIER DETAILS */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Supplier
            </h3>
            <p className="font-semibold">{purchase.supplierName}</p>
            <p>{purchase.supplierId.address}</p>
            <p>GSTIN: {purchase.supplierId?.gstin}</p>
            <p>Phone: {purchase.supplierId?.phone}</p>
          </div>

          <div className="text-right">
            <h1 className="text-3xl font-bold text-blue-600">
              PURCHASE
            </h1>
            <p className="text-sm">
              <b>No:</b> {purchase.billNum}
            </p>
            <p className="text-sm">
              <b>Date:</b> {purchase.date.slice(0, 10)}
            </p>
          </div>
        </div>

        {/* ITEMS TABLE */}
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
              {purchase.items.map((item) => {
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

        {/* TOTAL */}
        <div className="flex justify-end mt-6">
          <div className="text-right">
            <p className="text-lg font-semibold">Grand Total</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{purchase.subtotal}
            </p>
          </div>
        </div>

        <hr className="my-8" />

        {/* FOOTER */}
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-blue-600 mb-1">
              Bank Details
            </h4>
            <p>{userCompanyDetails?.bankDetails?.accountNumber}</p>
            <p><b>A/C:</b> {userCompanyDetails?.bankDetails?.bankName}</p>
            <p><b>IFSC:</b> {userCompanyDetails?.bankDetails?.ifsc}</p>
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-blue-600 mb-1">
              Terms & Conditions
            </h4>
            <p>
              Goods once purchased cannot be returned. <br />
              Payment as per agreement.
            </p>
          </div>

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
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
          >
            Download / Print Purchase
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseView;

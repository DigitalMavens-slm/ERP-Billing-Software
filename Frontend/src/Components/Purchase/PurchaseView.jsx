// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// import api from "../../api";

// const PurchaseView = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const isPrintMode = query.get("print") === "true";

//   const [purchase, setPurchase] = useState(null);
//   const [userCompanyDetails,setUserCompanyDetails]=useState(
//     {
//   companyName: "",
//   address: {
//     street: "",
//     city: "",
//     state: "",
//     pincode: ""
//   },
  
// bankDetails:{
// accountNumber:"",
// bankName: "",
// ifsc: "",
//   mobile1: "",
//   email: "",
//   gstNo: ""
// }}
//   )

// const {
//   companyName = "",
//   address = {},
//   mobile1 = "",
//   email = "",
//   gstNo = ""
// } = userCompanyDetails || {};

// console.log(userCompanyDetails)
//   const componentRef = useRef(null);

//   // PRINT HANDLER (SAME AS INVOICE)
//   const handlePrint = useReactToPrint({
//     contentRef: componentRef,
//     documentTitle: `purchase_${id}`,
//     removeAfterPrint: true,
//   });

//   useEffect(() => {
//     api.get(`/api/purchases/${id}`)
//       .then((res) => setPurchase(res.data.data))
//       .catch((err) => console.log(err));
//   }, [id]);

 


//   useEffect(() => {
//   const fetchCompanySettings = async () => {
//     try {
//       const res = await api.get("/api/company-settings");
//       setUserCompanyDetails(res.data); 
//     } catch (err) {
//       console.log("Company settings fetch error:", err);
//     }
//   };

//   fetchCompanySettings();
// }, []);


//   // AUTO PRINT
//   useEffect(() => {
//     if (!purchase || !isPrintMode) return;

//     const timer = setTimeout(() => {
//       if (componentRef.current) {
//         handlePrint();
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [purchase, isPrintMode, handlePrint]);

//   if (!purchase) return <div>Loading...</div>;

//   return (
//     <div className="bg-blue-50 min-h-screen p-6">
//       {/* PRINT AREA */}
//       <div
//         ref={componentRef}
//         className="mx-auto max-w-4xl bg-white p-8 border border-gray-200 font-sans"
//       >
//         {/* HEADER */}
//         <div className="flex justify-between items-center border-b-4 border-blue-600 pb-4 mb-6">
//           {/* COMPANY */}
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center text-xl font-bold rounded-lg">
//               LOGO
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-blue-600">
//                 {companyName}
//               </h2>
//               <p className="text-sm text-gray-600">
//                 {address?.street} ,{address?.city},<br/>{address?.state},{address?.pincode}<br /> 
//                <b>GSTIN:</b>{gstNo}<br />
//                 <b>Phone:</b> {mobile1}<br /> 
//                  <b>Email:</b> {email}<br /> 
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* SUPPLIER DETAILS */}
//         <div className="grid grid-cols-2 gap-6 mb-8">
//           <div>
//             <h3 className="text-lg font-semibold text-blue-600 mb-2">
//               Supplier
//             </h3>
//             <p className="font-semibold">{purchase.supplierName}</p>
//             <p>{purchase.supplierId.address}</p>
//             <p>GSTIN: {purchase.supplierId?.gstin}</p>
//             <p>Phone: {purchase.supplierId?.phone}</p>
//           </div>

//           <div className="text-right">
//             <h1 className="text-3xl font-bold text-blue-600">
//               PURCHASE
//             </h1>
//             <p className="text-sm">
//               <b>No:</b> {purchase.billNum}
//             </p>
//             <p className="text-sm">
//               <b>Date:</b> {purchase.date.slice(0, 10)}
//             </p>
//           </div>
//         </div>

//         {/* ITEMS TABLE */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead className="bg-blue-600 text-white">
//               <tr>
//                 <th className="p-3 text-left">Item</th>
//                 <th className="p-3 text-center">Qty</th>
//                 <th className="p-3 text-center">Rate</th>
//                 <th className="p-3 text-center">GST %</th>
//                 <th className="p-3 text-center">GST Amt</th>
//                 <th className="p-3 text-center">Total</th>
//               </tr>
//             </thead>

//             <tbody>
//               {purchase.items.map((item) => {
//                 const base = item.qty * item.rate;
//                 const gst = (base * item.tax) / 100;
//                 const total = base + gst;

//                 return (
//                   <tr
//                     key={item._id}
//                     className="border-b text-sm hover:bg-blue-50"
//                   >
//                     <td className="p-3">{item.product}</td>
//                     <td className="p-3 text-center">{item.qty}</td>
//                     <td className="p-3 text-center">₹{item.rate}</td>
//                     <td className="p-3 text-center">{item.tax}%</td>
//                     <td className="p-3 text-center">
//                       ₹{gst.toFixed(2)}
//                     </td>
//                     <td className="p-3 text-center font-semibold">
//                       ₹{total.toFixed(2)}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* TOTAL */}
//         <div className="flex justify-end mt-6">
//           <div className="text-right">
//             <p className="text-lg font-semibold">Grand Total</p>
//             <p className="text-2xl font-bold text-blue-600">
//               ₹{purchase.subtotal}
//             </p>
//           </div>
//         </div>

//         <hr className="my-8" />

//         {/* FOOTER */}
//         <div className="grid grid-cols-3 gap-6 text-sm">
//           <div>
//             <h4 className="font-semibold text-blue-600 mb-1">
//               Bank Details
//             </h4>
//             <p>{userCompanyDetails?.bankDetails?.accountNumber}</p>
//             <p><b>A/C:</b> {userCompanyDetails?.bankDetails?.bankName}</p>
//             <p><b>IFSC:</b> {userCompanyDetails?.bankDetails?.ifsc}</p>
//           </div>

//           <div className="text-center">
//             <h4 className="font-semibold text-blue-600 mb-1">
//               Terms & Conditions
//             </h4>
//             <p>
//               Goods once purchased cannot be returned. <br />
//               Payment as per agreement.
//             </p>
//           </div>

//           <div className="text-right">
//             <p>For <b>Your Company</b></p>
//             <div className="h-10 border-b border-gray-800 mt-4"></div>
//             <p className="mt-1">Authorized Signature</p>
//           </div>
//         </div>
//       </div>

//       {/* PRINT BUTTON */}
//       {!isPrintMode && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handlePrint}
//             className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
//           >
//             Download / Print Purchase
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseView;



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
    <div className="bg-blue-50 min-h-screen p-6">
      <div
        ref={componentRef}
        className="mx-auto max-w-4xl bg-white p-8 border font-sans"
      >
        {/* HEADER */}
        <div className="flex justify-between border-b-4 border-blue-600 pb-4 mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center font-bold rounded">
              LOGO
            </div>
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
        </div>

        {/* SUPPLIER */}
        <div className="grid grid-cols-2 mb-6">
          <div>
            <h3 className="font-semibold text-blue-600">Supplier</h3>
            <p>{purchase.supplierName}</p>
            <p>{purchase.supplierId?.address}</p>
            <p>GSTIN: {purchase.supplierId?.gstin}</p>
            <p>Phone: {purchase.supplierId?.phone}</p>
          </div>

          <div className="text-right">
            <h1 className="text-3xl font-bold text-blue-600">PURCHASE</h1>
            <p>
              <b>No:</b> {purchase.billNum}
            </p>
            <p>
              <b>Date:</b> {purchase.date.slice(0, 10)}
            </p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full border text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Taxable</th>
              <th className="border p-2">CGST</th>
              <th className="border p-2">SGST</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {purchase.items.map((item, i) => {
                        console.log(item)
              const taxable = item.qty * item.rate;

let cgst = 0;
let sgst = 0;
let igst = 0;
let total = 0;

if (item.taxType === "IGST") {
  // 🔥 IGST FULL
  igst = (taxable * item.tax) / 100;
  total = taxable + igst;
} else {
  // 🔥 GST → CGST + SGST
  cgst = (taxable * item.tax) / 200;
  sgst = (taxable * item.tax) / 200;
  total = taxable + cgst + sgst;
}


              return (
                <tr key={i}>
                  <td className="border p-2">{item.product}</td>
                  <td className="border p-2">{item.hsncode || "-"}</td>
                  <td className="border p-2 text-center">{item.qty}</td>
                  <td className="border p-2 text-center">{item.unit}</td>
                  <td className="border p-2 text-right">₹{item.rate}</td>
                  {/* <td className="border p-2 text-right">
                    ₹{taxable.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right">
                    ₹{cgst.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right">
                    ₹{sgst.toFixed(2)}
                  </td>
                  <td className="border p-2 text-right font-semibold">
                    ₹{total.toFixed(2)}
                  </td> */}

                  <td className="border p-2 text-center">₹{taxable.toFixed(2)}</td>

<td className="border p-2 text-center">
  {item.taxType === "IGST"
    ? `IGST ₹${igst.toFixed(2)}`
    : ` ₹${cgst.toFixed(2)}`}
</td>

<td className="border p-2 text-center">
  {item.taxType === "IGST"
    ? "-"
    : `₹${sgst.toFixed(2)}`}
</td>

<td className="font-bold border p-2 text-center">₹{total.toFixed(2)}</td>

                </tr>
              );
            })}
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="flex justify-end mt-6">
          <div className="w-1/3 text-sm border-t pt-3">
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

        {/* FOOTER */}
        <div className="grid grid-cols-3 text-sm">
          <div>
            <h4 className="font-semibold text-blue-600">Bank Details</h4>
            <p>{userCompanyDetails.bankDetails.accountNumber}</p>
            <p>{userCompanyDetails.bankDetails.bankName}</p>
            <p>{userCompanyDetails.bankDetails.ifsc}</p>
          </div>

          <div className="text-center">
            {/* Goods once sold cannot be returned. */}
            Terms & Conditions
Goods once sold will not be taken back.<br/>
Payment within 7 days.
          </div>

          <div className="text-right">
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

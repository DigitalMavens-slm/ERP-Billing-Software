// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function SupplierLedger() {
//   const [ledger, setLedger] = useState([]);
//   const [supplierId, setSupplierId] = useState("");
//   const [query, setQuery] = useState("");
//   // console.log(query)
//   const [suggestions, setSuggestions] = useState([]);
// //   console.log(suggestions)
//   const [showList, setShowList] = useState(false);

//   // Fetch ledger based on supplierId
//   useEffect(() => {
//     if (!supplierId) return;
//     axios
//       .get(`${API_URL}/api/supplierledger/${supplierId}`)
//       .then((res) => setLedger(res.data.ledger || []))
//       .catch((err) => console.error("Supplier Ledger fetch error:", err));
//   }, [supplierId]);

//   // Suggest Supplier search
//   const handleChange = async (value) => {
//     setQuery(value);

//     if (!value.trim()) {
//       setSuggestions([]);
//       setShowList(false);
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `${API_URL}/api/suppliers/suggestions?query=${value}`
//       );
//       console.log(res.data)
//       setSuggestions(res.data);
//       setShowList(true);
//     } catch (err) {
//       console.error("Error fetching supplier suggestions:", err);
//     }
//   };


 
//   const handleSelect = async (supplier) => {
//   console.log(supplier);

//   const res = await axios.get(`${API_URL}/api/suppliers/id/${supplier._id}`);

//   // Correct supplier ID
//   setSupplierId(res.data._id);

//   // Correct supplier name
//   setQuery(res.data.name);

//   setShowList(false);
// };


//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-6">

//       <h2 className="text-3xl font-semibold mb-6 text-gray-800">
//         📘 Supplier Purchase Ledger
//       </h2>

//       {/* Search Box */}
//       <div className="relative mb-6">
//         <input
//           type="text"
//           placeholder="Search supplier name..."
//           value={query}
//           onChange={(e) => handleChange(e.target.value)}
//           className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         />

//         {/* Suggestions Dropdown */}
//         {showList && suggestions.length > 0 && (
//           <ul className="absolute z-20 w-full bg-white shadow-lg border rounded-lg max-h-60 overflow-y-auto mt-1">
//             {suggestions.map((sup) => (
//               <li
//                 key={sup._id}
//                 onClick={() => handleSelect(sup)}
//                 className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
//               >
//                 {sup.name}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Ledger Table */}
//       <div className="overflow-x-auto shadow-lg rounded-lg border bg-white">
//         <table className="w-full min-w-[800px] text-left">
//           <thead>
//             <tr className="bg-gray-100 text-gray-700 font-medium">
//               <th className="p-3">Date</th>
//               <th className="p-3">Particulars</th>
//               <th className="p-3">Purchase No</th>
//               <th className="p-3">Debit (₹)</th>
//               <th className="p-3">Credit (₹)</th>
//               <th className="p-3">Balance (₹)</th>
//             </tr>
//           </thead>

//           <tbody>
//             {ledger.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="6"
//                   className="text-center p-6 text-gray-500 font-medium"
//                 >
//                   No purchase ledger records found
//                 </td>
//               </tr>
//             ) : (
//               ledger.map((row, i) => (
//                 <tr
//                   key={i}
//                   className="border-t hover:bg-gray-50 transition"
//                 >
//                   <td className="p-3">
//                     {new Date(row.date).toLocaleDateString()}
//                   </td>
//                   <td className="p-3">{row.particulars}</td>
//                   <td className="p-3">{row.purchaseNo}</td>
//                   <td className="p-3">
//                     {typeof row.debit === "number"
//                       ? row.debit.toFixed(2)
//                       : "-"}
//                   </td>
//                   <td className="p-3">
//                     {typeof row.credit === "number"
//                       ? row.credit.toFixed(2)
//                       : "-"}
//                   </td>
//                   <td className="p-3">
//                     {typeof row.balance === "number"
//                       ? row.balance.toFixed(2)
//                       : "-"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function SupplierLedger() {
  const [ledger, setLedger] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showList, setShowList] = useState(false);
  const[supplierPayments,setSupplierPayments]=useState([])

  // Fetch ledger based on supplierId
  useEffect(() => {
    if (!supplierId) return;

    axios
      .get(`${API_URL}/api/supplierledger/${supplierId}`)
      .then((res) => setLedger(res.data.ledger || []))
      .catch((err) => console.error("Supplier Ledger fetch error:", err));
  }, [supplierId]);

  // Handle search box input
  const handleChange = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowList(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/api/suppliers/suggestions?query=${value}`
      );

      setSuggestions(res.data); // MUST be an array
      setShowList(true);
    } catch (err) {
      console.error("Error fetching supplier suggestions:", err);
    }
  };

  // Handle suggestion click
  const handleSelect = async (supplier) => {
    try {
      const res = await axios.get(`${API_URL}/api/suppliers/${supplier._id}` );
      const paymentRes = await axios.get(`${API_URL}/api/purchase-payments/supplier/${supplier._id}`);

      setSupplierId(res.data._id);  // supplier ID
      setQuery(res.data.name);      // supplier name
        setSupplierPayments(paymentRes.data.payments);

    console.log("Supplier Payments:", paymentRes.data.payments);
      setShowList(false);

    } catch (err) {
      console.error("Error selecting supplier:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        📘 Supplier Purchase Ledger
      </h2>

      {/* Search Box */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search supplier name..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Suggestions Dropdown */}
        {showList && suggestions.length > 0 && (
          <ul className="absolute z-20 w-full bg-white shadow-lg border rounded-lg max-h-60 overflow-y-auto mt-1">
            {suggestions.map((sup) => (
              <li
                key={sup._id}
                onClick={() => handleSelect(sup)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
              >
                {sup.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border bg-white">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-medium">
              <th className="p-3">Date</th>
              <th className="p-3">Particulars</th>
              <th className="p-3">Purchase No</th>
              <th className="p-3">Debit (₹)</th>
              <th className="p-3">Credit (₹)</th>
              <th className="p-3">Balance (₹)</th>
            </tr>
          </thead>

          <tbody>
            {ledger.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500 font-medium"
                >
                  No purchase ledger records found
                </td>
              </tr>
            ) : (
              ledger.map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{row.particulars}</td>
                  <td className="p-3">{row.purchaseNo}</td>
                  <td className="p-3">
                    {typeof row.debit === "number"
                      ? row.debit.toFixed(2)
                      : "-"}
                  </td>
                  <td className="p-3">
                    {typeof row.credit === "number"
                      ? row.credit.toFixed(2)
                      : "-"}
                  </td>
                  <td className="p-3">
                    {typeof row.balance === "number"
                      ? row.balance.toFixed(2)
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

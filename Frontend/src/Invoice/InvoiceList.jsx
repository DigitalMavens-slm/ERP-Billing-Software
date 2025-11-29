// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function InvoiceEdit() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);

//   const [invoiceNum, setInvoiceNum] = useState("");
//   const [date, setDate] = useState("");
//   const [invoiceType, setInvoiceType] = useState("Invoice");
//   const [customerName, setCustomerName] = useState("");
//   const[listData,setlistData]=useState([])
//   console.log(listData)

//   const [customerDetails, setCustomerDetails] = useState({
//     customerId: "",
//     phone: "",
//     gstin: "",
//     email: "",
//     address: "",
//   });

//   const [billType, setBillType] = useState("Cash");
//   const [gstType, setGstType] = useState("GST");
//   const [amountType, setAmountType] = useState("Excluding Tax");

//   const [items, setItems] = useState([]);


//     useEffect(() => {
//     fetchInvoice();
//   }, []);

//   const fetchInvoice = async () => {
//     const res = await axios.get(`${API_URL}/api/allinvoice`);
//     setlistData(res.data.invoices);
//   };

//   // 🔥 FETCH EXISTING INVOICE

  
//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/invoices/${id}`);
//         const data = res.data;

//         setInvoiceNum(data.invoiceNum);
//         setDate(data.date);
//         setInvoiceType(data.invoiceType);
//         setCustomerName(data.customerName);

//         setCustomerDetails({
//           customerId: data.customerId,
//           phone: data.customerDetails?.phone || "",
//           gstin: data.customerDetails?.gstin || "",
//           email: data.customerDetails?.email || "",
//           address: data.customerDetails?.address || "",
//         });

//         setBillType(data.billType);
//         setGstType(data.gstType);
//         setAmountType(data.amountType);

//         setItems(data.items || []);

//         setLoading(false);
//       } catch (err) {
//         console.error("Error loading invoice:", err);
//       }
//     };

//     fetchInvoice();
//   }, [id]);

//   // 🔥 SAVE UPDATED INVOICE
//   const handleUpdate = async () => {
//     const updatedInvoice = {
//       invoiceNum,
//       date,
//       invoiceType,
//       customerName,
//       billType,
//       gstType,
//       amountType,
//       items,
//     };

//     try {
//       await axios.put(`${API_URL}/api/invoices/${id}`, updatedInvoice);
//       alert("Invoice updated successfully!");

//       navigate("/invoice-details", {
//         state: { invoiceData: updatedInvoice, customerDetails },
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Update failed!");
//     }
//   };

//   if (loading) return <div className="p-4">Loading Invoice...</div>;

//   return (
//     <>
//     <div className="p-4 space-y-6">
//       <h1 className="text-xl font-bold text-blue-600">
//         Editing Invoice #{invoiceNum}
//       </h1>

//       {/* YOU CAN REUSE YOUR SAME UI BELOW (copy from create) */}
//       {/* Example */}
//       <div>
//         <label>Date *</label>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="input"
//         />
//       </div>

//       {/* Your items table + editing logic place here */}

//       <button
//         onClick={handleUpdate}
//         className="bg-green-600 text-white px-5 py-2 rounded"
//       >
//         Update Invoice
//       </button>
//     </div>
//     {/* {listData.map((lnl,i)=>{
//         return(
//               <div className="div">
//                 <div className="">{lnl.invoiceNum}</div>
//               </div>)
//     })} */}


//     {listData.map((lnl, i) => {
//   return (
//     <div key={i} className="div">
//       <div>{lnl.invoiceNum}</div>
//     </div>
//   );
// })}

//     </>
//   );
// }






import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();
  console.log(invoices)

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const res = await axios.get(`${API_URL}/api/allinvoice`);
    setInvoices(res.data.invoices);
  };

  const deleteInvoice = async (id) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    await axios.delete(`${API_URL}/api/invoices/${id}`);
    fetchInvoices();
  };

  // Status Badge Color Function
  const statusBadge = (status) => {
    if (status === "Paid")
      return "bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full text-sm";
    if (status === "Overdue")
      return "bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-full text-sm";
    return "bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-full text-sm";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">Invoice List</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              {/* <th className="p-4">Due Date</th> */}
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-semibold">{inv.invoiceNum}</td>
                <td className="p-4">{inv.customerName}</td>
                <td className="p-4">{inv.date}</td>
                {/* <td className="p-4">{inv.dueDate || "-"}</td> */}
                <td className="p-4 font-medium">
                  ₹ {inv.subtotal?.toLocaleString()}
                </td>

                <td className="p-4">
                  <span className={statusBadge(inv.paymentStatus)}>{inv.paymentStatus}</span>
                </td>

                <td className="p-4 flex justify-center gap-4">
                  {/* <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/invoice/edit/${inv._id}`)}
                  >
                    <Edit size={20} />
                  </button> */}

                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteInvoice(inv._id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

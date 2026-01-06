

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function DeletedInvoiceList() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const resPerPage = 10;

  // 🔥 FETCH DELETED INVOICES
  const fetchDeletedInvoices = async (currentPage = 1) => {
    try {
      const res = await api.get(
        `/api/deleview?page=${currentPage}`
      );

      setInvoices(res.data.invoices);
      setTotalPages(
        Math.ceil(res.data.totalDeletedInvoices / resPerPage)
      );
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Failed to fetch deleted invoices", err);
    }
  };

  // 🔁 useEffect
  useEffect(() => {
    fetchDeletedInvoices(page);
  }, [page]);

  const next = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  // return (
  //   <div className="p-6">
  //     <h2 className="text-2xl font-bold mb-5 text-red-600">
  //       Deleted Invoices
  //     </h2>

  //     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
  //       <table className="w-full text-left">
  //         <thead className="bg-red-50 border-b">
  //           <tr>
  //             <th className="p-4">Invoice #</th>
  //             <th className="p-4">Customer</th>
  //             <th className="p-4">Date</th>
  //             <th className="p-4">Amount</th>
  //             <th className="p-4">Deleted At</th>
  //             <th className="p-4 text-center">View</th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {invoices.length === 0 && (
  //             <tr>
  //               <td
  //                 colSpan="6"
  //                 className="p-6 text-center text-gray-500"
  //               >
  //                 No deleted invoices found
  //               </td>
  //             </tr>
  //           )}

  //           {invoices.map((inv) => (
  //             <tr
  //               key={inv._id}
  //               className="border-b bg-gray-50 hover:bg-gray-100"
  //             >
  //               <td className="p-4 font-semibold text-gray-500">
  //                 {inv.invoiceNum}
  //               </td>
  //               <td className="p-4">{inv.customerName}</td>
  //               <td className="p-4">{inv.date}</td>
  //               <td className="p-4">
  //                 ₹ {inv.subtotal?.toLocaleString()}
  //               </td>
  //               <td className="p-4 text-sm text-red-500">
  //                 {inv.deletedAt
  //                   ? new Date(inv.deletedAt).toLocaleString()
  //                   : "-"}
  //               </td>
  //               <td className="p-4 text-center">
  //                 <button
  //                   className="text-blue-600 hover:text-blue-800"
  //                   onClick={() =>
  //                     navigate(`/invoice/view/${inv._id}`)
  //                   }
  //                 >
  //                   <Eye size={18} />
  //                 </button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>

  //       {/* 🔹 Pagination */}
  //       <div className="flex justify-center items-center gap-4 py-4">
  //         <button
  //           onClick={prev}
  //           disabled={page === 1}
  //           className="px-3 py-1 border rounded disabled:opacity-50"
  //         >
  //           &lt;
  //         </button>

  //         <span>
  //           Page {page} / {totalPages}
  //         </span>

  //         <button
  //           onClick={next}
  //           disabled={page === totalPages}
  //           className="px-3 py-1 border rounded disabled:opacity-50"
  //         >
  //           &gt;
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );


  return (
  <div className="p-4 md:p-6">
    <h2 className="text-xl md:text-2xl font-bold mb-5 text-red-600">
      Deleted Invoices
    </h2>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm md:text-base">

          <thead className="bg-red-50 border-b">
            <tr>
              <th className="p-3 md:p-4">Invoice #</th>
              <th className="p-3 md:p-4">Customer</th>
              <th className="p-3 md:p-4 hidden sm:table-cell">Date</th>
              <th className="p-3 md:p-4 hidden md:table-cell">Amount</th>
              <th className="p-3 md:p-4 hidden lg:table-cell">Deleted At</th>
              <th className="p-3 md:p-4 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500"
                >
                  No deleted invoices found
                </td>
              </tr>
            )}

            {invoices.map((inv) => (
              <tr
                key={inv._id}
                className="border-b bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="p-3 md:p-4 font-semibold text-gray-500">
                  {inv.invoiceNum}
                </td>

                <td className="p-3 md:p-4">
                  {inv.customerName}
                </td>

                <td className="p-3 md:p-4 hidden sm:table-cell">
                  {inv.date}
                </td>

                <td className="p-3 md:p-4 hidden md:table-cell">
                  ₹ {inv.subtotal?.toLocaleString()}
                </td>

                <td className="p-3 md:p-4 text-sm text-red-500 hidden lg:table-cell">
                  {inv.deletedAt
                    ? new Date(inv.deletedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3 md:p-4 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/invoice/view/${inv._id}`)}
                    title="View Invoice"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 py-4 text-sm md:text-base">
        <button
          onClick={prev}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          onClick={next}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>

    </div>
  </div>
);

}

import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2,Download,Eye } from "lucide-react";
import api from "../api";
import usePagination from "../customHooks/usePagination";

const API_URL = import.meta.env.VITE_API_URL;

export default function InvoiceList() {
  // const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const handleView = (id) => {
  navigate(`/invoice/view/${id}`);
};

const handleDownload = (id) => {
  navigate(`/invoice/view/${id}?print=true`);
};

 


  const {
    data: invoices,
    page,
    totalPages,
    next,
    prev
  } = usePagination("/api/allinvoice", "invoices","totalInvoices");
  
  const deleteInvoice = async (id) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    await api.delete(`/api/invoice/delete/${id}`);
    // fetchInvoices();
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
  <div className="p-4 md:p-6">
    <h2 className="text-xl md:text-2xl font-bold mb-5">
      Invoice List
    </h2>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm md:text-base">

          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 md:p-4">Invoice #</th>
              <th className="p-3 md:p-4">Customer</th>
              <th className="p-3 md:p-4 hidden sm:table-cell">Date</th>
              <th className="p-3 md:p-4 hidden md:table-cell">Amount</th>
              <th className="p-3 md:p-4">Status</th>
              <th className="p-3 md:p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 md:p-4 font-semibold">
                  {inv.invoiceNum}
                </td>

                <td className="p-3 md:p-4">
                  {inv.customerName}
                </td>

                <td className="p-3 md:p-4 hidden sm:table-cell">
                  {inv.date}
                </td>

                <td className="p-3 md:p-4 hidden md:table-cell font-medium">
                  ₹ {inv.payableAmount?.toLocaleString()}
                </td>

                <td className="p-3 md:p-4">
                  <span className={statusBadge(inv.paymentStatus)}>
                    {inv.paymentStatus}
                  </span>
                </td>

                <td className="p-3 md:p-4 flex justify-center gap-3">

                  {/* DELETE */}
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteInvoice(inv._id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* VIEW */}
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleView(inv._id)}
                    title="View"
                  >
                    <Eye size={18} />
                  </button>

                  {/* DOWNLOAD */}
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => handleDownload(inv._id)}
                    title="Download Invoice"
                  >
                    <Download size={18} />
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

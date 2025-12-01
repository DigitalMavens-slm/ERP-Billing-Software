import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const navigate = useNavigate();
  console.log(purchases)

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    const res = await axios.get(`${API_URL}/api/purchases`, { withCredentials: true });
    setPurchases(res.data.purchases);
  };

  const deletePurchase = async (id) => {
    if (!confirm("Are you sure you want to delete this purchase?")) return;
    await axios.delete(`${API_URL}/api/purchases/${id}`, {withCredentials: true});
    fetchPurchases();
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
      <h2 className="text-2xl font-bold mb-5">Purchase List</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Purchase #</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Date</th>
              {/* <th className="p-4">Due Date</th> */}
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((pur, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-semibold">{pur.billNum}</td>
                <td className="p-4">{pur.supplierName}</td>
                <td className="p-4">{pur.date}</td>
                {/* <td className="p-4">{pur.dueDate || "-"}</td> */}
                <td className="p-4 font-medium">
                  ₹ {pur.subtotal?.toLocaleString()}
                </td>

                <td className="p-4">
                  <span className={statusBadge(pur.paymentStatus)}>{pur.paymentStatus}</span>
                </td>

                <td className="p-4 flex justify-center gap-4">
                  {/* EDIT BUTTON */}
                  
                  <button onClick={() => navigate(`/purchase/${pur._id}`, { state: { purchaseId: pur._id } })}>
  <Edit size={20} />
</button>

                  {/* DELETE BUTTON */}
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deletePurchase(pur._id)}
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

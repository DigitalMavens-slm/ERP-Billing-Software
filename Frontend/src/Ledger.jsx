
import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "./api";

// const API_URL = import.meta.env.VITE_API_URL;

export default function CustomerLedger() {
  const [ledger, setLedger] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showList, setShowList] = useState(false);
  console.log(query)

  useEffect(() => {
    if (!customerId) return;
    api
      .get(`/api/ledger/${customerId}`)
      .then((res) => setLedger(res.data.ledger || []))
      .catch((err) => console.error("Ledger fetch error:", err));
  }, [customerId]);

  const handleChange = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowList(false);
      return;
    }

    try {
      const res = await api.get(`/api/suggest/customers?query=${value}`)
      setSuggestions(res.data);
      setShowList(true);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSelect = async (customer) => {
    const res = await api.get(`/api/customers/${customer._id}`);
    setShowList(false);
    setCustomerId(res.data._id);
    setQuery(res.data.name);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">

      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        📒 Customer Ledger
      </h2>

      {/* Search Box */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Enter customer name..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Suggestions Dropdown */}
        {showList && suggestions.length > 0 && (
          <ul className="absolute z-20 w-full bg-white shadow-lg border rounded-lg max-h-60 overflow-y-auto mt-1">
            {suggestions.map((cust) => (
              <li
                key={cust._id}
                onClick={() => handleSelect(cust)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
              >
                {cust.name}
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
              <th className="p-3">Invoice No</th>
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
                  No ledger records found
                </td>
              </tr>
            ) : (
              ledger.map((row, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{row.particulars}</td>
                  <td className="p-3">{row.invoiceNo}</td>
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

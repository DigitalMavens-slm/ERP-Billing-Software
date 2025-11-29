import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function AllCustomerLedger() {
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/ledger`) // ✅ All customers
      .then((res) => {
        setLedger(res.data.ledgers || []);
      })
      .catch((err) => console.error("Error loading ledger:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📘 All Customer Ledgers</h2>

      {ledger.length === 0 ? (
        <p>No ledger data available.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
            background: "white",
          }}
        >
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th style={th}>Customer Name</th>
              <th style={th}>Date</th>
              <th style={th}>Particulars</th>
              <th style={th}>Invoice No</th>
              <th style={th}>Debit (₹)</th>
              <th style={th}>Credit (₹)</th>
              <th style={th}>Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((row, i) => (
              <tr key={i}>
                <td style={td}>{row.customerId?.name || "Unknown"}</td>
                <td style={td}>{new Date(row.date).toLocaleDateString()}</td>
                <td style={td}>{row.particulars}</td>
                <td style={td}>{row.invoiceNo || "-"}</td>
                <td style={td}>{row.debit || "-"}</td>
                <td style={td}>{row.credit || "-"}</td>
                <td style={td}>{row.balance || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  fontWeight: "bold",
};

const td = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

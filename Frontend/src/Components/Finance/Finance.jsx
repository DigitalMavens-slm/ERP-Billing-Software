// Finance.js
import React, { useEffect, useState } from "react";
import Axios from "axios";
// import "./Finance.css"; // optional for styling

const Finance = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    type: "Invoice",
    description: "",
    amount: 0,
    relatedCustomer: "",
    relatedSupplier: ""
  });

  const fetchRecords = async () => {
    const res = await Axios.get("http://localhost:4000/api/finance");
    setRecords(res.data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const addRecord = async () => {
    await Axios.post("http://localhost:4000/api/finance", newRecord);
    setNewRecord({
      type: "Invoice",
      description: "",
      amount: 0,
      relatedCustomer: "",
      relatedSupplier: ""
    });
    fetchRecords();
  };

  const deleteRecord = async (id) => {
    await Axios.delete(`http://localhost:4000/api/finance/${id}`);
    fetchRecords();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Finance / Accounting</h1>

      <div>
        <select name="type" value={newRecord.type} onChange={handleChange}>
          <option value="Invoice">Invoice</option>
          <option value="Payment">Payment</option>
          <option value="Expense">Expense</option>
        </select>
        <input
          name="description"
          placeholder="Description"
          value={newRecord.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newRecord.amount}
          onChange={handleChange}
        />
        <input
          name="relatedCustomer"
          placeholder="Customer ID (optional)"
          value={newRecord.relatedCustomer}
          onChange={handleChange}
        />
        <input
          name="relatedSupplier"
          placeholder="Supplier ID (optional)"
          value={newRecord.relatedSupplier}
          onChange={handleChange}
        />
        <button onClick={addRecord}>Add Record</button>
      </div>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Customer</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.type}</td>
              <td>{record.description}</td>
              <td>{record.amount}</td>
              <td>{record.relatedCustomer ? record.relatedCustomer.name : "-"}</td>
              <td>{record.relatedSupplier ? record.relatedSupplier.name : "-"}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => deleteRecord(record._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Finance;

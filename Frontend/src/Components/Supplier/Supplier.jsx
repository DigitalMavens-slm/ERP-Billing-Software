// Supplier.js
import React, { useEffect, useState } from "react";
import Axios from "axios";

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchSuppliers = async () => {
    const res = await Axios.get("http://localhost:4000/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const addSupplier = async () => {
    await Axios.post("http://localhost:4000/suppliers", newSupplier);
    setNewSupplier({ name: "", email: "", phone: "", address: "" });
    fetchSuppliers();
  };

  const deleteSupplier = async (id) => {
    await Axios.delete(`http://localhost:4000/suppliers/${id}`);
    fetchSuppliers();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Suppliers</h1>

      {/* Add Supplier Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Supplier</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name"
            value={newSupplier.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="email"
            placeholder="Email"
            value={newSupplier.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={newSupplier.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="address"
            placeholder="Address"
            value={newSupplier.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          onClick={addSupplier}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr
                key={supplier._id}
                className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="p-3">{supplier.name}</td>
                <td className="p-3">{supplier.email}</td>
                <td className="p-3">{supplier.phone}</td>
                <td className="p-3">{supplier.address}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteSupplier(supplier._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {suppliers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Supplier;

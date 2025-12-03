import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function AssignStaff() {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  // Fetch staff under admin's company
  const fetchStaff = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/users?role=staff`,
      { withCredentials: true }
    );
    setStaffList(res.data);
  } catch (err) {
    console.error(err);
    alert("Failed to load staff");
  }
};


  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/create-staff`,
        formData,
        { withCredentials: true }
      );

      alert("Staff added successfully!");

      // Clear fields
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
      });

      // refresh staff list
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("Error adding staff");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Staff</h2>

  {/* FORM CARD */}
  <form
    onSubmit={handleSubmit}
    className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-gray-200"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <input
        type="text"
        placeholder="Staff Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        placeholder="Mobile"
        value={formData.mobile}
        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
        required
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
    >
      Add Staff
    </button>
  </form>

  {/* STAFF LIST */}
  <h3 className="text-xl font-semibold mt-10 mb-4 text-gray-700">
    Current Staff
  </h3>

  <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
    {staffList.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No staff found.</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {staffList.map((s) => (
          <li
            key={s._id}
            className="py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-800">{s.name}</p>
              <p className="text-sm text-gray-500">{s.email}</p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

  );
}

export default AssignStaff;

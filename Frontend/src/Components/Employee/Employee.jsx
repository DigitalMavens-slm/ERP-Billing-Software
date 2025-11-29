// Employee.js
import React, { useEffect, useState } from "react";
import Axios from "axios";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    salary: 0
  });

  const fetchEmployees = async () => {
    const res = await Axios.get("http://localhost:4000/api/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const addEmployee = async () => {
    await Axios.post("http://localhost:4000/api/employees", newEmployee);
    setNewEmployee({ name: "", email: "", phone: "", role: "", department: "", salary: 0 });
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await Axios.delete(`http://localhost:4000/api/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employees / HR</h1>

      <div>
        <input name="name" placeholder="Name" value={newEmployee.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={newEmployee.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={newEmployee.phone} onChange={handleChange} />
        <input name="role" placeholder="Role" value={newEmployee.role} onChange={handleChange} />
        <input name="department" placeholder="Department" value={newEmployee.department} onChange={handleChange} />
        <input type="number" name="salary" placeholder="Salary" value={newEmployee.salary} onChange={handleChange} />
        <button onClick={addEmployee}>Add Employee</button>
      </div>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.role}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>
                <button onClick={() => deleteEmployee(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employee;

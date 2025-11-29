// UserManagement.js
import React, { useEffect, useState } from "react";
import Axios from "axios";
// import "./UserManagement.css";

const Usermanagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "Employee"
  });

  const fetchUsers = async () => {
    const res = await Axios.get("http://localhost:4000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  
  const addUser = async () => {
    await Axios.post("http://localhost:4000/users", newUser);
    setNewUser({ username: "", email: "", password: "", role: "Employee" });
    fetchUsers();
  };


  const deleteUser = async (id) => {
    await Axios.delete(`http://localhost:4000/users/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Management / Admin</h1>

      <div>
        <input name="username" placeholder="Username" value={newUser.username} onChange={handleChange} />
        <input name="email" placeholder="Email" value={newUser.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleChange} />
        <select name="role" value={newUser.role} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
        <button onClick={addUser}>Add User</button>
      </div>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usermanagement;

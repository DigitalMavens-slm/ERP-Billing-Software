import React, { useState } from "react";
import Axios from "axios";
import './LoginSignup.css'

const LoginSignup = () => {
  const [state, setState] = useState("Login");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    companyCode: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Register User
  const Register = async () => {
    try {
      await Axios.post("http://localhost:4000/api/signup", user, {
        withCredentials: true,
      });
      alert("Account created!");
      setState("Login");
    } catch (err) {
      console.error("Registration Error:", err);
      alert("Registration failed");
    }
  };

  // Login User
  const signin = async () => {
    try {
      const res=  await Axios.post(
        "http://localhost:4000/api/login",
        user,
        { withCredentials: true }
      );
//  localStorage.setItem("token", res.data.token);
      window.location.replace("/index");
    } catch (err) {
      console.log(err);
      alert("Login failed! Check email or password.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">
      <div className="bg-white/90 shadow-2xl rounded-2xl p-8 w-full max-w-md">

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          {state}
        </h1>

        <div className="flex flex-col gap-4">

          {/* NAME FIELD (Only in Sign-Up) */}
          {state === "Sign-Up" && (
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
              className="input-box"
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="input-box"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="input-box"
          />

          {/* ROLE (Only in Sign-Up) */}
          {state === "Sign-Up" && (
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="input-box"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          )}

          {/* COMPANY CODE (Only in Sign-Up) */}
          {state === "Sign-Up" && (
            <input
              type="text"
              name="companyCode"
              placeholder="Company Code (Optional)"
              value={user.companyCode}
              onChange={handleChange}
              className="input-box"
            />
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={() => (state === "Login" ? signin() : Register())}
          className="btn-primary"
        >
          Continue
        </button>

        {/* SWITCH STATE */}
        <p className="text-center text-gray-600 mt-4">
          {state === "Sign-Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Create an account?{" "}
              <span
                onClick={() => setState("Sign-Up")}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Click here
              </span>
            </>
          )}
        </p>

      </div>
    </div>
  );
};

export default LoginSignup;

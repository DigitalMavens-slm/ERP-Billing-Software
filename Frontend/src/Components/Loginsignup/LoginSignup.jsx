import React, { useState } from "react";
import './LoginSignup.css'
import {useNavigate} from "react-router-dom"
import api from "../../api"
const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const navigate = useNavigate()

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

  console.log(api)

  const Register = async () => {
    if (!user.name || !user.email || !user.password || !user.role) {
     alert("All required fields must be filled!");
     return;
   }
    try {
      await api.post(`/api/signup`, user,);
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
      const res=  await api.post(`/api/login`,user,);
//  localStorage.setItem("token", res.data.token);
      //  navigate()
      window.location.replace("/dashboard");
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


        <button
          onClick={() => (state === "Login" ? signin() : Register())}
          className="btn-primary"
        >
          Continue
        </button>


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

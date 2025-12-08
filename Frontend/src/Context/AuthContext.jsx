import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// const API_URL=import.meta.env.VITE_API_URL
import api from "../api"
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET LOGGED-IN USER DETAILS ONCE
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/me`, {
          withCredentials: true,
        });
        
        setUser(res.data.user);
        setCompany(res.data.company || null);

        return {user, company}
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (userData) => {
    const res = await api.post(
      `/api/login`,
      userData,
    );
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await api.post(`/api/logout`);
    setUser(null);
    setCompany(null);
  };

  return (
    <AuthContext.Provider value={{ user, company, setCompany, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

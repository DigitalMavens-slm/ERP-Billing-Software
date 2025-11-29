import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET LOGGED-IN USER DETAILS ONCE
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/me", {
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
    const res = await axios.post(
      "http://localhost:4000/api/login",
      userData,
      { withCredentials: true }
    );
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await axios.post("http://localhost:4000/api/logout", {}, { withCredentials: true });
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

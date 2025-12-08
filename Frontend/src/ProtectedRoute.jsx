import { useEffect, useState } from "react";
// import axios from "axios";
import { Navigate } from "react-router-dom";
import api from "./api";
// const API_URL=import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    api
      .get(`/api/check-auth`)
      .then((res) => {
        if (res.data.loggedIn) {
          setLoggedIn(true);
        }
      })
      .catch(() => setLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

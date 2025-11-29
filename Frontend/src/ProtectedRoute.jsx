import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/check-auth", { withCredentials: true })
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

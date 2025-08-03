import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCustomerProfile } from "../API/CustomerController";

const RequireAdmin = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getCustomerProfile();
      if (profile?.role === "admin") {
        setIsAdmin(true);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div>טוען...</div>;

  return isAdmin ? children : <Navigate to="/Picthur" />;
};

export default RequireAdmin;

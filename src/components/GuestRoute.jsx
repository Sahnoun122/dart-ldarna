import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user } = useAuth();

  // Si l'utilisateur est connecté, le rediriger vers son dashboard
  if (user) {
    return <Navigate to="/dashboard-darna" replace />;
  }

  return children;
}
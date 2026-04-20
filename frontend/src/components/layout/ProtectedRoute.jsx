import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../../services/authUtils";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

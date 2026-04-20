import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../../services/authUtils";


export default function PublicRoute() {
  const token = localStorage.getItem("token");

  if (isTokenValid(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

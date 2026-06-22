import { Navigate } from "react-router-dom";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export function AdminRoute({ children }) {
  const user = getUser();
  if (!user.id) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export function DriverRoute({ children }) {
  const user = getUser();
  if (!user.id) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
}

export function AuthRoute({ children }) {
  const user = getUser();
  if (user.id && user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.id) return <Navigate to="/dashboard" replace />;
  return children;
}

import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

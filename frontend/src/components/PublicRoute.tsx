import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { ReactElement } from "react";

export default function PublicRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

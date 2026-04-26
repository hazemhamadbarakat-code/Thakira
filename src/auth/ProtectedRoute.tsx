/**
 * PRESENTATION LAYER — Route Guard
 * Restricts navigation by authentication state and role.
 */
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { Role } from "./userDatabase";

interface Props {
  children: ReactNode;
  allow: Role[];
}

export const ProtectedRoute = ({ children, allow }: Props) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!role || !allow.includes(role)) {
    // Authenticated but wrong role → bounce to their own landing.
    return <Navigate to={role === "admin" ? "/admin" : "/discover"} replace />;
  }
  return <>{children}</>;
};

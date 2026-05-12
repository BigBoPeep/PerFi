import type React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

export default function RouteUser({
  redirectPath = "/",
}: {
  redirectPath?: string;
}): React.ReactNode {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Checking auth...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
}

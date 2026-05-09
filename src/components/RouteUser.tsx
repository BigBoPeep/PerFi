import React from "react";
import { Navigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

interface RouteUserProps {
  children: React.JSX.Element;
}

export default function RouteUser({
  children,
}: RouteUserProps): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Checking auth...</div>;

  return isAuthenticated ? children : <Navigate to={"/"} replace />;
}

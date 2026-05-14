import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import type React from "react";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import RouteUser from "./components/RouteUser";
import { Auth0Provider } from "@auth0/auth0-react";
import { SettingsProvider } from "./context/SettingsContext";
import { LocalSettingsProvider } from "./context/LocalSettingsContext";
import MainLayout from "./components/layouts/MainLayout";
import Dashboard from "./components/Dashboard";
import { ConfirmModalProvider } from "./context/ConfirmModalContext";

const Auth0ProviderWithNavigate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo ?? "/dashboard");
      }}
    >
      {children}
    </Auth0Provider>
  );
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <SettingsProvider>
        <LocalSettingsProvider>
          <ConfirmModalProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route element={<RouteUser />}>
                  <Route path="dashboard" element={<Dashboard />} />
                </Route>
              </Route>
            </Routes>
          </ConfirmModalProvider>
        </LocalSettingsProvider>
      </SettingsProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>,
);

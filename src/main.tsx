import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import RouteUser from "./components/RouteUser";
import { Auth0Provider } from "@auth0/auth0-react";
import { SettingsProvider } from "./context/SettingsContext";
import MainLayout from "./components/layouts/MainLayout";
import Dashboard from "./components/Dashboard";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: audience,
    }}
  >
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route element={<RouteUser />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  </Auth0Provider>,
);

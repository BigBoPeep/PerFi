import { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchUserSettings, updateUserSettings } from "../services/api";
import type { ReactNode } from "react";

interface UserSettings {
  _id: string;
  userID: string;
  dateFormat: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface SettingsContextType {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserSettings(getAccessTokenSilently);
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [isAuthenticated]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const data = await updateUserSettings(getAccessTokenSilently, updates);
      setSettings(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <SettingsContext.Provider
      value={{ settings, isLoading, error, updateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

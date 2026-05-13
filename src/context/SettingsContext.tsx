import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchUserSettings, updateUserSettings } from "../services/api";
import type {
  UserSettings,
  SettingsContext as ContextType,
  SettingsProviderProps,
  UserSettingsPatch,
} from "../../shared/types/settings";

const SettingsContext = createContext<ContextType | null>(null);

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
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

  const updateSettings = useCallback(
    async (updates: UserSettingsPatch) => {
      try {
        setError(null);
        const data = await updateUserSettings(getAccessTokenSilently, updates);
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [getAccessTokenSilently],
  );

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

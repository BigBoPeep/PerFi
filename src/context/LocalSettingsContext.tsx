import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type React from "react";
import type {
  LocalSettings,
  LocalSettingsContext as ContextType,
} from "../../shared/types/settings";
import {
  LOCAL_SETTINGS_DEFAULTS as DEFAULTS,
  LOCAL_SETTINGS_KEY as KEY,
} from "../app.config";

const loadFromStorage = (): LocalSettings => {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

const LocalSettingsContext = createContext<ContextType | null>(null);

export const LocalSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [localSettings, setLocalSettings] =
    useState<LocalSettings>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(localSettings));
  }, [localSettings]);

  const updateLocalSettings = useCallback((updates: Partial<LocalSettings>) => {
    setLocalSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetLocalSettings = useCallback(() => {
    setLocalSettings(DEFAULTS);
    localStorage.removeItem(KEY);
  }, []);

  return (
    <LocalSettingsContext.Provider
      value={{ localSettings, updateLocalSettings, resetLocalSettings }}
    >
      {children}
    </LocalSettingsContext.Provider>
  );
};

export const useLocalSettings = () => {
  const context = useContext(LocalSettingsContext);
  if (!context)
    throw new Error(
      "useLocalSettings must be used within a LocalSettingsProvider",
    );
  return context;
};

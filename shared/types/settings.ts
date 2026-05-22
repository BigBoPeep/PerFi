export interface UserSettings {
  _id: string;
  userID: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettingsPatch {
  dateFormat?: string;
  currency?: string;
  timeFormat?: string;
}

export const USER_SETTINGS_PATCH_KEYS: (keyof UserSettingsPatch)[] = [
  "dateFormat",
  "currency",
  "timeFormat",
];

export interface SettingsContext {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (
    id: string,
    updates: UserSettingsPatch,
  ) => Promise<UserSettings>;
}

export interface SettingsProviderProps {
  children: React.ReactNode;
}

export interface LocalSettings {
  sortField: "date" | "amount" | "description" | "location";
  sortOrder: "asc" | "desc" | "rand";
}

export interface LocalSettingsContext {
  localSettings: LocalSettings;
  updateLocalSettings: (updates: Partial<LocalSettings>) => void;
  resetLocalSettings: () => void;
}

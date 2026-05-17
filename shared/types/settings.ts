export interface UserSettings {
  _id: string;
  userID: string;
  dateFormat: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettingsPatch {
  dateFormat?: string;
  currency?: string;
}

export const USER_SETTINGS_PATCH_KEYS: (keyof UserSettingsPatch)[] = [
  "dateFormat",
  "currency",
];

export interface SettingsContext {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (
    id: string,
    updates: Partial<UserSettings>,
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

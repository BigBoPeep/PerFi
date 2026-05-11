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
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

export interface SettingsProviderProps {
  children: React.ReactNode;
}

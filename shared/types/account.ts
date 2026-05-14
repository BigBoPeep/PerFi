export interface Account {
  _id: string;
  userID: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewAccount {
  name: string;
  type: string;
}

export interface AccountPatch {
  name?: string;
  type?: string;
}

export const ACCOUNT_PATCH_KEYS: (keyof AccountPatch)[] = ["name", "type"];

export interface AccountsProps {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
}

export interface UseAccounts {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  selectedAccountID: string | null;
  addAccount: (data: NewAccount) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  editAccount: (id: string, updates: AccountPatch) => Promise<void>;
  selectAccount: (id: string | null) => void;
}

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

export interface AccountsContext {
  accounts: Account[];
  selectedAccountID: string | undefined;
  selectedAccount: Account | undefined;
  isLoading: boolean;
  error: string | null;
  selectAccount: (id: string | undefined) => void;
  addAccount: (data: NewAccount) => Promise<Account>;
  editAccount: (id: string, updates: AccountPatch) => Promise<Account>;
  removeAccount: (id: string) => Promise<void>;
}

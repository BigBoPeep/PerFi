export interface Transaction {
  _id: string;
  userID: string;
  accountID: string;
  amount: number;
  description?: string;
  date: string;
  location?: string;
}

export interface NewTransaction {
  accountID: string;
  amount: number;
  description?: string;
  date?: string;
  location?: string;
}

export interface TransactionPatch {
  amount?: number;
  description?: string;
  date?: string;
  location?: string;
}

export const TRANSACTION_PATCH_KEYS: (keyof TransactionPatch)[] = [
  "amount",
  "date",
  "description",
  "location",
];

export interface UseTransactions {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  balance: number;
  addTransaction: (data: NewTransaction) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (
    id: string,
    updates: TransactionPatch,
  ) => Promise<Transaction>;
}

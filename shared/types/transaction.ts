export interface Transaction {
  _id: string;
  userID: string;
  accountID: string;
  amount: number;
  description: string;
  date: string;
  location?: string;
}

export interface NewTransaction {
  accountID: string;
  amount: number;
  description: string;
  date?: string;
}

export interface TransactionPatch {
  amount?: number;
  description?: string;
  date?: string;
}

export const TRANSACTION_PATCH_KEYS: (keyof TransactionPatch)[] = [
  "amount",
  "date",
  "description",
];

export interface TransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface TransactionControlsProps {
  addTransaction: (data: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export interface UseTransactions {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  balance: number;
  addTransaction: (data: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, updates: TransactionPatch) => Promise<void>;
}

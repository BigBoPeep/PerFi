import { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction as deleteTransactionApi,
  updateTransaction as updateTransactionApi,
  deleteTransactions as deleteTransactionsApi,
} from "../services/api";
import { useLocalSettings } from "../context/LocalSettingsContext";
import type {
  Transaction,
  NewTransaction,
  TransactionPatch,
} from "../../shared/types/transaction";
import { useAccounts } from "../context/AccountsContext";

export interface UseTransactions {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  balance: number;
  addTransaction: (data: NewTransaction) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteTransactions: (ids: Array<string>) => Promise<void>;
  updateTransaction: (
    id: string,
    updates: TransactionPatch,
  ) => Promise<Transaction>;
}

export const useTransactions = (): UseTransactions => {
  const { getAccessTokenSilently } = useAuth0();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const { localSettings } = useLocalSettings();
  const { selectedAccountID } = useAccounts();

  useEffect(() => {
    if (!selectedAccountID) {
      setIsLoading(false);
      setError(null);
      setTransactions([]);
      return;
    }
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTransactions(
          getAccessTokenSilently,
          selectedAccountID,
        );
        setTransactions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [selectedAccountID, trigger]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const dir =
        localSettings.sortOrder === "asc"
          ? 1
          : localSettings.sortOrder === "desc"
            ? -1
            : Math.random() >= 0.5
              ? 1
              : -1;

      switch (localSettings.sortField) {
        case "amount":
          return (a.amount - b.amount) * dir;
        case "location":
          if (!a.location || !b.location)
            if (!a.location && b.location) return -1;
            else if (a.location && !b.location) return 1;
            else return 0;
          else return a.location.localeCompare(b.location) * dir;
        case "description":
          if (!a.description || !b.description)
            if (!a.description && b.description) return -1;
            else if (a.description && !b.description) return 1;
            else return 0;
          else return a.description.localeCompare(b.description) * dir;
        case "date":
        default:
          return (
            (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
          );
      }
    });
  }, [transactions, localSettings.sortField, localSettings.sortOrder]);

  const balance = useMemo(() => {
    if (isLoading) return 0.0;
    else return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, isLoading]);

  const refetch = () => setTrigger((t) => t + 1);

  const addTransaction = async (data: NewTransaction): Promise<Transaction> => {
    try {
      const added = await createTransaction(getAccessTokenSilently, data);
      refetch();
      return added;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionApi(getAccessTokenSilently, id);
      refetch();
    } catch (err: any) {
      throw err;
    }
  };

  const deleteTransactions = async (ids: Array<string>) => {
    try {
      await deleteTransactionsApi(getAccessTokenSilently, ids);
      refetch();
    } catch (err: any) {
      throw err;
    }
  };

  const updateTransaction = async (
    id: string,
    updates: TransactionPatch,
  ): Promise<Transaction> => {
    try {
      const updated = await updateTransactionApi(
        getAccessTokenSilently,
        id,
        updates,
      );
      refetch();
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    transactions: sortedTransactions,
    balance,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    deleteTransactions,
    updateTransaction,
  };
};

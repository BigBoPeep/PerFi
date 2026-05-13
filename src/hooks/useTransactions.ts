import { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction as deleteTransactionApi,
  updateTransaction as updateTransactionApi,
} from "../services/api";
import { useLocalSettings } from "../context/LocalSettingsContext";
import type {
  Transaction,
  UseTransactions,
  NewTransaction,
  TransactionPatch,
} from "../../shared/types/transaction";

export const useTransactions = (accountID?: string): UseTransactions => {
  const { getAccessTokenSilently } = useAuth0();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const { localSettings } = useLocalSettings();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTransactions(getAccessTokenSilently, accountID);
        setTransactions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [accountID, trigger]);

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
        case "description":
        case "location":
          return a.description.localeCompare(b.description) * dir;
        case "date":
        default:
          return (
            (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
          );
      }
    });
  }, [transactions, localSettings.sortField, localSettings.sortOrder]);

  const balance = useMemo(
    () => transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const refetch = () => setTrigger((t) => t + 1);

  const addTransaction = async (data: NewTransaction) => {
    try {
      await createTransaction(getAccessTokenSilently, data);
      refetch();
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

  const updateTransaction = async (id: string, updates: TransactionPatch) => {
    try {
      await updateTransactionApi(getAccessTokenSilently, id, updates);
      refetch();
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
    updateTransaction,
  };
};

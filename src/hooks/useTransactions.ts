import { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction as deleteTransactionApi,
} from "../services/api";
import type {
  Transaction,
  UseTransactions,
  NewTransaction,
} from "../types/transaction";

export const useTransactions = (accountID?: string): UseTransactions => {
  const { getAccessTokenSilently } = useAuth0();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

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

  return {
    transactions,
    balance,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
  };
};

import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../services/api";
import type {
  Account,
  NewAccount,
  AccountPatch,
  UseAccounts,
} from "../../shared/types/account";

export const useAccounts = (): UseAccounts => {
  const { getAccessTokenSilently } = useAuth0();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountID, setSelectedAccountID] = useState<string | null>(
    null,
  );

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAccounts(getAccessTokenSilently);
      setAccounts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    load();
  }, [load]);

  const addAccount = async (data: NewAccount) => {
    await createAccount(getAccessTokenSilently, data);
    await load();
  };

  const editAccount = async (id: string, updates: AccountPatch) => {
    await updateAccount(getAccessTokenSilently, id, updates);
    await load();
  };

  const removeAccount = async (id: string) => {
    await deleteAccount(getAccessTokenSilently, id);
    if (selectedAccountID === id) setSelectedAccountID(null);
    await load();
  };

  const selectAccount = (id: string | null) => {
    if (!id) setSelectedAccountID(null);
    if (accounts.find((act) => act._id === id)) setSelectedAccountID(id);
    else setSelectedAccountID(null);
  };

  return {
    accounts,
    isLoading,
    error,
    selectedAccountID,
    addAccount,
    editAccount,
    removeAccount,
    selectAccount,
  };
};

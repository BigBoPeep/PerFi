import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
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
  AccountsContext as AccountsContextType,
} from "../../shared/types/account";

const AccountsContext = createContext<AccountsContextType | null>(null);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountID, setSelectedAccountID] = useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    load();
  }, [isAuthenticated, load]);

  const addAccount = async (data: NewAccount): Promise<Account> => {
    const account = await createAccount(getAccessTokenSilently, data);
    await load();
    setSelectedAccountID(account._id);
    return account;
  };

  const editAccount = async (id: string, updates: AccountPatch) => {
    const updated = await updateAccount(getAccessTokenSilently, id, updates);
    await load();
    return updated;
  };

  const removeAccount = async (id: string) => {
    await deleteAccount(getAccessTokenSilently, id);
    if (selectedAccountID === id) setSelectedAccountID(undefined);
    await load();
  };

  const selectedAccount = accounts.find((a) => a._id === selectedAccountID);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        selectedAccountID,
        selectedAccount,
        isLoading,
        error,
        selectAccount: setSelectedAccountID,
        addAccount,
        editAccount,
        removeAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (!context)
    throw new Error("useAccounts must be used within an AccountsProvider");
  return context;
};

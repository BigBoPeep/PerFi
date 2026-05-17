import type { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import type {
  Transaction,
  NewTransaction,
  TransactionPatch,
} from "../../shared/types/transaction";
import type {
  UserSettings,
  UserSettingsPatch,
} from "../../shared/types/settings";
import type {
  Account,
  NewAccount,
  AccountPatch,
} from "../../shared/types/account";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

type GetToken = (options?: GetTokenSilentlyOptions) => Promise<string>;

const buildHeaders = async (getToken: GetToken): Promise<HeadersInit> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getToken({
    authorizationParams: {
      audience: AUTH0_AUDIENCE,
    },
  })}`,
});

export const fetchTransactions = async (
  getToken: GetToken,
  accountID?: string,
) => {
  const params = new URLSearchParams();
  if (accountID) params.append("accountID", accountID);

  const res = await fetch(`${BASE_URL}/transactions?${params}`, {
    headers: await buildHeaders(getToken),
  });
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};

export const createTransaction = async (
  getToken: GetToken,
  data: NewTransaction,
): Promise<Transaction> => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  return res.json() as Promise<Transaction>;
};

export const deleteTransaction = async (getToken: GetToken, id: string) => {
  const res = await fetch(`${BASE_URL}/transactions?id=${id}`, {
    method: "DELETE",
    headers: await buildHeaders(getToken),
  });
  if (!res.ok) throw new Error("Failed to delete transaction");
  return res.json();
};

export const updateTransaction = async (
  getToken: GetToken,
  id: string,
  updates: TransactionPatch,
): Promise<Transaction> => {
  const res = await fetch(`${BASE_URL}/transactions?id=${id}`, {
    method: "PATCH",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update transaction");
  return res.json() as Promise<Transaction>;
};

export const fetchUserSettings = async (
  getToken: GetToken,
): Promise<UserSettings> => {
  const res = await fetch(`${BASE_URL}/userSettings`, {
    headers: await buildHeaders(getToken),
  });
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json() as Promise<UserSettings>;
};

export const updateUserSettings = async (
  getToken: GetToken,
  id: string,
  updates: UserSettingsPatch,
): Promise<UserSettings> => {
  const res = await fetch(`${BASE_URL}/userSettings?id=${id}`, {
    method: "PATCH",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json() as Promise<UserSettings>;
};

export const fetchAccounts = async (getToken: GetToken) => {
  const res = await fetch(`${BASE_URL}/accounts`, {
    headers: await buildHeaders(getToken),
  });
  if (!res.ok) throw new Error("Failed to fetch accounts");
  return res.json() as Promise<Account[]>;
};

export const createAccount = async (getToken: GetToken, data: NewAccount) => {
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "POST",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create account");
  return res.json() as Promise<Account>;
};

export const updateAccount = async (
  getToken: GetToken,
  id: string,
  updates: AccountPatch,
) => {
  const res = await fetch(`${BASE_URL}/accounts?id=${id}`, {
    method: "PATCH",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update account");
  return res.json() as Promise<Account>;
};

export const deleteAccount = async (getToken: GetToken, id: string) => {
  const res = await fetch(`${BASE_URL}/accounts?id=${id}`, {
    method: "DELETE",
    headers: await buildHeaders(getToken),
  });
  if (!res.ok) throw new Error("Failed to delete account");
  return res.json();
};

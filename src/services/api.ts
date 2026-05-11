import type { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import type {
  NewTransaction,
  TransactionPatch,
} from "../../shared/types/transaction";
import type { UserSettingsPatch } from "../../shared/types/settings";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type GetToken = (options?: GetTokenSilentlyOptions) => Promise<string>;

const buildHeaders = async (getToken: GetToken): Promise<HeadersInit> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getToken()}`,
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
) => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  return res.json();
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
) => {
  const res = await fetch(`${BASE_URL}/transactions?id=${id}`, {
    method: "PATCH",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update transaction");
  return res.json();
};

export const fetchUserSettings = async (getToken: GetToken) => {
  const res = await fetch(`${BASE_URL}/userSettings`, {
    headers: await buildHeaders(getToken),
  });
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
};

export const updateUserSettings = async (
  getToken: GetToken,
  updates: UserSettingsPatch,
) => {
  const res = await fetch(`${BASE_URL}/userSettings`, {
    method: "PATCH",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
};

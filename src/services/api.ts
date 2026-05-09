import type { GetTokenSilentlyOptions } from "@auth0/auth0-react";

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
  data: {
    accountID: string;
    amount: number;
    description: string;
    date?: string;
  },
) => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
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
  updates: { dateFormat?: string; currency?: string },
) => {
  const res = await fetch(`${BASE_URL}/userSettings`, {
    method: "PATCH",
    headers: await buildHeaders(getToken),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
};

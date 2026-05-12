import type { MenuOption } from "../shared/types/navigation";

export const DATE_FORMAT_OPTS = [
  { label: "01/31/2025", value: "MM/dd/yyyy" },
  { label: "31/01/2025", value: "dd/MM/yyyy" },
] as const;

export const CURRENCY_OPTS = [
  { label: "USD $", value: "USD", symbol: "$" },
  { label: "EUR €", value: "EUR", symbol: "€" },
  { label: "GBP £", value: "GBP", symbol: "£" },
] as const;

export type DateFormat = (typeof DATE_FORMAT_OPTS)[number]["value"];
export type Currency = (typeof CURRENCY_OPTS)[number]["value"];

export const USER_MENU_LIST_OPTS: MenuOption[] = [
  { kind: "internal", label: "Settings", to: "/settings" },
];

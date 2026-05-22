import type { MenuOption } from "../shared/types/navigation";
import type { DropdownOpt } from "./components/Dropdown";
import type { LocalSettings } from "../shared/types/settings";
import { Settings, PanelsTopLeft, House } from "lucide-react";

export const LOCAL_SETTINGS_KEY = "perfi:localsettings";
export const LOCAL_SETTINGS_DEFAULTS: LocalSettings = {
  sortField: "date",
  sortOrder: "desc",
};

export const DATE_FORMAT_OPTS = [
  { label: "01/31/2025", value: "MM/dd/yyyy" },
  { label: "31/01/2025", value: "dd/MM/yyyy" },
  { label: "2025/01/31", value: "yyyy/MM/dd" },
  { label: "2025/31/01", value: "yyyy/dd/MM" },
  { label: "Mo 01/31/2025", value: "eeeeee MM/dd/yyyy" },
  { label: "Mo 31/01/2025", value: "eeeeee dd/MM/yyyy" },
  { label: "Mo 2025/01/31", value: "eeeeee yyyy/MM/dd" },
  { label: "Mo 2025/31/01", value: "eeeeee yyyy/dd/MM" },
] as const;

export const TIME_FORMAT_OPTS = [
  { label: "23:15", value: "HH:mm" },
  { label: "11:15pm", value: "hh:mmaaa" },
  { label: "11:15 PM", value: "hh:mm aa" },
  { label: "11:15p", value: "hh:mmaaaaa" },
] as const;

export const CURRENCY_OPTS = [
  { label: "USD $", value: "USD", symbol: "$" },
  { label: "EUR €", value: "EUR", symbol: "€" },
  { label: "GBP £", value: "GBP", symbol: "£" },
] as const;

export type DateFormat = (typeof DATE_FORMAT_OPTS)[number]["value"];
export type Currency = (typeof CURRENCY_OPTS)[number]["value"];
export type TimeFormat = (typeof TIME_FORMAT_OPTS)[number]["value"];

export const TRANSACTION_SORT_FIELD_OPTS: DropdownOpt[] = [
  { label: "Date", value: "date" },
  { label: "Amount", value: "amount" },
  { label: "Location", value: "location" },
  { label: "Description", value: "description" },
] as const;

export const TRANSACTION_SORT_ORDER_OPTS: DropdownOpt[] = [
  { label: "Descending", value: "desc" },
  { label: "Ascending", value: "asc" },
  { label: "Random", value: "rand" },
];

export const USER_MENU_LIST_OPTS: MenuOption[] = [
  { kind: "internal", label: "Home", icon: House, to: "/" },
  {
    kind: "internal",
    label: "Dashboard",
    icon: PanelsTopLeft,
    to: "/dashboard",
  },
  { kind: "internal", label: "Settings", icon: Settings, to: "/settings" },
];

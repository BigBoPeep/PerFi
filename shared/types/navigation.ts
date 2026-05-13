import type { LucideIcon } from "lucide-react";

type InternalLink = {
  kind: "internal";
  label: string;
  icon?: LucideIcon;
  to: string;
};

type ExternalLink = {
  kind: "external";
  label: string;
  icon?: LucideIcon;
  href: string;
  openInNewTab?: boolean;
};

export type MenuOption = InternalLink | ExternalLink;

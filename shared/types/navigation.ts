type InternalLink = {
  kind: "internal";
  label: string;
  to: string;
};

type ExternalLink = {
  kind: "external";
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type MenuOption = InternalLink | ExternalLink;

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";
import UserAvatar from "./UserAvatar";
import { USER_MENU_LIST_OPTS } from "../../app.config";
import { type MenuOption } from "../../../shared/types/navigation";

const MenuLink = ({ opt }: { opt: MenuOption }) => {
  if (opt.kind === "internal") return <Link to={opt.to}>{opt.label}</Link>;

  return (
    <a
      href={opt.href}
      target={opt.openInNewTab !== false ? "_blank" : undefined}
      rel={opt.openInNewTab !== false ? "noreferrer" : undefined}
    >
      {opt.label}
    </a>
  );
};

export default function UserMenu(): React.ReactNode {
  const { user, isLoading, isAuthenticated, loginWithPopup, logout } =
    useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="relative flex items-center gap-2 p-2 bg-black/10"
      onClick={isAuthenticated ? () => setMenuOpen(!menuOpen) : undefined}
    >
      <UserAvatar
        user={isAuthenticated ? user : undefined}
        isLoading={isLoading}
      />

      {isLoading && <p>Checking...</p>}
      {!isLoading && isAuthenticated && <p>{user?.given_name || user?.name}</p>}
      {!isLoading && !isAuthenticated && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            loginWithPopup();
          }}
        >
          Log In
        </button>
      )}

      {isAuthenticated && (
        <div
          className={`absolute origin-top overflow-hidden
              ${menuOpen ? "scale-y-100" : "scale-y-0"}
            `}
        >
          <ul>
            {USER_MENU_LIST_OPTS.map((opt) => (
              <li key={opt.label}>
                <MenuLink opt={opt} />
              </li>
            ))}
          </ul>
          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

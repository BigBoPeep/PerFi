import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";
import UserAvatar from "./UserAvatar";
import { USER_MENU_LIST_OPTS } from "../../app.config";
import { type MenuOption } from "../../../shared/types/navigation";

const MenuLink = ({ opt }: { opt: MenuOption }) => {
  const Icon = opt.icon;

  if (opt.kind === "internal")
    return (
      <Link to={opt.to} className="flex gap-1 items-center ">
        {Icon && <Icon className="w-6 h-6" />}
        {opt.label}
      </Link>
    );

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
  const { user, isLoading, isAuthenticated, loginWithRedirect, logout } =
    useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      className={`relative flex items-center gap-2 p-2 bg-black/10
        min-w-45 max-w-md w-fit h-fit cursor-pointer transform-gpu
        ${menuOpen ? "rounded-t-md z-50" : "rounded-md"}`}
      onClick={isAuthenticated ? () => setMenuOpen(!menuOpen) : undefined}
      ref={menuRef}
    >
      <UserAvatar
        user={isAuthenticated ? user : undefined}
        isLoading={isLoading}
        className="shrink-0"
      />

      <div className="grow text-center text-1 line-clamp-2">
        {isLoading && "Checking..."}
        {!isLoading &&
          isAuthenticated &&
          `Hello, ${user?.given_name || user?.name}!`}
        {!isLoading && !isAuthenticated && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              loginWithRedirect({
                appState: { returnTo: "/dashboard" },
              });
            }}
          >
            Log In
          </button>
        )}
      </div>

      {isAuthenticated && (
        <div
          className={`absolute origin-top-right overflow-hidden bg-[var(--color-sec)]
            left-0 top-full w-full flex flex-col gap-2 items-center py-2
            rounded-b-md cursor-default shadow-md
            ${menuOpen ? "scale-y-100" : "scale-y-0"}
            `}
        >
          <ul className="*:not-first:mt-2">
            {USER_MENU_LIST_OPTS.map((opt) => (
              <li
                key={opt.label}
                className="text-1 hover:bg-black/10 px-2 rounded-md"
              >
                <MenuLink opt={opt} />
              </li>
            ))}
          </ul>
          <button
            className="text-1"
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

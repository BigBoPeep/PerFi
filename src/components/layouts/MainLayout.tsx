import React from "react";
import { Outlet } from "react-router";
import UserMenu from "../User/UserMenu";

export default function MainLayout({}) {
  return (
    <div
      className="w-dvw h-dvh overflow-hidden bg-[var(--color-pri)]
      flex flex-col"
    >
      <div
        className="max-h-[100px] min-h-fit h-[15dvh] flex items-center justify-between
          p-2 bg-[var(--color-sec)]"
      >
        <div>PerFi</div>

        <UserMenu />
      </div>

      <Outlet />
    </div>
  );
}

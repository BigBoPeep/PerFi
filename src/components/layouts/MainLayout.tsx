import React from "react";
import { Outlet } from "react-router";
import UserMenu from "../User/UserMenu";

export default function MainLayout({}) {
  return (
    <div className="w-dvw overflow-x-hidden">
      <div className="h-[min(20dvh,275px)] flex items-center justify-between">
        <div>PerFi</div>

        <UserMenu />
      </div>

      <Outlet />
    </div>
  );
}

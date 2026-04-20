import React from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";

export const DashboardLayout = () => {
  return (
    <ThemeProvider>
      <div
        className="flex h-screen overflow-hidden"
        style={{
          backgroundColor: "var(--app-bg)",
          color: "var(--text-heading)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
};
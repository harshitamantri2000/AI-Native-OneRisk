import React from "react";
import { Bell } from "lucide-react";

const f = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
} as const;

export const AlertsPage: React.FC = () => {
  return (
    <main
      className="flex-1 flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "var(--neutral-0)" }}
    >
      {/* Page header */}
      <div
        className="shrink-0 flex items-center"
        style={{
          height: 56,
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 32px",
        }}
      >
        <span
          style={{
            ...f,
            fontSize: "var(--text-md)",
            lineHeight: "140%",
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          Alerts
        </span>
      </div>

      {/* Empty state */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: 12 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: "var(--surface-inset)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Bell style={{ width: 22, height: 22, color: "var(--text-muted-themed)" }} />
        </div>
        <span
          style={{
            ...f,
            fontSize: "var(--text-md)",
            lineHeight: "140%",
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          No alerts yet
        </span>
        <span
          style={{
            ...f,
            fontSize: "var(--text-base)",
            lineHeight: "140%",
            fontWeight: 400,
            color: "var(--text-muted-themed)",
            textAlign: "center",
            maxWidth: 300,
          }}
        >
          Alerts for case updates, risk changes, and check completions will appear here.
        </span>
      </div>
    </main>
  );
};

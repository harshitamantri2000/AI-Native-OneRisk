import React from "react";
import { BulkUploadTab } from "./BulkUploadTab";

const f = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
} as const;

export const BulkUploadPage: React.FC = () => {
  return (
    <main
      className="flex-1 flex flex-col h-screen overflow-hidden relative"
      style={{ backgroundColor: "var(--neutral-50)" }}
    >
      {/* ── Sticky Top: Breadcrumb ── */}
      <div
        className="shrink-0"
        style={{
          backgroundColor: "var(--surface-card)",
          borderBottom: "1px solid var(--neutral-100)",
        }}
      >
        <div className="flex items-center px-6" style={{ height: 36 }}>
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-muted-themed)",
            }}
          >
            Search Terminal
          </span>
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 14 14"
            className="shrink-0"
          >
            <path
              d="M5.25 3.5L8.75 7L5.25 10.5"
              stroke="var(--sidebar-icon-color)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-heading)",
            }}
          >
            Bulk Upload
          </span>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* ─── Page Header ─── */}
        <div
          className="px-6 pt-5 pb-4"
          style={{ backgroundColor: "var(--surface-card)" }}
        >
          <div className="flex flex-col" style={{ gap: 4 }}>
            <span
              style={{
                ...f,
                fontSize: "var(--text-lg)",
                lineHeight: "140%",
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              Bulk Upload
            </span>
            <span
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
              }}
            >
              Upload CSV or Excel files to create multiple cases at once
            </span>
          </div>
        </div>

        {/* ─── Spacer ─── */}
        <div style={{ height: 8, backgroundColor: "var(--neutral-50)" }} />

        {/* ─── Upload Content ─── */}
        <div
          style={{
            backgroundColor: "var(--surface-card)",
            borderTop: "1px solid var(--border-subtle)",
            minHeight: "calc(100vh - 260px)",
          }}
        >
          <BulkUploadTab />
        </div>
      </div>
    </main>
  );
};

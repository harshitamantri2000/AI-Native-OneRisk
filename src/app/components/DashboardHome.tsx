import React from "react";
import { useNavigate } from "react-router";
import { CaseTable } from "./CaseTable";
import { Plus } from "lucide-react";

const f = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
} as const;

export const DashboardHome = () => {
  const navigate = useNavigate();

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
            Case Management
          </span>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* ─── Tier 1: Page Title ─── */}
        <div
          className="px-6 pt-5 pb-4"
          style={{ backgroundColor: "var(--surface-card)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-lg)",
                  lineHeight: "140%",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                Case Management
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
                All cases from Risk Bundles, Terminal checks, and Bulk Uploads in one place
              </span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 rounded-lg cursor-pointer transition-all active:scale-[0.97]"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--text-on-color)",
                ...f,
                fontSize: "var(--text-sm)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                border: "none",
                height: "36px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary-600)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)";
              }}
              onClick={() => navigate("/new-case")}
            >
              <Plus className="w-4 h-4" />
              New Case
            </button>
          </div>
        </div>

        {/* ─── Spacer ─── */}
        <div style={{ height: 8, backgroundColor: "var(--neutral-50)" }} />

        {/* ─── Tier 3: Table Listing ─── */}
        <div
          style={{
            backgroundColor: "var(--surface-card)",
            borderTop: "1px solid var(--border-subtle)",
            minHeight: "calc(100vh - 260px)",
          }}
        >
          <CaseTable />
        </div>
      </div>
    </main>
  );
};
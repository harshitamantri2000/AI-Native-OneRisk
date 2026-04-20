import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { RICH_CASES_BY_ID } from "../data/mock";
import { OverviewTabContent } from "./case-detail/OverviewTabContent";
import { FinancialsTabContent } from "./case-detail/FinancialsTabContent";
import { LitigationsTabContent } from "./case-detail/LitigationsTabContent";
import { CAMDraftTabContent } from "./case-detail/CAMDraftTabContent";
import { DocumentsTabContent } from "./case-detail/DocumentsTabContent";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

type Tab = "overview" | "financials" | "litigations" | "cam" | "documents";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview",    label: "Overview" },
  { id: "financials",  label: "Financials" },
  { id: "litigations", label: "Litigations" },
  { id: "cam",         label: "CAM Draft" },
  { id: "documents",   label: "Documents" },
];

const riskChipStyle = (level: string) => ({
  High:   { bg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)", text: "var(--destructive-700)", border: "color-mix(in srgb, var(--destructive-500) 20%, transparent)" },
  Medium: { bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)", text: "var(--warning-700)", border: "color-mix(in srgb, var(--warning-600) 20%, transparent)" },
  Low:    { bg: "color-mix(in srgb, var(--success-500) 10%, transparent)", text: "var(--success-700)", border: "color-mix(in srgb, var(--success-500) 20%, transparent)" },
}[level] ?? { bg: "var(--neutral-100)", text: "var(--text-muted-themed)", border: "var(--border-subtle)" });

const suggestionColor = (s?: string) => {
  if (!s) return "var(--text-muted-themed)";
  if (s === "Approve") return "var(--success-700)";
  if (s === "Reject") return "var(--destructive-700)";
  return "var(--warning-700)";
};

export const WorkspaceCaseDetailPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const entry = caseId ? RICH_CASES_BY_ID[caseId] : undefined;

  if (!entry) {
    return (
      <main className="flex-1 flex items-center justify-center flex-col gap-3" style={{ backgroundColor: "var(--neutral-50)" }}>
        <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-heading)" }}>Case not found</span>
        <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>Case ID "{caseId}" does not exist.</span>
        <button
          onClick={() => navigate("/workspace")}
          style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", marginTop: 4 }}
        >
          ← Back to Workspace
        </button>
      </main>
    );
  }

  const risk = riskChipStyle(entry.riskLevel);
  const suggestion = entry.aiSuggestion ?? entry.detail.camDraft.recommendation;

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden" style={{ backgroundColor: "var(--neutral-50)" }}>
      {/* ── Breadcrumb ── */}
      <div className="shrink-0" style={{ backgroundColor: "var(--surface-card)", borderBottom: "1px solid var(--neutral-100)" }}>
        <div className="flex items-center px-6" style={{ height: 36 }}>
          <button
            onClick={() => navigate("/workspace")}
            style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-muted-themed)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Workspace
          </button>
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className="mx-1 shrink-0">
            <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="var(--sidebar-icon-color)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <button
            onClick={() => navigate("/workspace")}
            style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-muted-themed)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Action Queue
          </button>
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className="mx-1 shrink-0">
            <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="var(--sidebar-icon-color)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-heading)" }}>{entry.name}</span>
        </div>
      </div>

      {/* ── Page header + tabs ── */}
      <div className="shrink-0 px-6 pt-5 pb-0" style={{ backgroundColor: "var(--surface-card)" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ ...f, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text-heading)" }}>{entry.name}</span>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5"
                style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, backgroundColor: risk.bg, color: risk.text, border: `1px solid ${risk.border}` }}
              >
                {entry.riskLevel} Risk
              </span>
            </div>
            <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>
              {entry.id} · {entry.industry} · {entry.detail.cin}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>AI Suggestion:</span>
            <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: suggestionColor(suggestion) }}>
              {suggestion}
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2.5 cursor-pointer"
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--primary)" : "var(--text-muted-themed)",
                  background: "none",
                  border: "none",
                  borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                  marginBottom: -1,
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div
        className="flex-1"
        style={{
          overflow: activeTab === "cam" ? "hidden" : "auto",
          backgroundColor: "var(--neutral-50)",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {activeTab === "overview"    && <OverviewTabContent entry={entry} />}
        {activeTab === "financials"  && <FinancialsTabContent entry={entry} />}
        {activeTab === "litigations" && <LitigationsTabContent entry={entry} />}
        {activeTab === "cam"         && <CAMDraftTabContent entry={entry} />}
        {activeTab === "documents"   && <DocumentsTabContent entry={entry} />}
      </div>
    </main>
  );
};

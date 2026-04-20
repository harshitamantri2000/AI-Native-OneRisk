# Underwriter IA Restructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure OneRisk routing and UI for the Underwriter persona — new sidebar, Workspace landing, and a 5-tab Case Detail page backed by rich mock data.

**Architecture:** Replace fragmented analysis routes with a single `/workspace/case/:caseId` route backed by `RICH_CASES_BY_ID`. Workspace is the default landing; `/home` is shown only to new users. All tabs read from the `RichCaseEntry` type.

**Tech Stack:** React 18, TypeScript, React Router v7 (createBrowserRouter), Tailwind CSS v4, shadcn/ui, Framer Motion, Plus Jakarta Sans

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/app/data/cases.ts` | Update `CaseStatus` type |
| Modify | `src/app/routes.tsx` | New IA routes |
| Modify | `src/app/components/Sidebar.tsx` | Workspace nav, remove Home |
| Modify | `src/app/components/EDDCaseManagement.tsx` | Breadcrumb + title + navigation |
| Modify | `src/app/components/CaseTable.tsx` | Nav path + remove Reviewed tab + status chips |
| Create | `src/app/components/WorkspaceCaseDetailPage.tsx` | 5-tab Case Detail page |
| Create | `src/app/components/case-detail/OverviewTabContent.tsx` | Tab 1: network map + AI insights + financials P4&5 |
| Create | `src/app/components/case-detail/FinancialsTabContent.tsx` | Tab 2: all financial parameters |
| Create | `src/app/components/case-detail/LitigationsTabContent.tsx` | Tab 3: entity + director litigations |
| Create | `src/app/components/case-detail/CAMDraftTabContent.tsx` | Tab 4: CAM draft + Share with Credit Head |
| Create | `src/app/components/case-detail/DocumentsTabContent.tsx` | Tab 5: uploaded documents |

---

## Task 1: Update CaseStatus in cases.ts

**Files:**
- Modify: `src/app/data/cases.ts:2`

- [ ] **Step 1: Replace CaseStatus type**

Replace line 2 in `src/app/data/cases.ts`:
```ts
// OLD
export type CaseStatus = "New" | "Approved" | "Rejected" | "On Hold" | "Expert Review";

// NEW
export type CaseStatus = "In Progress" | "Completed" | "Failed" | "Sent to Credit Head";
```

- [ ] **Step 2: Update MOCK_CASES statuses**

In `src/app/data/cases.ts`, change all `status` values on mock cases from the old values to new ones:
- `"New"` → `"In Progress"`
- `"Approved"` → `"Completed"`
- `"Rejected"` → `"Failed"`
- `"On Hold"` → `"In Progress"`
- `"Expert Review"` → `"Sent to Credit Head"`

- [ ] **Step 3: Verify build**
```bash
npm run build 2>&1 | tail -20
```
Expected: No TypeScript errors.

---

## Task 2: Update routes.tsx

**Files:**
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Replace router config**

```tsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { EDDCaseManagement } from "./components/EDDCaseManagement";
import { BulkUploadPage } from "./components/BulkUploadPage";
import { AlertsPage } from "./components/AlertsPage";
import { CreateNewCasePage } from "./components/CreateNewCasePage";
import { NewHomePage } from "./components/NewHomePage";
import { WorkspaceCaseDetailPage } from "./components/WorkspaceCaseDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, element: <Navigate to="/workspace" replace /> },
      { path: "home", Component: NewHomePage },
      { path: "workspace", Component: EDDCaseManagement },
      { path: "workspace/case/:caseId", Component: WorkspaceCaseDetailPage },
      { path: "alerts", Component: AlertsPage },
      { path: "bulk-upload", Component: BulkUploadPage },
      { path: "new-case", Component: CreateNewCasePage },
      { path: "*", element: <Navigate to="/workspace" replace /> },
    ],
  },
]);
```

- [ ] **Step 2: Verify build**
```bash
npm run build 2>&1 | tail -20
```
Expected: No errors (WorkspaceCaseDetailPage import will fail until Task 6 — create a stub first if needed).

---

## Task 3: Update Sidebar.tsx

**Files:**
- Modify: `src/app/components/Sidebar.tsx`

- [ ] **Step 1: Add LayoutDashboard import, remove Home**

Change the lucide-react import from:
```ts
import { Home, Bell, Upload, ChevronLeft, ChevronRight, LogOut, User } from "lucide-react";
```
to:
```ts
import { LayoutDashboard, Bell, Upload, ChevronLeft, ChevronRight, LogOut, User } from "lucide-react";
```

- [ ] **Step 2: Update active state detection**

Replace:
```ts
const isHome =
  location.pathname === "/" ||
  location.pathname === "/home";
```
with:
```ts
const isWorkspace =
  location.pathname === "/workspace" ||
  location.pathname.startsWith("/workspace/");
```

- [ ] **Step 3: Replace Home nav item with Workspace**

Replace the `<NavButton>` for Home with:
```tsx
<NavButton
  active={isWorkspace}
  expanded={expanded}
  icon={
    <LayoutDashboard
      size={iconSize}
      strokeWidth={1.8}
      color={iconColor(isWorkspace)}
    />
  }
  label="Workspace"
  labelStyle={labelStyle(isWorkspace)}
  style={navItemStyle(isWorkspace)}
  onClick={() => navigate("/workspace")}
/>
```

- [ ] **Step 4: Verify build**
```bash
npm run build 2>&1 | tail -20
```

---

## Task 4: Update EDDCaseManagement.tsx

**Files:**
- Modify: `src/app/components/EDDCaseManagement.tsx`

- [ ] **Step 1: Update breadcrumb text**

Change breadcrumb from `Risk Bundles > Entity Due Diligence` to `Workspace > Action Queue`.

Replace the breadcrumb section (lines ~42–71):
```tsx
{/* ── Sticky Top: Breadcrumb ── */}
<div
  className="shrink-0"
  style={{
    backgroundColor: "var(--surface-card)",
    borderBottom: "1px solid var(--neutral-100)",
  }}
>
  <div className="flex items-center px-6" style={{ height: 36 }}>
    <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-muted-themed)" }}>
      Workspace
    </span>
    <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className="shrink-0">
      <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="var(--sidebar-icon-color)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
      Action Queue
    </span>
  </div>
</div>
```

- [ ] **Step 2: Update page title and subtitle**

Change:
```tsx
// title
Entity Due Diligence
// subtitle
EDD risk bundle cases — company-level due diligence with approve/reject workflow
```
to:
```tsx
// title
Action Queue
// subtitle
Company due diligence cases — review AI-generated CAM and share with Credit Head
```

- [ ] **Step 3: Remove source filter, update cases source**

Change `MOCK_CASES` to use `RICH_MOCK_CASES` from the mock data folder for cases:

Add import:
```ts
import { RICH_MOCK_CASES } from "../data/mock";
```

Replace `eddCases` memo:
```ts
// No filter needed — all RICH_MOCK_CASES are entity-dd
const eddCases = RICH_MOCK_CASES;
```

Pass `cases` to `<CaseTable>`:
```tsx
<CaseTable cases={eddCases} showSources={false} />
```

Note: `CaseTable` currently types `cases` as `typeof MOCK_CASES`. This will need updating in Task 5.

---

## Task 5: Update CaseTable.tsx

**Files:**
- Modify: `src/app/components/CaseTable.tsx`

- [ ] **Step 1: Accept RichCaseEntry cases**

Import `RichCaseEntry` and `RICH_MOCK_CASES`:
```ts
import { RICH_MOCK_CASES, type RichCaseEntry } from "../data/mock";
```

Update component signature:
```ts
export const CaseTable = ({
  cases = RICH_MOCK_CASES,
  showSources = true,
}: {
  cases?: RichCaseEntry[];
  showSources?: boolean;
}) => {
```

- [ ] **Step 2: Remove Reviewed tab — show flat list**

Remove `tab` state and the `newCases`/`reviewedCases` split. Replace with:
```ts
const baseRows = cases;
```

Remove the tab UI elements (Queue / Reviewed toggle).

- [ ] **Step 3: Update status filter to new statuses**

Update any references to old `CaseStatus` values (`"New"`, `"Approved"`, etc.) in filter dropdowns or chips to use:
`"In Progress"` | `"Completed"` | `"Failed"` | `"Sent to Credit Head"`

- [ ] **Step 4: Update status chip colors**

Add status chip renderer:
```tsx
const statusChipCfg: Record<string, { bg: string; border: string; text: string }> = {
  "In Progress":         { bg: "color-mix(in srgb, var(--info-600) 10%, transparent)", border: "color-mix(in srgb, var(--info-600) 20%, transparent)", text: "var(--info-600)" },
  "Completed":           { bg: "color-mix(in srgb, var(--success-500) 10%, transparent)", border: "color-mix(in srgb, var(--success-500) 20%, transparent)", text: "var(--success-700)" },
  "Failed":              { bg: "color-mix(in srgb, var(--destructive-500) 8%, transparent)", border: "color-mix(in srgb, var(--destructive-500) 18%, transparent)", text: "var(--destructive-700)" },
  "Sent to Credit Head": { bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)", border: "color-mix(in srgb, var(--warning-600) 20%, transparent)", text: "var(--warning-700)" },
};
```

- [ ] **Step 5: Update case row navigation path**

Change:
```ts
onNavigate={() => navigate(`/analysis/case/${item.id}`)}
```
to:
```ts
onNavigate={() => navigate(`/workspace/case/${item.id}`)}
```

- [ ] **Step 6: Update field references for RichCaseEntry**

`RichCaseEntry` uses `industry` not `natureOfBusiness`. Update all `.natureOfBusiness` → `.industry` in CaseTable.

- [ ] **Step 7: Verify build**
```bash
npm run build 2>&1 | tail -20
```

---

## Task 6: Create WorkspaceCaseDetailPage.tsx + 5 tab components

**Files:**
- Create: `src/app/components/WorkspaceCaseDetailPage.tsx`
- Create: `src/app/components/case-detail/OverviewTabContent.tsx`
- Create: `src/app/components/case-detail/FinancialsTabContent.tsx`
- Create: `src/app/components/case-detail/LitigationsTabContent.tsx`
- Create: `src/app/components/case-detail/CAMDraftTabContent.tsx`
- Create: `src/app/components/case-detail/DocumentsTabContent.tsx`

### WorkspaceCaseDetailPage.tsx

- [ ] **Step 1: Create the shell page with tab navigation**

```tsx
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
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "litigations", label: "Litigations" },
  { id: "cam", label: "CAM Draft" },
  { id: "documents", label: "Documents" },
];

const riskColors: Record<string, { bg: string; text: string; border: string }> = {
  High:   { bg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)", text: "var(--destructive-700)", border: "color-mix(in srgb, var(--destructive-500) 20%, transparent)" },
  Medium: { bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)", text: "var(--warning-700)", border: "color-mix(in srgb, var(--warning-600) 20%, transparent)" },
  Low:    { bg: "color-mix(in srgb, var(--success-500) 10%, transparent)", text: "var(--success-700)", border: "color-mix(in srgb, var(--success-500) 20%, transparent)" },
};

export const WorkspaceCaseDetailPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const entry = caseId ? RICH_CASES_BY_ID[caseId] : undefined;

  if (!entry) {
    return (
      <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: "var(--neutral-50)" }}>
        <span style={{ ...f, color: "var(--text-muted-themed)" }}>Case not found.</span>
      </main>
    );
  }

  const risk = riskColors[entry.riskLevel] ?? riskColors.Medium;

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden" style={{ backgroundColor: "var(--neutral-50)" }}>
      {/* Breadcrumb */}
      <div className="shrink-0" style={{ backgroundColor: "var(--surface-card)", borderBottom: "1px solid var(--neutral-100)" }}>
        <div className="flex items-center px-6" style={{ height: 36 }}>
          <button onClick={() => navigate("/workspace")} style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-muted-themed)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Workspace
          </button>
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className="shrink-0 mx-1">
            <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="var(--sidebar-icon-color)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <button onClick={() => navigate("/workspace")} style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-muted-themed)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Action Queue
          </button>
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className="shrink-0 mx-1">
            <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="var(--sidebar-icon-color)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-heading)" }}>{entry.name}</span>
        </div>
      </div>

      {/* Page header */}
      <div className="shrink-0 px-6 pt-5 pb-0" style={{ backgroundColor: "var(--surface-card)" }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span style={{ ...f, fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-heading)" }}>{entry.name}</span>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5" style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 500, backgroundColor: risk.bg, color: risk.text, border: `1px solid ${risk.border}` }}>
                {entry.riskLevel} Risk
              </span>
            </div>
            <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>
              {entry.id} · {entry.industry} · {entry.detail.cin}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-muted-themed)" }}>AI Suggestion:</span>
            <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: entry.aiSuggestion === "Approve" ? "var(--success-700)" : entry.aiSuggestion === "Reject" ? "var(--destructive-700)" : "var(--warning-700)" }}>
              {entry.aiSuggestion ?? entry.detail.camDraft.recommendation}
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border-b-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2.5 cursor-pointer"
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? "var(--primary)" : "var(--text-muted-themed)",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                marginBottom: -1,
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--neutral-50)" }}>
        {activeTab === "overview"    && <OverviewTabContent entry={entry} />}
        {activeTab === "financials"  && <FinancialsTabContent entry={entry} />}
        {activeTab === "litigations" && <LitigationsTabContent entry={entry} />}
        {activeTab === "cam"         && <CAMDraftTabContent entry={entry} />}
        {activeTab === "documents"   && <DocumentsTabContent entry={entry} />}
      </div>
    </main>
  );
};
```

### OverviewTabContent.tsx

- [ ] **Step 2: Create Overview tab**

```tsx
import React from "react";
import type { RichCaseEntry } from "../../data/mock";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20 }}>
    <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", marginBottom: 12 }}>{title}</h3>
    {children}
  </div>
);

const networkRiskColor = (level: "HIGH" | "MEDIUM" | "LOW") => ({
  HIGH:   { text: "var(--destructive-700)", bg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)" },
  MEDIUM: { text: "var(--warning-700)", bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)" },
  LOW:    { text: "var(--success-700)", bg: "color-mix(in srgb, var(--success-500) 10%, transparent)" },
}[level]);

export const OverviewTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const { detail, aiInsight } = entry;
  const p4and5 = detail.financialParameters.filter((p) => p.priority >= 4);

  return (
    <div className="p-6 flex flex-col gap-4">
      {/* ── Network + AI Insights row ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Network */}
        <SectionCard title="Network Connections">
          <div className="flex flex-col gap-3">
            {detail.networkNodes.map((node) => {
              const nodeRisk = node.riskLevel === "High" ? "var(--destructive-700)" : node.riskLevel === "Medium" ? "var(--warning-700)" : "var(--success-700)";
              return (
                <div key={node.id} className="flex items-start justify-between gap-2 p-3 rounded-lg" style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--neutral-50)" }}>
                  <div className="flex flex-col gap-0.5">
                    <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{node.name}</span>
                    <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{node.relationship} · {node.commonDirectors.join(", ")}</span>
                  </div>
                  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: nodeRisk, whiteSpace: "nowrap" }}>{node.riskLevel} Risk</span>
                </div>
              );
            })}
            {detail.networkInsights && (
              <p style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", marginTop: 4 }}>{detail.networkInsights.summary}</p>
            )}
          </div>
        </SectionCard>

        {/* AI Insights */}
        <SectionCard title="AI Insights">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Confidence</span>
              <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{aiInsight.confidencePercent}%</span>
            </div>
            <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)" }}>{aiInsight.summary}</p>
            <div className="flex flex-col gap-1.5 mt-1">
              <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Top Risk</span>
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--destructive-700)" }}>{aiInsight.topRisk}</span>
            </div>
            {aiInsight.factors.length > 0 && (
              <ul className="flex flex-col gap-1 mt-1">
                {aiInsight.factors.map((f_item, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-body)" }}>
                    <span style={{ color: "var(--text-muted-themed)", marginTop: 1 }}>·</span>
                    {f_item}
                  </li>
                ))}
              </ul>
            )}
            {aiInsight.networkRisk && (
              <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg" style={{ backgroundColor: networkRiskColor(aiInsight.networkRisk.level).bg }}>
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: networkRiskColor(aiInsight.networkRisk.level).text }}>Network: {aiInsight.networkRisk.level}</span>
                <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>— {aiInsight.networkRisk.label}</span>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* ── Financial Health (P4 & P5) ── */}
      {p4and5.length > 0 && (
        <SectionCard title="Financial Health — Cross-Source & Quality Checks">
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {p4and5.map((param) => (
              <div key={param.id} className="flex flex-col gap-1 p-3 rounded-lg" style={{ border: `1px solid ${param.flagged ? "var(--destructive-200)" : "var(--border-subtle)"}`, backgroundColor: param.flagged ? "color-mix(in srgb, var(--destructive-500) 5%, transparent)" : "var(--neutral-50)" }}>
                <div className="flex items-center justify-between gap-2">
                  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-heading)" }}>{param.name}</span>
                  <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{param.source}</span>
                </div>
                <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: param.flagged ? "var(--destructive-700)" : "var(--text-heading)" }}>
                  {param.unit === "₹" ? `₹${(param.value as number / 1e7).toFixed(2)} Cr` : typeof param.value === "number" ? param.value.toLocaleString() : param.value}
                  {param.unit && param.unit !== "₹" ? ` ${param.unit}` : ""}
                </span>
                {param.aiCommentary && (
                  <p style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", lineHeight: "1.5" }}>{param.aiCommentary}</p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Source Reconciliation (conditional) ── */}
      {detail.sourceReconciliation && detail.sourceReconciliation.length > 0 && (
        <SectionCard title="Data Source Reconciliation">
          <div className="flex flex-col gap-2">
            {detail.sourceReconciliation.map((row, i) => (
              <div key={i} className="flex items-start justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-heading)", minWidth: 180 }}>{row.metric}</span>
                <div className="flex gap-4 flex-wrap">
                  {row.mcaValue !== undefined && <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>MCA: ₹{(row.mcaValue / 1e7).toFixed(2)} Cr</span>}
                  {row.gstValue !== undefined && <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>GST: ₹{(row.gstValue / 1e7).toFixed(2)} Cr</span>}
                  {row.itrValue !== undefined && <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>ITR: ₹{(row.itrValue / 1e7).toFixed(2)} Cr</span>}
                  {row.bankingValue !== undefined && <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Banking: ₹{(row.bankingValue / 1e7).toFixed(2)} Cr</span>}
                  {row.discrepancy && <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--destructive-700)" }}>⚠ Discrepancy</span>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
};
```

### FinancialsTabContent.tsx

- [ ] **Step 3: Create Financials tab**

```tsx
import React from "react";
import type { RichCaseEntry } from "../../data/mock";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

const priorityLabels: Record<number, string> = {
  1: "Core Financials",
  2: "Leverage & Debt",
  3: "Liquidity",
  4: "Quality Indicators",
  5: "Cross-Source Checks",
};

const trendIcon = (trend?: "up" | "down" | "stable", val?: number) => {
  if (!trend) return null;
  if (trend === "stable") return <span style={{ color: "var(--text-muted-themed)" }}>→</span>;
  const color = trend === "up" ? "var(--success-600)" : "var(--destructive-600)";
  const arrow = trend === "up" ? "↑" : "↓";
  return <span style={{ color }}>{arrow}{val !== undefined ? ` ${Math.abs(val)}%` : ""}</span>;
};

const formatValue = (value: number | string, unit?: string) => {
  if (unit === "₹") return `₹${(Number(value) / 1e7).toFixed(2)} Cr`;
  if (unit === "₹/mo") return `₹${(Number(value) / 1e5).toFixed(2)} L/mo`;
  if (typeof value === "number") return value.toLocaleString();
  return value;
};

export const FinancialsTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const { detail } = entry;
  const byPriority = [1, 2, 3, 4, 5].map((p) => ({
    priority: p,
    params: detail.financialParameters.filter((fp) => fp.priority === p),
  })).filter((g) => g.params.length > 0);

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Yearly trend table */}
      {detail.yearlyFinancials && detail.yearlyFinancials.length > 0 && (
        <div style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20 }}>
          <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", marginBottom: 12 }}>Year-over-Year Trend</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["FY", "Revenue", "EBITDA", "Net Profit", "Total Debt", "Cash"].map((h) => (
                    <th key={h} style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted-themed)", padding: "6px 12px", textAlign: "right", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.yearlyFinancials.map((yr) => (
                  <tr key={yr.year} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", padding: "8px 12px" }}>FY{yr.year}</td>
                    {[yr.revenue, yr.ebitda, yr.netProfit, yr.totalDebt, yr.cashAndEquivalents].map((v, i) => (
                      <td key={i} style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", padding: "8px 12px", textAlign: "right" }}>
                        {v !== undefined ? `₹${(v / 1e7).toFixed(2)} Cr` : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Parameters by priority group */}
      {byPriority.map(({ priority, params }) => (
        <div key={priority} style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20 }}>
          <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", marginBottom: 12 }}>
            P{priority} — {priorityLabels[priority]}
          </h3>
          <div className="flex flex-col gap-3">
            {params.map((param) => (
              <div key={param.id} className="flex flex-col gap-1 p-3 rounded-lg" style={{ border: `1px solid ${param.flagged ? "var(--destructive-200)" : "var(--border-subtle)"}`, backgroundColor: param.flagged ? "color-mix(in srgb, var(--destructive-500) 5%, transparent)" : "transparent" }}>
                <div className="flex items-center justify-between gap-2">
                  <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{param.name}</span>
                  <div className="flex items-center gap-2">
                    {trendIcon(param.trend, param.trendValue)}
                    <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", padding: "1px 6px", borderRadius: 4, backgroundColor: "var(--neutral-100)" }}>{param.source}</span>
                  </div>
                </div>
                <span style={{ ...f, fontSize: "var(--text-lg)", fontWeight: 700, color: param.flagged ? "var(--destructive-700)" : "var(--text-heading)" }}>
                  {formatValue(param.value, param.unit)}
                </span>
                {param.benchmarkValue !== undefined && (
                  <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>
                    {param.benchmarkLabel}: {formatValue(param.benchmarkValue, param.unit)}
                  </span>
                )}
                {param.aiCommentary && (
                  <p style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", lineHeight: "1.5", marginTop: 2 }}>{param.aiCommentary}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### LitigationsTabContent.tsx

- [ ] **Step 4: Create Litigations tab**

```tsx
import React from "react";
import type { RichCaseEntry } from "../../data/mock";
import type { LitigationRecord } from "../../data/mock";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

const severityColor = (s: LitigationRecord["severity"]) => ({
  Critical: { text: "var(--destructive-700)", bg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)" },
  High:     { text: "var(--destructive-600)", bg: "color-mix(in srgb, var(--destructive-500) 8%, transparent)" },
  Medium:   { text: "var(--warning-700)", bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)" },
  Low:      { text: "var(--text-muted-themed)", bg: "var(--neutral-100)" },
}[s]);

const LitigationCard = ({ lit }: { lit: LitigationRecord }) => {
  const sc = severityColor(lit.severity);
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg" style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
      <div className="flex items-start justify-between gap-2">
        <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{lit.offence}</span>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 shrink-0" style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, backgroundColor: sc.bg, color: sc.text }}>{lit.severity}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Case: {lit.caseNumber}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>IPC: {lit.ipcSection}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Court: {lit.court}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Filed: {lit.filingDate}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Status: {lit.status}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Max punishment: {lit.maxPunishment}</span>
      </div>
      {lit.notes && <p style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", fontStyle: "italic" }}>{lit.notes}</p>}
    </div>
  );
};

export const LitigationsTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const { detail } = entry;
  const hasEntityLit = detail.entityLitigations.length > 0;
  const hasDirectorLit = detail.directorLitigations.some((d) => d.litigations.length > 0);

  if (!hasEntityLit && !hasDirectorLit) {
    return (
      <div className="p-6 flex items-center justify-center" style={{ minHeight: 200 }}>
        <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>No litigation records found for this entity or its directors.</span>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {hasEntityLit && (
        <div>
          <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", marginBottom: 12 }}>Entity Litigations</h3>
          <div className="flex flex-col gap-3">
            {detail.entityLitigations.map((lit) => <LitigationCard key={lit.id} lit={lit} />)}
          </div>
        </div>
      )}
      {detail.directorLitigations.map((dir) => (
        <div key={dir.din}>
          <div className="flex items-center gap-2 mb-3">
            <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{dir.name}</h3>
            <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{dir.designation} · DIN: {dir.din}</span>
            {dir.litigations.length === 0 && (
              <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--success-700)", backgroundColor: "color-mix(in srgb, var(--success-500) 10%, transparent)", padding: "2px 8px", borderRadius: 999 }}>Clean</span>
            )}
          </div>
          {dir.litigations.length > 0 ? (
            <div className="flex flex-col gap-3">
              {dir.litigations.map((lit) => <LitigationCard key={lit.id} lit={lit} />)}
            </div>
          ) : (
            <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>No litigation records.</p>
          )}
        </div>
      ))}
    </div>
  );
};
```

### CAMDraftTabContent.tsx

- [ ] **Step 5: Create CAM Draft tab with Share button**

```tsx
import React, { useState } from "react";
import type { RichCaseEntry } from "../../data/mock";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

const ratingColor = (rating: string) => ({
  A: "var(--success-700)", B: "var(--success-600)", C: "var(--warning-700)",
  D: "var(--destructive-600)", E: "var(--destructive-700)",
}[rating] ?? "var(--text-heading)");

export const CAMDraftTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const { camDraft } = entry.detail;
  const [shared, setShared] = useState(camDraft.sharedWithCreditHead ?? false);

  return (
    <div className="p-6 flex flex-col gap-4" style={{ maxWidth: 800 }}>
      {/* CAM header */}
      <div style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20 }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <h2 style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)" }}>Credit Appraisal Memo</h2>
            <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Generated: {camDraft.generatedOn}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--neutral-50)", border: "1px solid var(--border-subtle)" }}>
              <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Risk Rating</span>
              <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: ratingColor(camDraft.riskRating) }}>{camDraft.riskRating}</span>
            </div>
            <button
              onClick={() => setShared(true)}
              disabled={shared}
              className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all active:scale-[0.97]"
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                backgroundColor: shared ? "var(--neutral-100)" : "var(--primary)",
                color: shared ? "var(--text-muted-themed)" : "var(--text-on-color)",
                border: "none",
                cursor: shared ? "default" : "pointer",
                opacity: shared ? 0.8 : 1,
              }}
            >
              {shared ? "✓ Shared with Credit Head" : "Share with Credit Head"}
            </button>
          </div>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div><span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Borrower</span><p style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{camDraft.borrowerName}</p></div>
          {camDraft.loanAmount && <div><span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Loan Amount</span><p style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>₹{(camDraft.loanAmount / 1e7).toFixed(2)} Cr</p></div>}
          {camDraft.purpose && <div className="col-span-2"><span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Purpose</span><p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)" }}>{camDraft.purpose}</p></div>}
          <div><span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Recommendation</span><p style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: camDraft.recommendation === "Approve" ? "var(--success-700)" : camDraft.recommendation === "Reject" ? "var(--destructive-700)" : "var(--warning-700)" }}>{camDraft.recommendation}</p></div>
        </div>
      </div>

      {/* CAM sections */}
      {camDraft.sections.map((section) => (
        <div key={section.title} style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20 }}>
          <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", marginBottom: 8 }}>{section.title}</h3>
          <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "1.7" }}>{section.content}</p>
        </div>
      ))}

      {/* Conditions */}
      {camDraft.conditions && camDraft.conditions.length > 0 && (
        <div style={{ backgroundColor: "color-mix(in srgb, var(--warning-600) 8%, transparent)", borderRadius: "var(--radius-lg)", border: "1px solid color-mix(in srgb, var(--warning-600) 20%, transparent)", padding: 20 }}>
          <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--warning-700)", marginBottom: 8 }}>Approval Conditions</h3>
          <ul className="flex flex-col gap-2">
            {camDraft.conditions.map((c, i) => (
              <li key={i} className="flex items-start gap-2" style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)" }}>
                <span style={{ color: "var(--warning-700)", fontWeight: 700, marginTop: 1 }}>{i + 1}.</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### DocumentsTabContent.tsx

- [ ] **Step 6: Create Documents tab**

```tsx
import React from "react";
import type { RichCaseEntry } from "../../data/mock";
import { FileText, CheckCircle2, Clock } from "lucide-react";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

export const DocumentsTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const docs = entry.detail.documents;
  return (
    <div className="p-6">
      <div style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>Uploaded Documents</h3>
          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{docs.filter((d) => d.verified).length}/{docs.length} verified</span>
        </div>
        <div className="flex flex-col gap-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ border: "1px solid var(--border-subtle)" }}>
              <FileText size={16} strokeWidth={1.8} color="var(--text-muted-themed)" />
              <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-heading)" }}>{doc.name}</span>
                <div className="flex items-center gap-3">
                  <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{doc.type}</span>
                  <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Uploaded: {doc.uploadDate}</span>
                  {doc.verifiedBy && <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>via {doc.verifiedBy}</span>}
                  {doc.notes && <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--warning-700)", fontStyle: "italic" }}>{doc.notes}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {doc.verified
                  ? <><CheckCircle2 size={14} strokeWidth={2} color="var(--success-600)" /><span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--success-700)" }}>Verified</span></>
                  : <><Clock size={14} strokeWidth={2} color="var(--text-muted-themed)" /><span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Pending</span></>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 7: Verify build**
```bash
npm run build 2>&1 | tail -20
```
Expected: 0 errors, all 6 new/modified files compiled.

---

## Self-Review Checklist

- [x] Spec coverage: All 5 tabs covered. Routes updated. Sidebar updated. Workspace breadcrumb updated. CaseStatus type updated. Share with Credit Head button in CAM tab.
- [x] No placeholders: All code blocks are complete.
- [x] Type consistency: `RichCaseEntry` used throughout. `RICH_CASES_BY_ID` for lookup. `LitigationRecord` imported in Litigations tab.
- [x] Navigation path: `/workspace/case/:caseId` used consistently.

# Insight Findings Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current InsightCard design with a compact findings list — one row per finding, click to expand inline, "against whom" subtext on director/network rows, source chip opens a context-aware tooltip.

**Architecture:** Rework the `NetworkInsightCard` type to carry `against` (company/director/network) + `againstLabel`. Findings are sorted company-first, directors-second, network-last entirely in the component — no visible section headers. The `FindingRow` component handles collapsed/expanded state locally; the panel manages which row is active. Source tooltip is fixed-position, dismissed on outside click.

**Tech Stack:** React 18, TypeScript, inline styles (no Tailwind in this component), existing CSS variables.

---

### Task 1: Update the `NetworkInsightCard` type

**Files:**
- Modify: `src/app/data/mock/types.ts`

- [ ] **Step 1: Replace the type**

Open `src/app/data/mock/types.ts`. Find the `NetworkInsightCard` interface (line ~85) and replace it entirely with:

```typescript
export type InsightAgainst = "company" | "director" | "network";

export interface InsightSourceDetail {
  label: string;       // e.g. "CrimeCheck · Verified Feb 2026"
  fields: { key: string; value: string }[];  // e.g. [{key: "Case No.", value: "CC-2022-0189"}, ...]
}

export interface NetworkInsightCard {
  title: string;                  // Problem statement: "5 criminal cases via Mahafuz Khaan"
  subtext?: string;               // Optional one-liner — skip if title already says it
  severity: "critical" | "warning" | "info" | "positive";
  against: InsightAgainst;        // Determines sort order: company → director → network
  againstLabel?: string;          // Only for director/network: "Mahafuz Khaan · MD" or "A.R. Amboli · via Khaan"
  source: string;                 // Short name: "CrimeCheck / IDfy"
  sourceDetails?: InsightSourceDetail;
}
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in` — TypeScript errors will appear pointing to the mock data files, that's expected and fixed in Task 2.

---

### Task 2: Rewrite mock data for M.K. Shelters

**Files:**
- Modify: `src/app/data/mock/mk-shelters.ts`

Find the `insightCards` array inside `networkInsights` and replace it:

- [ ] **Step 1: Replace insightCards in mk-shelters**

```typescript
insightCards: [
  {
    title: "5 criminal cases via Mahafuz Khaan — IPC 467, 420",
    severity: "critical",
    against: "network",
    againstLabel: "A.R. Amboli · via Mahafuz Khaan",
    source: "CrimeCheck / IDfy",
    sourceDetails: {
      label: "CrimeCheck · Verified Feb 2026",
      fields: [
        { key: "Cases", value: "CC-2021-4471, CC-2022-0189, CC-2023-1102" },
        { key: "Sections", value: "IPC 467 (Forgery), 420 (Cheating), 120-B" },
        { key: "Court", value: "Andheri MM Court, Mumbai" },
        { key: "Accused director", value: "Mahafuz Khaan (DIN: 00420666)" },
        { key: "Next hearing", value: "2026-05-12" },
      ],
    },
  },
  {
    title: "Mahafuz Khaan named in criminal proceedings as accused",
    severity: "critical",
    against: "director",
    againstLabel: "Mahafuz Khaan · Managing Director",
    source: "CrimeCheck",
    sourceDetails: {
      label: "CrimeCheck · IDfy Netscan · Feb 2026",
      fields: [
        { key: "DIN", value: "00420666" },
        { key: "Case", value: "CC-2022-0189 · Andheri MM Court" },
        { key: "Charges", value: "IPC 467, 420" },
        { key: "Max sentence", value: "Life imprisonment (IPC 467)" },
        { key: "Status", value: "Pending trial" },
      ],
    },
  },
  {
    title: "Revenue down 12.3% YoY while debt rose 9.2%",
    subtext: "Compressing ICR to 1.62x — approaching 1.4x covenant threshold.",
    severity: "warning",
    against: "company",
    source: "MCA / Banking",
    sourceDetails: {
      label: "MCA ROC Filing · FY 2024-25",
      fields: [
        { key: "Revenue FY24→FY25", value: "₹71.3 Cr → ₹62.5 Cr (−12.3%)" },
        { key: "Total debt", value: "₹58.9 Cr → ₹64.4 Cr (+9.2%)" },
        { key: "ICR", value: "1.62x (down from 1.9x)" },
        { key: "OCF decline", value: "−31.4% YoY" },
      ],
    },
  },
  {
    title: "ICR 1.62x — 15% EBITDA drop breaches 1.4x covenant",
    severity: "warning",
    against: "company",
    source: "MCA",
    sourceDetails: {
      label: "MCA Balance Sheet · FY 2024-25",
      fields: [
        { key: "EBITDA", value: "₹9.75 Cr" },
        { key: "Interest expense", value: "₹6.02 Cr" },
        { key: "ICR", value: "1.62x" },
        { key: "Covenant threshold", value: "1.4x minimum" },
        { key: "Industry benchmark", value: "2.0x" },
      ],
    },
  },
  {
    title: "Deferred payment on SBI term loan, Q3 FY24",
    subtext: "Subsequently regularised. Indicates past liquidity stress.",
    severity: "info",
    against: "company",
    source: "CIBIL / IDfy",
    sourceDetails: {
      label: "CIBIL Report · IDfy · Feb 2026",
      fields: [
        { key: "Overdue amount", value: "₹18.4L on SBI term loan" },
        { key: "Reported", value: "Oct 2023" },
        { key: "Regularised", value: "Dec 2023" },
        { key: "Current status", value: "Standard (as of Jan 2026)" },
        { key: "Credit score", value: "682 (moderate)" },
      ],
    },
  },
],
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: still errors from mana-properties and ushodaya (next task). That's fine.

---

### Task 3: Rewrite mock data for Mana Properties and Ushodaya

**Files:**
- Modify: `src/app/data/mock/mana-properties.ts`
- Modify: `src/app/data/mock/ushodaya-supermarkets.ts`

- [ ] **Step 1: Replace insightCards in mana-properties.ts**

```typescript
insightCards: [
  {
    title: "Second-degree link to A.R. Amboli via M.K. Shelters",
    subtext: "Passive, non-financial — no direct risk transfer confirmed.",
    severity: "info",
    against: "network",
    againstLabel: "M.K. Shelters · via Sunil P. Kadam",
    source: "IDfy Netscan",
    sourceDetails: {
      label: "IDfy Netscan Report · Mar 2026",
      fields: [
        { key: "Director overlap", value: "Sunil Parshuram Kadam (DIN: 08533072)" },
        { key: "Path", value: "Mana Properties → M.K. Shelters → A.R. Amboli" },
        { key: "Financial cross-exposure", value: "None confirmed" },
        { key: "M.K. Shelters risk", value: "Medium" },
      ],
    },
  },
  {
    title: "No direct findings on entity",
    severity: "positive",
    against: "company",
    source: "IDfy / CrimeCheck / GST",
    sourceDetails: {
      label: "IDfy Netscan · CrimeCheck · GST · Mar 2026",
      fields: [
        { key: "AML", value: "No hits — FATF, OFAC, UN lists" },
        { key: "Criminal check", value: "No cases filed" },
        { key: "GST/ITR variance", value: "2.9% (within 5% threshold)" },
        { key: "MCA status", value: "Active" },
      ],
    },
  },
  {
    title: "No direct findings on directors",
    severity: "positive",
    against: "director",
    againstLabel: "Sunil P. Kadam · Kavita S. Kadam",
    source: "IDfy / CrimeCheck",
    sourceDetails: {
      label: "CrimeCheck · IDfy · Mar 2026",
      fields: [
        { key: "PEP — Sunil P. Kadam", value: "Clear" },
        { key: "PEP — Kavita S. Kadam", value: "Clear" },
        { key: "Criminal — both directors", value: "No cases filed" },
        { key: "AML screening", value: "Clear" },
      ],
    },
  },
],
```

- [ ] **Step 2: Replace insightCards in ushodaya-supermarkets.ts**

```typescript
insightCards: [
  {
    title: "₹100 Cr — flagship property pledged for Vijetha's loan",
    subtext: "Vijetha default directly jeopardizes Ushodaya's A.S. Rao Nagar asset.",
    severity: "critical",
    against: "network",
    againstLabel: "Vijetha Supermarkets · common promoter",
    source: "MCA / Banking",
    sourceDetails: {
      label: "MCA Filing · Banking · Jul 2025",
      fields: [
        { key: "Instrument", value: "MODT (Mortgage by Deposit of Title Deeds)" },
        { key: "Property", value: "Plot 24, A.S. Rao Nagar, Hyderabad — 2,400 sq ft" },
        { key: "Lender", value: "Axis Finance Ltd" },
        { key: "Facility", value: "CC of ₹100 Cr to Vijetha Supermarkets Pvt Ltd" },
        { key: "Registration date", value: "2025-07-14" },
      ],
    },
  },
  {
    title: "Mannava Yugandhar controls both Ushodaya and Vijetha",
    subtext: "Cross-guarantees create systemic risk if Vijetha faces distress.",
    severity: "critical",
    against: "director",
    againstLabel: "Mannava Yugandhar · Promoter",
    source: "IDfy Netscan",
    sourceDetails: {
      label: "IDfy Netscan Report · Feb 2026",
      fields: [
        { key: "DIN", value: "00312991" },
        { key: "Entities controlled", value: "Ushodaya, Vijetha, Ushodaya Infra Projects" },
        { key: "Personal guarantee", value: "Given to Axis Finance on Vijetha CC facility" },
        { key: "Cross-lending confirmed", value: "Pending verification" },
      ],
    },
  },
  {
    title: "Related party loans to Ushodaya Infra Projects — ₹4.2 Cr",
    severity: "warning",
    against: "company",
    source: "MCA",
    sourceDetails: {
      label: "MCA Annual Return · FY 2024-25",
      fields: [
        { key: "Counterparty", value: "Ushodaya Infra Projects Pvt Ltd" },
        { key: "Amount", value: "₹4.2 Cr (as of Mar 2025)" },
        { key: "Nature", value: "Inter-company loan" },
        { key: "MCA filing status", value: "Overdue by 47 days" },
        { key: "Director overlap", value: "Mannava Yugandhar, Mannava Santhi" },
      ],
    },
  },
],
```

- [ ] **Step 3: Verify clean build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in` with no errors.

---

### Task 4: Rewrite `FindingRow` component in NetworkGraphCanvas.tsx

**Files:**
- Modify: `src/app/components/case-detail/NetworkGraphCanvas.tsx`

This replaces the existing `InsightCard` component and `SEV` constant entirely.

- [ ] **Step 1: Replace SEV constant and InsightCard with FindingRow**

Find the block starting with `/* ─── InsightCard */` (around line 338) through the closing `};` of `InsightCard`. Replace the entire block with:

```tsx
/* ─────────────────────────────────────────────────────────────────────────────
   FindingRow — collapsed by default, click to expand
───────────────────────────────────────────────────────────────────────────── */
const FINDING_SEV = {
  critical: { dot: "#DC2626", dotBg: "#FEF2F2", textColor: "#DC2626", labelBg: "#FEF2F2", labelText: "#B91C1C" },
  warning:  { dot: "#D97706", dotBg: "#FFFBEB", textColor: "#B45309", labelBg: "#FFFBEB", labelText: "#92400E" },
  info:     { dot: "#2563EB", dotBg: "#EFF6FF", textColor: "#2563EB", labelBg: "#EFF6FF", labelText: "#1D4ED8" },
  positive: { dot: "#16A34A", dotBg: "#F0FDF4", textColor: "#16A34A", labelBg: "#F0FDF4", labelText: "#166534" },
} as const;

const FindingRow: React.FC<{
  card: NetworkInsightCard;
  isExpanded: boolean;
  onToggle: () => void;
  onSourceClick: (card: NetworkInsightCard, pos: SourcePos) => void;
}> = ({ card, isExpanded, onToggle, onSourceClick }) => {
  const s = FINDING_SEV[card.severity];

  return (
    <div
      onClick={onToggle}
      style={{
        borderRadius: 8,
        backgroundColor: isExpanded ? "var(--surface-card)" : "transparent",
        border: isExpanded ? "1px solid var(--border-subtle)" : "1px solid transparent",
        transition: "background-color 0.15s, border-color 0.15s",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Collapsed row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 8px" }}>
        {/* Severity dot */}
        <div style={{
          width: 7, height: 7, borderRadius: 999, flexShrink: 0,
          backgroundColor: s.dot, marginTop: 4,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title — problem statement */}
          <div style={{
            fontSize: "11px", fontWeight: 600,
            color: "var(--text-heading)", lineHeight: 1.35,
          }}>
            {card.title}
          </div>

          {/* Against label — only for director / network */}
          {card.againstLabel && (
            <div style={{
              marginTop: 2,
              fontSize: "9.5px", fontWeight: 500,
              color: s.textColor, opacity: 0.85,
            }}>
              {card.againstLabel}
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <span style={{
          fontSize: "9px", color: "var(--text-muted-themed)",
          marginTop: 3, flexShrink: 0,
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.15s",
          display: "inline-block",
        }}>
          ▾
        </span>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div
          style={{ padding: "0 8px 10px 23px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtext */}
          {card.subtext && (
            <p style={{
              fontSize: "10px", color: "var(--text-muted-themed)",
              lineHeight: 1.6, margin: "0 0 8px",
            }}>
              {card.subtext}
            </p>
          )}

          {/* Source chip */}
          <div
            onClick={(e) => {
              if (!card.sourceDetails) return;
              e.stopPropagation();
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              onSourceClick(card, { x: r.left, y: r.bottom });
            }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              cursor: card.sourceDetails ? "pointer" : "default",
              backgroundColor: s.labelBg,
              border: `1px solid ${s.dot}30`,
              borderRadius: 5, padding: "3px 8px",
            }}
          >
            <span style={{ fontSize: "9px", color: s.dot }}>⊗</span>
            <span style={{ fontSize: "9px", fontWeight: 600, color: s.labelText }}>
              {card.source}
            </span>
            {card.sourceDetails && (
              <span style={{ fontSize: "9px", color: s.dot, opacity: 0.7 }}>↗</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: TS error on `InsightCard` still being referenced in the panel JSX — fix that in Task 5.

---

### Task 5: Update the panel JSX and add sort logic

**Files:**
- Modify: `src/app/components/case-detail/NetworkGraphCanvas.tsx`

- [ ] **Step 1: Add expanded row state to NetworkGraphCanvas**

Find `const [activeSource, setActiveSource]` line and add one more state line immediately after it:

```tsx
const [expandedFindingIdx, setExpandedFindingIdx] = useState<number | null>(null);
```

- [ ] **Step 2: Add sorted findings computation**

Find the block starting with `// ── Pre-compute network flags` (around line ~297). Add these lines immediately after the existing `networkFlags` / `cc` block:

```tsx
// ── Sort insight cards: company first, directors second, network last ─────
const AGAINST_ORDER: Record<string, number> = { company: 0, director: 1, network: 2 };
const sortedFindings = ni.insightCards
  ? [...ni.insightCards].sort(
      (a, b) => (AGAINST_ORDER[a.against] ?? 3) - (AGAINST_ORDER[b.against] ?? 3)
    )
  : [];
```

- [ ] **Step 3: Replace the panel cards section**

Find the `{/* Cards feed */}` div inside the right panel (the section with `ni.insightCards && ni.insightCards.length > 0 ?`). Replace the entire cards feed `<div>` with:

```tsx
{/* Findings feed */}
<div style={{ flex: 1, overflowY: "auto", padding: "6px 8px 4px", display: "flex", flexDirection: "column", gap: 1 }}>
  {sortedFindings.length > 0 ? (
    sortedFindings.map((card, idx) => (
      <FindingRow
        key={idx}
        card={card}
        isExpanded={expandedFindingIdx === idx}
        onToggle={() => setExpandedFindingIdx(expandedFindingIdx === idx ? null : idx)}
        onSourceClick={(c, pos) => setActiveSource({ card: c, pos })}
      />
    ))
  ) : networkFlags.length > 0 ? (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
      {networkFlags.map((flag, idx) => (
        <li key={idx} style={{
          display: "flex", gap: 7, padding: "6px 8px",
          backgroundColor: "rgba(226,51,24,0.04)",
          borderLeft: "2px solid #E23318", borderRadius: "0 4px 4px 0",
        }}>
          <span style={{ fontSize: "9px", flexShrink: 0, color: "#E23318", marginTop: 1 }}>!</span>
          <span style={{ fontSize: "9.5px", color: "var(--text-body)", lineHeight: 1.55 }}>{flag}</span>
        </li>
      ))}
    </ul>
  ) : null}
</div>
```

- [ ] **Step 4: Verify clean build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in` with no errors.

---

### Task 6: Redesign the SourceTooltip to show structured fields

**Files:**
- Modify: `src/app/components/case-detail/NetworkGraphCanvas.tsx`

- [ ] **Step 1: Replace SourceTooltip component**

Find the `SourceTooltip` component (starts around line 275, `const SourceTooltip`). Replace it entirely with:

```tsx
const SourceTooltip: React.FC<{
  card: NetworkInsightCard;
  pos: SourcePos;
  onClose: () => void;
}> = ({ card, pos, onClose }) => {
  const sd = card.sourceDetails!;
  const s = FINDING_SEV[card.severity];

  const left = Math.min(pos.x, (typeof window !== "undefined" ? window.innerWidth : 800) - 256);
  const top  = Math.min(pos.y + 6, (typeof window !== "undefined" ? window.innerHeight : 600) - 220);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 9998 }} onClick={onClose} />
      <div style={{
        position: "fixed", left, top, width: 248, zIndex: 9999,
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "7px 10px 6px",
          backgroundColor: s.labelBg,
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: "9px", color: s.dot }}>⊗</span>
          <span style={{ fontSize: "9px", fontWeight: 700, color: s.labelText, flex: 1 }}>{sd.label}</span>
        </div>

        {/* Fields */}
        <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
          {sd.fields.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{
                fontSize: "8.5px", fontWeight: 600, color: "var(--text-muted-themed)",
                minWidth: 80, flexShrink: 0, paddingTop: 1,
                textTransform: "uppercase" as const, letterSpacing: "0.04em",
              }}>
                {f.key}
              </span>
              <span style={{
                fontSize: "10px", color: "var(--text-heading)", lineHeight: 1.45, fontWeight: 500,
              }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
```

**Note:** `FINDING_SEV` must be defined before `SourceTooltip` in the file. Move `SourceTooltip` to be after `FINDING_SEV` if needed — or move `FINDING_SEV` above both components.

- [ ] **Step 2: Move FINDING_SEV above SourceTooltip if needed**

Check line order in the file. `SourceTooltip` references `FINDING_SEV`. If `FINDING_SEV` is defined after `SourceTooltip`, cut it and paste it before `SourceTooltip`.

- [ ] **Step 3: Final build check**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in` — no errors.

---

### Task 7: Remove unused `useRef` import

**Files:**
- Modify: `src/app/components/case-detail/NetworkGraphCanvas.tsx`

- [ ] **Step 1: Clean up import**

Line 1 currently reads:
```tsx
import React, { useState, useEffect, useRef } from "react";
```

Change to:
```tsx
import React, { useState, useEffect } from "react";
```

- [ ] **Step 2: Final build**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in` with zero errors or warnings beyond the chunk size notice.

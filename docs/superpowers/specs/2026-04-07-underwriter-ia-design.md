# Underwriter IA — Design Spec
Date: 2026-04-07

---

## Overview

Restructure the OneRisk app to support the Underwriter persona with a clear, role-based information architecture. Credit Head flow is out of scope for this spec.

---

## Personas in Scope

### Underwriter Ops
Creates cases, reviews auto-generated CAM, and shares it with the Credit Head.

Two sub-flows:
- **New user** — has never created a case; sees onboarding home page first
- **Regular user** — has existing cases; lands directly on Workspace

---

## Sidebar Navigation

Three items, in order:
1. **Workspace** — primary nav item, routes to `/workspace`
2. **Alerts** — routes to `/alerts`
3. **Bulk Upload** — routes to `/bulk-upload`

"Home" nav item is removed. Workspace is the default landing for regular users.

---

## Routing Changes

### Keep
- `/workspace` (rename from `/my-cases`) — Workspace / Action Queue
- `/alerts` — Alerts page
- `/bulk-upload` — Bulk Upload
- `/new-case` — Create new case
- `/workspace/case/:caseId` — Case detail (consolidated, replaces all analysis routes)

### Remove
- `/home`
- `/case-management`
- `/flow2`
- `/terminal`
- `/analysis/case/:caseId`
- `/analysis-1/case/:caseId`
- `/analysis-2/case/:caseId`
- `/case/:caseId`
- `/cam/case/:caseId`
- `/workspace-final`

### New
- `/` → redirects based on user state: new user → `/home`, regular user → `/workspace`
- `/home` — new user landing page (configured checks + use cases)

---

## New User Landing Page (`/home`)

Shown only when the user has no cases yet.

Content:
- Configured checks and use cases available to the user
- Prominent CTA: "Create your first case"
- After case is created → redirect to `/workspace`

---

## Workspace (`/workspace`)

Default landing for regular users (users with existing cases).

### Header
- Breadcrumb: `Workspace > Action Queue`
- Page title: `Action Queue`
- Right: `+ New Case` button (primary)

### Case List
- Flat table, no tabs
- Columns: Company, Case ID, Industry, Created, Status, Risk & AI Suggestion
- Filters: Search (by name/ID/industry), Risk Grade, Review Type
- Clicking a row navigates to `/workspace/case/:caseId`

### Statuses
- In Progress
- Completed
- Failed
- Sent to Credit Head ← new status added

---

## Case Detail (`/workspace/case/:caseId`)

Single page with 5 tabs. Breadcrumb: `Workspace > Action Queue > [Company Name]`.

### Tab 1 — Overview

Always present sections:
1. **Network Contagion Map** — entity relationship graph with risk levels
   - Not shown for sole proprietors
   - AI Insights panel alongside (litigation, AML, PEP flags)
2. **Financial Health** — only priority 4 & 5 financial parameters shown
   - Each metric: value, source label (MCA/Banking/GST/ITR), AI commentary
   - If problematic findings in compliance → compliance section moves to top

Conditional section (shown only if documents uploaded AND package supports it):
3. **Risk Triangulation / Data Source Reconciliation** — cross-source data comparison

### Tab 2 — Financials
Full financial parameter list (all priorities 1–5) with sources and AI commentary.

### Tab 3 — Litigations
Litigation details for the entity and its directors/promoters.

### Tab 4 — CAM Draft
Auto-generated Credit Appraisal Memo.
- **"Share with Credit Head"** button — shares CAM only, not the full report
- After sharing: case status updates to "Sent to Credit Head" in the Workspace

### Tab 5 — Documents
Uploaded documents (ITR, GST, bank statements, etc.).

---

## Data Model Changes

### CaseStatus — add new value
```ts
export type CaseStatus = "In Progress" | "Completed" | "Failed" | "Sent to Credit Head";
```

Remove: "New", "Approved", "Rejected", "On Hold", "Expert Review" — these belong to the Credit Head flow (out of scope for now).

---

## Out of Scope (this spec)

- Credit Head persona, sidebar, and flows
- Role-based auth / login switching between personas
- Actual API integration (all data remains mocked)
- Bulk Upload page changes
- Alerts page changes

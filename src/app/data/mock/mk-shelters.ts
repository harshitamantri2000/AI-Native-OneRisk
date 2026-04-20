import type { RichCaseEntry } from "./types";

/**
 * M.K. Shelters Private Limited
 * Source: IDfy Netscan Report (Real Estate, Mumbai)
 * CIN: U45200MH2005PTC156666
 * Risk: Low (entity) — Medium (network contagion from A.R. Amboli)
 */
export const mkShelters: RichCaseEntry = {
  id: "CASE-10235",
  name: "M.K. Shelters Private Limited",
  industry: "Real Estate",
  created: "2026-02-17",
  riskLevel: "Medium",
  status: "In Progress",
  source: "entity-dd",
  aiSuggestion: "Review Network",
  aiInsight: {
    summary:
      "Entity itself shows stable financials and no direct litigation, but carries elevated network risk due to common directorship with A.R. Amboli Developers — a high-risk entity with 5 active criminal cases.",
    topRisk: "Network contagion via common director (Mahafuz Khaan)",
    confidencePercent: 82,
    factors: [
      "Debt-to-Equity: 1.84 — within acceptable range",
      "No direct criminal cases on entity or directors",
      "Linked to A.R. Amboli Developers (High Risk) via Mahafuz Khaan",
      "Revenue declining 12% YoY — warrants monitoring",
    ],
    networkRisk: { level: "HIGH", label: "Common director with High Risk entity" },
  },
  detail: {
    cin: "U45200MH2005PTC156666",
    pan: "AAICM4821K",
    incorporationDate: "2005-03-22",
    registeredAddress:
      "Shop No. 4, Ground Floor, Mehta Arcade, S.V. Road, Malad (West), Mumbai – 400064, Maharashtra",
    industry: "Real Estate — Residential Construction",
    entityType: "Private Limited",
    authorizedCapital: 5000000,
    paidUpCapital: 3500000,
    promoterHolding: 100,

    // ── Network ──────────────────────────────────────────────────────────────
    networkNodes: [
      {
        id: "NE-MK-001",
        name: "A.R. Amboli Developers Pvt Ltd",
        riskLevel: "High",
        isContagionSource: true,
        commonDirectors: ["Mahafuz Khaan"],
        debtToEquity: 6.49,
        netProfit: -3200000,
        natureOfBusiness: "Real Estate",
        cin: "U70109MH2020PTC342547",
        incorporationDate: "2020-07-09",
        registeredAddress: "302, Highland Park, Andheri (W), Mumbai – 400058",
        relationship: "Common Director",
        directors: ["Mahafuz Khaan", "Sunil Parshuram Kadam", "Bilal A. Shaikh"],
        aiSummary: "High risk — primary contagion source. 5 active criminal cases including IPC 467 (Forgery, Life Imprisonment). D/E 6.49, net loss ₹32L FY25, revenue down 30.7% YoY. Mahafuz Khaan named in criminal filings.",
      },
      {
        id: "NE-MK-002",
        name: "Mana Properties Pvt Ltd",
        riskLevel: "Low",
        isContagionSource: false,
        commonDirectors: ["Sunil Parshuram Kadam"],
        debtToEquity: 0.92,
        netProfit: 1850000,
        natureOfBusiness: "Real Estate",
        cin: "U45400MH2008PTC177425",
        incorporationDate: "2008-11-03",
        registeredAddress: "Plot 14, Sector 5, Kharghar, Navi Mumbai – 410210",
        relationship: "Common Director",
        directors: ["Sunil Parshuram Kadam", "Kavita Sunil Kadam"],
        aiSummary: "Low risk entity. D/E 0.92, net profit growing YoY, no litigation. Sunil Parshuram Kadam's directorship here is passive with no risk transfer to M.K. Shelters.",
      },
      {
        id: "NE-MK-003",
        name: "Empire Living Spaces Pvt Ltd",
        riskLevel: "Low",
        isContagionSource: false,
        commonDirectors: ["Mahafuz Khaan", "Sunil Parshuram Kadam"],
        debtToEquity: 1.12,
        netProfit: 2400000,
        natureOfBusiness: "Real Estate",
        cin: "U45203MH2011PTC217483",
        incorporationDate: "2011-05-17",
        registeredAddress: "401, Empire House, Goregaon (E), Mumbai – 400063",
        relationship: "Group Entity",
        directors: ["Mahafuz Khaan", "Sunil Parshuram Kadam", "Priya Shankar Nair"],
        aiSummary: "Low risk, strong financials. Revenue ₹78.4 Cr, D/E 1.12, ICR 4.92x. Both directors are common with M.K. Shelters. Second-degree exposure to A.R. Amboli via Mahafuz Khaan.",
      },
    ],
    networkInsights: {
      summary:
        "M.K. Shelters sits in a 4-entity real estate network sharing two common directors. A.R. Amboli Developers — connected via Mahafuz Khaan — carries 5 active criminal cases including IPC 467 (forgery of valuable security). Network contagion risk is HIGH.",
      litigationFlag:
        "A.R. Amboli Developers (linked via Mahafuz Khaan) has 5 pending criminal cases — forgery, cheating, and criminal conspiracy.",
      amlFlag: undefined,
      pepFlag: undefined,
      contagionRisk: "HIGH",
      contagionExplanation:
        "Mahafuz Khaan (DIN: 00420666) is a director in both M.K. Shelters and A.R. Amboli Developers. The latter has active IPC 467 and IPC 420 cases. Cross-entity financial flows and shared directorship elevate systemic risk.",
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
          title: "Mahafuz Khaan named as accused in criminal proceedings",
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
    },

    // ── Financial Parameters ──────────────────────────────────────────────────
    financialParameters: [
      // Priority 5 — Revenue & Profitability (surfaces in Overview)
      {
        id: "FP-MK-01",
        name: "Revenue (FY 2024-25)",
        value: 62500000,
        unit: "₹",
        source: "MCA",
        priority: 5,
        trend: "down",
        trendValue: -12.3,
        aiCommentary:
          "Revenue has declined 12.3% YoY. Consistent with broader slowdown in Mumbai residential launches post-RERA revision cycle.",
        alternateSources: [
          { source: "GST", value: 58300000, unit: "₹", deviationNote: "GST reports ₹58.3L — 6.7% lower than MCA. Within acceptable variance for real estate billing cycles." },
          { source: "Banking", value: 55100000, unit: "₹", deviationNote: "Bank credits ₹55.1L — 11.8% gap partially explained by prior-year advance collections." },
        ],
      },
      {
        id: "FP-MK-02",
        name: "EBITDA",
        value: 9750000,
        unit: "₹",
        source: "MCA",
        priority: 5,
        trend: "down",
        trendValue: -8.1,
        aiCommentary: "EBITDA margin at 15.6% — healthy for segment, though contracting from 17.1% last year.",
        alternateSources: [
          { source: "ITR", value: 10200000, unit: "₹", deviationNote: "ITR-implied EBITDA slightly higher at ₹1.02 Cr — timing of expense recognition." },
        ],
      },
      {
        id: "FP-MK-03",
        name: "Net Profit",
        value: 3200000,
        unit: "₹",
        source: "ITR",
        priority: 5,
        trend: "down",
        trendValue: -22.4,
        aiCommentary: "Net profit compression driven by higher interest cost on project loans. Not yet in loss.",
        benchmarkValue: 5800000,
        benchmarkLabel: "Industry median",
      },
      // Priority 4 — Quality & Coverage Checks (surfaces in Overview)
      {
        id: "FP-MK-10",
        name: "Interest Coverage Ratio",
        value: 1.62,
        source: "MCA",
        priority: 4,
        trend: "down",
        trendValue: -14.7,
        aiCommentary:
          "Interest coverage at 1.62x — low but serviceable. A further 15% EBITDA compression would breach 1.4x, a common covenant threshold.",
        flagged: true,
      },
      {
        id: "FP-MK-11",
        name: "Monthly Burn Rate",
        value: 1850000,
        unit: "₹/mo",
        source: "Banking",
        priority: 4,
        trend: "up",
        trendValue: 8.4,
        aiCommentary: "Burn rate elevated due to ongoing site-level payroll and material costs. ~4.6 months cash runway at current levels.",
        flagged: true,
      },
      {
        id: "FP-MK-12",
        name: "GST Verified Turnover",
        value: 58300000,
        unit: "₹",
        source: "GST",
        priority: 4,
        aiCommentary:
          "GST-reported turnover ₹58.3L vs MCA-reported revenue ₹62.5L — gap of ₹4.2L (~6.7%). Within acceptable variance for real estate billing cycles.",
        benchmarkValue: 62500000,
        benchmarkLabel: "MCA reported",
        flagged: false,
      },
      {
        id: "FP-MK-13",
        name: "Banking Turnover",
        value: 55100000,
        unit: "₹",
        source: "Banking",
        priority: 4,
        aiCommentary:
          "Bank credits ₹55.1L — 11.8% lower than MCA revenue. Difference partially explained by advance collections recognised in prior year.",
        flagged: false,
      },
      {
        id: "FP-MK-14",
        name: "ITR Declared Income",
        value: 59800000,
        unit: "₹",
        source: "ITR",
        priority: 4,
        aiCommentary: "ITR income broadly aligns with GST and banking data. No significant under-declaration risk.",
        flagged: false,
      },
      // Priority 3 — Leverage & Working Capital
      {
        id: "FP-MK-04",
        name: "Debt-to-Equity Ratio",
        value: 1.84,
        source: "MCA",
        priority: 3,
        trend: "up",
        trendValue: 18.7,
        aiCommentary:
          "D/E at 1.84 — within tolerable range for real estate construction firms but rising YoY. Industry median is 1.85. Monitor closely.",
        benchmarkValue: 1.85,
        benchmarkLabel: "Industry median D/E",
        flagged: false,
      },
      {
        id: "FP-MK-05",
        name: "Total Debt",
        value: 64400000,
        unit: "₹",
        source: "Banking",
        priority: 3,
        trend: "up",
        trendValue: 9.2,
        aiCommentary: "Borrowings increased 9.2% — project-linked debt for two ongoing residential towers.",
      },
      {
        id: "FP-MK-06",
        name: "Net Worth",
        value: 35000000,
        unit: "₹",
        source: "MCA",
        priority: 3,
        trend: "stable",
        aiCommentary: "Net worth stable. No capital erosion detected.",
      },
      {
        id: "FP-MK-07",
        name: "Current Ratio",
        value: 1.18,
        source: "MCA",
        priority: 3,
        trend: "down",
        trendValue: -6.3,
        aiCommentary:
          "Current ratio at 1.18 — above 1.0 but tightening. Short-term obligations are covered but headroom is shrinking.",
        benchmarkValue: 1.5,
        benchmarkLabel: "Recommended minimum",
        flagged: false,
      },
      {
        id: "FP-MK-08",
        name: "Operating Cash Flow",
        value: 4200000,
        unit: "₹",
        source: "Banking",
        priority: 3,
        trend: "down",
        trendValue: -31.4,
        aiCommentary: "Cash flow from operations fell sharply — construction delays on two projects cited in MCA filings.",
      },
      // Priority 2 — Banking & Cash Indicators
      {
        id: "FP-MK-09",
        name: "Cash & Equivalents",
        value: 8600000,
        unit: "₹",
        source: "Banking",
        priority: 2,
        trend: "stable",
      },
    ],

    yearlyFinancials: [
      { year: 2022, revenue: 71200000, ebitda: 12100000, netProfit: 5400000, totalDebt: 48000000, cashAndEquivalents: 13200000 },
      { year: 2023, revenue: 68900000, ebitda: 11800000, netProfit: 4800000, totalDebt: 54500000, cashAndEquivalents: 11500000 },
      { year: 2024, revenue: 71300000, ebitda: 10600000, netProfit: 4100000, totalDebt: 58900000, cashAndEquivalents: 9800000 },
      { year: 2025, revenue: 62500000, ebitda: 9750000, netProfit: 3200000, totalDebt: 64400000, cashAndEquivalents: 8600000 },
    ],

    // ── Litigations ───────────────────────────────────────────────────────────
    entityLitigations: [],

    directorLitigations: [
      {
        name: "Mahafuz Khaan",
        din: "00420666",
        designation: "Managing Director",
        appointmentDate: "2005-03-22",
        litigations: [],
      },
      {
        name: "Sunil Parshuram Kadam",
        din: "08533072",
        designation: "Director",
        appointmentDate: "2012-08-14",
        litigations: [],
      },
    ],

    // ── Compliance ────────────────────────────────────────────────────────────
    complianceChecks: [
      {
        category: "Entity",
        label: "MCA Active Status",
        status: "Clear",
        source: "MCA",
        checkedOn: "2026-02-17",
      },
      {
        category: "Entity",
        label: "GST Registration",
        status: "Clear",
        finding: "Active GSTIN: 27AAICM4821K1ZJ",
        source: "GST",
        checkedOn: "2026-02-17",
      },
      {
        category: "Entity",
        label: "CIBIL / Credit Bureau",
        status: "Caution",
        finding: "One deferred payment reported in Q3 FY24 — subsequently regularised.",
        source: "IDfy",
        checkedOn: "2026-02-17",
      },
      {
        category: "AML",
        label: "AML Screening (Entity)",
        status: "Clear",
        source: "IDfy",
        checkedOn: "2026-02-17",
      },
      {
        category: "AML",
        label: "AML Screening — Mahafuz Khaan",
        status: "Clear",
        source: "IDfy",
        checkedOn: "2026-02-17",
      },
      {
        category: "PEP",
        label: "PEP Check — Mahafuz Khaan",
        status: "Clear",
        source: "IDfy",
        checkedOn: "2026-02-17",
      },
      {
        category: "PEP",
        label: "PEP Check — Sunil P. Kadam",
        status: "Clear",
        source: "IDfy",
        checkedOn: "2026-02-17",
      },
      {
        category: "Litigation",
        label: "Criminal Check (Entity)",
        status: "Clear",
        source: "CrimeCheck",
        checkedOn: "2026-02-17",
      },
      {
        category: "Litigation",
        label: "Criminal Check — Mahafuz Khaan",
        status: "Clear",
        source: "CrimeCheck",
        checkedOn: "2026-02-17",
      },
      {
        category: "Network",
        label: "Network Contagion — A.R. Amboli Developers",
        status: "Flagged",
        finding:
          "Mahafuz Khaan (common director) is a director in A.R. Amboli Developers Pvt Ltd which has 5 active criminal cases including IPC 467 (forgery).",
        source: "IDfy",
        checkedOn: "2026-02-17",
      },
    ],

    // ── CAM Draft ─────────────────────────────────────────────────────────────
    camDraft: {
      generatedOn: "2026-02-18",
      borrowerName: "M.K. Shelters Private Limited",
      loanAmount: 50000000,
      purpose: "Working capital for ongoing residential project — MK Heights, Malad (West)",
      riskRating: "C",
      recommendation: "Conditional Approve",
      conditions: [
        "Obtain personal guarantee from Mahafuz Khaan (MD)",
        "Monitor A.R. Amboli Developers litigation — escalate if conviction",
        "Quarterly cash flow certification required for first 24 months",
        "Maximum disbursement: ₹3 Cr per tranche, linked to construction milestones",
      ],
      sections: [
        {
          title: "Borrower Overview",
          content:
            "M.K. Shelters Private Limited (CIN: U45200MH2005PTC156666) is a Mumbai-based residential real estate developer incorporated in March 2005. The company is 100% promoter-held with two directors — Mahafuz Khaan (MD) and Sunil Parshuram Kadam. It has been operating for 20 years with a track record of small-to-mid residential projects in the western suburbs of Mumbai.",
        },
        {
          title: "Financial Assessment",
          content:
            "Revenue has declined 12.3% YoY to ₹6.25 Cr (FY25), with EBITDA margin at 15.6% — healthy but compressing. D/E ratio stands at 1.84x — at the industry median. The concern is rising debt (+9.2% YoY) against declining revenue, squeezing interest coverage to 1.62x. Cash flow from operations fell 31.4% due to construction delays. Cross-source reconciliation shows minor variance (GST vs MCA: 6.7%) within acceptable range.",
        },
        {
          title: "Risk Assessment",
          content:
            "Primary risk is network contagion. Mahafuz Khaan (MD) is also a director in A.R. Amboli Developers Pvt Ltd, which has 5 active criminal cases including forgery of valuable security (IPC 467). While M.K. Shelters has no direct litigation, the shared directorship creates reputational and legal exposure. Secondary risks: rising leverage, declining cash flow, single-geography concentration in Mumbai residential segment.",
        },
        {
          title: "Recommendation",
          content:
            "Conditional Approval recommended. Entity fundamentals are adequate for the loan size requested. However, network risk from A.R. Amboli directorship linkage warrants ongoing monitoring and structural safeguards (personal guarantee, milestone-linked disbursement). If Mahafuz Khaan is convicted in the A.R. Amboli matter, immediate recall event should be triggered.",
        },
      ],
      sharedWithCreditHead: false,
    },

    // ── Documents ─────────────────────────────────────────────────────────────
    documents: [
      { id: "DOC-MK-01", name: "ITR FY 2024-25", type: "ITR", uploadDate: "2026-02-10", verified: true, verifiedBy: "ITR" },
      { id: "DOC-MK-02", name: "ITR FY 2023-24", type: "ITR", uploadDate: "2026-02-10", verified: true, verifiedBy: "ITR" },
      { id: "DOC-MK-03", name: "GST Returns (Apr–Dec 2025)", type: "GST", uploadDate: "2026-02-10", verified: true, verifiedBy: "GST" },
      { id: "DOC-MK-04", name: "Bank Statement — HDFC CA (Jan–Dec 2025)", type: "Bank Statement", uploadDate: "2026-02-11", verified: true, verifiedBy: "Banking" },
      { id: "DOC-MK-05", name: "MCA Extract — Certificate of Incorporation", type: "MCA Extract", uploadDate: "2026-02-10", verified: true, verifiedBy: "MCA" },
      { id: "DOC-MK-06", name: "KYC — Mahafuz Khaan (Aadhaar + PAN)", type: "KYC", uploadDate: "2026-02-10", verified: true },
      { id: "DOC-MK-07", name: "KYC — Sunil Parshuram Kadam (Aadhaar + PAN)", type: "KYC", uploadDate: "2026-02-10", verified: true },
    ],

    // ── Risk Triangulation ────────────────────────────────────────────────────
    sourceReconciliation: [
      {
        metric: "Annual Revenue / Turnover",
        mcaValue: 62500000,
        gstValue: 58300000,
        itrValue: 59800000,
        bankingValue: 55100000,
        discrepancy: false,
        discrepancyNote: "Variance within 11.8% — acceptable for real estate billing patterns.",
      },
      {
        metric: "Net Profit",
        mcaValue: 3200000,
        itrValue: 2950000,
        discrepancy: false,
        discrepancyNote: "Minor ITR vs MCA variance (₹2.5L) within normal adjustment range.",
      },
      {
        metric: "Total Borrowings",
        mcaValue: 64400000,
        bankingValue: 67200000,
        discrepancy: true,
        discrepancyNote:
          "Banking data shows ₹2.8L higher debt than MCA reported — possibly undisclosed credit facility. Requires clarification.",
      },
    ],
  },
};

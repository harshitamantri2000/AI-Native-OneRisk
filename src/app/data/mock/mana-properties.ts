import type { RichCaseEntry } from "./types";

/**
 * Mana Properties Private Limited
 * Source: IDfy Netscan Report
 * CIN: U45400MH2008PTC177425
 * Risk: LOW — clean entity, connected to M.K. Shelters via Sunil Parshuram Kadam
 */
export const manaProperties: RichCaseEntry = {
  id: "CASE-10242",
  name: "Mana Properties Private Limited",
  industry: "Real Estate",
  created: "2026-03-01",
  riskLevel: "Low",
  status: "Completed",
  source: "entity-dd",
  aiSuggestion: "Approve",
  aiInsight: {
    summary:
      "Clean entity with healthy financials, no litigation, and no adverse compliance findings. Moderate network exposure via Sunil Parshuram Kadam (also director in M.K. Shelters), but that entity carries no direct risk.",
    topRisk: "Peripheral network link to M.K. Shelters (medium-risk entity)",
    confidencePercent: 91,
    factors: [
      "D/E Ratio: 0.92 — well below industry median",
      "No litigation on entity or directors",
      "Clean AML and PEP checks",
      "Revenue stable at ₹4.8 Cr YoY",
    ],
    networkRisk: { level: "LOW", label: "No direct risk in network connections" },
  },
  detail: {
    cin: "U45400MH2008PTC177425",
    pan: "AAFCM2341P",
    incorporationDate: "2008-11-03",
    registeredAddress:
      "Plot No. 14, Sector 5, Kharghar, Navi Mumbai – 410210, Maharashtra",
    industry: "Real Estate — Residential Plotted Development",
    entityType: "Private Limited",
    authorizedCapital: 3000000,
    paidUpCapital: 2000000,
    promoterHolding: 100,

    networkNodes: [
      {
        id: "NE-MP-001",
        name: "M.K. Shelters Private Limited",
        riskLevel: "Medium",
        isContagionSource: false,
        commonDirectors: ["Sunil Parshuram Kadam"],
        debtToEquity: 1.84,
        netProfit: 3200000,
        natureOfBusiness: "Real Estate",
        cin: "U45200MH2005PTC156666",
        incorporationDate: "2005-03-22",
        registeredAddress: "Shop 4, Mehta Arcade, S.V. Road, Malad (W), Mumbai – 400064",
        relationship: "Common Director",
        directors: ["Mahafuz Khaan", "Sunil Parshuram Kadam", "Rekha M. Khaan"],
        aiSummary: "Medium risk. D/E 1.84, ICR 1.62x — borderline debt coverage. The indirect risk here is Mahafuz Khaan's criminal association with A.R. Amboli, but this is second-degree exposure for Mana Properties.",
      },
      {
        id: "NE-MP-002",
        name: "Empire Living Spaces Pvt Ltd",
        riskLevel: "Low",
        isContagionSource: false,
        commonDirectors: ["Sunil Parshuram Kadam"],
        debtToEquity: 1.12,
        netProfit: 2400000,
        natureOfBusiness: "Real Estate",
        cin: "U45203MH2011PTC217483",
        incorporationDate: "2011-05-17",
        registeredAddress: "401, Empire House, Goregaon (E), Mumbai – 400063",
        relationship: "Common Director",
        directors: ["Mahafuz Khaan", "Sunil Parshuram Kadam", "Priya Shankar Nair"],
        aiSummary: "Low risk with strong financials. Revenue ₹78.4 Cr, D/E 1.12. Shared director Sunil Parshuram Kadam has no adverse compliance flags. Connection is benign.",
      },
    ],
    networkInsights: {
      summary:
        "Mana Properties is connected to two other real estate entities via Sunil Parshuram Kadam. Both M.K. Shelters and Empire Living Spaces are low-to-medium risk. No high-risk contagion source in immediate network.",
      contagionRisk: "LOW",
      contagionExplanation:
        "Sunil Parshuram Kadam's cross-entity directorships are in entities with clean compliance records. No criminal or AML exposure.",
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
    },

    financialParameters: [
      // Priority 5 — Revenue & Profitability (surfaces in Overview)
      {
        id: "FP-MP-01",
        name: "Revenue (FY 2024-25)",
        value: 48200000,
        unit: "₹",
        source: "MCA",
        priority: 5,
        trend: "stable",
        trendValue: 2.1,
        aiCommentary: "Stable revenue with modest 2.1% YoY growth. Consistent with Navi Mumbai plotted development market.",
        alternateSources: [
          { source: "GST", value: 46800000, unit: "₹", deviationNote: "GST ₹4.68 Cr — 2.9% below MCA. Well within acceptable variance." },
          { source: "Banking", value: 44900000, unit: "₹", deviationNote: "Bank credits ₹4.49 Cr — 6.8% gap; normal for advance collection real estate model." },
        ],
      },
      {
        id: "FP-MP-02",
        name: "EBITDA",
        value: 7950000,
        unit: "₹",
        source: "MCA",
        priority: 5,
        trend: "up",
        trendValue: 4.8,
        aiCommentary: "EBITDA margin at 16.5% — healthy. Slight improvement from 15.8% last year.",
        alternateSources: [
          { source: "ITR", value: 8200000, unit: "₹", deviationNote: "ITR-implied EBITDA ₹82L — minor timing difference, no concern." },
        ],
      },
      {
        id: "FP-MP-03",
        name: "Net Profit",
        value: 4100000,
        unit: "₹",
        source: "ITR",
        priority: 5,
        trend: "up",
        trendValue: 7.9,
        aiCommentary: "Net profit growing steadily — positive trajectory maintained for 3 consecutive years.",
        benchmarkValue: 5800000,
        benchmarkLabel: "Industry median",
      },
      // Priority 4 — Quality & Coverage Checks (surfaces in Overview)
      {
        id: "FP-MP-10",
        name: "Interest Coverage Ratio",
        value: 3.84,
        source: "MCA",
        priority: 4,
        trend: "up",
        trendValue: 6.4,
        aiCommentary: "Interest coverage at 3.84x — comfortable. No debt servicing risk.",
      },
      {
        id: "FP-MP-11",
        name: "Monthly Burn Rate",
        value: 1870000,
        unit: "₹/mo",
        source: "Banking",
        priority: 4,
        trend: "stable",
        aiCommentary: "Burn rate stable. Operating costs well-managed relative to revenue.",
      },
      {
        id: "FP-MP-12",
        name: "GST Verified Turnover",
        value: 46800000,
        unit: "₹",
        source: "GST",
        priority: 4,
        aiCommentary: "GST ₹4.68 Cr vs MCA ₹4.82 Cr — gap of 2.9%. Well within acceptable variance.",
        benchmarkValue: 48200000,
        benchmarkLabel: "MCA reported",
        flagged: false,
      },
      {
        id: "FP-MP-13",
        name: "Banking Turnover",
        value: 44900000,
        unit: "₹",
        source: "Banking",
        priority: 4,
        aiCommentary: "Bank credits ₹4.49 Cr — 6.8% below MCA. Normal for advance collection real estate model.",
        flagged: false,
      },
      {
        id: "FP-MP-14",
        name: "ITR Declared Income",
        value: 47100000,
        unit: "₹",
        source: "ITR",
        priority: 4,
        aiCommentary: "ITR aligns closely with GST and banking data. No under-declaration risk.",
        flagged: false,
      },
      // Priority 3 — Leverage & Working Capital
      {
        id: "FP-MP-04",
        name: "Debt-to-Equity Ratio",
        value: 0.92,
        source: "MCA",
        priority: 3,
        trend: "down",
        trendValue: -8.9,
        aiCommentary:
          "D/E at 0.92 — well below industry median of 1.85. Conservative leverage profile. Debt being actively reduced.",
        benchmarkValue: 1.85,
        benchmarkLabel: "Industry median",
        flagged: false,
      },
      {
        id: "FP-MP-05",
        name: "Total Debt",
        value: 18400000,
        unit: "₹",
        source: "Banking",
        priority: 3,
        trend: "down",
        trendValue: -6.1,
        aiCommentary: "Debt reducing YoY — indicates ability to service and retire borrowings.",
      },
      {
        id: "FP-MP-06",
        name: "Net Worth",
        value: 20000000,
        unit: "₹",
        source: "MCA",
        priority: 3,
        trend: "up",
        trendValue: 8.2,
        aiCommentary: "Net worth growing — no capital erosion.",
      },
      {
        id: "FP-MP-07",
        name: "Current Ratio",
        value: 1.72,
        source: "MCA",
        priority: 3,
        trend: "stable",
        aiCommentary: "Current ratio at 1.72 — adequate liquidity cushion. Comfortably above recommended 1.5.",
        benchmarkValue: 1.5,
        benchmarkLabel: "Recommended minimum",
      },
      {
        id: "FP-MP-08",
        name: "Operating Cash Flow",
        value: 6800000,
        unit: "₹",
        source: "Banking",
        priority: 3,
        trend: "up",
        trendValue: 12.3,
        aiCommentary: "Positive and growing operating cash flow. Healthy sign for ongoing operations.",
      },
      // Priority 2 — Banking & Cash Indicators
      {
        id: "FP-MP-09",
        name: "Cash & Equivalents",
        value: 14200000,
        unit: "₹",
        source: "Banking",
        priority: 2,
        trend: "up",
        trendValue: 9.2,
        aiCommentary: "Cash reserves growing — ~7.6 months runway at current burn rate.",
      },
    ],

    yearlyFinancials: [
      { year: 2022, revenue: 42100000, ebitda: 6400000, netProfit: 3200000, totalDebt: 22500000, cashAndEquivalents: 10200000 },
      { year: 2023, revenue: 44800000, ebitda: 7100000, netProfit: 3600000, totalDebt: 21000000, cashAndEquivalents: 11800000 },
      { year: 2024, revenue: 47200000, ebitda: 7580000, netProfit: 3800000, totalDebt: 19600000, cashAndEquivalents: 13000000 },
      { year: 2025, revenue: 48200000, ebitda: 7950000, netProfit: 4100000, totalDebt: 18400000, cashAndEquivalents: 14200000 },
    ],

    entityLitigations: [],

    directorLitigations: [
      {
        name: "Sunil Parshuram Kadam",
        din: "08533072",
        designation: "Managing Director",
        appointmentDate: "2008-11-03",
        litigations: [],
      },
      {
        name: "Kavita Sunil Kadam",
        din: "09122345",
        designation: "Director",
        appointmentDate: "2008-11-03",
        litigations: [],
      },
    ],

    complianceChecks: [
      { category: "Entity", label: "MCA Active Status", status: "Clear", source: "MCA", checkedOn: "2026-03-01" },
      { category: "Entity", label: "GST Registration", status: "Clear", finding: "Active GSTIN: 27AAFCM2341P1ZA", source: "GST", checkedOn: "2026-03-01" },
      { category: "Entity", label: "CIBIL / Credit Bureau", status: "Clear", source: "IDfy", checkedOn: "2026-03-01" },
      { category: "AML", label: "AML Screening (Entity)", status: "Clear", source: "IDfy", checkedOn: "2026-03-01" },
      { category: "AML", label: "AML Screening — Sunil P. Kadam", status: "Clear", source: "IDfy", checkedOn: "2026-03-01" },
      { category: "PEP", label: "PEP Check — Sunil P. Kadam", status: "Clear", source: "IDfy", checkedOn: "2026-03-01" },
      { category: "PEP", label: "PEP Check — Kavita S. Kadam", status: "Clear", source: "IDfy", checkedOn: "2026-03-01" },
      { category: "Litigation", label: "Criminal Check (Entity)", status: "Clear", source: "CrimeCheck", checkedOn: "2026-03-01" },
      { category: "Litigation", label: "Criminal Check — Sunil P. Kadam", status: "Clear", source: "CrimeCheck", checkedOn: "2026-03-01" },
    ],

    camDraft: {
      generatedOn: "2026-03-02",
      borrowerName: "Mana Properties Private Limited",
      loanAmount: 20000000,
      purpose: "Project finance for Phase 2 plotted development — Mana Gardens, Kharghar",
      riskRating: "A",
      recommendation: "Approve",
      sections: [
        {
          title: "Borrower Overview",
          content:
            "Mana Properties Private Limited (CIN: U45400MH2008PTC177425) is a Navi Mumbai-based residential plotted developer with 17 years of operation. 100% promoter-held by the Kadam family. Clean track record with no litigation history.",
        },
        {
          title: "Financial Assessment",
          content:
            "Strong financials: revenue stable at ₹4.82 Cr (+2.1% YoY), EBITDA margin at 16.5%, net profit growing for 3 consecutive years. D/E at 0.92 — well below industry median. Interest coverage comfortable at 3.84x. Cross-source revenue reconciliation shows minimal variance (<3%).",
        },
        {
          title: "Risk Assessment",
          content:
            "Low risk profile. Only notable observation: Sunil Parshuram Kadam is also a director in M.K. Shelters (medium risk due to network exposure to A.R. Amboli), but this is a passive directorship with no direct risk transfer to Mana Properties. No AML, PEP, or criminal flags on any director.",
        },
        {
          title: "Recommendation",
          content:
            "Approval recommended. Entity meets all standard credit criteria — clean compliance, strong debt servicing capacity, and consistent revenue. Standard term loan conditions apply.",
        },
      ],
      sharedWithCreditHead: false,
    },

    documents: [
      { id: "DOC-MP-01", name: "ITR FY 2024-25", type: "ITR", uploadDate: "2026-02-25", verified: true, verifiedBy: "ITR" },
      { id: "DOC-MP-02", name: "GST Returns (Apr–Dec 2025)", type: "GST", uploadDate: "2026-02-25", verified: true, verifiedBy: "GST" },
      { id: "DOC-MP-03", name: "Bank Statement — SBI CA (Jan–Dec 2025)", type: "Bank Statement", uploadDate: "2026-02-26", verified: true, verifiedBy: "Banking" },
      { id: "DOC-MP-04", name: "MCA Extract — Certificate of Incorporation", type: "MCA Extract", uploadDate: "2026-02-25", verified: true, verifiedBy: "MCA" },
      { id: "DOC-MP-05", name: "KYC — Sunil Parshuram Kadam", type: "KYC", uploadDate: "2026-02-25", verified: true },
      { id: "DOC-MP-06", name: "KYC — Kavita Sunil Kadam", type: "KYC", uploadDate: "2026-02-25", verified: true },
      { id: "DOC-MP-07", name: "Project Layout — Mana Gardens Phase 2", type: "Property Doc", uploadDate: "2026-02-28", verified: false, notes: "RERA registration pending" },
    ],

    sourceReconciliation: [
      {
        metric: "Annual Revenue / Turnover",
        mcaValue: 48200000,
        gstValue: 46800000,
        itrValue: 47100000,
        bankingValue: 44900000,
        discrepancy: false,
        discrepancyNote: "All sources within 6.8% — acceptable for advance-collection real estate model.",
      },
      {
        metric: "Net Profit",
        mcaValue: 4100000,
        itrValue: 3980000,
        discrepancy: false,
      },
      {
        metric: "Total Borrowings",
        mcaValue: 18400000,
        bankingValue: 18900000,
        discrepancy: false,
        discrepancyNote: "₹5L difference — likely minor timing difference in ledger update.",
      },
    ],
  },
};

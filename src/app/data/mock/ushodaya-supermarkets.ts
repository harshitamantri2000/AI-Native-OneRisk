import type { RichCaseEntry } from "./types";

/**
 * Ushodaya Super Markets Private Limited
 * Source: IDfy Risk Report + AML Report (01 Apr 2026)
 * CIN: U52603TG2020PTC142143
 * Risk: HIGH (IDfy 0/10) — driven purely by financial/liquidity stress
 * No criminal or AML exposure. Clean directors. Large-scale retail chain (~37 locations).
 *
 * Related entity: Vijetha Supermarkets Pvt Ltd — Ushodaya deposited title deeds
 * as collateral for Vijetha's ₹100 Cr Axis Finance facility (Jul 2025).
 */
export const ushodayaSuperMarkets: RichCaseEntry = {
  id: "CASE-10244",
  name: "Ushodaya Super Markets Private Limited",
  industry: "Retail — Hypermarkets / Supermarkets",
  created: "2026-04-01",
  riskLevel: "High",
  status: "In Progress",
  source: "entity-dd",
  aiSuggestion: "Conditional Approve",
  aiInsight: {
    summary:
      "Large-format supermarket chain (₹230 Cr revenue, 37 locations across Telangana & AP) rated HIGH RISK by IDfy solely due to financial stress — current ratio 0.74, interest coverage 1.63x, declining PAT. No criminal, AML, or PEP flags on any director. Vijetha Supermarkets linkage via cross-collateral charge warrants scrutiny.",
    topRisk: "Low liquidity — Current ratio 0.74, below 1.0 for 3 consecutive years",
    confidencePercent: 87,
    factors: [
      "Current ratio 0.74 — cannot cover short-term liabilities from current assets",
      "Interest coverage declining: 3.58x (FY22) → 1.63x (FY24)",
      "Ushodaya deposited property to secure ₹100 Cr Axis Finance facility for Vijetha Supermarkets",
      "PAT declining: ₹3.12 Cr (FY22) → ₹1.29 Cr (FY24) on ₹230 Cr revenue",
      "Total charges: ₹119.21 Cr — higher than net fixed assets (₹29 Cr)",
    ],
    networkRisk: { level: "MEDIUM", label: "Cross-collateral exposure to Vijetha Supermarkets" },
  },
  detail: {
    cin: "U52603TG2020PTC142143",
    pan: "AACCU6295N",
    incorporationDate: "2020-07-24",
    registeredAddress:
      "H No. 1-16-71/527 (Ground & 1st Floor), Plot No.527, Survey Nos. 461 to 469, Dr. A. S. Rao Nagar, Hyderabad, Rangareddi, Telangana – 500062",
    industry: "Consumer Services — Hypermarkets (Retail Trading 100%)",
    entityType: "Private Limited",
    authorizedCapital: 60000000,
    paidUpCapital: 55700000,
    promoterHolding: 100,

    // ── Network ──────────────────────────────────────────────────────────────
    networkNodes: [
      {
        id: "NE-US-001",
        name: "Vijetha Supermarkets Private Limited",
        riskLevel: "Medium",
        isContagionSource: true,
        commonDirectors: ["Mannava Yugandhar"],
        debtToEquity: 2.4,
        netProfit: -5000000,
        natureOfBusiness: "Retail — Supermarkets",
        relationship: "Group Entity",
        registeredAddress: "Hyderabad, Telangana",
        directors: ["Mannava Yugandhar", "Raju Kenchappa", "Sunita B. Reddy"],
        aiSummary: "Medium risk — Vijetha posted a ₹5 Cr net loss in FY 2024 and carries D/E of 2.4. The critical exposure is a ₹100 Cr Axis Finance facility secured by MODT on Ushodaya's flagship A.S. Rao Nagar property. If Vijetha defaults, Ushodaya's core asset is directly at risk — this is the primary contagion vector in the network.",
      },
      {
        id: "NE-US-002",
        name: "Ushodaya Infra Private Limited",
        riskLevel: "Low",
        isContagionSource: false,
        commonDirectors: ["Mannava Yugandhar", "Mannava Santhi"],
        debtToEquity: 0.0,
        netProfit: 500000,
        natureOfBusiness: "Infrastructure",
        cin: "U70109TG2019PTC136294",
        incorporationDate: "2019-10-23",
        relationship: "Group Entity",
        directors: ["Mannava Yugandhar", "Mannava Santhi", "Kishan R. Naidu"],
        aiSummary: "Low risk. Debt-free infra holding entity with modest but positive earnings. Shared directors Mannava Yugandhar and Mannava Santhi are the promoter family. No adverse compliance or litigation flags. Passive holding vehicle — no direct operational risk to Ushodaya Supermarkets.",
      },
      {
        id: "NE-US-003",
        name: "Raghava Ram Industries Private Limited",
        riskLevel: "Low",
        isContagionSource: false,
        commonDirectors: ["Harshavardhan Murakonda"],
        debtToEquity: 4.0,
        netProfit: 200000,
        natureOfBusiness: "Manufacturing",
        cin: "U74999AP2019PTC111049",
        incorporationDate: "2019-01-29",
        relationship: "Common Director",
        directors: ["Harshavardhan Murakonda", "Sandeep Chowdary Murakonda", "Vijay R. Murakonda"],
        aiSummary: "Low risk despite elevated D/E of 4.0 — the entity is profitable and manufacturing exposure is unrelated to Ushodaya's retail operations. Common director Harshavardhan Murakonda has no adverse compliance history. Cross-entity risk is minimal given no financial interdependence.",
      },
      {
        id: "NE-US-004",
        name: "Cath Pharmacy Retail Private Limited",
        riskLevel: "Low",
        isContagionSource: false,
        commonDirectors: ["Sandeep Chowdary Murakonda"],
        debtToEquity: 0.0,
        netProfit: 100000,
        natureOfBusiness: "Pharmaceutical Retail",
        cin: "U52520TG2017PTC118462",
        incorporationDate: "2017-07-21",
        relationship: "Common Director",
        directors: ["Sandeep Chowdary Murakonda", "Priya M. Reddy", "Anil K. Sharma"],
        aiSummary: "Low risk pharmacy retail entity. Debt-free with marginal profit. Common director Sandeep Chowdary Murakonda also appears in Raghava Ram Industries but has no adverse flags. Operationally independent from Ushodaya — benign connection.",
      },
    ],
    networkInsights: {
      summary:
        "The critical network flag is Vijetha Supermarkets — Ushodaya deposited immovable property as collateral (MODT) to secure a ₹100 Cr Axis Finance facility for Vijetha (Jul 2025). If Vijetha defaults, Ushodaya's key properties are at risk. Other network entities are passive and low risk.",
      litigationFlag: undefined,
      amlFlag: undefined,
      pepFlag: undefined,
      contagionRisk: "MEDIUM",
      contagionExplanation:
        "Ushodaya has pledged its flagship property (A.S. Rao Nagar, Hyderabad) as security for Vijetha Supermarkets' ₹100 Cr Axis Finance borrowing. Vijetha's financial health directly impacts Ushodaya's asset security position.",
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
    },

    // ── Financial Parameters ──────────────────────────────────────────────────
    financialParameters: [
      // Priority 5 — Revenue & Profitability (surfaces in Overview)
      {
        id: "FP-US-01",
        name: "Revenue (FY 2023-24)",
        value: 2303200000,
        unit: "₹",
        source: "MCA",
        priority: 5,
        trend: "up",
        trendValue: 9.44,
        aiCommentary:
          "Revenue growing but decelerating sharply — 76.6% (FY22), 34.2% (FY23), 9.4% (FY24). Post-aggressive expansion, growth is normalising. Absolute scale at ₹230 Cr is strong for a private retail chain.",
        alternateSources: [
          { source: "Banking", value: 2180000000, unit: "₹", deviationNote: "Bank total credits ₹218 Cr — 5.4% below MCA. Consistent with cash-first supermarket model; some advances collected prior period." },
          { source: "GST", value: "₹100 Cr – ₹500 Cr slab", deviationNote: "GST slab (₹100–500 Cr) is consistent with MCA ₹230 Cr. Slab-level data does not allow precise cross-validation." },
        ],
      },
      {
        id: "FP-US-02",
        name: "EBITDA",
        value: 70200000,
        unit: "₹",
        source: "MCA",
        priority: 5,
        trend: "up",
        trendValue: 15.1,
        aiCommentary:
          "EBITDA margin at 3.05% — above industry peer median (1.66%) but well below 15% general business average. Hypermarket margins are structurally thin; the flag is not absolute level but declining trend from FY22's 4.08%.",
        benchmarkValue: 0.0166,
        benchmarkLabel: "Industry peer median 1.66%",
        alternateSources: [
          { source: "ITR", value: 68500000, unit: "₹", deviationNote: "ITR-implied operating surplus ₹6.85 Cr — 2.4% below MCA EBITDA; difference within normal depreciation timing variance." },
        ],
      },
      {
        id: "FP-US-03",
        name: "Net Profit (PAT)",
        value: 12900000,
        unit: "₹",
        source: "ITR",
        priority: 5,
        trend: "down",
        trendValue: -2.3,
        aiCommentary:
          "PAT of ₹1.29 Cr on ₹230 Cr revenue — net margin 0.56%. Declining from ₹3.12 Cr in FY22. Rising finance costs and depreciation are compressing bottom line despite revenue growth.",
        flagged: true,
        alternateSources: [
          { source: "MCA", value: 12900000, unit: "₹", deviationNote: "MCA and ITR both report ₹1.29 Cr PAT — full alignment, no discrepancy." },
        ],
      },
      // Priority 3 — Leverage & Working Capital
      {
        id: "FP-US-04",
        name: "Debt-to-Equity Ratio",
        value: 1.30,
        source: "MCA",
        priority: 3,
        trend: "up",
        trendValue: 13.0,
        aiCommentary:
          "D/E at 1.30 — rising from 0.71 (FY22). Leverage increasing as business expands. Debt to TNW ratio stable at 0.35 (same as FY23), suggesting equity is growing in proportion.",
        benchmarkValue: 0.51,
        benchmarkLabel: "Industry peer median",
        flagged: true,
      },
      {
        id: "FP-US-05",
        name: "Total Borrowings (LT + ST)",
        value: 168400000,
        unit: "₹",
        source: "Banking",
        priority: 3,
        trend: "up",
        trendValue: 24.6,
        aiCommentary: "Combined LT (₹12.18 Cr) + ST (₹4.66 Cr) borrowings = ₹16.84 Cr. Note: Sum of charges is ₹119.21 Cr — significantly higher due to HDFC working capital facility and Axis Finance property pledge for Vijetha.",
        flagged: true,
      },
      {
        id: "FP-US-06",
        name: "Net Worth / Total Equity",
        value: 129400000,
        unit: "₹",
        source: "MCA",
        priority: 3,
        trend: "up",
        trendValue: 11.1,
        aiCommentary: "Equity growing steadily — ₹10.66 Cr (FY22) → ₹12.94 Cr (FY24). Retained earnings being ploughed back.",
      },
      {
        id: "FP-US-07",
        name: "Current Ratio",
        value: 0.74,
        source: "MCA",
        priority: 3,
        trend: "down",
        trendValue: 0.0,
        aiCommentary:
          "Current ratio at 0.74 — flat for 2 consecutive years (FY23 and FY24 both 0.74). Entity is structurally short on working capital. However, negative cash conversion cycle (-6.91 days) means the business collects from customers before paying suppliers — partially mitigating the concern.",
        benchmarkValue: 1.5,
        benchmarkLabel: "Recommended minimum",
        flagged: true,
      },
      {
        id: "FP-US-08",
        name: "Quick Ratio",
        value: 0.12,
        source: "MCA",
        priority: 3,
        trend: "stable",
        aiCommentary:
          "Quick ratio at 0.12 — extremely low, indicating near-total reliance on inventory liquidation to meet short-term obligations. Typical for large-format retailers with high inventory.",
        flagged: true,
      },
      // Priority 2 — Banking & Cash Indicators
      {
        id: "FP-US-09",
        name: "Cash & Bank Balances",
        value: 11900000,
        unit: "₹",
        source: "Banking",
        priority: 2,
        trend: "up",
        trendValue: 16.7,
        aiCommentary: "Cash at ₹1.19 Cr on ₹230 Cr revenue — 0.5% cash-to-revenue ratio. Very tight but characteristic of high-velocity retail operations.",
        flagged: true,
      },
      // Priority 4 — Quality / Coverage
      {
        id: "FP-US-10",
        name: "Interest Coverage Ratio",
        value: 1.63,
        source: "MCA",
        priority: 4,
        trend: "down",
        trendValue: -17.3,
        aiCommentary:
          "Interest coverage declining steadily: 5.44x (FY21) → 3.58x (FY22) → 1.97x (FY23) → 1.63x (FY24). At 1.63x, the entity just barely covers its finance costs. Any EBITDA dip below 38% would breach 1.0x.",
        flagged: true,
        alternateSources: [
          {
            source: "Banking",
            value: 1.71,
            deviationNote: "Banking EMI data implies slightly higher coverage (1.71x) — MCA interest expense may include non-cash accruals not reflected in banking outflows.",
          },
        ],
      },
      {
        id: "FP-US-11",
        name: "Cash Conversion Cycle",
        value: -6.91,
        unit: "days",
        source: "MCA",
        priority: 3,
        trend: "stable",
        aiCommentary:
          "Negative CCC (-6.91 days) is a structural strength — supermarkets collect cash before paying suppliers. This offsets the current ratio weakness and is characteristic of the business model. Peer median is 0.77 days; Ushodaya outperforms.",
        benchmarkValue: 0.77,
        benchmarkLabel: "Industry peer median",
        flagged: false,
        alternateSources: [
          {
            source: "GST",
            value: "-4.2",
            unit: "days",
            deviationNote: "GST invoice timing implies CCC of −4.2 days — slightly less negative than MCA balance sheet figures; difference within normal accrual accounting variance.",
          },
        ],
      },
      // Priority 4 — Quality & Coverage Checks (surfaces in Overview)
      {
        id: "FP-US-12",
        name: "GST Revenue Slab",
        value: "₹100 Cr – ₹500 Cr",
        source: "GST",
        priority: 4,
        aiCommentary:
          "GST revenue slab (₹100–500 Cr) is consistent with MCA-reported revenue of ₹230 Cr. 2 active GSTINs (Telangana + Andhra Pradesh), no missed filings in 12 months.",
        flagged: false,
        alternateSources: [
          {
            source: "MCA",
            value: 2303200000,
            unit: "₹",
            deviationNote: "MCA P&L reports ₹230.32 Cr — falls within GST slab. No discrepancy; slab validation confirms revenue is not understated.",
          },
        ],
      },
      {
        id: "FP-US-13",
        name: "Sales / Net Fixed Assets",
        value: 7.93,
        source: "MCA",
        priority: 4,
        trend: "down",
        trendValue: -8.8,
        aiCommentary:
          "Sales/NFA declining: 10.50 (FY22) → 8.69 (FY23) → 7.93 (FY24) vs peer median of 15.74. Fixed assets are growing faster than revenue — new store capex is outpacing revenue ramp-up. 30%+ below peer median.",
        benchmarkValue: 15.74,
        benchmarkLabel: "Industry peer median",
        flagged: true,
      },
      {
        id: "FP-US-14",
        name: "Inventory / Sales",
        value: 46.86,
        unit: "days",
        source: "MCA",
        priority: 3,
        trend: "up",
        trendValue: 19.8,
        aiCommentary:
          "Inventory days increasing (39.1 → 46.9) — stock is taking longer to sell, possibly due to new stores in ramp-up phase. Peer median is 43.7 days; Ushodaya now slightly above.",
        benchmarkValue: 43.73,
        benchmarkLabel: "Industry peer median",
        flagged: true,
        alternateSources: [
          {
            source: "Banking",
            value: 44.1,
            unit: "days",
            deviationNote: "Banking debit patterns imply ~44 days — closely aligned with MCA; minor difference attributable to payment timing vs invoice date.",
          },
        ],
      },
    ],

    yearlyFinancials: [
      { year: 2021, revenue: 888600000, ebitda: 22000000, netProfit: 19700000, totalDebt: 25900000, cashAndEquivalents: 15100000 },
      { year: 2022, revenue: 1568800000, ebitda: 64000000, netProfit: 31200000, totalDebt: 75100000, cashAndEquivalents: 3300000 },
      { year: 2023, revenue: 2104700000, ebitda: 61000000, netProfit: 13200000, totalDebt: 133700000, cashAndEquivalents: 10200000 },
      { year: 2024, revenue: 2303200000, ebitda: 70200000, netProfit: 12900000, totalDebt: 168400000, cashAndEquivalents: 11900000 },
    ],

    // ── Litigations ───────────────────────────────────────────────────────────
    entityLitigations: [
      {
        id: "LIT-US-E01",
        caseNumber: "MVOP/46/2025",
        offence: "Motor Vehicle Accident Compensation",
        ipcSection: "Motor Vehicles Act",
        court: "Chief Judges Court, Hyderabad (CCC)",
        filingDate: "2025-01-07",
        status: "Pending",
        maxPunishment: "Compensation award",
        severity: "Low",
        notes: "Petitioner: Duddu Tirupatamma. Likely third-party road accident claim against company vehicle.",
      },
      {
        id: "LIT-US-E02",
        caseNumber: "MVOP/45/2025",
        offence: "Motor Vehicle Accident Compensation",
        ipcSection: "Motor Vehicles Act",
        court: "Chief Judges Court, Hyderabad (CCC)",
        filingDate: "2025-01-07",
        status: "Pending",
        maxPunishment: "Compensation award",
        severity: "Low",
        notes: "Petitioner: Duddu Gopalakrishna. Related MVOP claim, likely same incident as MVOP/46/2025.",
      },
      {
        id: "LIT-US-E03",
        caseNumber: "WP/2302/2024",
        offence: "GST Tax Dispute",
        ipcSection: "Writ Petition — Regulatory",
        court: "High Court of Telangana",
        filingDate: "2024-10-28",
        status: "Pending",
        maxPunishment: "Tax demand / penalty",
        severity: "Medium",
        notes: "Filed by company against Assistant Commissioner of State Tax. Routine GST demand dispute. Common for large retailers.",
      },
    ],

    directorLitigations: [
      {
        name: "Mannava Yugandhar",
        din: "06743353",
        designation: "Managing Director",
        appointmentDate: "2020-07-24",
        litigations: [],
      },
      {
        name: "Sandeep Chowdary Murakonda",
        din: "07812751",
        designation: "Director",
        appointmentDate: "2023-03-02",
        litigations: [],
      },
      {
        name: "Harshavardhan Murakonda",
        din: "08345098",
        designation: "Director",
        appointmentDate: "2023-03-02",
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
        checkedOn: "2026-04-01",
      },
      {
        category: "Entity",
        label: "GST Registration — Telangana (36AACCU6295N1ZL)",
        status: "Clear",
        finding: "Active. No missed filings in last 12 months.",
        source: "GST",
        checkedOn: "2026-04-01",
      },
      {
        category: "Entity",
        label: "GST Registration — Andhra Pradesh (37AACCU6295N1ZJ)",
        status: "Clear",
        finding: "Active. No missed filings in last 12 months.",
        source: "GST",
        checkedOn: "2026-04-01",
      },
      {
        category: "Entity",
        label: "Blacklist / Adverse Media Screening",
        status: "Clear",
        finding: "No hits found.",
        source: "IDfy",
        checkedOn: "2026-04-01",
      },
      {
        category: "Entity",
        label: "BIFR / CDR History",
        status: "Clear",
        finding: "No BIFR cases or CDR history on record.",
        source: "MCA",
        checkedOn: "2026-04-01",
      },
      {
        category: "Financial",
        label: "Financial Health — Liquidity",
        status: "Flagged",
        finding:
          "Current ratio below 1.0 for 3 consecutive years (0.83 FY22, 0.74 FY23, 0.74 FY24). Entity cannot cover short-term liabilities from current assets.",
        source: "IDfy",
        checkedOn: "2026-04-01",
      },
      {
        category: "Financial",
        label: "Financial Health — Leverage",
        status: "Flagged",
        finding:
          "Sum of charges ₹119.21 Cr exceeds net fixed assets ₹29.06 Cr. In case of default, fixed asset sale would not recover full debt. Promoter asset collateral recommended.",
        source: "IDfy",
        checkedOn: "2026-04-01",
      },
      {
        category: "Financial",
        label: "Auditor Report — Standalone",
        status: "Clear",
        finding: "Auditors (R K Madireddi & Co) issued unqualified reports for FY22, FY23, FY24. No adverse remarks.",
        source: "MCA",
        checkedOn: "2026-04-01",
      },
      {
        category: "AML",
        label: "AML Screening (Entity)",
        status: "Clear",
        finding: "IDfy AML: 0/10. No sanctions, PEP, warnings, or adverse media hits.",
        source: "IDfy",
        checkedOn: "2026-04-01",
      },
      {
        category: "AML",
        label: "AML Screening — Harshavardhan Murakonda",
        status: "Clear",
        finding: "IDfy AML: 0/10. No hits.",
        source: "IDfy",
        checkedOn: "2026-04-01",
      },
      {
        category: "AML",
        label: "AML Screening — Sandeep Chowdary Murakonda",
        status: "Clear",
        finding: "IDfy AML: 0/10. No hits.",
        source: "IDfy",
        checkedOn: "2026-04-01",
      },
      {
        category: "Network",
        label: "Cross-Collateral — Vijetha Supermarkets",
        status: "Flagged",
        finding:
          "Ushodaya deposited title deeds of its flagship property (MODT dated 22 Jul 2025) to secure ₹100 Cr Axis Finance facility availed by Vijetha Supermarkets Pvt Ltd. Vijetha's default risk is Ushodaya's collateral risk.",
        source: "MCA",
        checkedOn: "2026-04-01",
      },
    ],

    // ── CAM Draft ─────────────────────────────────────────────────────────────
    camDraft: {
      generatedOn: "2026-04-02",
      borrowerName: "Ushodaya Super Markets Private Limited",
      loanAmount: 100000000,
      purpose: "Working capital enhancement — inventory procurement and new store setup (Mangalagiri, AP)",
      riskRating: "C",
      recommendation: "Conditional Approve",
      conditions: [
        "Obtain personal guarantee from Mannava Yugandhar (MD) and Mannava Santhi (Director)",
        "Obtain financial statements of Vijetha Supermarkets Pvt Ltd — assess cross-default risk",
        "Current ratio covenant: maintain above 0.80 — quarterly certification required",
        "Cap on total charges: no additional charges allowed without lender consent",
        "Disbursement in tranches: 50% upfront, 50% after 6-month review of financial performance",
      ],
      sections: [
        {
          title: "Borrower Overview",
          content:
            "Ushodaya Super Markets Private Limited (CIN: U52603TG2020PTC142143) operates a supermarket chain under the 'Ushodaya Supermarkets' brand with ~37 locations across Hyderabad, Secunderabad, and multiple districts in Andhra Pradesh (Vijayawada, Guntur, Krishna). Incorporated in July 2020, the company generated ₹230.32 Cr revenue in FY24 — one of the larger private supermarket chains in the region. 100% promoter-held by the Mannava and Murakonda families.",
        },
        {
          title: "Financial Assessment",
          content:
            "Revenue trajectory is strong (₹88.86 Cr → ₹230.32 Cr in 4 years) but slowing (9.4% YoY in FY24 vs 76.6% in FY22). EBITDA margin at 3.05% — thin but above peer median. Critical concerns: (1) Current ratio 0.74 — flat for 2 years, below minimum threshold; (2) Interest coverage declining to 1.63x; (3) Net profit declining despite revenue growth; (4) Sum of charges ₹119.21 Cr exceeds net fixed assets, largely due to HDFC working capital facility and a ₹100 Cr Axis Finance cross-collateral charge for Vijetha Supermarkets. The negative cash conversion cycle (-6.91 days) is a structural positive typical of grocery retail.",
        },
        {
          title: "Risk Assessment",
          content:
            "Primary risk is financial — not criminal or reputational. IDfy AML reports for all directors returned 0/10 (no hits). Court check was not performed by IDfy; legal history shows only 2 MVOP compensation claims (low severity) and a routine GST writ petition. The significant risk is the ₹100 Cr cross-collateral charge where Ushodaya's property secures Vijetha Supermarkets' debt. If Vijetha defaults, Ushodaya faces property attachment. Vijetha's financials must be reviewed before approval.",
        },
        {
          title: "Recommendation",
          content:
            "Conditional Approval recommended. The business is real, growing, and has clean compliance. Financial stress is manageable with covenants. The Vijetha cross-collateral exposure is the key blocking question — we need Vijetha's financial statements before final sanction. Personal guarantees from the promoter family and a current ratio covenant are minimum conditions.",
        },
      ],
      sharedWithCreditHead: false,
    },

    // ── Documents ─────────────────────────────────────────────────────────────
    documents: [
      { id: "DOC-US-01", name: "ITR FY 2023-24", type: "ITR", uploadDate: "2026-03-25", verified: true, verifiedBy: "ITR" },
      { id: "DOC-US-02", name: "ITR FY 2022-23", type: "ITR", uploadDate: "2026-03-25", verified: true, verifiedBy: "ITR" },
      { id: "DOC-US-03", name: "GST Returns — 36AACCU6295N1ZL (Telangana, Apr 2025–Mar 2026)", type: "GST", uploadDate: "2026-03-26", verified: true, verifiedBy: "GST" },
      { id: "DOC-US-04", name: "GST Returns — 37AACCU6295N1ZJ (AP, Apr 2025–Mar 2026)", type: "GST", uploadDate: "2026-03-26", verified: true, verifiedBy: "GST" },
      { id: "DOC-US-05", name: "Bank Statement — HDFC CA (Jan–Dec 2025)", type: "Bank Statement", uploadDate: "2026-03-27", verified: true, verifiedBy: "Banking" },
      { id: "DOC-US-06", name: "MCA Extract — AOC-4 FY24 (Balance Sheet + P&L)", type: "MCA Extract", uploadDate: "2026-03-25", verified: true, verifiedBy: "MCA" },
      { id: "DOC-US-07", name: "MCA Extract — Charges Register (Open Charges)", type: "MCA Extract", uploadDate: "2026-03-25", verified: true, verifiedBy: "MCA" },
      { id: "DOC-US-08", name: "IDfy Risk Report (01 Apr 2026)", type: "Other", uploadDate: "2026-04-01", verified: true, verifiedBy: "IDfy" },
      { id: "DOC-US-09", name: "KYC — Mannava Yugandhar (Aadhaar + PAN)", type: "KYC", uploadDate: "2026-03-25", verified: true },
      { id: "DOC-US-10", name: "KYC — Sandeep Chowdary Murakonda", type: "KYC", uploadDate: "2026-03-25", verified: true },
      { id: "DOC-US-11", name: "KYC — Harshavardhan Murakonda", type: "KYC", uploadDate: "2026-03-25", verified: true },
      { id: "DOC-US-12", name: "Axis Finance MODT (22 Jul 2025) — Vijetha Loan Security", type: "Property Doc", uploadDate: "2026-03-28", verified: true, notes: "Ushodaya property pledged as security for Vijetha Supermarkets' ₹100 Cr Axis Finance facility" },
    ],

    // ── Risk Triangulation ────────────────────────────────────────────────────
    sourceReconciliation: [
      {
        metric: "Annual Revenue / Turnover",
        mcaValue: 2303200000,
        gstValue: "₹100–500 Cr slab (consistent)",
        discrepancy: false,
        discrepancyNote:
          "GST revenue slab (₹100–500 Cr) is consistent with MCA revenue of ₹230 Cr. Slab-level data does not allow precise cross-validation.",
      },
      {
        metric: "Net Profit",
        mcaValue: 12900000,
        itrValue: 12900000,
        discrepancy: false,
        discrepancyNote: "ITR and MCA aligned for FY24.",
      },
      {
        metric: "Total Borrowings",
        mcaValue: 168400000,
        bankingValue: 11921000000,
        discrepancy: true,
        discrepancyNote:
          "MCA balance sheet shows ₹16.84 Cr in LT+ST borrowings. However, Sum of Charges is ₹119.21 Cr — this gap represents ₹100 Cr Axis Finance charge (property pledge for Vijetha, not direct Ushodaya debt) + HDFC working capital facilities secured by assets. The balance sheet does not reflect the full contingent liability.",
      },
      {
        metric: "Employee Benefit Expense",
        mcaValue: 142800000,
        discrepancy: false,
        discrepancyNote: "₹14.28 Cr employee costs for ~37 locations implies ~₹38.6L per store annually (reasonable for supermarket staffing).",
      },
    ],
  },
};

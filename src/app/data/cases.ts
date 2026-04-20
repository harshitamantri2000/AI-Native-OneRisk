export type RiskLevel = "Low" | "Medium" | "High";
export type CaseStatus = "In Progress" | "Completed" | "Failed" | "Sent to Credit Head";
export type CaseTag = "Needs Investigation" | "Quick Review" | "Escalated" | "Follow Up" | "Cleared";
export type ProcessStatus = "In Progress" | "Failed" | "Completed";

export type CaseSource =
  | "entity-dd"
  | "individual-dd"
  | "asset-dd"
  | "court-check"
  | "aml-check"
  | "vehicular-check"
  | "bank-statement"
  | "netscan"
  | "bulk-upload";

export const SOURCE_LABELS: Record<CaseSource, string> = {
  "entity-dd": "Entity DD",
  "individual-dd": "Individual DD",
  "asset-dd": "Asset DD",
  "court-check": "Court Check",
  "aml-check": "AML Check",
  "vehicular-check": "Vehicular Check",
  "bank-statement": "Bank Statement",
  "netscan": "Netscan",
  "bulk-upload": "Bulk Upload",
};

export const SOURCE_CATEGORIES: Record<string, CaseSource[]> = {
  "Risk Bundles": ["entity-dd", "individual-dd", "asset-dd"],
  "Terminal": ["court-check", "aml-check", "vehicular-check", "bank-statement", "netscan"],
  "Other": ["bulk-upload"],
};

export interface AIInsight {
  mostRiskyElement: string;
  riskExplanation: string;
  confidencePercent: number;
  additionalFactors: string[];
  networkRisk?: { level: "HIGH" | "MEDIUM" | "LOW"; label: string };
}

/* ─── Detail-level types (used by old-style analysis page) ─── */

export interface CriminalCaseDetail {
  caseNumber: string;
  offence: string;
  section: string;
  court: string;
  maxPunishment: string;
  status: string;
}

export interface DirectorDetail {
  name: string;
  din: string;
  designation: string;
  appointmentDate: string;
  criminalCases?: CriminalCaseDetail[];
}

export interface YearlyTrendPoint {
  year: number;
  cash: number;
  borrowings: number;
}

export interface FinancialData {
  revenue: number;
  revenueChange: number;
  ebitda: number;
  ebitdaMargin: number;
  netProfit: number;
  cashFlow: number;
  debtToEquity: number;
  currentRatio: number;
  interestCoverage: number;
  totalDebt: number;
  netWorth: number;
  gstVerifiedTurnover?: number;
  mcaReportedRevenue?: number;
  industryMedianDE?: number;
  yearlyTrend?: YearlyTrendPoint[];
  cashReserves?: number;
  monthlyBurnRate?: number;
}

export interface NetworkEntity {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  isContagionSource: boolean;
  commonDirectors: string[];
  debtToEquity: number;
  netProfit: number;
  natureOfBusiness: string;
}

export interface CaseDetail {
  cin: string;
  incorporationDate: string;
  registeredAddress: string;
  directors: DirectorDetail[];
  financials: FinancialData;
  networkEntities: NetworkEntity[];
}

export interface CaseEntry {
  id: string;
  name: string;
  natureOfBusiness: string;
  created: string;
  riskLevel: RiskLevel;
  mostRiskElement: string;
  status: CaseStatus;
  processStatus: ProcessStatus;
  tag?: CaseTag;
  aiSuggestion?: string;
  aiInsight: AIInsight;
  detail?: CaseDetail;
  source: CaseSource;
}

export const MOCK_CASES: CaseEntry[] = [
  {
    id: "CASE-10235",
    name: "MK Shelters",
    natureOfBusiness: "Real Estate",
    created: "2026-02-17",
    riskLevel: "High",
    mostRiskElement: "Serious Criminal Offences against Director",
    status: "Sent to Credit Head",
    processStatus: "In Progress",
    tag: "Needs Investigation",
    aiInsight: {
      mostRiskyElement: "Serious Criminal Offences against Director",
      riskExplanation:
        "Pending criminal cases for Forgery of valuable securities and Cheating. Maximum potential punishment includes life imprisonment.",
      confidencePercent: 89,
      additionalFactors: [
        "100% Promoter-held entity",
        "Debt-to-Equity Ratio: 7.17",
        "Network contagion via common directors",
      ],
      networkRisk: { level: "HIGH", label: "Common directorship network risk" },
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10234",
    name: "TechFlow Solutions",
    natureOfBusiness: "IT Services",
    created: "2026-02-20",
    riskLevel: "Low",
    mostRiskElement: "Minor compliance gap",
    status: "Completed",
    processStatus: "Completed",
    tag: "Cleared",
    aiInsight: {
      mostRiskyElement: "Minor compliance gap",
      riskExplanation:
        "Low-risk entity with strong financials and clean director background. Minor GST filing delay noted.",
      confidencePercent: 95,
      additionalFactors: [
        "68% Promoter holding",
        "Debt-to-Equity Ratio: 0.42",
        "Consistent revenue growth",
      ],
    },
    source: "bulk-upload",
  },
  {
    id: "CASE-10236",
    name: "Global Synthetics",
    natureOfBusiness: "Chemicals",
    created: "2026-02-19",
    riskLevel: "Medium",
    mostRiskElement: "High Debt-to-Equity Ratio",
    status: "In Progress",
    processStatus: "In Progress",
    tag: "Follow Up",
    aiInsight: {
      mostRiskyElement: "High Debt-to-Equity Ratio",
      riskExplanation:
        "D/E ratio at 3.8 — significantly above industry median of 1.5. Working capital under stress with declining current ratio.",
      confidencePercent: 76,
      additionalFactors: [
        "Declining EBITDA margins",
        "Regulatory scrutiny on emissions",
        "Single-geography revenue concentration",
      ],
    },
    source: "bank-statement",
  },
  {
    id: "CASE-10241",
    name: "A. R. Amboli Developers",
    natureOfBusiness: "Real Estate",
    created: "2026-02-19",
    riskLevel: "High",
    mostRiskElement: "Forgery & Cheating — Criminal Cases",
    status: "In Progress",
    processStatus: "Completed",
    tag: "Escalated",
    aiSuggestion: "Reject",
    aiInsight: {
      mostRiskyElement: "Forgery & Cheating — Criminal Cases",
      riskExplanation:
        "Pending cases for Forgery of valuable securities, Cheating, and dishonestly inducing delivery of property. Maximum legal exposure includes potential Life Imprisonment.",
      confidencePercent: 94,
      additionalFactors: [
        "100% Promoter-held entity",
        "Debt-to-Equity Ratio: 6.49",
        "Network contagion via common directors with MK Shelters",
      ],
      networkRisk: { level: "HIGH", label: "Common directorship network risk" },
    },
    detail: {
      cin: "U45200MH2018PTC312456",
      incorporationDate: "2018-06-14",
      registeredAddress: "Office No. 302, Sai Complex, S.V. Road, Amboli, Andheri (West), Mumbai – 400058",
      directors: [
        {
          name: "Rajesh Kalyanrao Amboli",
          din: "07654321",
          designation: "Managing Director",
          appointmentDate: "2018-06-14",
          criminalCases: [
            {
              caseNumber: "CC/2021/4578",
              offence: "Forgery of valuable security",
              section: "IPC 467",
              court: "Mumbai Sessions Court",
              maxPunishment: "Life Imprisonment",
              status: "Pending",
            },
            {
              caseNumber: "CC/2022/1190",
              offence: "Cheating & dishonestly inducing delivery of property",
              section: "IPC 420",
              court: "Andheri Metropolitan Magistrate Court",
              maxPunishment: "7 years + fine",
              status: "Pending",
            },
          ],
        },
        {
          name: "Sunita Rajesh Amboli",
          din: "08765432",
          designation: "Director",
          appointmentDate: "2018-06-14",
          criminalCases: [],
        },
        {
          name: "Manoj Kumar Sharma",
          din: "09876543",
          designation: "Additional Director",
          appointmentDate: "2023-01-10",
          criminalCases: [
            {
              caseNumber: "CC/2020/7821",
              offence: "Criminal breach of trust",
              section: "IPC 406",
              court: "Thane District Court",
              maxPunishment: "3 years + fine",
              status: "Pending",
            },
          ],
        },
      ],
      financials: {
        revenue: 84500000,
        revenueChange: -30.7,
        ebitda: 3549000,
        ebitdaMargin: 4.2,
        netProfit: -3200000,
        cashFlow: -8400000,
        debtToEquity: 6.49,
        currentRatio: 0.72,
        interestCoverage: 0.68,
        totalDebt: 208000000,
        netWorth: 32000000,
        gstVerifiedTurnover: 68200000,
        mcaReportedRevenue: 84500000,
        industryMedianDE: 1.85,
        yearlyTrend: [
          { year: 2022, cash: 42000000, borrowings: 118000000 },
          { year: 2023, cash: 28000000, borrowings: 142000000 },
          { year: 2024, cash: 15000000, borrowings: 185000000 },
          { year: 2025, cash: 8000000, borrowings: 208000000 },
        ],
        cashReserves: 8000000,
        monthlyBurnRate: 2800000,
      },
      networkEntities: [
        {
          id: "NE-001",
          name: "MK Shelters Pvt Ltd",
          riskLevel: "High",
          isContagionSource: true,
          commonDirectors: ["Rajesh K. Amboli"],
          debtToEquity: 7.17,
          netProfit: -5600000,
          natureOfBusiness: "Real Estate",
        },
        {
          id: "NE-002",
          name: "Amboli Land Holdings LLP",
          riskLevel: "High",
          isContagionSource: true,
          commonDirectors: ["Rajesh K. Amboli", "Sunita R. Amboli"],
          debtToEquity: 4.82,
          netProfit: -1200000,
          natureOfBusiness: "Land Acquisition",
        },
        {
          id: "NE-003",
          name: "Sharma Construction Co.",
          riskLevel: "Medium",
          isContagionSource: false,
          commonDirectors: ["Manoj K. Sharma"],
          debtToEquity: 2.1,
          netProfit: 3400000,
          natureOfBusiness: "Infrastructure",
        },
        {
          id: "NE-004",
          name: "Vasai Realty Partners",
          riskLevel: "High",
          isContagionSource: true,
          commonDirectors: [],
          debtToEquity: 5.3,
          netProfit: -4100000,
          natureOfBusiness: "Real Estate",
        },
      ],
    },
    source: "court-check",
  },
  {
    id: "CASE-10237",
    name: "Apex Retail Group",
    natureOfBusiness: "Retail",
    created: "2026-02-18",
    riskLevel: "Low",
    mostRiskElement: "Seasonal revenue volatility",
    status: "Completed",
    processStatus: "Completed",
    tag: "Quick Review",
    aiInsight: {
      mostRiskyElement: "Seasonal revenue volatility",
      riskExplanation:
        "Revenue dips in Q1 by ~15% annually due to seasonal patterns. Otherwise strong fundamentals with healthy cash reserves.",
      confidencePercent: 91,
      additionalFactors: [
        "Strong promoter holding at 71%",
        "Current Ratio: 2.1",
        "Low D/E at 0.38",
      ],
    },
    source: "bulk-upload",
  },
  {
    id: "CASE-10238",
    name: "Nova Energy Corp",
    natureOfBusiness: "Energy",
    created: "2026-02-16",
    riskLevel: "Medium",
    mostRiskElement: "Regulatory transition risk",
    status: "In Progress",
    processStatus: "Completed",
    tag: "Follow Up",
    aiSuggestion: "Quick Approve",
    aiInsight: {
      mostRiskyElement: "Regulatory transition risk",
      riskExplanation:
        "New CERC tariff regulations may impact margins by 8-12%. Ongoing transition from thermal to renewable portfolio introduces execution risk.",
      confidencePercent: 72,
      additionalFactors: [
        "₹340 Cr capex commitment",
        "Debt-to-Equity at 2.1",
        "Promoter holding at 58%",
      ],
    },
    source: "aml-check",
  },
  {
    id: "CASE-10239",
    name: "Reliance Industries",
    natureOfBusiness: "Conglomerate",
    created: "2026-02-15",
    riskLevel: "Low",
    mostRiskElement: "Scale complexity",
    status: "Completed",
    processStatus: "Completed",
    tag: "Cleared",
    aiInsight: {
      mostRiskyElement: "Scale complexity",
      riskExplanation:
        "Large conglomerate with diversified revenue streams. Complexity in group structure noted but well-managed with transparent disclosures.",
      confidencePercent: 97,
      additionalFactors: [
        "Investment-grade rating",
        "Net-debt-free telecom arm",
        "Strong governance score",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10240",
    name: "Tata Steel Ltd",
    natureOfBusiness: "Steel & Mining",
    created: "2026-02-14",
    riskLevel: "Medium",
    mostRiskElement: "Commodity price exposure",
    status: "In Progress",
    processStatus: "In Progress",
    aiInsight: {
      mostRiskyElement: "Commodity price exposure",
      riskExplanation:
        "Steel price volatility and European operations restructuring create near-term uncertainty. Strong domestic fundamentals offset international headwinds.",
      confidencePercent: 78,
      additionalFactors: [
        "European operations restructuring",
        "Domestic capacity expansion",
        "D/E at 1.6",
      ],
    },
    source: "bank-statement",
  },
  {
    id: "CASE-10242",
    name: "Clearpath Logistics",
    natureOfBusiness: "Logistics & Supply Chain",
    created: "2026-02-13",
    riskLevel: "Low",
    mostRiskElement: "Key client concentration",
    status: "Completed",
    processStatus: "Completed",
    tag: "Cleared",
    aiInsight: {
      mostRiskyElement: "Key client concentration",
      riskExplanation:
        "Top 3 clients contribute 62% of revenue. Overall financial health is strong with consistent margins.",
      confidencePercent: 88,
      additionalFactors: [
        "Current Ratio: 1.8",
        "Healthy EBITDA margin at 14%",
        "Expanding warehouse network",
      ],
    },
    source: "netscan",
  },
  {
    id: "CASE-10243",
    name: "Greenfield Agro Pvt Ltd",
    natureOfBusiness: "Agriculture & FMCG",
    created: "2026-02-12",
    riskLevel: "Low",
    mostRiskElement: "Weather-dependent crop cycles",
    status: "Completed",
    processStatus: "Completed",
    tag: "Quick Review",
    aiInsight: {
      mostRiskyElement: "Weather-dependent crop cycles",
      riskExplanation:
        "Revenue linked to monsoon patterns. Diversified product portfolio across grains, spices, and packaged foods mitigates concentration risk.",
      confidencePercent: 85,
      additionalFactors: [
        "D/E at 0.55",
        "Government subsidy beneficiary",
        "Expanding export markets",
      ],
    },
    source: "individual-dd",
  },
  {
    id: "CASE-10244",
    name: "Horizon Pharma Ltd",
    natureOfBusiness: "Pharmaceuticals",
    created: "2026-02-11",
    riskLevel: "Medium",
    mostRiskElement: "US FDA observations",
    status: "In Progress",
    processStatus: "Failed",
    tag: "Needs Investigation",
    aiInsight: {
      mostRiskyElement: "US FDA observations",
      riskExplanation:
        "Recent Form 483 with 6 observations at Baddi plant. Export revenue at risk if Warning Letter issued. Remediation plan submitted.",
      confidencePercent: 68,
      additionalFactors: [
        "40% revenue from US market",
        "R&D spend at 8% of revenue",
        "Patent cliff on 2 key molecules in 2027",
      ],
    },
    source: "court-check",
  },
  {
    id: "CASE-10245",
    name: "Vanguard Infra Projects",
    natureOfBusiness: "Infrastructure",
    created: "2026-02-10",
    riskLevel: "High",
    mostRiskElement: "Severe cash-flow stress",
    status: "Failed",
    processStatus: "Completed",
    tag: "Escalated",
    aiSuggestion: "Reject",
    aiInsight: {
      mostRiskyElement: "Severe cash-flow stress",
      riskExplanation:
        "Negative operating cash flow for 4 consecutive quarters. ₹180 Cr in disputed receivables from state government projects. Imminent default risk.",
      confidencePercent: 92,
      additionalFactors: [
        "D/E at 4.8",
        "Interest coverage below 1.0",
        "3 arbitration cases pending",
      ],
      networkRisk: { level: "MEDIUM", label: "Sub-contractor default chain" },
    },
    source: "aml-check",
  },
  {
    id: "CASE-10246",
    name: "Bharat Textile Mills",
    natureOfBusiness: "Textiles & Apparel",
    created: "2026-02-09",
    riskLevel: "Medium",
    mostRiskElement: "Export market slowdown",
    status: "In Progress",
    processStatus: "In Progress",
    tag: "Follow Up",
    aiInsight: {
      mostRiskyElement: "Export market slowdown",
      riskExplanation:
        "EU and US demand contraction impacting order book. 35% decline in export orders QoQ. Domestic pivot strategy underway.",
      confidencePercent: 74,
      additionalFactors: [
        "Working capital cycle stretched to 120 days",
        "Promoter pledging at 18%",
        "Cotton price hedging gaps",
      ],
    },
    source: "vehicular-check",
  },
  {
    id: "CASE-10247",
    name: "Pinnacle Microfinance",
    natureOfBusiness: "Financial Services",
    created: "2026-02-08",
    riskLevel: "High",
    mostRiskElement: "NPA spike in rural portfolio",
    status: "Sent to Credit Head",
    processStatus: "In Progress",
    tag: "Needs Investigation",
    aiInsight: {
      mostRiskyElement: "NPA spike in rural portfolio",
      riskExplanation:
        "Gross NPA surged from 3.2% to 8.7% in two quarters. Flood-affected districts account for 40% of loan book. Capital adequacy declining.",
      confidencePercent: 82,
      additionalFactors: [
        "CAR at 12.1% — near regulatory minimum",
        "Provision coverage ratio at 52%",
        "RBI inspection scheduled Q1 2026",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10248",
    name: "Orion Steelworks",
    natureOfBusiness: "Steel Manufacturing",
    created: "2026-02-07",
    riskLevel: "Low",
    mostRiskElement: "Input cost fluctuation",
    status: "Completed",
    processStatus: "Completed",
    tag: "Cleared",
    aiInsight: {
      mostRiskyElement: "Input cost fluctuation",
      riskExplanation:
        "Iron ore prices volatile but company has long-term supply contracts. Integrated operations provide cost advantage. Export orders are growing.",
      confidencePercent: 90,
      additionalFactors: [
        "D/E at 0.9",
        "EBITDA margin at 18%",
        "Backward integration completed",
      ],
    },
    source: "bulk-upload",
  },
  {
    id: "CASE-10249",
    name: "Sarvana Exports",
    natureOfBusiness: "Textiles Export",
    created: "2026-02-06",
    riskLevel: "Low",
    mostRiskElement: "Currency hedging gaps",
    status: "In Progress",
    processStatus: "Completed",
    aiInsight: {
      mostRiskyElement: "Currency hedging gaps",
      riskExplanation:
        "Only 40% of USD receivables hedged. INR appreciation risk on ₹120 Cr export receivables. Margin compression likely if unhedged.",
      confidencePercent: 71,
      additionalFactors: [
        "Revenue growth at 12% YoY",
        "Single-market concentration (US 55%)",
        "New factory commissioning in Q2",
      ],
    },
    source: "netscan",
  },
  {
    id: "CASE-10250",
    name: "Lakshmi Precision Tools",
    natureOfBusiness: "Precision Engineering",
    created: "2026-02-05",
    riskLevel: "Low",
    mostRiskElement: "Technology obsolescence risk",
    status: "Completed",
    processStatus: "Completed",
    tag: "Quick Review",
    aiInsight: {
      mostRiskyElement: "Technology obsolescence risk",
      riskExplanation:
        "Legacy CNC lines need upgrade by 2027. ₹45 Cr capex planned. Strong order pipeline from automotive OEMs provides revenue visibility.",
      confidencePercent: 87,
      additionalFactors: [
        "D/E at 0.65",
        "Net profit margin at 11%",
        "Zero promoter pledge",
      ],
    },
    source: "individual-dd",
  },
  {
    id: "CASE-10251",
    name: "Deccan Auto Components",
    natureOfBusiness: "Auto Parts Manufacturing",
    created: "2026-02-04",
    riskLevel: "High",
    mostRiskElement: "EV transition risk & promoter litigation",
    status: "In Progress",
    processStatus: "In Progress",
    tag: "Needs Investigation",
    aiInsight: {
      mostRiskyElement: "EV transition risk & promoter litigation",
      riskExplanation:
        "30% of revenue from ICE-specific components. EV transition plan nascent — R&D allocation at only 2% of revenue. Key OEM customer shifting to EV. Promoter facing personal litigation.",
      confidencePercent: 69,
      additionalFactors: [
        "Promoter litigation pending",
        "Dividend payout consistent",
        "New EV component line in pilot",
      ],
    },
    source: "court-check",
  },
  {
    id: "CASE-10253",
    name: "Priya Digital Services",
    natureOfBusiness: "Digital Marketing",
    created: "2026-02-02",
    riskLevel: "Low",
    mostRiskElement: "Client retention risk",
    status: "In Progress",
    processStatus: "In Progress",
    tag: "Quick Review",
    aiInsight: {
      mostRiskyElement: "Client retention risk",
      riskExplanation:
        "Top 5 clients contribute 48% revenue but contracts are annual renewals. Strong NPS score of 72 and growing mid-market segment offset concentration.",
      confidencePercent: 83,
      additionalFactors: [
        "D/E at 0.2",
        "Cash-rich balance sheet",
        "YoY revenue growth at 22%",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10254",
    name: "Rajput Heavy Industries",
    natureOfBusiness: "Heavy Engineering",
    created: "2026-02-01",
    riskLevel: "High",
    mostRiskElement: "Data extraction failure — manual review needed",
    status: "In Progress",
    processStatus: "Failed",
    tag: "Escalated",
    aiInsight: {
      mostRiskyElement: "Data extraction failure — manual review needed",
      riskExplanation:
        "Automated data extraction from MCA and GST portals failed due to mismatched PAN-CIN linkage. Manual document verification required before risk assessment.",
      confidencePercent: 0,
      additionalFactors: [
        "PAN-CIN linkage mismatch",
        "GST portal timeout errors",
        "Manual document upload pending",
      ],
    },
    source: "bulk-upload",
  },
  {
    id: "CASE-10255",
    name: "Coastal Fisheries Ltd",
    natureOfBusiness: "Marine & Aquaculture",
    created: "2026-01-30",
    riskLevel: "Low",
    mostRiskElement: "Seasonal demand variation",
    status: "In Progress",
    processStatus: "Failed",
    tag: "Follow Up",
    aiInsight: {
      mostRiskyElement: "Seasonal demand variation",
      riskExplanation:
        "Processing pipeline failed at financial data extraction stage. Retry initiated but MCA server downtime impacted batch processing.",
      confidencePercent: 0,
      additionalFactors: [
        "MCA server downtime",
        "Retry scheduled",
        "Partial data available",
      ],
    },
    source: "bank-statement",
  },
  {
    id: "CASE-10256",
    name: "Metro Healthcare Systems",
    natureOfBusiness: "Healthcare",
    created: "2026-01-29",
    riskLevel: "Medium",
    mostRiskElement: "Regulatory compliance gaps",
    status: "In Progress",
    processStatus: "Completed",
    tag: "Follow Up",
    aiInsight: {
      mostRiskyElement: "Regulatory compliance gaps",
      riskExplanation:
        "NABH accreditation renewal pending for 2 facilities. State drug license discrepancies noted. Otherwise strong operational metrics.",
      confidencePercent: 75,
      additionalFactors: [
        "D/E at 1.4",
        "Bed occupancy at 78%",
        "Insurance tie-ups expanding",
      ],
    },
    source: "aml-check",
  },
  {
    id: "CASE-10257",
    name: "Zenith Paper Mills",
    natureOfBusiness: "Paper & Packaging",
    created: "2026-01-28",
    riskLevel: "Medium",
    mostRiskElement: "Raw material supply chain disruption",
    status: "In Progress",
    processStatus: "In Progress",
    tag: "Follow Up",
    aiInsight: {
      mostRiskyElement: "Raw material supply chain disruption",
      riskExplanation:
        "Primary bamboo pulp supplier facing forest clearance issues. Alternate sourcing adds 12% to input costs. Inventory buffer at 45 days.",
      confidencePercent: 70,
      additionalFactors: [
        "D/E at 1.8",
        "Export revenue at 30%",
        "Green certification pending",
      ],
    },
    source: "vehicular-check",
  },
  /* ═══════════════════════════════════════════════════════
     Additional Entity Due Diligence cases
     ═══════════════════════════════════════════════════════ */
  {
    id: "CASE-10260",
    name: "Shriram Transport Finance",
    natureOfBusiness: "NBFC — Vehicle Finance",
    created: "2026-02-24",
    riskLevel: "Low",
    mostRiskElement: "Minor provisioning gap",
    status: "Completed",
    processStatus: "Completed",
    tag: "Cleared",
    aiInsight: {
      mostRiskyElement: "Minor provisioning gap",
      riskExplanation:
        "Stage-3 provision coverage at 58% vs RBI benchmark of 60%. Marginal shortfall being addressed in Q4 top-up. Strong overall asset quality with GNPA at 5.8% trending downward.",
      confidencePercent: 93,
      additionalFactors: [
        "CAR at 22.4% — well above minimum",
        "AUM growth at 16% YoY",
        "Disbursement quality improving",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10261",
    name: "Adani Ports & SEZ",
    natureOfBusiness: "Port Infrastructure",
    created: "2026-02-23",
    riskLevel: "Medium",
    mostRiskElement: "Governance & ESG concerns",
    status: "In Progress",
    processStatus: "Completed",
    tag: "Follow Up",
    aiInsight: {
      mostRiskyElement: "Governance & ESG concerns",
      riskExplanation:
        "Hindenburg-triggered governance scrutiny still unresolved. Independent committee report pending. Strong operational metrics — cargo volumes up 14% — but ESG rating downgraded by two agencies.",
      confidencePercent: 66,
      additionalFactors: [
        "D/E at 2.3",
        "Promoter pledge at 14.6%",
        "4 new port concessions awarded",
      ],
      networkRisk: { level: "MEDIUM", label: "Group-level contagion exposure" },
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10262",
    name: "Manappuram Finance Ltd",
    natureOfBusiness: "Gold Loan NBFC",
    created: "2026-02-22",
    riskLevel: "Low",
    mostRiskElement: "Gold price volatility exposure",
    status: "In Progress",
    processStatus: "Completed",
    tag: "Quick Review",
    aiSuggestion: "Quick Approve",
    aiInsight: {
      mostRiskyElement: "Gold price volatility exposure",
      riskExplanation:
        "LTV maintained at 65% average — conservative. Gold price correction of 10% would still leave adequate collateral coverage. Auction losses minimal at 0.02% of AUM.",
      confidencePercent: 89,
      additionalFactors: [
        "D/E at 3.1 — within NBFC norms",
        "Branch expansion in tier-3 cities",
        "Online gold loan share at 28%",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10263",
    name: "DLF Limited",
    natureOfBusiness: "Real Estate Development",
    created: "2026-02-21",
    riskLevel: "Medium",
    mostRiskElement: "Project execution delays",
    status: "In Progress",
    processStatus: "In Progress",
    tag: "Follow Up",
    aiInsight: {
      mostRiskyElement: "Project execution delays",
      riskExplanation:
        "3 of 7 ongoing projects behind schedule by 8-14 months. RERA compliance pending for 2 projects. New launch pipeline strong at ₹22,000 Cr but absorption rate slowing in luxury segment.",
      confidencePercent: 71,
      additionalFactors: [
        "D/E at 0.28 — very conservative",
        "Net cash position of ₹3,200 Cr",
        "Annuity rental income at ₹4,100 Cr",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10264",
    name: "Vedanta Resources",
    natureOfBusiness: "Metals & Mining",
    created: "2026-02-20",
    riskLevel: "High",
    mostRiskElement: "Holding company leverage & dividend dependency",
    status: "Sent to Credit Head",
    processStatus: "Completed",
    tag: "Escalated",
    aiSuggestion: "Reject",
    aiInsight: {
      mostRiskyElement: "Holding company leverage & dividend dependency",
      riskExplanation:
        "Parent Vedanta Resources has $6.8B debt with $1.2B maturing in 12 months. Entirely dependent on subsidiary dividends for debt servicing. Zinc India dividend payout at 100% is unsustainable. Refinancing risk elevated.",
      confidencePercent: 84,
      additionalFactors: [
        "Complex multi-layer holding structure",
        "Aluminium business margin compression",
        "Environmental liabilities at Sterlite Copper",
      ],
      networkRisk: { level: "HIGH", label: "Parent-subsidiary contagion" },
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10265",
    name: "Marico Limited",
    natureOfBusiness: "FMCG — Personal Care",
    created: "2026-02-19",
    riskLevel: "Low",
    mostRiskElement: "Copra price inflation impact",
    status: "Completed",
    processStatus: "Completed",
    tag: "Cleared",
    aiInsight: {
      mostRiskyElement: "Copra price inflation impact",
      riskExplanation:
        "Copra prices up 22% YoY impacting Parachute margins. Company has hedging program covering 60% of requirements. Diversified portfolio (Saffola, Nihar) provides offset. EBITDA margins resilient at 19.2%.",
      confidencePercent: 94,
      additionalFactors: [
        "Debt-free company",
        "ROE at 38%",
        "International business at 23% of revenue",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10266",
    name: "IL&FS Transportation Networks",
    natureOfBusiness: "Road Infrastructure BOT",
    created: "2026-02-18",
    riskLevel: "High",
    mostRiskElement: "NCLT resolution — defaulted entity",
    status: "Failed",
    processStatus: "Completed",
    tag: "Escalated",
    aiSuggestion: "Reject",
    aiInsight: {
      mostRiskyElement: "NCLT resolution — defaulted entity",
      riskExplanation:
        "Entity under NCLT resolution since 2018. Multiple bond defaults totalling ₹4,500 Cr. Resolution plan submitted but creditor recovery estimated at 28-32 cents on the dollar. Board superseded by government-appointed directors.",
      confidencePercent: 98,
      additionalFactors: [
        "All project SPVs classified as Red/Amber",
        "Multiple SFIO investigations ongoing",
        "Forensic audit revealed ₹2,100 Cr siphoning",
      ],
      networkRisk: { level: "HIGH", label: "Group-wide default cascade" },
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10267",
    name: "Godrej Properties Ltd",
    natureOfBusiness: "Real Estate — Residential",
    created: "2026-02-17",
    riskLevel: "Low",
    mostRiskElement: "Land bank concentration risk",
    status: "In Progress",
    processStatus: "Completed",
    tag: "Quick Review",
    aiSuggestion: "Quick Approve",
    aiInsight: {
      mostRiskyElement: "Land bank concentration risk",
      riskExplanation:
        "68% of upcoming launches concentrated in MMR and Bangalore. Regulatory delays possible in Mumbai redevelopment projects. Strong brand premium — 15-20% above micro-market peers. Pre-sales velocity excellent at ₹12,500 Cr.",
      confidencePercent: 88,
      additionalFactors: [
        "Net D/E at 0.42",
        "Collections at ₹10,800 Cr",
        "Zero promoter pledge",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10268",
    name: "Jet Airways (India) Ltd",
    natureOfBusiness: "Aviation",
    created: "2026-02-16",
    riskLevel: "High",
    mostRiskElement: "Post-NCLT revival uncertainty",
    status: "In Progress",
    processStatus: "Failed",
    tag: "Needs Investigation",
    aiInsight: {
      mostRiskyElement: "Post-NCLT revival uncertainty",
      riskExplanation:
        "NCLT-approved resolution plan by Jalan-Kalrock consortium facing execution delays. AOC revalidation pending. Only 5 aircraft operational vs plan of 50. Cash burn rate unsustainable without fresh equity infusion of ₹1,500 Cr.",
      confidencePercent: 42,
      additionalFactors: [
        "Historic creditor claims of ₹16,000 Cr",
        "Brand value severely eroded",
        "Slot allocation disputes at Mumbai airport",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10269",
    name: "Bajaj Finance Ltd",
    natureOfBusiness: "Consumer & SME Lending",
    created: "2026-02-15",
    riskLevel: "Low",
    mostRiskElement: "Unsecured loan concentration",
    status: "Completed",
    processStatus: "Completed",
    tag: "Cleared",
    aiInsight: {
      mostRiskyElement: "Unsecured loan concentration",
      riskExplanation:
        "Personal loans and consumer durable loans comprise 42% of AUM — inherently higher risk segment. However, GNPA at 0.95% is best-in-class. ECL provisioning at 180bps provides strong buffer. RBI microfinance norms fully complied.",
      confidencePercent: 96,
      additionalFactors: [
        "AUM at ₹3.1 Lakh Cr",
        "ROA at 4.6% — industry-leading",
        "Digital channel mix at 62%",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10270",
    name: "Suzlon Energy Ltd",
    natureOfBusiness: "Wind Energy Equipment",
    created: "2026-02-14",
    riskLevel: "Medium",
    mostRiskElement: "Debt restructuring history",
    status: "In Progress",
    processStatus: "Completed",
    tag: "Follow Up",
    aiInsight: {
      mostRiskyElement: "Debt restructuring history",
      riskExplanation:
        "Completed ₹14,000 Cr debt restructuring in 2020. Currently net-debt-free at operating company level. Order book at ₹18,600 Cr — strongest ever. However, execution track record patchy — 3 prior restructurings create governance concern.",
      confidencePercent: 73,
      additionalFactors: [
        "OPM improved to 11.4%",
        "Service revenue providing stability",
        "Promoter holding diluted to 14%",
      ],
    },
    source: "entity-dd",
  },
  {
    id: "CASE-10271",
    name: "Sapphire Foods India",
    natureOfBusiness: "QSR — KFC & Pizza Hut",
    created: "2026-02-13",
    riskLevel: "Low",
    mostRiskElement: "Franchise renewal risk",
    status: "In Progress",
    processStatus: "Completed",
    tag: "Quick Review",
    aiSuggestion: "Quick Approve",
    aiInsight: {
      mostRiskyElement: "Franchise renewal risk",
      riskExplanation:
        "Master franchise agreement with Yum! Brands expires 2039 — adequate runway. Store-level EBITDA margins at 22.5%. SSSG at 8% — healthy. Sri Lanka operations showing recovery post-crisis. No material litigation.",
      confidencePercent: 91,
      additionalFactors: [
        "Debt-free operations",
        "520 stores — 85 net additions in FY26",
        "Digital ordering at 55% of revenue",
      ],
    },
    source: "entity-dd",
  },
];
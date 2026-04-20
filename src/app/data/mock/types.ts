import type { RiskLevel, NetworkEntity, CaseSource } from "../cases";

// ─── Financial Parameters ───────────────────────────────────────────────────

export type DataSource = "MCA" | "Banking" | "GST" | "ITR" | "Netscan" | "Manual";

export interface AlternateSource {
  source: DataSource;
  value: number | string;
  unit?: string;
  deviationNote?: string; // 1-line AI commentary on why value differs from primary
}

export interface FinancialParameter {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  source: DataSource;
  priority: 1 | 2 | 3 | 4 | 5; // 5=Revenue/EBITDA (highest), 4=Quality/DSCR, 3=Leverage/WC, 2=Banking/Cash, 1=Other. 4 & 5 surface in Overview.
  trend?: "up" | "down" | "stable";
  trendValue?: number; // % change YoY
  aiCommentary?: string;
  benchmarkValue?: number;
  benchmarkLabel?: string;
  flagged?: boolean;
  // Multi-source display (per financial parameter prioritization framework)
  // Primary source is shown prominently; alternates shown as compact subtext with deviation note
  alternateSources?: AlternateSource[];
}

export interface YearlyFinancial {
  year: number; // For rendering on X-axis (e.g. 2017, FY17 etc depending on usage, currently a number like 2022)
  revenue: number;
  ebitda: number;
  netProfit: number;
  totalDebt: number;
  cashAndEquivalents: number;
  
  // Extended metrics for granular historic analysis
  inventory?: number;
  roe?: number;
  roce?: number;
  icr?: number;
  rpt?: number;
  debtToEquity?: number;
  equity?: number;
}

// ─── Litigation ──────────────────────────────────────────────────────────────

export type LitigationStatus =
  | "Pending"
  | "Disposed"
  | "Convicted"
  | "Acquitted"
  | "Under Investigation";

export interface LitigationRecord {
  id: string;
  caseNumber: string;
  offence: string;
  ipcSection: string;
  court: string;
  filingDate: string;
  status: LitigationStatus;
  maxPunishment: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  notes?: string;
}

export interface DirectorLitigation {
  name: string;
  din: string;
  designation: string;
  appointmentDate: string;
  litigations: LitigationRecord[];
}

// ─── Compliance / AML ────────────────────────────────────────────────────────

export type ComplianceStatus = "Clear" | "Flagged" | "Caution" | "Not Available";

export interface ComplianceCheck {
  category: string;
  label: string;
  status: ComplianceStatus;
  finding?: string;
  source: DataSource | "CrimeCheck" | "IDfy" | "RBI" | "SEBI" | "MCA";
  checkedOn: string;
}

// ─── Network ──────────────────────────────────────────────────────────────────

export interface NetworkNode extends NetworkEntity {
  cin?: string;
  incorporationDate?: string;
  registeredAddress?: string;
  relationship: "Subsidiary" | "Associate" | "Group Entity" | "Common Director" | "Promoter Entity";
  directors?: string[];   // Full director list for this entity
  aiSummary?: string;     // Per-node AI summary shown in popup
}

export type InsightAgainst = "company" | "director" | "network";

export interface InsightSourceDetail {
  label: string;       // e.g. "CrimeCheck · Verified Feb 2026"
  fields: { key: string; value: string }[];
}

export interface NetworkInsightCard {
  title: string;                  // Problem statement: "5 criminal cases via Mahafuz Khaan"
  subtext?: string;               // Optional one-liner — skip if title already says it
  severity: "critical" | "warning" | "info" | "positive";
  against: InsightAgainst;        // Determines sort order: company → director → network
  againstLabel?: string;          // Only for director/network: "Mahafuz Khaan · MD"
  source: string;                 // Short name: "CrimeCheck / IDfy"
  sourceDetails?: InsightSourceDetail;
}

export interface AINetworkInsight {
  summary: string;
  litigationFlag?: string;
  amlFlag?: string;
  pepFlag?: string;
  contagionRisk: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  contagionExplanation?: string;
  insightCards?: NetworkInsightCard[];
}

// ─── CAM Draft ───────────────────────────────────────────────────────────────

export interface CAMSection {
  title: string;
  content: string;
}

export interface CAMDraft {
  generatedOn: string;
  borrowerName: string;
  loanAmount?: number;
  purpose?: string;
  sections: CAMSection[];
  riskRating: "A" | "B" | "C" | "D" | "E";
  recommendation: "Approve" | "Reject" | "Conditional Approve" | "Refer to Credit Head";
  conditions?: string[];
  sharedWithCreditHead?: boolean;
  sharedOn?: string;
}

// ─── Documents ───────────────────────────────────────────────────────────────

export type DocumentType = "ITR" | "GST" | "Bank Statement" | "MCA Extract" | "KYC" | "Property Doc" | "Other";

export interface UploadedDocument {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  verified: boolean;
  verifiedBy?: DataSource;
  notes?: string;
}

// ─── Risk Triangulation ──────────────────────────────────────────────────────

export interface SourceReconciliation {
  metric: string;
  mcaValue?: string | number;
  gstValue?: string | number;
  itrValue?: string | number;
  bankingValue?: string | number;
  discrepancy: boolean;
  discrepancyNote?: string;
}

// ─── Rich Case Detail ────────────────────────────────────────────────────────

export interface RichCaseDetail {
  // Identity
  cin: string;
  pan?: string;
  incorporationDate: string;
  registeredAddress: string;
  industry: string;
  authorizedCapital?: number;
  paidUpCapital?: number;
  promoterHolding?: number;
  entityType?: "Private Limited" | "LLP" | "Partnership" | "Sole Proprietorship" | "Public Limited";

  // Network
  networkNodes: NetworkNode[];
  networkInsights: AINetworkInsight;

  // Financials
  financialParameters: FinancialParameter[];
  yearlyFinancials?: YearlyFinancial[];

  // Litigations (Tab 3)
  entityLitigations: LitigationRecord[];
  directorLitigations: DirectorLitigation[];

  // Compliance
  complianceChecks: ComplianceCheck[];

  // CAM Draft (Tab 4)
  camDraft: CAMDraft;

  // Documents (Tab 5)
  documents: UploadedDocument[];

  // Risk Triangulation (conditional - shown if docs uploaded + package supports it)
  sourceReconciliation?: SourceReconciliation[];
}

// ─── Rich Case Entry ─────────────────────────────────────────────────────────

export type RichCaseStatus =
  | "In Progress"
  | "Completed"
  | "Failed"
  | "Sent to Credit Head";

export interface RichCaseEntry {
  id: string;
  name: string;
  industry: string;
  created: string;
  riskLevel: RiskLevel;
  status: RichCaseStatus;
  source: CaseSource;
  aiSuggestion?: string;
  aiInsight: {
    summary: string;
    topRisk: string;
    confidencePercent: number;
    factors: string[];
    networkRisk?: { level: "HIGH" | "MEDIUM" | "LOW"; label: string };
  };
  detail: RichCaseDetail;
}

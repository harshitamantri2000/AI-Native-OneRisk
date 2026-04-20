import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  ShieldX,
  ShieldAlert,
  ShieldCheck,
  Users,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Scale,
  Activity,
  Banknote,
  BarChart3,
  Landmark,
  FileText,
  CreditCard,
  Percent,
  BadgeCheck,
  ClipboardList,
  Download,
  Check,
  X,
  CheckCircle2,
  XCircle,
  Ban,
  ArrowRightLeft,
} from "lucide-react";
import { MOCK_CASES, type CaseEntry, type RiskLevel } from "../data/cases";
import { CopilotChat } from "./CopilotChat";
import { OverviewTab } from "./OverviewTab";

const fontBase = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
};

const formatCurrency = (val: number): string => {
  if (Math.abs(val) >= 10000000000) return `${(val / 10000000).toFixed(0)} Cr`;
  if (Math.abs(val) >= 10000000) return `${(val / 10000000).toFixed(1)} Cr`;
  if (Math.abs(val) >= 100000) return `${(val / 100000).toFixed(1)} L`;
  return val.toLocaleString("en-IN");
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const glowMap: Record<RiskLevel, { glow: string; accent: string; glowRgba: string }> = {
  Low: {
    glow: "rgba(76, 175, 71, 0.25)",
    accent: "var(--success-500)",
    glowRgba: "76, 175, 71",
  },
  Medium: {
    glow: "rgba(203, 113, 0, 0.25)",
    accent: "var(--warning-600)",
    glowRgba: "203, 113, 0",
  },
  High: {
    glow: "rgba(226, 51, 24, 0.25)",
    accent: "var(--destructive-500)",
    glowRgba: "226, 51, 24",
  },
};

/* ─── Shared Section Card ─── */
const GlassCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
    className={`rounded-2xl overflow-hidden ${className}`}
    style={{
      backgroundColor: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      boxShadow: "var(--shadow-card)",
    }}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      ...fontBase,
      fontSize: "10px",
      lineHeight: "140%",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-muted-themed)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    }}
  >
    {children}
  </span>
);

/* ─── Metric Pill ─── */
const MetricPill = ({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-xl" style={{ backgroundColor: "var(--surface-inset)", border: "1px solid var(--border-default)" }}>
    <div className="flex items-center gap-1.5">
      {icon}
      <span style={{ ...fontBase, fontSize: "10px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
    <span style={{ ...fontBase, fontSize: "16px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: accent || "var(--text-heading)" }}>
      {value}
    </span>
  </div>
);

export const CaseDetailPage = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "financials" | "directors" | "cam">("overview");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [caseDecision, setCaseDecision] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: "success" | "destructive" | "info" } | null>(null);

  const fireToast = (message: string, type: "success" | "destructive" | "info") => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3200);
  };

  const caseData = MOCK_CASES.find((c) => c.id === caseId);

  if (!caseData) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: "var(--app-bg)" }}>
        <span style={{ ...fontBase, fontSize: "16px", color: "var(--text-secondary-themed)" }}>Case not found</span>
      </div>
    );
  }

  const g = glowMap[caseData.riskLevel];
  const detail = caseData.detail;
  const financials = detail?.financials;

  const statusConfig: Record<string, { dot: string; color: string }> = {
    New: { dot: "var(--primary)", color: "var(--primary)" },
    Approved: { dot: "var(--success-500)", color: "var(--success-700)" },
    Rejected: { dot: "var(--destructive-500)", color: "var(--destructive-700)" },
    "On Hold": { dot: "var(--warning-600)", color: "var(--warning-700)" },
    "Expert Review": { dot: "var(--info-600)", color: "var(--info-600)" },
  };
  const sc = statusConfig[caseData.status] || { dot: "var(--text-muted-themed)", color: "var(--text-muted-themed)" };

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "financials" as const, label: "Financials" },
    { key: "directors" as const, label: "Directors" },
    { key: "cam" as const, label: "Credit Analysis" },
  ];

  const confidenceColor =
    caseData.aiInsight.confidencePercent >= 85 ? "var(--primary)" :
    caseData.aiInsight.confidencePercent >= 60 ? "var(--warning-600)" :
    "var(--destructive-500)";

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ backgroundColor: "var(--surface-card)" }}>
      {/* Breadcrumb */}
      <div
        className="flex items-center px-4 shrink-0 relative z-10"
        style={{
          height: 32,
          backgroundColor: "var(--surface-card)",
          borderBottom: "1px solid var(--neutral-100)",
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "12px",
            lineHeight: "1.3",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-muted-themed)",
            letterSpacing: "0.048px",
          }}
        >
          Search Terminal
        </span>
        <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className="shrink-0">
          <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="var(--sidebar-icon-color)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "12px",
            lineHeight: "1.3",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-muted-themed)",
            letterSpacing: "0.048px",
          }}
        >
          Cases
        </span>
        <svg width="14" height="14" fill="none" viewBox="0 0 14 14" className="shrink-0">
          <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="var(--sidebar-icon-color)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "12px",
            lineHeight: "1.3",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-heading)",
            letterSpacing: "0.048px",
          }}
        >
          {caseData.name}
        </span>
        {/* Version Switcher */}
        <button
          onClick={() => navigate(`/analysis-2/case/${caseId}`)}
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-all"
          style={{
            backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--primary) 16%, transparent)",
            ...fontBase,
            fontSize: "11px",
            lineHeight: "1",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--primary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 16%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 8%, transparent)";
          }}
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>Analysis V1</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ opacity: 0.6 }}>Switch to V2</span>
        </button>
      </div>

      {/* Subtle background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: "var(--ambient-glow-opacity)",
          backgroundImage:
            "linear-gradient(var(--grid-line-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line-color) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top ambient glow */}
      <div
        className="fixed top-0 left-0 right-0 h-[300px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(${g.glowRgba}, var(--ambient-glow-opacity)) 0%, transparent 100%)`,
        }}
      />

      {/* Header bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex items-center gap-5 px-4 py-3"
        style={{ backgroundColor: "var(--surface-card)" }}
      >
        <button
          onClick={() => navigate("/flow2")}
          className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: "var(--surface-hover)", border: "1px solid var(--border-default)" }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: "var(--text-secondary-themed)" }} />
        </button>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span style={{ ...fontBase, fontSize: "16px", lineHeight: "1.4", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
              {caseData.name}
            </span>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: g.accent, height: "24px" }}
            >
              {caseData.riskLevel === "High" ? <ShieldX className="w-3 h-3" style={{ color: "var(--text-on-color)" }} /> :
               caseData.riskLevel === "Medium" ? <ShieldAlert className="w-3 h-3" style={{ color: "var(--text-on-color)" }} /> :
               <ShieldCheck className="w-3 h-3" style={{ color: "var(--text-on-color)" }} />}
              <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: "var(--text-on-color)" }}>
                {caseData.riskLevel} Risk
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
              <span style={{ ...fontBase, fontSize: "12px", lineHeight: "1", fontWeight: "var(--font-weight-normal)", color: sc.color }}>
                {caseData.status}
              </span>
            </div>
          </div>
          <span style={{ ...fontBase, fontSize: "12px", lineHeight: "1.5", fontWeight: "var(--font-weight-normal)", color: "var(--text-muted-themed)" }}>
            {caseData.natureOfBusiness}{detail?.incorporationDate ? ` · Est. ${new Date(detail.incorporationDate).getFullYear()}` : ""}{detail?.cin ? ` | CIN: ${detail.cin}` : ""}
          </span>
        </div>

        {/* AI confidence mini badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--surface-inset)", border: "1px solid var(--border-default)" }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--info-400)" }} />
          <span style={{ ...fontBase, fontSize: "13px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: confidenceColor }}>
            {caseData.aiInsight.confidencePercent}%
          </span>
          <span style={{ ...fontBase, fontSize: "10px", lineHeight: "1", fontWeight: "var(--font-weight-normal)", color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            AI
          </span>
        </div>

      </motion.header>

      {/* Tab navigation */}
      <div className="relative z-10 flex items-center gap-1 px-6 py-2" style={{ borderBottom: "1px solid var(--border-default)", backgroundColor: "var(--surface-card)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-4 py-2 rounded-lg cursor-pointer transition-colors"
            style={{
              backgroundColor: activeTab === tab.key ? "var(--surface-active)" : "transparent",
              border: "none",
            }}
          >
            <span
              style={{
                ...fontBase,
                fontSize: "13px",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                color: activeTab === tab.key ? "var(--text-heading)" : "var(--text-muted-themed)",
              }}
            >
              {tab.label}
            </span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                style={{ background: `linear-gradient(90deg, ${g.accent}, var(--info-400))` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex-1 min-h-0"
        style={{
          overflow: "auto",
          padding: activeTab === "overview" ? "0" : "16px 20px",
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewTab caseData={caseData} onTabChange={setActiveTab} />
          )}

          {activeTab === "financials" && financials && (
            <motion.div
              key="financials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              <GlassCard delay={0.05}>
                <div
                  className="flex items-center gap-2.5 px-5 py-3"
                  style={{ borderBottom: "1px solid var(--border-default)", background: `linear-gradient(135deg, var(--header-gradient-from) 0%, transparent 100%)` }}
                >
                  <Banknote className="w-4 h-4" style={{ color: "var(--text-secondary-themed)" }} />
                  <span style={{ ...fontBase, fontSize: "14px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
                    Income Statement
                  </span>
                </div>
                <div className="px-5 py-4 grid grid-cols-3 gap-3">
                  <MetricPill label="Revenue" value={formatCurrency(financials.revenue)} icon={<Banknote className="w-3 h-3" style={{ color: "var(--text-muted-themed)" }} />} />
                  <MetricPill label="Revenue YoY" value={`${financials.revenueChange > 0 ? "+" : ""}${financials.revenueChange}%`} accent={financials.revenueChange >= 0 ? "var(--success-500)" : "var(--destructive-500)"} icon={financials.revenueChange >= 0 ? <TrendingUp className="w-3 h-3" style={{ color: "var(--success-500)" }} /> : <TrendingDown className="w-3 h-3" style={{ color: "var(--destructive-500)" }} />} />
                  <MetricPill label="EBITDA" value={formatCurrency(financials.ebitda)} accent={financials.ebitda >= 0 ? "var(--success-500)" : "var(--destructive-500)"} icon={<Activity className="w-3 h-3" style={{ color: "var(--text-muted-themed)" }} />} />
                  <MetricPill label="EBITDA Margin" value={`${financials.ebitdaMargin}%`} accent={financials.ebitdaMargin >= 15 ? "var(--success-500)" : financials.ebitdaMargin >= 0 ? "var(--warning-600)" : "var(--destructive-500)"} />
                  <MetricPill label="Net Profit" value={formatCurrency(financials.netProfit)} accent={financials.netProfit >= 0 ? "var(--success-500)" : "var(--destructive-500)"} />
                  <MetricPill label="Cash Flow" value={formatCurrency(financials.cashFlow)} accent={financials.cashFlow >= 0 ? "var(--success-500)" : "var(--destructive-500)"} />
                </div>
              </GlassCard>

              <GlassCard delay={0.1}>
                <div
                  className="flex items-center gap-2.5 px-5 py-3"
                  style={{ borderBottom: "1px solid var(--border-default)", background: `linear-gradient(135deg, var(--header-gradient-from) 0%, transparent 100%)` }}
                >
                  <Landmark className="w-4 h-4" style={{ color: "var(--text-secondary-themed)" }} />
                  <span style={{ ...fontBase, fontSize: "14px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
                    Balance Sheet Ratios
                  </span>
                </div>
                <div className="px-5 py-4 grid grid-cols-4 gap-3">
                  <MetricPill label="D/E Ratio" value={financials.debtToEquity.toFixed(2)} accent={financials.debtToEquity <= 1 ? "var(--success-500)" : financials.debtToEquity <= 3 ? "var(--warning-600)" : "var(--destructive-500)"} icon={<Scale className="w-3 h-3" style={{ color: "var(--text-muted-themed)" }} />} />
                  <MetricPill label="Current Ratio" value={financials.currentRatio.toFixed(2)} accent={financials.currentRatio >= 1.5 ? "var(--success-500)" : financials.currentRatio >= 1 ? "var(--warning-600)" : "var(--destructive-500)"} />
                  <MetricPill label="Interest Coverage" value={`${financials.interestCoverage}x`} accent={financials.interestCoverage >= 3 ? "var(--success-500)" : financials.interestCoverage >= 1.5 ? "var(--warning-600)" : "var(--destructive-500)"} />
                  <MetricPill label="Total Debt" value={formatCurrency(financials.totalDebt)} />
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "directors" && detail && (
            <motion.div
              key="directors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {detail.directors.map((director, i) => (
                <GlassCard key={director.din} delay={0.05 * (i + 1)}>
                  <div
                    className="flex items-center gap-2.5 px-5 py-3"
                    style={{
                      borderBottom: "1px solid var(--border-default)",
                      background: director.criminalCases && director.criminalCases.length > 0
                        ? `linear-gradient(135deg, rgba(${g.glowRgba}, 0.06) 0%, transparent 100%)`
                        : `linear-gradient(135deg, var(--header-gradient-from) 0%, transparent 100%)`,
                    }}
                  >
                    <Users className="w-4 h-4" style={{ color: director.criminalCases ? g.accent : "var(--text-secondary-themed)" }} />
                    <span style={{ ...fontBase, fontSize: "14px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
                      {director.name}
                    </span>
                    {director.criminalCases && director.criminalCases.length > 0 && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ml-2"
                        style={{
                          ...fontBase,
                          fontSize: "10px",
                          lineHeight: "140%",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--destructive-500)",
                          backgroundColor: "rgba(226, 51, 24, 0.08)",
                          border: "1px solid rgba(226, 51, 24, 0.2)",
                        }}
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {director.criminalCases.length} Criminal Case{director.criminalCases.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="px-5 py-4 flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-3">
                      <InfoRow label="DIN" value={director.din} />
                      <InfoRow label="Designation" value={director.designation} />
                      <InfoRow label="Appointed" value={formatDate(director.appointmentDate)} />
                    </div>

                    {director.criminalCases && director.criminalCases.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        <SectionLabel>Criminal Cases</SectionLabel>
                        {director.criminalCases.map((cc) => (
                          <div
                            key={cc.caseNumber}
                            className="flex flex-col gap-2 p-3 rounded-xl"
                            style={{
                              backgroundColor: `rgba(${g.glowRgba}, 0.04)`,
                              border: `1px solid rgba(${g.glowRgba}, 0.12)`,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
                                {cc.offence}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ ...fontBase, fontSize: "10px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--warning-600)", backgroundColor: "rgba(203, 113, 0, 0.1)", border: "1px solid rgba(203, 113, 0, 0.2)" }}>
                                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--warning-600)" }} />
                                {cc.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                              <CaseInfoChip label="Section" value={cc.section} />
                              <CaseInfoChip label="Case No." value={cc.caseNumber} />
                              <CaseInfoChip label="Max Punishment" value={cc.maxPunishment} accent="var(--destructive-500)" />
                            </div>
                            <span style={{ ...fontBase, fontSize: "11px", lineHeight: "140%", fontWeight: "var(--font-weight-normal)", color: "var(--text-muted-themed)" }}>
                              {cc.court}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {activeTab === "cam" && detail && (
            <motion.div
              key="cam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* CAM Header Summary */}
              <GlassCard delay={0.05}>
                <div
                  className="flex items-center gap-2.5 px-5 py-3"
                  style={{ borderBottom: "1px solid var(--border-default)", background: "linear-gradient(135deg, rgba(23,102,214,0.06) 0%, transparent 100%)" }}
                >
                  <FileText className="w-4 h-4" style={{ color: "var(--primary)", opacity: 0.8 }} />
                  <span style={{ ...fontBase, fontSize: "14px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
                    Credit Assessment Memorandum
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ml-auto"
                    style={{ ...fontBase, fontSize: "10px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--info-600)", backgroundColor: "rgba(92, 212, 230, 0.08)", border: "1px solid rgba(92, 212, 230, 0.2)" }}
                  >
                    <BadgeCheck className="w-2.5 h-2.5" />
                    Draft
                  </span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <InfoRow label="Borrower" value={caseData.name} />
                    <InfoRow label="CIN" value={detail.cin} />
                    <InfoRow label="Industry" value={caseData.natureOfBusiness} />
                    <InfoRow label="Constitution" value="Private Limited Company" />
                    <InfoRow label="Date of Incorporation" value={formatDate(detail.incorporationDate)} />
                    <InfoRow label="Registered Office" value={detail.registeredAddress} />
                  </div>
                </div>
              </GlassCard>

              {/* Facility Details */}
              <GlassCard delay={0.1}>
                <div
                  className="flex items-center gap-2.5 px-5 py-3"
                  style={{ borderBottom: "1px solid var(--border-default)", background: `linear-gradient(135deg, var(--header-gradient-from) 0%, transparent 100%)` }}
                >
                  <CreditCard className="w-4 h-4" style={{ color: "var(--text-secondary-themed)" }} />
                  <span style={{ ...fontBase, fontSize: "14px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
                    Facility Details
                  </span>
                </div>
                <div className="px-5 py-4">
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
                    <div className="grid grid-cols-5 gap-0 px-4 py-2.5" style={{ backgroundColor: "var(--surface-inset)", borderBottom: "1px solid var(--border-default)" }}>
                      {["Facility Type", "Proposed Limit", "Existing Limit", "Tenure", "Security"].map((h) => (
                        <span key={h} style={{ ...fontBase, fontSize: "10px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {h}
                        </span>
                      ))}
                    </div>
                    {[
                      { type: "Cash Credit", proposed: formatCurrency(financials ? financials.revenue * 0.2 : 50000000), existing: formatCurrency(financials ? financials.revenue * 0.15 : 40000000), tenure: "12 Months", security: "Stock & Debtors" },
                      { type: "Term Loan", proposed: formatCurrency(financials ? financials.totalDebt * 0.6 : 100000000), existing: formatCurrency(financials ? financials.totalDebt * 0.5 : 80000000), tenure: "60 Months", security: "Fixed Assets" },
                      { type: "Bank Guarantee", proposed: formatCurrency(financials ? financials.revenue * 0.05 : 10000000), existing: "\u2014", tenure: "24 Months", security: "FD Margin 10%" },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-5 gap-0 px-4 py-2.5" style={{ borderBottom: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
                        <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>{row.type}</span>
                        <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-normal)", color: "var(--info-600)" }}>{row.proposed}</span>
                        <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-normal)", color: "var(--text-secondary-themed)" }}>{row.existing}</span>
                        <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-normal)", color: "var(--text-secondary-themed)" }}>{row.tenure}</span>
                        <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-normal)", color: "var(--text-secondary-themed)" }}>{row.security}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Financial Highlights for CAM */}
              {financials && (
                <GlassCard delay={0.15}>
                  <div
                    className="flex items-center gap-2.5 px-5 py-3"
                    style={{ borderBottom: "1px solid var(--border-default)", background: `linear-gradient(135deg, var(--header-gradient-from) 0%, transparent 100%)` }}
                  >
                    <Percent className="w-4 h-4" style={{ color: "var(--text-secondary-themed)" }} />
                    <span style={{ ...fontBase, fontSize: "14px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
                      Key Financial Indicators
                    </span>
                  </div>
                  <div className="px-5 py-4 grid grid-cols-4 gap-3">
                    <MetricPill label="Net Worth" value={formatCurrency(financials.netWorth)} icon={<Landmark className="w-3 h-3" style={{ color: "var(--text-muted-themed)" }} />} />
                    <MetricPill label="Total Debt" value={formatCurrency(financials.totalDebt)} />
                    <MetricPill label="DSCR" value={financials.interestCoverage >= 1.5 ? `${(financials.interestCoverage * 0.8).toFixed(2)}x` : `${(financials.interestCoverage * 0.6).toFixed(2)}x`} accent={financials.interestCoverage >= 2 ? "var(--success-500)" : financials.interestCoverage >= 1.2 ? "var(--warning-600)" : "var(--destructive-500)"} />
                    <MetricPill label="TOL/TNW" value={(financials.totalDebt / Math.max(financials.netWorth, 1)).toFixed(2)} accent={(financials.totalDebt / Math.max(financials.netWorth, 1)) <= 3 ? "var(--success-500)" : "var(--destructive-500)"} />
                  </div>
                </GlassCard>
              )}

              {/* Risk Assessment & Recommendation */}
              <GlassCard delay={0.2}>
                <div
                  className="flex items-center gap-2.5 px-5 py-3"
                  style={{ borderBottom: "1px solid var(--border-default)", background: `linear-gradient(135deg, rgba(${g.glowRgba}, 0.06) 0%, transparent 100%)` }}
                >
                  <ClipboardList className="w-4 h-4" style={{ color: g.accent, opacity: 0.8 }} />
                  <span style={{ ...fontBase, fontSize: "14px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>
                    Assessment & Recommendation
                  </span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <SectionLabel>Internal Risk Grading</SectionLabel>
                    <div className="flex items-center gap-3">
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: `rgba(${g.glowRgba}, 0.1)`, border: `1px solid rgba(${g.glowRgba}, 0.2)` }}
                      >
                        {caseData.riskLevel === "High" ? <ShieldX className="w-4 h-4" style={{ color: g.accent }} /> :
                         caseData.riskLevel === "Medium" ? <ShieldAlert className="w-4 h-4" style={{ color: g.accent }} /> :
                         <ShieldCheck className="w-4 h-4" style={{ color: g.accent }} />}
                        <span style={{ ...fontBase, fontSize: "14px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: g.accent }}>
                          {caseData.riskLevel === "Low" ? "CR-1 (Low Risk)" : caseData.riskLevel === "Medium" ? "CR-4 (Moderate Risk)" : "CR-7 (High Risk)"}
                        </span>
                      </div>
                      <span style={{ ...fontBase, fontSize: "12px", lineHeight: "140%", fontWeight: "var(--font-weight-normal)", color: "var(--text-muted-themed)" }}>
                        AI Confidence: {caseData.aiInsight.confidencePercent}%
                      </span>
                    </div>
                  </div>

                  <div className="h-px" style={{ background: "linear-gradient(90deg, transparent 0%, var(--border-default) 50%, transparent 100%)" }} />

                  <div className="flex flex-col gap-2">
                    <SectionLabel>Credit Committee Recommendation</SectionLabel>
                    <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ backgroundColor: "var(--surface-inset)", border: "1px solid var(--border-default)" }}>
                      <p style={{ ...fontBase, fontSize: "13px", lineHeight: "160%", fontWeight: "var(--font-weight-normal)", color: "var(--text-body)", margin: 0 }}>
                        {caseData.riskLevel === "Low"
                          ? `Based on the credit appraisal, the proposal for ${caseData.name} is recommended for approval. The entity demonstrates stable financial performance with adequate cash flows and acceptable leverage ratios. Standard monitoring protocols to be followed.`
                          : caseData.riskLevel === "Medium"
                          ? `The proposal for ${caseData.name} requires enhanced scrutiny. While the entity shows adequate business fundamentals, the identified risk factors warrant additional safeguards including quarterly review, enhanced collateral coverage, and covenant monitoring before approval.`
                          : `The proposal for ${caseData.name} carries significant credit risk. ${caseData.aiInsight.riskExplanation} It is recommended to defer approval pending resolution of key risk triggers, enhanced due diligence, and management discussion. Escalation to Chief Risk Officer advised.`}
                      </p>
                    </div>
                  </div>

                  <div className="h-px" style={{ background: "linear-gradient(90deg, transparent 0%, var(--border-default) 50%, transparent 100%)" }} />

                  <div className="flex flex-col gap-2">
                    <SectionLabel>Key Conditions & Covenants</SectionLabel>
                    <div className="flex flex-col gap-1.5">
                      {(caseData.riskLevel === "High"
                        ? [
                            "Personal guarantee of all promoter directors",
                            "Quarterly stock audit by bank-approved auditor",
                            "Minimum DSCR of 1.25x to be maintained",
                            "No dividend declaration without prior bank approval",
                            "Monthly submission of provisional financials",
                            "Collateral cover ratio of minimum 1.5x",
                          ]
                        : caseData.riskLevel === "Medium"
                        ? [
                            "Personal guarantee of managing director",
                            "Half-yearly stock audit",
                            "Minimum current ratio of 1.2x",
                            "Quarterly submission of financial statements",
                            "Insurance of all hypothecated assets",
                          ]
                        : [
                            "Annual review of financial statements",
                            "Insurance of all hypothecated assets",
                            "Information of any material change in management",
                            "Compliance with statutory obligations",
                          ]
                      ).map((condition, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "var(--info-400)" }} />
                          <span style={{ ...fontBase, fontSize: "12px", lineHeight: "160%", fontWeight: "var(--font-weight-normal)", color: "var(--text-secondary-themed)" }}>
                            {condition}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Sticky Action Bar — Download CAM / Approve / Reject ═══ */}
      <AnimatePresence>
        {caseDecision === null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-20 flex items-center gap-4 px-6 py-3 flex-shrink-0"
            style={{
              backgroundColor: "var(--surface-card)",
              borderTop: "1px solid var(--border-default)",
              boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {/* Left: label */}
            <div className="flex items-center gap-2.5 mr-auto">
              <FileText className="w-4 h-4" style={{ color: "var(--primary)", opacity: 0.8 }} />
              <span
                style={{
                  ...fontBase,
                  fontSize: "12px",
                  lineHeight: "1",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-secondary-themed)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.04em",
                }}
              >
                Case Decision
              </span>
              <span
                style={{
                  ...fontBase,
                  fontSize: "11px",
                  lineHeight: "1.4",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--text-muted-themed)",
                }}
              >
                Download the CAM report, then approve or reject this case
              </span>
            </div>

            {/* Download CAM */}
            <button
              onClick={() => {
                const camContent = generateDetailCAM(caseData);
                const blob = new Blob([camContent], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `CAM_${caseData.id}_${caseData.name.replace(/\s+/g, "_")}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                fireToast(`${caseData.name} — CAM downloaded`, "info");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)",
                border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
                color: "var(--primary)",
                ...fontBase,
                fontSize: "13px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-medium)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 16%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 8%, transparent)";
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Download CAM
            </button>

            {/* Approve */}
            <button
              onClick={() => {
                setCaseDecision("approved");
                fireToast(`${caseData.name} — Case approved`, "success");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: "var(--success-500)",
                border: "none",
                color: "var(--neutral-0)",
                ...fontBase,
                fontSize: "13px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-medium)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--success-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--success-500)";
              }}
            >
              <Check className="w-3.5 h-3.5" />
              Approve Case
            </button>

            {/* Reject */}
            <button
              onClick={() => {
                setCaseDecision("rejected");
                fireToast(`${caseData.name} — Case rejected`, "destructive");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary-themed)",
                ...fontBase,
                fontSize: "13px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-medium)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--destructive-500) 6%, transparent)";
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--destructive-500) 20%, transparent)";
                e.currentTarget.style.color = "var(--destructive-500)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.color = "var(--text-secondary-themed)";
              }}
            >
              <X className="w-3.5 h-3.5" />
              Reject Case
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision confirmed banner */}
      <AnimatePresence>
        {caseDecision && caseDecision !== "pending" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 flex items-center gap-3 px-6 py-3 flex-shrink-0"
            style={{
              backgroundColor: caseDecision === "approved"
                ? "color-mix(in srgb, var(--success-500) 6%, var(--surface-card))"
                : "color-mix(in srgb, var(--destructive-500) 6%, var(--surface-card))",
              borderTop: `1px solid ${caseDecision === "approved" ? "color-mix(in srgb, var(--success-500) 20%, var(--border-default))" : "color-mix(in srgb, var(--destructive-500) 20%, var(--border-default))"}`,
            }}
          >
            {caseDecision === "approved" ? (
              <CheckCircle2 className="w-4 h-4" style={{ color: "var(--success-500)" }} />
            ) : (
              <XCircle className="w-4 h-4" style={{ color: "var(--destructive-500)" }} />
            )}
            <span
              style={{
                ...fontBase,
                fontSize: "13px",
                lineHeight: "1.4",
                fontWeight: "var(--font-weight-medium)",
                color: caseDecision === "approved" ? "var(--success-700)" : "var(--destructive-500)",
              }}
            >
              {caseDecision === "approved"
                ? `${caseData.name} has been approved`
                : `${caseData.name} has been rejected`}
            </span>
            <button
              onClick={() => {
                setCaseDecision(null);
                fireToast("Decision reverted", "info");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-all ml-auto"
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary-themed)",
                ...fontBase,
                fontSize: "12px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-medium)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl"
            style={{
              backgroundColor: "var(--surface-card)",
              border: `1px solid ${showToast.type === "success" ? "var(--success-500)" : showToast.type === "info" ? "var(--info-500)" : "var(--destructive-500)"}`,
              boxShadow: "var(--shadow-elevated)",
            }}
          >
            {showToast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" style={{ color: "var(--success-500)" }} />
            ) : showToast.type === "info" ? (
              <FileText className="w-4 h-4" style={{ color: "var(--info-500)" }} />
            ) : (
              <XCircle className="w-4 h-4" style={{ color: "var(--destructive-500)" }} />
            )}
            <span
              style={{
                ...fontBase,
                fontSize: "13px",
                lineHeight: "1.4",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              {showToast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <CopilotChat
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onToggle={() => setIsCopilotOpen(!isCopilotOpen)}
        caseData={caseData}
        accentColor={g.accent}
        glowRgba={g.glowRgba}
      />
    </div>
  );
};

/* ─── Small helpers ─── */
const InfoRow = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
  <div className="flex flex-col gap-0.5">
    <span style={{ ...fontBase, fontSize: "10px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
      {label}
    </span>
    <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-normal)", color: accent || "var(--text-heading)" }}>
      {value}
    </span>
  </div>
);

const CaseInfoChip = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
  <div className="flex items-center gap-1.5">
    <span style={{ ...fontBase, fontSize: "10px", lineHeight: "140%", fontWeight: "var(--font-weight-normal)", color: "var(--text-muted-themed)" }}>
      {label}:
    </span>
    <span style={{ ...fontBase, fontSize: "11px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: accent || "var(--text-secondary-themed)" }}>
      {value}
    </span>
  </div>
);

/* ─── CAM Report Generation ─── */
const generateDetailCAM = (caseData: CaseEntry) => {
  const detail = caseData.detail;
  const financials = detail?.financials;

  const camContent = `
Credit Assessment Memorandum for ${caseData.name}

1. Borrower Information:
   - Name: ${caseData.name}
   - CIN: ${detail?.cin}
   - Industry: ${caseData.natureOfBusiness}
   - Constitution: Private Limited Company
   - Date of Incorporation: ${formatDate(detail?.incorporationDate || "")}
   - Registered Office: ${detail?.registeredAddress}

2. Facility Details:
   - Cash Credit:
     - Proposed Limit: ${formatCurrency(financials ? financials.revenue * 0.2 : 50000000)}
     - Existing Limit: ${formatCurrency(financials ? financials.revenue * 0.15 : 40000000)}
     - Tenure: 12 Months
     - Security: Stock & Debtors
   - Term Loan:
     - Proposed Limit: ${formatCurrency(financials ? financials.totalDebt * 0.6 : 100000000)}
     - Existing Limit: ${formatCurrency(financials ? financials.totalDebt * 0.5 : 80000000)}
     - Tenure: 60 Months
     - Security: Fixed Assets
   - Bank Guarantee:
     - Proposed Limit: ${formatCurrency(financials ? financials.revenue * 0.05 : 10000000)}
     - Existing Limit: N/A
     - Tenure: 24 Months
     - Security: FD Margin 10%

3. Key Financial Indicators:
   - Net Worth: ${formatCurrency(financials ? financials.netWorth : 0)}
   - Total Debt: ${formatCurrency(financials ? financials.totalDebt : 0)}
   - DSCR: ${financials ? (financials.interestCoverage >= 1.5 ? `${(financials.interestCoverage * 0.8).toFixed(2)}x` : `${(financials.interestCoverage * 0.6).toFixed(2)}x`) : "N/A"}
   - TOL/TNW: ${financials ? (financials.totalDebt / Math.max(financials.netWorth, 1)).toFixed(2) : "N/A"}

4. Risk Assessment & Recommendation:
   - Internal Risk Grading: ${caseData.riskLevel === "Low" ? "CR-1 (Low Risk)" : caseData.riskLevel === "Medium" ? "CR-4 (Moderate Risk)" : "CR-7 (High Risk)"}
   - AI Confidence: ${caseData.aiInsight.confidencePercent}%
   - Credit Committee Recommendation:
     ${caseData.riskLevel === "Low"
       ? `Based on the credit appraisal, the proposal for ${caseData.name} is recommended for approval. The entity demonstrates stable financial performance with adequate cash flows and acceptable leverage ratios. Standard monitoring protocols to be followed.`
       : caseData.riskLevel === "Medium"
       ? `The proposal for ${caseData.name} requires enhanced scrutiny. While the entity shows adequate business fundamentals, the identified risk factors warrant additional safeguards including quarterly review, enhanced collateral coverage, and covenant monitoring before approval.`
       : `The proposal for ${caseData.name} carries significant credit risk. ${caseData.aiInsight.riskExplanation} It is recommended to defer approval pending resolution of key risk triggers, enhanced due diligence, and management discussion. Escalation to Chief Risk Officer advised.`}
   - Key Conditions & Covenants:
     ${(caseData.riskLevel === "High"
       ? [
           "Personal guarantee of all promoter directors",
           "Quarterly stock audit by bank-approved auditor",
           "Minimum DSCR of 1.25x to be maintained",
           "No dividend declaration without prior bank approval",
           "Monthly submission of provisional financials",
           "Collateral cover ratio of minimum 1.5x",
         ]
       : caseData.riskLevel === "Medium"
       ? [
           "Personal guarantee of managing director",
           "Half-yearly stock audit",
           "Minimum current ratio of 1.2x",
           "Quarterly submission of financial statements",
           "Insurance of all hypothecated assets",
         ]
       : [
           "Annual review of financial statements",
           "Insurance of all hypothecated assets",
           "Information of any material change in management",
           "Compliance with statutory obligations",
         ]
     ).map((condition) => `   - ${condition}`).join("\n")}

5. Directors:
   ${(detail?.directors || []).map((director) => `
   - Name: ${director.name}
     - DIN: ${director.din}
     - Designation: ${director.designation}
     - Appointed: ${formatDate(director.appointmentDate)}
     - Criminal Cases: ${director.criminalCases && director.criminalCases.length > 0 ? director.criminalCases.map((cc) => `
       - Case Number: ${cc.caseNumber}
         - Offence: ${cc.offence}
         - Status: ${cc.status}
         - Section: ${cc.section}
         - Max Punishment: ${cc.maxPunishment}
         - Court: ${cc.court}
     `).join("\n") : "None"}
   `).join("\n")}
`;

  return camContent;
};
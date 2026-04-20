import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  ShieldX,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Check,
  X,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Scale,
  Users,
  Gavel,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Network,
  Download,
  FileCheck2,
  Ban,
  FileText,
} from "lucide-react";
import { MOCK_CASES, type CaseEntry, type RiskLevel } from "../data/cases";

/* ─── Helpers ─── */
const formatCurrency = (val: number): string => {
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 10000000000) return `${sign}${(abs / 10000000).toFixed(0)} Cr`;
  if (abs >= 10000000) return `${sign}${(abs / 10000000).toFixed(1)} Cr`;
  if (abs >= 100000) return `${sign}${(abs / 100000).toFixed(1)} L`;
  return `${sign}${abs.toLocaleString("en-IN")}`;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type ActionState = "pending" | "approved" | "rejected";

type HighRiskStage = "pending_investigation" | "cam_ready" | "approved" | "closed";

export const CaseTriagePage = () => {
  const navigate = useNavigate();
  const [actionStates, setActionStates] = useState<
    Record<string, ActionState>
  >({});
  const [highRiskStages, setHighRiskStages] = useState<
    Record<string, HighRiskStage>
  >({
    // Pre-seed one case as CAM-ready to demonstrate the post-CAM UI
    "CASE-10235": "cam_ready",
  });
  const [expandedQuickCase, setExpandedQuickCase] = useState<string | null>(
    null
  );
  const [showToast, setShowToast] = useState<{
    message: string;
    type: "success" | "destructive" | "info";
  } | null>(null);

  const highRiskCases = useMemo(
    () => MOCK_CASES.filter((c) => c.riskLevel === "High"),
    []
  );
  const quickReviewCases = useMemo(
    () => MOCK_CASES.filter((c) => c.riskLevel !== "High"),
    []
  );

  const fireToast = (message: string, type: "success" | "destructive" | "info") => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3200);
  };

  const handleAction = (
    caseId: string,
    action: "approved" | "rejected",
    caseName: string
  ) => {
    setActionStates((prev) => ({ ...prev, [caseId]: action }));
    fireToast(
      `${caseName} — ${action === "approved" ? "Approved" : "Rejected"}`,
      action === "approved" ? "success" : "destructive"
    );
  };

  const getHighRiskStage = (caseId: string): HighRiskStage =>
    highRiskStages[caseId] || "pending_investigation";

  const handleMarkCAMReady = (caseId: string, caseName: string) => {
    setHighRiskStages((prev) => ({ ...prev, [caseId]: "cam_ready" }));
    fireToast(`${caseName} — CAM generated successfully`, "info");
  };

  const handleDownloadCAM = (caseData: CaseEntry) => {
    // Generate a mock CAM PDF download
    const camContent = generateCAMContent(caseData);
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
  };

  const handleHighRiskApprove = (caseId: string, caseName: string) => {
    setHighRiskStages((prev) => ({ ...prev, [caseId]: "approved" }));
    fireToast(`${caseName} — Case approved`, "success");
  };

  const handleHighRiskClose = (caseId: string, caseName: string) => {
    setHighRiskStages((prev) => ({ ...prev, [caseId]: "closed" }));
    fireToast(`${caseName} — Case closed`, "destructive");
  };

  const pendingQuick = quickReviewCases.filter(
    (c) => !actionStates[c.id] || actionStates[c.id] === "pending"
  );
  const actedQuick = quickReviewCases.filter(
    (c) => actionStates[c.id] && actionStates[c.id] !== "pending"
  );

  // Counts for chips
  const needsInvestigationCount = highRiskCases.filter(
    (c) => getHighRiskStage(c.id) === "pending_investigation"
  ).length;
  const camReadyCount = highRiskCases.filter(
    (c) => getHighRiskStage(c.id) === "cam_ready"
  ).length;
  const resolvedHighRiskCount = highRiskCases.filter(
    (c) =>
      getHighRiskStage(c.id) === "approved" ||
      getHighRiskStage(c.id) === "closed"
  ).length;

  return (
    <main
      className="flex-1 flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "var(--surface-card)" }}
    >
      {/* Breadcrumb */}
      <div
        className="flex items-center px-4 shrink-0"
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
            color: "var(--text-heading)",
            letterSpacing: "0.048px",
          }}
        >
          Case Triage
        </span>
      </div>

      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          backgroundColor: "var(--surface-card)",
        }}
      >
        <div className="flex flex-col gap-1">
          <span
            style={{
              fontSize: "20px",
              lineHeight: "1.4",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-heading)",
              letterSpacing: "0.4%",
            }}
          >
            Case Triage Queue
          </span>
          <span
            style={{
              fontSize: "13px",
              lineHeight: "1.4",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
              letterSpacing: "0.4%",
            }}
          >
            Prioritized by risk severity — review and act on cases efficiently
          </span>
        </div>

        {/* Summary chips */}
        <div className="flex items-center gap-3">
          <SummaryChip
            count={needsInvestigationCount}
            label="Need Investigation"
            color="var(--destructive-500)"
            bg="color-mix(in srgb, var(--destructive-500) 8%, transparent)"
            border="color-mix(in srgb, var(--destructive-500) 16%, transparent)"
          />
          <SummaryChip
            count={camReadyCount}
            label="CAM Ready"
            color="var(--warning-600)"
            bg="color-mix(in srgb, var(--warning-600) 8%, transparent)"
            border="color-mix(in srgb, var(--warning-600) 16%, transparent)"
          />
          <SummaryChip
            count={resolvedHighRiskCount}
            label="Resolved"
            color="var(--success-500)"
            bg="color-mix(in srgb, var(--success-500) 8%, transparent)"
            border="color-mix(in srgb, var(--success-500) 16%, transparent)"
          />
          <SummaryChip
            count={pendingQuick.length}
            label="Quick Review"
            color="var(--warning-600)"
            bg="color-mix(in srgb, var(--warning-600) 8%, transparent)"
            border="color-mix(in srgb, var(--warning-600) 16%, transparent)"
          />
          {actedQuick.length > 0 && (
            <SummaryChip
              count={actedQuick.length}
              label="Processed"
              color="var(--success-500)"
              bg="color-mix(in srgb, var(--success-500) 8%, transparent)"
              border="color-mix(in srgb, var(--success-500) 16%, transparent)"
            />
          )}
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="flex flex-col gap-8"
          style={{ padding: "28px 32px 40px" }}
        >
          {/* ═══════════════════════════════════════════════
              SECTION 1 — Needs Investigation (High Risk)
              ═══════════════════════════════════════════════ */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor:
                    "color-mix(in srgb, var(--destructive-500) 10%, transparent)",
                  border:
                    "1px solid color-mix(in srgb, var(--destructive-500) 20%, transparent)",
                }}
              >
                <AlertTriangle
                  className="w-4 h-4"
                  style={{ color: "var(--destructive-500)" }}
                />
              </div>
              <div className="flex flex-col">
                <span
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.3",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-heading)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  Needs Investigation
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.4",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  High-risk cases with serious signals — requires deep review
                  before any decision
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {highRiskCases.map((c, idx) => (
                <InvestigationCard
                  key={c.id}
                  caseData={c}
                  delay={idx * 0.06}
                  stage={getHighRiskStage(c.id)}
                  onInvestigate={() => navigate(`/case/${c.id}`)}
                  onMarkCAMReady={() => handleMarkCAMReady(c.id, c.name)}
                  onDownloadCAM={() => handleDownloadCAM(c)}
                  onApprove={() => handleHighRiskApprove(c.id, c.name)}
                  onClose={() => handleHighRiskClose(c.id, c.name)}
                />
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              SECTION 2 — Quick Review (Low + Medium Risk)
              ═══════════════════════════════════════════════ */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor:
                    "color-mix(in srgb, var(--success-500) 10%, transparent)",
                  border:
                    "1px solid color-mix(in srgb, var(--success-500) 20%, transparent)",
                }}
              >
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: "var(--success-500)" }}
                />
              </div>
              <div className="flex flex-col">
                <span
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.3",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-heading)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  Quick Review
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.4",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  Low & medium-risk cases — approve or reject directly from here
                </span>
              </div>
            </div>

            {/* Quick review table */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Table header */}
              <div
                className="grid items-center px-5 py-3"
                style={{
                  gridTemplateColumns:
                    "2fr 1fr 1fr 1fr 1fr 0.8fr 160px",
                  borderBottom: "1px solid var(--border-default)",
                  backgroundColor: "var(--surface-inset)",
                }}
              >
                {[
                  "Company",
                  "Risk",
                  "D/E Ratio",
                  "Revenue",
                  "AI Confidence",
                  "Status",
                  "Action",
                ].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: "11px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-muted-themed)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Pending rows */}
              {pendingQuick.map((c, idx) => (
                <QuickReviewRow
                  key={c.id}
                  caseData={c}
                  delay={0.02 * idx}
                  isExpanded={expandedQuickCase === c.id}
                  onToggleExpand={() =>
                    setExpandedQuickCase(
                      expandedQuickCase === c.id ? null : c.id
                    )
                  }
                  onApprove={() =>
                    handleAction(c.id, "approved", c.name)
                  }
                  onReject={() =>
                    handleAction(c.id, "rejected", c.name)
                  }
                  onInvestigate={() => navigate(`/case/${c.id}`)}
                />
              ))}

              {/* Acted rows */}
              {actedQuick.length > 0 && (
                <>
                  <div
                    className="px-5 py-2"
                    style={{
                      backgroundColor: "var(--surface-inset)",
                      borderTop: "1px solid var(--border-default)",
                      borderBottom: "1px solid var(--border-default)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        lineHeight: "1",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--text-muted-themed)",
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.06em",
                      }}
                    >
                      Processed ({actedQuick.length})
                    </span>
                  </div>
                  {actedQuick.map((c) => (
                    <ActedRow
                      key={c.id}
                      caseData={c}
                      action={actionStates[c.id] as "approved" | "rejected"}
                    />
                  ))}
                </>
              )}

              {pendingQuick.length === 0 && actedQuick.length === 0 && (
                <div
                  className="px-5 py-12 text-center"
                  style={{
                    fontSize: "14px",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  No cases in quick review
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

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
              <CheckCircle2
                className="w-4 h-4"
                style={{ color: "var(--success-500)" }}
              />
            ) : showToast.type === "info" ? (
              <FileText
                className="w-4 h-4"
                style={{ color: "var(--info-500)" }}
              />
            ) : (
              <XCircle
                className="w-4 h-4"
                style={{ color: "var(--destructive-500)" }}
              />
            )}
            <span
              style={{
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
    </main>
  );
};

/* ─── Summary Chip ─── */
const SummaryChip = ({
  count,
  label,
  color,
  bg,
  border,
}: {
  count: number;
  label: string;
  color: string;
  bg: string;
  border: string;
}) => (
  <div
    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
    style={{ backgroundColor: bg, border: `1px solid ${border}` }}
  >
    <span
      style={{
        fontSize: "16px",
        lineHeight: "1",
        fontWeight: "var(--font-weight-medium)",
        color,
      }}
    >
      {count}
    </span>
    <span
      style={{
        fontSize: "12px",
        lineHeight: "1",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--text-secondary-themed)",
      }}
    >
      {label}
    </span>
  </div>
);

/* ═══════════════════════════════════════════════════════
   Investigation Card (High-Risk)
   ═══════════════════════════════════════════════════════ */
const InvestigationCard = ({
  caseData,
  delay,
  stage,
  onInvestigate,
  onMarkCAMReady,
  onDownloadCAM,
  onApprove,
  onClose,
}: {
  caseData: CaseEntry;
  delay: number;
  stage: HighRiskStage;
  onInvestigate: () => void;
  onMarkCAMReady: () => void;
  onDownloadCAM: () => void;
  onApprove: () => void;
  onClose: () => void;
}) => {
  const detail = caseData.detail;
  const financials = detail?.financials;
  const criminalCount =
    detail?.directors?.reduce(
      (sum: number, d: any) => sum + (d.criminalCases?.length || 0),
      0
    ) || 0;
  const networkCount = detail?.networkEntities?.length || 0;
  const contagionCount =
    detail?.networkEntities?.filter((n: any) => n.isContagionSource).length || 0;

  // Collect top signals from aiInsight additionalFactors as fallback
  const signals: { label: string; icon: React.ReactNode; color: string }[] = [];
  if (criminalCount > 0) {
    signals.push({
      label: `${criminalCount} Criminal case${criminalCount > 1 ? "s" : ""}`,
      icon: <Gavel className="w-3 h-3" />,
      color: "var(--destructive-500)",
    });
  }
  if (financials && financials.debtToEquity > 4) {
    signals.push({
      label: `D/E ${financials.debtToEquity.toFixed(1)}x`,
      icon: <Scale className="w-3 h-3" />,
      color: "var(--destructive-500)",
    });
  }
  if (financials && financials.netProfit < 0) {
    signals.push({
      label: "Negative PAT",
      icon: <TrendingDown className="w-3 h-3" />,
      color: "var(--destructive-500)",
    });
  }
  if (contagionCount > 0) {
    signals.push({
      label: `${contagionCount} Contagion source${contagionCount > 1 ? "s" : ""}`,
      icon: <Network className="w-3 h-3" />,
      color: "var(--warning-600)",
    });
  }
  if (financials && financials.currentRatio < 1) {
    signals.push({
      label: `CR ${financials.currentRatio.toFixed(2)}`,
      icon: <AlertTriangle className="w-3 h-3" />,
      color: "var(--warning-600)",
    });
  }
  // Fallback: use AI insight additional factors if no detail-based signals
  if (signals.length === 0) {
    caseData.aiInsight.additionalFactors.forEach((f) => {
      signals.push({
        label: f,
        icon: <AlertTriangle className="w-3 h-3" />,
        color: "var(--warning-600)",
      });
    });
  }

  const isResolved = stage === "approved" || stage === "closed";
  const isCamReady = stage === "cam_ready";
  const borderLeftColor = isResolved
    ? stage === "approved" ? "var(--success-500)" : "var(--neutral-200)"
    : isCamReady ? "var(--info-500)" : "var(--destructive-500)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-default)",
        borderLeft: `3px solid ${borderLeftColor}`,
        opacity: isResolved ? 0.55 : 1,
      }}
    >
      {/* Top row */}
      <div className="flex items-stretch">
        {/* Left: Main info */}
        <div
          className="flex-1 flex flex-col gap-4 p-5"
          style={{ borderRight: "1px solid var(--border-subtle)" }}
        >
          {/* Company name + risk badge + stage badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              style={{
                fontSize: "16px",
                lineHeight: "1.4",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
                textDecoration: isResolved ? "line-through" : "none",
              }}
            >
              {caseData.name}
            </span>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--destructive-500)",
                height: "24px",
              }}
            >
              <ShieldX
                className="w-3 h-3"
                style={{ color: "var(--text-on-color)" }}
              />
              <span
                style={{
                  fontSize: "11px",
                  lineHeight: "1",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-on-color)",
                }}
              >
                High Risk
              </span>
            </div>
            {isCamReady && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--info-500) 12%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--info-500) 20%, transparent)",
                  height: "24px",
                }}
              >
                <FileCheck2
                  className="w-3 h-3"
                  style={{ color: "var(--info-600)" }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    lineHeight: "1",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--info-600)",
                  }}
                >
                  CAM Ready
                </span>
              </div>
            )}
            {stage === "approved" && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--success-500) 12%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--success-500) 20%, transparent)",
                  height: "24px",
                }}
              >
                <CheckCircle2
                  className="w-3 h-3"
                  style={{ color: "var(--success-700)" }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    lineHeight: "1",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--success-700)",
                  }}
                >
                  Approved
                </span>
              </div>
            )}
            {stage === "closed" && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--neutral-200) 40%, transparent)",
                  border: "1px solid var(--neutral-200)",
                  height: "24px",
                }}
              >
                <Ban
                  className="w-3 h-3"
                  style={{ color: "var(--text-muted-themed)" }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    lineHeight: "1",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  Closed
                </span>
              </div>
            )}
            <span
              style={{
                fontSize: "12px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
                marginLeft: "auto",
              }}
            >
              {caseData.id} · {formatDate(caseData.created)}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-5">
            <MetaItem label="Industry" value={caseData.natureOfBusiness} />
            {financials && (
              <>
                <MetaItem
                  label="Revenue"
                  value={`₹${formatCurrency(financials.revenue)}`}
                  accent={
                    financials.revenueChange < 0
                      ? "var(--destructive-500)"
                      : undefined
                  }
                  sub={`${financials.revenueChange > 0 ? "+" : ""}${financials.revenueChange}%`}
                />
                <MetaItem
                  label="D/E Ratio"
                  value={`${financials.debtToEquity.toFixed(2)}x`}
                  accent={
                    financials.debtToEquity > 4
                      ? "var(--destructive-500)"
                      : financials.debtToEquity > 2
                        ? "var(--warning-600)"
                        : undefined
                  }
                />
                <MetaItem
                  label="Net Profit"
                  value={`₹${formatCurrency(financials.netProfit)}`}
                  accent={
                    financials.netProfit < 0
                      ? "var(--destructive-500)"
                      : "var(--success-500)"
                  }
                />
              </>
            )}
            {detail && detail.directors && (
              <MetaItem label="Directors" value={`${detail.directors.length}`} />
            )}
            {networkCount > 0 && (
              <MetaItem
                label="Network"
                value={`${networkCount} entities`}
                accent={
                  contagionCount > 0 ? "var(--warning-600)" : undefined
                }
              />
            )}
          </div>

          {/* Signals */}
          {signals.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {signals.map((s, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${s.color} 6%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${s.color} 16%, transparent)`,
                  }}
                >
                  <span style={{ color: s.color, display: "flex" }}>
                    {s.icon}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                      color: s.color,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: AI insight + CTA */}
        <div
          className="flex flex-col gap-4 p-5 justify-between"
          style={{ width: "320px", flexShrink: 0 }}
        >
          {/* AI summary */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ color: "var(--primary)" }}
              />
              <span
                style={{
                  fontSize: "10px",
                  lineHeight: "1",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--primary)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.06em",
                }}
              >
                AI Assessment ·{" "}
                {caseData.aiInsight.confidencePercent}%
              </span>
            </div>
            <p
              style={{
                fontSize: "12px",
                lineHeight: "1.6",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-secondary-themed)",
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }}
            >
              {caseData.aiInsight.riskExplanation}
            </p>
          </div>

          {/* CTA — changes based on stage */}
          {!isResolved && (
            <div className="flex flex-col gap-2">
              {stage === "pending_investigation" && (
                <>
                  <button
                    onClick={onInvestigate}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg cursor-pointer transition-all"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--text-on-color)",
                      border: "none",
                      fontSize: "13px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#104EB8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Investigate Case
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onMarkCAMReady}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-md cursor-pointer transition-all"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-secondary-themed)",
                      fontSize: "12px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "color-mix(in srgb, var(--info-500) 6%, transparent)";
                      e.currentTarget.style.borderColor = "var(--info-500)";
                      e.currentTarget.style.color = "var(--info-600)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "var(--border-default)";
                      e.currentTarget.style.color = "var(--text-secondary-themed)";
                    }}
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Mark CAM Ready
                  </button>
                </>
              )}
              {isCamReady && (
                <span
                  style={{
                    fontSize: "10px",
                    lineHeight: "1.3",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-muted-themed)",
                    textAlign: "center" as const,
                  }}
                >
                  Download CAM, then approve or close below
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post-CAM action bar */}
      {stage === "cam_ready" && (
        <div
          className="flex items-center gap-4 px-5 py-3"
          style={{
            backgroundColor: "color-mix(in srgb, var(--info-500) 4%, var(--surface-inset))",
            borderTop: "1px solid color-mix(in srgb, var(--info-500) 12%, var(--border-default))",
          }}
        >
          <div className="flex items-center gap-2 mr-auto">
            <FileText className="w-3.5 h-3.5" style={{ color: "var(--info-600)" }} />
            <span
              style={{
                fontSize: "11px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--info-600)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.04em",
              }}
            >
              Credit Assessment Memo
            </span>
          </div>
          <button
            onClick={onDownloadCAM}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-all"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary) 8%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
              color: "var(--primary)",
              fontSize: "12px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--primary) 16%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--primary) 8%, transparent)";
            }}
          >
            <Download className="w-3 h-3" />
            Download CAM
          </button>
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-all"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--success-500) 8%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--success-500) 20%, transparent)",
              color: "var(--success-700)",
              fontSize: "12px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--success-500) 16%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--success-500) 8%, transparent)";
            }}
          >
            <Check className="w-3 h-3" />
            Approve
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-all"
            style={{
              backgroundColor: "transparent",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary-themed)",
              fontSize: "12px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--destructive-500) 6%, transparent)";
              e.currentTarget.style.borderColor =
                "color-mix(in srgb, var(--destructive-500) 20%, transparent)";
              e.currentTarget.style.color = "var(--destructive-500)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.color =
                "var(--text-secondary-themed)";
            }}
          >
            <X className="w-3 h-3" />
            Close
          </button>
        </div>
      )}
    </motion.div>
  );
};

/* ─── Meta Item ─── */
const MetaItem = ({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string;
  accent?: string;
  sub?: string;
}) => (
  <div className="flex flex-col gap-1">
    <span
      style={{
        fontSize: "10px",
        lineHeight: "1",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--text-muted-themed)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
    <div className="flex items-baseline gap-1">
      <span
        style={{
          fontSize: "13px",
          lineHeight: "1",
          fontWeight: "var(--font-weight-medium)",
          color: accent || "var(--text-heading)",
        }}
      >
        {value}
      </span>
      {sub && (
        <span
          style={{
            fontSize: "10px",
            lineHeight: "1",
            fontWeight: "var(--font-weight-medium)",
            color: accent || "var(--text-muted-themed)",
          }}
        >
          {sub}
        </span>
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   Quick Review Row (Low / Medium Risk)
   ═══════════════════════════════════════════════════════ */
const QuickReviewRow = ({
  caseData,
  delay,
  isExpanded,
  onToggleExpand,
  onApprove,
  onReject,
  onInvestigate,
}: {
  caseData: CaseEntry;
  delay: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onApprove: () => void;
  onReject: () => void;
  onInvestigate: () => void;
}) => {
  const financials = caseData.detail?.financials;
  const riskConfig: Record<
    RiskLevel,
    { color: string; bg: string; icon: React.ReactNode }
  > = {
    Low: {
      color: "var(--success-500)",
      bg: "color-mix(in srgb, var(--success-500) 8%, transparent)",
      icon: (
        <ShieldCheck
          className="w-3 h-3"
          style={{ color: "var(--success-500)" }}
        />
      ),
    },
    Medium: {
      color: "var(--warning-600)",
      bg: "color-mix(in srgb, var(--warning-600) 8%, transparent)",
      icon: (
        <ShieldAlert
          className="w-3 h-3"
          style={{ color: "var(--warning-600)" }}
        />
      ),
    },
    High: {
      color: "var(--destructive-500)",
      bg: "color-mix(in srgb, var(--destructive-500) 8%, transparent)",
      icon: (
        <ShieldX
          className="w-3 h-3"
          style={{ color: "var(--destructive-500)" }}
        />
      ),
    },
  };
  const rc = riskConfig[caseData.riskLevel];

  const statusConfig: Record<string, { color: string }> = {
    New: { color: "var(--primary)" },
    Approved: { color: "var(--success-500)" },
    Rejected: { color: "var(--destructive-500)" },
    "On Hold": { color: "var(--warning-600)" },
    "Expert Review": { color: "var(--info-600)" },
  };
  const sc = statusConfig[caseData.status] || { color: "var(--text-muted-themed)" };

  const confidenceColor =
    caseData.aiInsight.confidencePercent >= 85
      ? "var(--primary)"
      : caseData.aiInsight.confidencePercent >= 60
        ? "var(--warning-600)"
        : "var(--destructive-500)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay }}
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      {/* Main row */}
      <div
        className="grid items-center px-5 py-3 cursor-pointer transition-colors"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 0.8fr 160px",
          backgroundColor: isExpanded
            ? "var(--surface-inset)"
            : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!isExpanded)
            e.currentTarget.style.backgroundColor =
              "var(--surface-hover)";
        }}
        onMouseLeave={(e) => {
          if (!isExpanded)
            e.currentTarget.style.backgroundColor = "transparent";
        }}
        onClick={onToggleExpand}
      >
        {/* Company */}
        <div className="flex items-center gap-2.5">
          <button
            className="flex items-center justify-center w-5 h-5 rounded cursor-pointer"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "var(--text-muted-themed)",
              padding: 0,
              fontSize: "12px",
            }}
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          <div className="flex flex-col gap-0.5">
            <span
              style={{
                fontSize: "13px",
                lineHeight: "1.4",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              {caseData.name}
            </span>
            <span
              style={{
                fontSize: "11px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
              }}
            >
              {caseData.natureOfBusiness} · {caseData.id}
            </span>
          </div>
        </div>

        {/* Risk */}
        <div className="flex items-center">
          <div
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ backgroundColor: rc.bg }}
          >
            {rc.icon}
            <span
              style={{
                fontSize: "11px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-medium)",
                color: rc.color,
              }}
            >
              {caseData.riskLevel}
            </span>
          </div>
        </div>

        {/* D/E Ratio */}
        <span
          style={{
            fontSize: "13px",
            lineHeight: "1",
            fontWeight: "var(--font-weight-medium)",
            color: financials
              ? financials.debtToEquity > 3
                ? "var(--destructive-500)"
                : financials.debtToEquity > 1.5
                  ? "var(--warning-600)"
                  : "var(--text-heading)"
              : "var(--text-muted-themed)",
          }}
        >
          {financials ? `${financials.debtToEquity.toFixed(2)}x` : "—"}
        </span>

        {/* Revenue */}
        <div className="flex flex-col gap-0.5">
          <span
            style={{
              fontSize: "13px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-heading)",
            }}
          >
            {financials ? `₹${formatCurrency(financials.revenue)}` : "—"}
          </span>
          {financials && (
            <span
              style={{
                fontSize: "10px",
                lineHeight: "1",
                fontWeight: "var(--font-weight-normal)",
                color:
                  financials.revenueChange >= 0
                    ? "var(--success-500)"
                    : "var(--destructive-500)",
              }}
            >
              {financials.revenueChange > 0 ? "+" : ""}
              {financials.revenueChange}% YoY
            </span>
          )}
        </div>

        {/* AI Confidence */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--surface-elevated)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${caseData.aiInsight.confidencePercent}%`,
                backgroundColor: confidenceColor,
                opacity: 0.7,
              }}
            />
          </div>
          <span
            style={{
              fontSize: "12px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
              color: confidenceColor,
            }}
          >
            {caseData.aiInsight.confidencePercent}%
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: sc.color }}
          />
          <span
            style={{
              fontSize: "12px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
              color: sc.color,
            }}
          >
            {caseData.status}
          </span>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-all"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--success-500) 8%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--success-500) 20%, transparent)",
              color: "var(--success-700)",
              fontSize: "12px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--success-500) 16%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--success-500) 8%, transparent)";
            }}
          >
            <Check className="w-3 h-3" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-all"
            style={{
              backgroundColor: "transparent",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary-themed)",
              fontSize: "12px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--destructive-500) 6%, transparent)";
              e.currentTarget.style.borderColor =
                "color-mix(in srgb, var(--destructive-500) 20%, transparent)";
              e.currentTarget.style.color = "var(--destructive-500)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.color =
                "var(--text-secondary-themed)";
            }}
          >
            <X className="w-3 h-3" />
            Reject
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-4 pt-1 flex gap-5"
              style={{
                borderBottom: "1px solid var(--border-default)",
                backgroundColor: "var(--surface-inset)",
              }}
            >
              {/* AI Explanation */}
              <div
                className="flex-1 flex flex-col gap-2 p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--surface-card)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="w-3 h-3"
                    style={{ color: "var(--primary)" }}
                  />
                  <span
                    style={{
                      fontSize: "10px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--primary)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    AI Risk Summary
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.6",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-body)",
                    margin: 0,
                  }}
                >
                  {caseData.aiInsight.riskExplanation}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {caseData.aiInsight.additionalFactors.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                      style={{
                        fontSize: "10px",
                        lineHeight: "1.3",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--text-secondary-themed)",
                        backgroundColor: "var(--surface-inset)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key financials */}
              {financials && (
                <div
                  className="flex flex-col gap-3 p-4 rounded-lg"
                  style={{
                    width: "280px",
                    flexShrink: 0,
                    backgroundColor: "var(--surface-card)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-muted-themed)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Key Metrics
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniMetric
                      label="EBITDA Margin"
                      value={`${financials.ebitdaMargin}%`}
                      color={
                        financials.ebitdaMargin >= 15
                          ? "var(--success-500)"
                          : financials.ebitdaMargin >= 0
                            ? "var(--warning-600)"
                            : "var(--destructive-500)"
                      }
                    />
                    <MiniMetric
                      label="Current Ratio"
                      value={financials.currentRatio.toFixed(2)}
                      color={
                        financials.currentRatio >= 1.5
                          ? "var(--success-500)"
                          : financials.currentRatio >= 1
                            ? "var(--warning-600)"
                            : "var(--destructive-500)"
                      }
                    />
                    <MiniMetric
                      label="ICR"
                      value={`${financials.interestCoverage}x`}
                      color={
                        financials.interestCoverage >= 3
                          ? "var(--success-500)"
                          : "var(--warning-600)"
                      }
                    />
                    <MiniMetric
                      label="Cash Flow"
                      value={`₹${formatCurrency(financials.cashFlow)}`}
                      color={
                        financials.cashFlow >= 0
                          ? "var(--success-500)"
                          : "var(--destructive-500)"
                      }
                    />
                  </div>

                  <button
                    onClick={onInvestigate}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-md cursor-pointer transition-all mt-auto"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--border-default)",
                      color: "var(--primary)",
                      fontSize: "11px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "color-mix(in srgb, var(--primary) 6%, transparent)";
                      e.currentTarget.style.borderColor = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor =
                        "var(--border-default)";
                    }}
                  >
                    View Full Details
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Mini Metric ─── */
const MiniMetric = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div className="flex flex-col gap-1">
    <span
      style={{
        fontSize: "9px",
        lineHeight: "1",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--text-muted-themed)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "13px",
        lineHeight: "1",
        fontWeight: "var(--font-weight-medium)",
        color,
      }}
    >
      {value}
    </span>
  </div>
);

/* ─── Acted Row ─── */
const ActedRow = ({
  caseData,
  action,
}: {
  caseData: CaseEntry;
  action: "approved" | "rejected";
}) => {
  const isApproved = action === "approved";
  const accentColor = isApproved
    ? "var(--success-500)"
    : "var(--destructive-500)";

  return (
    <div
      className="grid items-center px-5 py-3"
      style={{
        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 0.8fr 160px",
        borderBottom: "1px solid var(--border-subtle)",
        opacity: 0.6,
      }}
    >
      {/* Company */}
      <div className="flex items-center gap-2.5">
        <div className="w-5" />
        <span
          style={{
            fontSize: "13px",
            lineHeight: "1.4",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-heading)",
            textDecoration: "line-through",
            opacity: 0.6,
          }}
        >
          {caseData.name}
        </span>
      </div>

      {/* Risk */}
      <span
        style={{
          fontSize: "12px",
          lineHeight: "1",
          fontWeight: "var(--font-weight-normal)",
          color: "var(--text-muted-themed)",
        }}
      >
        {caseData.riskLevel}
      </span>

      {/* D/E */}
      <span
        style={{
          fontSize: "12px",
          lineHeight: "1",
          color: "var(--text-muted-themed)",
        }}
      >
        {caseData.detail?.financials
          ? `${caseData.detail.financials.debtToEquity.toFixed(2)}x`
          : "—"}
      </span>

      {/* Revenue */}
      <span
        style={{
          fontSize: "12px",
          lineHeight: "1",
          color: "var(--text-muted-themed)",
        }}
      >
        {caseData.detail?.financials
          ? `₹${formatCurrency(caseData.detail.financials.revenue)}`
          : "—"}
      </span>

      {/* Confidence */}
      <span
        style={{
          fontSize: "12px",
          lineHeight: "1",
          color: "var(--text-muted-themed)",
        }}
      >
        {caseData.aiInsight.confidencePercent}%
      </span>

      {/* Status */}
      <span
        style={{
          fontSize: "12px",
          lineHeight: "1",
          color: "var(--text-muted-themed)",
        }}
      >
        {caseData.status}
      </span>

      {/* Action result */}
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md w-fit"
        style={{
          backgroundColor: `color-mix(in srgb, ${accentColor} 8%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accentColor} 16%, transparent)`,
        }}
      >
        {isApproved ? (
          <CheckCircle2 className="w-3 h-3" style={{ color: accentColor }} />
        ) : (
          <XCircle className="w-3 h-3" style={{ color: accentColor }} />
        )}
        <span
          style={{
            fontSize: "11px",
            lineHeight: "1",
            fontWeight: "var(--font-weight-medium)",
            color: accentColor,
          }}
        >
          {isApproved ? "Approved" : "Rejected"}
        </span>
      </div>
    </div>
  );
};

/* ─── Generate CAM Content ─── */
const generateCAMContent = (caseData: CaseEntry): string => {
  const detail = caseData.detail;
  const financials = detail?.financials;
  const criminalCount =
    detail?.directors?.reduce(
      (sum: number, d: any) => sum + (d.criminalCases?.length || 0),
      0
    ) || 0;
  const networkCount = detail?.networkEntities?.length || 0;
  const contagionCount =
    detail?.networkEntities?.filter((n: any) => n.isContagionSource).length || 0;

  // Collect top signals
  const signals: { label: string; icon: React.ReactNode; color: string }[] = [];
  if (criminalCount > 0) {
    signals.push({
      label: `${criminalCount} Criminal case${criminalCount > 1 ? "s" : ""}`,
      icon: <Gavel className="w-3 h-3" />,
      color: "var(--destructive-500)",
    });
  }
  if (financials && financials.debtToEquity > 4) {
    signals.push({
      label: `D/E ${financials.debtToEquity.toFixed(1)}x`,
      icon: <Scale className="w-3 h-3" />,
      color: "var(--destructive-500)",
    });
  }
  if (financials && financials.netProfit < 0) {
    signals.push({
      label: "Negative PAT",
      icon: <TrendingDown className="w-3 h-3" />,
      color: "var(--destructive-500)",
    });
  }
  if (contagionCount > 0) {
    signals.push({
      label: `${contagionCount} Contagion source${contagionCount > 1 ? "s" : ""}`,
      icon: <Network className="w-3 h-3" />,
      color: "var(--warning-600)",
    });
  }
  if (financials && financials.currentRatio < 1) {
    signals.push({
      label: `CR ${financials.currentRatio.toFixed(2)}`,
      icon: <AlertTriangle className="w-3 h-3" />,
      color: "var(--warning-600)",
    });
  }

  return `
    Case ID: ${caseData.id}
    Company Name: ${caseData.name}
    Risk Level: ${caseData.riskLevel}
    Created: ${formatDate(caseData.created)}
    Industry: ${caseData.natureOfBusiness}
    Revenue: ₹${formatCurrency(financials?.revenue || 0)}
    D/E Ratio: ${financials?.debtToEquity?.toFixed(2) || "—"}x
    Net Profit: ₹${formatCurrency(financials?.netProfit || 0)}
    Directors: ${detail?.directors?.length || "—"}
    Network Entities: ${networkCount || "—"}
    Contagion Sources: ${contagionCount || "—"}
    Criminal Cases: ${criminalCount || "—"}
    AI Confidence: ${caseData.aiInsight.confidencePercent}%
    AI Risk Explanation: ${caseData.aiInsight.riskExplanation}
    AI Additional Factors: ${caseData.aiInsight.additionalFactors.join(", ")}
    Signals:
    ${signals.map((s) => `- ${s.label}`).join("\n")}
  `;
};
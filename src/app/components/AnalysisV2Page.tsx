import React, { useState, useMemo } from "react";
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
  Landmark,
  FileText,
  CreditCard,
  Network,
  ClipboardCheck,
  Clock,
  Briefcase,
  Gavel,
  Building2,
  MapPin,
  Hash,
  CalendarDays,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Percent,
  Link2,
  ArrowRightLeft,
} from "lucide-react";
import { MOCK_CASES, type CaseEntry, type RiskLevel } from "../data/cases";

const ff = "var(--font-family, 'Plus Jakarta Sans', sans-serif)";

const formatCurrency = (val: number): string => {
  const a = Math.abs(val);
  const s = val < 0 ? "-" : "";
  if (a >= 10000000) return `${s}${(a / 10000000).toFixed(1)} Cr`;
  if (a >= 100000) return `${s}${(a / 100000).toFixed(1)} L`;
  return `${s}${a.toLocaleString("en-IN")}`;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const riskColors: Record<
  RiskLevel,
  { accent: string; bg: string; border: string; rgba: string }
> = {
  Low: {
    accent: "var(--success-500)",
    bg: "color-mix(in srgb, var(--success-500) 8%, transparent)",
    border: "color-mix(in srgb, var(--success-500) 20%, transparent)",
    rgba: "76, 175, 71",
  },
  Medium: {
    accent: "var(--warning-600)",
    bg: "color-mix(in srgb, var(--warning-600) 8%, transparent)",
    border: "color-mix(in srgb, var(--warning-600) 20%, transparent)",
    rgba: "203, 113, 0",
  },
  High: {
    accent: "var(--destructive-500)",
    bg: "color-mix(in srgb, var(--destructive-500) 8%, transparent)",
    border: "color-mix(in srgb, var(--destructive-500) 20%, transparent)",
    rgba: "226, 51, 24",
  },
};

/* ─── Primitives ─── */
const Card = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay, ease: [0.23, 1, 0.32, 1] }}
    className={`rounded-xl overflow-hidden ${className}`}
    style={{
      backgroundColor: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      boxShadow: "var(--shadow-card)",
    }}
  >
    {children}
  </motion.div>
);

const CardHeader = ({
  icon: Icon,
  title,
  badge,
  accentColor,
}: {
  icon: React.ElementType;
  title: string;
  badge?: React.ReactNode;
  accentColor?: string;
}) => (
  <div
    className="flex items-center gap-2.5 px-5 py-3"
    style={{
      borderBottom: "1px solid var(--border-default)",
      background: accentColor
        ? `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 6%, transparent) 0%, transparent 100%)`
        : "linear-gradient(135deg, var(--header-gradient-from) 0%, transparent 100%)",
    }}
  >
    <Icon
      className="w-4 h-4"
      style={{ color: accentColor || "var(--text-secondary-themed)" }}
    />
    <span
      style={{
        fontFamily: ff,
        fontSize: "var(--text-base)",
        lineHeight: "var(--paragraph-sm-desktop-line-height)",
        fontWeight: "var(--font-weight-medium)",
        color: "var(--text-heading)",
        letterSpacing: "var(--paragraph-sm-desktop-letter-spacing)",
      }}
    >
      {title}
    </span>
    {badge && <div className="ml-auto">{badge}</div>}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      fontFamily: ff,
      fontSize: "var(--text-xs)",
      lineHeight: "var(--paragraph-sm-desktop-line-height)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-muted-themed)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    }}
  >
    {children}
  </span>
);

const InfoCell = ({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent?: string;
  icon?: React.ElementType;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      {Icon && (
        <Icon
          className="w-3 h-3"
          style={{ color: "var(--text-muted-themed)" }}
        />
      )}
      <Label>{label}</Label>
    </div>
    <span
      style={{
        fontFamily: ff,
        fontSize: "var(--paragraph-sm-desktop-size)",
        lineHeight: "var(--paragraph-sm-desktop-line-height)",
        fontWeight: "var(--font-weight-medium)",
        color: accent || "var(--text-heading)",
        letterSpacing: "var(--paragraph-sm-desktop-letter-spacing)",
      }}
    >
      {value}
    </span>
  </div>
);

const StatusBadge = ({
  label,
  color,
}: {
  label: string;
  color: string;
}) => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
    style={{
      fontFamily: ff,
      fontSize: "var(--text-xs)",
      lineHeight: "1",
      fontWeight: "var(--font-weight-medium)",
      color,
      backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
      border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
    }}
  >
    {label}
  </span>
);

/* ─── Tabs ─── */
const TABS = [
  { key: "overview" as const, label: "Overview", icon: PieChart },
  { key: "directors" as const, label: "Directors & Legal", icon: Users },
  { key: "financials" as const, label: "Financials", icon: BarChart3 },
  { key: "network" as const, label: "Network", icon: Network },
  { key: "compliance" as const, label: "Compliance", icon: ClipboardCheck },
  { key: "timeline" as const, label: "Timeline", icon: Clock },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ─── Main Component ─── */
export const AnalysisV2Page = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const caseData = MOCK_CASES.find((c) => c.id === caseId);

  if (!caseData) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ backgroundColor: "var(--app-bg)" }}
      >
        <span
          style={{
            fontFamily: ff,
            fontSize: "var(--paragraph-sm-desktop-size)",
            color: "var(--text-secondary-themed)",
          }}
        >
          Case not found
        </span>
      </div>
    );
  }

  const rc = riskColors[caseData.riskLevel];
  const detail = caseData.detail;
  const financials = detail?.financials;

  const timelineEvents = useMemo(() => {
    if (!detail) return [];
    const events: {
      date: string;
      title: string;
      description: string;
      type: "info" | "warning" | "danger" | "success";
    }[] = [];

    events.push({
      date: detail.incorporationDate,
      title: "Company Incorporated",
      description: `${caseData.name} registered at ${detail.registeredAddress}`,
      type: "info",
    });

    detail.directors.forEach((d) => {
      events.push({
        date: d.appointmentDate,
        title: `${d.name} Appointed`,
        description: `Appointed as ${d.designation} (DIN: ${d.din})`,
        type: "info",
      });
      d.criminalCases?.forEach((cc) => {
        events.push({
          date: "2021-03-15",
          title: `Criminal Case Filed — ${cc.offence}`,
          description: `${cc.section} at ${cc.court}. Status: ${cc.status}. Max Punishment: ${cc.maxPunishment}`,
          type: "danger",
        });
      });
    });

    events.push({
      date: caseData.created,
      title: "Case Created in OneRisk",
      description: `Risk Level: ${caseData.riskLevel} | AI Confidence: ${caseData.aiInsight.confidencePercent}%`,
      type:
        caseData.riskLevel === "High"
          ? "danger"
          : caseData.riskLevel === "Medium"
          ? "warning"
          : "success",
    });

    if (financials && financials.revenueChange < -20) {
      events.push({
        date: "2025-09-01",
        title: "Revenue Decline Alert",
        description: `Revenue dropped ${financials.revenueChange}% YoY. Current: ₹${formatCurrency(financials.revenue)}`,
        type: "warning",
      });
    }

    if (financials && financials.netProfit < 0) {
      events.push({
        date: "2025-12-01",
        title: "Net Loss Reported",
        description: `Net loss of ₹${formatCurrency(Math.abs(financials.netProfit))} reported for the fiscal year`,
        type: "danger",
      });
    }

    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [detail, caseData, financials]);

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--surface-card)" }}
    >
      {/* Tab Navigation */}
      <div
        className="relative z-10 flex items-center gap-0.5 px-5 py-1.5 shrink-0 overflow-x-auto"
        style={{
          borderBottom: "1px solid var(--border-default)",
          backgroundColor: "var(--surface-card)",
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer transition-colors shrink-0"
              style={{
                backgroundColor: isActive
                  ? "var(--surface-active)"
                  : "transparent",
                border: "none",
              }}
            >
              <Icon
                className="w-3.5 h-3.5"
                style={{
                  color: isActive
                    ? "var(--text-heading)"
                    : "var(--text-muted-themed)",
                }}
              />
              <span
                style={{
                  fontFamily: ff,
                  fontSize: "var(--text-sm)",
                  lineHeight: "var(--paragraph-sm-desktop-line-height)",
                  fontWeight: "var(--font-weight-medium)",
                  color: isActive
                    ? "var(--text-heading)"
                    : "var(--text-muted-themed)",
                  letterSpacing: "var(--paragraph-sm-desktop-letter-spacing)",
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="v2TabIndicator"
                  className="absolute bottom-0 left-2 right-2 rounded-full"
                  style={{
                    height: "2px",
                    background: `linear-gradient(90deg, var(--primary), var(--info-400))`,
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Version Switcher */}
        <button
          onClick={() => navigate(`/analysis-1/case/${caseId}`)}
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-all shrink-0"
          style={{
            backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--primary) 16%, transparent)",
            fontFamily: ff,
            fontSize: "var(--text-xs)",
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
          <span>Analysis V2</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ opacity: 0.6 }}>Switch to V1</span>
        </button>
      </div>

      {/* Content */}
      <div
        className="flex-1 min-h-0 overflow-auto"
        style={{ padding: "20px 24px" }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewContent
              key="overview"
              caseData={caseData}
              rc={rc}
            />
          )}
          {activeTab === "directors" && (
            <DirectorsContent
              key="directors"
              caseData={caseData}
              rc={rc}
            />
          )}
          {activeTab === "financials" && (
            <FinancialsContent
              key="financials"
              caseData={caseData}
              rc={rc}
            />
          )}
          {activeTab === "network" && (
            <NetworkContent
              key="network"
              caseData={caseData}
              rc={rc}
            />
          )}
          {activeTab === "compliance" && (
            <ComplianceContent key="compliance" caseData={caseData} />
          )}
          {activeTab === "timeline" && (
            <TimelineContent
              key="timeline"
              events={timelineEvents}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════ */
const OverviewContent = ({
  caseData,
  rc,
}: {
  caseData: CaseEntry;
  rc: (typeof riskColors)[RiskLevel];
}) => {
  const detail = caseData.detail;
  const financials = detail?.financials;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5"
    >
      {/* AI Risk Assessment */}
      <Card delay={0.02}>
        <CardHeader
          icon={Sparkles}
          title="AI Risk Assessment"
          accentColor="var(--primary)"
          badge={
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: ff,
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-muted-themed)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Confidence
              </span>
              <span
                style={{
                  fontFamily: ff,
                  fontSize: "var(--paragraph-sm-desktop-size)",
                  fontWeight: "var(--font-weight-medium)",
                  color:
                    caseData.aiInsight.confidencePercent >= 85
                      ? "var(--primary)"
                      : "var(--warning-600)",
                }}
              >
                {caseData.aiInsight.confidencePercent}%
              </span>
            </div>
          }
        />
        <div className="px-5 py-4 flex flex-col gap-4">
          <div
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${rc.accent} 6%, transparent) 0%, color-mix(in srgb, var(--info-400) 4%, transparent) 100%)`,
              border: `1px solid color-mix(in srgb, ${rc.accent} 12%, transparent)`,
            }}
          >
            <AlertTriangle
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: rc.accent }}
            />
            <div className="flex flex-col gap-2 min-w-0">
              <span
                style={{
                  fontFamily: ff,
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-heading)",
                }}
              >
                {caseData.aiInsight.mostRiskyElement}
              </span>
              <p
                style={{
                  fontFamily: ff,
                  fontSize: "var(--text-sm)",
                  lineHeight: "1.6",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--text-body)",
                  margin: 0,
                }}
              >
                {caseData.aiInsight.riskExplanation}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Additional Risk Factors</Label>
            <div className="flex flex-wrap gap-2">
              {caseData.aiInsight.additionalFactors.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                  style={{
                    fontFamily: ff,
                    fontSize: "var(--text-sm)",
                    lineHeight: "1.4",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-body)",
                    backgroundColor: "var(--surface-inset)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <ChevronRight
                    className="w-3 h-3"
                    style={{ color: "var(--text-muted-themed)" }}
                  />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Company Overview */}
      {detail && (
        <Card delay={0.06}>
          <CardHeader icon={Building2} title="Company Overview" />
          <div className="px-5 py-4 grid grid-cols-3 gap-4">
            <InfoCell
              label="CIN"
              value={detail.cin}
              icon={Hash}
            />
            <InfoCell
              label="Incorporated"
              value={formatDate(detail.incorporationDate)}
              icon={CalendarDays}
            />
            <InfoCell
              label="Industry"
              value={caseData.natureOfBusiness}
              icon={Briefcase}
            />
            <InfoCell
              label="Registered Address"
              value={detail.registeredAddress}
              icon={MapPin}
            />
            <InfoCell
              label="Directors"
              value={`${detail.directors.length} Directors`}
              icon={Users}
            />
            <InfoCell
              label="Network Entities"
              value={`${detail.networkEntities.length} Connected`}
              icon={Network}
            />
          </div>
        </Card>
      )}

      {/* Key Financial Snapshot */}
      {financials && (
        <Card delay={0.1}>
          <CardHeader icon={BarChart3} title="Financial Snapshot" />
          <div className="px-5 py-4 grid grid-cols-4 gap-3">
            <MetricTile
              label="Revenue"
              value={`₹${formatCurrency(financials.revenue)}`}
              sub={`${financials.revenueChange > 0 ? "+" : ""}${financials.revenueChange}% YoY`}
              subColor={
                financials.revenueChange >= 0
                  ? "var(--success-500)"
                  : "var(--destructive-500)"
              }
            />
            <MetricTile
              label="Net Profit"
              value={`₹${formatCurrency(financials.netProfit)}`}
              sub={
                financials.netProfit >= 0
                  ? "Profitable"
                  : "Loss Making"
              }
              subColor={
                financials.netProfit >= 0
                  ? "var(--success-500)"
                  : "var(--destructive-500)"
              }
            />
            <MetricTile
              label="D/E Ratio"
              value={`${financials.debtToEquity.toFixed(2)}x`}
              sub={
                financials.debtToEquity > 5
                  ? "Toxic"
                  : financials.debtToEquity > 3
                  ? "High"
                  : financials.debtToEquity > 1.5
                  ? "Elevated"
                  : "Safe"
              }
              subColor={
                financials.debtToEquity > 5
                  ? "var(--destructive-500)"
                  : financials.debtToEquity > 3
                  ? "var(--warning-600)"
                  : "var(--success-500)"
              }
            />
            <MetricTile
              label="Interest Coverage"
              value={`${financials.interestCoverage.toFixed(2)}x`}
              sub={
                financials.interestCoverage < 1
                  ? "Default Risk"
                  : financials.interestCoverage < 1.5
                  ? "Distressed"
                  : "Adequate"
              }
              subColor={
                financials.interestCoverage < 1
                  ? "var(--destructive-500)"
                  : financials.interestCoverage < 1.5
                  ? "var(--warning-600)"
                  : "var(--success-500)"
              }
            />
          </div>
        </Card>
      )}

      {/* Recommended Action */}
      <Card delay={0.14}>
        <div
          className="px-5 py-4 flex items-center gap-4"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${rc.accent} 4%, transparent) 0%, transparent 100%)`,
          }}
        >
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: rc.bg,
              border: `1px solid ${rc.border}`,
            }}
          >
            {caseData.riskLevel === "High" ? (
              <ShieldX className="w-5 h-5" style={{ color: rc.accent }} />
            ) : caseData.riskLevel === "Medium" ? (
              <ShieldAlert
                className="w-5 h-5"
                style={{ color: rc.accent }}
              />
            ) : (
              <ShieldCheck
                className="w-5 h-5"
                style={{ color: rc.accent }}
              />
            )}
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span
              style={{
                fontFamily: ff,
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              AI Recommendation:{" "}
              {caseData.aiSuggestion || "Review Required"}
            </span>
            <span
              style={{
                fontFamily: ff,
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
              }}
            >
              {caseData.riskLevel === "High"
                ? "Escalate to Chief Risk Officer for enhanced due diligence"
                : caseData.riskLevel === "Medium"
                ? "Requires additional safeguards and enhanced monitoring"
                : "Standard monitoring protocols recommended"}
            </span>
          </div>
          <StatusBadge
            label={`${caseData.riskLevel} Risk`}
            color={rc.accent}
          />
        </div>
      </Card>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   DIRECTORS & LEGAL TAB
   ═══════════════════════════════════════════════════════ */
const DirectorsContent = ({
  caseData,
  rc,
}: {
  caseData: CaseEntry;
  rc: (typeof riskColors)[RiskLevel];
}) => {
  const detail = caseData.detail;
  if (!detail)
    return (
      <EmptyState message="No director information available for this case." />
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5"
    >
      {detail.directors.map((director, i) => {
        const hasCriminal =
          director.criminalCases && director.criminalCases.length > 0;
        return (
          <Card key={director.din} delay={0.04 * (i + 1)}>
            <CardHeader
              icon={Users}
              title={director.name}
              accentColor={hasCriminal ? rc.accent : undefined}
              badge={
                hasCriminal ? (
                  <StatusBadge
                    label={`${director.criminalCases!.length} Criminal Case${director.criminalCases!.length > 1 ? "s" : ""}`}
                    color="var(--destructive-500)"
                  />
                ) : (
                  <StatusBadge
                    label="Clear"
                    color="var(--success-500)"
                  />
                )
              }
            />
            <div className="px-5 py-4 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <InfoCell
                  label="DIN"
                  value={director.din}
                  icon={Hash}
                />
                <InfoCell
                  label="Designation"
                  value={director.designation}
                  icon={Briefcase}
                />
                <InfoCell
                  label="Appointed"
                  value={formatDate(director.appointmentDate)}
                  icon={CalendarDays}
                />
              </div>

              {hasCriminal && (
                <div className="flex flex-col gap-3">
                  <Label>Criminal Cases</Label>
                  {director.criminalCases!.map((cc) => (
                    <div
                      key={cc.caseNumber}
                      className="flex flex-col gap-2.5 p-4 rounded-lg"
                      style={{
                        backgroundColor: `color-mix(in srgb, var(--destructive-500) 4%, transparent)`,
                        border:
                          "1px solid color-mix(in srgb, var(--destructive-500) 12%, transparent)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <Gavel
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{
                              color: "var(--destructive-500)",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: ff,
                              fontSize: "var(--text-base)",
                              fontWeight:
                                "var(--font-weight-medium)",
                              color: "var(--text-heading)",
                            }}
                          >
                            {cc.offence}
                          </span>
                        </div>
                        <StatusBadge
                          label={cc.status}
                          color="var(--warning-600)"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-3 pl-6">
                        <InfoCell
                          label="Section"
                          value={cc.section}
                        />
                        <InfoCell
                          label="Case No."
                          value={cc.caseNumber}
                        />
                        <InfoCell
                          label="Max Punishment"
                          value={cc.maxPunishment}
                          accent="var(--destructive-500)"
                        />
                        <InfoCell
                          label="Court"
                          value={cc.court}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   FINANCIALS TAB
   ═══════════════════════════════════════════════════════ */
const FinancialsContent = ({
  caseData,
  rc,
}: {
  caseData: CaseEntry;
  rc: (typeof riskColors)[RiskLevel];
}) => {
  const financials = caseData.detail?.financials;
  if (!financials)
    return (
      <EmptyState message="No financial data available for this case." />
    );

  const trend = financials.yearlyTrend;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5"
    >
      {/* Income Statement */}
      <Card delay={0.04}>
        <CardHeader icon={Banknote} title="Income Statement" />
        <div className="px-5 py-4 grid grid-cols-3 gap-3">
          <MetricTile
            label="Revenue"
            value={`₹${formatCurrency(financials.revenue)}`}
            sub={`${financials.revenueChange > 0 ? "+" : ""}${financials.revenueChange}% YoY`}
            subColor={
              financials.revenueChange >= 0
                ? "var(--success-500)"
                : "var(--destructive-500)"
            }
          />
          <MetricTile
            label="EBITDA"
            value={`₹${formatCurrency(financials.ebitda)}`}
            sub={`${financials.ebitdaMargin}% Margin`}
            subColor={
              financials.ebitdaMargin >= 15
                ? "var(--success-500)"
                : financials.ebitdaMargin >= 0
                ? "var(--warning-600)"
                : "var(--destructive-500)"
            }
          />
          <MetricTile
            label="Net Profit"
            value={`₹${formatCurrency(financials.netProfit)}`}
            sub={
              financials.netProfit >= 0
                ? "Profitable"
                : "Loss"
            }
            subColor={
              financials.netProfit >= 0
                ? "var(--success-500)"
                : "var(--destructive-500)"
            }
          />
          <MetricTile
            label="Cash Flow"
            value={`₹${formatCurrency(financials.cashFlow)}`}
            sub={
              financials.cashFlow >= 0 ? "Positive" : "Negative"
            }
            subColor={
              financials.cashFlow >= 0
                ? "var(--success-500)"
                : "var(--destructive-500)"
            }
          />
          <MetricTile
            label="Net Worth"
            value={`₹${formatCurrency(financials.netWorth)}`}
          />
          <MetricTile
            label="Total Debt"
            value={`₹${formatCurrency(financials.totalDebt)}`}
          />
        </div>
      </Card>

      {/* Balance Sheet Ratios */}
      <Card delay={0.08}>
        <CardHeader icon={Scale} title="Balance Sheet Ratios" />
        <div className="px-5 py-4 grid grid-cols-4 gap-3">
          <MetricTile
            label="D/E Ratio"
            value={`${financials.debtToEquity.toFixed(2)}x`}
            sub={
              financials.debtToEquity > 5
                ? "Toxic"
                : financials.debtToEquity > 3
                ? "High"
                : "Healthy"
            }
            subColor={
              financials.debtToEquity > 5
                ? "var(--destructive-500)"
                : financials.debtToEquity > 3
                ? "var(--warning-600)"
                : "var(--success-500)"
            }
          />
          <MetricTile
            label="Current Ratio"
            value={financials.currentRatio.toFixed(2)}
            sub={
              financials.currentRatio < 1
                ? "Locked"
                : financials.currentRatio < 1.5
                ? "Tight"
                : "Healthy"
            }
            subColor={
              financials.currentRatio < 1
                ? "var(--destructive-500)"
                : financials.currentRatio < 1.5
                ? "var(--warning-600)"
                : "var(--success-500)"
            }
          />
          <MetricTile
            label="Interest Coverage"
            value={`${financials.interestCoverage.toFixed(2)}x`}
            sub={
              financials.interestCoverage < 1
                ? "Default"
                : financials.interestCoverage < 1.5
                ? "Distressed"
                : "Adequate"
            }
            subColor={
              financials.interestCoverage < 1
                ? "var(--destructive-500)"
                : financials.interestCoverage < 1.5
                ? "var(--warning-600)"
                : "var(--success-500)"
            }
          />
          <MetricTile
            label="TOL / TNW"
            value={(
              financials.totalDebt / Math.max(financials.netWorth, 1)
            ).toFixed(2)}
            sub={
              financials.totalDebt / Math.max(financials.netWorth, 1) > 3
                ? "Overleveraged"
                : "Acceptable"
            }
            subColor={
              financials.totalDebt / Math.max(financials.netWorth, 1) > 3
                ? "var(--destructive-500)"
                : "var(--success-500)"
            }
          />
        </div>
      </Card>

      {/* Revenue Verification */}
      {financials.gstVerifiedTurnover != null && (
        <Card delay={0.12}>
          <CardHeader
            icon={ClipboardCheck}
            title="Revenue Verification"
            badge={
              <StatusBadge
                label={
                  Math.round(
                    (financials.gstVerifiedTurnover /
                      (financials.mcaReportedRevenue || financials.revenue)) *
                      100
                  ) < 85
                    ? "Gap Detected"
                    : "Verified"
                }
                color={
                  Math.round(
                    (financials.gstVerifiedTurnover /
                      (financials.mcaReportedRevenue || financials.revenue)) *
                      100
                  ) < 85
                    ? "var(--destructive-500)"
                    : "var(--success-500)"
                }
              />
            }
          />
          <div className="px-5 py-4 grid grid-cols-3 gap-3">
            <MetricTile
              label="MCA Reported"
              value={`₹${formatCurrency(financials.mcaReportedRevenue || financials.revenue)}`}
            />
            <MetricTile
              label="GST Verified"
              value={`₹${formatCurrency(financials.gstVerifiedTurnover)}`}
              sub={`${Math.round((financials.gstVerifiedTurnover / (financials.mcaReportedRevenue || financials.revenue)) * 100)}% match`}
              subColor={
                (financials.gstVerifiedTurnover /
                  (financials.mcaReportedRevenue || financials.revenue)) *
                  100 <
                85
                  ? "var(--destructive-500)"
                  : "var(--success-500)"
              }
            />
            <MetricTile
              label="Unverified Gap"
              value={`₹${formatCurrency((financials.mcaReportedRevenue || financials.revenue) - financials.gstVerifiedTurnover)}`}
              sub={`${100 - Math.round((financials.gstVerifiedTurnover / (financials.mcaReportedRevenue || financials.revenue)) * 100)}% gap`}
              subColor="var(--warning-600)"
            />
          </div>
        </Card>
      )}

      {/* Cash vs Debt Trend */}
      {trend && trend.length >= 2 && (
        <Card delay={0.16}>
          <CardHeader icon={LineChart} title="Cash vs Debt Trend" />
          <div className="px-5 py-4">
            <div
              className="rounded-lg overflow-hidden"
              style={{
                border: "1px solid var(--border-default)",
              }}
            >
              <div
                className="grid gap-0 px-4 py-2.5"
                style={{
                  gridTemplateColumns: `repeat(${trend.length + 1}, 1fr)`,
                  backgroundColor: "var(--surface-inset)",
                  borderBottom: "1px solid var(--border-default)",
                }}
              >
                <span
                  style={{
                    fontFamily: ff,
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-muted-themed)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Metric
                </span>
                {trend.map((t) => (
                  <span
                    key={t.year}
                    style={{
                      fontFamily: ff,
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-muted-themed)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      textAlign: "right",
                    }}
                  >
                    FY {t.year}
                  </span>
                ))}
              </div>
              {[
                {
                  label: "Cash Reserves",
                  key: "cash" as const,
                  color: "var(--success-500)",
                },
                {
                  label: "Total Borrowings",
                  key: "borrowings" as const,
                  color: "var(--destructive-500)",
                },
              ].map((row, ri) => (
                <div
                  key={row.key}
                  className="grid gap-0 px-4 py-2.5"
                  style={{
                    gridTemplateColumns: `repeat(${trend.length + 1}, 1fr)`,
                    borderBottom:
                      ri < 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="rounded-full"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: row.color,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: ff,
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--text-heading)",
                      }}
                    >
                      {row.label}
                    </span>
                  </div>
                  {trend.map((t) => (
                    <span
                      key={t.year}
                      style={{
                        fontFamily: ff,
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--text-body)",
                        textAlign: "right",
                      }}
                    >
                      ₹{formatCurrency(t[row.key])}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   NETWORK TAB
   ═══════════════════════════════════════════════════════ */
const NetworkContent = ({
  caseData,
  rc,
}: {
  caseData: CaseEntry;
  rc: (typeof riskColors)[RiskLevel];
}) => {
  const entities = caseData.detail?.networkEntities;
  if (!entities || entities.length === 0)
    return (
      <EmptyState message="No network entity data available for this case." />
    );

  const contagion = entities.filter((e) => e.isContagionSource);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5"
    >
      {/* Contagion Summary */}
      {contagion.length > 0 && (
        <Card delay={0.02}>
          <CardHeader
            icon={AlertTriangle}
            title="Contagion Sources"
            accentColor="var(--destructive-500)"
            badge={
              <StatusBadge
                label={`${contagion.length} Source${contagion.length > 1 ? "s" : ""}`}
                color="var(--destructive-500)"
              />
            }
          />
          <div className="px-5 py-4">
            <div
              className="flex items-start gap-3 p-4 rounded-lg"
              style={{
                background:
                  "color-mix(in srgb, var(--destructive-500) 4%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--destructive-500) 12%, transparent)",
              }}
            >
              <Sparkles
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: "var(--primary)" }}
              />
              <p
                style={{
                  fontFamily: ff,
                  fontSize: "var(--text-sm)",
                  lineHeight: "1.6",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--text-body)",
                  margin: 0,
                }}
              >
                Common directorship detected with{" "}
                {contagion.map((e) => e.name).join(", ")}. These
                entities share directors with {caseData.name} and are
                flagged as high-risk contagion sources due to
                overlapping governance and financial exposure.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Entity Cards */}
      {entities.map((entity, i) => {
        const erc = riskColors[entity.riskLevel];
        return (
          <Card key={entity.id} delay={0.04 * (i + 1)}>
            <CardHeader
              icon={Building2}
              title={entity.name}
              accentColor={
                entity.isContagionSource ? erc.accent : undefined
              }
              badge={
                <div className="flex items-center gap-2">
                  {entity.isContagionSource && (
                    <StatusBadge
                      label="Contagion"
                      color="var(--destructive-500)"
                    />
                  )}
                  <StatusBadge
                    label={`${entity.riskLevel} Risk`}
                    color={erc.accent}
                  />
                </div>
              }
            />
            <div className="px-5 py-4 grid grid-cols-4 gap-3">
              <InfoCell
                label="Industry"
                value={entity.natureOfBusiness}
                icon={Briefcase}
              />
              <InfoCell
                label="D/E Ratio"
                value={`${entity.debtToEquity.toFixed(2)}x`}
                accent={
                  entity.debtToEquity > 5
                    ? "var(--destructive-500)"
                    : entity.debtToEquity > 3
                    ? "var(--warning-600)"
                    : "var(--success-500)"
                }
                icon={Scale}
              />
              <InfoCell
                label="Net Profit"
                value={`₹${formatCurrency(entity.netProfit)}`}
                accent={
                  entity.netProfit < 0
                    ? "var(--destructive-500)"
                    : "var(--success-500)"
                }
              />
              <div className="flex flex-col gap-1">
                <Label>Common Directors</Label>
                <div className="flex flex-wrap gap-1">
                  {entity.commonDirectors.length > 0 ? (
                    entity.commonDirectors.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--info-600)",
                          backgroundColor:
                            "color-mix(in srgb, var(--info-400) 8%, transparent)",
                          border:
                            "1px solid color-mix(in srgb, var(--info-400) 15%, transparent)",
                        }}
                      >
                        <Link2
                          className="w-2.5 h-2.5"
                          style={{
                            color: "var(--info-600)",
                          }}
                        />
                        {d}
                      </span>
                    ))
                  ) : (
                    <span
                      style={{
                        fontFamily: ff,
                        fontSize: "var(--text-sm)",
                        color: "var(--text-muted-themed)",
                      }}
                    >
                      None
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   COMPLIANCE TAB
   ═══════════════════════════════════════════════════════ */
const ComplianceContent = ({
  caseData,
}: {
  caseData: CaseEntry;
}) => {
  const checks = [
    {
      label: "GST Filing",
      value: "Regular",
      status: "pass" as const,
      detail: "All returns filed on time for past 12 quarters",
    },
    {
      label: "EPF Compliance",
      value: "Filed",
      status: "pass" as const,
      detail: "Employee contributions up to date",
    },
    {
      label: "Statutory Audit",
      value: "Clean Opinion",
      status: "pass" as const,
      detail: "No qualifications in the last audit report",
    },
    {
      label: "AML / Sanctions",
      value: caseData.riskLevel === "High" ? "1 Match" : "No Hits",
      status:
        caseData.riskLevel === "High"
          ? ("warning" as const)
          : ("pass" as const),
      detail:
        caseData.riskLevel === "High"
          ? "Potential match found in sanctions list — manual review required"
          : "No matches found across OFAC, UN, EU, and domestic lists",
    },
    {
      label: "Adverse Media",
      value: caseData.riskLevel === "High" ? "3 Articles" : "None",
      status:
        caseData.riskLevel === "High"
          ? ("fail" as const)
          : ("pass" as const),
      detail:
        caseData.riskLevel === "High"
          ? "Negative news coverage related to legal proceedings"
          : "No adverse media articles found",
    },
    {
      label: "CIBIL / Bureau Check",
      value: caseData.riskLevel === "High" ? "Score: 580" : "Score: 720",
      status:
        caseData.riskLevel === "High"
          ? ("fail" as const)
          : ("pass" as const),
      detail:
        caseData.riskLevel === "High"
          ? "Below threshold — multiple defaults reported"
          : "Above threshold — healthy credit history",
    },
    {
      label: "MCA Compliance",
      value: "Filed",
      status: "pass" as const,
      detail: "All annual returns and financial statements filed",
    },
    {
      label: "ROC Charges",
      value: `${caseData.detail?.financials ? Math.ceil(caseData.detail.financials.totalDebt / 50000000) : 2} Active`,
      status: "pass" as const,
      detail: "All charges registered and no satisfaction pending",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5"
    >
      <Card delay={0.02}>
        <CardHeader
          icon={ClipboardCheck}
          title="Compliance & Verification Checks"
          badge={
            <StatusBadge
              label={`${checks.filter((c) => c.status === "pass").length}/${checks.length} Passed`}
              color={
                checks.every((c) => c.status === "pass")
                  ? "var(--success-500)"
                  : "var(--warning-600)"
              }
            />
          }
        />
        <div className="px-5 py-4 flex flex-col gap-0">
          {checks.map((check, i) => {
            const statusIcon =
              check.status === "pass" ? (
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: "var(--success-500)" }}
                />
              ) : check.status === "warning" ? (
                <AlertTriangle
                  className="w-4 h-4"
                  style={{ color: "var(--warning-600)" }}
                />
              ) : (
                <XCircle
                  className="w-4 h-4"
                  style={{ color: "var(--destructive-500)" }}
                />
              );

            return (
              <div
                key={check.label}
                className="flex items-center gap-4 py-3.5"
                style={{
                  borderBottom:
                    i < checks.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                }}
              >
                {statusIcon}
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span
                    style={{
                      fontFamily: ff,
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-heading)",
                    }}
                  >
                    {check.label}
                  </span>
                  <span
                    style={{
                      fontFamily: ff,
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      color: "var(--text-muted-themed)",
                    }}
                  >
                    {check.detail}
                  </span>
                </div>
                <StatusBadge
                  label={check.value}
                  color={
                    check.status === "pass"
                      ? "var(--success-500)"
                      : check.status === "warning"
                      ? "var(--warning-600)"
                      : "var(--destructive-500)"
                  }
                />
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   TIMELINE TAB
   ═══════════════════════════════════════════════════════ */
const TimelineContent = ({
  events,
}: {
  events: {
    date: string;
    title: string;
    description: string;
    type: "info" | "warning" | "danger" | "success";
  }[];
}) => {
  const typeColors = {
    info: "var(--primary)",
    warning: "var(--warning-600)",
    danger: "var(--destructive-500)",
    success: "var(--success-500)",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5"
    >
      <Card delay={0.02}>
        <CardHeader icon={Clock} title="Chronological Events" />
        <div className="px-5 py-4">
          <div className="relative flex flex-col">
            {/* Vertical line */}
            <div
              className="absolute left-[7px] top-3 bottom-3"
              style={{
                width: "2px",
                backgroundColor: "var(--border-subtle)",
              }}
            />

            {events.map((event, i) => {
              const color = typeColors[event.type];
              return (
                <motion.div
                  key={`${event.date}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.04 * i,
                  }}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  {/* Dot */}
                  <div
                    className="relative z-10 shrink-0 rounded-full"
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
                      border: `2px solid ${color}`,
                      marginTop: "2px",
                    }}
                  >
                    <div
                      className="absolute inset-[4px] rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-base)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--text-heading)",
                        }}
                      >
                        {event.title}
                      </span>
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--text-muted-themed)",
                        }}
                      >
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: ff,
                        fontSize: "var(--text-sm)",
                        lineHeight: "1.6",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--text-secondary-themed)",
                        margin: 0,
                      }}
                    >
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/* ─── Shared Helpers ─── */
const MetricTile = ({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) => (
  <div
    className="flex flex-col gap-1.5 p-3 rounded-xl"
    style={{
      backgroundColor: "var(--surface-inset)",
      border: "1px solid var(--border-default)",
    }}
  >
    <Label>{label}</Label>
    <span
      style={{
        fontFamily: ff,
        fontSize: "var(--paragraph-sm-desktop-size)",
        lineHeight: "var(--paragraph-sm-desktop-line-height)",
        fontWeight: "var(--font-weight-medium)",
        color: "var(--text-heading)",
        letterSpacing: "var(--paragraph-sm-desktop-letter-spacing)",
      }}
    >
      {value}
    </span>
    {sub && (
      <span
        style={{
          fontFamily: ff,
          fontSize: "var(--text-xs)",
          lineHeight: "1",
          fontWeight: "var(--font-weight-medium)",
          color: subColor || "var(--text-muted-themed)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {sub}
      </span>
    )}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <Info
      className="w-8 h-8 mb-3"
      style={{ color: "var(--text-muted-themed)", opacity: 0.4 }}
    />
    <span
      style={{
        fontFamily: ff,
        fontSize: "var(--text-base)",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--text-muted-themed)",
      }}
    >
      {message}
    </span>
  </motion.div>
);
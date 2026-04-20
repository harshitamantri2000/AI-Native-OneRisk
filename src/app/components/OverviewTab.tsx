import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  AlertTriangle,
  Waypoints,
  HeartPulse,
  ExternalLink,
  Link2,
  CheckCircle2,
  Briefcase,
  ListChecks,
} from "lucide-react";
import type {
  CaseEntry,
} from "../data/cases";
import { NetworkContagionMap } from "./NetworkContagionMap";
import {
  SolvencyHeatmap,
  SurvivalRunway,
  RevenueIntegrity,
  CashDebtXChart,
} from "./FinancialHealthVisuals";

const ff = "'Plus Jakarta Sans', sans-serif";

const formatCurrency = (val: number): string => {
  if (Math.abs(val) >= 10000000000) return `${(val / 10000000).toFixed(0)} Cr`;
  if (Math.abs(val) >= 10000000) return `${(val / 10000000).toFixed(1)} Cr`;
  if (Math.abs(val) >= 100000) return `${(val / 100000).toFixed(1)} L`;
  return val.toLocaleString("en-IN");
};

/* ─── Standalone Section Heading (outside cards) ─── */
const SectionHeading = ({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent?: { bg: string; border: string; icon: string };
  children?: React.ReactNode;
}) => {
  const defaultAccent = {
    bg: "var(--icon-box-bg)",
    border: "var(--icon-box-border)",
    icon: "var(--text-secondary-themed)",
  };
  const a = accent || defaultAccent;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: a.bg,
          border: `1px solid ${a.border}`,
        }}
      >
        <Icon
          className="w-4 h-4"
          style={{ color: a.icon }}
        />
      </div>
      <span
        style={{
          fontFamily: ff,
          fontSize: "13px",
          lineHeight: "1.3",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--text-heading)",
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
        }}
      >
        {title}
      </span>
      {children && <div className="ml-auto flex items-center">{children}</div>}
    </div>
  );
};

/* ─── Section accent palettes ─── */
const ACCENT_CONTAGION = {
  bg: "color-mix(in srgb, var(--warning-600) 12%, transparent)",
  border: "color-mix(in srgb, var(--warning-600) 24%, transparent)",
  icon: "var(--warning-600)",
};
const ACCENT_FINANCIAL = {
  bg: "color-mix(in srgb, var(--primary) 10%, transparent)",
  border: "color-mix(in srgb, var(--primary) 20%, transparent)",
  icon: "var(--primary)",
};
const ACCENT_COMPLIANCE = {
  bg: "color-mix(in srgb, var(--success-500) 12%, transparent)",
  border: "color-mix(in srgb, var(--success-500) 22%, transparent)",
  icon: "var(--success-500)",
};

/* ─── Flat Card (no shadow) ─── */
const FlatCard = ({
  children,
  className = "",
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay, ease: [0.23, 1, 0.32, 1] }}
    className={`rounded-xl overflow-hidden ${className}`}
    style={{
      backgroundColor: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      ...style,
    }}
  >
    {children}
  </motion.div>
);

/* ─── Nav Link Button ─── */
const NavLink = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    className="flex items-center gap-1.5 cursor-pointer"
    style={{ background: "none", border: "none", padding: 0 }}
    onClick={onClick}
  >
    <span
      style={{
        fontFamily: ff,
        fontSize: "11px",
        lineHeight: "1",
        fontWeight: "var(--font-weight-medium)",
        color: "var(--primary)",
      }}
    >
      {label}
    </span>
    <ExternalLink className="w-3 h-3" style={{ color: "var(--primary)" }} />
  </button>
);

/* ─── AI Summary Card (distinct styling) ─── */
const AISummaryCard = ({ text }: { text: string }) => (
  <div
    className="flex items-start gap-3 p-4 rounded-lg"
    style={{
      background: "linear-gradient(135deg, rgba(23, 102, 214, 0.06) 0%, rgba(92, 212, 230, 0.04) 100%)",
      border: "1px solid rgba(23, 102, 214, 0.12)",
    }}
  >
    <div
      className="flex items-center justify-center rounded-md flex-shrink-0"
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: "rgba(23, 102, 214, 0.1)",
        border: "1px solid rgba(23, 102, 214, 0.15)",
      }}
    >
      <Sparkles className="w-3 h-3" style={{ color: "var(--primary)" }} />
    </div>
    <div className="flex flex-col gap-1 min-w-0">
      <span
        style={{
          fontFamily: ff,
          fontSize: "10px",
          lineHeight: "1",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--primary)",
          textTransform: "uppercase" as const,
          letterSpacing: "0.06em",
        }}
      >
        AI Insight
      </span>
      <p
        style={{
          fontFamily: ff,
          fontSize: "12px",
          lineHeight: "1.6",
          fontWeight: "var(--font-weight-normal)",
          color: "var(--text-body)",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  </div>
);

/* ─── Main Overview Tab ─── */
interface OverviewTabProps {
  caseData: CaseEntry;
  onTabChange: (tab: "overview" | "financials" | "directors" | "cam") => void;
}

export const OverviewTab = ({ caseData, onTabChange }: OverviewTabProps) => {
  const detail = caseData.detail;
  const financials = detail?.financials;

  const isHighRiskCriminal =
    caseData.riskLevel === "High" &&
    detail?.directors.some((d) => (d.criminalCases?.length || 0) > 0);

  const allCriminal =
    detail?.directors.flatMap((d) =>
      (d.criminalCases || []).map((c) => ({ ...c, directorName: d.name }))
    ) || [];

  const hasNetwork = (detail?.networkEntities?.length || 0) > 0;
  const contagionEntities =
    detail?.networkEntities?.filter((n) => n.isContagionSource) || [];

  const aiSummaryText = (() => {
    if (allCriminal.length > 0 && contagionEntities.length > 0) {
      return `Common directorship detected with ${contagionEntities[0]?.name || "unknown entity"} — active charges include ${allCriminal
        .map((c) => c.offence.toLowerCase())
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", ")}. Cross-entity contagion risk is elevated.`;
    }
    if (contagionEntities.length > 0) {
      return `Common directorship detected with ${contagionEntities[0]?.name || "unknown entity"} — flagged as a high-risk contagion source. Monitor cross-entity exposure carefully.`;
    }
    return caseData.riskLevel === "Low"
      ? `${caseData.name} demonstrates a healthy financial profile with manageable risk factors. Standard monitoring protocols are recommended.`
      : `${caseData.name} requires enhanced monitoring due to elevated risk signals. Consider scheduling a quarterly deep-dive review.`;
  })();

  return (
    <div
      className="flex flex-col"
      style={{ padding: "20px 24px", gap: "28px", minHeight: "100%" }}
    >
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — Network Contagion Map
          ═══════════════════════════════════════════════════════ */}
      {hasNetwork && financials && detail?.networkEntities && (
        <div className="flex flex-col gap-3">
          <SectionHeading icon={Waypoints} title="Financial Contagion Map" accent={ACCENT_CONTAGION}>
            <NavLink label="View all directors" onClick={() => onTabChange("directors")} />
          </SectionHeading>

          <FlatCard delay={0.02} className="flex flex-col" style={{ minHeight: "400px" }}>
            {/* 70 / 30 split */}
            <div className="flex flex-1 min-h-0">
              {/* ── Map Panel ── */}
              <div
                className="flex flex-col overflow-hidden"
                style={{
                  flex: "7 1 0%",
                  borderRight: "1px solid var(--border-default)",
                }}
              >
                {/* Sub-header */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <span
                    style={{
                      fontFamily: ff,
                      fontSize: "11px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-secondary-themed)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    Director Cross-Entity Network
                  </span>
                  {contagionEntities.length > 0 && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ml-auto"
                      style={{
                        fontFamily: ff,
                        fontSize: "10px",
                        lineHeight: "1",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--destructive-500)",
                        backgroundColor: "rgba(226, 51, 24, 0.08)",
                        border: "1px solid rgba(226, 51, 24, 0.15)",
                      }}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Contagion Risk
                    </span>
                  )}
                </div>

                {/* Graph */}
                <div
                  className="flex items-center justify-center flex-1"
                  style={{ padding: "8px" }}
                >
                  <NetworkContagionMap
                    centerName={caseData.name}
                    centerRiskLevel={caseData.riskLevel}
                    centerDebtToEquity={financials.debtToEquity}
                    networkEntities={detail.networkEntities}
                  />
                </div>
              </div>

              {/* ── Red Flags + AI Summary Panel ── */}
              <div
                className="flex flex-col min-h-0"
                style={{ flex: "3 1 0%" }}
              >
                {/* Red Flags header */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <AlertTriangle
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--destructive-500)" }}
                  />
                  <span
                    style={{
                      fontFamily: ff,
                      fontSize: "11px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-heading)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    Red Flags
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full ml-auto"
                    style={{
                      fontFamily: ff,
                      fontSize: "10px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-on-color)",
                      backgroundColor: "var(--destructive-500)",
                    }}
                  >
                    {(() => {
                      const totalFlags =
                        allCriminal.length +
                        contagionEntities.length +
                        (financials.netProfit < 0 ? 1 : 0);
                      return totalFlags;
                    })()}
                  </span>
                </div>

                {/* Scrollable flag items */}
                <div
                  className="overflow-y-auto px-3 py-3 flex flex-col gap-2"
                  style={{ flex: "1 1 0%" }}
                >
                  {contagionEntities.map((entity) => (
                    <div
                      key={`contagion-${entity.id}`}
                      className="flex flex-col gap-2 p-3 rounded-lg"
                      style={{
                        backgroundColor: "var(--surface-card-inset)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Briefcase
                            className="w-3 h-3 flex-shrink-0"
                            style={{ color: "var(--text-secondary-themed)" }}
                          />
                          <span
                            style={{
                              fontFamily: ff,
                              fontSize: "12px",
                              lineHeight: "1.3",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--text-heading)",
                            }}
                          >
                            {entity.name}
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: ff,
                            fontSize: "10px",
                            lineHeight: "1",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--destructive-500)",
                            textTransform: "uppercase" as const,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {entity.riskLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          style={{
                            fontFamily: ff,
                            fontSize: "10px",
                            lineHeight: "1",
                            fontWeight: "var(--font-weight-normal)",
                            color: "var(--text-muted-themed)",
                          }}
                        >
                          Net Profit
                        </span>
                        <span
                          style={{
                            fontFamily: ff,
                            fontSize: "11px",
                            lineHeight: "1",
                            fontWeight: "var(--font-weight-medium)",
                            color:
                              entity.netProfit < 0
                                ? "var(--destructive-500)"
                                : "var(--success-500)",
                          }}
                        >
                          {"\u20B9"}{formatCurrency(entity.netProfit)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entity.commonDirectors.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                            style={{
                              fontFamily: ff,
                              fontSize: "9px",
                              lineHeight: "1",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--info-600)",
                              backgroundColor: "rgba(92, 212, 230, 0.06)",
                              border: "1px solid rgba(92, 212, 230, 0.12)",
                            }}
                          >
                            <Link2 className="w-2.5 h-2.5" style={{ color: "var(--info-600)" }} />
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {allCriminal.map((cc) => (
                    <div
                      key={`criminal-${cc.caseNumber}`}
                      className="flex flex-col gap-1.5 p-3 rounded-lg"
                      style={{
                        backgroundColor: "var(--surface-card-inset)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          style={{
                            fontFamily: ff,
                            fontSize: "12px",
                            lineHeight: "1.4",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--text-heading)",
                          }}
                        >
                          {cc.offence}
                        </span>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded flex-shrink-0"
                          style={{
                            fontFamily: ff,
                            fontSize: "8px",
                            lineHeight: "1",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--warning-700)",
                            backgroundColor: "rgba(203, 113, 0, 0.08)",
                            border: "1px solid rgba(203, 113, 0, 0.15)",
                            textTransform: "uppercase" as const,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {cc.status}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "10px",
                          lineHeight: "1.3",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--text-muted-themed)",
                        }}
                      >
                        {cc.section} · {cc.directorName}
                        {cc.maxPunishment ? ` · Max: ${cc.maxPunishment}` : ""}
                      </span>
                    </div>
                  ))}
                </div>

                {/* AI Summary at bottom of Red Flags — visually distinct */}
                <div
                  className="flex-shrink-0 px-3 pb-3"
                  style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}
                >
                  <AISummaryCard text={aiSummaryText} />
                </div>

                {/* View Directors CTA */}
                <div
                  className="px-4 py-2.5 flex-shrink-0"
                  style={{ borderTop: "1px solid var(--border-subtle)" }}
                >
                  <NavLink label="View director details" onClick={() => onTabChange("directors")} />
                </div>
              </div>
            </div>
          </FlatCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — Financial Health  (4 individual cards)
          ═══════════════════════════════════════════════════════ */}
      {financials && (
        <div className="flex flex-col gap-3">
          <SectionHeading icon={HeartPulse} title="Financial Health" accent={ACCENT_FINANCIAL}>
            <NavLink label="View all" onClick={() => onTabChange("financials")} />
          </SectionHeading>

          <div className="grid grid-cols-2 gap-4">
            {/* Card a: Revenue Integrity */}
            {financials.gstVerifiedTurnover != null && (
              <FlatCard delay={0.04}>
                <RevenueIntegrity financials={financials} />
              </FlatCard>
            )}

            {/* Card b: Solvency Benchmarking */}
            <FlatCard delay={0.06}>
              {financials.industryMedianDE != null ? (
                <SolvencyHeatmap
                  financials={financials}
                  entityName={caseData.name}
                />
              ) : (
                <div className="flex flex-col gap-2 p-5">
                  <span
                    style={{
                      fontFamily: ff,
                      fontSize: "12px",
                      lineHeight: "1.3",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-heading)",
                    }}
                  >
                    D/E Ratio
                  </span>
                  <span
                    style={{
                      fontFamily: ff,
                      fontSize: "28px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-medium)",
                      color:
                        financials.debtToEquity > 3
                          ? "var(--destructive-500)"
                          : financials.debtToEquity > 1.5
                          ? "var(--warning-600)"
                          : "var(--success-500)",
                    }}
                  >
                    {financials.debtToEquity.toFixed(2)}x
                  </span>
                </div>
              )}
            </FlatCard>

            {/* Card c: Cash vs Debt */}
            {financials.yearlyTrend && financials.yearlyTrend.length >= 2 && (
              <FlatCard delay={0.08}>
                <CashDebtXChart financials={financials} />
              </FlatCard>
            )}

            {/* Card d: Liquidity Runway */}
            {financials.cashReserves != null && (
              <FlatCard delay={0.1}>
                <SurvivalRunway financials={financials} />
              </FlatCard>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — Compliance Checks  (5 individual cards)
          ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3">
        <SectionHeading icon={ListChecks} title="Compliance Checks" accent={ACCENT_COMPLIANCE} />

        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "GST", value: "Regular", icon: CheckCircle2 },
            { label: "EPF", value: "Filed", icon: CheckCircle2 },
            { label: "Auditor", value: "Clean", icon: CheckCircle2 },
            { label: "AML / Sanctions", value: "No hits", icon: CheckCircle2 },
            { label: "Adverse Media", value: "None", icon: CheckCircle2 },
          ].map((item, idx) => (
            <FlatCard key={item.label} delay={0.04 + idx * 0.02}>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: ff,
                      fontSize: "10px",
                      lineHeight: "1.3",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-muted-themed)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {item.label}
                  </span>
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "18px",
                      height: "18px",
                      backgroundColor: "rgba(76, 175, 71, 0.1)",
                    }}
                  >
                    <CheckCircle2
                      className="w-3 h-3"
                      style={{ color: "var(--success-500)" }}
                    />
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: ff,
                    fontSize: "14px",
                    lineHeight: "1",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--success-500)",
                  }}
                >
                  {item.value}
                </span>
              </div>
            </FlatCard>
          ))}
        </div>
      </div>

      {/* ─── Fallback AI Recommendation (non-network cases) ─── */}
      {!isHighRiskCriminal && !hasNetwork && (
        <div className="flex flex-col gap-3">
          <SectionHeading icon={Sparkles} title="AI Recommendation" />
          <FlatCard delay={0.08}>
            <div className="p-5">
              <AISummaryCard
                text={
                  caseData.riskLevel === "Low"
                    ? `Based on the AI assessment, ${caseData.name} demonstrates a healthy financial profile with manageable risk factors. Standard monitoring protocols are recommended.`
                    : `${caseData.name} requires enhanced monitoring due to elevated risk signals. Consider scheduling a quarterly deep-dive review and tracking financial covenants monthly.`
                }
              />
            </div>
          </FlatCard>
        </div>
      )}
    </div>
  );
};
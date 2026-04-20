import React from "react";
import type { RichCaseEntry, FinancialParameter } from "../../data/mock";
import { NetworkGraphCanvas } from "./NetworkGraphCanvas";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

/* ─── Entity types that have a corporate network (directors / subsidiaries) ─── */
const NETWORK_CAPABLE_TYPES = new Set([
  "Private Limited",
  "Public Limited",
  "LLP",
  "Limited Liability Partnership",
  "Partnership",
  "One Person Company",
  "OPC",
  "Section 8 Company",
]);

const canHaveNetwork = (entityType?: string): boolean => {
  if (!entityType) return false;
  return NETWORK_CAPABLE_TYPES.has(entityType);
};

/* ─── Select top 6: P5 first → P4 flagged → P4 unflagged ─────────────────── */
function selectTop6(params: FinancialParameter[]): FinancialParameter[] {
  const p5        = params.filter((p) => p.priority === 5);
  const p4flagged = params.filter((p) => p.priority === 4 && !!p.flagged);
  const p4rest    = params.filter((p) => p.priority === 4 && !p.flagged);
  return [...p5, ...p4flagged, ...p4rest].slice(0, 6);
}

const fmtVal = (value: number | string, unit?: string): string => {
  if (unit === "₹") return `₹${(Number(value) / 1e7).toFixed(2)} Cr`;
  if (unit === "₹/mo") return `₹${(Number(value) / 1e5).toFixed(2)} L/mo`;
  if (typeof value === "number") return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  return String(value);
};

/* ─── Financial metric card ───────────────────────────────────────────────── */
const FinancialMetricCard: React.FC<{ param: FinancialParameter; isPrimary?: boolean }> = ({ param, isPrimary }) => {
  const isFlagged = !!param.flagged;
  const isUp = param.trend === "up";
  const hasChange = param.trend && param.trend !== "stable" && param.trendValue !== undefined;
  const trendColor = isUp ? "#16A34A" : "#DC2626";
  const trendBg    = isUp ? "#F0FDF4" : "#FEF2F2";

  return (
    <div style={{
      ...f,
      backgroundColor: "var(--surface-card)",
      border: isFlagged ? "1.5px solid #EF4444" : "1px solid var(--border-subtle)",
      borderRadius: 10,
      display: "flex", flexDirection: "column",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Row 1: name + source */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minWidth: 0 }}>
            {isFlagged && (
              <span style={{ fontSize: "10px", flexShrink: 0, lineHeight: 1, color: "#EF4444" }}>⚑</span>
            )}
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted-themed)", lineHeight: 1.35 }}>
              {param.name}
            </span>
          </div>
          <span style={{ fontSize: "8.5px", fontWeight: 600, color: "var(--text-muted-themed)", flexShrink: 0, marginTop: 1 }}>
            {param.source}
          </span>
        </div>

        {/* Row 2: value + trend */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{
            fontSize: isPrimary ? "20px" : "18px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "var(--text-heading)",
          }}>
            {fmtVal(param.value, param.unit)}
          </span>
          {hasChange ? (
            <span style={{ fontSize: "10px", fontWeight: 700, color: trendColor, backgroundColor: trendBg, padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>
              {isUp ? "↑" : "↓"} {Math.abs(param.trendValue!)}%
            </span>
          ) : (
            param.trend === "stable" && (
              <span style={{ fontSize: "10px", fontWeight: 500, color: "var(--text-muted-themed)", flexShrink: 0 }}>
                — stable
              </span>
            )
          )}
        </div>

        {/* Row 3: benchmark */}
        {param.benchmarkValue !== undefined && (
          <span style={{ fontSize: "9.5px", color: "var(--text-muted-themed)" }}>
            {param.benchmarkLabel ?? "Benchmark"}: {fmtVal(param.benchmarkValue, param.unit)}
          </span>
        )}

        {/* Row 4: AI insight */}
        {param.aiCommentary && (
          <div style={{ display: "flex", gap: 5, alignItems: "flex-start", paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "9px", color: "var(--primary)", flexShrink: 0, marginTop: 2 }}>✦</span>
            <p style={{
              fontSize: "9.5px", color: "var(--text-muted-themed)", lineHeight: 1.6, margin: 0,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const, overflow: "hidden",
            }}>
              {param.aiCommentary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20, ...style }}>
    {children}
  </div>
);

const networkRiskColor = (level: "HIGH" | "MEDIUM" | "LOW") => ({
  HIGH:   { text: "var(--destructive-700)", bg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)" },
  MEDIUM: { text: "var(--warning-700)", bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)" },
  LOW:    { text: "var(--success-700)", bg: "color-mix(in srgb, var(--success-500) 10%, transparent)" },
}[level]);

export const OverviewTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const { detail, aiInsight } = entry;

  const networkCapable = canHaveNetwork(detail.entityType);
  const hasNetworkNodes = detail.networkNodes.length > 0;

  const top6      = selectTop6(detail.financialParameters);
  const coreCards = top6.filter((p) => p.priority === 5);
  const watchCards = top6.filter((p) => p.priority < 5);
  const flagCount = top6.filter((p) => !!p.flagged).length;

  return (
    <div className="p-6 flex flex-col gap-4">

      {/* ── Network Contagion Map ── only for corporate entity types ── */}
      {networkCapable && (
        <div style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>
              Network Contagion Map
            </h3>
            <div className="flex items-center gap-2">
              {aiInsight.networkRisk && (
                <span style={{
                  ...f,
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: networkRiskColor(aiInsight.networkRisk.level).text,
                  backgroundColor: networkRiskColor(aiInsight.networkRisk.level).bg,
                  padding: "2px 8px",
                  borderRadius: 999,
                }}>
                  Network Risk: {aiInsight.networkRisk.level}
                </span>
              )}
              <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted-themed)", backgroundColor: "var(--neutral-100)", padding: "2px 8px", borderRadius: 999 }}>
                {aiInsight.confidencePercent}% confidence
              </span>
            </div>
          </div>

          {hasNetworkNodes ? (
            <NetworkGraphCanvas entry={entry} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2" style={{ height: 200, color: "var(--text-muted-themed)" }}>
              <span style={{ ...f, fontSize: "var(--text-sm)" }}>No connected entities found</span>
              <span style={{ ...f, fontSize: "var(--text-xs)" }}>No subsidiaries, associates, or common-director companies in this network.</span>
            </div>
          )}
        </div>
      )}

      {/* ── For non-network entities: AI Insights ── */}
      {!networkCapable && (
        <SectionCard>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>AI Insights</h3>
              <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted-themed)", backgroundColor: "var(--neutral-100)", padding: "2px 8px", borderRadius: 999 }}>
                {aiInsight.confidencePercent}% confidence
              </span>
            </div>
            <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "1.6" }}>{aiInsight.summary}</p>
            <div className="flex flex-col gap-1">
              <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Top Risk</span>
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--destructive-700)" }}>{aiInsight.topRisk}</span>
            </div>
            {aiInsight.factors.length > 0 && (
              <ul className="flex flex-col gap-1">
                {aiInsight.factors.map((item, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-body)" }}>
                    <span style={{ color: "var(--text-muted-themed)" }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionCard>
      )}

      {/* ── Financial Health ── */}
      {top6.length > 0 && (
        <SectionCard>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>
              Financial Health
            </h3>
            {flagCount > 0 && (
              <span style={{
                ...f,
                fontSize: "11px", fontWeight: 700,
                color: "#DC2626", backgroundColor: "#FEE2E2",
                border: "1px solid #FECACA",
                padding: "2px 10px", borderRadius: 999,
              }}>
                ⚑ {flagCount} {flagCount === 1 ? "flag" : "flags"} require attention
              </span>
            )}
          </div>

          {/* Core Metrics (P5) */}
          {coreCards.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: watchCards.length > 0 ? 20 : 0 }}>
              <span style={{ ...f, fontSize: "10px", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Core Metrics
              </span>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {coreCards.map((param) => (
                  <FinancialMetricCard key={param.id} param={param} isPrimary />
                ))}
              </div>
            </div>
          )}

          {/* Watch List (P4) */}
          {watchCards.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ ...f, fontSize: "10px", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Watch List
              </span>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {watchCards.map((param) => (
                  <FinancialMetricCard key={param.id} param={param} />
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Source Reconciliation (conditional) ── */}
      {detail.sourceReconciliation && detail.sourceReconciliation.length > 0 && (
        <SectionCard>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>
              Data Source Reconciliation
            </h3>
            {(() => {
              const count = detail.sourceReconciliation!.filter(r => r.discrepancy).length;
              return count > 0 ? (
                <span style={{ ...f, fontSize: "11px", fontWeight: 700, color: "#DC2626", backgroundColor: "#FEE2E2", border: "1px solid #FECACA", padding: "2px 10px", borderRadius: 999 }}>
                  ⚑ {count} {count === 1 ? "discrepancy" : "discrepancies"}
                </span>
              ) : null;
            })()}
          </div>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {detail.sourceReconciliation.map((row, i) => {
              const isLast = i === detail.sourceReconciliation!.length - 1;
              return (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "12px 0 12px 12px",
                  borderBottom: isLast ? "none" : "1px solid var(--border-subtle)",
                  borderLeft: row.discrepancy ? "2px solid #EF4444" : "2px solid #22C55E",
                  marginLeft: -12,
                  paddingLeft: 12,
                }}>
                  {/* Left: metric + note */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
                    <span style={{ ...f, fontSize: "12px", fontWeight: 600, color: "var(--text-heading)" }}>
                      {row.metric}
                    </span>
                    {row.discrepancyNote && (
                      <span style={{ ...f, fontSize: "10px", color: row.discrepancy ? "#B91C1C" : "var(--text-muted-themed)", lineHeight: 1.5 }}>
                        {row.discrepancyNote}
                      </span>
                    )}
                  </div>

                  {/* Right: source chips + status */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {row.mcaValue !== undefined && (
                        <span style={{ ...f, fontSize: "10px", fontWeight: 500, color: "var(--text-heading)", backgroundColor: "var(--neutral-100)", padding: "2px 7px", borderRadius: 5 }}>
                          MCA · ₹{(Number(row.mcaValue) / 1e7).toFixed(2)} Cr
                        </span>
                      )}
                      {row.gstValue !== undefined && (
                        <span style={{ ...f, fontSize: "10px", fontWeight: 500, color: "var(--text-heading)", backgroundColor: "var(--neutral-100)", padding: "2px 7px", borderRadius: 5 }}>
                          GST · ₹{(Number(row.gstValue) / 1e7).toFixed(2)} Cr
                        </span>
                      )}
                      {row.itrValue !== undefined && (
                        <span style={{ ...f, fontSize: "10px", fontWeight: 500, color: "var(--text-heading)", backgroundColor: "var(--neutral-100)", padding: "2px 7px", borderRadius: 5 }}>
                          ITR · ₹{(Number(row.itrValue) / 1e7).toFixed(2)} Cr
                        </span>
                      )}
                      {row.bankingValue !== undefined && (
                        <span style={{ ...f, fontSize: "10px", fontWeight: 500, color: "var(--text-heading)", backgroundColor: "var(--neutral-100)", padding: "2px 7px", borderRadius: 5 }}>
                          Banking · ₹{(Number(row.bankingValue) / 1e7).toFixed(2)} Cr
                        </span>
                      )}
                    </div>
                    {row.discrepancy ? (
                      <span style={{ ...f, fontSize: "10px", fontWeight: 700, color: "#DC2626" }}>⚑ Discrepancy</span>
                    ) : (
                      <span style={{ ...f, fontSize: "10px", fontWeight: 600, color: "#16A34A" }}>✓ Clear</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

import React, { useMemo } from "react";
import { motion } from "motion/react";
import {
  Clock,
  TrendingDown,
  Scale,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";
import type { FinancialData } from "../data/cases";

/* ─── Shared Primitives ─── */
const ff = "'Plus Jakarta Sans', sans-serif";

const fmt = (val: number): string => {
  const a = Math.abs(val);
  const s = val < 0 ? "-" : "";
  if (a >= 10000000) return `${s}${(a / 10000000).toFixed(1)} Cr`;
  if (a >= 100000) return `${s}${(a / 100000).toFixed(1)} L`;
  return `${s}${a.toLocaleString("en-IN")}`;
};

/* ─── Consistent Hierarchy Tokens ─── */

/** Card title — icon + title inline, compact */
const CardTitle = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children?: React.ReactNode;
}) => (
  <div
    className="flex items-center justify-between"
    style={{
      paddingBottom: "10px",
      borderBottom: "1px solid var(--border-subtle)",
      marginBottom: "4px",
    }}
  >
    <div className="flex items-center gap-2">
      <Icon
        className="w-3.5 h-3.5"
        style={{ color: "var(--text-secondary-themed)" }}
      />
      <span
        style={{
          fontFamily: ff,
          fontSize: "12px",
          lineHeight: "1.2",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--text-heading)",
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
        }}
      >
        {title}
      </span>
    </div>
    {children}
  </div>
);

/** Hero value */
const heroStyle = (size = "28px"): React.CSSProperties => ({
  fontFamily: ff,
  fontSize: size,
  lineHeight: "1",
  fontWeight: "var(--font-weight-medium)",
  color: "var(--text-heading)",
  letterSpacing: "-0.01em",
});

/** Supporting value */
const valueStyle = (color = "var(--text-heading)"): React.CSSProperties => ({
  fontFamily: ff,
  fontSize: "13px",
  lineHeight: "1",
  fontWeight: "var(--font-weight-medium)",
  color,
});

/** Label / caption */
const cap = (
  text: string,
  size = "10px",
  extra?: React.CSSProperties
): JSX.Element => (
  <span
    style={{
      fontFamily: ff,
      fontSize: size,
      lineHeight: "1.3",
      fontWeight: "var(--font-weight-normal)",
      color: "var(--text-muted-themed)",
      letterSpacing: "0.03em",
      textTransform: "uppercase" as const,
      ...extra,
    }}
  >
    {text}
  </span>
);

/** Insight callout — compact */
const Insight = ({
  text,
  variant = "neutral",
}: {
  text: string;
  variant?: "neutral" | "warning" | "danger" | "success";
}) => {
  const accents = {
    neutral: { border: "var(--border-strong)", bg: "var(--surface-inset)", icon: "var(--text-secondary-themed)" },
    warning: { border: "var(--warning-600)", bg: "rgba(203, 113, 0, 0.06)", icon: "var(--warning-600)" },
    danger: { border: "var(--destructive-500)", bg: "rgba(226, 51, 24, 0.06)", icon: "var(--destructive-500)" },
    success: { border: "var(--success-500)", bg: "rgba(76, 175, 71, 0.06)", icon: "var(--success-500)" },
  };
  const a = accents[variant];

  return (
    <div
      className="flex items-start gap-2 rounded-md"
      style={{
        padding: "8px 10px",
        backgroundColor: a.bg,
        borderLeft: `2px solid ${a.border}`,
      }}
    >
      <Lightbulb
        className="w-3 h-3 flex-shrink-0"
        style={{ color: a.icon, marginTop: "1px" }}
      />
      <span
        style={{
          fontFamily: ff,
          fontSize: "10px",
          lineHeight: "1.5",
          fontWeight: "var(--font-weight-normal)",
          color: "var(--text-body)",
          textTransform: "none" as const,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** Status tag */
const StatusTag = ({ label, color }: { label: string; color: string }) => (
  <span
    className="inline-flex items-center px-2 py-1 rounded"
    style={{
      fontFamily: ff,
      fontSize: "9px",
      lineHeight: "1",
      fontWeight: "var(--font-weight-medium)",
      color,
      backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
      border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    }}
  >
    {label}
  </span>
);

/** Section wrapper — flat, no card styling */
const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex flex-col ${className}`}
  >
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════
   1. REVENUE INTEGRITY
   ═══════════════════════════════════════════════════════ */
export const RevenueIntegrity = ({
  financials,
}: {
  financials: FinancialData;
}) => {
  const mca = financials.mcaReportedRevenue ?? financials.revenue;
  const gst = financials.gstVerifiedTurnover ?? mca;
  const verPct = Math.round((gst / mca) * 100);
  const gapPct = 100 - verPct;
  const hasGap = gapPct > 15;

  return (
    <Section className="p-5 gap-4">
      <CardTitle icon={ShieldAlert} title="Revenue Integrity">
        {hasGap && <StatusTag label={`${gapPct}% unverified`} color="var(--destructive-500)" />}
      </CardTitle>

      {/* Hero */}
      <div className="flex items-baseline gap-2">
        <span style={heroStyle("32px")}>{hasGap ? `${verPct}%` : "100%"}</span>
        <span
          style={{
            fontFamily: ff,
            fontSize: "13px",
            lineHeight: "1",
            fontWeight: "var(--font-weight-normal)",
            color: hasGap ? "var(--warning-600)" : "var(--success-500)",
            opacity: 0.9,
          }}
        >
          verified
        </span>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" style={{ color: "var(--primary)" }} />
              {cap("MCA (AOC-4)")}
            </div>
            <span style={valueStyle()}>
              {"\u20B9"}{fmt(mca)}
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: "5px", backgroundColor: "var(--surface-elevated)" }}>
            <motion.div className="h-full rounded-full" style={{ backgroundColor: "var(--primary)", opacity: 0.7 }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <XCircle className="w-3 h-3" style={{ color: hasGap ? "var(--destructive-500)" : "var(--success-500)" }} />
              {cap("GST Verified")}
            </div>
            <span style={valueStyle(hasGap ? "var(--destructive-500)" : "var(--text-heading)")}>{"\u20B9"}{fmt(gst)}</span>
          </div>
          <div className="w-full rounded-full overflow-hidden relative" style={{ height: "5px", backgroundColor: "var(--surface-elevated)" }}>
            <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: hasGap ? "var(--destructive-500)" : "var(--success-500)", opacity: 0.7 }} initial={{ width: 0 }} animate={{ width: `${verPct}%` }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }} />
          </div>
        </div>
      </div>

      <Insight
        text={hasGap ? `${gapPct}% gap between MCA filings and GST records` : "Revenue consistent across filings"}
        variant={hasGap ? "danger" : "success"}
      />
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════
   2. SOLVENCY BENCHMARKING
   ═══════════════════════════════════════════════════════ */
export const SolvencyHeatmap = ({
  financials,
  entityName,
}: {
  financials: FinancialData;
  entityName: string;
}) => {
  const de = financials.debtToEquity;
  const median = financials.industryMedianDE ?? 1.21;
  const threshold = 5.0;
  const scaleMax = Math.max(10, de * 1.2);

  const medianPct = Math.min((median / scaleMax) * 100, 100);
  const entityPct = Math.min((de / scaleMax) * 100, 100);
  const threshPct = Math.min((threshold / scaleMax) * 100, 100);

  const leverageLabel = de > threshold ? "Toxic" : de > 3 ? "High" : de > 1.5 ? "Elevated" : "Safe";
  const leverageColor = de > threshold ? "var(--destructive-500)" : de > 3 ? "var(--warning-600)" : de > 1.5 ? "var(--warning-200)" : "var(--success-500)";
  const insightVariant = de > threshold ? "danger" : de > 3 ? "warning" : de > 1.5 ? "warning" : "success";

  const icr = financials.interestCoverage;
  const cr = financials.currentRatio;

  return (
    <Section className="p-5 gap-4">
      <CardTitle icon={Scale} title="Solvency Benchmarking">
        <StatusTag label={leverageLabel} color={leverageColor} />
      </CardTitle>

      {/* Hero */}
      <div className="flex items-baseline gap-3">
        <span style={heroStyle("32px")}>{de.toFixed(2)}</span>
        <span style={{ fontFamily: ff, fontSize: "13px", lineHeight: "1", fontWeight: "var(--font-weight-normal)", color: "var(--text-muted-themed)" }}>
          × D/E
        </span>
      </div>

      {/* Gradient bar */}
      <div className="relative" style={{ paddingTop: "22px", paddingBottom: "16px" }}>
        <motion.div
          className="absolute flex flex-col items-center"
          style={{ left: `${Math.min(entityPct, 92)}%`, transform: "translateX(-50%)", top: 0 }}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <div className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--text-heading)" }}>
            <span style={{ fontFamily: ff, fontSize: "8px", lineHeight: "1.3", fontWeight: "var(--font-weight-medium)", color: "var(--surface-card)", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
              {de.toFixed(1)}x
            </span>
          </div>
          <div style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderTop: "3px solid var(--text-heading)" }} />
        </motion.div>

        <div className="relative w-full rounded-md overflow-hidden" style={{ height: "16px" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(76,175,71,0.3) 0%, rgba(76,175,71,0.12) 18%, rgba(203,113,0,0.15) 35%, rgba(226,51,24,0.1) 60%, rgba(226,51,24,0.06) 100%)" }} />
          <div className="absolute top-0 h-full" style={{ left: `${medianPct}%`, width: "1px", backgroundColor: "var(--text-heading)", opacity: 0.6 }} />
          <div className="absolute top-0 h-full" style={{ left: `${threshPct}%`, width: "1px", backgroundColor: "var(--destructive-500)", opacity: 0.5 }} />
          <motion.div className="absolute top-0 h-full" style={{ left: `${entityPct}%`, width: "2px", backgroundColor: "var(--text-heading)", transform: "translateX(-1px)" }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.4, duration: 0.25 }} />
        </div>

        <div className="relative w-full flex justify-between" style={{ marginTop: "4px" }}>
          <span style={{ fontFamily: ff, fontSize: "9px", fontWeight: "var(--font-weight-normal)", color: "var(--success-500)" }}>Median {median}x</span>
          <span style={{ fontFamily: ff, fontSize: "9px", fontWeight: "var(--font-weight-normal)", color: "var(--destructive-500)", fontStyle: "italic" }}>Insolvent {threshold}x →</span>
        </div>
      </div>

      {/* Sub-metrics in bordered boxes */}
      <div className="grid grid-cols-2 gap-3" style={{ marginTop: "-4px" }}>
        <div
          className="flex flex-col gap-1.5 rounded-lg"
          style={{
            padding: "10px 12px",
            backgroundColor: "var(--surface-inset)",
            border: "1px solid var(--border-default)",
          }}
        >
          {cap("ICR")}
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: ff, fontSize: "18px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>{icr.toFixed(2)}x</span>
          </div>
          <span style={{ fontFamily: ff, fontSize: "9px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: icr < 1 ? "var(--destructive-500)" : icr < 1.5 ? "var(--warning-600)" : "var(--success-500)", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
            {icr < 1 ? "Default" : icr < 1.5 ? "Distressed" : "Adequate"}
          </span>
        </div>
        <div
          className="flex flex-col gap-1.5 rounded-lg"
          style={{
            padding: "10px 12px",
            backgroundColor: "var(--surface-inset)",
            border: "1px solid var(--border-default)",
          }}
        >
          {cap("Current Ratio")}
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: ff, fontSize: "18px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>{cr.toFixed(2)}</span>
          </div>
          <span style={{ fontFamily: ff, fontSize: "9px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: cr < 1 ? "var(--warning-600)" : cr < 1.5 ? "var(--warning-200)" : "var(--success-500)", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
            {cr < 1 ? "Locked" : cr < 1.5 ? "Tight" : "Healthy"}
          </span>
        </div>
      </div>

      <Insight
        text={de > threshold ? `D/E at ${de.toFixed(1)}x exceeds insolvent threshold` : de > 3 ? `Leverage at ${de.toFixed(1)}x above peer median ${median}x` : `Leverage at ${de.toFixed(1)}x vs peer median ${median}x`}
        variant={insightVariant as "danger" | "warning" | "success"}
      />
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════
   3. CASH vs DEBT
   ═══════════════════════════════════════════════════════ */
export const CashDebtXChart = ({ financials }: { financials: FinancialData }) => {
  const trend = financials.yearlyTrend;
  if (!trend || trend.length < 2) return null;

  const W = 240, H = 100, pL = 8, pR = 8, pT = 10, pB = 20;
  const cW = W - pL - pR, cH = H - pT - pB;

  const vals = trend.flatMap((d) => [d.cash, d.borrowings]);
  const mx = Math.max(...vals);
  const mn = Math.min(0, Math.min(...vals));
  const rng = mx - mn || 1;

  const x = (i: number) => pL + (i / (trend.length - 1)) * cW;
  const y = (v: number) => pT + cH - ((v - mn) / rng) * cH;

  const cashPts = trend.map((d, i) => `${x(i)},${y(d.cash)}`).join(" ");
  const debtPts = trend.map((d, i) => `${x(i)},${y(d.borrowings)}`).join(" ");

  const cross = useMemo(() => {
    for (let i = 0; i < trend.length - 1; i++) {
      const cS = trend[i].cash, cE = trend[i + 1].cash;
      const dS = trend[i].borrowings, dE = trend[i + 1].borrowings;
      if ((cS >= dS) !== (cE >= dE)) {
        const dC = cE - cS, dD = dE - dS;
        const t = (dS - cS) / (dC - dD);
        return { x: x(i + t), y: y(cS + dC * t), year: trend[i].year + t * (trend[i + 1].year - trend[i].year) };
      }
    }
    return null;
  }, [trend]);

  const latest = trend[trend.length - 1];
  const cashAboveDebt = latest.cash > latest.borrowings;

  return (
    <Section className="p-5 gap-4">
      <CardTitle icon={TrendingDown} title="Cash vs. Debt">
        {cross && <StatusTag label={`Crossed ~ ${Math.round(cross.year)}`} color="var(--warning-600)" />}
      </CardTitle>

      {/* Hero: latest values */}
      <div className="flex items-center gap-5">
        <div className="flex flex-col gap-1.5">
          {cap("Cash")}
          <span style={heroStyle("20px")}>{"\u20B9"}{fmt(latest.cash)}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {cap("Debt")}
          <span style={{ ...heroStyle("20px"), color: cashAboveDebt ? "var(--text-heading)" : "var(--destructive-500)" }}>{"\u20B9"}{fmt(latest.borrowings)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {[
          { label: "Cash", color: "var(--success-500)" },
          { label: "Debt", color: "var(--destructive-500)" },
          ...(cross ? [{ label: "Cross", color: "var(--warning-600)" }] : []),
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: "6px", height: "6px", backgroundColor: l.color }} />
            <span style={{ fontFamily: ff, fontSize: "10px", lineHeight: "1", fontWeight: "var(--font-weight-normal)", color: "var(--text-muted-themed)" }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-lg" style={{ backgroundColor: "var(--chart-bg)", border: "1px solid var(--chart-bg-border)", padding: "6px 4px 0" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          {[0, 0.5, 1].map((f) => (
            <line key={f} x1={pL} y1={pT + cH * (1 - f)} x2={pL + cW} y2={pT + cH * (1 - f)} stroke="var(--chart-grid-line)" strokeWidth={0.5} />
          ))}
          <motion.polyline points={cashPts} fill="none" stroke="var(--success-500)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.15 }} />
          <motion.polyline points={debtPts} fill="none" stroke="var(--destructive-500)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.15 }} />
          {trend.map((d, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(d.cash)} r={2.5} fill="var(--success-500)" stroke="var(--surface-card)" strokeWidth={1} opacity={0.8} />
              <circle cx={x(i)} cy={y(d.borrowings)} r={2.5} fill="var(--destructive-500)" stroke="var(--surface-card)" strokeWidth={1} opacity={0.8} />
            </g>
          ))}
          {cross && <motion.circle cx={cross.x} cy={cross.y} r={3.5} fill="var(--warning-600)" stroke="var(--surface-card)" strokeWidth={1} opacity={0.85} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, duration: 0.2 }} />}
          {/* Dashed vertical at cross point */}
          {cross && (
            <line x1={cross.x} y1={pT} x2={cross.x} y2={pT + cH} stroke="var(--warning-600)" strokeWidth={0.6} strokeDasharray="3 3" opacity={0.6} />
          )}
          {trend.map((d, i) => (
            <text key={`yr-${i}`} x={x(i)} y={H - 2} textAnchor="middle" style={{ fontFamily: ff, fontSize: "6px", fontWeight: 400, fill: "var(--text-muted-themed)" }}>
              {d.year}
            </text>
          ))}
        </svg>
      </div>

      <Insight
        text={cross ? `Debt exceeded cash ~${Math.round(cross.year)} — deteriorating solvency` : cashAboveDebt ? "Cash above debt — healthy trajectory" : "Debt exceeds cash — monitor risk"}
        variant={cross ? "warning" : cashAboveDebt ? "success" : "warning"}
      />
    </Section>
  );
};

/* ═══════════════════════════════════════════════════════
   4. LIQUIDITY RUNWAY
   ═══════════════════════════════════════════════════════ */
export const SurvivalRunway = ({ financials }: { financials: FinancialData }) => {
  const cash = financials.cashReserves ?? 0;
  const burn = financials.monthlyBurnRate ?? Math.abs(financials.cashFlow / 12);
  const months = burn > 0 ? cash / burn : Infinity;
  const display = Math.min(months, 24);
  const max = 24;

  const R = 42, SW = 5;
  const C = 2 * Math.PI * R;
  const pct = Math.min(display / max, 1);
  const offset = C * (1 - pct);

  const accent = months <= 3 ? "var(--destructive-500)" : months <= 6 ? "var(--warning-600)" : "var(--success-500)";
  const statusLabel = months <= 3 ? "Critical" : months <= 6 ? "Low" : "Adequate";
  const profitable = financials.netProfit >= 0;

  return (
    <Section className="p-5 gap-4">
      <CardTitle icon={Clock} title="Liquidity Runway">
        {!profitable && months !== Infinity && <StatusTag label={statusLabel} color={accent} />}
      </CardTitle>

      {profitable ? (
        <div className="flex flex-col gap-3 flex-1 justify-center items-center py-4">
          <span style={heroStyle("24px")}>Profitable</span>
          <span style={{ fontFamily: ff, fontSize: "11px", lineHeight: "1.4", fontWeight: "var(--font-weight-normal)", color: "var(--text-muted-themed)", textTransform: "none" as const }}>
            Self-sustaining — positive cash flow
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* Ring */}
          <div className="relative">
            <svg width={R * 2 + SW * 2} height={R * 2 + SW * 2} viewBox={`0 0 ${R * 2 + SW * 2} ${R * 2 + SW * 2}`}>
              <circle cx={R + SW} cy={R + SW} r={R} fill="none" stroke="var(--surface-elevated)" strokeWidth={SW} />
              <motion.circle cx={R + SW} cy={R + SW} r={R} fill="none" stroke={accent} strokeWidth={SW} strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: offset }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} style={{ transform: "rotate(-90deg)", transformOrigin: "center", opacity: 0.8 }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={heroStyle("24px")}>{months === Infinity ? "--" : display.toFixed(1)}</span>
              {cap("months", "9px", { letterSpacing: "0.06em", marginTop: "3px" })}
            </div>
          </div>

          {/* Stats in bordered boxes */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div
              className="flex flex-col gap-1.5 rounded-lg"
              style={{
                padding: "10px 12px",
                backgroundColor: "var(--surface-inset)",
                border: "1px solid var(--border-default)",
              }}
            >
              {cap("Cash")}
              <span style={{ fontFamily: ff, fontSize: "15px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>{"\u20B9"}{fmt(cash)}</span>
            </div>
            <div
              className="flex flex-col gap-1.5 rounded-lg"
              style={{
                padding: "10px 12px",
                backgroundColor: "var(--surface-inset)",
                border: "1px solid var(--border-default)",
              }}
            >
              {cap("Burn / mo")}
              <span style={{ fontFamily: ff, fontSize: "15px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>{"\u20B9"}{fmt(burn)}</span>
            </div>
          </div>
        </div>
      )}

      <Insight
        text={profitable ? "Cash-flow positive — no runway concern" : months <= 3 ? `Only ${display.toFixed(1)} months remaining — liquidity crisis` : months <= 6 ? `~${display.toFixed(1)} months — requires action` : `${display.toFixed(1)} months — adequate buffer`}
        variant={profitable ? "success" : months <= 3 ? "danger" : months <= 6 ? "warning" : "success"}
      />
    </Section>
  );
};
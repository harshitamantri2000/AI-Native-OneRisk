import React, { useMemo } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  ShieldCheck,
  Scale,
  Landmark,
  TrendingDown,
  Users,
  TriangleAlert,
} from "lucide-react";
import type { AIInsight, RiskLevel } from "../data/cases";

/* ─── Confidence color helpers ─── */
const confColor = (v: number) =>
  v >= 85 ? "var(--success-700)" : v >= 70 ? "var(--info-600)" : "var(--warning-700)";
const confBg = (v: number) =>
  v >= 85 ? "var(--success-50)" : v >= 70 ? "var(--info-50)" : "var(--warning-50)";

/* ─── Data-driven chip builder ─── */
interface SignalChip {
  icon: React.ReactNode;
  label: string;
}

const iconSize = { width: 12, height: 12, color: "var(--warning-700)" };

function buildSignalChips(
  insight: AIInsight,
): SignalChip[] {
  const chips: SignalChip[] = [];

  // Fallback: if no detail or no chips found, use additionalFactors
  if (chips.length === 0) {
    insight.additionalFactors.forEach((f) => {
      chips.push({ icon: <TriangleAlert style={iconSize} />, label: f });
    });
  }

  // Network risk from insight if no contagion chip already
  if (
    insight.networkRisk &&
    !chips.some((c) => c.label.toLowerCase().includes("contagion"))
  ) {
    if (insight.networkRisk.level !== "LOW") {
      chips.push({
        icon: <Users style={iconSize} />,
        label: insight.networkRisk.label,
      });
    }
  }

  return chips;
}

/* ═══════════════════════════════════════════ */
interface AIInsightsCardProps {
  insight: AIInsight;
  riskLevel: RiskLevel;
  companyName: string;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  insight,
  riskLevel,
}) => {
  const conf = insight.confidencePercent;
  const chips = useMemo(
    () => buildSignalChips(insight),
    [insight],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 3 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 300,
        borderRadius: "var(--radius)",
        backgroundColor: "var(--neutral-0)",
        border: "1px solid var(--neutral-100)",
        boxShadow: "var(--shadow-elevated)",
        overflow: "hidden",
      }}
    >
      <div className="flex flex-col" style={{ padding: "12px 14px", gap: "10px", overflow: "hidden" }}>

        {/* ── 1. AI Summary header with Confidence chip ── */}
        <div className="flex items-center justify-between" style={{ gap: "8px", minWidth: 0 }}>
          <div className="flex items-center" style={{ gap: "5px", flexShrink: 0 }}>
            <Sparkles style={{ width: 12, height: 12, color: "var(--primary)", flexShrink: 0 }} />
            <span
              style={{
                fontSize: "var(--text-sm)",
                lineHeight: "1",
                fontWeight: 600,
                letterSpacing: "0.004em",
                color: "var(--text-heading)",
              }}
            >
              AI Summary
            </span>
          </div>
          <span
            className="inline-flex items-center"
            style={{
              fontSize: "var(--text-xs)",
              lineHeight: "1",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "100px",
              color: "var(--info-600)",
              backgroundColor: "var(--info-50)",
              letterSpacing: "0.01em",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            Confidence {conf}%
          </span>
        </div>

        {/* ── 2. Explanation paragraph ── */}
        <p
          style={{
            fontSize: "var(--text-sm)",
            lineHeight: "1.55",
            fontWeight: "var(--font-weight-normal)" as any,
            letterSpacing: "0.004em",
            color: "var(--text-secondary-themed)",
            margin: 0,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {insight.riskExplanation}
        </p>

        {/* ── 3. Signal chips ── */}
        <div className="flex flex-wrap" style={{ gap: "6px", overflow: "hidden" }}>
          {chips.map((chip, i) => (
            <span
              key={`${chip.label}-${i}`}
              className="inline-flex items-center"
              style={{
                gap: "4px",
                fontSize: "var(--text-xs)",
                lineHeight: "1",
                fontWeight: 600,
                letterSpacing: "0.004em",
                padding: "5px 10px",
                borderRadius: "100px",
                backgroundColor: "var(--warning-50)",
                color: "var(--warning-700)",
                border: "1px solid var(--warning-200)",
                whiteSpace: "nowrap",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {chip.icon}
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Footer (no line, no background) ── */}
      <div
        className="flex items-center justify-center"
        style={{
          padding: "4px 14px 10px",
        }}
      >
        <div className="flex items-center" style={{ gap: "3px" }}>
          <ShieldCheck style={{ width: 9, height: 9, color: "var(--neutral-200)" }} />
          <span
            style={{
              fontSize: "var(--text-2xs)",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)" as any,
              letterSpacing: "0.02em",
              color: "var(--neutral-200)",
            }}
          >
            Secured by OneRisk AI
          </span>
        </div>
      </div>
    </motion.div>
  );
};
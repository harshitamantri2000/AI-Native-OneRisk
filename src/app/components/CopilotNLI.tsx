import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Bot,
  User,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Search,
  FileText,
  BarChart3,
  MapPin,
  Globe,
  Clock,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Fingerprint,
  TrendingUp,
  ShieldCheck,
  CircleDot,
  ExternalLink,
  Info,
  X,
} from "lucide-react";
import type { CaseEntry } from "../data/cases";

/* ─── Typography ─── */
const f = {
  fontFamily: "var(--font-family, 'Plus Jakarta Sans', sans-serif)",
  letterSpacing: "0.4%",
} as const;

/* ══════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════ */

interface AgentStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

interface ActionButton {
  label: string;
  type: "primary" | "secondary" | "destructive";
  action: string;
}

interface DataPoint {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: Date;
  /* Agent-only fields */
  agentSteps?: AgentStep[];
  isThinking?: boolean;
  estimatedTime?: string;
  dataPoints?: DataPoint[];
  actionButtons?: ActionButton[];
  confidenceScore?: number;
  sourceLabel?: string;
  isStreaming?: boolean;
}

/* ══════════════════════════════════════════════════════
   SCENARIO SIMULATION DATA
   ══════════════════════════════════════════════════════ */

const buildScenarioResponse = (
  input: string,
  caseData: CaseEntry
): {
  steps: Omit<AgentStep, "status">[];
  response: Partial<ChatMessage>;
  stepDelays: number[];
} | null => {
  const lower = input.toLowerCase();

  /* ─── Scenario 1: Exclude transaction / recompute ─── */
  if (
    lower.includes("exclude") ||
    lower.includes("recompute") ||
    lower.includes("dscr") ||
    lower.includes("transaction")
  ) {
    return {
      steps: [
        { id: "s1", label: "Identifying transaction in statement data", detail: "Searching bank statement records..." },
        { id: "s2", label: "Locating TXN in DSCR calculation graph", detail: "Mapping transaction to income/expense nodes..." },
        { id: "s3", label: "Suppressing flagged transaction temporarily", detail: "Removing TXN #TXN998 from disposable income flow..." },
        { id: "s4", label: "Re-running DSCR & Net Disposable Income", detail: "Recomputing across 12-month rolling window..." },
        { id: "s5", label: "Generating scenario comparison", detail: "Building before/after delta report..." },
      ],
      stepDelays: [800, 1200, 900, 1500, 700],
      response: {
        text: `Transaction #TXN998 (₹2,84,000 — Medical Emergency, dated 14-Aug-2025) has been temporarily excluded from the DSCR calculation.\n\nThe one-time extraordinary medical expense was identified in ${caseData.name}'s bank statement and does not reflect recurring business instability.`,
        dataPoints: [
          { label: "Previous DSCR", value: "0.95", change: "Below threshold", changeType: "negative" },
          { label: "Recalculated DSCR", value: "1.25", change: "+31.6%", changeType: "positive" },
          { label: "Net Disposable Income", value: "₹1,42,600/mo", change: "+₹23,700", changeType: "positive" },
          { label: "Excluded Amount", value: "₹2,84,000", change: "One-time", changeType: "neutral" },
        ],
        confidenceScore: 94,
        sourceLabel: "Bank Statement Analyser · DSCR Engine",
        actionButtons: [
          { label: "Save as final assessment", type: "primary", action: "save_scenario" },
          { label: "Run another scenario", type: "secondary", action: "new_scenario" },
          { label: "Discard & revert", type: "destructive", action: "revert" },
        ],
      },
    };
  }

  /* ─── Scenario 2: Legitimacy of income source ─── */
  if (
    lower.includes("legitimate") ||
    lower.includes("income") ||
    lower.includes("source of") ||
    lower.includes("other income")
  ) {
    return {
      steps: [
        { id: "s1", label: "Extracting counterparty from flagged transactions", detail: "Parsing UPI/NEFT payee identifiers..." },
        { id: "s2", label: "Resolving counterparty entity", detail: 'Matched: "UrbanClap Technologies Pvt Ltd" → Home services platform' },
        { id: "s3", label: "Classifying income type", detail: "Comparing against gig economy, freelance, and family transfer patterns..." },
        { id: "s4", label: "Cross-referencing ITR declarations", detail: "Checking AY 2025-26 for additional income sources & TDS entries..." },
        { id: "s5", label: "Checking Form 26AS for TDS deductions", detail: "Found 2 TDS entries from non-primary employers..." },
        { id: "s6", label: "Triangulating & scoring confidence", detail: "Aggregating signals across bank, ITR, and 26AS data..." },
      ],
      stepDelays: [700, 1400, 1100, 1300, 1000, 800],
      response: {
        text: `Income source analysis complete for ${caseData.name}.\n\n**Identified Source:** Gig income from UrbanClap Technologies Pvt Ltd (home services platform). Monthly credits averaging ₹18,400 across 8 of 12 months.\n\n**ITR Cross-check:** AY 2025-26 ITR shows "Income from Other Sources" of ₹2,21,000 — aligns with observed bank credits (₹2,20,800 total). TDS of ₹22,080 deducted at source by UrbanClap confirms legitimacy.\n\n**Judgement:** This appears to be a **legitimate supplementary gig income** — consistent pattern, tax-declared, and TDS-compliant. No red flags detected.`,
        dataPoints: [
          { label: "Source Type", value: "Gig Income", change: "Legitimate", changeType: "positive" },
          { label: "Avg Monthly", value: "₹18,400", change: "8/12 months", changeType: "neutral" },
          { label: "ITR Declared", value: "₹2,21,000", change: "Matches ±0.1%", changeType: "positive" },
          { label: "TDS Deducted", value: "₹22,080", change: "10% @ source", changeType: "positive" },
        ],
        confidenceScore: 91,
        sourceLabel: "Bank Statement · ITR Parser · Form 26AS",
        actionButtons: [
          { label: "Consider as income & recompute", type: "primary", action: "include_income" },
          { label: "Flag for manual review", type: "secondary", action: "flag_review" },
          { label: "Exclude from assessment", type: "destructive", action: "exclude" },
        ],
      },
    };
  }

  /* ─── Scenario 3: Digital footprint / locational check ─── */
  if (
    lower.includes("digital footprint") ||
    lower.includes("location") ||
    lower.includes("netscan") ||
    lower.includes("footprint")
  ) {
    return {
      steps: [
        { id: "s1", label: "Initiating digital footprint scan", detail: "Searching public registries, social profiles, business directories..." },
        { id: "s2", label: "Running locational intelligence", detail: "Geo-validating registered address against utility & telecom data..." },
        { id: "s3", label: "Cross-referencing device & IP metadata", detail: "Analyzing application sourcing device fingerprints..." },
        { id: "s4", label: "Checking business presence signals", detail: "Google Maps, IndiaMART, JustDial listing verification..." },
        { id: "s5", label: "Aggregating risk signals", detail: "Computing composite digital presence score..." },
      ],
      stepDelays: [900, 2000, 1500, 1200, 800],
      response: {
        text: `Digital footprint & locational intelligence report for ${caseData.name}.\n\n**Digital Presence:** Moderate. LinkedIn company page active (last post 3 weeks ago). Listed on IndiaMART with 12 product listings. Google Maps listing verified with 4.2★ rating (28 reviews).\n\n**Locational Intelligence:** Registered address verified via electricity bill records (active connection since 2019). GPS coordinates from application device match registered office location (deviation < 200m). No address mismatch flags.\n\n**Sourcing Channel Alert:** Application sourced via "ABC Credit Lead Agency" — this agency has a **23% higher default rate** vs. direct applications in your portfolio. 3 of last 10 cases from this agency were flagged for document inconsistencies.`,
        dataPoints: [
          { label: "Digital Presence Score", value: "6.4/10", change: "Moderate", changeType: "neutral" },
          { label: "Address Verified", value: "Yes", change: "Since 2019", changeType: "positive" },
          { label: "Location Match", value: "< 200m", change: "GPS verified", changeType: "positive" },
          { label: "Agency Risk Flag", value: "High", change: "23% default rate", changeType: "negative" },
        ],
        confidenceScore: 78,
        sourceLabel: "Netscan · Geo-Intel · Agency Analytics",
        actionButtons: [
          { label: "Include in final report", type: "primary", action: "include_report" },
          { label: "Trigger deeper KYC", type: "secondary", action: "deep_kyc" },
          { label: "Dismiss findings", type: "destructive", action: "dismiss" },
        ],
      },
    };
  }

  /* ─── Default: General question ─── */
  return {
    steps: [
      { id: "s1", label: "Parsing query intent", detail: "Analyzing natural language context..." },
      { id: "s2", label: "Retrieving case context", detail: `Loading ${caseData.name} case data...` },
      { id: "s3", label: "Generating response", detail: "Synthesizing analysis..." },
    ],
    stepDelays: [500, 800, 1000],
    response: {
      text: `Based on the current case file for **${caseData.name}** (${caseData.id}):\n\n• Risk Level: **${caseData.riskLevel}** — flagged for "${caseData.aiInsight.mostRiskyElement}"\n• AI Confidence: ${caseData.aiInsight.confidencePercent}%\n• ${caseData.aiInsight.riskExplanation}\n\nWould you like me to dive deeper into any specific aspect — financials, director background, or network contagion analysis?`,
      confidenceScore: caseData.aiInsight.confidencePercent,
      sourceLabel: "Case File · AI Risk Engine",
    },
  };
};

/* ══════════════════════════════════════════════════════
   CONTEXT PANEL (LEFT SIDE)
   ══════════════════════════════════════════════════════ */

const ContextPanel = ({ caseData }: { caseData: CaseEntry }) => {
  const [expanded, setExpanded] = useState<string | null>("sourcing");

  const sections = [
    {
      id: "sourcing",
      title: "Sourcing Details",
      icon: <Globe style={{ width: 14, height: 14 }} />,
      items: [
        { label: "Channel", value: "Sales Partner — ABC Credit Agency" },
        { label: "Journey Type", value: "Assisted (DSA)" },
        { label: "App Started", value: "Feb 12, 2026" },
        { label: "App Submitted", value: "Feb 14, 2026" },
        { label: "Device", value: "Android · Samsung Galaxy S23" },
      ],
    },
    {
      id: "applicant",
      title: "Application Data",
      icon: <User style={{ width: 14, height: 14 }} />,
      items: [
        { label: "Entity", value: caseData.name },
        { label: "Business", value: caseData.natureOfBusiness },
        { label: "Ask Amount", value: "₹45,00,000" },
        { label: "Tenure", value: "36 months" },
        { label: "Documents", value: "8 of 10 submitted" },
      ],
    },
    {
      id: "events",
      title: "Sourcing Events",
      icon: <Clock style={{ width: 14, height: 14 }} />,
      items: [
        { label: "KYC Completed", value: "Feb 12 · Mumbai" },
        { label: "Bank Linked", value: "Feb 13 · Mumbai" },
        { label: "Docs Uploaded", value: "Feb 14 · Pune" },
        { label: "Location Δ", value: "Mumbai → Pune (148 km)" },
      ],
    },
  ];

  return (
    <div
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{
        width: 280,
        borderRight: "1px solid var(--border-subtle)",
        backgroundColor: "var(--surface-card)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 10px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center" style={{ gap: 6 }}>
          <Info style={{ width: 14, height: 14, color: "var(--primary)" }} />
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-heading)",
            }}
          >
            Case Context
          </span>
        </div>
        <span
          style={{
            ...f,
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--text-muted-themed)",
            display: "block",
            marginTop: 4,
            lineHeight: "150%",
          }}
        >
          Copilot is aware of all data below
        </span>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const isOpen = expanded === section.id;
        return (
          <div
            key={section.id}
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : section.id)}
              className="w-full flex items-center justify-between cursor-pointer bg-transparent border-none"
              style={{
                padding: "10px 16px",
              }}
            >
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ color: "var(--text-muted-themed)" }}>
                  {section.icon}
                </span>
                <span
                  style={{
                    ...f,
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-heading)",
                  }}
                >
                  {section.title}
                </span>
              </div>
              <ChevronDown
                style={{
                  width: 14,
                  height: 14,
                  color: "var(--text-muted-themed)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="flex flex-col"
                    style={{ padding: "0 16px 12px", gap: 8 }}
                  >
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between"
                        style={{ gap: 8 }}
                      >
                        <span
                          style={{
                            ...f,
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-normal)",
                            color: "var(--text-muted-themed)",
                            lineHeight: "150%",
                            minWidth: 0,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            ...f,
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--text-heading)",
                            lineHeight: "150%",
                            textAlign: "right",
                            minWidth: 0,
                          }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Risk Summary Chip */}
      <div style={{ padding: "12px 16px" }}>
        <div
          className="rounded-md"
          style={{
            padding: "10px 12px",
            backgroundColor:
              caseData.riskLevel === "High"
                ? "color-mix(in srgb, var(--destructive-500) 6%, transparent)"
                : caseData.riskLevel === "Medium"
                  ? "color-mix(in srgb, var(--warning-600) 6%, transparent)"
                  : "color-mix(in srgb, var(--success-500) 6%, transparent)",
            border: `1px solid ${
              caseData.riskLevel === "High"
                ? "color-mix(in srgb, var(--destructive-500) 16%, transparent)"
                : caseData.riskLevel === "Medium"
                  ? "color-mix(in srgb, var(--warning-600) 16%, transparent)"
                  : "color-mix(in srgb, var(--success-500) 16%, transparent)"
            }`,
          }}
        >
          <div className="flex items-center" style={{ gap: 6, marginBottom: 6 }}>
            <ShieldCheck
              style={{
                width: 13,
                height: 13,
                color:
                  caseData.riskLevel === "High"
                    ? "var(--destructive-500)"
                    : caseData.riskLevel === "Medium"
                      ? "var(--warning-600)"
                      : "var(--success-500)",
              }}
            />
            <span
              style={{
                ...f,
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              {caseData.riskLevel} Risk · {caseData.aiInsight.confidencePercent}% Confidence
            </span>
          </div>
          <span
            style={{
              ...f,
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-secondary-themed)",
              lineHeight: "150%",
              display: "block",
            }}
          >
            {caseData.aiInsight.mostRiskyElement}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   AGENT THINKING STEPS COMPONENT
   ══════════════════════════════════════════════════════ */

const AgentStepsDisplay = ({
  steps,
  estimatedTime,
}: {
  steps: AgentStep[];
  estimatedTime?: string;
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const allDone = steps.every((s) => s.status === "done");
  const currentStep = steps.find((s) => s.status === "running");

  return (
    <div
      className="rounded-md"
      style={{
        backgroundColor: "color-mix(in srgb, var(--primary) 3%, transparent)",
        border:
          "1px solid color-mix(in srgb, var(--primary) 10%, transparent)",
        padding: "10px 12px",
        marginBottom: 10,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 6 }}>
          {allDone ? (
            <CheckCircle2
              style={{ width: 14, height: 14, color: "var(--success-500)" }}
            />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2
                style={{ width: 14, height: 14, color: "var(--primary)" }}
              />
            </motion.div>
          )}
          <span
            style={{
              ...f,
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-medium)",
              color: allDone ? "var(--success-700)" : "var(--primary)",
            }}
          >
            {allDone
              ? "Analysis complete"
              : currentStep
                ? currentStep.label
                : "Starting analysis..."}
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          {estimatedTime && !allDone && (
            <span
              style={{
                ...f,
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
              }}
            >
              ~{estimatedTime}
            </span>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-transparent border-none cursor-pointer flex items-center"
            style={{ padding: 0 }}
          >
            <ChevronDown
              style={{
                width: 12,
                height: 12,
                color: "var(--text-muted-themed)",
                transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>
      </div>

      {/* Step list */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="flex flex-col"
              style={{ marginTop: 8, gap: 4, paddingLeft: 4 }}
            >
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start"
                  style={{ gap: 8 }}
                >
                  {/* Step indicator */}
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: 16, height: 18 }}
                  >
                    {step.status === "done" ? (
                      <CheckCircle2
                        style={{
                          width: 12,
                          height: 12,
                          color: "var(--success-500)",
                        }}
                      />
                    ) : step.status === "running" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2
                          style={{
                            width: 12,
                            height: 12,
                            color: "var(--primary)",
                          }}
                        />
                      </motion.div>
                    ) : (
                      <CircleDot
                        style={{
                          width: 12,
                          height: 12,
                          color: "var(--neutral-200)",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col" style={{ minWidth: 0 }}>
                    <span
                      style={{
                        ...f,
                        fontSize: "var(--text-xs)",
                        fontWeight:
                          step.status === "running"
                            ? "var(--font-weight-medium)"
                            : "var(--font-weight-normal)",
                        color:
                          step.status === "pending"
                            ? "var(--text-muted-themed)"
                            : "var(--text-heading)",
                        lineHeight: "150%",
                        opacity: step.status === "pending" ? 0.6 : 1,
                      }}
                    >
                      {step.label}
                    </span>
                    {step.detail && step.status !== "pending" && (
                      <span
                        style={{
                          ...f,
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--text-muted-themed)",
                          lineHeight: "150%",
                        }}
                      >
                        {step.detail}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   DATA POINTS CARD
   ══════════════════════════════════════════════════════ */

const DataPointsCard = ({ points }: { points: DataPoint[] }) => (
  <div
    className="grid rounded-md overflow-hidden"
    style={{
      gridTemplateColumns: `repeat(${Math.min(points.length, 4)}, 1fr)`,
      border: "1px solid var(--border-subtle)",
      marginTop: 10,
      marginBottom: 6,
    }}
  >
    {points.map((pt, idx) => (
      <div
        key={idx}
        style={{
          padding: "10px 12px",
          backgroundColor: "var(--surface-card)",
          borderRight:
            idx < points.length - 1
              ? "1px solid var(--border-subtle)"
              : "none",
        }}
      >
        <span
          style={{
            ...f,
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--text-muted-themed)",
            display: "block",
            marginBottom: 4,
            lineHeight: "140%",
          }}
        >
          {pt.label}
        </span>
        <span
          style={{
            ...f,
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-heading)",
            display: "block",
            lineHeight: "140%",
          }}
        >
          {pt.value}
        </span>
        {pt.change && (
          <span
            style={{
              ...f,
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-medium)",
              color:
                pt.changeType === "positive"
                  ? "var(--success-700)"
                  : pt.changeType === "negative"
                    ? "var(--destructive-600)"
                    : "var(--text-muted-themed)",
              display: "block",
              marginTop: 2,
              lineHeight: "140%",
            }}
          >
            {pt.change}
          </span>
        )}
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════
   ACTION BUTTONS ROW
   ══════════════════════════════════════════════════════ */

const ActionButtonsRow = ({
  buttons,
  onAction,
}: {
  buttons: ActionButton[];
  onAction: (action: string) => void;
}) => (
  <div
    className="flex items-center flex-wrap"
    style={{ gap: 8, marginTop: 8 }}
  >
    {buttons.map((btn, idx) => {
      const colorMap = {
        primary: {
          bg: "var(--primary)",
          hoverBg: "var(--primary-600)",
          text: "var(--text-on-color)",
          border: "var(--primary)",
        },
        secondary: {
          bg: "color-mix(in srgb, var(--primary) 8%, transparent)",
          hoverBg: "color-mix(in srgb, var(--primary) 16%, transparent)",
          text: "var(--primary)",
          border: "color-mix(in srgb, var(--primary) 30%, transparent)",
        },
        destructive: {
          bg: "transparent",
          hoverBg: "color-mix(in srgb, var(--destructive-500) 6%, transparent)",
          text: "var(--destructive-600)",
          border: "color-mix(in srgb, var(--destructive-500) 30%, transparent)",
        },
      };
      const c = colorMap[btn.type];
      return (
        <button
          key={idx}
          onClick={() => onAction(btn.action)}
          className="flex items-center rounded-md cursor-pointer transition-all active:scale-[0.97]"
          style={{
            ...f,
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-medium)",
            height: 30,
            padding: "0 12px",
            gap: 5,
            border: `1px solid ${c.border}`,
            backgroundColor: c.bg,
            color: c.text,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = c.hoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = c.bg;
          }}
        >
          {btn.label}
        </button>
      );
    })}
  </div>
);

/* ══════════════════════════════════════════════════════
   SINGLE MESSAGE BUBBLE
   ══════════════════════════════════════════════════════ */

const MessageBubble = ({
  message,
  onAction,
}: {
  message: ChatMessage;
  onAction: (action: string) => void;
}) => {
  const isAgent = message.role === "agent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex"
      style={{
        gap: 10,
        justifyContent: isAgent ? "flex-start" : "flex-end",
        maxWidth: "100%",
      }}
    >
      {/* Agent avatar */}
      {isAgent && (
        <div
          className="shrink-0 rounded-full flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            backgroundColor:
              "color-mix(in srgb, var(--primary) 10%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
            marginTop: 2,
          }}
        >
          <Bot
            style={{ width: 14, height: 14, color: "var(--primary)" }}
          />
        </div>
      )}

      <div
        style={{
          maxWidth: isAgent ? "calc(100% - 40px)" : "75%",
          minWidth: 0,
        }}
      >
        {/* Agent thinking steps */}
        {isAgent && message.agentSteps && message.agentSteps.length > 0 && (
          <AgentStepsDisplay
            steps={message.agentSteps}
            estimatedTime={message.estimatedTime}
          />
        )}

        {/* Message body */}
        {(message.text || message.isThinking) && (
          <div
            className="rounded-lg"
            style={{
              padding: "10px 14px",
              backgroundColor: isAgent
                ? "var(--surface-card)"
                : "var(--primary)",
              border: isAgent
                ? "1px solid var(--border-subtle)"
                : "1px solid var(--primary)",
            }}
          >
            {message.isThinking && !message.text ? (
              <div className="flex items-center" style={{ gap: 6 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Loader2
                    style={{
                      width: 14,
                      height: 14,
                      color: "var(--primary)",
                    }}
                  />
                </motion.div>
                <span
                  style={{
                    ...f,
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  Analyzing...
                </span>
              </div>
            ) : (
              <div
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  color: isAgent
                    ? "var(--text-body)"
                    : "var(--text-on-color)",
                  lineHeight: "170%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
                dangerouslySetInnerHTML={{
                  __html: message.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, "<br />"),
                }}
              />
            )}
          </div>
        )}

        {/* Data points */}
        {isAgent && message.dataPoints && message.dataPoints.length > 0 && (
          <DataPointsCard points={message.dataPoints} />
        )}

        {/* Source label */}
        {isAgent && message.sourceLabel && !message.isThinking && (
          <div
            className="flex items-center"
            style={{ gap: 4, marginTop: 4, marginBottom: 2 }}
          >
            <FileText
              style={{
                width: 10,
                height: 10,
                color: "var(--text-muted-themed)",
              }}
            />
            <span
              style={{
                ...f,
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
                opacity: 0.7,
              }}
            >
              Source: {message.sourceLabel}
            </span>
          </div>
        )}

        {/* Confidence bar */}
        {isAgent &&
          message.confidenceScore !== undefined &&
          !message.isThinking && (
            <div
              className="flex items-center"
              style={{ gap: 8, marginTop: 4 }}
            >
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--text-muted-themed)",
                }}
              >
                Confidence
              </span>
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{
                  height: 4,
                  backgroundColor: "var(--surface-inset)",
                  maxWidth: 120,
                }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${message.confidenceScore}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{
                    backgroundColor:
                      message.confidenceScore >= 80
                        ? "var(--success-500)"
                        : message.confidenceScore >= 60
                          ? "var(--warning-600)"
                          : "var(--destructive-500)",
                  }}
                />
              </div>
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-heading)",
                }}
              >
                {message.confidenceScore}%
              </span>
            </div>
          )}

        {/* Action buttons */}
        {isAgent &&
          message.actionButtons &&
          message.actionButtons.length > 0 &&
          !message.isThinking && (
            <ActionButtonsRow
              buttons={message.actionButtons}
              onAction={onAction}
            />
          )}
      </div>

      {/* User avatar */}
      {!isAgent && (
        <div
          className="shrink-0 rounded-full flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            backgroundColor: "var(--surface-inset)",
            border: "1px solid var(--border-subtle)",
            marginTop: 2,
          }}
        >
          <User
            style={{
              width: 14,
              height: 14,
              color: "var(--text-muted-themed)",
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN COPILOT NLI COMPONENT
   ══════════════════════════════════════════════════════ */

export const CopilotNLI = ({ caseData }: { caseData: CaseEntry }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  /* ── Send message handler ── */
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isProcessing) return;

    setInput("");
    setIsProcessing(true);

    /* Add user message */
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();

    /* Get scenario data */
    const scenario = buildScenarioResponse(text, caseData);
    if (!scenario) {
      setIsProcessing(false);
      return;
    }

    /* Create agent message shell with thinking state */
    const agentId = `a-${Date.now()}`;
    const totalEstMs = scenario.stepDelays.reduce((a, b) => a + b, 0);
    const estTimeStr =
      totalEstMs > 4000
        ? `${Math.ceil(totalEstMs / 1000)}s remaining`
        : "a few seconds";

    const initialSteps: AgentStep[] = scenario.steps.map((s) => ({
      ...s,
      status: "pending" as const,
    }));

    const agentMsg: ChatMessage = {
      id: agentId,
      role: "agent",
      text: "",
      timestamp: new Date(),
      agentSteps: initialSteps,
      isThinking: true,
      estimatedTime: estTimeStr,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, agentMsg]);
    scrollToBottom();

    /* Simulate step-by-step execution */
    for (let i = 0; i < scenario.steps.length; i++) {
      await new Promise((r) => setTimeout(r, scenario.stepDelays[i]));

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== agentId) return m;
          const updatedSteps = [...(m.agentSteps || [])];
          /* Mark current as done */
          if (updatedSteps[i]) {
            updatedSteps[i] = { ...updatedSteps[i], status: "done" };
          }
          /* Mark next as running */
          if (updatedSteps[i + 1]) {
            updatedSteps[i + 1] = { ...updatedSteps[i + 1], status: "running" };
          }

          const remaining = scenario.stepDelays
            .slice(i + 1)
            .reduce((a, b) => a + b, 0);
          return {
            ...m,
            agentSteps: updatedSteps,
            estimatedTime:
              remaining > 1000
                ? `${Math.ceil(remaining / 1000)}s remaining`
                : "almost done",
          };
        })
      );
      scrollToBottom();
    }

    /* Small pause then reveal the final response */
    await new Promise((r) => setTimeout(r, 400));

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== agentId) return m;
        return {
          ...m,
          text: scenario.response.text || "",
          isThinking: false,
          isStreaming: false,
          dataPoints: scenario.response.dataPoints,
          actionButtons: scenario.response.actionButtons,
          confidenceScore: scenario.response.confidenceScore,
          sourceLabel: scenario.response.sourceLabel,
        };
      })
    );
    scrollToBottom();
    setIsProcessing(false);
  }, [input, isProcessing, caseData, scrollToBottom]);

  /* ── Action handler ── */
  const handleAction = useCallback(
    (action: string) => {
      const confirmMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text:
          action === "save_scenario"
            ? "Yes, save this as the final assessment."
            : action === "include_income"
              ? "Yes, consider this as income and recompute everything."
              : action === "include_report"
                ? "Include these findings in the final report."
                : action === "flag_review"
                  ? "Flag this for manual review."
                  : action === "deep_kyc"
                    ? "Trigger a deeper KYC verification."
                    : action === "new_scenario"
                      ? "I'd like to run another scenario."
                      : `Action: ${action}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmMsg]);

      /* Quick acknowledgement */
      setTimeout(() => {
        const ackMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "agent",
          text:
            action === "save_scenario"
              ? `Done. The recalculated DSCR of **1.25** has been saved as the final assessment for ${caseData.name}. The excluded transaction has been annotated in the case file with your override rationale.`
              : action === "include_income"
                ? `Understood. Gig income of **₹18,400/mo** has been added to the income computation. Recalculating all downstream metrics — DSCR, FOIR, and Net Disposable Income. Updated values will reflect in the Financials tab.`
                : action === "include_report"
                  ? `Digital footprint findings have been appended to the case report under "Supplementary Checks". The agency risk flag has been highlighted in the executive summary.`
                  : action === "deep_kyc"
                    ? `Deeper KYC verification has been triggered. This includes video KYC, live address verification, and employer confirmation. Estimated completion: **2-4 hours**. I'll notify you when results are ready.`
                    : `Got it. I've processed your request. Let me know if you need anything else regarding ${caseData.name}.`,
          timestamp: new Date(),
          sourceLabel: "Case Management Engine",
          confidenceScore: 98,
        };
        setMessages((prev) => [...prev, ackMsg]);
        scrollToBottom();
      }, 600);
    },
    [caseData, scrollToBottom]
  );

  /* ── Suggestions for empty state ── */
  const suggestions = [
    {
      icon: <RotateCcw style={{ width: 13, height: 13 }} />,
      text: "Exclude transaction #TXN998 from DSCR and recompute",
      category: "Dynamic Analysis",
    },
    {
      icon: <TrendingUp style={{ width: 13, height: 13 }} />,
      text: "Check if other income sources are legitimate",
      category: "Income Verification",
    },
    {
      icon: <Fingerprint style={{ width: 13, height: 13 }} />,
      text: "Check digital footprint and locational intelligence",
      category: "Enhanced Verification",
    },
    {
      icon: <Sparkles style={{ width: 13, height: 13 }} />,
      text: `Summarize risk profile of ${caseData.name}`,
      category: "Quick Summary",
    },
  ];

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex rounded-lg overflow-hidden"
      style={{
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        height: "calc(100vh - 240px)",
        minHeight: 480,
      }}
    >
      {/* ── Context Panel ── */}
      <AnimatePresence>
        {showContext && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <ContextPanel caseData={caseData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
        {/* Chat header */}
        <div
          className="shrink-0 flex items-center justify-between"
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center" style={{ gap: 8 }}>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                backgroundColor:
                  "color-mix(in srgb, var(--primary) 10%, transparent)",
              }}
            >
              <Bot
                style={{ width: 13, height: 13, color: "var(--primary)" }}
              />
            </div>
            <span
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              OneRisk Copilot
            </span>
            <span
              className="inline-flex items-center rounded-full"
              style={{
                ...f,
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--success-700)",
                backgroundColor: "var(--success-50)",
                height: 18,
                padding: "0 8px",
              }}
            >
              Active
            </span>
          </div>
          <button
            onClick={() => setShowContext(!showContext)}
            className="flex items-center rounded-md cursor-pointer transition-all bg-transparent"
            style={{
              ...f,
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-muted-themed)",
              border: "1px solid var(--border-subtle)",
              padding: "4px 10px",
              gap: 4,
            }}
          >
            <Info style={{ width: 12, height: 12 }} />
            {showContext ? "Hide" : "Show"} Context
          </button>
        </div>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: "16px 20px" }}
        >
          {isEmpty ? (
            /* ── Empty state ── */
            <div className="h-full flex flex-col items-center justify-center">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor:
                    "color-mix(in srgb, var(--primary) 8%, transparent)",
                  border:
                    "1px solid color-mix(in srgb, var(--primary) 16%, transparent)",
                  marginBottom: 12,
                }}
              >
                <Sparkles
                  style={{
                    width: 22,
                    height: 22,
                    color: "var(--primary)",
                  }}
                />
              </div>
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-heading)",
                  marginBottom: 4,
                }}
              >
                How can I help with {caseData.name}?
              </span>
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--text-muted-themed)",
                  textAlign: "center",
                  maxWidth: 420,
                  lineHeight: "160%",
                  marginBottom: 20,
                }}
              >
                I have full context of this case file. Ask me to analyze
                transactions, verify income sources, run scenario
                calculations, or check digital footprints.
              </span>

              {/* Suggestion cards */}
              <div
                className="grid w-full"
                style={{
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  maxWidth: 520,
                }}
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(s.text);
                      inputRef.current?.focus();
                    }}
                    className="flex flex-col items-start rounded-lg cursor-pointer transition-all text-left"
                    style={{
                      ...f,
                      padding: "12px 14px",
                      backgroundColor:
                        "color-mix(in srgb, var(--primary) 2%, transparent)",
                      border:
                        "1px solid color-mix(in srgb, var(--primary) 10%, transparent)",
                      gap: 6,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "color-mix(in srgb, var(--primary) 6%, transparent)";
                      e.currentTarget.style.borderColor =
                        "color-mix(in srgb, var(--primary) 20%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "color-mix(in srgb, var(--primary) 2%, transparent)";
                      e.currentTarget.style.borderColor =
                        "color-mix(in srgb, var(--primary) 10%, transparent)";
                    }}
                  >
                    <div
                      className="flex items-center"
                      style={{ gap: 6 }}
                    >
                      <span style={{ color: "var(--primary)" }}>
                        {s.icon}
                      </span>
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--primary)",
                        }}
                      >
                        {s.category}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--text-secondary-themed)",
                        lineHeight: "155%",
                      }}
                    >
                      {s.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Messages list ── */
            <div className="flex flex-col" style={{ gap: 16 }}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onAction={handleAction}
                />
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ── */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "12px 16px",
            backgroundColor: "var(--surface-card)",
          }}
        >
          {/* Typing indicator when processing */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center"
                style={{
                  gap: 6,
                  marginBottom: 8,
                  paddingLeft: 4,
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Loader2
                    style={{
                      width: 12,
                      height: 12,
                      color: "var(--primary)",
                    }}
                  />
                </motion.div>
                <span
                  style={{
                    ...f,
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  Copilot is working on your request...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="flex items-center rounded-lg"
            style={{
              backgroundColor: "var(--surface-inset)",
              border: "1px solid var(--border-subtle)",
              padding: "0 4px 0 14px",
              height: 44,
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Copilot — e.g. 'Exclude TXN #998 from DSCR and recompute...'"
              className="flex-1 bg-transparent outline-none border-none"
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-heading)",
              }}
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="shrink-0 rounded-md flex items-center justify-center cursor-pointer transition-all"
              style={{
                width: 36,
                height: 36,
                backgroundColor:
                  input.trim() && !isProcessing
                    ? "var(--primary)"
                    : "transparent",
                border: "none",
                opacity: isProcessing ? 0.5 : 1,
              }}
            >
              <Send
                style={{
                  width: 16,
                  height: 16,
                  color:
                    input.trim() && !isProcessing
                      ? "var(--text-on-color)"
                      : "var(--text-muted-themed)",
                }}
              />
            </button>
          </div>

          <div
            className="flex items-center justify-center"
            style={{ marginTop: 6 }}
          >
            <span
              style={{
                ...f,
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
                opacity: 0.5,
              }}
            >
              Copilot may make errors. Verify important analyses independently.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

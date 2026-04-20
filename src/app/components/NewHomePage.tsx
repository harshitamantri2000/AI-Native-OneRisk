import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Car,
  Gavel,
  FileText,
  Globe,
  FileCheck2,
  Sparkles,
  LayoutGrid,
  Compass,
  Plus,
  X,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Pause,
  CircleDot,
  Building2,
  ChevronRight,
  Layers,
  Search,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { NewCheckDrawer } from "./NewCheckDrawer";
import type { CheckType } from "../data/terminalChecks";
import { MOCK_CASES, type CaseEntry, type CaseStatus, type RiskLevel } from "../data/cases";

/* ═══════════════════════════════════════════════════════════════
   BASE TOKENS
   ═══════════════════════════════════════════════════════════════ */
const f: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatDate = (): string =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const NOW = new Date("2026-04-01T12:00:00");

const CASE_LAST_TOUCHED: Record<string, Date> = {
  "CASE-10235": new Date("2026-04-01T09:23:00"),
  "CASE-10241": new Date("2026-04-01T07:10:00"),
  "CASE-10236": new Date("2026-03-31T16:30:00"),
  "CASE-10234": new Date("2026-03-31T11:45:00"),
  "CASE-10238": new Date("2026-03-28T10:00:00"),
  "CASE-10237": new Date("2026-03-25T17:00:00"),
  "CASE-10239": new Date("2026-03-20T13:30:00"),
};

const relativeTime = (d: Date): string => {
  const diff = NOW.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 5) return "Just now";
  if (hours < 1) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getGroupLabel = (d: Date): string => {
  const today = NOW;
  const yesterday = new Date(NOW);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";
  const days = Math.floor((NOW.getTime() - d.getTime()) / 86400000);
  if (days < 7) return `${days} days ago`;
  return "Earlier";
};

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const AVATAR_PALETTE = [
  { bg: "color-mix(in srgb, var(--primary) 12%, var(--neutral-0))", fg: "var(--primary)" },
  { bg: "color-mix(in srgb, var(--success-700) 12%, var(--neutral-0))", fg: "var(--success-700)" },
  { bg: "color-mix(in srgb, var(--warning-600) 12%, var(--neutral-0))", fg: "var(--warning-700)" },
  { bg: "color-mix(in srgb, var(--info-600) 12%, var(--neutral-0))", fg: "var(--info-600)" },
  { bg: "color-mix(in srgb, var(--destructive-500) 10%, var(--neutral-0))", fg: "var(--destructive-600)" },
];

const avatarColor = (name: string) =>
  AVATAR_PALETTE[name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length];

/* ═══════════════════════════════════════════════════════════════
   LOAN & CHECK CATALOG
   ═══════════════════════════════════════════════════════════════ */
interface LoanDef {
  id: string;
  label: string;
  meta: string;
  imageBg: string;
  wirePrimary: string;
  queryParam: string;
  size: "large" | "small";
}

interface CheckDef {
  id: string;
  label: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  iconBg: string;
  iconColor: string;
  checkType: CheckType | null;
}

const ALL_LOANS: LoanDef[] = [
  { id: "small-business", label: "Small Business Loan", meta: "Individual PAN · Non-company · 5 checks", imageBg: "color-mix(in srgb, var(--primary) 6%, var(--neutral-0))", wirePrimary: "var(--primary)", queryParam: "small-business", size: "large" },
  { id: "large-business", label: "Medium / Large Business Loan", meta: "Company PAN · Registered entity · 6 checks", imageBg: "color-mix(in srgb, var(--primary) 6%, var(--neutral-0))", wirePrimary: "var(--primary)", queryParam: "large-business", size: "large" },
  { id: "msme-lap", label: "MSME — LAP", meta: "Loan Against Property · MSME segment", imageBg: "color-mix(in srgb, var(--destructive-200) 35%, var(--neutral-0))", wirePrimary: "var(--destructive-500)", queryParam: "msme-lap", size: "small" },
  { id: "vehicle-commercial", label: "Used Vehicle — Commercial", meta: "Fleet & commercial vehicle", imageBg: "color-mix(in srgb, var(--success-200) 40%, var(--neutral-0))", wirePrimary: "var(--success-700)", queryParam: "vehicle-commercial", size: "small" },
  { id: "home-loan", label: "Home Loan", meta: "Individual borrower", imageBg: "color-mix(in srgb, var(--info-200) 40%, var(--neutral-0))", wirePrimary: "var(--info-600)", queryParam: "home-loan", size: "small" },
  { id: "vehicle-individual", label: "Used Vehicle — Individual", meta: "Personal vehicle", imageBg: "color-mix(in srgb, var(--neutral-100) 60%, var(--neutral-0))", wirePrimary: "var(--neutral-200)", queryParam: "vehicle-individual", size: "small" },
];

const ALL_CHECKS: CheckDef[] = [
  { id: "aml", label: "AML Check", description: "Screen against global sanctions & adverse media", Icon: ShieldAlert, iconBg: "color-mix(in srgb, var(--warning-600) 12%, transparent)", iconColor: "var(--warning-700)", checkType: "aml-check" },
  { id: "vehicular", label: "Vehicular Check", description: "RC verification, ownership & hypothecation", Icon: Car, iconBg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)", iconColor: "var(--destructive-600)", checkType: "vehicular-check" },
  { id: "court", label: "Court Records", description: "Litigation history across district, HC & SC", Icon: Gavel, iconBg: "color-mix(in srgb, var(--primary) 10%, transparent)", iconColor: "var(--primary)", checkType: "court-check" },
  { id: "bsa", label: "Bank Statement", description: "AI-powered cash flow & anomaly detection", Icon: FileText, iconBg: "color-mix(in srgb, var(--success-700) 10%, transparent)", iconColor: "var(--success-700)", checkType: "bank-statement" },
  { id: "netscan", label: "NetScan", description: "Digital footprint, news & sentiment analysis", Icon: Globe, iconBg: "color-mix(in srgb, var(--info-600) 10%, transparent)", iconColor: "var(--info-600)", checkType: "netscan" },
  { id: "gst", label: "GST Verification", description: "GSTIN status, return filing & compliance", Icon: FileCheck2, iconBg: "color-mix(in srgb, var(--neutral-200) 50%, transparent)", iconColor: "var(--text-muted-themed)", checkType: null },
];

// Underwriter config (provisioned by admin)
const UW_LOAN = ALL_LOANS.find((l) => l.id === "msme-lap")!;
const UW_CHECKS: CheckDef[] = [
  ALL_CHECKS.find((c) => c.id === "aml")!,
  ALL_CHECKS.find((c) => c.id === "court")!,
];

/* ═══════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ═══════════════════════════════════════════════════════════════ */
const WireframePlaceholder: React.FC<{ wireColor: string; height?: number }> = ({
  wireColor, height = 148,
}) => (
  <div style={{ width: "100%", height, display: "flex", flexDirection: "column", justifyContent: "center", padding: "18px 22px", gap: 8 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: wireColor, opacity: 0.18, flexShrink: 0 }} />
      <div style={{ flex: 1, height: 6, borderRadius: 99, backgroundColor: wireColor, opacity: 0.14 }} />
    </div>
    {[88, 70, 55, 78].map((w, i) => (
      <div key={i} style={{ width: `${w}%`, height: i === 0 ? 7 : 5, borderRadius: 99, backgroundColor: wireColor, opacity: i === 0 ? 0.15 : 0.09 }} />
    ))}
  </div>
);

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const s = {
    High: { bg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)", color: "var(--destructive-600)" },
    Medium: { bg: "color-mix(in srgb, var(--warning-600) 12%, transparent)", color: "var(--warning-700)" },
    Low: { bg: "color-mix(in srgb, var(--success-700) 10%, transparent)", color: "var(--success-700)" },
  }[level];
  return (
    <span style={{ ...f, fontSize: "var(--text-xs)", lineHeight: "14px", fontWeight: 600, color: s.color, backgroundColor: s.bg, border: `1px solid color-mix(in srgb, ${s.color} 22%, transparent)`, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>
      {level} risk
    </span>
  );
};

const StatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const map: Record<CaseStatus, { Icon: typeof CircleDot; color: string; bg: string }> = {
    New: { Icon: CircleDot, color: "var(--info-600)", bg: "color-mix(in srgb, var(--info-600) 10%, transparent)" },
    "Expert Review": { Icon: AlertTriangle, color: "var(--warning-700)", bg: "color-mix(in srgb, var(--warning-600) 12%, transparent)" },
    "On Hold": { Icon: Pause, color: "var(--text-muted-themed)", bg: "var(--neutral-100)" },
    Approved: { Icon: CheckCircle2, color: "var(--success-700)", bg: "color-mix(in srgb, var(--success-700) 10%, transparent)" },
    Rejected: { Icon: AlertTriangle, color: "var(--destructive-600)", bg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)" },
  };
  const s = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-xs)", lineHeight: "14px", fontWeight: 500, color: s.color, backgroundColor: s.bg, border: `1px solid color-mix(in srgb, ${s.color} 22%, transparent)`, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>
      <s.Icon size={10} strokeWidth={2} />
      {status}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════
   EXPLORATION TOGGLE (header right)
   ═══════════════════════════════════════════════════════════════ */
type Exploration = "exp1" | "exp2" | "exp3";

const EXP_OPTIONS: { value: Exploration; label: string; sub: string; Icon: typeof Sparkles }[] = [
  { value: "exp1", label: "Exploration 1", sub: "Configured", Icon: Layers },
  { value: "exp2", label: "Exploration 2", sub: "Open catalog", Icon: LayoutGrid },
  { value: "exp3", label: "Exploration 3", sub: "Guided intent", Icon: Compass },
];

const ExplorationToggle: React.FC<{ active: Exploration; onChange: (v: Exploration) => void }> = ({
  active, onChange,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <span style={{ ...f, fontSize: "var(--text-xs)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>
      Exploration
    </span>
    <div style={{ display: "inline-flex", alignItems: "center", padding: 3, border: "1px solid var(--border-subtle)", borderRadius: 10, backgroundColor: "var(--neutral-50)", gap: 2 }}>
      {EXP_OPTIONS.map(({ value, label, sub, Icon }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            title={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 13px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
              backgroundColor: isActive ? "var(--primary)" : "transparent",
            }}
          >
            <Icon size={13} strokeWidth={2} style={{ color: isActive ? "var(--neutral-0)" : "var(--text-muted-themed)" } as React.CSSProperties} />
            <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: isActive ? 600 : 500, color: isActive ? "var(--neutral-0)" : "var(--text-muted-themed)", whiteSpace: "nowrap" }}>
              {sub}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   EXPLORATION 1 — UNDERWRITER (CONFIGURED WORKSPACE)
   ═══════════════════════════════════════════════════════════════ */
type E1Possibility = "p1" | "p2"; // p1: workflow only | p2: workflow + checks
type E1UserState = "first-time" | "returning";

/* ── E1 Sub-controls bar ── */
const E1Controls: React.FC<{
  possibility: E1Possibility;
  userState: E1UserState;
  onPossibility: (p: E1Possibility) => void;
  onUserState: (s: E1UserState) => void;
}> = ({ possibility, userState, onPossibility, onUserState }) => (
  <div style={{
    backgroundColor: "var(--neutral-0)",
    borderBottom: "1px solid var(--border-subtle)",
    padding: "10px 36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexShrink: 0,
  }}>
    {/* Left: scenario */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 500, color: "var(--text-muted-themed)" }}>
        Scenario:
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {(["p1", "p2"] as E1Possibility[]).map((p) => {
          const isActive = possibility === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPossibility(p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 11px",
                border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--border-subtle)",
                borderRadius: 6,
                backgroundColor: isActive ? "color-mix(in srgb, var(--primary) 8%, var(--neutral-0))" : "var(--neutral-0)",
                cursor: "pointer",
                transition: "all 0.13s ease",
              }}
            >
              <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: isActive ? 600 : 500, color: isActive ? "var(--primary)" : "var(--text-muted-themed)" }}>
                {p === "p1" ? "P1 — Workflow only" : "P2 — Workflow + checks"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Config caption */}
      <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)" }}>
        {possibility === "p1"
          ? "· 1 workflow (MSME-LAP), no standalone checks"
          : "· 1 workflow (MSME-LAP) + AML Check + Court Records"}
      </span>
    </div>

    {/* Right: user state */}
    <div style={{ display: "flex", gap: 4 }}>
      {(["first-time", "returning"] as E1UserState[]).map((s) => {
        const isActive = userState === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onUserState(s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 11px",
              border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--border-subtle)",
              borderRadius: 6,
              backgroundColor: isActive ? "color-mix(in srgb, var(--primary) 8%, var(--neutral-0))" : "var(--neutral-0)",
              cursor: "pointer",
              transition: "all 0.13s ease",
            }}
          >
            {s === "first-time"
              ? <Sparkles size={12} strokeWidth={2} style={{ color: isActive ? "var(--primary)" : "var(--text-muted-themed)" } as React.CSSProperties} />
              : <RefreshCw size={12} strokeWidth={2} style={{ color: isActive ? "var(--primary)" : "var(--text-muted-themed)" } as React.CSSProperties} />
            }
            <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: isActive ? 600 : 500, color: isActive ? "var(--primary)" : "var(--text-muted-themed)" }}>
              {s === "first-time" ? "First visit" : "My cases"}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

/* ── E1 Empty state (first visit) ── */
const E1EmptyState: React.FC<{
  possibility: E1Possibility;
  onStart: (q: string) => void;
  onCheck: (t: CheckType) => void;
}> = ({ possibility, onStart, onCheck }) => {
  const [cardHovered, setCardHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 36px",
        gap: 0,
      }}
    >
      {/* Welcome block */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        {/* Avatar */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "color-mix(in srgb, var(--primary) 10%, var(--neutral-0))",
          border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <Building2 size={24} style={{ color: "var(--primary)" } as React.CSSProperties} />
        </div>

        <span style={{ ...f, fontSize: "var(--text-lg)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>
          Your workspace is ready, Harish
        </span>
        <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 6, maxWidth: 420 }}>
          You're configured as an <strong style={{ fontWeight: 600, color: "var(--text-body)" }}>MSME Credit Underwriter</strong>.
          {possibility === "p1"
            ? " Your workflow is ready to go."
            : " Your workflow and standalone checks are ready."}
        </span>
      </div>

      {/* Workflow card */}
      <div style={{ width: "100%", maxWidth: 440, marginBottom: possibility === "p2" ? 28 : 0 }}>
        <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
          Your workflow
        </span>
        <button
          type="button"
          onClick={() => onStart(UW_LOAN.queryParam)}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          style={{
            width: "100%",
            textAlign: "left",
            backgroundColor: "var(--neutral-0)",
            border: cardHovered ? "1.5px solid color-mix(in srgb, var(--primary) 55%, transparent)" : "1px solid var(--border-subtle)",
            borderRadius: 12,
            overflow: "hidden",
            cursor: "pointer",
            padding: 0,
            transition: "border-color 0.14s ease",
          }}
        >
          <div style={{ margin: 8, borderRadius: 8, backgroundColor: UW_LOAN.imageBg, border: `1px dashed color-mix(in srgb, ${UW_LOAN.wirePrimary} 28%, transparent)` }}>
            <WireframePlaceholder wireColor={UW_LOAN.wirePrimary} height={130} />
          </div>
          <div style={{ padding: "8px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ ...f, fontSize: "var(--text-md)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>
                {UW_LOAN.label}
              </span>
              <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 2 }}>
                {UW_LOAN.meta}
              </span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              backgroundColor: "var(--primary)",
              color: "var(--neutral-0)",
              borderRadius: 8,
              flexShrink: 0,
            }}>
              <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600 }}>
                Begin assessment
              </span>
              <ArrowRight size={13} strokeWidth={2.2} />
            </div>
          </div>
        </button>
      </div>

      {/* P2: Standalone checks */}
      <AnimatePresence>
        {possibility === "p2" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{ width: "100%", maxWidth: 440 }}
          >
            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border-subtle)" }} />
              <span style={{ ...f, fontSize: "var(--text-xs)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Or run a quick check
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border-subtle)" }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {UW_CHECKS.map((check) => (
                <E1CheckCard key={check.id} check={check} onRun={() => onCheck(check.checkType!)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const E1CheckCard: React.FC<{ check: CheckDef; onRun: () => void }> = ({ check, onRun }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onRun}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 14px",
        backgroundColor: "var(--neutral-0)",
        border: hov ? "1.5px solid color-mix(in srgb, var(--primary) 45%, transparent)" : "1px solid var(--border-subtle)",
        borderRadius: 10,
        cursor: "pointer",
        transition: "border-color 0.13s ease",
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 7, backgroundColor: check.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <check.Icon style={{ width: 15, height: 15, color: check.iconColor } as React.CSSProperties} />
      </div>
      <div>
        <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 600, color: "var(--text-heading)", display: "block" }}>{check.label}</span>
        <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 1 }}>{check.description}</span>
      </div>
    </button>
  );
};

/* ── E1 Returning view — case timeline + New Case panel ── */
const E1ReturningView: React.FC<{
  possibility: E1Possibility;
  onCheck: (t: CheckType) => void;
  onNavigate: (id: string) => void;
}> = ({ possibility, onCheck, onNavigate }) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  const eddCases = useMemo(
    () =>
      MOCK_CASES.filter((c) => c.source === "entity-dd").sort((a, b) => {
        const ta = (CASE_LAST_TOUCHED[a.id] ?? new Date(a.created)).getTime();
        const tb = (CASE_LAST_TOUCHED[b.id] ?? new Date(b.created)).getTime();
        return tb - ta;
      }),
    []
  );

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, CaseEntry[]> = {};
    eddCases.forEach((c) => {
      const d = CASE_LAST_TOUCHED[c.id] ?? new Date(c.created);
      const label = getGroupLabel(d);
      if (!groups[label]) groups[label] = [];
      groups[label].push(c);
    });
    // Ordered keys
    const ORDER = ["Today", "Yesterday"];
    const keys = [
      ...ORDER.filter((k) => groups[k]),
      ...Object.keys(groups).filter((k) => !ORDER.includes(k)),
    ];
    return keys.map((k) => ({ label: k, cases: groups[k] }));
  }, [eddCases]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col flex-1 min-h-0"
      style={{ height: "100%" }}
    >
      {/* Sub-header */}
      <div style={{
        padding: "16px 36px",
        backgroundColor: "var(--neutral-0)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <span style={{ ...f, fontSize: "var(--text-md)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>
            My Cases
          </span>
          <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 2 }}>
            {eddCases.length} cases · sorted by last activity
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen((p) => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "0 16px",
            height: 36,
            backgroundColor: panelOpen ? "var(--primary-600)" : "var(--primary)",
            color: "var(--neutral-0)",
            border: "none",
            borderRadius: 8,
            ...f,
            fontSize: "var(--text-sm)",
            lineHeight: "140%",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.14s ease",
          }}
        >
          {panelOpen ? <X size={14} strokeWidth={2.2} /> : <Plus size={14} strokeWidth={2.2} />}
          {panelOpen ? "Cancel" : "New Case"}
        </button>
      </div>

      {/* Inline "New Case" panel — slides open */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden", flexShrink: 0, backgroundColor: "color-mix(in srgb, var(--primary) 3%, var(--neutral-0))", borderBottom: "1px solid color-mix(in srgb, var(--primary) 15%, var(--border-subtle))" }}
          >
            <div style={{ padding: "20px 36px" }}>
              <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 12 }}>
                Start a new assessment
              </span>
              <div style={{ display: "flex", alignItems: "stretch", gap: 12, maxWidth: 720 }}>
                {/* Workflow card */}
                <button
                  type="button"
                  onClick={() => {
                    setPanelOpen(false);
                    // navigate to new-case
                  }}
                  onMouseEnter={() => setCardHovered(true)}
                  onMouseLeave={() => setCardHovered(false)}
                  style={{
                    flex: possibility === "p2" ? "0 0 260px" : "0 0 340px",
                    textAlign: "left",
                    backgroundColor: "var(--neutral-0)",
                    border: cardHovered ? "1.5px solid color-mix(in srgb, var(--primary) 55%, transparent)" : "1px solid var(--border-subtle)",
                    borderRadius: 10,
                    overflow: "hidden",
                    padding: 0,
                    cursor: "pointer",
                    transition: "border-color 0.13s ease",
                  }}
                >
                  <div style={{ margin: 6, borderRadius: 6, backgroundColor: UW_LOAN.imageBg, border: `1px dashed color-mix(in srgb, ${UW_LOAN.wirePrimary} 28%, transparent)` }}>
                    <WireframePlaceholder wireColor={UW_LOAN.wirePrimary} height={80} />
                  </div>
                  <div style={{ padding: "6px 12px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>{UW_LOAN.label}</span>
                      <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 1 }}>{UW_LOAN.meta}</span>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--primary)", flexShrink: 0 } as React.CSSProperties} />
                  </div>
                </button>

                {/* P2: check chips vertical */}
                {possibility === "p2" && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.16 }}
                      style={{ display: "flex", flexDirection: "column", gap: 8 }}
                    >
                      <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>
                        Or quick check
                      </span>
                      {UW_CHECKS.map((check) => (
                        <button
                          key={check.id}
                          type="button"
                          onClick={() => { setPanelOpen(false); onCheck(check.checkType!); }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                            padding: "10px 14px",
                            backgroundColor: "var(--neutral-0)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "border-color 0.12s ease",
                            textAlign: "left",
                            flex: 1,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 45%, transparent)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
                        >
                          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: check.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <check.Icon style={{ width: 13, height: 13, color: check.iconColor } as React.CSSProperties} />
                          </div>
                          <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 600, color: "var(--text-heading)" }}>{check.label}</span>
                          <ArrowRight size={12} style={{ color: "var(--text-muted-themed)", marginLeft: "auto", flexShrink: 0 } as React.CSSProperties} />
                        </button>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case timeline */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "20px 36px" }}>
        {grouped.map((group) => (
          <div key={group.label} style={{ marginBottom: 24 }}>
            {/* Group label */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ ...f, fontSize: "var(--text-xs)", lineHeight: "140%", fontWeight: 700, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {group.label}
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border-subtle)" }} />
            </div>

            {/* Case rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {group.cases.map((c) => (
                <TimelineRow
                  key={c.id}
                  case_={c}
                  onContinue={() => onNavigate(c.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const TimelineRow: React.FC<{ case_: CaseEntry; onContinue: () => void }> = ({ case_, onContinue }) => {
  const [hov, setHov] = useState(false);
  const av = avatarColor(case_.name);
  const touched = CASE_LAST_TOUCHED[case_.id] ?? new Date(case_.created);
  return (
    <div
      onClick={onContinue}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 16px",
        backgroundColor: hov ? "color-mix(in srgb, var(--primary) 3%, var(--neutral-0))" : "var(--neutral-0)",
        border: hov ? "1px solid color-mix(in srgb, var(--primary) 20%, var(--border-subtle))" : "1px solid var(--border-subtle)",
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.12s ease",
      }}
    >
      {/* Avatar */}
      <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: av.bg, border: `1px solid color-mix(in srgb, ${av.fg} 20%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: av.fg, lineHeight: 1 }}>{getInitials(case_.name)}</span>
      </div>

      {/* Entity name */}
      <div style={{ flex: "0 0 190px", minWidth: 0 }}>
        <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 600, color: "var(--text-heading)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {case_.name}
        </span>
        <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block" }}>
          {case_.natureOfBusiness}
        </span>
      </div>

      {/* Case ID */}
      <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", flex: "0 0 96px" }}>
        {case_.id}
      </span>

      {/* Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        <RiskBadge level={case_.riskLevel} />
        <StatusBadge status={case_.status} />
      </div>

      {/* Most risky element */}
      <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", flex: "0 0 200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {case_.mostRiskElement}
      </span>

      {/* Time */}
      <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 500, color: "var(--text-muted-themed)", flex: "0 0 72px", textAlign: "right" }}>
        {relativeTime(touched)}
      </span>

      {/* Continue */}
      <motion.div animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -4 }} transition={{ duration: 0.12 }} style={{ flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 11px", backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)", color: "var(--primary)", border: "1px solid color-mix(in srgb, var(--primary) 22%, transparent)", borderRadius: 6 }}>
          <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600 }}>Continue</span>
          <ArrowRight size={12} strokeWidth={2.2} />
        </div>
      </motion.div>
    </div>
  );
};

/* ── E1 Root ── */
const Exploration1: React.FC<{
  onCheck: (t: CheckType) => void;
  onNavigate: (id: string) => void;
  onNewCase: (q: string) => void;
  externalUserState?: E1UserState;
  onUserStateChange?: (s: E1UserState) => void;
}> = ({ onCheck, onNavigate, onNewCase, externalUserState, onUserStateChange }) => {
  const [possibility, setPossibility] = useState<E1Possibility>("p1");
  const [internalUserState, setInternalUserState] = useState<E1UserState>("first-time");
  const userState = externalUserState ?? internalUserState;
  const setUserState = (s: E1UserState) => {
    setInternalUserState(s);
    onUserStateChange?.(s);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ height: "100%" }}>
      <E1Controls
        possibility={possibility}
        userState={userState}
        onPossibility={setPossibility}
        onUserState={setUserState}
      />
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {userState === "first-time" ? (
            <E1EmptyState
              key={`e1-empty-${possibility}`}
              possibility={possibility}
              onStart={onNewCase}
              onCheck={onCheck}
            />
          ) : (
            <E1ReturningView
              key="e1-returning"
              possibility={possibility}
              onCheck={onCheck}
              onNavigate={onNavigate}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   EXPLORATION 2 — OPEN CATALOG
   ═══════════════════════════════════════════════════════════════ */
const LoanCard: React.FC<{ loan: LoanDef; size: "large" | "small"; onClick: () => void; delay: number }> = ({ loan, size, onClick, delay }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.18 }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="text-left"
      style={{
        backgroundColor: "var(--neutral-0)",
        border: hov ? "1.5px solid color-mix(in srgb, var(--primary) 50%, transparent)" : "1px solid var(--border-subtle)",
        borderRadius: 10,
        overflow: "hidden",
        padding: 0,
        cursor: "pointer",
        transition: "border-color 0.14s ease",
        width: "100%",
      }}
    >
      <div style={{ margin: 8, borderRadius: 6, backgroundColor: loan.imageBg, border: `1px dashed color-mix(in srgb, ${loan.wirePrimary} 28%, transparent)` }}>
        <WireframePlaceholder wireColor={loan.wirePrimary} height={size === "large" ? 148 : 96} />
      </div>
      <div style={{ padding: size === "large" ? "6px 14px 16px" : "5px 12px 13px" }}>
        <span style={{ ...f, fontSize: size === "large" ? "var(--text-md)" : "var(--text-base)", lineHeight: "140%", fontWeight: 600, color: "var(--text-heading)", display: "block" }}>{loan.label}</span>
        <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 2 }}>{loan.meta}</span>
      </div>
    </motion.button>
  );
};

const CheckCard2: React.FC<{ check: CheckDef; onClick: () => void; delay: number }> = ({ check, onClick, delay }) => {
  const [hov, setHov] = useState(false);
  const isCS = check.checkType === null;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.18 }}
      onClick={isCS ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="text-left flex items-start"
      style={{
        backgroundColor: "var(--neutral-0)",
        border: hov && !isCS ? "1.5px solid color-mix(in srgb, var(--primary) 45%, transparent)" : "1px solid var(--border-subtle)",
        borderRadius: 10,
        cursor: isCS ? "default" : "pointer",
        padding: 14,
        gap: 12,
        opacity: isCS ? 0.5 : 1,
        transition: "border-color 0.14s ease",
        width: "100%",
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: check.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <check.Icon style={{ width: 16, height: 16, color: check.iconColor } as React.CSSProperties} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 600, color: "var(--text-heading)" }}>{check.label}</span>
          {isCS && <span style={{ ...f, fontSize: "var(--text-xs)", lineHeight: "14px", fontWeight: 500, color: "var(--text-muted-themed)", backgroundColor: "var(--neutral-100)", border: "1px solid var(--border-subtle)", borderRadius: 20, padding: "1px 7px" }}>Soon</span>}
        </div>
        <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 2 }}>{check.description}</span>
      </div>
    </motion.button>
  );
};

const Exploration2: React.FC<{
  onLoan: (q: string) => void;
  onCheck: (t: CheckType | null) => void;
}> = ({ onLoan, onCheck }) => {
  const largeLoans = ALL_LOANS.filter((l) => l.size === "large");
  const smallLoans = ALL_LOANS.filter((l) => l.size === "small");
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ padding: "28px 36px", maxWidth: 1040, margin: "0 auto" }}
    >
      <div style={{ marginBottom: 18 }}>
        <span style={{ ...f, fontSize: "var(--text-md)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>
          Start a new assessment
        </span>
        <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 3 }}>
          Full product catalog — select a loan type to begin a structured due-diligence workflow
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
        {largeLoans.map((l, i) => <LoanCard key={l.id} loan={l} size="large" delay={i * 0.06} onClick={() => onLoan(l.queryParam)} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 32 }}>
        {smallLoans.map((l, i) => <LoanCard key={l.id} loan={l} size="small" delay={0.12 + i * 0.05} onClick={() => onLoan(l.queryParam)} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, backgroundColor: "var(--border-subtle)" }} />
        <span style={{ ...f, fontSize: "var(--text-xs)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Or run a standalone check
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: "var(--border-subtle)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, paddingBottom: 40 }}>
        {ALL_CHECKS.map((c, i) => <CheckCard2 key={c.id} check={c} delay={0.24 + i * 0.04} onClick={() => onCheck(c.checkType)} />)}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   EXPLORATION 3 — GUIDED INTENT
   ═══════════════════════════════════════════════════════════════ */
type IntentType = "assess" | "check" | "resume" | null;

const Exploration3: React.FC<{
  onLoan: (q: string) => void;
  onCheck: (t: CheckType | null) => void;
  onResume: (id: string) => void;
}> = ({ onLoan, onCheck, onResume }) => {
  const [intent, setIntent] = useState<IntentType>(null);
  const recentCases = useMemo(
    () =>
      MOCK_CASES.filter((c) => c.source === "entity-dd")
        .sort((a, b) => {
          const ta = (CASE_LAST_TOUCHED[a.id] ?? new Date(a.created)).getTime();
          const tb = (CASE_LAST_TOUCHED[b.id] ?? new Date(b.created)).getTime();
          return tb - ta;
        })
        .slice(0, 4),
    []
  );

  const INTENTS: { id: IntentType; icon: typeof FolderOpen; label: string; sub: string; color: string; bg: string }[] = [
    { id: "assess", icon: Building2, label: "Assess a new applicant", sub: "Full due-diligence workflow", color: "var(--primary)", bg: "color-mix(in srgb, var(--primary) 8%, var(--neutral-0))" },
    { id: "check", icon: Search, label: "Run a background check", sub: "Instant standalone check", color: "var(--warning-700)", bg: "color-mix(in srgb, var(--warning-600) 8%, var(--neutral-0))" },
    { id: "resume", icon: RefreshCw, label: "Continue a case", sub: "Pick up where you left off", color: "var(--success-700)", bg: "color-mix(in srgb, var(--success-700) 8%, var(--neutral-0))" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ padding: "40px 36px", maxWidth: 800, margin: "0 auto" }}
    >
      {/* Question */}
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <span style={{ ...f, fontSize: "var(--text-lg)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>
          What do you want to do today?
        </span>
        <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 5 }}>
          Select an option to get started
        </span>
      </div>

      {/* Intent tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {INTENTS.map(({ id, icon: Icon, label, sub, color, bg }, i) => {
          const isActive = intent === id;
          return (
            <motion.button
              key={id!}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.18 }}
              onClick={() => setIntent(isActive ? null : id)}
              style={{
                textAlign: "center",
                padding: "24px 20px",
                backgroundColor: isActive ? bg : "var(--neutral-0)",
                border: isActive ? `1.5px solid color-mix(in srgb, ${color} 40%, transparent)` : "1px solid var(--border-subtle)",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = `color-mix(in srgb, ${color} 28%, transparent)`; e.currentTarget.style.backgroundColor = bg; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.backgroundColor = "var(--neutral-0)"; } }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={22} style={{ color } as React.CSSProperties} />
              </div>
              <div>
                <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>{label}</span>
                <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 2 }}>{sub}</span>
              </div>
              <ChevronRight size={14} style={{ color, transform: isActive ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease" } as React.CSSProperties} />
            </motion.button>
          );
        })}
      </div>

      {/* Expanded content per intent */}
      <AnimatePresence mode="wait">
        {intent === "assess" && (
          <motion.div key="assess" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Choose a loan type
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
              {ALL_LOANS.filter((l) => l.size === "large").map((l) => (
                <LoanCard key={l.id} loan={l} size="large" delay={0} onClick={() => onLoan(l.queryParam)} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {ALL_LOANS.filter((l) => l.size === "small").map((l) => (
                <LoanCard key={l.id} loan={l} size="small" delay={0} onClick={() => onLoan(l.queryParam)} />
              ))}
            </div>
          </motion.div>
        )}

        {intent === "check" && (
          <motion.div key="check" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Choose a check type
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {ALL_CHECKS.map((c) => (
                <CheckCard2 key={c.id} check={c} delay={0} onClick={() => onCheck(c.checkType)} />
              ))}
            </div>
          </motion.div>
        )}

        {intent === "resume" && (
          <motion.div key="resume" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600, color: "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Recent cases
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recentCases.map((c) => (
                <TimelineRow key={c.id} case_={c} onContinue={() => onResume(c.id)} />
              ))}
              <button
                type="button"
                onClick={() => {}}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", border: "1px dashed var(--border-subtle)", borderRadius: 10, backgroundColor: "transparent", cursor: "pointer", color: "var(--text-muted-themed)", ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 500 }}
              >
                <FolderOpen size={14} />
                View all cases
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE ROOT
   ═══════════════════════════════════════════════════════════════ */
export const NewHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [exploration, setExploration] = useState<Exploration>("exp1");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<CheckType | null>(null);
  const [e1UserState, setE1UserState] = useState<E1UserState>("first-time");

  const handleLoan = (q: string) => navigate(`/new-case?type=${q}`);
  const handleCheck = (t: CheckType | null) => {
    if (!t) return;
    setDrawerType(t);
    setDrawerOpen(true);
  };
  const handleResume = (id: string) => navigate(`/analysis/case/${id}`);

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{ backgroundColor: "var(--neutral-50)", height: "100%", overflow: "hidden" }}
    >
      {/* ── Welcome header ── */}
      <div style={{
        backgroundColor: "var(--neutral-0)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "18px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexShrink: 0,
      }}>
        <div>
          <span style={{ ...f, fontSize: "var(--text-lg)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>
            {getGreeting()}, Harish 👋
          </span>
          <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 3 }}>
            {formatDate()}
          </span>
        </div>
        <ExplorationToggle active={exploration} onChange={setExploration} />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ display: "flex", flexDirection: "column" }}>
        <AnimatePresence mode="wait">
          {exploration === "exp1" && (
            <motion.div key="exp1" className="flex-1 flex flex-col min-h-0" style={{ height: "100%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <Exploration1
                onCheck={handleCheck}
                onNavigate={handleResume}
                onNewCase={handleLoan}
                externalUserState={e1UserState}
                onUserStateChange={setE1UserState}
              />
            </motion.div>
          )}
          {exploration === "exp2" && (
            <motion.div key="exp2" className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <Exploration2 onLoan={handleLoan} onCheck={handleCheck} />
            </motion.div>
          )}
          {exploration === "exp3" && (
            <motion.div key="exp3" className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <Exploration3 onLoan={handleLoan} onCheck={handleCheck} onResume={handleResume} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NewCheckDrawer open={drawerOpen} checkType={drawerType} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

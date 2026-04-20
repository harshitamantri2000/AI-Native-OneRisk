import React, { useState, useRef, useEffect, useCallback } from "react";
import type { RichCaseEntry } from "../../data/mock";
import {
  Sparkles, MessageSquarePlus, Send, User, CheckCheck, Flag, X, Plus,
  FileText, Building2, BarChart3, ShieldCheck, Globe, Camera,
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2,
  Info, ArrowUpRight, MapPin, Calendar, Hash, Download,
  ChevronRight, Phone, Mail, Link,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type RemarkStatus = "pending" | "flagged" | "approved";
interface SectionRemark { id: string; text: string; status: RemarkStatus; timestamp: string; }

/* ─── Sections ────────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: "executive",   label: "Executive Summary",         icon: <FileText size={13} />, mandatory: true },
  { id: "borrower",    label: "Borrower Profile",          icon: <Building2 size={13} />, mandatory: true },
  { id: "financials",  label: "Financial Analysis",        icon: <BarChart3 size={13} />, mandatory: true },
  { id: "macro",       label: "Macro Analysis",            icon: <Globe size={13} />, mandatory: true },
  { id: "micro",       label: "Micro Analysis",            icon: <TrendingUp size={13} />, mandatory: false },
  { id: "fieldvisit",  label: "Field Visits",              icon: <Camera size={13} />, mandatory: false },
  { id: "assessment",  label: "Assessment & Recommendation", icon: <ShieldCheck size={13} />, mandatory: true },
] as const;
type SectionId = typeof SECTIONS[number]["id"];

/* ─── Atoms ──────────────────────────────────────────────────────────────── */
const AIBadge = () => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    ...f, fontSize: "var(--text-xs)", fontWeight: 600,
    color: "var(--info-600)", background: "var(--info-50)",
    border: "1px solid var(--info-200)", borderRadius: 100,
    padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0,
  }}>
    <Sparkles size={10} /> AI Generated
  </span>
);

const StatusChip: React.FC<{ status: RemarkStatus }> = ({ status }) => {
  const map = {
    pending:  { label: "Pending",  bg: "var(--warning-50)",          color: "var(--warning-700)",     border: "var(--warning-200)" },
    flagged:  { label: "Flagged",  bg: "rgba(226,51,24,0.08)",        color: "var(--destructive-600)", border: "var(--destructive-200)" },
    approved: { label: "Approved", bg: "var(--success-50)",           color: "var(--success-700)",     border: "var(--success-200)" },
  };
  const { label, bg, color, border } = map[status];
  return (
    <span style={{
      ...f, fontSize: "var(--text-xs)", fontWeight: 600, color,
      background: bg, border: `1px solid ${border}`,
      borderRadius: 100, padding: "2px 8px", whiteSpace: "nowrap",
    }}>{label}</span>
  );
};

const Trend: React.FC<{ d: "up" | "down" | "flat"; good?: "up" | "down" }> = ({ d, good = "up" }) => {
  const pos = d === "flat" || d === good;
  const color = d === "flat" ? "var(--text-muted-themed)" : pos ? "var(--success-700)" : "var(--destructive-500)";
  if (d === "up") return <TrendingUp size={12} strokeWidth={2} style={{ color }} />;
  if (d === "down") return <TrendingDown size={12} strokeWidth={2} style={{ color }} />;
  return <Minus size={12} strokeWidth={2} style={{ color }} />;
};

/* ─── KV Grid Item ──────────────────────────────────────────────────────── */
const KV: React.FC<{ label: string; value: React.ReactNode; wide?: boolean }> = ({ label, value, wide }) => (
  <div style={{ gridColumn: wide ? "span 2" : "span 1", display: "flex", flexDirection: "column", gap: 2 }}>
    <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", fontWeight: 500 }}>{label}</span>
    <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", lineHeight: "140%" }}>{value}</span>
  </div>
);

const Badge: React.FC<{ color: string; bg: string; border: string; children: React.ReactNode }> = ({ color, bg, border, children }) => (
  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color, background: bg, border: `1px solid ${border}`, borderRadius: 100, padding: "2px 9px", whiteSpace: "nowrap" }}>
    {children}
  </span>
);

/* ─── Section Block ─────────────────────────────────────────────────────── */
const SectionBlock: React.FC<{
  id: SectionId; title: string; icon?: React.ReactNode; children: React.ReactNode;
  remarks: SectionRemark[];
  mandatory?: boolean;
  onAddRemark: (sid: string, text: string) => void;
  onStatusChange: (sid: string, rid: string, s: RemarkStatus) => void;
  onDeleteRemark: (sid: string, rid: string) => void;
  onDeleteSection?: (sid: string) => void;
}> = ({ id, title, icon, children, remarks, mandatory, onAddRemark, onStatusChange, onDeleteRemark, onDeleteSection }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (open && ref.current) ref.current.focus(); }, [open]);

  const submit = () => {
    if (!draft.trim()) return;
    onAddRemark(id, draft.trim());
    setDraft("");
    setOpen(false);
  };

  return (
    <div
      id={`cam-section-${id}`}
      style={{
        border: "1px solid var(--border-subtle)", borderRadius: 10,
        backgroundColor: "var(--neutral-0)", overflow: "hidden",
        flexShrink: 0, marginBottom: 14,
      }}
    >
      {/* Header */}
      <div style={{
        padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      }}>
        {icon && <span style={{ color: "var(--text-muted-themed)", flexShrink: 0 }}>{icon}</span>}
        <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)", flex: 1, minWidth: 100 }}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {remarks.length > 0 && (
            <span style={{
              ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--primary)",
              background: "rgba(23,102,214,0.10)", border: "1px solid rgba(23,102,214,0.20)",
              borderRadius: 100, padding: "2px 8px", whiteSpace: "nowrap",
            }}>
              {remarks.length} remark{remarks.length > 1 ? "s" : ""}
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen(p => !p)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              ...f, fontSize: "var(--text-sm)", fontWeight: 600,
              color: open ? "var(--primary)" : "var(--text-muted-themed)",
              background: open ? "rgba(23,102,214,0.08)" : "transparent",
              border: `1px solid ${open ? "rgba(23,102,214,0.30)" : "var(--border-subtle)"}`,
              borderRadius: 7, padding: "4px 9px", cursor: "pointer", flexShrink: 0,
            }}
          >
            <MessageSquarePlus size={12} strokeWidth={2} />
            Remark
          </button>
          {!mandatory && onDeleteSection && (
            <button
              type="button"
              onClick={() => onDeleteSection(id)}
              style={{
                width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-subtle)",
                background: "transparent", color: "var(--text-muted-themed)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--destructive-500)"; e.currentTarget.style.borderColor = "var(--destructive-200)"; e.currentTarget.style.background = "var(--destructive-50)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted-themed)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.background = "transparent"; }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px" }}>{children}</div>

      {/* Remarks */}
      <AnimatePresence>
        {(remarks.length > 0 || open) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--neutral-50)" }}>
              {remarks.length > 0 && (
                <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {remarks.map(r => (
                    <div key={r.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(23,102,214,0.12)", border: "1px solid rgba(23,102,214,0.20)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <User size={11} style={{ color: "var(--primary)" }} />
                      </div>
                      <div style={{
                        flex: 1, minWidth: 0, background: "var(--neutral-0)",
                        border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "8px 11px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>Underwriter</span>
                          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{r.timestamp}</span>
                          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                            <StatusChip status={r.status} />
                            {r.status !== "approved" && (
                              <button type="button" onClick={() => onStatusChange(id, r.id, "approved")}
                                style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid var(--border-subtle)", background: "transparent", cursor: "pointer", color: "var(--success-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCheck size={10} />
                              </button>
                            )}
                            {r.status !== "flagged" && (
                              <button type="button" onClick={() => onStatusChange(id, r.id, "flagged")}
                                style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid var(--border-subtle)", background: "transparent", cursor: "pointer", color: "var(--destructive-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Flag size={10} />
                              </button>
                            )}
                            <button type="button" onClick={() => onDeleteRemark(id, r.id)}
                              style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid var(--border-subtle)", background: "transparent", cursor: "pointer", color: "var(--text-muted-themed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <X size={10} />
                            </button>
                          </div>
                        </div>
                        <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "160%", margin: 0 }}>{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14 }}
                    style={{ padding: remarks.length > 0 ? "0 16px 12px" : "12px 16px", display: "flex", gap: 8, alignItems: "flex-start" }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: "rgba(23,102,214,0.12)", border: "1px solid rgba(23,102,214,0.20)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                    }}>
                      <User size={11} style={{ color: "var(--primary)" }} />
                    </div>
                    <div style={{
                      flex: 1, minWidth: 0,
                      border: "1px solid rgba(23,102,214,0.40)",
                      borderRadius: 8, overflow: "hidden", background: "var(--neutral-0)",
                    }}>
                      <textarea
                        ref={ref}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
                        placeholder="Add your remark on this section…"
                        rows={3}
                        style={{
                          ...f, width: "100%", resize: "none", border: "none", outline: "none",
                          padding: "8px 11px", fontSize: "var(--text-sm)", color: "var(--text-body)",
                          background: "transparent", lineHeight: "160%", boxSizing: "border-box",
                        }}
                      />
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "5px 10px", borderTop: "1px solid var(--border-subtle)", background: "var(--neutral-50)",
                      }}>
                        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>⌘ + Enter to submit</span>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button type="button" onClick={() => { setOpen(false); setDraft(""); }}
                            style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-muted-themed)", background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>
                            Cancel
                          </button>
                          <button type="button" onClick={submit} disabled={!draft.trim()}
                            style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--neutral-0)", background: draft.trim() ? "var(--primary)" : "rgba(23,102,214,0.40)", border: "none", borderRadius: 6, padding: "3px 12px", cursor: draft.trim() ? "pointer" : "default", display: "flex", alignItems: "center", gap: 4 }}>
                            <Send size={10} /> Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Section Content Components ─────────────────────────────────────────── */

const ExecutiveSummaryContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const { camDraft } = entry.detail;
  const execSection = camDraft.sections.find(s => s.title === "Borrower Overview") ?? camDraft.sections[0];
  const riskSection = camDraft.sections.find(s => s.title === "Risk Assessment") ?? camDraft.sections[2];

  return (
    <div>
      <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "170%", margin: "0 0 10px" }}>
        {execSection?.content}
      </p>
      {riskSection && (
        <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "170%", margin: 0 }}>
          The overall credit profile is assessed as <strong style={{ color: "var(--text-heading)" }}>{camDraft.recommendation}</strong>.{" "}
          {riskSection.content.slice(0, 180)}…
        </p>
      )}
    </div>
  );
};

const BorrowerProfileContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const d = entry.detail;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Company Details */}
      <div>
        <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 12 }}>
          Company Details
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 20px" }}>
          <KV label="CIN" value={d.cin} />
          <KV label="PAN" value={
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {d.pan ?? "—"}
              {d.pan && (
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--success-700)", background: "var(--success-50)", border: "1px solid var(--success-200)", borderRadius: 100, padding: "1px 7px" }}>✓</span>
              )}
            </span>
          } />
          <KV label="Status" value={
            <Badge color="var(--success-700)" bg="var(--success-50)" border="var(--success-200)">Active</Badge>
          } />
          <KV label="Classification" value={d.entityType ?? "Private Limited"} />
          <KV label="Incorporation Date" value={
            new Date(d.incorporationDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          } />
          <KV label="Company Vintage" value={`${Math.floor((Date.now() - new Date(d.incorporationDate).getTime()) / (365.25 * 24 * 3600 * 1000))} Years`} />
          <KV label="Active Compliance" value={
            <Badge color="var(--success-700)" bg="var(--success-50)" border="var(--success-200)">Compliant</Badge>
          } />
          <KV
            label="Address"
            value={<span style={{ fontWeight: 500, color: "var(--text-body)", fontSize: "var(--text-xs)" }}>{d.registeredAddress}</span>}
            wide
          />
        </div>
      </div>

      {/* Contact Details */}
      <div>
        <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 12 }}>
          Contact Details
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 20px" }}>
          <KV label="Website" value={
            <a href="#" style={{ ...f, fontSize: "var(--text-sm)", color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>www.company.com</a>
          } />
          <KV label="Primary Email" value={
            <a href="#" style={{ ...f, fontSize: "var(--text-sm)", color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>contact@company.com</a>
          } />
          <KV label="Primary Phone" value="+91 98765 43210" />
        </div>
      </div>

      {/* LEI Details */}
      <div>
        <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 12 }}>
          LEI Details
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 20px" }}>
          <KV label="LEI Number" value="www.company.com" />
          <KV label="LEI Status" value="contact@company.com" />
          <KV label="Registration Date" value="01-Jan-2022" />
          <KV label="Last Updated Date" value="01-Jan-2023" />
          <KV label="Next Renewal Date" value="01-Jan-2024" />
        </div>
      </div>
    </div>
  );
};

const FinancialAnalysisContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const financials = entry.detail.yearlyFinancials ?? [];
  const sorted = [...financials].sort((a, b) => a.year - b.year);

  const years = sorted.map(f => f.year);
  const y0 = sorted[sorted.length - 3];
  const y1 = sorted[sorted.length - 2];
  const y2 = sorted[sorted.length - 1];

  const pct = (a?: number, b?: number) => {
    if (!a || !b || b === 0) return null;
    const p = ((a - b) / Math.abs(b)) * 100;
    return p;
  };

  const PctBadge: React.FC<{ val: number | null; good?: "up" | "down" }> = ({ val, good = "up" }) => {
    if (val === null) return null;
    const positive = good === "up" ? val > 0 : val < 0;
    return (
      <span style={{
        marginLeft: 6,
        ...f, fontSize: "var(--text-xs)", fontWeight: 700,
        color: positive ? "var(--success-700)" : "var(--destructive-600)",
        background: positive ? "var(--success-50)" : "rgba(226,51,24,0.08)",
        border: `1px solid ${positive ? "var(--success-200)" : "var(--destructive-200)"}`,
        borderRadius: 100, padding: "1px 7px",
      }}>
        {val > 0 ? "+" : ""}{val.toFixed(1)}%
      </span>
    );
  };

  const fmt = (v?: number): string => {
    if (v === undefined || v === null) return "—";
    const abs = Math.abs(v);
    if (abs >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
    return `₹${v.toLocaleString("en-IN")}`;
  };

  const finRows = [
    { label: "Revenue", v0: y0?.revenue, v1: y1?.revenue, v2: y2?.revenue },
    { label: "EBITDA",  v0: y0?.ebitda,  v1: y1?.ebitda,  v2: y2?.ebitda },
    { label: "PAT",     v0: y0?.netProfit, v1: y1?.netProfit, v2: y2?.netProfit },
    { label: "Net Worth", v0: undefined, v1: undefined, v2: undefined },
    { label: "Total Debt", v0: y0?.totalDebt, v1: y1?.totalDebt, v2: y2?.totalDebt },
  ];

  const finSection = entry.detail.camDraft.sections.find(s => s.title === "Financial Assessment");

  return (
    <div>
      {finSection && (
        <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "170%", margin: "0 0 14px" }}>
          {finSection.content}
        </p>
      )}
      <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>
        Key Financial Ratios
      </span>
      <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--neutral-50)", borderBottom: "1px solid var(--border-subtle)" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Field</th>
              {y0 && <th style={{ padding: "8px 12px", textAlign: "right", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.05em" }}>FY {y0.year}</th>}
              {y1 && <th style={{ padding: "8px 12px", textAlign: "right", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.05em" }}>FY {y1.year}</th>}
              {y2 && <th style={{ padding: "8px 12px", textAlign: "right", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.05em" }}>FY {y2.year}</th>}
            </tr>
          </thead>
          <tbody>
            {finRows.map(({ label, v0, v1, v2 }, i) => {
              const yoy = pct(v2, v1);
              return (
                <tr key={label} style={{ borderBottom: i < finRows.length - 1 ? "1px solid var(--border-subtle)" : undefined }}>
                  <td style={{ padding: "9px 12px", ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", fontWeight: 500 }}>{label}</td>
                  {y0 && <td style={{ padding: "9px 12px", textAlign: "right", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>{fmt(v0)}</td>}
                  {y1 && <td style={{ padding: "9px 12px", textAlign: "right", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>{fmt(v1)}</td>}
                  {y2 && (
                    <td style={{ padding: "9px 12px", textAlign: "right", ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, flexWrap: "wrap" }}>
                        {fmt(v2)}
                        {yoy !== null && <PctBadge val={yoy} good={label === "Total Debt" ? "down" : "up"} />}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MacroAnalysisContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const industry = entry.industry;
  const tailwinds = [
    "PLI Scheme for the sector drawing ₹10,000+ Cr investment through FY26",
    "Strong domestic demand — growing organised penetration in Tier 2/3 cities",
    "Favourable policy environment and infrastructure investment push",
    "Depreciation of INR making exports more competitive globally",
  ];
  const headwinds = [
    "Input cost volatility squeezing raw material margins",
    "Export slowdown due to weaker global consumer demand",
    "Regulatory uncertainty and compliance overhead for MSMEs",
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>{industry}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-muted-themed)" }}>Sector Sentiment</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--warning-700)", background: "var(--warning-50)", border: "1px solid var(--warning-200)", borderRadius: 100, padding: "2px 9px" }}>
              <AlertTriangle size={10} /> Cautious
            </span>
          </div>
        </div>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", background: "var(--neutral-50)", border: "1px solid var(--border-subtle)", borderRadius: 6, padding: "3px 8px" }}>
          Secondary Research · Industry Reports
        </span>
      </div>

      {/* Macro stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Industry CAGR (FY24–27)", value: "8.5%",    sub: "Source: Industry Report" },
          { label: "RBI Repo Rate",            value: "6.50%",   sub: "Source: RBI Apr 2025" },
          { label: "Sector GDP Contribution",  value: "₹2.4 L Cr", sub: "Source: DPIIT FY24" },
          { label: "Manufacturing PMI",         value: "57.3",   sub: "Source: S&P Global Mar 2025" },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ padding: "12px 14px", border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--neutral-50)" }}>
            <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", display: "block", marginBottom: 4 }}>{label}</span>
            <span style={{ ...f, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>{value}</span>
            <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", display: "block", marginTop: 2 }}>{sub}</span>
          </div>
        ))}
      </div>

      {/* Tailwinds */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <ArrowUpRight size={14} style={{ color: "var(--success-700)" }} />
          <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--success-700)" }}>Tailwinds</span>
        </div>
        {tailwinds.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success-500)", flexShrink: 0, marginTop: 6 }} />
            <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "155%" }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Headwinds */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <AlertTriangle size={13} style={{ color: "var(--warning-700)" }} />
          <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--warning-700)" }}>Headwinds</span>
        </div>
        {headwinds.map((h, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--warning-600)", flexShrink: 0, marginTop: 6 }} />
            <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "155%" }}>{h}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MicroAnalysisContent: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "170%", margin: 0 }}>
        The business demonstrates a strong competitive position within its specific micro-market. Key operational metrics indicate efficient resource utilization and a stable customer base.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Market Share", value: "12% Local Market" },
          { label: "Customer Retention", value: "88% YoY" },
          { label: "Production Capacity", value: "85% Utilized" },
          { label: "Supply Chain", value: "Zero Disruptions" },
        ].map(({ label, value }) => (
          <div key={label} style={{ padding: "10px 12px", border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--neutral-50)" }}>
            <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", display: "block", marginBottom: 2 }}>{label}</span>
            <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FieldVisitContent: React.FC = () => {
  const [notes, setNotes] = useState(
    `Site visited on 14-Mar-2025 by Branch Credit Officer. Premises located at registered address — well-maintained with organised operations area.\n\nKey Observations:\n• Operations floor functional with staff present during visit; shift operations confirmed by attendance register\n• Raw material inventory stocked for ~30 days — consistent with reported working capital cycle\n• Management was well-informed about financials and demonstrated good operational knowledge\n• No adverse observations on infrastructure or documentation`
  );
  const [typing, setTyping] = useState(false);

  const handleAI = () => {
    setTyping(true);
    const addition = "\n\nOverall Assessment: The unit presents a satisfactory operational profile consistent with the financial data submitted. Physical infrastructure and management capability corroborate the borrower's stated business activity. No adverse observations noted during the visit.";
    let i = 0;
    const interval = setInterval(() => {
      if (i < addition.length) {
        setNotes(prev => prev + addition[i]);
        i++;
      } else {
        clearInterval(interval);
        setTyping(false);
      }
    }, 18);
  };

  return (
    <div>
      {/* Meta bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        {[
          { icon: <User size={11} />,     text: "Credit Officer (BCO)" },
          { icon: <Calendar size={11} />, text: "14 Mar 2025" },
          { icon: <MapPin size={11} />,   text: "Registered Address" },
        ].map(({ icon, text }, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>
            {icon} {text}
          </span>
        ))}
        <button type="button" onClick={handleAI} disabled={typing}
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--primary)", background: "rgba(23,102,214,0.05)", border: "1px solid rgba(23,102,214,0.20)", borderRadius: 6, padding: "4px 10px", cursor: typing ? "default" : "pointer" }}>
          {typing ? (
            <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ display: "inline-block" }}>✦</motion.span> Writing…</>
          ) : (
            <><Sparkles size={11} /> AI Complete</>
          )}
        </button>
      </div>

      <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--neutral-50)", overflow: "hidden" }}>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={10}
          style={{ ...f, width: "100%", resize: "vertical", border: "none", outline: "none", padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--text-body)", background: "transparent", lineHeight: "185%", boxSizing: "border-box", fontStyle: "italic" }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", borderTop: "1px solid var(--border-subtle)", background: "var(--neutral-100)" }}>
          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>
            {notes.split(/\s+/).filter(Boolean).length} words · Editable by underwriter
          </span>
          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", fontWeight: 500 }}>Field Visit — Primary Research</span>
        </div>
      </div>
    </div>
  );
};

const AssessmentContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const { camDraft } = entry.detail;
  const recSection = camDraft.sections.find(s => s.title === "Recommendation") ?? camDraft.sections[camDraft.sections.length - 1];

  const isReject = camDraft.recommendation === "Reject";
  const isApprove = camDraft.recommendation === "Approve";
  const isConditional = !isReject && !isApprove;

  const recColor = isApprove ? "var(--success-700)" : isReject ? "var(--destructive-600)" : "var(--warning-700)";
  const recBg    = isApprove ? "var(--success-50)"  : isReject ? "rgba(226,51,24,0.08)"  : "var(--warning-50)";
  const recBorder= isApprove ? "var(--success-200)" : isReject ? "var(--destructive-200)": "var(--warning-200)";

  const riskFlags = [
    ...entry.detail.financialParameters
      .filter(p => p.flagged && p.priority <= 2)
      .slice(0, 3)
      .map(p => ({
        level: "high" as const,
        label: p.name,
        desc: p.aiCommentary ?? "",
      })),
    ...entry.detail.complianceChecks
      .filter(c => c.status === "Clear")
      .slice(0, 2)
      .map(c => ({
        level: "low" as const,
        label: c.label,
        desc: `Status: ${c.status}. Source: ${c.source}.`,
      })),
  ];

  return (
    <div>
      {/* Decision banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
        borderRadius: 8, background: recBg, border: `1px solid ${recBorder}`, marginBottom: 16,
      }}>
        {isApprove
          ? <CheckCircle2 size={18} style={{ color: recColor, flexShrink: 0 }} />
          : isReject
          ? <AlertTriangle size={18} style={{ color: recColor, flexShrink: 0 }} />
          : <Info size={18} style={{ color: recColor, flexShrink: 0 }} />}
        <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: recColor }}>
          {camDraft.recommendation} — Subject to Conditions Below
        </span>
      </div>

      {/* Risk flags */}
      {riskFlags.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>Risk Summary</span>
          {riskFlags.map((flag, i) => {
            const colors = {
              high:   { color: "var(--destructive-600)", bg: "rgba(226,51,24,0.08)", border: "var(--destructive-200)", icon: <AlertTriangle size={13} /> },
              medium: { color: "var(--warning-700)",     bg: "var(--warning-50)",    border: "var(--warning-200)",    icon: <Info size={13} /> },
              low:    { color: "var(--success-700)",     bg: "var(--success-50)",    border: "var(--success-200)",    icon: <CheckCircle2 size={13} /> },
            }[flag.level];
            return (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 8, background: colors.bg, border: `1px solid ${colors.border}`, marginBottom: 8 }}>
                <span style={{ color: colors.color, marginTop: 1, flexShrink: 0 }}>{colors.icon}</span>
                <div>
                  <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: colors.color, display: "block" }}>{flag.label}</span>
                  <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-body)", lineHeight: "155%", display: "block", marginTop: 2 }}>{flag.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recommendation text */}
      {recSection && (
        <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "170%", margin: "0 0 12px" }}>
          {recSection.content}
        </p>
      )}

      {/* Conditions */}
      {camDraft.conditions && camDraft.conditions.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>Conditions</span>
          {camDraft.conditions.map((cond, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: i < camDraft.conditions!.length - 1 ? "1px solid var(--border-subtle)" : undefined }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid var(--border-subtle)", background: "var(--neutral-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)" }}>{i + 1}</span>
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "160%" }}>{cond}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main CAM Draft Tab ────────────────────────────────────────────────── */
export const CAMDraftTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const [remarks, setRemarks] = useState<Record<string, SectionRemark[]>>({});
  const [activeSection, setActiveSection] = useState<SectionId>("executive");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "done">("idle");
  const [addedSections, setAddedSections] = useState<Set<SectionId>>(new Set(SECTIONS.filter(s => s.mandatory).map(s => s.id)));

  const contentRef = useRef<HTMLDivElement>(null);

  const addRemark = (sid: string, text: string) => {
    const now = new Date();
    const ts = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + ", " + now.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    setRemarks(p => ({ ...p, [sid]: [...(p[sid] ?? []), { id: `r-${Date.now()}`, text, status: "pending", timestamp: ts }] }));
  };
  const changeStatus = (sid: string, rid: string, status: RemarkStatus) =>
    setRemarks(p => ({ ...p, [sid]: (p[sid] ?? []).map(r => r.id === rid ? { ...r, status } : r) }));
  const deleteRemark = (sid: string, rid: string) =>
    setRemarks(p => ({ ...p, [sid]: (p[sid] ?? []).filter(r => r.id !== rid) }));

  const deleteSection = (sid: SectionId) => {
    setAddedSections(prev => {
      const next = new Set(prev);
      next.delete(sid);
      return next;
    });
    // If deleted active, move to executive
    if (activeSection === sid) setActiveSection("executive");
  };

  const sProps = (id: SectionId) => ({ 
    id, 
    remarks: remarks[id] ?? [], 
    mandatory: SECTIONS.find(s => s.id === id)?.mandatory,
    onAddRemark: addRemark, 
    onStatusChange: changeStatus, 
    onDeleteRemark: deleteRemark,
    onDeleteSection: deleteSection as (sid: string) => void,
  });

  const scrollTo = useCallback((id: SectionId) => {
    setActiveSection(id);
    const el = document.getElementById(`cam-section-${id}`);
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      for (const sec of [...SECTIONS].reverse()) {
        const dom = document.getElementById(`cam-section-${sec.id}`);
        if (dom && dom.offsetTop - 80 <= el.scrollTop) {
          setActiveSection(sec.id);
          break;
        }
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const totalRemarks = Object.values(remarks).flat().length;
  const flagged = Object.values(remarks).flat().filter(r => r.status === "flagged").length;

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

      {/* ─── Left sidebar ──────────────────────────────────────────────── */}
      <div style={{
        width: 200, flexShrink: 0, backgroundColor: "var(--neutral-0)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "14px 12px 10px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Sections</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {SECTIONS.map(sec => {
            const added = addedSections.has(sec.id);
            const active = added && activeSection === sec.id;
            const hasRemark = (remarks[sec.id] ?? []).length > 0;
            
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  if (added) {
                    scrollTo(sec.id);
                  } else {
                    setAddedSections(prev => new Set([...prev, sec.id]));
                    setTimeout(() => scrollTo(sec.id), 50);
                  }
                }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                  background: active ? "rgba(23,102,214,0.08)" : "transparent",
                  borderLeft: `2.5px solid ${active ? "var(--primary)" : "transparent"}`,
                  border: "none", cursor: "pointer", textAlign: "left",
                  transition: "all 0.18s ease",
                  opacity: added ? 1 : 0.55,
                }}
                onMouseEnter={e => { 
                  if (added && !active) (e.currentTarget as HTMLButtonElement).style.background = "var(--neutral-50)"; 
                  if (!added) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
                }}
                onMouseLeave={e => { 
                  if (added && !active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; 
                  if (!added) (e.currentTarget as HTMLButtonElement).style.opacity = "0.55";
                }}
              >
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ 
                    ...f, fontSize: "var(--text-sm)", 
                    fontWeight: active ? 600 : 500, 
                    color: active ? "var(--primary)" : "var(--text-body)", 
                    lineHeight: "135%" 
                  }}>
                    {sec.label}
                  </span>
                  {!added && (
                    <div style={{ 
                      width: 18, height: 18, borderRadius: "50%", 
                      border: "1px solid var(--border-subtle)", 
                      background: "var(--neutral-0)", 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--text-muted-themed)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                      transition: "all 0.15s ease",
                    }}>
                      <Plus size={10} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                {hasRemark && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Main content ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* AI draft banner */}
        <div style={{
          flexShrink: 0, padding: "8px 20px",
          background: "var(--info-50)", borderBottom: "1px solid var(--info-200)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Sparkles size={13} style={{ color: "var(--info-600)" }} />
          <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--info-800)", flex: 1 }}>
            AI-Generated Draft — Review Before Submission
          </span>
        </div>

        {/* Scrollable sections */}
        <div
          ref={contentRef}
          style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "18px 22px 100px" }}
        >
          <SectionBlock title="Executive Summary" icon={<FileText size={14} />} {...sProps("executive")}>
            <ExecutiveSummaryContent entry={entry} />
          </SectionBlock>

          <SectionBlock title="Borrower Profile" icon={<Building2 size={14} />} {...sProps("borrower")}>
            <BorrowerProfileContent entry={entry} />
          </SectionBlock>

          <SectionBlock title="Financial Analysis" icon={<BarChart3 size={14} />} {...sProps("financials")}>
            <FinancialAnalysisContent entry={entry} />
          </SectionBlock>

          {addedSections.has("macro") && (
            <SectionBlock title="Macro Analysis" icon={<Globe size={14} />} {...sProps("macro")}>
              <MacroAnalysisContent entry={entry} />
            </SectionBlock>
          )}

          {addedSections.has("micro") && (
            <SectionBlock title="Micro Analysis" icon={<TrendingUp size={14} />} {...sProps("micro")}>
              <MicroAnalysisContent />
            </SectionBlock>
          )}

          {addedSections.has("fieldvisit") && (
            <SectionBlock title="Field Visits" icon={<Camera size={14} />} {...sProps("fieldvisit")}>
              <FieldVisitContent />
            </SectionBlock>
          )}

          <SectionBlock title="Assessment & Recommendation" icon={<ShieldCheck size={14} />} {...sProps("assessment")}>
            <AssessmentContent entry={entry} />
          </SectionBlock>
        </div>

        {/* Bottom bar */}
        <div style={{
          flexShrink: 0, borderTop: "1px solid var(--border-subtle)",
          backgroundColor: "var(--neutral-0)", padding: "10px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
        }}>
          <div>
            {totalRemarks > 0 ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6, ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>
                <MessageSquarePlus size={13} />
                <strong style={{ color: "var(--text-heading)" }}>{totalRemarks}</strong> remark{totalRemarks !== 1 ? "s" : ""} added
                {flagged > 0 && (
                  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--destructive-600)", background: "rgba(226,51,24,0.08)", border: "1px solid var(--destructive-200)", borderRadius: 100, padding: "2px 8px" }}>
                    {flagged} flagged
                  </span>
                )}
              </span>
            ) : (
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>
                Add section remarks before submitting for credit head review.
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", background: "var(--neutral-0)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "7px 16px", cursor: "pointer" }}>
              Save Draft
            </button>
            <AnimatePresence mode="wait">
              {submitState === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ display: "flex", alignItems: "center", gap: 6, ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--success-700)", background: "var(--success-50)", border: "1px solid var(--success-200)", borderRadius: 8, padding: "7px 16px" }}>
                  <CheckCircle2 size={13} /> Submitted for Review
                </motion.div>
              ) : (
                <motion.button key="submit" type="button"
                  onClick={() => { setSubmitState("loading"); setTimeout(() => setSubmitState("done"), 1600); }}
                  disabled={submitState === "loading"}
                  style={{ display: "flex", alignItems: "center", gap: 6, ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--neutral-0)", background: submitState === "loading" ? "rgba(23,102,214,0.60)" : "var(--primary)", border: "none", borderRadius: 8, padding: "7px 18px", cursor: submitState === "loading" ? "default" : "pointer" }}>
                  {submitState === "loading"
                    ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ display: "inline-block" }}>⟳</motion.span> Submitting…</>
                    : <><Send size={13} /> Submit for Review</>}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

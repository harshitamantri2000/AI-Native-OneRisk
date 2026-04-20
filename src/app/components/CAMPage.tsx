import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, ArrowLeft, Sparkles, MessageSquarePlus, CheckCircle2,
  AlertTriangle, TrendingUp, TrendingDown, Minus, Download, Send,
  FileText, Building2, BarChart3, ShieldCheck, ClipboardList, User,
  Calendar, MapPin, Hash, CheckCheck, X, Flag, Info, Globe, Camera,
  GripVertical, Plus, Layers, Users, Package, GitBranch,
  Zap, ArrowUpRight,
} from "lucide-react";

const f: React.CSSProperties = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" };

const CASE_META = {
  id: "CASE-10247", entity: "Sunrise Textiles Pvt Ltd", cin: "U17100MH2011PTC218943",
  pan: "AAJCS4821K", amount: "₹4.2 Cr", analyst: "Priya Nair", date: "2 Apr 2026",
};

type RemarkStatus = "pending" | "flagged" | "approved";
interface SectionRemark { id: string; text: string; status: RemarkStatus; timestamp: string; }

/* ══ WIDGET REGISTRY ══ */
type WidgetId = "macro" | "fieldvisit" | "keyperson" | "collateral" | "peer" | "stress";
interface WidgetMeta { id: WidgetId; label: string; desc: string; icon: React.ReactNode; }

const WIDGET_REGISTRY: WidgetMeta[] = [
  { id: "macro", label: "Macro Analysis", desc: "Sector outlook, macro data points, tailwinds & headwinds", icon: <Globe size={16} /> },
  { id: "fieldvisit", label: "Field Visit Notes", desc: "Site visit observations and AI-assisted writeup", icon: <Camera size={16} /> },
  { id: "keyperson", label: "Key Person Risk", desc: "Promoter dependency and succession assessment", icon: <Users size={16} /> },
  { id: "collateral", label: "Collateral Details", desc: "Property valuation, LTV and title details", icon: <Package size={16} /> },
  { id: "peer", label: "Peer Comparison", desc: "Side-by-side ratio comparison with industry peers", icon: <GitBranch size={16} /> },
  { id: "stress", label: "Stress Test", desc: "Revenue decline and rate hike scenario analysis", icon: <Zap size={16} /> },
];

const FIXED_SECTIONS = [
  { id: "executive", label: "Executive Summary", icon: <FileText size={14} /> },
  { id: "borrower", label: "Borrower Profile", icon: <Building2 size={14} /> },
  { id: "financials", label: "Financial Analysis", icon: <BarChart3 size={14} /> },
  { id: "assessment", label: "Assessment & Recommendation", icon: <ShieldCheck size={14} /> },
  { id: "conditions", label: "Conditions & Covenants", icon: <ClipboardList size={14} /> },
];

/* ══ SMALL ATOMS ══ */
const StatusChip: React.FC<{ status: RemarkStatus }> = ({ status }) => {
  const map = {
    pending: { label: "Pending", bg: "var(--warning-50)", color: "var(--warning-700)", border: "var(--warning-200)" },
    flagged: { label: "Flagged", bg: "rgba(226,51,24,0.08)", color: "var(--destructive-600)", border: "var(--destructive-200)" },
    approved: { label: "Approved", bg: "var(--success-50)", color: "var(--success-700)", border: "var(--success-200)" },
  };
  const { label, bg, color, border } = map[status];
  return <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color, background: bg, border: `1px solid ${border}`, borderRadius: 100, padding: "2px 8px", whiteSpace: "nowrap" }}>{label}</span>;
};

const AIBadge = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--info-600)", background: "var(--info-50)", border: "1px solid var(--info-200)", borderRadius: 100, padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>
    <Sparkles size={10} /> AI Generated
  </span>
);

const Trend: React.FC<{ d: "up" | "down" | "flat"; good?: "up" | "down" }> = ({ d, good = "up" }) => {
  const pos = d === "flat" || d === good;
  const color = d === "flat" ? "var(--text-muted-themed)" : pos ? "var(--success-700)" : "var(--destructive-500)";
  if (d === "up") return <TrendingUp size={13} strokeWidth={2} style={{ color }} />;
  if (d === "down") return <TrendingDown size={13} strokeWidth={2} style={{ color }} />;
  return <Minus size={13} strokeWidth={2} style={{ color }} />;
};

const Para: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ ...f, fontSize: "var(--text-base)", color: "var(--text-body)", lineHeight: "170%", margin: "0 0 10px" }}>{children}</p>
);

const KVRow: React.FC<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
    <span style={{ display: "flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", minWidth: 140, flexShrink: 0 }}>{icon}{label}</span>
    <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-heading)", flex: 1, minWidth: 0, wordBreak: "break-word" }}>{value}</span>
  </div>
);

const StatCard: React.FC<{ label: string; value: string; sub?: string; accent?: boolean }> = ({ label, value, sub, accent }) => (
  <div style={{ flex: "1 1 130px", minWidth: 130, padding: "12px 14px", border: `1px solid ${accent ? "rgba(23,102,214,0.25)" : "var(--border-subtle)"}`, borderRadius: 8, background: accent ? "rgba(23,102,214,0.05)" : "var(--neutral-50)" }}>
    <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</span>
    <span style={{ ...f, fontSize: "var(--text-md)", fontWeight: 700, color: accent ? "var(--primary)" : "var(--text-heading)", display: "block" }}>{value}</span>
    {sub && <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", marginTop: 2, display: "block" }}>{sub}</span>}
  </div>
);

const RatioRow: React.FC<{ label: string; fy23: string; fy24: string; fy25: string; trend: "up" | "down" | "flat"; good?: "up" | "down"; flag?: string }> = ({ label, fy23, fy24, fy25, trend, good, flag }) => (
  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
    <td style={{ padding: "9px 12px", ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", fontWeight: 500 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>{label}{flag && <span title={flag} style={{ color: "var(--warning-600)", cursor: "help", display: "inline-flex" }}><AlertTriangle size={11} /></span>}</span>
    </td>
    <td style={{ padding: "9px 12px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{fy23}</td>
    <td style={{ padding: "9px 12px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{fy24}</td>
    <td style={{ padding: "9px 12px", ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", textAlign: "right" }}>{fy25}</td>
    <td style={{ padding: "9px 12px", textAlign: "center" }}><Trend d={trend} good={good} /></td>
  </tr>
);

const CondItem: React.FC<{ i: number; text: string }> = ({ i, text }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid var(--border-subtle)" }}>
    <span style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid var(--border-subtle)", background: "var(--neutral-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)" }}>{i}</span>
    <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "160%" }}>{text}</span>
  </div>
);

const RiskFlag: React.FC<{ level: "high" | "medium" | "low"; label: string; desc: string }> = ({ level, label, desc }) => {
  const map = {
    high: { color: "var(--destructive-600)", bg: "rgba(226,51,24,0.08)", border: "var(--destructive-200)", icon: <AlertTriangle size={13} /> },
    medium: { color: "var(--warning-700)", bg: "var(--warning-50)", border: "var(--warning-200)", icon: <Info size={13} /> },
    low: { color: "var(--success-700)", bg: "var(--success-50)", border: "var(--success-200)", icon: <CheckCircle2 size={13} /> },
  };
  const { color, bg, border, icon } = map[level];
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 8, background: bg, border: `1px solid ${border}`, marginBottom: 8 }}>
      <span style={{ color, marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <div><span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color, display: "block" }}>{label}</span>
        <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "155%", display: "block", marginTop: 2 }}>{desc}</span></div>
    </div>
  );
};

/* ══ SECTION BLOCK WRAPPER ══ */
const SectionBlock: React.FC<{
  id: string; title: string; icon?: React.ReactNode; children: React.ReactNode;
  remarks: SectionRemark[]; isWidget?: boolean; canRemove?: boolean; onRemove?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onAddRemark: (sid: string, text: string) => void;
  onStatusChange: (sid: string, rid: string, s: RemarkStatus) => void;
  onDeleteRemark: (sid: string, rid: string) => void;
}> = ({ id, title, icon, children, remarks, isWidget, canRemove, onRemove, dragHandleProps, onAddRemark, onStatusChange, onDeleteRemark }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (open && ref.current) ref.current.focus(); }, [open]);
  const submit = () => { if (!draft.trim()) return; onAddRemark(id, draft.trim()); setDraft(""); setOpen(false); };

  return (
    <div id={`section-${id}`} style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, backgroundColor: "var(--neutral-0)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "13px 16px 11px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {isWidget && (
          <div {...dragHandleProps} style={{ cursor: "grab", color: "var(--text-muted-themed)", display: "flex", alignItems: "center", flexShrink: 0, touchAction: "none" }}>
            <GripVertical size={15} strokeWidth={1.5} />
          </div>
        )}
        {icon && <span style={{ color: "var(--text-muted-themed)", flexShrink: 0 }}>{icon}</span>}
        <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)", flex: 1, minWidth: 100 }}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          <AIBadge />
          {remarks.length > 0 && (
            <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--primary)", background: "rgba(23,102,214,0.10)", border: "1px solid rgba(23,102,214,0.20)", borderRadius: 100, padding: "2px 8px", whiteSpace: "nowrap" }}>
              {remarks.length} remark{remarks.length > 1 ? "s" : ""}
            </span>
          )}
          <button type="button" onClick={() => setOpen(p => !p)}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: open ? "var(--primary)" : "var(--text-muted-themed)", background: open ? "rgba(23,102,214,0.08)" : "transparent", border: `1px solid ${open ? "rgba(23,102,214,0.30)" : "var(--border-subtle)"}`, borderRadius: 7, padding: "4px 9px", cursor: "pointer", flexShrink: 0 }}>
            <MessageSquarePlus size={12} strokeWidth={2} /> Remark
          </button>
          {canRemove && (
            <button type="button" onClick={onRemove} title="Remove widget"
              style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid var(--border-subtle)", background: "transparent", cursor: "pointer", color: "var(--text-muted-themed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "15px 16px" }}>{children}</div>

      {/* Remarks thread */}
      <AnimatePresence>
        {(remarks.length > 0 || open) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} style={{ overflow: "hidden" }}>
            <div style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--neutral-50)" }}>
              {remarks.length > 0 && (
                <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {remarks.map(r => (
                    <div key={r.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(23,102,214,0.12)", border: "1px solid rgba(23,102,214,0.20)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <User size={11} style={{ color: "var(--primary)" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, background: "var(--neutral-0)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "8px 11px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>Underwriter</span>
                          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{r.timestamp}</span>
                          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                            <StatusChip status={r.status} />
                            {r.status !== "approved" && (
                              <button type="button" onClick={() => onStatusChange(id, r.id, "approved")} style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid var(--border-subtle)", background: "transparent", cursor: "pointer", color: "var(--success-700)", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCheck size={10} /></button>
                            )}
                            {r.status !== "flagged" && (
                              <button type="button" onClick={() => onStatusChange(id, r.id, "flagged")} style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid var(--border-subtle)", background: "transparent", cursor: "pointer", color: "var(--destructive-500)", display: "flex", alignItems: "center", justifyContent: "center" }}><Flag size={10} /></button>
                            )}
                            <button type="button" onClick={() => onDeleteRemark(id, r.id)} style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid var(--border-subtle)", background: "transparent", cursor: "pointer", color: "var(--text-muted-themed)", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={10} /></button>
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
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.14 }}
                    style={{ padding: remarks.length > 0 ? "0 16px 12px" : "12px 16px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(23,102,214,0.12)", border: "1px solid rgba(23,102,214,0.20)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <User size={11} style={{ color: "var(--primary)" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, border: "1px solid rgba(23,102,214,0.40)", borderRadius: 8, overflow: "hidden", background: "var(--neutral-0)" }}>
                      <textarea ref={ref} value={draft} onChange={e => setDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
                        placeholder="Add your remark on this section…" rows={3}
                        style={{ ...f, width: "100%", resize: "none", border: "none", outline: "none", padding: "8px 11px", fontSize: "var(--text-sm)", color: "var(--text-body)", background: "transparent", lineHeight: "160%", boxSizing: "border-box" }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px", borderTop: "1px solid var(--border-subtle)", background: "var(--neutral-50)" }}>
                        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>⌘ + Enter to submit</span>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button type="button" onClick={() => { setOpen(false); setDraft(""); }} style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-muted-themed)", background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Cancel</button>
                          <button type="button" onClick={submit} disabled={!draft.trim()} style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--neutral-0)", background: draft.trim() ? "var(--primary)" : "rgba(23,102,214,0.40)", border: "none", borderRadius: 6, padding: "3px 12px", cursor: draft.trim() ? "pointer" : "default", display: "flex", alignItems: "center", gap: 4 }}>
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

/* ══ WIDGET CONTENT COMPONENTS ══ */
const MacroWidget: React.FC = () => {
  const tailwinds = [
    "PLI Scheme for textiles drawing ₹10,683 Cr investment through FY26",
    "China+1 strategy — global buyers diversifying supply chains to Indian manufacturers",
    "Strong domestic apparel demand — growing organised retail penetration in Tier 2/3 cities",
    "Depreciation of INR making Indian textile exports more competitive globally",
  ];
  const headwinds = [
    "Cotton price volatility — MCX cotton futures up 18% YoY, squeezing raw material margins",
    "Export slowdown due to weaker EU/US consumer demand and inventory correction",
    "Power tariff hikes in Maharashtra impacting production costs for SME units",
  ];
  return (
    <div>
      {/* Source tag */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>Textiles — Cotton Yarn Segment</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-muted-themed)" }}>Sector Sentiment</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--success-700)", background: "var(--success-50)", border: "1px solid var(--success-200)", borderRadius: 100, padding: "2px 9px" }}>
              <ArrowUpRight size={11} /> Positive
            </span>
          </div>
        </div>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", background: "var(--neutral-50)", border: "1px solid var(--border-subtle)", borderRadius: 6, padding: "3px 8px" }}>
          Secondary Research · Ministry of Textiles / RBI
        </span>
      </div>

      {/* Macro stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Industry CAGR (FY24–27)", value: "11.2%", sub: "Source: Ministry of Textiles" },
          { label: "India Textile Export", value: "₹3.05 Lakh Cr", sub: "Source: AEPC FY24" },
          { label: "RBI Repo Rate", value: "6.50%", sub: "Source: RBI Apr 2025" },
          { label: "Manufacturing PMI", value: "58.4", sub: "Source: S&P Global Mar 2025" },
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

const FieldVisitWidget: React.FC = () => {
  const [notes, setNotes] = useState(`Site visited on 14-Mar-2025 by Branch Credit Officer (Ms. Priya Nair). Factory located at Plot 18, MIDC Bhiwandi, Thane — well-maintained premises with organised production floor.

Key Observations:
• Manufacturing unit operational with ~55 workers on floor during visit; 3-shift operation confirmed by attendance register
• Raw material inventory (cotton bales, yarn) stocked for ~40 days — consistent with reported working capital cycle
• Finished goods warehouse approximately 55% full; dispatch records show regular shipments to Gujarat buyers
• Ring spinning machines (12 units) and winding machines (8 units) observed — all in operational condition
• Electricity consumption records verified — consistent with reported production volumes
• Promoter (Ramesh Agarwal) present during visit; demonstrated thorough knowledge of operations and buyer relationships`);
  const [typing, setTyping] = useState(false);

  const handleAI = () => {
    setTyping(true);
    const addition = "\n\nOverall Assessment: The unit presents a satisfactory operational profile consistent with the financial data submitted. Physical infrastructure, workforce strength, and inventory levels corroborate the borrower's stated business activity. No adverse observations noted.";
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
          { icon: <User size={11} />, text: "Priya Nair (BCO)" },
          { icon: <Calendar size={11} />, text: "14 Mar 2025" },
          { icon: <MapPin size={11} />, text: "Plot 18, MIDC Bhiwandi" },
        ].map(({ icon, text }, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>{icon} {text}</span>
        ))}
        <button type="button" onClick={handleAI} disabled={typing}
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: typing ? "var(--info-600)" : "var(--info-600)", background: "var(--info-50)", border: "1px solid var(--info-200)", borderRadius: 6, padding: "4px 10px", cursor: typing ? "default" : "pointer" }}>
          {typing ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ display: "inline-block" }}>✦</motion.span> Writing…</> : <><Sparkles size={11} /> AI Complete</>}
        </button>
      </div>

      {/* Text area */}
      <div style={{ border: "1.5px dashed var(--info-400)", borderRadius: 8, background: "rgba(92,212,230,0.03)", overflow: "hidden" }}>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)}
          rows={12}
          style={{ ...f, width: "100%", resize: "vertical", border: "none", outline: "none", padding: "14px 16px", fontSize: "var(--text-sm)", color: "var(--info-800)", background: "transparent", lineHeight: "185%", boxSizing: "border-box", fontStyle: "italic" }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", borderTop: "1px solid var(--info-200)", background: "rgba(92,212,230,0.06)" }}>
          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--info-600)" }}>
            {notes.split(/\s+/).filter(Boolean).length} words · Editable by underwriter
          </span>
          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--info-600)", fontWeight: 500 }}>Field Visit — Primary Research</span>
        </div>
      </div>
    </div>
  );
};

const KeyPersonWidget: React.FC = () => (
  <div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
      {[
        { label: "Promoter Dependency", value: "High", color: "var(--destructive-600)", bg: "rgba(226,51,24,0.08)", border: "var(--destructive-200)" },
        { label: "Succession Plan", value: "Partial", color: "var(--warning-700)", bg: "var(--warning-50)", border: "var(--warning-200)" },
        { label: "Life Insurance Cover", value: "₹2.0 Cr", color: "var(--success-700)", bg: "var(--success-50)", border: "var(--success-200)" },
      ].map(({ label, value, color, bg, border }) => (
        <div key={label} style={{ flex: "1 1 120px", padding: "10px 14px", background: bg, border: `1px solid ${border}`, borderRadius: 8 }}>
          <span style={{ ...f, fontSize: "var(--text-xs)", color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>{label}</span>
          <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color, display: "block" }}>{value}</span>
        </div>
      ))}
    </div>
    <KVRow label="Key Person" value="Ramesh Agarwal (Promoter Director)" icon={<User size={11} />} />
    <KVRow label="Role" value="Sole decision-maker — sales, procurement, banking" />
    <KVRow label="Alternate Signatory" value="Son (Akash Agarwal) — learning operations, not yet independent" />
    <KVRow label="Key Man Risk" value={<span style={{ color: "var(--destructive-600)", fontWeight: 600 }}>High — business continuity depends on promoter health</span>} />
    <KVRow label="Mitigation" value="Keyman insurance of ₹2 Cr recommended; assign co-signatory authority" />
    <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(226,51,24,0.05)", border: "1px solid var(--destructive-200)", borderRadius: 8 }}>
      <Para>The business is heavily promoter-driven. While Ramesh Agarwal has 18 years of experience and strong buyer relationships, the absence of a formal second-line management increases key person risk. The bank should consider keyman insurance as a condition precedent.</Para>
    </div>
  </div>
);

const CollateralWidget: React.FC = () => (
  <div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
      {[
        { label: "Market Value", value: "₹6.8 Cr", sub: "As on Jan 2025", accent: true },
        { label: "LTV Ratio", value: "61.7%", sub: "Well within 75% threshold" },
        { label: "Distress Value", value: "₹5.1 Cr", sub: "75% of market value" },
      ].map(p => <StatCard key={p.label} {...p} />)}
    </div>
    <KVRow label="Property Type" value="Commercial — Industrial Factory Shed" icon={<Building2 size={11} />} />
    <KVRow label="Location" value="Plot 18, MIDC Bhiwandi, Thane — 421302" icon={<MapPin size={11} />} />
    <KVRow label="Area" value="4,200 sq ft (Ground Floor + Mezzanine)" />
    <KVRow label="Valuer" value="ABC Valuers Pvt Ltd — IBBI Registered" icon={<User size={11} />} />
    <KVRow label="Valuation Date" value="12 January 2025" icon={<Calendar size={11} />} />
    <KVRow label="Title Clarity" value={<span style={{ color: "var(--warning-700)", fontWeight: 600 }}>Pending — Legal verification in progress</span>} />
    <KVRow label="Encumbrance" value="NIL (as per EC for last 15 years)" />
    <KVRow label="Mortgage Type" value="Equitable Mortgage — deposit of title deeds" />
  </div>
);

const PeerWidget: React.FC = () => (
  <div>
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--neutral-50)", borderBottom: "1px solid var(--border-subtle)" }}>
            {["Metric", "Sunrise Textiles", "Peer A (Listed)", "Peer B (MSME)", "Sector Avg"].map((h, i) => (
              <th key={h} style={{ padding: "8px 11px", textAlign: i === 0 ? "left" : "right", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: i === 1 ? "var(--primary)" : "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { m: "Revenue (₹ Cr)", a: "28.4", b: "142.0", c: "19.8", avg: "—" },
            { m: "EBITDA Margin", a: "11.2%", b: "13.4%", c: "9.1%", avg: "11.8%" },
            { m: "PAT Margin", a: "6.7%", b: "7.9%", c: "4.8%", avg: "6.5%" },
            { m: "Debt / Equity", a: "2.4x", b: "1.1x", c: "2.9x", avg: "1.8x" },
            { m: "DSCR", a: "1.38x", b: "2.10x", c: "1.22x", avg: "1.55x" },
            { m: "Current Ratio", a: "1.31", b: "1.72", c: "1.18", avg: "1.40" },
          ].map(({ m, a, b, c, avg }) => (
            <tr key={m} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", fontWeight: 500 }}>{m}</td>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--primary)", textAlign: "right" }}>{a}</td>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{b}</td>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{c}</td>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ marginTop: 12, padding: "9px 12px", background: "rgba(23,102,214,0.04)", border: "1px solid rgba(23,102,214,0.15)", borderRadius: 8 }}>
      <Para>Sunrise Textiles is broadly in line with MSME peers on profitability but trails the listed peer on leverage and DSCR. Debt-to-equity of 2.4x is above sector average (1.8x) — deleveraging is evident but needs to continue.</Para>
    </div>
  </div>
);

const StressWidget: React.FC = () => (
  <div>
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--neutral-50)", borderBottom: "1px solid var(--border-subtle)" }}>
            {["Scenario", "Revenue Impact", "DSCR (Stressed)", "Interest Coverage", "Verdict"].map((h, i) => (
              <th key={h} style={{ padding: "8px 11px", textAlign: i === 0 ? "left" : "right", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { s: "Base Case", rev: "0%", dscr: "1.38x", ic: "2.7x", v: "Pass", vc: "var(--success-700)", vb: "var(--success-50)" },
            { s: "Mild Stress (–10%)", rev: "–10%", dscr: "1.22x", ic: "2.4x", v: "Pass", vc: "var(--success-700)", vb: "var(--success-50)" },
            { s: "Moderate Stress (–20%)", rev: "–20%", dscr: "0.98x", ic: "1.9x", v: "Watch", vc: "var(--warning-700)", vb: "var(--warning-50)" },
            { s: "Severe Stress (–30%)", rev: "–30%", dscr: "0.71x", ic: "1.4x", v: "Fail", vc: "var(--destructive-600)", vb: "rgba(226,51,24,0.08)" },
            { s: "Rate Hike +200bps", rev: "0%", dscr: "1.18x", ic: "2.2x", v: "Watch", vc: "var(--warning-700)", vb: "var(--warning-50)" },
          ].map(({ s, rev, dscr, ic, v, vc, vb }) => (
            <tr key={s} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", fontWeight: 500 }}>{s}</td>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{rev}</td>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", color: "var(--text-heading)", fontWeight: 600, textAlign: "right" }}>{dscr}</td>
              <td style={{ padding: "9px 11px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{ic}</td>
              <td style={{ padding: "9px 11px", textAlign: "right" }}>
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: vc, background: vb, borderRadius: 100, padding: "2px 9px" }}>{v}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Para>The borrower can withstand up to a 10% revenue decline while maintaining DSCR above the 1.25x threshold. A 20% decline pushes DSCR below threshold, triggering watch status. A +200bps rate hike alone pushes DSCR to 1.18x — borderline but manageable given projected revenue growth.</Para>
  </div>
);

/* ══ WIDGET CONTENT MAP ══ */
const WIDGET_CONTENT: Record<WidgetId, React.ReactNode> = {
  macro: <MacroWidget />,
  fieldvisit: <FieldVisitWidget />,
  keyperson: <KeyPersonWidget />,
  collateral: <CollateralWidget />,
  peer: <PeerWidget />,
  stress: <StressWidget />,
};

const WIDGET_ICONS: Record<WidgetId, React.ReactNode> = {
  macro: <Globe size={14} />, fieldvisit: <Camera size={14} />, keyperson: <Users size={14} />,
  collateral: <Package size={14} />, peer: <GitBranch size={14} />, stress: <Zap size={14} />,
};

/* ══ MAIN PAGE ══ */
export const CAMPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();



  // Added widgets (ordered)
  const [addedWidgets, setAddedWidgets] = useState<WidgetId[]>([]);

  // Remarks
  const [remarks, setRemarks] = useState<Record<string, SectionRemark[]>>({});

  // Submit state
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "done">("idle");

  // Drag state for widget reordering
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  // Drop zone highlight
  const [dropHighlight, setDropHighlight] = useState(false);

  // Dragging from palette
  const draggingWidget = useRef<WidgetId | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  /* Remark helpers */
  const addRemark = (sid: string, text: string) => {
    const now = new Date();
    const ts = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + ", " + now.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    setRemarks(p => ({ ...p, [sid]: [...(p[sid] ?? []), { id: `r-${Date.now()}`, text, status: "pending", timestamp: ts }] }));
  };
  const changeStatus = (sid: string, rid: string, status: RemarkStatus) =>
    setRemarks(p => ({ ...p, [sid]: (p[sid] ?? []).map(r => r.id === rid ? { ...r, status } : r) }));
  const deleteRemark = (sid: string, rid: string) =>
    setRemarks(p => ({ ...p, [sid]: (p[sid] ?? []).filter(r => r.id !== rid) }));

  const sProps = (id: string) => ({ id, remarks: remarks[id] ?? [], onAddRemark: addRemark, onStatusChange: changeStatus, onDeleteRemark: deleteRemark });

  /* Scroll to section */
  const scrollTo = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el && contentRef.current) contentRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
  };



  /* Widget management */
  const addWidget = (id: WidgetId) => { if (!addedWidgets.includes(id)) setAddedWidgets(p => [...p, id]); };
  const removeWidget = (id: WidgetId) => setAddedWidgets(p => p.filter(w => w !== id));

  /* Drag-to-add from palette */
  const onPaletteDragStart = (id: WidgetId) => (e: React.DragEvent) => {
    draggingWidget.current = id;
    e.dataTransfer.effectAllowed = "copy";
  };

  const onContentDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingWidget.current) { setDropHighlight(true); e.dataTransfer.dropEffect = "copy"; }
  };
  const onContentDragLeave = () => setDropHighlight(false);
  const onContentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropHighlight(false);
    if (draggingWidget.current) { addWidget(draggingWidget.current); draggingWidget.current = null; }
  };

  /* Reorder drag within content */
  const onWidgetDragStart = (i: number) => (e: React.DragEvent) => {
    dragIndex.current = i;
    e.dataTransfer.effectAllowed = "move";
  };
  const onWidgetDragOver = (i: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex.current !== null && dragIndex.current !== i) setDragOver(i);
  };
  const onWidgetDrop = (i: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex.current !== null && dragIndex.current !== i) {
      setAddedWidgets(prev => {
        const next = [...prev];
        const [moved] = next.splice(dragIndex.current!, 1);
        next.splice(i, 0, moved);
        return next;
      });
    }
    dragIndex.current = null;
    setDragOver(null);
  };
  const onWidgetDragEnd = () => { dragIndex.current = null; setDragOver(null); };

  const totalRemarks = Object.values(remarks).flat().length;
  const flaggedRemarks = Object.values(remarks).flat().filter(r => r.status === "flagged").length;

  const availableWidgets = WIDGET_REGISTRY.filter(w => !addedWidgets.includes(w.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100%", overflow: "hidden", backgroundColor: "var(--neutral-50)" }}>

      {/* ── HEADER ── */}
      <div style={{ backgroundColor: "var(--neutral-0)", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", height: 34, paddingLeft: 20, gap: 4, borderBottom: "1px solid var(--border-subtle)" }}>
          <button type="button" onClick={() => navigate("/my-cases")} style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", background: "none", border: "none", padding: 0, cursor: "pointer" }}>My Cases</button>
          <ChevronRight size={12} style={{ color: "var(--border-strong)" }} />
          <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>{caseId ?? CASE_META.id}</span>
          <ChevronRight size={12} style={{ color: "var(--border-strong)" }} />
          <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>CAM Report</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px 11px", flexWrap: "wrap" }}>
          <button type="button" onClick={() => navigate(-1)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-subtle)", background: "var(--neutral-0)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "var(--text-muted-themed)" }}>
            <ArrowLeft size={14} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ ...f, fontSize: "var(--text-md)", fontWeight: 700, color: "var(--text-heading)" }}>Credit Appraisal Memorandum</span>
              <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", background: "var(--neutral-100)", border: "1px solid var(--border-subtle)", borderRadius: 6, padding: "2px 8px", fontWeight: 500, whiteSpace: "nowrap" }}>Draft — Underwriter Review</span>
              <AIBadge />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 3, flexWrap: "wrap" }}>
              {[{ icon: <Building2 size={11} />, t: CASE_META.entity }, { icon: <Hash size={11} />, t: caseId ?? CASE_META.id }, { icon: <Calendar size={11} />, t: CASE_META.date }, { icon: <User size={11} />, t: CASE_META.analyst }].map(({ icon, t }, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>{icon} {t}</span>
              ))}
            </div>
          </div>
          <button type="button" style={{ display: "flex", alignItems: "center", gap: 6, ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", background: "var(--neutral-0)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", flexShrink: 0 }}>
            <Download size={13} /> Download PDF
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* ── LEFT PANEL — Widget Palette ── */}
        <div style={{ width: 224, flexShrink: 0, backgroundColor: "var(--neutral-0)", borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ padding: "14px 14px 12px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
              <Layers size={14} style={{ color: "var(--primary)" }} />
              <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)" }}>Widgets</span>
              {availableWidgets.length > 0 && (
                <span style={{ marginLeft: "auto", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--primary)", background: "rgba(23,102,214,0.10)", border: "1px solid rgba(23,102,214,0.20)", borderRadius: 100, padding: "1px 8px" }}>
                  {availableWidgets.length} available
                </span>
              )}
            </div>
            <p style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", margin: 0, lineHeight: "150%" }}>
              Click <strong>+</strong> or drag into the document to add a section.
            </p>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>

            {/* ── AVAILABLE ── */}
            {availableWidgets.length > 0 && (
              <div style={{ padding: "12px 10px 4px" }}>
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8, paddingLeft: 4 }}>
                  Available
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {availableWidgets.map(({ id, label, desc, icon }) => (
                    <div key={id} draggable onDragStart={onPaletteDragStart(id)}
                      style={{ borderRadius: 9, border: "1px solid var(--border-subtle)", background: "var(--neutral-50)", cursor: "grab", transition: "all 0.14s", overflow: "hidden" }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = "rgba(23,102,214,0.35)";
                        el.style.background = "rgba(23,102,214,0.03)";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = "var(--border-subtle)";
                        el.style.background = "var(--neutral-50)";
                      }}>
                      {/* Card top */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px 6px" }}>
                        <span style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(23,102,214,0.10)", border: "1px solid rgba(23,102,214,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
                          {icon}
                        </span>
                        <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", flex: 1, lineHeight: "130%" }}>{label}</span>
                        <button type="button" onClick={() => addWidget(id)}
                          style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: "var(--primary)", color: "var(--neutral-0)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.12s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--primary-600)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "var(--primary)"; }}>
                          <Plus size={13} />
                        </button>
                      </div>
                      {/* Card bottom */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px 8px" }}>
                        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", lineHeight: "140%", flex: 1, paddingRight: 8 }}>{desc}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", whiteSpace: "nowrap", flexShrink: 0 }}>
                          <GripVertical size={10} /> drag
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All added */}
            {availableWidgets.length === 0 && addedWidgets.length > 0 && (
              <div style={{ margin: "14px 10px 0", padding: "14px 12px", textAlign: "center", border: "1px dashed var(--border-subtle)", borderRadius: 9, background: "var(--neutral-50)" }}>
                <CheckCircle2 size={18} style={{ color: "var(--success-500)", margin: "0 auto 6px" }} />
                <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--success-700)", display: "block" }}>All widgets added</span>
                <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", display: "block", marginTop: 3 }}>Remove one below to reuse it.</span>
              </div>
            )}

            {/* ── IN DOCUMENT ── */}
            {addedWidgets.length > 0 && (
              <div style={{ padding: "16px 10px 12px", borderTop: availableWidgets.length > 0 ? "1px solid var(--border-subtle)" : "none", marginTop: availableWidgets.length > 0 ? 8 : 0 }}>
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8, paddingLeft: 4 }}>
                  In Document ({addedWidgets.length})
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {addedWidgets.map((wid, i) => {
                    const meta = WIDGET_REGISTRY.find(w => w.id === wid)!;
                    const hasR = (remarks[wid] ?? []).length > 0;
                    return (
                      <div key={wid}
                        draggable onDragStart={onWidgetDragStart(i)} onDragOver={onWidgetDragOver(i)} onDrop={onWidgetDrop(i)} onDragEnd={onWidgetDragEnd}
                        onClick={() => scrollTo(wid)}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 8px", borderRadius: 7, border: dragOver === i ? "1px dashed rgba(23,102,214,0.50)" : "1px solid transparent", background: dragOver === i ? "rgba(23,102,214,0.04)" : "transparent", cursor: "grab", transition: "all 0.12s" }}
                        onMouseEnter={e => { if (dragOver !== i) (e.currentTarget as HTMLDivElement).style.background = "var(--surface-hover)"; }}
                        onMouseLeave={e => { if (dragOver !== i) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                        <GripVertical size={12} style={{ color: "var(--border-strong)", flexShrink: 0 }} />
                        <span style={{ color: "var(--primary)", flexShrink: 0 }}>{WIDGET_ICONS[wid]}</span>
                        <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", flex: 1, lineHeight: "130%" }}>{meta.label}</span>
                        {hasR && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} title="Has remarks" />}
                        <button type="button" onClick={() => removeWidget(wid)}
                          style={{ width: 20, height: 20, borderRadius: 5, border: "1px solid var(--border-subtle)", background: "transparent", cursor: "pointer", color: "var(--text-muted-themed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(226,51,24,0.08)"; e.currentTarget.style.color = "var(--destructive-500)"; e.currentTarget.style.borderColor = "var(--destructive-200)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted-themed)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; }}>
                          <X size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {availableWidgets.length === WIDGET_REGISTRY.length && (
              <div style={{ padding: "24px 16px", textAlign: "center" }}>
                <Layers size={24} style={{ color: "var(--border-strong)", margin: "0 auto 10px", display: "block" }} />
                <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", display: "block", lineHeight: "150%" }}>No widgets added yet. Click <strong>+</strong> on any card above.</span>
              </div>
            )}

          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div ref={contentRef}
          onDragOver={onContentDragOver}
          onDragLeave={onContentDragLeave}
          onDrop={onContentDrop}
          style={{ flex: 1, overflowY: "auto", padding: "18px 22px 120px", display: "flex", flexDirection: "column", gap: 14, minWidth: 0, position: "relative", transition: "background 0.18s", background: dropHighlight ? "rgba(23,102,214,0.02)" : undefined }}>

          {/* Drop zone hint */}
          <AnimatePresence>
            {dropHighlight && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: "fixed", inset: 0, pointerEvents: "none", border: "2px dashed rgba(23,102,214,0.40)", borderRadius: 12, zIndex: 10, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 80 }}>
                <div style={{ background: "rgba(23,102,214,0.90)", color: "white", ...f, fontSize: "var(--text-sm)", fontWeight: 600, padding: "8px 20px", borderRadius: 8 }}>
                  Drop to add widget to document
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fixed sections */}
          <SectionBlock title="Executive Summary" {...sProps("executive")}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <StatCard label="Loan Amount" value={CASE_META.amount} accent />
              <StatCard label="Loan Type" value="LAP — MSME" sub="Loan Against Property" />
              <StatCard label="Tenure" value="84 Months" sub="7 years" />
              <StatCard label="Proposed ROI" value="12.5% p.a." sub="MCLR + 2.5%" />
            </div>
            <Para>Sunrise Textiles Pvt Ltd, incorporated in 2011 and based in Mumbai, has applied for a Loan Against Property of ₹4.2 Crore against their commercial property at Bhiwandi, valued at ₹6.8 Crore (LTV: 61.7%). The borrower has demonstrated a consistent revenue trajectory with a CAGR of 14.2% and operates in the cotton yarn segment with established buyer relationships across Maharashtra and Gujarat.</Para>
            <Para>The overall credit profile is assessed as <strong>Moderate Risk</strong>. Primary concerns are an elevated DSCR dip in FY24 and a leveraged balance sheet with Debt/Equity at 2.4x. Mitigants include a clean CIBIL track record (748), adequate collateral coverage, and a promoter with 18 years of industry experience.</Para>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 8, background: "rgba(23,102,214,0.05)", border: "1px solid rgba(23,102,214,0.20)", marginTop: 2 }}>
              <Sparkles size={13} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "160%" }}>
                <strong style={{ color: "var(--primary)" }}>AI Recommendation: </strong>
                Conditionally Approve — subject to legal verification of property title and receipt of last 12 months' bank statements.
              </span>
            </div>
          </SectionBlock>

          <SectionBlock title="Borrower Profile" {...sProps("borrower")}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
              <div>
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Entity Details</span>
                <KVRow label="Entity Name" value={CASE_META.entity} icon={<Building2 size={11} />} />
                <KVRow label="CIN" value={CASE_META.cin} icon={<Hash size={11} />} />
                <KVRow label="PAN" value={CASE_META.pan} icon={<Hash size={11} />} />
                <KVRow label="Constitution" value="Private Limited Company" icon={<FileText size={11} />} />
                <KVRow label="Address" value="Bhiwandi, Thane, MH — 421302" icon={<MapPin size={11} />} />
                <KVRow label="Incorporated" value="14 March 2011" icon={<Calendar size={11} />} />
                <KVRow label="Industry" value="Textiles — Cotton Yarn" icon={<Building2 size={11} />} />
              </div>
              <div>
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Promoter Details</span>
                <KVRow label="Name" value="Ramesh Agarwal" icon={<User size={11} />} />
                <KVRow label="DIN" value="07481239" icon={<Hash size={11} />} />
                <KVRow label="PAN" value="ABCPA4567M" icon={<Hash size={11} />} />
                <KVRow label="CIBIL Score" value={<span style={{ fontWeight: 700, color: "var(--success-700)" }}>748 — Good</span>} />
                <KVRow label="Experience" value="18 years in textiles" />
                <KVRow label="Promoter Holding" value="72% (Majority)" />
                <KVRow label="Other Directorships" value="2 inactive companies" />
              </div>
            </div>
          </SectionBlock>

          <SectionBlock title="Financial Analysis" {...sProps("financials")}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <StatCard label="Revenue FY25" value="₹28.4 Cr" sub="↑ 16.4% YoY" accent />
              <StatCard label="EBITDA Margin" value="11.2%" sub="↑ from 9.8%" />
              <StatCard label="Net Profit" value="₹1.9 Cr" sub="PAT 6.7%" />
              <StatCard label="Net Worth" value="₹5.2 Cr" sub="Improving" />
            </div>
            <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--neutral-50)", borderBottom: "1px solid var(--border-subtle)" }}>
                    {["Metric", "FY23", "FY24", "FY25", "Trend"].map((h, i) => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: i === 0 ? "left" : i === 4 ? "center" : "right", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <RatioRow label="Revenue (₹ Cr)" fy23="20.9" fy24="24.4" fy25="28.4" trend="up" />
                  <RatioRow label="EBITDA Margin (%)" fy23="8.4" fy24="9.8" fy25="11.2" trend="up" />
                  <RatioRow label="PAT Margin (%)" fy23="4.1" fy24="5.6" fy25="6.7" trend="up" />
                  <RatioRow label="Current Ratio" fy23="1.18" fy24="1.24" fy25="1.31" trend="up" />
                  <RatioRow label="Debt / Equity" fy23="3.1x" fy24="2.8x" fy25="2.4x" trend="down" good="down" />
                  <RatioRow label="DSCR" fy23="1.42" fy24="1.19" fy25="1.38" trend="up" flag="Dipped below 1.25x in FY24" />
                  <RatioRow label="TOL / TNW" fy23="4.2" fy24="3.9" fy25="3.4" trend="down" good="down" />
                  <RatioRow label="Interest Coverage" fy23="2.1x" fy24="2.3x" fy25="2.7x" trend="up" />
                </tbody>
              </table>
            </div>
            <Para>Revenue CAGR of 14.2%, EBITDA margins expanding from 8.4% → 11.2%, D/E declining 3.1x → 2.4x. DSCR dipped to 1.19x in FY24 — recovery to 1.38x in FY25 is reassuring but requires monitoring.</Para>
          </SectionBlock>

          <SectionBlock title="Assessment & Recommendation" {...sProps("assessment")}>
            <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>Risk Summary</span>
            <div style={{ marginBottom: 14 }}>
              <RiskFlag level="high" label="Leveraged Balance Sheet" desc="Debt-to-equity at 2.4x — exceeds preferred 2.0x threshold for MSME LAP." />
              <RiskFlag level="medium" label="DSCR Volatility in FY24" desc="DSCR touched 1.19x in FY24. FY25 recovery to 1.38x is positive but requires monitoring." />
              <RiskFlag level="medium" label="Sector Concentration Risk" desc="Revenue concentrated in cotton yarn — exposed to raw material price volatility." />
              <RiskFlag level="low" label="Clean Credit History" desc="CIBIL 748, no defaults or restructuring in past 5 years." />
              <RiskFlag level="low" label="Adequate Collateral Coverage" desc="LTV 61.7% on ₹6.8 Cr property — comfortable cushion." />
            </div>
            <Para>Recommended for <strong>Conditional Approval</strong>. The borrower demonstrates creditworthiness with improving financials and strong promoter commitment. Risks are manageable with appropriate covenants.</Para>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
              <div style={{ padding: "10px 14px", border: "1px solid var(--warning-200)", borderRadius: 8, background: "var(--warning-50)", display: "flex", alignItems: "center", gap: 8, flex: "1 1 160px" }}>
                <AlertTriangle size={16} style={{ color: "var(--warning-700)", flexShrink: 0 }} />
                <div>
                  <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--warning-600)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Risk Grade</span>
                  <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--warning-700)", display: "block" }}>B+ — Moderate</span>
                </div>
              </div>
              <div style={{ padding: "10px 14px", border: "1px solid rgba(23,102,214,0.25)", borderRadius: 8, background: "rgba(23,102,214,0.06)", display: "flex", alignItems: "center", gap: 8, flex: "1 1 160px" }}>
                <CheckCircle2 size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <div>
                  <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>AI Decision</span>
                  <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--primary)", display: "block" }}>Conditional Approve</span>
                </div>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock title="Conditions & Covenants" {...sProps("conditions")}>
            <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Pre-Disbursement</span>
            <div style={{ marginBottom: 14 }}>
              <CondItem i={1} text="Legal verification of property title deeds and encumbrance certificate for the Bhiwandi property." />
              <CondItem i={2} text="Submission of last 12 months' bank statements for all entity accounts." />
              <CondItem i={3} text="Execution of mortgage deed and deposit of original title documents with the bank." />
              <CondItem i={4} text="Property insurance endorsement in favour of the bank before disbursement." />
              <CondItem i={5} text="Personal guarantee of Ramesh Agarwal (Promoter Director)." />
            </div>
            <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Ongoing Covenants</span>
            <CondItem i={1} text="Maintain minimum DSCR of 1.25x annually. Breach triggers review and possible repricing." />
            <CondItem i={2} text="Annual audited financials within 120 days of financial year end." />
            <CondItem i={3} text="No further borrowings >₹50 Lakhs without prior written consent." />
            <CondItem i={4} text="Current ratio above 1.10x; QIS reporting quarterly." />
            <CondItem i={5} text="Promoter shareholding above 51% throughout tenure." />
          </SectionBlock>

          {/* Dynamic widgets */}
          <AnimatePresence>
            {addedWidgets.map((wid, i) => {
              const meta = WIDGET_REGISTRY.find(w => w.id === wid)!;
              return (
                <motion.div key={wid}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  onDragOver={onWidgetDragOver(i)} onDrop={onWidgetDrop(i)} onDragEnd={onWidgetDragEnd}
                  style={{ outline: dragOver === i ? "2px dashed rgba(23,102,214,0.50)" : "none", borderRadius: 10, transition: "outline 0.12s" }}>
                  <SectionBlock title={meta.label} icon={WIDGET_ICONS[wid]} isWidget canRemove onRemove={() => removeWidget(wid)}
                    dragHandleProps={{ draggable: true, onDragStart: onWidgetDragStart(i) }}
                    {...sProps(wid)}>
                    {WIDGET_CONTENT[wid]}
                  </SectionBlock>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty drop hint when no widgets */}
          {addedWidgets.length === 0 && (
            <div style={{ border: "1.5px dashed var(--border-subtle)", borderRadius: 10, padding: "22px 20px", textAlign: "center", color: "var(--text-muted-themed)" }}>
              <Layers size={22} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
              <span style={{ ...f, fontSize: "var(--text-sm)", display: "block", marginBottom: 4, fontWeight: 500 }}>No extra widgets added yet</span>
              <span style={{ ...f, fontSize: "var(--text-xs)" }}>Open the <strong>Widgets</strong> tab and drag or click <strong>+</strong> to add Macro Analysis, Field Visit Notes, and more.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ flexShrink: 0, borderTop: "1px solid var(--border-subtle)", backgroundColor: "var(--neutral-0)", padding: "10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {totalRemarks > 0 ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6, ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>
              <MessageSquarePlus size={13} />
              <strong style={{ color: "var(--text-heading)" }}>{totalRemarks}</strong> remark{totalRemarks !== 1 ? "s" : ""} added
              {flaggedRemarks > 0 && (
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--destructive-600)", background: "rgba(226,51,24,0.08)", border: "1px solid var(--destructive-200)", borderRadius: 100, padding: "2px 8px" }}>
                  {flaggedRemarks} flagged
                </span>
              )}
            </span>
          ) : (
            <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>Add section remarks before submitting for credit head review.</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button type="button" style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", background: "var(--neutral-0)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "7px 16px", cursor: "pointer" }}>Save Draft</button>
          <AnimatePresence mode="wait">
            {submitState === "done" ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", alignItems: "center", gap: 6, ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--success-700)", background: "var(--success-50)", border: "1px solid var(--success-200)", borderRadius: 8, padding: "7px 16px" }}>
                <CheckCircle2 size={13} /> Submitted for Review
              </motion.div>
            ) : (
              <motion.button key="submit" type="button" onClick={() => { setSubmitState("loading"); setTimeout(() => setSubmitState("done"), 1600); }}
                disabled={submitState === "loading"}
                style={{ display: "flex", alignItems: "center", gap: 6, ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--neutral-0)", background: submitState === "loading" ? "rgba(23,102,214,0.60)" : "var(--primary)", border: "none", borderRadius: 8, padding: "7px 18px", cursor: submitState === "loading" ? "default" : "pointer" }}>
                {submitState === "loading" ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ display: "inline-block" }}>⟳</motion.span> Submitting…</> : <><Send size={13} /> Submit for Review</>}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

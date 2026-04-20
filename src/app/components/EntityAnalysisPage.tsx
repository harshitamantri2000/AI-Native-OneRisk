import React, { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Sparkles, AlertTriangle, CheckCircle2, TrendingUp,
  TrendingDown, ZoomIn, ZoomOut, Maximize2, Building2, Hash, Calendar,
  ExternalLink, Info, Flag, AlertCircle, Shield, FileText, BarChart3,
  Scale, BookOpen, X, ArrowUpRight, ArrowDownRight, Minus,
  RefreshCw, Link2, User,
} from "lucide-react";

const f: React.CSSProperties = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" };

/* ─── ENTITY DATA ─── */
const ENTITY = {
  name: "A. R. Amboli Developers",
  risk: "High" as const,
  cin: "U45200MH2018PTC312456",
  sector: "Real Estate",
  established: "Est. 2018",
  aiConfidence: 94,
};

/* ─── NETWORK GRAPH ─── */
type RiskLevel = "high" | "medium" | "low";

interface NetworkNode {
  id: string; label: string; sublabel?: string; x: number; y: number;
  risk: RiskLevel; isPrimary?: boolean; flags?: number;
}
interface NetworkEdge {
  from: string; to: string; label: string; problematic?: boolean; side?: "top" | "bottom";
}

const NODES: NetworkNode[] = [
  { id: "meridian",  label: "Meridian Holdings", x: 118,  y: 96,  risk: "high",   flags: 1 },
  { id: "nexagen",   label: "Nexagen Realty",    x: 390,  y: 60,  risk: "high",   flags: 1 },
  { id: "vantage",   label: "Vantage Steels",    x: 576,  y: 92,  risk: "high",   flags: 1 },
  { id: "primary",   label: "A.R. Amboli",       sublabel: "Develo...", x: 350, y: 210, risk: "high", isPrimary: true, flags: 2 },
  { id: "bharat",    label: "Bharat Infracon",   x: 110,  y: 316, risk: "low",    flags: 1 },
  { id: "primecore", label: "Primecore Const.",  x: 345,  y: 340, risk: "medium", flags: 1 },
  { id: "apex",      label: "Apex Capital",      x: 572,  y: 310, risk: "high",   flags: 0 },
];

const EDGES: NetworkEdge[] = [
  { from: "meridian",  to: "primary",   label: "Holding Company",    problematic: true,  side: "top" },
  { from: "primary",   to: "nexagen",   label: "Subsidiary",         problematic: false, side: "top" },
  { from: "nexagen",   to: "vantage",   label: "Linked by Director", problematic: false, side: "top" },
  { from: "primary",   to: "bharat",    label: "Linked by Director", problematic: false, side: "bottom" },
  { from: "primary",   to: "primecore", label: "Subsidiary",         problematic: false, side: "bottom" },
  { from: "primary",   to: "apex",      label: "AI Partner",         problematic: true,  side: "bottom" },
];

const NODE_W = 136, NODE_H = 48;

const riskColor: Record<RiskLevel, { border: string; text: string; bg: string; dot: string }> = {
  high:   { border: "#E23318", text: "#C21B11", bg: "rgba(226,51,24,0.08)",   dot: "#E23318" },
  medium: { border: "#CB7100", text: "#AA5800", bg: "rgba(254,242,203,0.60)", dot: "#CB7100" },
  low:    { border: "#4CAF47", text: "#1A7A1E", bg: "rgba(76,175,71,0.08)",   dot: "#4CAF47" },
};

const nodeCenter = (n: NetworkNode) => ({ cx: n.x + NODE_W / 2, cy: n.y + NODE_H / 2 });

const getEdgePath = (e: NetworkEdge) => {
  const from = NODES.find(n => n.id === e.from)!;
  const to   = NODES.find(n => n.id === e.id) ?? NODES.find(n => n.id === e.to)!;
  const f2 = nodeCenter(from);
  const t2 = nodeCenter(to);
  const mx = (f2.cx + t2.cx) / 2;
  const my = (f2.cy + t2.cy) / 2;
  return { x1: f2.cx, y1: f2.cy, x2: t2.cx, y2: t2.cy, mx, my };
};

/* ─── AI INSIGHTS ─── */
const AI_INSIGHTS = [
  {
    id: "lit1", title: "Company Litigation", badge: "3 Active Cases", badgeColor: "#E23318", badgeBg: "rgba(226,51,24,0.10)",
    icon: <Scale size={13} />, iconColor: "#E23318",
    body: "Specific civil suits against M.K. Shelters regarding Amboli project title.",
    source: "criminal records",
  },
  {
    id: "lit2", title: "Promoter Litigation", badge: "Pending", badgeColor: "#CB7100", badgeBg: "rgba(254,242,203,0.80)",
    icon: <User size={13} />, iconColor: "#1766D6",
    person: "Sunil P. Kadam (Promoter)",
    body: "Managing Director involved in contractual dispute with previous developers.",
    source: "criminal records",
  },
  {
    id: "aml", title: "Director AML Check", badge: "PEP Match", badgeColor: "#C21B11", badgeBg: "rgba(226,51,24,0.10)",
    icon: <Shield size={13} />, iconColor: "#E23318",
    person: "Mahafuz Khan (Director)",
    body: "Director flagged for 'Politically Exposed Person' connections in recent filings.",
    source: null,
  },
];

/* ─── FINANCIAL CARDS ─── */
const FIN_CARDS = [
  { label: "Operating Profit (EBITDA)", source: "MCA", value: "₹4.1 Cr", sub: "6.2% Margin", trend: "up" as const,
    note: "Margin compression observed due to rising raw material costs in real estate." },
  { label: "Related Party Transactions", source: "MCA", value: "₹24 Cr", sub: "5%", trend: "up" as const,
    note: "Significant loans to group entities (Mana Properties). High risk of artificial revenue.", alert: true },
  { label: "Operating Profit (EBITDA)", source: "MCA", value: "₹4.1 Cr", sub: "6.2% Margin", trend: "up" as const,
    note: "Margin compression observed due to rising raw material costs in real estate." },
  { label: "Revenue / Turnover", source: "MCA", value: "₹24 Cr", sub: "6.2% Margin", trend: "up" as const,
    note: "Revenue aligns across sources. Scalability is proven." },
  { label: "Revenue / Turnover", source: "MCA", value: "₹24 Cr", sub: "6.2% Margin", trend: "up" as const,
    note: "Revenue aligns across sources. Scalability is proven." },
  { label: "Debt Service Coverage (DSCR)", source: "MCA", value: "1.12x", sub: null, trend: "down" as const,
    note: "DSCR is dangerously close to 1.0x. Any sales delay will trigger default.", alert: true },
];

/* ─── COMPLIANCE ─── */
const COMPLIANCE = [
  { label: "GST", sub: "GSTR-3B + GSTR-1 monthly", status: "Regular",    color: "#1A7A1E", icon: "check" },
  { label: "EPF", sub: "Provident fund filings",    status: "Filed",      color: "#1A7A1E", icon: "check" },
  { label: "Auditor", sub: "S Sadashiv & Co — 10 years", status: "Clean", color: "#1A7A1E", icon: "check" },
  { label: "AML / Sanctions", sub: "Global sanctions, PEP", status: "No hits", color: "#1A7A1E", icon: "check" },
  { label: "Adverse media", sub: "Credible media sources", status: "None", color: "#1A7A1E", icon: "check" },
  { label: "MCA filing", sub: "Last AGM Sep 2024",    status: "Active",   color: "#1A7A1E", icon: "check" },
  { label: "CIBIL/CRIF defaulter", sub: "Willful defaulter lists", status: "Not listed", color: "#E23318", icon: "x" },
  { label: "Bank statements", sub: "12-month upload",  status: "Pending",  color: "#CB7100", icon: "warn" },
];

const DSR_SIGNAL1 = [
  { label: "MCA Revenue FY24",    value: "₹0.00 Cr",        badge: "Near zero", bc: "#CB7100", bb: "#FEF2CB" },
  { label: "GST filings FY24–FY26", value: "Monthly — all filed", badge: "Active",    bc: "#1A7A1E", bb: "#E9FCE5" },
  { label: "Revenue vs GST match",  value: "Not reconciled", badge: "Pending",   bc: "#CB7100", bb: "#FEF2CB" },
];
const DSR_SIGNAL2 = [
  { label: "LT borrowings (MCA)",  value: "₹4.81 Cr",     badge: "High",     bc: "#E23318", bb: "rgba(226,51,24,0.10)" },
  { label: "Sum of charges (MCA)", value: "₹0.00 Cr",     badge: "Unusual",  bc: "#CB7100", bb: "#FEF2CB" },
  { label: "Bank stmt (12M)",      value: "Not uploaded",  badge: "Missing",  bc: "#131A25", bb: "#ECEDED" },
  { label: "Cash & bank FY24",     value: "₹0.02 Cr",     badge: "Very low", bc: "#E23318", bb: "rgba(226,51,24,0.10)" },
];

/* ─── FINANCIALS TAB DATA ─── */
const FIN_TABLE = [
  { metric: "Revenue (₹ Cr)",       fy22: "8.4",  fy23: "14.2", fy24: "24.0", trend: "up"   as const },
  { metric: "EBITDA (₹ Cr)",        fy22: "0.8",  fy23: "1.4",  fy24: "4.1",  trend: "up"   as const },
  { metric: "EBITDA Margin (%)",    fy22: "9.5%", fy23: "9.9%", fy24: "6.2%", trend: "down" as const, flag: "Declining despite revenue growth" },
  { metric: "PAT (₹ Cr)",           fy22: "0.3",  fy23: "0.6",  fy24: "0.9",  trend: "up"   as const },
  { metric: "Total Borrowings",     fy22: "1.2",  fy23: "3.1",  fy24: "4.81", trend: "down" as const, flag: "Unregistered charges" },
  { metric: "Net Worth (₹ Cr)",     fy22: "1.8",  fy23: "2.4",  fy24: "2.9",  trend: "up"   as const },
  { metric: "DSCR",                 fy22: "1.40", fy23: "1.28", fy24: "1.12", trend: "down" as const, flag: "Approaching 1.0x breach" },
  { metric: "Current Ratio",        fy22: "1.22", fy23: "1.14", fy24: "1.08", trend: "down" as const },
  { metric: "Debt / Equity",        fy22: "0.67", fy23: "1.29", fy24: "1.66", trend: "down" as const, flag: "Increasing leverage" },
];

/* ──────────────────────────────────────────────────────
   NETWORK GRAPH COMPONENT
   ────────────────────────────────────────────────────── */
const NetworkGraph: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const zoomIn  = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
  const reset   = () => setZoom(1);

  const VW = 700, VH = 420;

  return (
    <div style={{ position: "relative", background: "#0A0D13", borderRadius: 10, overflow: "hidden", height: 420 }}>
      {/* Zoom controls */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { icon: <ZoomIn size={13} />, action: zoomIn },
          { icon: <ZoomOut size={13} />, action: zoomOut },
          { icon: <Maximize2 size={13} />, action: reset },
        ].map(({ icon, action }, i) => (
          <button key={i} onClick={action} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.60)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </button>
        ))}
      </div>

      <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%"
        style={{ display: "block", transition: "transform 0.2s" }}>

        {/* Grid dots background */}
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="1" fill="rgba(255,255,255,0.06)" />
          </pattern>
          <marker id="arrow-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.25)" />
          </marker>
          <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="rgba(226,51,24,0.7)" />
          </marker>
        </defs>
        <rect width={VW} height={VH} fill="url(#grid)" />

        <g transform={`translate(${(VW * (1 - zoom)) / 2},${(VH * (1 - zoom)) / 2}) scale(${zoom})`}>

          {/* Edges */}
          {EDGES.map((edge, i) => {
            const fromN = NODES.find(n => n.id === edge.from)!;
            const toN   = NODES.find(n => n.id === edge.to)!;
            const ep = getEdgePath(edge);
            const isProb = edge.problematic;
            const isHov  = hovered === fromN.id || hovered === toN.id;

            return (
              <g key={i}>
                <line
                  x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2}
                  stroke={isProb ? "rgba(226,51,24,0.55)" : "rgba(255,255,255,0.20)"}
                  strokeWidth={isHov ? 1.5 : 1}
                  strokeDasharray={isProb ? "5 4" : "none"}
                  markerEnd={isProb ? "url(#arrow-red)" : "url(#arrow-gray)"}
                  style={{ transition: "stroke 0.15s, stroke-width 0.15s" }}
                />
                {/* Edge label */}
                <text
                  x={ep.mx} y={ep.my - 6}
                  textAnchor="middle"
                  fill={isProb ? "rgba(226,51,24,0.7)" : "rgba(255,255,255,0.32)"}
                  style={{ ...f, fontSize: 9, fontWeight: 500 }}>
                  {edge.label}
                </text>
                {/* Problem dot on edge midpoint */}
                {isProb && (
                  <circle cx={ep.mx} cy={ep.my} r={4} fill="#E23318" opacity={0.85} />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map(node => {
            const rc = riskColor[node.risk];
            const isHov = hovered === node.id;
            return (
              <g key={node.id}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}>

                {/* Node body */}
                <rect
                  x={node.x} y={node.y} width={NODE_W} height={NODE_H}
                  rx={8} ry={8}
                  fill={node.isPrimary ? "rgba(23,102,214,0.15)" : "rgba(19,26,37,0.90)"}
                  stroke={node.isPrimary ? "#1766D6" : rc.border}
                  strokeWidth={node.isPrimary ? 2 : 1.5}
                  style={{ filter: isHov ? "brightness(1.3)" : "none", transition: "filter 0.15s" }}
                />

                {/* Primary label */}
                {node.isPrimary && (
                  <text x={node.x + NODE_W / 2} y={node.y + 18}
                    textAnchor="middle" fill="rgba(255,255,255,0.90)"
                    style={{ ...f, fontSize: 10, fontWeight: 700 }}>
                    PRIMARY ENTITY
                  </text>
                )}

                {/* Node name */}
                <text
                  x={node.x + NODE_W / 2}
                  y={node.isPrimary ? node.y + 31 : node.y + 17}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.88)"
                  style={{ ...f, fontSize: 10.5, fontWeight: 600 }}>
                  {node.label}
                </text>

                {/* Risk chip */}
                <g>
                  <rect
                    x={node.x + 8} y={node.isPrimary ? node.y + 35 : node.y + 24}
                    width={node.risk === "high" ? 34 : node.risk === "medium" ? 44 : 26} height={12}
                    rx={6} fill={rc.bg} />
                  <text
                    x={node.x + 8 + (node.risk === "high" ? 17 : node.risk === "medium" ? 22 : 13)}
                    y={node.isPrimary ? node.y + 34 + 8 : node.y + 24 + 8}
                    textAnchor="middle"
                    fill={rc.text}
                    style={{ ...f, fontSize: 8, fontWeight: 700 }}>
                    {node.risk === "high" ? "● High" : node.risk === "medium" ? "● Med" : "● Low"}
                  </text>
                </g>

                {/* Arrow button (→) */}
                <g opacity={isHov ? 1 : 0} style={{ transition: "opacity 0.15s" }}>
                  <rect x={node.x + NODE_W - 24} y={node.y + 8} width={16} height={16} rx={4} fill="rgba(255,255,255,0.12)" />
                  <text x={node.x + NODE_W - 16} y={node.y + 20} textAnchor="middle" fill="rgba(255,255,255,0.70)" style={{ fontSize: 10 }}>→</text>
                </g>

                {/* Flag count */}
                {node.flags != null && node.flags > 0 && (
                  <g>
                    <circle cx={node.x + NODE_W - 14} cy={node.isPrimary ? node.y + 37 : node.y + 26} r={7} fill="rgba(226,51,24,0.20)" stroke="rgba(226,51,24,0.50)" strokeWidth={1} />
                    <text x={node.x + NODE_W - 14} y={node.isPrimary ? node.y + 37 + 3.5 : node.y + 26 + 3.5}
                      textAnchor="middle" fill="#E23318" style={{ ...f, fontSize: 8, fontWeight: 700 }}>
                      {node.flags}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

/* ─── SMALL ATOMS ─── */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{children}</span>
);

const SourceTag: React.FC<{ label: string }> = ({ label }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>
    <Link2 size={10} /> Source: {label}
  </span>
);

const TrendIcon: React.FC<{ d: "up" | "down"; good?: "up" | "down" }> = ({ d, good = "up" }) => {
  const ok = d === good;
  return d === "up"
    ? <ArrowUpRight size={12} style={{ color: ok ? "#1A7A1E" : "#E23318" }} />
    : <ArrowDownRight size={12} style={{ color: ok ? "#1A7A1E" : "#E23318" }} />;
};

const Badge: React.FC<{ text: string; bc: string; bb: string }> = ({ text, bc, bb }) => (
  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: bc, background: bb, border: `1px solid ${bc}33`, borderRadius: 100, padding: "2px 9px", whiteSpace: "nowrap" }}>{text}</span>
);

/* ─── FINANCIAL CARD ─── */
const FinCard: React.FC<typeof FIN_CARDS[0]> = ({ label, source, value, sub, trend, note, alert }) => (
  <div style={{ border: `1px solid ${alert ? "rgba(226,51,24,0.30)" : "var(--border-subtle)"}`, borderRadius: 10, padding: "14px 16px", background: alert ? "rgba(226,51,24,0.03)" : "var(--neutral-0)", display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      <SourceTag label={source} />
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ ...f, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text-heading)" }}>{value}</span>
      {sub && (
        <span style={{ display: "flex", alignItems: "center", gap: 3, ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: trend === "up" ? "#1A7A1E" : "#E23318" }}>
          <TrendIcon d={trend} /> {sub}
        </span>
      )}
    </div>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 2 }}>
      <Sparkles size={11} style={{ color: alert ? "#E23318" : "var(--info-500)", flexShrink: 0, marginTop: 2 }} />
      <span style={{ ...f, fontSize: "var(--text-xs)", color: alert ? "#C21B11" : "var(--text-muted-themed)", lineHeight: "145%" }}>{note}</span>
    </div>
  </div>
);

/* ──────────────────────────────────────────────────────
   TABS
   ────────────────────────────────────────────────────── */
type Tab = "overview" | "financials" | "litigations" | "cam" | "documents";

const TABS: { id: Tab; label: string; icon?: React.ReactNode }[] = [
  { id: "overview",    label: "Overview",    icon: <Building2 size={13} /> },
  { id: "financials",  label: "Financials",  icon: <BarChart3 size={13} /> },
  { id: "litigations", label: "Litigations", icon: <Scale size={13} /> },
  { id: "cam",         label: "CAM Draft",   icon: <FileText size={13} /> },
  { id: "documents",   label: "Documents",   icon: <BookOpen size={13} /> },
];

/* ──────────────────────────────────────────────────────
   OVERVIEW TAB
   ────────────────────────────────────────────────────── */
const OverviewTab: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

    {/* Row 1: Network + AI Insights */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>

      {/* Network map */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)" }}>Network Contagion Map</span>
          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", background: "var(--neutral-100)", border: "1px solid var(--border-subtle)", borderRadius: 6, padding: "2px 8px" }}>7 entities · 6 connections</span>
        </div>
        <NetworkGraph />
        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, padding: "8px 14px", border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--neutral-50)" }}>
          {[{ l: "High Risk", c: "#E23318" }, { l: "Medium", c: "#CB7100" }, { l: "Low Risk", c: "#4CAF47" }].map(({ l, c }) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />{l}
            </span>
          ))}
          <span style={{ display: "flex", alignItems: "center", gap: 5, ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>
            <span style={{ width: 16, height: 0, borderTop: "1.5px dashed #E23318", display: "inline-block" }} /> Problematic link
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E23318", display: "inline-block" }} /> Issue detected
          </span>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
          <Sparkles size={13} style={{ color: "var(--info-600)" }} />
          <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)" }}>AI Insights</span>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#E23318", color: "#fff", ...f, fontSize: "var(--text-xs)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AI_INSIGHTS.map(ins => (
            <motion.div key={ins.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "12px 14px", background: "var(--neutral-0)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-heading)" }}>{ins.title}</span>
                <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: ins.badgeColor, background: ins.badgeBg, border: `1px solid ${ins.badgeColor}33`, borderRadius: 6, padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>{ins.badge}</span>
              </div>
              {ins.person && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <span style={{ color: ins.iconColor, display: "flex" }}>{ins.icon}</span>
                  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--info-600)", textDecoration: "underline", cursor: "pointer" }}>{ins.person}</span>
                </div>
              )}
              <p style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-body)", lineHeight: "150%", margin: 0, marginBottom: ins.source ? 6 : 0 }}>{ins.body}</p>
              {ins.source && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>
                  <Link2 size={9} /> Source: {ins.source}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* Row 2: Financial Health */}
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)" }}>Financial Health</span>
        <SourceTag label="MCA Filings FY24" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {FIN_CARDS.map((card, i) => <FinCard key={i} {...card} />)}
      </div>
    </div>

    {/* Row 3: Compliance + Data Source */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

      {/* Compliance */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)" }}>Compliance checks</span>
          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>As of 27 Nov 2025</span>
        </div>
        <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
          {COMPLIANCE.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: i < COMPLIANCE.length - 1 ? "1px solid var(--border-subtle)" : "none", background: "var(--neutral-0)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", display: "block" }}>{item.label}</span>
                <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{item.sub}</span>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 5, ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: item.color, flexShrink: 0 }}>
                {item.icon === "check" && <CheckCircle2 size={13} />}
                {item.icon === "x"     && <X size={13} />}
                {item.icon === "warn"  && <AlertTriangle size={13} />}
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Reconciliation */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>Data source reconciliation</span>
        </div>
        <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
          {/* Signal 1 */}
          <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid var(--border-subtle)", background: "var(--neutral-50)" }}>
            <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em" }}>MCA vs GST — Revenue signal</span>
          </div>
          {DSR_SIGNAL1.map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "9px 14px", borderBottom: "1px solid var(--border-subtle)", background: "var(--neutral-0)", gap: 10 }}>
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", flex: 1 }}>{row.label}</span>
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-heading)", fontWeight: 500, minWidth: 0 }}>{row.value}</span>
              <Badge text={row.badge} bc={row.bc} bb={row.bb} />
            </div>
          ))}
          {/* Signal 2 */}
          <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid var(--border-subtle)", borderTop: "1px solid var(--border-subtle)", background: "var(--neutral-50)" }}>
            <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em" }}>MCA vs Banking — Borrowing signal</span>
          </div>
          {DSR_SIGNAL2.map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "9px 14px", borderBottom: i < DSR_SIGNAL2.length - 1 ? "1px solid var(--border-subtle)" : "none", background: "var(--neutral-0)", gap: 10 }}>
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", flex: 1 }}>{row.label}</span>
              <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-heading)", fontWeight: 500 }}>{row.value}</span>
              <Badge text={row.badge} bc={row.bc} bb={row.bb} />
            </div>
          ))}
          {/* Alert */}
          <div style={{ padding: "10px 14px", background: "rgba(226,51,24,0.05)", borderTop: "1px solid rgba(226,51,24,0.20)", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertCircle size={13} style={{ color: "#E23318", flexShrink: 0, marginTop: 2 }} />
            <span style={{ ...f, fontSize: "var(--text-xs)", color: "#C21B11", lineHeight: "150%", fontWeight: 500 }}>
              ₹4.81 Cr borrowings with ₹0 registered charges — loans likely from promoters or group entities. Source + repayment terms must be confirmed before any sanction.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ──────────────────────────────────────────────────────
   FINANCIALS TAB
   ────────────────────────────────────────────────────── */
const FinancialsTab: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {/* Key metrics row */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Revenue FY24", value: "₹24 Cr", sub: "↑ 69% vs FY23", color: "#1A7A1E" },
        { label: "EBITDA FY24", value: "₹4.1 Cr", sub: "6.2% margin ↓", color: "#CB7100" },
        { label: "Total Borrowings", value: "₹4.81 Cr", sub: "No registered charges", color: "#E23318" },
        { label: "DSCR", value: "1.12x", sub: "Below 1.25x threshold", color: "#E23318" },
      ].map(({ label, value, sub, color }) => (
        <div key={label} style={{ padding: "14px 16px", border: "1px solid var(--border-subtle)", borderRadius: 10, background: "var(--neutral-0)" }}>
          <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</span>
          <span style={{ ...f, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>{value}</span>
          <span style={{ ...f, fontSize: "var(--text-xs)", color, fontWeight: 500, display: "block", marginTop: 3 }}>{sub}</span>
        </div>
      ))}
    </div>

    {/* Revenue bar chart (SVG) */}
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "16px 20px", background: "var(--neutral-0)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)" }}>Revenue vs EBITDA Trend</span>
        <SourceTag label="MCA audited financials" />
      </div>
      <svg viewBox="0 0 600 160" width="100%" height="160">
        {/* Y axis labels */}
        {[0, 10, 20, 30].map((v, i) => (
          <g key={v}>
            <text x={32} y={140 - i * 43 + 4} textAnchor="end" fill="var(--text-muted-themed)" style={{ ...f, fontSize: 10 }}>₹{v}Cr</text>
            <line x1={40} y1={140 - i * 43} x2={580} y2={140 - i * 43} stroke="var(--border-subtle)" strokeWidth={1} />
          </g>
        ))}
        {/* Bars */}
        {[
          { label: "FY22", rev: 8.4,  ebt: 0.8 },
          { label: "FY23", rev: 14.2, ebt: 1.4 },
          { label: "FY24", rev: 24.0, ebt: 4.1 },
        ].map(({ label, rev, ebt }, i) => {
          const x = 80 + i * 165;
          const scale = 129 / 30;
          const revH = rev * scale;
          const ebtH = ebt * scale;
          return (
            <g key={label}>
              <rect x={x} y={140 - revH} width={50} height={revH} rx={4} fill="rgba(23,102,214,0.55)" />
              <rect x={x + 54} y={140 - ebtH} width={50} height={ebtH} rx={4} fill="rgba(76,175,71,0.65)" />
              <text x={x + 52} y={156} textAnchor="middle" fill="var(--text-muted-themed)" style={{ ...f, fontSize: 10 }}>{label}</text>
            </g>
          );
        })}
        {/* Legend */}
        <rect x={450} y={10} width={10} height={10} rx={3} fill="rgba(23,102,214,0.55)" />
        <text x={464} y={19} fill="var(--text-muted-themed)" style={{ ...f, fontSize: 10 }}>Revenue</text>
        <rect x={510} y={10} width={10} height={10} rx={3} fill="rgba(76,175,71,0.65)" />
        <text x={524} y={19} fill="var(--text-muted-themed)" style={{ ...f, fontSize: 10 }}>EBITDA</text>
      </svg>
    </div>

    {/* Ratios table */}
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", background: "var(--neutral-50)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-heading)" }}>Key Financial Ratios</span>
        <SourceTag label="MCA + CA Certificate" />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--neutral-50)", borderBottom: "1px solid var(--border-subtle)" }}>
            {["Metric", "FY22", "FY23", "FY24 (Latest)", "Trend"].map((h, i) => (
              <th key={h} style={{ padding: "8px 14px", textAlign: i === 0 ? "left" : i === 4 ? "center" : "right", ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FIN_TABLE.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)", background: row.flag ? "rgba(226,51,24,0.02)" : "var(--neutral-0)" }}>
              <td style={{ padding: "9px 14px", ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", fontWeight: 500 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {row.metric}
                  {row.flag && <AlertTriangle size={11} style={{ color: "#E23318" }} title={row.flag} />}
                </div>
              </td>
              <td style={{ padding: "9px 14px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{row.fy22}</td>
              <td style={{ padding: "9px 14px", ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)", textAlign: "right" }}>{row.fy23}</td>
              <td style={{ padding: "9px 14px", ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-heading)", textAlign: "right" }}>{row.fy24}</td>
              <td style={{ padding: "9px 14px", textAlign: "center" }}>
                <TrendIcon d={row.trend} good={row.metric.includes("Debt") || row.metric.includes("DSCR") || row.metric.includes("Margin") ? "up" : "up"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ──────────────────────────────────────────────────────
   LITIGATIONS TAB
   ────────────────────────────────────────────────────── */
const LitigationsTab: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {[
      { case: "RC/4812/2024", court: "Bombay High Court", petitioner: "M.K. Shelters Ltd", date: "14 Aug 2024", status: "Active", type: "Civil — Title Dispute", amount: "₹2.3 Cr", risk: "high" as RiskLevel,
        desc: "Dispute over title of plot used in 'Amboli Heights' project. Buyer M.K. Shelters alleges fraudulent documentation." },
      { case: "EC/0241/2023", court: "NCLT Mumbai",       petitioner: "Apex Infra Fund",   date: "03 Mar 2023", status: "Active", type: "Insolvency Petition",  amount: "₹1.8 Cr", risk: "high" as RiskLevel,
        desc: "Creditor petition for non-payment of debenture dues. Hearing ongoing." },
      { case: "FIR/1192/2022", court: "Economic Offences Wing", petitioner: "State of Maharashtra", date: "11 Nov 2022", status: "Pending", type: "Criminal — Cheque Bounce", amount: "₹0.5 Cr", risk: "medium" as RiskLevel,
        desc: "Cheque dishonour complaint under NI Act Section 138. Promoter Sunil Kadam accused." },
    ].map((lit, i) => (
      <div key={i} style={{ border: `1px solid ${riskColor[lit.risk].border}33`, borderRadius: 10, padding: "14px 16px", background: "var(--neutral-0)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-heading)" }}>{lit.case}</span>
              <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", background: "var(--neutral-100)", border: "1px solid var(--border-subtle)", borderRadius: 5, padding: "1px 7px" }}>{lit.type}</span>
              <Badge text={lit.status} bc={riskColor[lit.risk].text} bb={riskColor[lit.risk].bg} />
            </div>
            <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span>⚖ {lit.court}</span>
              <span>👤 {lit.petitioner}</span>
              <span>📅 {lit.date}</span>
              <span style={{ fontWeight: 600, color: riskColor[lit.risk].text }}>Claim: {lit.amount}</span>
            </span>
          </div>
        </div>
        <p style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "155%", margin: 0 }}>{lit.desc}</p>
      </div>
    ))}
  </div>
);

/* ──────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────── */
export const EntityAnalysisPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100%", overflow: "hidden", backgroundColor: "var(--neutral-50)" }}>

      {/* ── HEADER ── */}
      <div style={{ backgroundColor: "var(--neutral-0)", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", height: 34, paddingLeft: 28, gap: 3, borderBottom: "1px solid var(--border-subtle)" }}>
          {["Risk Bundles", "Entity Due Diligence", "Case Analysis"].map((crumb, i, arr) => (
            <React.Fragment key={crumb}>
              <span style={{ ...f, fontSize: "var(--text-xs)", color: i === arr.length - 1 ? "var(--text-heading)" : "var(--text-muted-themed)", fontWeight: i === arr.length - 1 ? 600 : 400, cursor: i < arr.length - 1 ? "pointer" : "default" }}
                onClick={() => i < arr.length - 1 && navigate(-1)}>{crumb}</span>
              {i < arr.length - 1 && <ChevronRight size={11} style={{ color: "var(--border-strong)" }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Entity row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 28px 0", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ ...f, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{ENTITY.name}</h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-xs)", fontWeight: 700, color: "#C21B11", background: "rgba(226,51,24,0.10)", border: "1px solid rgba(226,51,24,0.30)", borderRadius: 100, padding: "3px 10px" }}>
                <AlertTriangle size={10} /> High Risk
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              {[
                { icon: <Building2 size={11} />, text: ENTITY.sector },
                { icon: <Calendar size={11} />, text: ENTITY.established },
                { icon: <Hash size={11} />, text: `CIN: ${ENTITY.cin}` },
              ].map(({ icon, text }, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>{icon} {text}</span>
              ))}
            </div>
          </div>

          {/* AI Confidence */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", border: "1px solid rgba(23,102,214,0.25)", borderRadius: 8, background: "rgba(23,102,214,0.05)", flexShrink: 0 }}>
            <Sparkles size={14} style={{ color: "var(--info-500)" }} />
            <div>
              <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--info-600)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, display: "block" }}>AI Confidence</span>
              <span style={{ ...f, fontSize: "var(--text-md)", fontWeight: 700, color: "var(--info-800)", display: "block" }}>{ENTITY.aiConfidence}%</span>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 0, padding: "0 28px", marginTop: 8 }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", border: "none", borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent", background: "transparent", cursor: "pointer", ...f, fontSize: "var(--text-sm)", fontWeight: active ? 700 : 400, color: active ? "var(--primary)" : "var(--text-muted-themed)", marginBottom: -1, whiteSpace: "nowrap", transition: "all 0.12s" }}>
                <span style={{ color: active ? "var(--primary)" : "var(--text-muted-themed)" }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px 40px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            {tab === "overview"    && <OverviewTab />}
            {tab === "financials"  && <FinancialsTab />}
            {tab === "litigations" && <LitigationsTab />}
            {tab === "cam" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", paddingTop: 40 }}>
                <FileText size={32} style={{ color: "var(--text-muted-themed)", opacity: 0.4 }} />
                <span style={{ ...f, fontSize: "var(--text-base)", color: "var(--text-muted-themed)" }}>CAM Draft will be auto-generated from analysis data.</span>
                <button type="button" onClick={() => navigate(`/cam/case/${caseId ?? "CASE-00001"}`)}
                  style={{ display: "flex", alignItems: "center", gap: 6, ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--neutral-0)", background: "var(--primary)", border: "none", borderRadius: 8, padding: "9px 20px", cursor: "pointer" }}>
                  <Sparkles size={13} /> Open CAM Report
                </button>
              </div>
            )}
            {tab === "documents" && (
              <div style={{ textAlign: "center", paddingTop: 40, color: "var(--text-muted-themed)" }}>
                <BookOpen size={32} style={{ opacity: 0.4, margin: "0 auto 12px" }} />
                <span style={{ ...f, fontSize: "var(--text-base)", display: "block" }}>No documents uploaded yet.</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

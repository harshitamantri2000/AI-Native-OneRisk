import React, { useState, useEffect } from "react";
import type { RichCaseEntry, NetworkInsightCard } from "../../data/mock";

/* ─── Risk palette ─────────────────────────────────────────────────────────── */
const RISK = {
  High:   { accent: "#E23318", text: "#B91C1C", badgeBg: "rgba(226,51,24,0.08)", badgeText: "#B91C1C" },
  Medium: { accent: "#D97706", text: "#92400E", badgeBg: "rgba(217,119,6,0.08)", badgeText: "#92400E" },
  Low:    { accent: "#16A34A", text: "#166534", badgeBg: "rgba(22,163,74,0.08)", badgeText: "#166534" },
} as const;

/* ─── Card dimensions ───────────────────────────────────────────────────────── */
const NW = 128;
const NH = 42;
const CW = 140;
const CH = 48;
const ACCENT = 3;
const R = 6;

/* ─── Zoom ──────────────────────────────────────────────────────────────────── */
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 1.6;
const ZOOM_STEP = 0.15;

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const trunc = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

function rectEdgePt(
  cx: number, cy: number, w: number, h: number,
  tx: number, ty: number,
): [number, number] {
  const dx = tx - cx, dy = ty - cy;
  const hw = w / 2, hh = h / 2;
  if (!dx && !dy) return [cx, cy];
  if (Math.abs(dx) * hh > Math.abs(dy) * hw) {
    const s = dx > 0 ? 1 : -1;
    return [cx + s * hw, cy + (dy / Math.abs(dx)) * hw];
  }
  const s = dy > 0 ? 1 : -1;
  return [cx + (dx / Math.abs(dy)) * hh, cy + s * hh];
}

function outerLayout(n: number, cx: number, cy: number): [number, number][] {
  // rx must be > NW/2 + CW/2 + pill_width + gap = 64+70+54+24 = 212
  // Using rx=235 gives ~71px clear line on each side of the pill
  const rx = 235, ry = 104;
  if (n === 1) return [[cx + rx, cy]];
  if (n === 2) return [[cx - rx, cy], [cx + rx, cy]];
  if (n === 3) return [
    [cx - rx, cy - ry * 0.55],
    [cx + rx, cy - ry * 0.55],
    [cx, cy + ry],
  ];
  if (n === 4) return [
    [cx - rx, cy - ry],
    [cx + rx, cy - ry],
    [cx - rx, cy + ry],
    [cx + rx, cy + ry],
  ];
  if (n === 5) return [
    [cx - rx, cy - ry],
    [cx, cy - ry * 1.1],
    [cx + rx, cy - ry],
    [cx - rx * 0.82, cy + ry],
    [cx + rx * 0.82, cy + ry],
  ];
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as [number, number];
  });
}

function accentBar(x: number, y: number, h: number): string {
  return [
    `M ${x + R} ${y}`,
    `L ${x + ACCENT} ${y}`,
    `L ${x + ACCENT} ${y + h}`,
    `L ${x + R} ${y + h}`,
    `Q ${x} ${y + h} ${x} ${y + h - R}`,
    `L ${x} ${y + R}`,
    `Q ${x} ${y} ${x + R} ${y}`,
    "Z",
  ].join(" ");
}

/* ─── Zoom button ─────────────────────────────────────────────────────────── */
const ZBtn: React.FC<{ onClick: () => void; disabled: boolean; title: string; children: React.ReactNode }> = ({
  onClick, disabled, title, children,
}) => (
  <button onClick={onClick} disabled={disabled} title={title}
    style={{
      width: 24, height: 24,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "13px", fontWeight: 600, lineHeight: 1,
      color: disabled ? "var(--text-muted-themed)" : "var(--text-secondary-themed)",
      backgroundColor: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 4,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.45 : 1,
      userSelect: "none",
    }}
  >{children}</button>
);

/* ─── Hover state — anchored to node rect edges ─────────────────────────────── */
interface HoverState {
  nodeId: string;       // outer node id, or "center" for primary entity
  nodeRight: number;    // viewport-relative right edge of hovered card
  nodeLeft: number;     // viewport-relative left edge
  nodeCenterY: number;  // viewport-relative vertical center
}

/* ─────────────────────────────────────────────────────────────────────────────
   HoverPopup  (position: fixed — never clipped by parent overflow)
───────────────────────────────────────────────────────────────────────────── */
const POPUP_W = 230;

/* ─── Relationship type labels ───────────────────────────────────────────────── */
const REL_LABEL: Record<string, string> = {
  "Subsidiary":      "Subsidiary Company",
  "Associate":       "Associate Company",
  "Group Entity":    "Group Entity",
  "Common Director": "Co-Directorship",
  "Promoter Entity": "Holding Company",
};

interface PopupData {
  name: string;
  riskLevel: keyof typeof RISK;
  relationship?: string;    // raw value → mapped via REL_LABEL
  aiSummary?: string;
  directors?: string[];
  commonDirectors?: string[];
  isPrimary?: boolean;
  topRisk?: string;
  factors?: string[];
}

const HoverPopup: React.FC<{
  data: PopupData;
  primaryName: string;
  nodeRight: number;
  nodeLeft: number;
  nodeCenterY: number;
}> = ({ data, primaryName, nodeRight, nodeLeft, nodeCenterY }) => {
  const nc = RISK[data.riskLevel];

  // Position to the right; flip left if near viewport edge
  const spaceRight = typeof window !== "undefined" ? window.innerWidth - nodeRight : 9999;
  const useLeft = spaceRight < POPUP_W + 14;
  const left = useLeft ? nodeLeft - POPUP_W - 8 : nodeRight + 8;

  // Vertically centered on node; clamp to viewport
  const estHeight = 280;
  const rawTop = nodeCenterY - 60;
  const top = typeof window !== "undefined"
    ? Math.max(8, Math.min(rawTop, window.innerHeight - estHeight - 8))
    : rawTop;

  return (
    <div style={{
      position: "fixed",
      left,
      top,
      width: POPUP_W,
      backgroundColor: "var(--surface-card)",
      border: "none",
      outline: "none",
      borderRadius: 8,
      boxShadow: "0 8px 28px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.08)",
      zIndex: 9999,
      overflow: "hidden",
      pointerEvents: "none",
    }}>

      {/* Header */}
      <div style={{ padding: "8px 10px 7px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: data.relationship ? 5 : 0 }}>
          <span style={{
            fontSize: "7.5px", fontWeight: 700,
            color: nc.badgeText, backgroundColor: nc.badgeBg,
            padding: "1px 7px", borderRadius: 999, flexShrink: 0,
          }}>
            {data.isPrimary ? "Primary" : data.riskLevel + " Risk"}
          </span>
          <span style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--text-heading)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {data.name}
          </span>
        </div>
        {/* Relationship type */}
        {data.relationship && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: "9px", color: "var(--text-muted-themed)" }}>Connected via</span>
            <span style={{
              fontSize: "8px", fontWeight: 600,
              color: "var(--text-secondary-themed)",
              backgroundColor: "var(--surface-inset-subtle)",
              border: "1px solid var(--border-subtle)",
              padding: "1px 7px", borderRadius: 999,
            }}>
              {REL_LABEL[data.relationship] ?? data.relationship}
            </span>
          </div>
        )}
      </div>

      {/* AI Summary */}
      {data.aiSummary && (
        <div style={{ padding: "7px 10px 6px", borderBottom: (data.directors?.length || data.factors?.length) ? "1px solid var(--border-subtle)" : "none" }}>
          <div style={{ fontSize: "7.5px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3, display: "flex", alignItems: "center", gap: 3 }}>
            <span>✦</span> AI Summary
          </div>
          <p style={{ fontSize: "9.5px", color: "var(--text-body)", lineHeight: 1.6, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {data.aiSummary}
          </p>
        </div>
      )}

      {/* Key factors (for primary entity popup) */}
      {data.factors && data.factors.length > 0 && (
        <div style={{ padding: "6px 10px 7px", borderBottom: "none" }}>
          <div style={{ fontSize: "7.5px", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>
            Key Factors
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            {data.factors.slice(0, 3).map((f, i) => (
              <li key={i} style={{ fontSize: "9px", color: "var(--text-body)", lineHeight: 1.5, display: "flex", gap: 4 }}>
                <span style={{ color: "var(--text-muted-themed)", flexShrink: 0 }}>·</span>{f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Directors (for outer node popup) */}
      {data.directors && data.directors.length > 0 && (
        <div style={{ padding: "6px 10px 8px" }}>
          <div style={{ fontSize: "7.5px", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>
            Directors
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            {data.directors.map((director: string) => {
              const isCommon = data.commonDirectors?.includes(director) ?? false;
              return (
                <li key={director} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: "9.5px", fontWeight: isCommon ? 600 : 400,
                  color: isCommon ? "var(--primary)" : "var(--text-body)",
                }}>
                  <span style={{ flexShrink: 0, fontSize: "8.5px", color: isCommon ? "var(--primary)" : "var(--text-muted-themed)" }}>
                    {isCommon ? "✓" : "·"}
                  </span>
                  {director}
                </li>
              );
            })}
          </ul>
          {(data.commonDirectors?.length ?? 0) > 0 && (
            <p style={{ fontSize: "9px", color: "var(--primary)", opacity: 0.7, margin: "5px 0 0" }}>
              ✓ shared with {primaryName.split(" ")[0]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Severity palette (shared by SourceTooltip + FindingRow)
───────────────────────────────────────────────────────────────────────────── */
interface SourcePos { x: number; y: number }

const FINDING_SEV = {
  critical: { dot: "#DC2626", dotBg: "#FEF2F2", textColor: "#DC2626", labelBg: "#FEF2F2", labelText: "#B91C1C" },
  warning:  { dot: "#D97706", dotBg: "#FFFBEB", textColor: "#B45309", labelBg: "#FFFBEB", labelText: "#92400E" },
  info:     { dot: "#2563EB", dotBg: "#EFF6FF", textColor: "#2563EB", labelBg: "#EFF6FF", labelText: "#1D4ED8" },
  positive: { dot: "#16A34A", dotBg: "#F0FDF4", textColor: "#16A34A", labelBg: "#F0FDF4", labelText: "#166534" },
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   SourceTooltip  — fixed-position, structured fields
───────────────────────────────────────────────────────────────────────────── */
const SourceTooltip: React.FC<{
  card: NetworkInsightCard;
  pos: SourcePos;
  onClose: () => void;
}> = ({ card, pos, onClose }) => {
  const sd = card.sourceDetails!;
  const s = FINDING_SEV[card.severity];

  const left = Math.min(pos.x, (typeof window !== "undefined" ? window.innerWidth : 800) - 256);
  const top  = Math.min(pos.y + 6, (typeof window !== "undefined" ? window.innerHeight : 600) - 220);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 9998 }} onClick={onClose} />
      <div style={{
        position: "fixed", left, top, width: 248, zIndex: 9999,
        backgroundColor: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "7px 10px 6px",
          backgroundColor: s.labelBg,
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: "9px", color: s.dot }}>⊗</span>
          <span style={{ fontSize: "9px", fontWeight: 700, color: s.labelText, flex: 1 }}>{sd.label}</span>
        </div>

        {/* Structured fields */}
        <div style={{ padding: "8px 10px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
          {sd.fields.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{
                fontSize: "8px", fontWeight: 700,
                color: "var(--text-muted-themed)",
                textTransform: "uppercase" as const, letterSpacing: "0.05em",
                minWidth: 72, flexShrink: 0, paddingTop: 2, lineHeight: 1.4,
              }}>
                {f.key}
              </span>
              <span style={{
                fontSize: "10px", fontWeight: 500,
                color: "var(--text-heading)", lineHeight: 1.45,
              }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FindingRow — collapsed by default, click to expand
───────────────────────────────────────────────────────────────────────────── */
const FindingRow: React.FC<{
  card: NetworkInsightCard;
  isExpanded: boolean;
  onToggle: () => void;
  onSourceClick: (card: NetworkInsightCard, pos: SourcePos) => void;
}> = ({ card, isExpanded, onToggle, onSourceClick }) => {
  const s = FINDING_SEV[card.severity];

  return (
    <div
      onClick={onToggle}
      style={{
        borderRadius: 8,
        backgroundColor: isExpanded ? "var(--surface-card)" : "transparent",
        border: isExpanded ? "1px solid var(--border-subtle)" : "1px solid transparent",
        transition: "background-color 0.15s, border-color 0.15s",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Collapsed row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 8px" }}>
        {/* Severity dot */}
        <div style={{
          width: 7, height: 7, borderRadius: 999, flexShrink: 0,
          backgroundColor: s.dot, marginTop: 4,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title — problem statement */}
          <div style={{
            fontSize: "11px", fontWeight: 600,
            color: "var(--text-heading)", lineHeight: 1.35,
          }}>
            {card.title}
          </div>
          {/* Against label — only for director / network */}
          {card.againstLabel && (
            <div style={{
              marginTop: 2,
              fontSize: "9.5px", fontWeight: 500,
              color: s.textColor, opacity: 0.85,
            }}>
              {card.againstLabel}
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <span style={{
          fontSize: "9px", color: "var(--text-muted-themed)",
          marginTop: 3, flexShrink: 0,
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.15s",
          display: "inline-block",
        }}>
          ▾
        </span>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div
          style={{ padding: "0 8px 10px 23px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtext */}
          {card.subtext && (
            <p style={{
              fontSize: "10px", color: "var(--text-muted-themed)",
              lineHeight: 1.6, margin: "0 0 8px",
            }}>
              {card.subtext}
            </p>
          )}

          {/* Source chip */}
          <div
            onClick={(e) => {
              if (!card.sourceDetails) return;
              e.stopPropagation();
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              onSourceClick(card, { x: r.left, y: r.bottom });
            }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              cursor: card.sourceDetails ? "pointer" : "default",
              backgroundColor: s.labelBg,
              border: `1px solid ${s.dot}30`,
              borderRadius: 5, padding: "3px 8px",
            }}
          >
            <span style={{ fontSize: "9px", color: s.dot }}>⊗</span>
            <span style={{ fontSize: "9px", fontWeight: 600, color: s.labelText }}>
              {card.source}
            </span>
            {card.sourceDetails && (
              <span style={{ fontSize: "9px", color: s.dot, opacity: 0.7 }}>↗</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   NetworkGraphCanvas
───────────────────────────────────────────────────────────────────────────── */
interface Props {
  entry: RichCaseEntry;
}

export const NetworkGraphCanvas: React.FC<Props> = ({ entry }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [activeSource, setActiveSource] = useState<{ card: NetworkInsightCard; pos: SourcePos } | null>(null);
  const [expandedFindingIdx, setExpandedFindingIdx] = useState<number | null>(null);

  const { name, riskLevel, aiInsight, detail } = entry;
  const { networkNodes } = detail;

  const svgW = 650;
  const svgH = 310;
  const cx = svgW / 2;         // 325
  const cy = svgH / 2 + 8;    // 163 — extra top margin for "PRIMARY ENTITY" label

  const positions = outerLayout(networkNodes.length, cx, cy);
  const cr = RISK[riskLevel];

  const selectedNode = selectedId
    ? networkNodes.find((n) => n.id === selectedId) ?? null
    : null;

  // ── Pre-compute network flags for the insights panel ──────────────────────
  const ni = detail.networkInsights;
  const networkFlags = [
    ni.litigationFlag,
    ni.amlFlag,
    ni.pepFlag,
    ni.contagionExplanation,
    ...networkNodes
      .filter((n) => n.isContagionSource || n.riskLevel === "High")
      .map((n) => n.aiSummary),
    ...aiInsight.factors.filter((f) =>
      /declin|risk|linked|high|loss|criminal|flag/i.test(f)
    ),
  ].filter(Boolean).slice(0, 5) as string[];

  const contagionColors = {
    HIGH:   { bg: "rgba(226,51,24,0.07)",  text: "#B91C1C" },
    MEDIUM: { bg: "rgba(217,119,6,0.07)",  text: "#92400E" },
    LOW:    { bg: "rgba(22,163,74,0.07)",  text: "#166534" },
    NONE:   { bg: "rgba(22,163,74,0.07)",  text: "#166534" },
  } as const;
  const cc = contagionColors[ni.contagionRisk];

  // ── Sort insight cards: company first, directors second, network last ──────
  const AGAINST_ORDER: Record<string, number> = { company: 0, director: 1, network: 2 };
  const sortedFindings = ni.insightCards
    ? [...ni.insightCards].sort(
        (a, b) => (AGAINST_ORDER[a.against] ?? 3) - (AGAINST_ORDER[b.against] ?? 3)
      )
    : [];

  const vbW = svgW / zoom;
  const vbH = svgH / zoom;
  const vbX = (svgW - vbW) / 2;
  const vbY = (svgH - vbH) / 2;

  // Build popup data from hover state
  const popupData: PopupData | null = (() => {
    if (!hoverState) return null;
    if (hoverState.nodeId === "center") {
      return {
        name,
        riskLevel,
        aiSummary: aiInsight.summary,
        factors: aiInsight.factors,
        isPrimary: true,
      };
    }
    const node = networkNodes.find((n) => n.id === hoverState.nodeId);
    if (!node) return null;
    return {
      name: node.name,
      riskLevel: node.riskLevel,
      relationship: node.relationship,
      aiSummary: node.aiSummary,
      directors: node.directors,
      commonDirectors: node.commonDirectors,
    };
  })();

  const handleEnter = (nodeId: string, e: React.MouseEvent<SVGGElement>) => {
    const rect = (e.currentTarget as SVGGElement).getBoundingClientRect();
    setHoverState({
      nodeId,
      nodeRight: rect.right,
      nodeLeft: rect.left,
      nodeCenterY: rect.top + rect.height / 2,
    });
  };

  // Dismiss on scroll so popup doesn't drift
  useEffect(() => {
    const onScroll = () => setHoverState(null);
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, []);

  return (
    <div style={{ display: "flex", height: 318 }}>

      {/* ── SVG Graph ─────────────────────────────────────────────────────── */}
      <div style={{ flex: "0 0 70%", position: "relative", minWidth: 0 }}>

        {/* Zoom controls */}
        <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 3, zIndex: 20 }}>
          <ZBtn onClick={() => setZoom((z) => +(Math.min(ZOOM_MAX, z + ZOOM_STEP)).toFixed(2))} disabled={zoom >= ZOOM_MAX} title="Zoom in">+</ZBtn>
          <ZBtn onClick={() => setZoom((z) => +(Math.max(ZOOM_MIN, z - ZOOM_STEP)).toFixed(2))} disabled={zoom <= ZOOM_MIN} title="Zoom out">−</ZBtn>
          <ZBtn onClick={() => setZoom(1)} disabled={Math.abs(zoom - 1) < 0.01} title="Reset">⊙</ZBtn>
        </div>

        <svg
          viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
          width="100%"
          height="100%"
          style={{ display: "block" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="ngc-shadow" x="-20%" y="-30%" width="140%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.07" />
            </filter>
          </defs>

          {/* ── Edges ── */}
          {networkNodes.map((node, i) => {
            const [nx, ny] = positions[i];
            const nc = RISK[node.riskLevel];
            const isSel = node.id === selectedId;
            const isHov = hoverState?.nodeId === node.id;
            const active = isSel || isHov;

            const [x1, y1] = rectEdgePt(cx, cy, CW, CH, nx, ny);
            const [x2, y2] = rectEdgePt(nx, ny, NW, NH, cx, cy);
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;

            const edgeColor = active ? nc.accent
              : node.isContagionSource ? nc.accent
              : "#94A3B8";

            // Short relationship label for the pill
            const relLabel = node.relationship
              .replace("Private Limited", "").replace("Common ", "").trim();

            return (
              <g key={`edge-${node.id}`}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={edgeColor}
                  strokeWidth={active || node.isContagionSource ? 1.75 : 1.25}
                  strokeDasharray={active || node.isContagionSource ? "none" : "4 3"}
                  opacity={active ? 1 : node.isContagionSource ? 0.9 : 0.72}
                />
                {/* Relationship label — white bg floats over the line */}
                <rect
                  x={mx - 26} y={my - 6}
                  width={52} height={12}
                  rx={3}
                  fill="var(--surface-card)"
                  opacity={0.96}
                />
                <text
                  x={mx} y={my + 3}
                  textAnchor="middle"
                  style={{
                    fontSize: "7px",
                    fontWeight: active ? 600 : 400,
                    fill: active ? edgeColor : "#6B7280",
                  }}
                >
                  {trunc(relLabel, 11)}
                </text>
              </g>
            );
          })}

          {/* ── Center node (Primary Entity) ── */}
          <g
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => handleEnter("center", e)}
            onMouseLeave={() => setHoverState(null)}
            filter="url(#ngc-shadow)"
          >
            <rect
              x={cx - CW / 2} y={cy - CH / 2}
              width={CW} height={CH}
              rx={R}
              fill="var(--surface-card)"
              stroke={hoverState?.nodeId === "center" ? cr.accent : "#D1D5DB"}
              strokeWidth={hoverState?.nodeId === "center" ? 1.5 : 1}
            />
            <path d={accentBar(cx - CW / 2, cy - CH / 2, CH)} fill={cr.accent} />

            <text
              x={cx} y={cy - CH / 2 - 6}
              textAnchor="middle"
              style={{ fontSize: "7.5px", fontWeight: 700, fill: cr.accent, letterSpacing: "0.09em", textTransform: "uppercase" } as React.CSSProperties}
            >
              PRIMARY ENTITY
            </text>
            <text x={cx - CW / 2 + ACCENT + 9} y={cy - 7}
              style={{ fontSize: "10px", fontWeight: 600, fill: "var(--text-heading)" }}>
              {trunc(name, 17)}
            </text>
            <rect x={cx - CW / 2 + ACCENT + 9} y={cy + 3} width={56} height={12} rx={6} fill={cr.badgeBg} />
            <text
              x={cx - CW / 2 + ACCENT + 9 + 28} y={cy + 11.5}
              textAnchor="middle"
              style={{ fontSize: "7.5px", fontWeight: 700, fill: cr.badgeText }}
            >
              {riskLevel} Risk
            </text>
          </g>

          {/* ── Outer nodes ── */}
          {networkNodes.map((node, i) => {
            const [nx, ny] = positions[i];
            const nc = RISK[node.riskLevel];
            const isSel = node.id === selectedId;
            const isHov = hoverState?.nodeId === node.id && !isSel;
            const tx = nx - NW / 2 + ACCENT + 8;

            return (
              <g
                key={node.id}
                onClick={() => { setSelectedId(isSel ? null : node.id); setHoverState(null); }}
                onMouseEnter={(e) => handleEnter(node.id, e)}
                onMouseLeave={() => setHoverState(null)}
                style={{ cursor: "pointer" }}
                filter="url(#ngc-shadow)"
              >
                {/* Hover glow */}
                {isHov && (
                  <rect
                    x={nx - NW / 2 - 3} y={ny - NH / 2 - 3}
                    width={NW + 6} height={NH + 6}
                    rx={R + 3}
                    fill={nc.accent} opacity={0.07}
                  />
                )}

                <rect
                  x={nx - NW / 2} y={ny - NH / 2}
                  width={NW} height={NH}
                  rx={R}
                  fill="var(--surface-card)"
                  stroke={isSel ? nc.accent : isHov ? nc.accent : "#D1D5DB"}
                  strokeWidth={isSel ? 1.75 : isHov ? 1.25 : 0.75}
                  strokeOpacity={isHov && !isSel ? 0.65 : 1}
                />
                <path d={accentBar(nx - NW / 2, ny - NH / 2, NH)} fill={nc.accent} />

                <text x={tx} y={ny - 7}
                  style={{ fontSize: "10px", fontWeight: 600, fill: "var(--text-heading)" }}>
                  {trunc(node.name, 14)}
                </text>

                <circle cx={tx + 3.5} cy={ny + 8} r={3} fill={nc.accent} opacity={0.8} />
                <text x={tx + 11} y={ny + 12}
                  style={{ fontSize: "8px", fontWeight: 500, fill: nc.text }}>
                  {node.riskLevel} Risk
                </text>

                {node.commonDirectors.length > 0 && (
                  <text
                    x={nx + NW / 2 - 17} y={ny + 12}
                    textAnchor="middle"
                    style={{ fontSize: "8px", fontWeight: 700, fill: "var(--primary)" }}
                  >
                    ⊙{node.commonDirectors.length}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover popup — position: fixed escapes all parent overflow: hidden */}
        {popupData && hoverState && (
          <HoverPopup
            data={popupData}
            primaryName={name}
            nodeRight={hoverState.nodeRight}
            nodeLeft={hoverState.nodeLeft}
            nodeCenterY={hoverState.nodeCenterY}
          />
        )}
      </div>

      {/* ── Right panel ───────────────────────────────────────────────────── */}
      <div
        style={{
          flex: "0 0 30%",
          width: "30%",
          borderLeft: "1px solid var(--border-subtle)",
          backgroundColor: "var(--surface-inset-subtle)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {!selectedNode ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Header */}
              <div style={{
                padding: "10px 11px 9px",
                borderBottom: "1px solid var(--border-subtle)",
                backgroundColor: "var(--surface-card)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, #7C3AED))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "9px", color: "#fff", fontWeight: 700 }}>✦</span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-heading)", flex: 1, letterSpacing: "-0.01em" }}>
                    AI Insights
                  </span>
                  {(ni.insightCards?.length ?? networkFlags.length) > 0 && (
                    <span style={{
                      fontSize: "9px", fontWeight: 800, color: "#fff",
                      background: "#E23318",
                      minWidth: 20, height: 20, borderRadius: 999,
                      padding: "0 5px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {ni.insightCards?.length ?? networkFlags.length}
                    </span>
                  )}
                </div>
                {/* Contagion summary line */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: cc.text, flexShrink: 0 }} />
                  <span style={{ fontSize: "9.5px", color: "var(--text-muted-themed)", lineHeight: 1.4 }}>
                    {ni.contagionRisk === "HIGH" || ni.contagionRisk === "MEDIUM"
                      ? ni.contagionExplanation?.slice(0, 80) + "…"
                      : ni.summary.slice(0, 80) + "…"
                    }
                  </span>
                </div>
              </div>

              {/* Findings feed */}
              <div style={{ flex: 1, overflowY: "auto", padding: "6px 8px 4px", display: "flex", flexDirection: "column", gap: 1 }}>
                {sortedFindings.length > 0 ? (
                  sortedFindings.map((card, idx) => (
                    <FindingRow
                      key={idx}
                      card={card}
                      isExpanded={expandedFindingIdx === idx}
                      onToggle={() => setExpandedFindingIdx(expandedFindingIdx === idx ? null : idx)}
                      onSourceClick={(c, pos) => setActiveSource({ card: c, pos })}
                    />
                  ))
                ) : networkFlags.length > 0 ? (
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                    {networkFlags.map((flag, idx) => (
                      <li key={idx} style={{
                        display: "flex", gap: 7, padding: "6px 8px",
                        backgroundColor: "rgba(226,51,24,0.04)",
                        borderLeft: "2px solid #E23318", borderRadius: "0 4px 4px 0",
                      }}>
                        <span style={{ fontSize: "9px", flexShrink: 0, color: "#E23318", marginTop: 1 }}>!</span>
                        <span style={{ fontSize: "9.5px", color: "var(--text-body)", lineHeight: 1.55 }}>{flag}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div style={{
                padding: "6px 10px",
                borderTop: "1px solid var(--border-subtle)",
                backgroundColor: "var(--surface-card)",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ fontSize: "8.5px", color: "var(--text-muted-themed)" }}>⊙</span>
                <span style={{ fontSize: "8.5px", color: "var(--text-muted-themed)", lineHeight: 1.4 }}>
                  Click a node to inspect it
                </span>
              </div>
            </div>
        ) : (
          /* Selected node detail */
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontSize: "7.5px", fontWeight: 700,
                  color: RISK[selectedNode.riskLevel].badgeText,
                  backgroundColor: RISK[selectedNode.riskLevel].badgeBg,
                  padding: "2px 7px", borderRadius: 999,
                }}>
                  {selectedNode.riskLevel} Risk
                </span>
                <button onClick={() => setSelectedId(null)}
                  style={{ fontSize: "11px", color: "var(--text-muted-themed)", background: "none", border: "none", cursor: "pointer", padding: "1px 4px", lineHeight: 1 }}>
                  ✕
                </button>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-heading)", lineHeight: 1.35 }}>
                {selectedNode.name}
              </span>
            </div>

            <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
              {selectedNode.aiSummary && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "7.5px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" as const, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 3 }}>
                    <span>✦</span> AI Summary
                  </span>
                  <p style={{ fontSize: "10px", color: "var(--text-body)", lineHeight: 1.65, margin: 0 }}>
                    {selectedNode.aiSummary}
                  </p>
                </div>
              )}

              {selectedNode.directors && selectedNode.directors.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: "7.5px", fontWeight: 700, color: "var(--text-muted-themed)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                    Directors
                  </span>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                    {selectedNode.directors.map((director) => {
                      const isCommon = selectedNode.commonDirectors.includes(director);
                      return (
                        <li key={director} style={{
                          display: "flex", alignItems: "center", gap: 5,
                          fontSize: "10px", fontWeight: isCommon ? 600 : 400,
                          color: isCommon ? "var(--primary)" : "var(--text-body)",
                        }}>
                          <span style={{ flexShrink: 0, fontSize: "9px", color: isCommon ? "var(--primary)" : "var(--text-muted-themed)" }}>
                            {isCommon ? "✓" : "·"}
                          </span>
                          {director}
                        </li>
                      );
                    })}
                  </ul>
                  {selectedNode.commonDirectors.length > 0 && (
                    <span style={{ fontSize: "9px", color: "var(--primary)", opacity: 0.7 }}>
                      ✓ shared with {name.split(" ")[0]}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Source tooltip — rendered outside the layout divs, fixed position */}
      {activeSource && (
        <SourceTooltip
          card={activeSource.card}
          pos={activeSource.pos}
          onClose={() => setActiveSource(null)}
        />
      )}
    </div>
  );
};

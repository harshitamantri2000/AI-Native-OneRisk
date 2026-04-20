import React, { useState } from "react";
import type { RiskLevel } from "../../data/cases";
import type { NetworkNode } from "../../data/mock";

/* ─── Risk colors ─── */
const RISK = {
  High:   { stroke: "#E23318", bg: "rgba(226,51,24,0.08)",  badge: "#E23318", badgeBg: "rgba(226,51,24,0.12)", text: "#B91C1C" },
  Medium: { stroke: "#CB7100", bg: "rgba(203,113,0,0.08)",  badge: "#CB7100", badgeBg: "rgba(203,113,0,0.12)",  text: "#92400E" },
  Low:    { stroke: "#4CAF47", bg: "rgba(76,175,71,0.08)",  badge: "#4CAF47", badgeBg: "rgba(76,175,71,0.12)",  text: "#166534" },
};

/* ─── Node card dimensions ─── */
const NW = 136;  // outer node width
const NH = 50;   // outer node height
const CW = 148;  // center node width
const CH = 58;   // center node height

/* ─── Truncate company name ─── */
const truncate = (s: string, max = 18) =>
  s.length > max ? s.slice(0, max - 1) + "…" : s;

/* ─── Compute edge start/end points on rect edges ─── */
function rectEdgePoint(
  rx: number, ry: number, rw: number, rh: number,
  tx: number, ty: number
): [number, number] {
  const dx = tx - rx;
  const dy = ty - ry;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const hw = rw / 2;
  const hh = rh / 2;
  if (absDx === 0 && absDy === 0) return [rx, ry];
  if (absDx * hh > absDy * hw) {
    // intersect left/right edge
    const sign = dx > 0 ? 1 : -1;
    return [rx + sign * hw, ry + (dy / absDx) * hw];
  } else {
    // intersect top/bottom edge
    const sign = dy > 0 ? 1 : -1;
    return [rx + (dx / absDy) * hh, ry + sign * hh];
  }
}

/* ─── Layout: positions for N outer nodes around center ─── */
function getOuterPositions(count: number, cx: number, cy: number): [number, number][] {
  const rx = 210;  // horizontal radius
  const ry = 95;   // vertical radius

  if (count === 1) return [[cx + rx, cy]];
  if (count === 2) return [[cx - rx, cy], [cx + rx, cy]];
  if (count === 3) return [
    [cx - rx, cy - ry * 0.7],
    [cx + rx, cy - ry * 0.7],
    [cx, cy + ry],
  ];
  if (count === 4) return [
    [cx - rx, cy - ry],
    [cx + rx, cy - ry],
    [cx - rx, cy + ry],
    [cx + rx, cy + ry],
  ];
  if (count === 5) return [
    [cx - rx, cy - ry],
    [cx,      cy - ry * 1.1],
    [cx + rx, cy - ry],
    [cx - rx * 0.8, cy + ry],
    [cx + rx * 0.8, cy + ry],
  ];
  // 6+: full ellipse
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)] as [number, number];
  });
}

/* ─── Relationship short label ─── */
const relLabel: Record<string, string> = {
  "Subsidiary":       "Subsidiary",
  "Associate":        "Associate",
  "Group Entity":     "Group Entity",
  "Common Director":  "Common Director",
  "Promoter Entity":  "Promoter Entity",
};

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
interface CorporateNetworkGraphProps {
  centerName: string;
  centerRiskLevel: RiskLevel;
  networkNodes: NetworkNode[];
}

export const CorporateNetworkGraph: React.FC<CorporateNetworkGraphProps> = ({
  centerName,
  centerRiskLevel,
  networkNodes,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const svgW = 600;
  const svgH = 270;
  const cx = svgW / 2;
  const cy = svgH / 2 + 4;

  const positions = getOuterPositions(networkNodes.length, cx, cy);
  const centerColors = RISK[centerRiskLevel];

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        height="100%"
        style={{ display: "block", overflow: "visible" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="ncg-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodOpacity="0.10" />
          </filter>
          <marker id="ncg-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#CBD5E1" />
          </marker>
        </defs>

        {/* ── Edges ── */}
        {networkNodes.map((node, i) => {
          const [nx, ny] = positions[i];
          const isHigh = node.isContagionSource;
          const nc = RISK[node.riskLevel];
          const isHov = hovered === node.id;

          const [ex1, ey1] = rectEdgePoint(cx, cy, CW, CH, nx, ny);
          const [ex2, ey2] = rectEdgePoint(nx, ny, NW, NH, cx, cy);

          const mx = (ex1 + ex2) / 2;
          const my = (ey1 + ey2) / 2;

          const label = relLabel[node.relationship] ?? node.relationship;

          return (
            <g key={`edge-${node.id}`}>
              <line
                x1={ex1} y1={ey1} x2={ex2} y2={ey2}
                stroke={isHigh ? "#E23318" : isHov ? nc.stroke : "#CBD5E1"}
                strokeWidth={isHigh ? 1.5 : 1}
                strokeDasharray={isHigh ? "none" : "4 3"}
                opacity={isHov ? 1 : 0.75}
              />
              {/* Edge label background */}
              <rect
                x={mx - 38} y={my - 8}
                width={76} height={14}
                rx={3}
                fill="var(--surface-card)"
                opacity={0.92}
              />
              <text
                x={mx} y={my + 3}
                textAnchor="middle"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "9px",
                  fontWeight: 500,
                  fill: isHigh ? "#E23318" : "#94A3B8",
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* ── Center node ── */}
        <g
          style={{ cursor: "default" }}
          filter="url(#ncg-shadow)"
        >
          {/* Background fill */}
          <rect
            x={cx - CW / 2} y={cy - CH / 2}
            width={CW} height={CH}
            rx={7}
            fill={centerColors.bg}
            stroke={centerColors.stroke}
            strokeWidth={1.5}
          />
          {/* PRIMARY ENTITY label */}
          <text
            x={cx} y={cy - CH / 2 - 5}
            textAnchor="middle"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "8px",
              fontWeight: 700,
              fill: centerColors.badge,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            } as React.CSSProperties}
          >
            PRIMARY ENTITY
          </text>
          {/* Company name */}
          <text
            x={cx - CW / 2 + 10} y={cy - 6}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "10.5px",
              fontWeight: 600,
              fill: "var(--text-heading)",
            }}
          >
            {truncate(centerName, 17)}
          </text>
          {/* Risk badge */}
          <rect
            x={cx - CW / 2 + 10} y={cy + 4}
            width={52} height={14}
            rx={3}
            fill={centerColors.badgeBg}
          />
          <text
            x={cx - CW / 2 + 36} y={cy + 14}
            textAnchor="middle"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "8px",
              fontWeight: 700,
              fill: centerColors.text,
            }}
          >
            {centerRiskLevel} Risk
          </text>
          {/* Arrow */}
          <text
            x={cx + CW / 2 - 12} y={cy + 3}
            textAnchor="middle"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "11px",
              fill: "#94A3B8",
            }}
          >
            →
          </text>
        </g>

        {/* ── Outer nodes ── */}
        {networkNodes.map((node, i) => {
          const [nx, ny] = positions[i];
          const nc = RISK[node.riskLevel];
          const isHov = hovered === node.id;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
              filter={isHov ? "url(#ncg-shadow)" : undefined}
            >
              {/* Hover glow */}
              {node.isContagionSource && (
                <rect
                  x={nx - NW / 2 - 4} y={ny - NH / 2 - 4}
                  width={NW + 8} height={NH + 8}
                  rx={9}
                  fill="rgba(226,51,24,0.06)"
                />
              )}
              {/* Card background */}
              <rect
                x={nx - NW / 2} y={ny - NH / 2}
                width={NW} height={NH}
                rx={6}
                fill="var(--surface-card)"
                stroke={isHov ? nc.stroke : node.isContagionSource ? nc.stroke : "#E2E8F0"}
                strokeWidth={isHov || node.isContagionSource ? 1.5 : 1}
              />

              {/* Company name */}
              <text
                x={nx - NW / 2 + 10} y={ny - 7}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "9.5px",
                  fontWeight: 600,
                  fill: "var(--text-heading)",
                }}
              >
                {truncate(node.name, 16)}
              </text>

              {/* Risk badge */}
              <rect
                x={nx - NW / 2 + 10} y={ny + 2}
                width={48} height={13}
                rx={3}
                fill={nc.badgeBg}
              />
              <text
                x={nx - NW / 2 + 34} y={ny + 11.5}
                textAnchor="middle"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "7.5px",
                  fontWeight: 700,
                  fill: nc.text,
                }}
              >
                {node.riskLevel} Risk
              </text>

              {/* Contagion indicator dot */}
              {node.isContagionSource && (
                <>
                  <circle cx={nx + NW / 2 - 22} cy={ny + 9} r={5} fill="rgba(226,51,24,0.15)" />
                  <text
                    x={nx + NW / 2 - 22} y={ny + 12.5}
                    textAnchor="middle"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "7px", fontWeight: 700, fill: "#E23318" }}
                  >
                    !
                  </text>
                </>
              )}

              {/* Common director pill */}
              {node.commonDirectors.length > 0 && (
                <>
                  <rect
                    x={nx - NW / 2 + 64} y={ny + 2}
                    width={Math.min(node.commonDirectors[0].split(" ").map(w => w[0]).join("").length * 6 + 16, 58)} height={13}
                    rx={3}
                    fill="rgba(92,162,230,0.08)"
                  />
                  <text
                    x={nx - NW / 2 + 70} y={ny + 11.5}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "7px",
                      fontWeight: 500,
                      fill: "#3B82F6",
                    }}
                  >
                    {/* First name initial + last name */}
                    {node.commonDirectors[0].split(" ").map(w => w[0]).join(".")}
                  </text>
                </>
              )}

              {/* Arrow */}
              <text
                x={nx + NW / 2 - 10} y={ny + 3}
                textAnchor="middle"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "10px",
                  fill: "#94A3B8",
                }}
              >
                →
              </text>

              {/* Hover tooltip */}
              {isHov && (
                <g>
                  {/* Position tooltip above or below based on node position */}
                  <rect
                    x={ny < cy ? nx - 75 : nx - 75}
                    y={ny < cy ? ny + NH / 2 + 6 : ny - NH / 2 - 56}
                    width={150} height={50}
                    rx={5}
                    fill="var(--neutral-900)"
                    opacity={0.92}
                  />
                  <text
                    x={nx} y={ny < cy ? ny + NH / 2 + 22 : ny - NH / 2 - 38}
                    textAnchor="middle"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "9px", fontWeight: 600, fill: "#F1F5F9" }}
                  >
                    {node.name.length > 20 ? node.name.slice(0, 20) + "…" : node.name}
                  </text>
                  <text
                    x={nx} y={ny < cy ? ny + NH / 2 + 34 : ny - NH / 2 - 26}
                    textAnchor="middle"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "8px", fill: "#94A3B8" }}
                  >
                    D/E: {node.debtToEquity.toFixed(2)}  ·  PAT: ₹{(node.netProfit / 1e5).toFixed(1)}L
                  </text>
                  <text
                    x={nx} y={ny < cy ? ny + NH / 2 + 46 : ny - NH / 2 - 14}
                    textAnchor="middle"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "8px", fill: "#64748B" }}
                  >
                    {node.commonDirectors.join(", ").slice(0, 26)}
                    {node.commonDirectors.join(", ").length > 26 ? "…" : ""}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* ── Legend ── */}
        <g transform={`translate(${svgW - 140}, ${svgH - 18})`}>
          {(["High", "Medium", "Low"] as RiskLevel[]).map((level, i) => (
            <g key={level} transform={`translate(${i * 46}, 0)`}>
              <rect x={0} y={-7} width={8} height={8} rx={2} fill={RISK[level].badge} opacity={0.7} />
              <text x={11} y={0} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "8px", fill: "#94A3B8" }}>
                {level}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

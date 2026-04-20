import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ShieldX, ShieldAlert, ShieldCheck, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { NetworkEntity, RiskLevel } from "../data/cases";

const fontBase = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
};

const riskColorMap: Record<RiskLevel, { fill: string; stroke: string; glow: string; cssVar: string }> = {
  High: { fill: "rgba(226, 51, 24, 0.15)", stroke: "var(--destructive-500)", glow: "rgba(226, 51, 24, 0.4)", cssVar: "var(--destructive-500)" },
  Medium: { fill: "rgba(203, 113, 0, 0.12)", stroke: "var(--warning-600)", glow: "rgba(203, 113, 0, 0.3)", cssVar: "var(--warning-600)" },
  Low: { fill: "rgba(76, 175, 71, 0.12)", stroke: "var(--success-500)", glow: "rgba(76, 175, 71, 0.3)", cssVar: "var(--success-500)" },
};

interface Props {
  centerName: string;
  centerRiskLevel: RiskLevel;
  centerDebtToEquity: number;
  networkEntities: NetworkEntity[];
}

/** Split a name into lines for SVG <tspan> rendering */
const splitName = (name: string, maxCharsPerLine: number): string[] => {
  const words = name.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if (current && (current.length + 1 + w.length) > maxCharsPerLine) {
      lines.push(current);
      current = w;
    } else {
      current = current ? `${current} ${w}` : w;
    }
  }
  if (current) lines.push(current);
  return lines;
};

export const NetworkContagionMap = ({ centerName, centerRiskLevel, centerDebtToEquity, networkEntities }: Props) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const width = 460;
  const height = 240;
  const cx = width / 2;
  const cy = height / 2;

  // Compute zoomed viewBox
  const vbW = width / zoom;
  const vbH = height / zoom;
  const vbX = (width - vbW) / 2;
  const vbY = (height - vbH) / 2;

  const nodes = useMemo(() => {
    const count = networkEntities.length;
    const rx = 155;
    const ry = 80;
    return networkEntities.map((entity, i) => {
      const angle = (-Math.PI / 2) + (i / count) * 2 * Math.PI;
      return {
        ...entity,
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
      };
    });
  }, [networkEntities, cx, cy]);

  const centerColors = riskColorMap[centerRiskLevel];

  const formatCurrency = (val: number): string => {
    const abs = Math.abs(val);
    const sign = val < 0 ? "-" : "";
    if (abs >= 10000000) return `${sign}${(abs / 10000000).toFixed(1)} Cr`;
    if (abs >= 100000) return `${sign}${(abs / 100000).toFixed(1)} L`;
    return `${sign}${abs.toLocaleString("en-IN")}`;
  };

  // Center node is identified by a special id
  const CENTER_ID = "__center__";
  const isHoveringCenter = hoveredNode === CENTER_ID;

  return (
    <div className="relative w-full h-full" style={{ minHeight: `${height}px` }}>
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="flex items-center justify-center w-6 h-6 rounded-md cursor-pointer"
          style={{
            backgroundColor: "var(--surface-hover)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary-themed)",
            padding: 0,
          }}
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
          className="flex items-center justify-center w-6 h-6 rounded-md cursor-pointer"
          style={{
            backgroundColor: "var(--surface-hover)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary-themed)",
            padding: 0,
          }}
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="flex items-center justify-center w-6 h-6 rounded-md cursor-pointer"
          style={{
            backgroundColor: "var(--surface-hover)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary-themed)",
            padding: 0,
          }}
          title="Reset zoom"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <svg width="100%" height="100%" viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glowH" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="g" />
            <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowC" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="g" />
            <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connectors */}
        {nodes.map((node) => {
          const isHigh = node.isContagionSource;
          const isHov = hoveredNode === node.id;
          return (
            <g key={`link-${node.id}`}>
              <line
                x1={cx} y1={cy} x2={node.x} y2={node.y}
                stroke={isHigh ? "rgba(226, 51, 24, 0.6)" : node.riskLevel === "Medium" ? "rgba(203, 113, 0, 0.3)" : "rgba(76, 175, 71, 0.2)"}
                strokeWidth={isHigh ? 2 : 1}
                strokeDasharray={isHigh ? "none" : "4 3"}
                opacity={isHov ? 1 : 0.7}
                style={isHigh ? { filter: "url(#glowH)" } : {}}
              />
              {/* label */}
              {(() => {
                const mx = (cx + node.x) / 2;
                const my = (cy + node.y) / 2;
                const angle = Math.atan2(node.y - cy, node.x - cx) * (180 / Math.PI);
                const flip = angle > 90 || angle < -90;
                return (
                  <text
                    x={mx} y={my - 6}
                    textAnchor="middle"
                    transform={flip ? `rotate(${angle + 180}, ${mx}, ${my - 6})` : `rotate(${angle}, ${mx}, ${my - 6})`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "7px", fontWeight: 500, fill: isHigh ? "rgba(226, 51, 24, 0.6)" : "var(--text-muted-themed)", letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    Common Dir.
                  </text>
                );
              })()}
            </g>
          );
        })}

        {/* Center glow + node */}
        <g
          onMouseEnter={() => setHoveredNode(CENTER_ID)}
          onMouseLeave={() => setHoveredNode(null)}
          style={{ cursor: "pointer" }}
        >
          <rect x={cx - 30} y={cy - 30} width={60} height={60} rx={6} fill={centerColors.fill} opacity={0.4} style={{ filter: "url(#glowC)" }} />
          <rect x={cx - 25} y={cy - 25} width={50} height={50} rx={5} fill="var(--surface-node-center)" stroke={centerColors.stroke} strokeWidth={isHoveringCenter ? 2.5 : 2} />
          <rect x={cx - 25} y={cy - 25} width={50} height={50} rx={5} fill={centerColors.fill} />
          {(() => {
            const lines = splitName(centerName, 14);
            const totalHeight = lines.length * 10;
            const startY = cy - totalHeight / 2 + 4;
            return lines.map((line, i) => (
              <text
                key={i}
                x={cx}
                y={startY + i * 10}
                textAnchor="middle"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "7.5px", fontWeight: 500, fill: "var(--text-heading)" }}
              >
                {line}
              </text>
            ));
          })()}
          <text x={cx} y={cy + 16} textAnchor="middle" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "6.5px", fontWeight: 500, fill: centerColors.cssVar, textTransform: "uppercase" } as React.CSSProperties}>
            {centerRiskLevel} Risk
          </text>
        </g>

        {/* Outer nodes */}
        {nodes.map((node) => {
          const colors = riskColorMap[node.riskLevel];
          const isHov = hoveredNode === node.id;
          const r = isHov ? 23 : 20;
          const nameLines = splitName(node.name, 12);
          const textTotalH = nameLines.length * 9;
          const textStartY = node.y - textTotalH / 2 + 4;
          return (
            <g key={node.id} onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
              {node.isContagionSource && (
                <rect x={node.x - (r + 5)} y={node.y - (r + 5)} width={(r + 5) * 2} height={(r + 5) * 2} rx={5} fill={colors.glow} opacity={0.25} style={{ filter: "url(#glowH)" }} />
              )}
              <rect x={node.x - r} y={node.y - r} width={r * 2} height={r * 2} rx={4} fill="var(--surface-node)" stroke={colors.stroke} strokeWidth={node.isContagionSource ? 1.5 : 1} opacity={isHov ? 1 : 0.85} />
              <rect x={node.x - r} y={node.y - r} width={r * 2} height={r * 2} rx={4} fill={colors.fill} />
              {nameLines.map((line, li) => (
                <text
                  key={li}
                  x={node.x}
                  y={textStartY + li * 9}
                  textAnchor="middle"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "6.5px", fontWeight: 500, fill: "var(--text-heading)" }}
                >
                  {line}
                </text>
              ))}
              {node.isContagionSource && (
                <g transform={`translate(${node.x + r - 3}, ${node.y - r + 3})`}>
                  <rect x={-5} y={-5} width={10} height={10} rx={2} fill="rgba(226, 51, 24, 0.9)" />
                  <text x={0} y={3} textAnchor="middle" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "7px", fontWeight: 700, fill: "var(--text-on-color)" }}>!</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover detail card — outer nodes */}
      {hoveredNode && hoveredNode !== CENTER_ID && (() => {
        const node = nodes.find((n) => n.id === hoveredNode);
        if (!node) return null;
        const cardX = node.x > cx ? node.x - 190 : node.x + 30;
        const clampedY = Math.max(10, Math.min(height - 120, node.y < cy ? node.y + 30 : node.y - 110));
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-20 rounded-lg p-3 flex flex-col gap-2"
            style={{
              left: `${(cardX / width) * 100}%`,
              top: `${(clampedY / height) * 100}%`,
              width: "190px",
              backgroundColor: "var(--tooltip-bg)",
              border: `1px solid ${node.isContagionSource ? "rgba(226, 51, 24, 0.3)" : "var(--tooltip-border)"}`,
              boxShadow: "var(--tooltip-shadow)",
            }}
          >
            <div className="flex items-center gap-2">
              {node.riskLevel === "High" ? <ShieldX className="w-3.5 h-3.5" style={{ color: riskColorMap[node.riskLevel].cssVar }} /> :
               node.riskLevel === "Medium" ? <ShieldAlert className="w-3.5 h-3.5" style={{ color: riskColorMap[node.riskLevel].cssVar }} /> :
               <ShieldCheck className="w-3.5 h-3.5" style={{ color: riskColorMap[node.riskLevel].cssVar }} />}
              <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>{node.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-normal)", color: "var(--text-secondary-themed)" }}>Risk</span>
              <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: riskColorMap[node.riskLevel].cssVar }}>{node.riskLevel}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-normal)", color: "var(--text-secondary-themed)" }}>PAT</span>
              <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: node.netProfit < 0 ? "var(--destructive-500)" : "var(--success-500)" }}>₹{formatCurrency(node.netProfit)}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {node.commonDirectors.map((d) => (
                <span key={d} className="inline-flex items-center px-1.5 py-0.5 rounded" style={{ ...fontBase, fontSize: "10px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: "var(--info-600)", backgroundColor: "rgba(92, 212, 230, 0.08)" }}>
                  {d}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* Hover detail card — center node */}
      {isHoveringCenter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-20 rounded-lg p-3 flex flex-col gap-2"
          style={{
            left: `${((cx + 35) / width) * 100}%`,
            top: `${((cy - 40) / height) * 100}%`,
            width: "190px",
            backgroundColor: "var(--tooltip-bg)",
            border: `1px solid ${centerColors.stroke}`,
            boxShadow: "var(--tooltip-shadow)",
          }}
        >
          <div className="flex items-center gap-2">
            {centerRiskLevel === "High" ? <ShieldX className="w-3.5 h-3.5" style={{ color: centerColors.cssVar }} /> :
             centerRiskLevel === "Medium" ? <ShieldAlert className="w-3.5 h-3.5" style={{ color: centerColors.cssVar }} /> :
             <ShieldCheck className="w-3.5 h-3.5" style={{ color: centerColors.cssVar }} />}
            <span style={{ ...fontBase, fontSize: "13px", lineHeight: "140%", fontWeight: "var(--font-weight-medium)", color: "var(--text-heading)" }}>{centerName}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-normal)", color: "var(--text-secondary-themed)" }}>Risk</span>
            <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: centerColors.cssVar }}>{centerRiskLevel}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-normal)", color: "var(--text-secondary-themed)" }}>D/E Ratio</span>
            <span style={{ ...fontBase, fontSize: "11px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: centerDebtToEquity > 4 ? "var(--destructive-500)" : centerDebtToEquity > 2 ? "var(--warning-600)" : "var(--success-500)" }}>{centerDebtToEquity.toFixed(2)}</span>
          </div>
          <span
            className="inline-flex items-center self-start px-1.5 py-0.5 rounded mt-0.5"
            style={{ ...fontBase, fontSize: "10px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: centerColors.cssVar, backgroundColor: centerColors.fill }}
          >
            Subject Entity
          </span>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-1 right-2 flex items-center gap-3">
        {(["High", "Medium", "Low"] as RiskLevel[]).map((level) => (
          <div key={level} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: riskColorMap[level].cssVar }} />
            <span style={{ ...fontBase, fontSize: "9px", lineHeight: "1", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary-themed)" }}>{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
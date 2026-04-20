import React from "react";
import { MOCK_CASES } from "../data/cases";

const f = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
} as const;

interface MetricProps {
  label: string;
  value: number;
  dotColor: string;
  pulse?: boolean;
}

const Metric = ({ label, value, dotColor, pulse }: MetricProps) => (
  <div
    className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
    style={{
      backgroundColor: "var(--neutral-50)",
      border: "1px solid var(--border-subtle)",
      minWidth: 0,
    }}
  >
    {/* Dot indicator */}
    <div className="relative flex-shrink-0">
      <div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: dotColor,
        }}
      />
      {pulse && (
        <div
          className="absolute inset-0 w-2 h-2 rounded-full animate-ping"
          style={{
            backgroundColor: dotColor,
            opacity: 0.4,
          }}
        />
      )}
    </div>

    {/* Value */}
    <span
      style={{
        ...f,
        fontSize: "18px",
        lineHeight: "1",
        fontWeight: "var(--font-weight-medium)",
        color: "var(--text-heading)",
      }}
    >
      {value}
    </span>

    {/* Label */}
    <span
      style={{
        ...f,
        fontSize: "12px",
        lineHeight: "140%",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--text-muted-themed)",
      }}
    >
      {label}
    </span>
  </div>
);

export const CaseMetrics = () => {
  const total = MOCK_CASES.length;
  const n = MOCK_CASES.filter((c) => c.status === "New").length;
  const a = MOCK_CASES.filter((c) => c.status === "Approved").length;
  const r = MOCK_CASES.filter((c) => c.status === "Rejected").length;
  const h = MOCK_CASES.filter((c) => c.status === "On Hold").length;
  const e = MOCK_CASES.filter((c) => c.status === "Expert Review").length;

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <Metric label="Total" value={total} dotColor="var(--neutral-200)" />
      <Metric label="New" value={n} dotColor="var(--primary)" pulse />
      <Metric label="Approved" value={a} dotColor="var(--success-500)" />
      <Metric label="Rejected" value={r} dotColor="var(--destructive-500)" />
      <Metric label="On Hold" value={h} dotColor="var(--warning-600)" />
      <Metric label="Expert Review" value={e} dotColor="var(--info-600)" />
    </div>
  );
};

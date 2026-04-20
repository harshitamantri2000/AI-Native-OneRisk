import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  CircleCheck,
  CircleX,
  Sparkles,
  ShieldAlert,
  Zap,
  ChevronDown,
  Layers,
  Search,
  X,
  Clock,
  SendHorizonal,
} from "lucide-react";
import { type RiskLevel } from "../data/cases";
import { type CaseSource, SOURCE_LABELS, SOURCE_CATEGORIES } from "../data/cases";
import { RICH_MOCK_CASES, type RichCaseEntry, type RichCaseStatus } from "../data/mock";

const f = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
} as const;

/* ─── Format date to "Feb 20, 2026" style ─── */
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ─── Derive review type from a case ─── */
type ReviewType = "Quick Approve" | "Intensive Review";
const getReviewType = (item: RichCaseEntry): ReviewType => {
  if (item.riskLevel === "Low") return "Quick Approve";
  if (item.riskLevel === "High") return "Intensive Review";
  return item.aiSuggestion === "Quick Approve" ? "Quick Approve" : "Intensive Review";
};

/* ─── Source chip color config ─── */
const sourceChipCfg: Record<CaseSource, { bg: string; border: string; text: string }> = {
  "entity-dd":       { bg: "color-mix(in srgb, var(--primary) 10%, transparent)", border: "color-mix(in srgb, var(--primary) 20%, transparent)", text: "var(--primary)" },
  "individual-dd":   { bg: "color-mix(in srgb, var(--info-600) 10%, transparent)", border: "color-mix(in srgb, var(--info-600) 20%, transparent)", text: "var(--info-600)" },
  "asset-dd":        { bg: "color-mix(in srgb, var(--success-500) 10%, transparent)", border: "color-mix(in srgb, var(--success-500) 20%, transparent)", text: "var(--success-700)" },
  "court-check":     { bg: "color-mix(in srgb, var(--destructive-500) 8%, transparent)", border: "color-mix(in srgb, var(--destructive-500) 18%, transparent)", text: "var(--destructive-700)" },
  "aml-check":       { bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)", border: "color-mix(in srgb, var(--warning-600) 20%, transparent)", text: "var(--warning-700)" },
  "vehicular-check": { bg: "color-mix(in srgb, var(--info-500) 10%, transparent)", border: "color-mix(in srgb, var(--info-500) 20%, transparent)", text: "var(--info-800)" },
  "bank-statement":  { bg: "color-mix(in srgb, var(--success-700) 10%, transparent)", border: "color-mix(in srgb, var(--success-700) 20%, transparent)", text: "var(--success-700)" },
  "netscan":         { bg: "color-mix(in srgb, var(--neutral-900) 8%, transparent)", border: "color-mix(in srgb, var(--neutral-900) 16%, transparent)", text: "var(--neutral-900)" },
  "bulk-upload":     { bg: "color-mix(in srgb, var(--primary-600) 8%, transparent)", border: "color-mix(in srgb, var(--primary-600) 16%, transparent)", text: "var(--primary-600)" },
};

const SourceChip = ({ source }: { source: CaseSource }) => {
  const cfg = sourceChipCfg[source];
  return (
    <span
      className="inline-flex items-center shrink-0 rounded-full whitespace-nowrap"
      style={{
        ...f,
        fontSize: "var(--text-xs)",
        lineHeight: "1",
        fontWeight: "var(--font-weight-medium)",
        height: "20px",
        padding: "0 7px",
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
      }}
    >
      {SOURCE_LABELS[source]}
    </span>
  );
};

export const CaseTable = ({
  cases = RICH_MOCK_CASES,
  showSources = true,
}: {
  cases?: RichCaseEntry[];
  showSources?: boolean;
}) => {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [reviewFilter, setReviewFilter] = useState<ReviewType | "All">("All");
  const [sourceFilter, setSourceFilter] = useState<CaseSource | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* Apply search + filters */
  const rows = cases.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.industry.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (riskFilter !== "All" && item.riskLevel !== riskFilter) return false;
    if (reviewFilter !== "All" && getReviewType(item) !== reviewFilter) return false;
    if (showSources && sourceFilter !== "All" && item.source !== sourceFilter) return false;
    return true;
  });

  const colFlex = {
    company: "2 1 0%",
    caseId: "0.9 1 0%",
    industry: "1 1 0%",
    created: "0.8 1 0%",
    status: "0.85 1 0%",
    last: "1.6 1 0%",
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">

      {/* ── Search + Filters (single row) ── */}
      <div
        className="flex items-center px-6"
        style={{
          height: 44,
          gap: 12,
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "var(--neutral-0)",
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center rounded-md"
          style={{
            backgroundColor: "var(--surface-inset)",
            border: "1px solid var(--border-subtle)",
            height: 32,
            padding: "0 10px",
            gap: 8,
            flex: "1 1 0%",
            minWidth: 0,
            maxWidth: 320,
          }}
        >
          <Search
            style={{
              width: 14,
              height: 14,
              color: "var(--text-muted-themed)",
              flexShrink: 0,
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or industry..."
            className="flex-1 bg-transparent outline-none border-none"
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-heading)",
              lineHeight: "140%",
              minWidth: 0,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="flex items-center justify-center cursor-pointer border-none bg-transparent shrink-0 rounded-sm transition-colors"
              style={{
                width: 18,
                height: 18,
                padding: 0,
                color: "var(--text-muted-themed)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-heading)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted-themed)";
              }}
            >
              <X style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>

        {/* Divider between search and filters */}
        <div
          className="shrink-0"
          style={{
            width: 1,
            height: 20,
            backgroundColor: "var(--border-subtle)",
          }}
        />

        {/* Filters */}
        <div className="flex items-center shrink-0" style={{ gap: 10 }}>
          {/* Risk Grade filter */}
          <FilterDropdown
            icon={<ShieldAlert style={{ width: 13, height: 13 }} />}
            label="Risk Grade"
            value={riskFilter}
            options={["All", "High", "Medium", "Low"] as const}
            onChange={(v) => setRiskFilter(v as RiskLevel | "All")}
            dotColor={(v: string) =>
              v === "High"
                ? "var(--destructive-500)"
                : v === "Medium"
                  ? "var(--warning-600)"
                  : v === "Low"
                    ? "var(--success-500)"
                    : undefined
            }
          />

          {/* Review Type filter */}
          <FilterDropdown
            icon={<Zap style={{ width: 13, height: 13 }} />}
            label="Review Type"
            value={reviewFilter}
            options={["All", "Quick Approve", "Intensive Review"] as const}
            onChange={(v) => setReviewFilter(v as ReviewType | "All")}
          />

          {/* Source filter — only if showSources is true */}
          {showSources && (
            <SourceFilterDropdown
              value={sourceFilter}
              onChange={(v) => setSourceFilter(v)}
            />
          )}

          {/* Active filter count + clear */}
          {(riskFilter !== "All" || reviewFilter !== "All" || (showSources && sourceFilter !== "All")) && (
            <button
              onClick={() => {
                setRiskFilter("All");
                setReviewFilter("All");
                setSourceFilter("All");
              }}
              className="cursor-pointer"
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                lineHeight: "1",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--primary)",
                background: "none",
                border: "none",
                padding: "4px 8px",
                borderRadius: "var(--radius)",
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Column header ── */}
      <div
        className="flex items-center px-6 py-2.5"
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "var(--neutral-50)",
        }}
      >
        <div
          className="w-full flex items-center"
          style={{
            ...f,
            fontSize: "var(--paragraph-sm-desktop-size)",
            lineHeight: "var(--paragraph-sm-desktop-line-height)",
            letterSpacing: "var(--paragraph-sm-desktop-letter-spacing)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-muted-themed)",
          }}
        >
          <span style={{ flex: colFlex.company, minWidth: 0 }}>Company</span>
          <span style={{ flex: colFlex.caseId, minWidth: 0 }}>Case ID</span>
          <span style={{ flex: colFlex.industry, minWidth: 0 }}>Industry</span>
          <span style={{ flex: colFlex.created, minWidth: 0 }}>Created</span>
          <span style={{ flex: colFlex.status, minWidth: 0 }}>Status</span>
          <span style={{ flex: colFlex.last, minWidth: 0 }}>Risk & AI Suggestion</span>
        </div>
      </div>

      {/* ── Rows ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key="rows"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {rows.length > 0 ? (
            rows.map((item) => (
              <CaseRow
                key={item.id}
                item={item}
                colFlex={colFlex}
                onNavigate={() => navigate(`/workspace/case/${item.id}`)}
                showSources={showSources}
              />
            ))
          ) : (
            <div
              className="px-4 py-12 text-center"
              style={{
                ...f,
                fontSize: "13px",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
              }}
            >
              {searchQuery.trim()
                ? `No cases matching "${searchQuery}"`
                : riskFilter !== "All" || reviewFilter !== "All" || (showSources && sourceFilter !== "All")
                  ? "No cases match the selected filters"
                  : "No cases in queue"}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   Status Indicator — handles all 4 RichCaseStatus values
   ═════════════════════════════════════════════════════════ */
const ProcessStatusIndicator = ({ status }: { status: RichCaseStatus }) => {
  if (status === "Completed") {
    return (
      <div className="inline-flex items-center gap-1.5">
        <CircleCheck
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: "var(--success-500)" }}
        />
        <span
          style={{
            ...f,
            fontSize: "12px",
            lineHeight: "140%",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--success-700)",
          }}
        >
          Completed
        </span>
      </div>
    );
  }

  if (status === "Sent to Credit Head") {
    return (
      <div className="inline-flex items-center gap-1.5">
        <SendHorizonal
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: "var(--info-600)" }}
        />
        <span
          style={{
            ...f,
            fontSize: "12px",
            lineHeight: "140%",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--info-600)",
          }}
        >
          Sent to Credit Head
        </span>
      </div>
    );
  }

  if (status === "In Progress") {
    return (
      <div className="inline-flex items-center gap-1.5">
        <Clock
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: "var(--text-muted-themed)" }}
        />
        <span
          style={{
            ...f,
            fontSize: "12px",
            lineHeight: "140%",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--text-muted-themed)",
          }}
        >
          In Progress
        </span>
      </div>
    );
  }

  /* Failed */
  return (
    <div className="inline-flex items-center gap-1.5">
      <CircleX
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: "var(--destructive-500)" }}
      />
      <span
        style={{
          ...f,
          fontSize: "12px",
          lineHeight: "140%",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--destructive-700)",
        }}
      >
        Failed
      </span>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   Risk Badge (Reviewed tab)
   ══════════════════════════════════════════════════════════ */
const riskCfg: Record<
  RiskLevel,
  { label: string; bg: string; border: string; text: string }
> = {
  High: {
    label: "High",
    bg: "var(--destructive-600)",
    border: "var(--destructive-600)",
    text: "var(--neutral-0)",
  },
  Medium: {
    label: "Medium",
    bg: "var(--warning-600)",
    border: "var(--warning-600)",
    text: "var(--neutral-0)",
  },
  Low: {
    label: "Low",
    bg: "var(--success-500)",
    border: "var(--success-500)",
    text: "var(--neutral-0)",
  },
};

const RiskBadge = ({ riskLevel }: { riskLevel: RiskLevel }) => {
  const risk = riskCfg[riskLevel];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: risk.bg,
        border: `1px solid ${risk.border}`,
        height: "22px",
        ...f,
        fontSize: "11px",
        lineHeight: "140%",
        fontWeight: "var(--font-weight-medium)",
        color: risk.text,
      }}
    >
      {risk.label} Risk
    </span>
  );
};

/* ══════════════════════════════════════════════════════════
   Risk & AI Cell — conditional on process status
   ══════════════════════════════════════════════════════════ */
const RiskAICell = ({
  riskLevel,
  aiSuggestion,
}: {
  riskLevel: RiskLevel;
  aiSuggestion?: string;
}) => {
  /* Risk badge + AI sparkle + action label */
  const risk = riskCfg[riskLevel];
  const actionLabel =
    riskLevel === "Low"
      ? "Quick Approve"
      : riskLevel === "High"
        ? "Intensive Review"
        : /* Medium → per-case */ aiSuggestion === "Quick Approve"
          ? "Quick Approve"
          : "Intensive Review";
  const isQuickApprove = actionLabel === "Quick Approve";
  const actionColor = isQuickApprove
    ? "var(--info-600)"
    : "var(--destructive-600)";

  return (
    <div className="inline-flex items-center gap-2">
      {/* Risk badge */}
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: risk.bg,
          border: `1px solid ${risk.border}`,
          height: "22px",
          ...f,
          fontSize: "11px",
          lineHeight: "140%",
          fontWeight: "var(--font-weight-medium)",
          color: risk.text,
        }}
      >
        {risk.label} Risk
      </span>

      {/* AI sparkle + action label */}
      <span className="inline-flex items-center gap-1">
        <Sparkles
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: actionColor }}
        />
        <span
          style={{
            ...f,
            fontSize: "11px",
            lineHeight: "140%",
            fontWeight: "var(--font-weight-medium)",
            color: actionColor,
          }}
        >
          {actionLabel}
        </span>
      </span>
    </div>
  );
};


/* ─── Case Row Component ─── */
const CaseRow = ({
  item,
  colFlex,
  onNavigate,
  showSources,
}: {
  item: RichCaseEntry;
  colFlex: Record<string, string>;
  onNavigate: () => void;
  showSources: boolean;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rowRef}
      className="relative flex items-center px-6 cursor-pointer transition-colors hover:bg-[var(--surface-hover)]"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        height: "52px",
      }}
      onClick={onNavigate}
    >
      <div className="w-full flex items-center">
        {/* Company */}
        <div
          style={{ flex: colFlex.company, minWidth: 0 }}
          className="flex items-center gap-2"
        >
          <span
            className="truncate"
            style={{
              ...f,
              fontSize: "13px",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--neutral-950)",
            }}
          >
            {item.name}
          </span>
          {showSources && <SourceChip source={item.source} />}
        </div>

        {/* Case ID */}
        <div style={{ flex: colFlex.caseId, minWidth: 0 }}>
          <span
            style={{
              ...f,
              fontSize: "12px",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
            }}
          >
            {item.id}
          </span>
        </div>

        {/* Industry */}
        <div style={{ flex: colFlex.industry, minWidth: 0 }}>
          <span
            className="truncate block"
            style={{
              ...f,
              fontSize: "12px",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-secondary-themed)",
            }}
          >
            {item.industry}
          </span>
        </div>

        {/* Created */}
        <div style={{ flex: colFlex.created, minWidth: 0 }}>
          <span
            style={{
              ...f,
              fontSize: "12px",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
            }}
          >
            {formatDate(item.created)}
          </span>
        </div>

        {/* Status */}
        <div
          style={{ flex: colFlex.status, minWidth: 0 }}
          className="flex items-center"
        >
          <ProcessStatusIndicator status={item.status} />
        </div>

        {/* Risk & AI Suggestion */}
        <div
          style={{ flex: colFlex.last, minWidth: 0 }}
          className="flex items-center"
        >
          <RiskAICell
            riskLevel={item.riskLevel}
            aiSuggestion={item.aiSuggestion}
          />
        </div>
      </div>

    </div>
  );
};

/* ─── Filter Dropdown Component ─── */
const FilterDropdown = ({
  icon,
  label,
  value,
  options,
  onChange,
  dotColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  dotColor?: (v: string) => string | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const isActive = value !== "All";

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        className="flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...f,
          gap: "6px",
          fontSize: "var(--text-sm)",
          lineHeight: "1",
          fontWeight: "var(--font-weight-medium)",
          padding: "6px 10px",
          borderRadius: "var(--radius)",
          border: isActive
            ? "1px solid var(--primary)"
            : "1px solid var(--border-default)",
          backgroundColor: isActive
            ? "color-mix(in srgb, var(--primary) 6%, transparent)"
            : "var(--neutral-0)",
          color: isActive ? "var(--primary)" : "var(--text-secondary-themed)",
          transition: "all 0.15s ease",
        }}
      >
        <span
          className="flex items-center"
          style={{ color: isActive ? "var(--primary)" : "var(--text-muted-themed)" }}
        >
          {icon}
        </span>
        <span>{isActive ? value : label}</span>
        <ChevronDown
          style={{
            width: 12,
            height: 12,
            color: isActive ? "var(--primary)" : "var(--text-muted-themed)",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50"
            style={{
              left: 0,
              top: "calc(100% + 4px)",
              minWidth: "180px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--neutral-0)",
              boxShadow: "var(--shadow-elevated)",
              overflow: "hidden",
              padding: "4px 0",
            }}
          >
            {options.map((opt) => {
              const selected = value === opt;
              return (
                <button
                  key={opt}
                  className="flex items-center w-full cursor-pointer"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  style={{
                    ...f,
                    gap: "8px",
                    fontSize: "var(--text-sm)",
                    lineHeight: "140%",
                    fontWeight: selected
                      ? "var(--font-weight-medium)"
                      : "var(--font-weight-normal)",
                    padding: "8px 12px",
                    border: "none",
                    background: selected
                      ? "color-mix(in srgb, var(--primary) 6%, transparent)"
                      : "none",
                    color: selected ? "var(--primary)" : "var(--text-secondary-themed)",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected)
                      e.currentTarget.style.background = "var(--surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) e.currentTarget.style.background = "none";
                  }}
                >
                  {/* Color dot for risk filter */}
                  {dotColor?.(opt) && (
                    <span
                      className="inline-block rounded-full flex-shrink-0"
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: dotColor(opt),
                      }}
                    />
                  )}
                  <span className="flex-1 text-left">{opt}</span>
                  {selected && (
                    <CircleCheck
                      style={{
                        width: 13,
                        height: 13,
                        color: "var(--primary)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Source Filter Dropdown Component ─── */
const SourceFilterDropdown = ({
  value,
  onChange,
}: {
  value: CaseSource | "All";
  onChange: (v: CaseSource | "All") => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const isActive = value !== "All";
  const displayLabel = isActive ? SOURCE_LABELS[value] : "Source";

  /* Build grouped items list */
  const groups = Object.entries(SOURCE_CATEGORIES);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        className="flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...f,
          gap: "6px",
          fontSize: "var(--text-sm)",
          lineHeight: "1",
          fontWeight: "var(--font-weight-medium)",
          padding: "6px 10px",
          borderRadius: "var(--radius)",
          border: isActive
            ? "1px solid var(--primary)"
            : "1px solid var(--border-default)",
          backgroundColor: isActive
            ? "color-mix(in srgb, var(--primary) 6%, transparent)"
            : "var(--neutral-0)",
          color: isActive ? "var(--primary)" : "var(--text-secondary-themed)",
          transition: "all 0.15s ease",
        }}
      >
        <span
          className="flex items-center"
          style={{ color: isActive ? "var(--primary)" : "var(--text-muted-themed)" }}
        >
          <Layers style={{ width: 13, height: 13 }} />
        </span>
        <span>{displayLabel}</span>
        <ChevronDown
          style={{
            width: 12,
            height: 12,
            color: isActive ? "var(--primary)" : "var(--text-muted-themed)",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50"
            style={{
              left: 0,
              top: "calc(100% + 4px)",
              minWidth: "200px",
              maxHeight: "320px",
              overflowY: "auto",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--neutral-0)",
              boxShadow: "var(--shadow-elevated)",
              padding: "4px 0",
            }}
          >
            {/* All option */}
            <SourceFilterItem
              label="All Sources"
              selected={value === "All"}
              onClick={() => { onChange("All"); setIsOpen(false); }}
            />

            {/* Grouped source options */}
            {groups.map(([groupName, sources]) => (
              <React.Fragment key={groupName}>
                <div
                  style={{
                    ...f,
                    fontSize: "var(--text-xs)",
                    lineHeight: "1",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-muted-themed)",
                    padding: "10px 12px 4px",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.05em",
                  }}
                >
                  {groupName}
                </div>
                {sources.map((src) => {
                  const chipCfg = sourceChipCfg[src];
                  return (
                    <SourceFilterItem
                      key={src}
                      label={SOURCE_LABELS[src]}
                      selected={value === src}
                      dotColor={chipCfg.text}
                      onClick={() => { onChange(src); setIsOpen(false); }}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Source Filter Item ─── */
const SourceFilterItem = ({
  label,
  selected,
  dotColor,
  onClick,
}: {
  label: string;
  selected: boolean;
  dotColor?: string;
  onClick: () => void;
}) => (
  <button
    className="flex items-center w-full cursor-pointer"
    onClick={onClick}
    style={{
      ...f,
      gap: "8px",
      fontSize: "var(--text-sm)",
      lineHeight: "140%",
      fontWeight: selected ? "var(--font-weight-medium)" : "var(--font-weight-normal)",
      padding: "7px 12px",
      border: "none",
      background: selected
        ? "color-mix(in srgb, var(--primary) 6%, transparent)"
        : "none",
      color: selected ? "var(--primary)" : "var(--text-secondary-themed)",
      transition: "background 0.1s",
    }}
    onMouseEnter={(e) => {
      if (!selected) e.currentTarget.style.background = "var(--surface-hover)";
    }}
    onMouseLeave={(e) => {
      if (!selected) e.currentTarget.style.background = "none";
    }}
  >
    {dotColor && (
      <span
        className="inline-block rounded-full flex-shrink-0"
        style={{ width: 8, height: 8, backgroundColor: dotColor }}
      />
    )}
    <span className="flex-1 text-left">{label}</span>
    {selected && (
      <CircleCheck
        style={{ width: 13, height: 13, color: "var(--primary)", flexShrink: 0 }}
      />
    )}
  </button>
);
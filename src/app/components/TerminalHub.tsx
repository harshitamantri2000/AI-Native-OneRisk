import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ChevronDown,
  CircleCheck,
  CircleX,
  Download,
  ExternalLink,
  Link2,
  Filter,
  Gavel,
  ShieldAlert,
  Car,
  FileText,
  Radar,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  MOCK_TERMINAL_CHECKS,
  CHECK_TYPE_LABELS,
  CHECK_TYPE_COLORS,
  type CheckType,
  type CheckStatus,
  type CheckRiskLevel,
  type TerminalCheck,
} from "../data/terminalChecks";

const f = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
} as const;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* ─── Check Type Icons ─── */
const CHECK_ICONS: Record<CheckType, React.ReactNode> = {
  "court-check": <Gavel style={{ width: 13, height: 13 }} />,
  "aml-check": <ShieldAlert style={{ width: 13, height: 13 }} />,
  "vehicular-check": <Car style={{ width: 13, height: 13 }} />,
  "bank-statement": <FileText style={{ width: 13, height: 13 }} />,
  "netscan": <Radar style={{ width: 13, height: 13 }} />,
};

/* ─── Check Type Chip ─── */
const CheckTypeChip = ({ type }: { type: CheckType }) => {
  const cfg = CHECK_TYPE_COLORS[type];
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
        gap: 4,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
      }}
    >
      <span className="flex items-center" style={{ color: cfg.text }}>
        {CHECK_ICONS[type]}
      </span>
      {CHECK_TYPE_LABELS[type]}
    </span>
  );
};

/* ─── Risk Level Badge ─── */
const riskCfg: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  High: {
    bg: "var(--destructive-600)",
    border: "var(--destructive-600)",
    text: "var(--neutral-0)",
  },
  Medium: {
    bg: "var(--warning-600)",
    border: "var(--warning-600)",
    text: "var(--neutral-0)",
  },
  Low: {
    bg: "var(--success-500)",
    border: "var(--success-500)",
    text: "var(--neutral-0)",
  },
  "—": {
    bg: "var(--surface-inset)",
    border: "var(--border-subtle)",
    text: "var(--text-muted-themed)",
  },
};

const RiskBadge = ({ level }: { level: CheckRiskLevel }) => {
  const cfg = riskCfg[level] || riskCfg["—"];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        height: "22px",
        ...f,
        fontSize: "11px",
        lineHeight: "140%",
        fontWeight: "var(--font-weight-medium)",
        color: cfg.text,
      }}
    >
      {level === "—" ? "Pending" : `${level} Risk`}
    </span>
  );
};

/* ─── Status Indicator ─── */
const StatusIndicator = ({ status }: { status: CheckStatus }) => {
  if (status === "Completed") {
    return (
      <div className="inline-flex items-center gap-1.5">
        <CircleCheck
          className="flex-shrink-0"
          style={{ width: 14, height: 14, color: "var(--success-500)" }}
        />
        <span
          style={{
            ...f,
            fontSize: "var(--text-sm)",
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
  if (status === "Processing") {
    return (
      <div className="inline-flex items-center gap-1.5">
        <Loader2
          className="animate-spin flex-shrink-0"
          style={{ width: 14, height: 14, color: "var(--primary)" }}
        />
        <span
          style={{
            ...f,
            fontSize: "var(--text-sm)",
            lineHeight: "140%",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--primary)",
          }}
        >
          Processing
        </span>
      </div>
    );
  }
  if (status === "Failed") {
    return (
      <div className="inline-flex items-center gap-1.5">
        <CircleX
          className="flex-shrink-0"
          style={{ width: 14, height: 14, color: "var(--destructive-500)" }}
        />
        <span
          style={{
            ...f,
            fontSize: "var(--text-sm)",
            lineHeight: "140%",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--destructive-700)",
          }}
        >
          Failed
        </span>
      </div>
    );
  }
  /* Pending */
  return (
    <div className="inline-flex items-center gap-1.5">
      <Clock
        className="flex-shrink-0"
        style={{ width: 14, height: 14, color: "var(--text-muted-themed)" }}
      />
      <span
        style={{
          ...f,
          fontSize: "var(--text-sm)",
          lineHeight: "140%",
          fontWeight: "var(--font-weight-normal)",
          color: "var(--text-muted-themed)",
        }}
      >
        Pending
      </span>
    </div>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) => (
  <div
    className="flex items-center"
    style={{
      gap: 12,
      padding: "12px 16px",
      borderRadius: "var(--radius)",
      backgroundColor: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      flex: "1 1 0%",
      minWidth: 0,
    }}
  >
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--radius)",
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
        color: color,
      }}
    >
      {icon}
    </div>
    <div className="flex flex-col" style={{ gap: 2 }}>
      <span
        style={{
          ...f,
          fontSize: "var(--text-lg)",
          fontWeight: 600,
          color: "var(--text-heading)",
          lineHeight: "1.2",
        }}
      >
        {value}
      </span>
      <span
        style={{
          ...f,
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-normal)",
          color: "var(--text-muted-themed)",
          lineHeight: "1.3",
        }}
      >
        {label}
      </span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Main Terminal Hub Component
   ═══════════════════════════════════════════ */
export const TerminalHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<CheckType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<CheckStatus | "All">("All");
  const [riskFilter, setRiskFilter] = useState<CheckRiskLevel | "All">("All");

  /* Stats */
  const totalChecks = MOCK_TERMINAL_CHECKS.length;
  const completedChecks = MOCK_TERMINAL_CHECKS.filter(
    (c) => c.status === "Completed"
  ).length;
  const highRiskChecks = MOCK_TERMINAL_CHECKS.filter(
    (c) => c.riskLevel === "High"
  ).length;
  const pendingChecks = MOCK_TERMINAL_CHECKS.filter(
    (c) => c.status === "Pending" || c.status === "Processing"
  ).length;

  /* Filtered data */
  const rows = MOCK_TERMINAL_CHECKS.filter((item) => {
    if (typeFilter !== "All" && item.checkType !== typeFilter) return false;
    if (statusFilter !== "All" && item.status !== statusFilter) return false;
    if (riskFilter !== "All" && item.riskLevel !== riskFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !item.entityName.toLowerCase().includes(q) &&
        !item.id.toLowerCase().includes(q) &&
        !item.entityId.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const hasActiveFilters =
    typeFilter !== "All" ||
    statusFilter !== "All" ||
    riskFilter !== "All" ||
    searchQuery.trim().length > 0;

  const colFlex = {
    entity: "2.2 1 0%",
    checkId: "1 1 0%",
    type: "1.2 1 0%",
    created: "1 1 0%",
    status: "1 1 0%",
    risk: "0.8 1 0%",
    actions: "0.5 1 0%",
  };

  return (
    <main
      className="flex-1 flex flex-col h-screen overflow-hidden relative"
      style={{ backgroundColor: "var(--neutral-50)" }}
    >
      {/* ── Breadcrumb ── */}
      <div
        className="shrink-0"
        style={{
          backgroundColor: "var(--surface-card)",
          borderBottom: "1px solid var(--neutral-100)",
        }}
      >
        <div className="flex items-center px-6" style={{ height: 36 }}>
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-muted-themed)",
            }}
          >
            Search Terminal
          </span>
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 14 14"
            className="shrink-0"
          >
            <path
              d="M5.25 3.5L8.75 7L5.25 10.5"
              stroke="var(--sidebar-icon-color)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-heading)",
            }}
          >
            Terminal
          </span>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Page Title */}
        <div
          className="px-6 pt-5 pb-4"
          style={{ backgroundColor: "var(--surface-card)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-lg)",
                  lineHeight: "140%",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                Terminal
              </span>
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  lineHeight: "140%",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--text-muted-themed)",
                }}
              >
                All standalone verification checks — Court, AML, Vehicular, Bank
                Statement & Netscan
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="px-6 pb-4"
          style={{ backgroundColor: "var(--surface-card)" }}
        >
          <div className="flex" style={{ gap: 12 }}>
            <StatCard
              label="Total Checks"
              value={totalChecks}
              color="var(--primary)"
              icon={<Filter style={{ width: 18, height: 18 }} />}
            />
            <StatCard
              label="Completed"
              value={completedChecks}
              color="var(--success-500)"
              icon={<CircleCheck style={{ width: 18, height: 18 }} />}
            />
            <StatCard
              label="High Risk"
              value={highRiskChecks}
              color="var(--destructive-500)"
              icon={<AlertTriangle style={{ width: 18, height: 18 }} />}
            />
            <StatCard
              label="In Progress"
              value={pendingChecks}
              color="var(--warning-600)"
              icon={<Clock style={{ width: 18, height: 18 }} />}
            />
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: 8, backgroundColor: "var(--neutral-50)" }} />

        {/* Table Section */}
        <div
          style={{
            backgroundColor: "var(--surface-card)",
            borderTop: "1px solid var(--border-subtle)",
            minHeight: "calc(100vh - 320px)",
          }}
        >
          {/* Filter Bar */}
          <div
            className="flex items-center px-6 py-2.5"
            style={{
              gap: 12,
              borderBottom: "1px solid var(--border-subtle)",
              backgroundColor: "var(--neutral-0)",
            }}
          >
            {/* Search */}
            <div
              className="flex items-center"
              style={{
                flex: "0 0 220px",
                height: 32,
                padding: "0 10px",
                gap: 6,
                borderRadius: "var(--radius)",
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--input-background)",
              }}
            >
              <Search
                style={{
                  width: 13,
                  height: 13,
                  color: "var(--text-muted-themed)",
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entity or check ID…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--text-body)",
                }}
              />
            </div>

            {/* Check Type filter */}
            <TerminalFilterDropdown
              label="Check Type"
              value={typeFilter}
              options={[
                "All",
                "court-check",
                "aml-check",
                "vehicular-check",
                "bank-statement",
                "netscan",
              ]}
              displayFn={(v) =>
                v === "All" ? "All Types" : CHECK_TYPE_LABELS[v as CheckType]
              }
              onChange={(v) => setTypeFilter(v as CheckType | "All")}
            />

            {/* Status filter */}
            <TerminalFilterDropdown
              label="Status"
              value={statusFilter}
              options={["All", "Completed", "Processing", "Pending", "Failed"]}
              displayFn={(v) => (v === "All" ? "All Status" : v)}
              onChange={(v) => setStatusFilter(v as CheckStatus | "All")}
            />

            {/* Risk filter */}
            <TerminalFilterDropdown
              label="Risk"
              value={riskFilter}
              options={["All", "High", "Medium", "Low"]}
              displayFn={(v) => (v === "All" ? "All Risk" : v)}
              onChange={(v) => setRiskFilter(v as CheckRiskLevel | "All")}
              dotColor={(v) =>
                v === "High"
                  ? "var(--destructive-500)"
                  : v === "Medium"
                    ? "var(--warning-600)"
                    : v === "Low"
                      ? "var(--success-500)"
                      : undefined
              }
            />

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setTypeFilter("All");
                  setStatusFilter("All");
                  setRiskFilter("All");
                  setSearchQuery("");
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
                  marginLeft: "auto",
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Column Header */}
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
                fontSize: "var(--text-sm)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-muted-themed)",
              }}
            >
              <span style={{ flex: colFlex.entity, minWidth: 0 }}>Entity</span>
              <span style={{ flex: colFlex.checkId, minWidth: 0 }}>Check ID</span>
              <span style={{ flex: colFlex.type, minWidth: 0 }}>Check Type</span>
              <span style={{ flex: colFlex.created, minWidth: 0 }}>Created</span>
              <span style={{ flex: colFlex.status, minWidth: 0 }}>Status</span>
              <span style={{ flex: colFlex.risk, minWidth: 0 }}>Risk</span>
              <span
                style={{
                  flex: colFlex.actions,
                  minWidth: 0,
                  textAlign: "right",
                }}
              >
                Actions
              </span>
            </div>
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${typeFilter}-${statusFilter}-${riskFilter}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {rows.length > 0 ? (
                rows.map((item) => (
                  <TerminalCheckRow
                    key={item.id}
                    item={item}
                    colFlex={colFlex}
                  />
                ))
              ) : (
                <div
                  className="px-4 py-12 text-center"
                  style={{
                    ...f,
                    fontSize: "var(--text-base)",
                    lineHeight: "140%",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  {hasActiveFilters
                    ? "No checks match the selected filters"
                    : "No terminal checks yet. Use the sidebar to initiate a check."}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Results count */}
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{
              borderTop: "1px solid var(--border-subtle)",
              backgroundColor: "var(--neutral-50)",
            }}
          >
            <span
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                lineHeight: "1",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-muted-themed)",
              }}
            >
              Showing {rows.length} of {MOCK_TERMINAL_CHECKS.length} checks
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

/* ═══════════════════════════════════════════
   Terminal Check Row
   ═══════════════════════════════════════════ */
const TerminalCheckRow = ({
  item,
  colFlex,
}: {
  item: TerminalCheck;
  colFlex: Record<string, string>;
}) => {
  return (
    <div
      className="flex items-center px-6 cursor-pointer transition-colors hover:bg-[var(--surface-hover)]"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        height: "52px",
      }}
    >
      <div className="w-full flex items-center">
        {/* Entity */}
        <div
          style={{ flex: colFlex.entity, minWidth: 0 }}
          className="flex flex-col"
        >
          <span
            className="truncate"
            style={{
              ...f,
              fontSize: "var(--text-base)",
              lineHeight: "1.3",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--neutral-950)",
            }}
          >
            {item.entityName}
          </span>
          <span
            className="truncate"
            style={{
              ...f,
              fontSize: "var(--text-xs)",
              lineHeight: "1.3",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
            }}
          >
            {item.entityId}
          </span>
        </div>

        {/* Check ID */}
        <div style={{ flex: colFlex.checkId, minWidth: 0 }}>
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
            }}
          >
            {item.id}
          </span>
        </div>

        {/* Check Type */}
        <div style={{ flex: colFlex.type, minWidth: 0 }}>
          <CheckTypeChip type={item.checkType} />
        </div>

        {/* Created */}
        <div style={{ flex: colFlex.created, minWidth: 0 }}>
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
            }}
          >
            {formatDate(item.createdAt)}
          </span>
        </div>

        {/* Status */}
        <div style={{ flex: colFlex.status, minWidth: 0 }}>
          <StatusIndicator status={item.status} />
        </div>

        {/* Risk */}
        <div style={{ flex: colFlex.risk, minWidth: 0 }}>
          <RiskBadge level={item.riskLevel} />
        </div>

        {/* Actions */}
        <div
          style={{
            flex: colFlex.actions,
            minWidth: 0,
            display: "flex",
            justifyContent: "flex-end",
            gap: 6,
          }}
        >
          {item.status === "Completed" && item.reportUrl && (
            <button
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius)",
                backgroundColor: "transparent",
                border: "1px solid var(--border-default)",
                cursor: "pointer",
                color: "var(--text-muted-themed)",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                e.currentTarget.style.color = "var(--primary)";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-muted-themed)";
                e.currentTarget.style.borderColor = "var(--border-default)";
              }}
              title="Download Report"
            >
              <Download style={{ width: 13, height: 13 }} />
            </button>
          )}
          {item.status === "Completed" && (
            <button
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius)",
                backgroundColor: "transparent",
                border: "1px solid var(--border-default)",
                cursor: "pointer",
                color: "var(--text-muted-themed)",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                e.currentTarget.style.color = "var(--primary)";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-muted-themed)";
                e.currentTarget.style.borderColor = "var(--border-default)";
              }}
              title="View Details"
            >
              <ExternalLink style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Filter Dropdown
   ═══════════════════════════════════════════ */
const TerminalFilterDropdown = ({
  label,
  value,
  options,
  displayFn,
  onChange,
  dotColor,
}: {
  label: string;
  value: string;
  options: string[];
  displayFn: (v: string) => string;
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
        <span>{isActive ? displayFn(value) : label}</span>
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
                    color: selected
                      ? "var(--primary)"
                      : "var(--text-secondary-themed)",
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
                  <span className="flex-1 text-left">{displayFn(opt)}</span>
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
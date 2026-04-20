import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Bell,
  Upload,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Car,
  Gavel,
  Search,
  X,
  Check,
  CheckCircle2,
  ChevronRight as Chevron,
  FileText,
  Layers,
  Sparkles,
  ArrowRight,
  User,
  Users,
  Building2,
  Plus,
} from "lucide-react";
import idfyPaths from "../../imports/svg-2t4o7mlshq";
import { CaseTable } from "./CaseTable";
import { MOCK_CASES, type CaseEntry } from "../data/cases";

/* ─────────────────────────────────────────────────────────────
   TOKEN SHORTCUTS
───────────────────────────────────────────────────────────── */
const f: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatDate = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
type Role = "underwriter" | "credithead";
type UserType = "newuser" | "regular";

interface LoanType {
  id: string;
  label: string;
  meta: string;
  bgColor: string;
  wireColor: string;
  size: "large" | "small";
}

interface CheckType {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const LOAN_TYPES: LoanType[] = [
  {
    id: "small-business",
    label: "Small Business Loan",
    meta: "Individual PAN · Non-company · 5 checks",
    bgColor: "color-mix(in srgb, var(--primary) 6%, var(--neutral-0))",
    wireColor: "var(--primary)",
    size: "large",
  },
  {
    id: "large-business",
    label: "Medium / Large Business Loan",
    meta: "Company PAN · Registered entity · 6 checks",
    bgColor: "color-mix(in srgb, var(--primary) 6%, var(--neutral-0))",
    wireColor: "var(--primary)",
    size: "large",
  },
  {
    id: "msme-lap",
    label: "MSME — LAP",
    meta: "Loan Against Property · MSME segment",
    bgColor: "color-mix(in srgb, var(--destructive-200) 35%, var(--neutral-0))",
    wireColor: "var(--destructive-500)",
    size: "small",
  },
  {
    id: "vehicle-commercial",
    label: "Used Vehicle — Commercial",
    meta: "Fleet & commercial vehicle",
    bgColor: "color-mix(in srgb, var(--success-200) 40%, var(--neutral-0))",
    wireColor: "var(--success-700)",
    size: "small",
  },
  {
    id: "home-loan",
    label: "Home Loan",
    meta: "Individual borrower",
    bgColor: "color-mix(in srgb, var(--info-200) 40%, var(--neutral-0))",
    wireColor: "var(--info-600)",
    size: "small",
  },
  {
    id: "vehicle-individual",
    label: "Used Vehicle — Individual",
    meta: "Personal vehicle",
    bgColor: "color-mix(in srgb, var(--neutral-100) 60%, var(--neutral-0))",
    wireColor: "var(--neutral-200)",
    size: "small",
  },
];

const CHECKS: CheckType[] = [
  {
    id: "aml",
    label: "AML Check",
    desc: "Screen against global sanctions & adverse media",
    icon: <ShieldAlert size={16} strokeWidth={1.8} />,
    iconBg: "rgba(203,113,0,0.1)",
  },
  {
    id: "vehicular",
    label: "Vehicular Check",
    desc: "RC verification, ownership & hypothecation",
    icon: <Car size={16} strokeWidth={1.8} />,
    iconBg: "rgba(226,51,24,0.09)",
  },
  {
    id: "court",
    label: "Court Records",
    desc: "Litigation history across district, HC & SC",
    icon: <Gavel size={16} strokeWidth={1.8} />,
    iconBg: "rgba(23,102,214,0.10)",
  },
];

const OPTIONAL_DOCS = [
  {
    id: "itr",
    label: "ITR — Last 3 Years",
    desc: "Income Tax Returns for the past 3 financial years",
  },
  {
    id: "bank",
    label: "Bank Statements — Last 12 Months",
    desc: "Complete bank statement for all accounts",
  },
  {
    id: "gst",
    label: "GST Returns — Last 4 Quarters",
    desc: "Quarterly GST return filings (GSTR-1, GSTR-3B)",
  },
  {
    id: "audited",
    label: "Audited Financial Statements",
    desc: "Audited P&L, Balance Sheet, and Cash Flow",
  },
];

/* ─────────────────────────────────────────────────────────────
   WIREFRAME PLACEHOLDER (card preview illustration)
───────────────────────────────────────────────────────────── */
const WireframePlaceholder: React.FC<{
  wireColor: string;
  height?: number;
}> = ({ wireColor, height = 148 }) => (
  <div
    style={{
      width: "100%",
      height,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "18px 22px",
      gap: 8,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          backgroundColor: wireColor,
          opacity: 0.18,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 99,
          backgroundColor: wireColor,
          opacity: 0.14,
        }}
      />
    </div>
    {[88, 70, 55, 78].map((w, i) => (
      <div
        key={i}
        style={{
          width: `${w}%`,
          height: i === 0 ? 7 : 5,
          borderRadius: 99,
          backgroundColor: wireColor,
          opacity: i === 0 ? 0.15 : 0.09,
        }}
      />
    ))}
    {/* mini network dots */}
    <div
      style={{
        display: "flex",
        gap: 6,
        alignItems: "center",
        marginTop: 4,
      }}
    >
      {[1, 0.6, 0.4, 0.7, 0.5].map((o, i) => (
        <div
          key={i}
          style={{
            width: i === 2 ? 12 : 8,
            height: i === 2 ? 12 : 8,
            borderRadius: "50%",
            backgroundColor: wireColor,
            opacity: o * 0.4,
          }}
        />
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   IDfy LOGO (reused from Sidebar)
───────────────────────────────────────────────────────────── */
const LogoIcon = ({ collapsed }: { collapsed?: boolean }) => (
  <div
    style={{
      width: collapsed ? 32 : 36,
      height: collapsed ? 20 : 24,
      flexShrink: 0,
      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    }}
  >
    <svg
      style={{ width: "100%", height: "100%" }}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 53.0401 34"
    >
      <ellipse cx="16.9646" cy="17" fill="white" rx="16.9646" ry="17" />
      <path d={idfyPaths.p2a9ce700} fill="#CE1417" />
      <path d={idfyPaths.p3cd9e980} fill="#CE1417" />
      <path d={idfyPaths.p198bdc80} fill="var(--neutral-900)" />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   ROLE TOGGLE (inline pill inside sidebar footer)
───────────────────────────────────────────────────────────── */
const RoleSwitcher: React.FC<{
  role: Role;
  onChange: (r: Role) => void;
  expanded: boolean;
}> = ({ role, onChange, expanded }) => {
  if (!expanded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background:
              role === "underwriter"
                ? "var(--primary)"
                : "color-mix(in srgb, var(--neutral-900) 80%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "none",
          }}
          onClick={() =>
            onChange(role === "underwriter" ? "credithead" : "underwriter")
          }
          title={
            role === "underwriter"
              ? "Switch to Credit Head"
              : "Switch to Underwriter"
          }
        >
          {role === "underwriter" ? (
            <User size={14} color="white" strokeWidth={1.8} />
          ) : (
            <Users size={14} color="white" strokeWidth={1.8} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "var(--neutral-100)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        padding: 3,
        gap: 2,
        marginTop: 10,
        position: "relative",
      }}
    >
      {(["underwriter", "credithead"] as Role[]).map((r) => {
        const active = role === r;
        return (
          <button
            key={r}
            onClick={() => onChange(r)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "5px 8px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              position: "relative",
              zIndex: 1,
              ...f,
              fontSize: "var(--text-sm)",
              fontWeight: active ? 700 : 500,
              color: active
                ? "var(--text-heading)"
                : "var(--text-muted-themed)",
              transition: "color 0.18s",
              whiteSpace: "nowrap",
            }}
          >
            {active && (
              <motion.div
                layoutId="ws-role-pill"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 8,
                  backgroundColor: "var(--neutral-0)",
                  border: "1px solid var(--border-subtle)",
                }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              />
            )}
            <span
              style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 4 }}
            >
              {r === "underwriter" ? (
                <>
                  <User size={11} strokeWidth={2} /> UW
                </>
              ) : (
                <>
                  <Users size={11} strokeWidth={2} /> CH
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────── */
const WorkspaceSidebar: React.FC<{
  role: Role;
  onRoleChange: (r: Role) => void;
}> = ({ role, onRoleChange }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);
  const transitionCSS = "all 0.3s cubic-bezier(0.4,0,0.2,1)";
  const sidebarWidth = expanded ? 248 : 68;
  const iconSize = 18;

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    height: 38,
    padding: expanded ? "0 12px" : "0",
    justifyContent: expanded ? "flex-start" : "center",
    gap: 10,
    backgroundColor: active ? "var(--sidebar-active-bg)" : "transparent",
    border: "none",
    borderRadius: "var(--radius)",
    margin: expanded ? "0 8px" : "0 6px",
    width: expanded ? "calc(100% - 16px)" : "calc(100% - 12px)",
    transition: transitionCSS,
    cursor: "pointer",
  });

  const labelStyle = (active: boolean): React.CSSProperties => ({
    ...f,
    fontWeight: active ? 600 : 500,
    fontSize: 14,
    lineHeight: "20px",
    letterSpacing: "0.056px",
    color: active
      ? "var(--sidebar-accent-foreground)"
      : "var(--sidebar-foreground)",
  });

  const iconColor = (active: boolean) =>
    active ? "var(--sidebar-accent-foreground)" : "var(--sidebar-icon-color)";

  const NavBtn: React.FC<{
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }> = ({ active, icon, label, onClick }) => (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      style={{
        ...navItemStyle(active),
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={(e) => {
        if (!active)
          e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = active
          ? "var(--sidebar-active-bg)"
          : "transparent";
      }}
    >
      <span
        style={{
          width: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: iconColor(active),
        }}
      >
        {icon}
      </span>
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.span
            key={label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.12 }}
            style={{ ...labelStyle(active), flex: 1, textAlign: "left", whiteSpace: "nowrap" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        height: "100vh",
        flexShrink: 0,
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border-color)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
        zIndex: 20,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Collapse toggle */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => setExpanded((p) => !p)}
            style={{
              position: "absolute",
              top: 18,
              right: -12,
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "var(--neutral-0)",
              border: "1px solid var(--sidebar-border-color)",
              color: "var(--sidebar-icon-color)",
              zIndex: 30,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--neutral-100)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--neutral-0)";
            }}
          >
            {expanded ? (
              <ChevronLeft size={13} strokeWidth={2} />
            ) : (
              <ChevronRight size={13} strokeWidth={2} />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Inner wrapper */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Logo header */}
        <div
          style={{
            height: 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            padding: expanded ? "0 16px" : "0",
            justifyContent: expanded ? "flex-start" : "center",
            borderBottom: "1px solid var(--sidebar-border-color)",
            transition: transitionCSS,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <LogoIcon collapsed={!expanded} />
            <AnimatePresence mode="wait">
              {expanded && (
                <motion.span
                  key="brand"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    ...f,
                    fontWeight: 700,
                    fontSize: 16,
                    lineHeight: "22px",
                    letterSpacing: "-0.2px",
                    color: "var(--text-heading)",
                    whiteSpace: "nowrap",
                  }}
                >
                  OneRisk
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            padding: "8px 0",
            gap: 2,
          }}
        >
          <NavBtn
            active={true}
            icon={
              <Layers size={iconSize} strokeWidth={1.8} color={iconColor(true)} />
            }
            label="Workspace"
            onClick={() => {}}
          />
          <NavBtn
            active={false}
            icon={
              <div style={{ position: "relative", display: "inline-flex" }}>
                <Bell size={iconSize} strokeWidth={1.8} color={iconColor(false)} />
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "var(--destructive-500)",
                    border: "1.5px solid var(--sidebar-bg)",
                  }}
                />
              </div>
            }
            label="Alerts"
            onClick={() => navigate("/alerts")}
          />
          <NavBtn
            active={false}
            icon={
              <Upload size={iconSize} strokeWidth={1.8} color={iconColor(false)} />
            }
            label="Bulk Upload"
            onClick={() => navigate("/bulk-upload")}
          />
        </nav>

        {/* Footer with user + role switcher */}
        <div
          style={{
            flexShrink: 0,
            borderTop: "1px solid var(--sidebar-border-color)",
            padding: expanded ? "10px 12px 12px" : "10px 6px 12px",
            transition: transitionCSS,
          }}
        >
          {/* User row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: expanded ? "4px 4px" : "4px 0",
              justifyContent: expanded ? "flex-start" : "center",
              borderRadius: 8,
              cursor: "pointer",
              transition: transitionCSS,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background:
                  role === "underwriter"
                    ? "var(--primary)"
                    : "var(--neutral-900)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1,
                }}
              >
                {role === "underwriter" ? "HM" : "VM"}
              </span>
            </div>
            <AnimatePresence mode="wait">
              {expanded && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.12 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div
                    style={{
                      ...f,
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {role === "underwriter" ? "Harish M" : "Vikram Mehta"}
                  </div>
                  <div
                    style={{
                      ...f,
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted-themed)",
                      lineHeight: "14px",
                      whiteSpace: "nowrap",
                      marginTop: 1,
                    }}
                  >
                    {role === "underwriter" ? "Sr. Credit Analyst" : "Credit Head"}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Role switcher pill */}
          <RoleSwitcher role={role} onChange={onRoleChange} expanded={expanded} />
        </div>
      </div>
    </motion.aside>
  );
};

/* ─────────────────────────────────────────────────────────────
   OPTIONAL DOCS MODAL (Step 1)
───────────────────────────────────────────────────────────── */
const OptionalDocsModal: React.FC<{
  loanLabel: string;
  onContinue: (selected: string[]) => void;
  onClose: () => void;
}> = ({ loanLabel, onContinue, onClose }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10,13,19,0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22 }}
        style={{
          background: "var(--neutral-0)",
          borderRadius: 14,
          width: 520,
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                ...f,
                fontSize: "var(--text-md)",
                fontWeight: 700,
                color: "var(--text-heading)",
                lineHeight: "1.3",
              }}
            >
              Optional Documents
            </div>
            <div
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                color: "var(--text-muted-themed)",
                marginTop: 3,
              }}
            >
              {loanLabel} — select any supporting documents to attach
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: "1px solid var(--border-subtle)",
              background: "var(--neutral-50)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--text-muted-themed)",
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Doc list */}
        <div style={{ padding: "12px 24px 8px" }}>
          {OPTIONAL_DOCS.map((doc) => {
            const checked = selected.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => toggle(doc.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 9,
                  cursor: "pointer",
                  marginBottom: 4,
                  border: `1px solid ${checked ? "rgba(23,102,214,0.25)" : "var(--border-subtle)"}`,
                  background: checked
                    ? "rgba(23,102,214,0.04)"
                    : "var(--neutral-0)",
                  transition: "all 0.15s",
                }}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `1.5px solid ${checked ? "var(--primary)" : "var(--border-default)"}`,
                    background: checked ? "var(--primary)" : "transparent",
                    flexShrink: 0,
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  {checked && <Check size={11} color="white" strokeWidth={3} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      ...f,
                      fontSize: "var(--text-base)",
                      fontWeight: 600,
                      color: checked ? "var(--primary)" : "var(--text-heading)",
                      lineHeight: "20px",
                    }}
                  >
                    {doc.label}
                  </div>
                  <div
                    style={{
                      ...f,
                      fontSize: "var(--text-sm)",
                      color: "var(--text-muted-themed)",
                      marginTop: 2,
                    }}
                  >
                    {doc.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 24px 20px",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => onContinue([])}
            style={{
              ...f,
              fontSize: "var(--text-base)",
              fontWeight: 600,
              padding: "8px 18px",
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--neutral-50)",
              color: "var(--text-body)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--neutral-100)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--neutral-50)";
            }}
          >
            Skip &amp; Continue
          </button>
          <button
            onClick={() => onContinue(selected)}
            style={{
              ...f,
              fontSize: "var(--text-base)",
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "var(--primary)",
              color: "white",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--primary-600)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--primary)";
            }}
          >
            {selected.length > 0
              ? `Continue with ${selected.length} doc${selected.length > 1 ? "s" : ""}`
              : "Continue"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ──────────────────���──────────────────────────────────────────
   CASE CREATION MODAL (Step 2)
───────────────────────────────────────────────────────────── */
const CaseCreationModal: React.FC<{
  loanLabel: string;
  selectedDocs: string[];
  onCreateCase: (entityName: string) => void;
  onBack: () => void;
  onClose: () => void;
}> = ({ loanLabel, selectedDocs, onCreateCase, onBack, onClose }) => {
  const [entityQuery, setEntityQuery] = useState("TechFlow Solutions");
  const [loanAmount, setLoanAmount] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (!entityQuery.trim()) return;
    setCreating(true);
    setTimeout(() => {
      onCreateCase(entityQuery.trim());
    }, 900);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10,13,19,0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22 }}
        style={{
          background: "var(--neutral-0)",
          borderRadius: 14,
          width: 560,
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
        }}
      >
        {/* Breadcrumb header */}
        <div
          style={{
            padding: "8px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--neutral-50)",
          }}
        >
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted-themed)",
            }}
          >
            Risk Bundles
          </span>
          <Chevron size={13} color="var(--border-default)" />
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted-themed)",
            }}
          >
            {loanLabel}
          </span>
          <Chevron size={13} color="var(--border-default)" />
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Create New Case
          </span>
        </div>

        {/* Title bar */}
        <div
          style={{
            padding: "16px 24px 14px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            onClick={onBack}
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              border: "1px solid var(--border-subtle)",
              background: "var(--neutral-0)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--text-muted-themed)",
            }}
          >
            <ChevronLeft size={14} strokeWidth={2} />
          </button>
          <span
            style={{
              ...f,
              fontSize: "var(--text-md)",
              fontWeight: 700,
              color: "var(--text-heading)",
            }}
          >
            Create New Case
          </span>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: "1px solid var(--border-subtle)",
              background: "var(--neutral-50)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted-themed)",
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Form body */}
        <div style={{ padding: "20px 24px" }}>
          {/* Entity Identification */}
          <div
            style={{
              border: "1px solid var(--border-subtle)",
              borderRadius: 9,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: "14px 18px 10px",
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--neutral-50)",
              }}
            >
              <div
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                Entity Identification
              </div>
              <div
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted-themed)",
                  marginTop: 3,
                }}
              >
                Search by CIN, PAN, or company name to auto-populate entity details.
              </div>
            </div>
            <div style={{ padding: "12px 18px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid var(--border-default)",
                  borderRadius: 8,
                  padding: "0 12px",
                  height: 40,
                  background: "var(--neutral-0)",
                }}
              >
                <Search size={14} color="var(--text-muted-themed)" strokeWidth={1.8} />
                <input
                  value={entityQuery}
                  onChange={(e) => setEntityQuery(e.target.value)}
                  placeholder="Search entity name, CIN, or PAN..."
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    ...f,
                    fontSize: "var(--text-sm)",
                    color: "var(--text-heading)",
                  }}
                />
                {entityQuery && (
                  <button
                    onClick={() => setEntityQuery("")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "var(--text-muted-themed)",
                    }}
                  >
                    <X size={13} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loan details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Loan Type
              </label>
              <div
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-body)",
                  padding: "9px 12px",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  background: "var(--neutral-50)",
                }}
              >
                {loanLabel}
              </div>
            </div>
            <div>
              <label
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Loan Amount (₹)
              </label>
              <input
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="e.g. 5,00,00,000"
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-heading)",
                  padding: "9px 12px",
                  border: "1px solid var(--border-default)",
                  borderRadius: 8,
                  background: "var(--neutral-0)",
                  width: "100%",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Selected docs summary */}
          {selectedDocs.length > 0 && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid rgba(23,102,214,0.20)",
                background: "rgba(23,102,214,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <FileText size={14} color="var(--primary)" strokeWidth={1.8} />
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  color: "var(--primary)",
                  fontWeight: 500,
                }}
              >
                {selectedDocs.length} optional document
                {selectedDocs.length > 1 ? "s" : ""} will be requested from the
                applicant
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "0 24px 20px",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              ...f,
              fontSize: "var(--text-base)",
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--neutral-50)",
              color: "var(--text-body)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--neutral-100)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--neutral-50)";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!entityQuery.trim() || creating}
            style={{
              ...f,
              fontSize: "var(--text-base)",
              fontWeight: 600,
              padding: "9px 22px",
              borderRadius: 8,
              border: "none",
              background: entityQuery.trim() ? "var(--primary)" : "rgba(23,102,214,0.32)",
              color: "white",
              cursor: entityQuery.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 7,
              opacity: creating ? 0.7 : 1,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (entityQuery.trim() && !creating)
                e.currentTarget.style.background = "var(--primary-600)";
            }}
            onMouseLeave={(e) => {
              if (entityQuery.trim())
                e.currentTarget.style.background = "var(--primary)";
            }}
          >
            {creating ? (
              <>
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTop: "2px solid white",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Creating...
              </>
            ) : (
              <>
                <Plus size={14} strokeWidth={2.2} />
                Create Case
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SUCCESS TOAST
───────────────────────────────────────────────────────────── */
const SuccessToast: React.FC<{ entityName: string; caseId: string }> = ({
  entityName,
  caseId,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    style={{
      position: "fixed",
      bottom: 30,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 200,
      background: "var(--neutral-900)",
      borderRadius: 12,
      padding: "14px 20px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "var(--success-700)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <CheckCircle2 size={16} color="white" strokeWidth={2} />
    </div>
    <div>
      <div
        style={{
          ...f,
          fontSize: "var(--text-base)",
          fontWeight: 600,
          color: "white",
          lineHeight: "18px",
        }}
      >
        Case created — {caseId}
      </div>
      <div
        style={{
          ...f,
          fontSize: "var(--text-sm)",
          color: "rgba(255,255,255,0.6)",
          marginTop: 2,
        }}
      >
        {entityName} added to your workspace
      </div>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   LOAN CARD (large + small variants)
───────────────────────────────────────────────────────────── */
const LoanCard: React.FC<{ loan: LoanType; onClick: () => void }> = ({
  loan,
  onClick,
}) => {
  const [hov, setHov] = useState(false);

  if (loan.size === "large") {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          flex: "1 1 440px",
          minWidth: 300,
          maxWidth: 500,
          borderRadius: 10,
          border: `1px solid ${hov ? "rgba(23,102,214,0.35)" : "var(--border-subtle)"}`,
          background: "var(--neutral-0)",
          cursor: "pointer",
          textAlign: "left",
          overflow: "hidden",
          transition: "border-color 0.18s",
          padding: 0,
        }}
      >
        {/* Illustration area */}
        <div
          style={{
            width: "100%",
            height: 166,
            background: loan.bgColor,
            borderRadius: "10px 10px 0 0",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WireframePlaceholder wireColor={loan.wireColor} height={148} />
        </div>
        {/* Label */}
        <div style={{ padding: "10px 16px 14px" }}>
          <div
            style={{
              ...f,
              fontSize: "var(--text-md)",
              fontWeight: 600,
              color: "var(--text-heading)",
              lineHeight: "22px",
            }}
          >
            {loan.label}
          </div>
          <div
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted-themed)",
              marginTop: 3,
            }}
          >
            {loan.meta}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: "1 1 200px",
        minWidth: 180,
        maxWidth: 260,
        borderRadius: 10,
        border: `1px solid ${hov ? "rgba(23,102,214,0.35)" : "var(--border-subtle)"}`,
        background: "var(--neutral-0)",
        cursor: "pointer",
        textAlign: "left",
        overflow: "hidden",
        transition: "border-color 0.18s",
        padding: 0,
      }}
    >
      {/* Small illustration */}
      <div
        style={{
          width: "100%",
          height: 100,
          background: loan.bgColor,
          borderRadius: "10px 10px 0 0",
          overflow: "hidden",
        }}
      >
        <WireframePlaceholder wireColor={loan.wireColor} height={90} />
      </div>
      <div style={{ padding: "8px 14px 12px" }}>
        <div
          style={{
            ...f,
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--text-heading)",
            lineHeight: "20px",
          }}
        >
          {loan.label}
        </div>
        <div
          style={{
            ...f,
            fontSize: "var(--text-sm)",
            color: "var(--text-muted-themed)",
            marginTop: 2,
          }}
        >
          {loan.meta}
        </div>
      </div>
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   CHECK CARD
───────────────────────────────────────────────────────────── */
const CheckCard: React.FC<{ check: CheckType }> = ({ check }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: "1 1 280px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 10,
        border: `1px solid ${hov ? "rgba(23,102,214,0.25)" : "var(--border-subtle)"}`,
        background: "var(--neutral-0)",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.15s",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: check.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--primary)",
        }}
      >
        {check.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            ...f,
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--text-heading)",
            lineHeight: "20px",
          }}
        >
          {check.label}
        </div>
        <div
          style={{
            ...f,
            fontSize: "var(--text-sm)",
            color: "var(--text-muted-themed)",
            marginTop: 2,
          }}
        >
          {check.desc}
        </div>
      </div>
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   USER TYPE TOGGLE (New User | Regular)
───────────────────────────────────────────────────────────── */
const UserTypeToggle: React.FC<{
  value: UserType;
  onChange: (v: UserType) => void;
}> = ({ value, onChange }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      background: "var(--neutral-100)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 10,
      padding: 3,
    }}
  >
    {(["newuser", "regular"] as UserType[]).map((t) => {
      const active = value === t;
      return (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            ...f,
            fontSize: "var(--text-base)",
            fontWeight: active ? 700 : 500,
            color: active ? "var(--text-heading)" : "var(--text-muted-themed)",
            transition: "color 0.18s",
          }}
        >
          {active && (
            <motion.div
              layoutId="uw-usertype-pill"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 8,
                backgroundColor: "var(--neutral-0)",
                border: "1px solid var(--border-subtle)",
              }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            />
          )}
          <span style={{ position: "relative", zIndex: 1 }}>
            {t === "newuser" ? "New User" : "Regular"}
          </span>
        </button>
      );
    })}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   UNDERWRITER NEW USER VIEW
───────────────────────────────────────────────────────────── */
const UnderwriterNewUserView: React.FC = () => {
  const navigate = useNavigate();

  type ModalStep = "docs" | "create" | null;
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [activeLoan, setActiveLoan] = useState<LoanType | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [createdCases, setCreatedCases] = useState<CaseEntry[]>([]);
  const [showToast, setShowToast] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const handleLoanClick = (loan: LoanType) => {
    setActiveLoan(loan);
    setModalStep("docs");
  };

  const handleDocsSelected = (docs: string[]) => {
    setSelectedDocs(docs);
    setModalStep("create");
  };

  const handleCaseCreate = (entityName: string) => {
    const newId = `CASE-${10300 + createdCases.length}`;
    const newCase: CaseEntry = {
      id: newId,
      name: entityName,
      natureOfBusiness: "Financial Services",
      created: new Date().toISOString().split("T")[0],
      riskLevel: "Medium",
      mostRiskElement: "Pending review",
      status: "New",
      processStatus: "In Progress",
      aiInsight: {
        mostRiskyElement: "Pending review",
        riskExplanation: "Case just created — analysis in progress.",
        confidencePercent: 0,
        additionalFactors: [],
      },
      source: "entity-dd",
    };
    setCreatedCases((prev) => [newCase, ...prev]);
    setModalStep(null);
    setActiveLoan(null);
    setShowToast({ name: entityName, id: newId });
    setTimeout(() => setShowToast(null), 3500);
  };

  const closeModal = () => {
    setModalStep(null);
    setActiveLoan(null);
    setSelectedDocs([]);
  };

  const largeLoanTypes = LOAN_TYPES.filter((l) => l.size === "large");
  const smallLoanTypes = LOAN_TYPES.filter((l) => l.size === "small");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Section: Start a new assessment */}
      <div style={{ padding: "28px 36px 0" }}>
        {/* Section header */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              ...f,
              fontSize: "var(--text-md)",
              fontWeight: 700,
              color: "var(--text-heading)",
              lineHeight: "22px",
            }}
          >
            Start a new assessment
          </div>
          <div
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted-themed)",
              marginTop: 3,
            }}
          >
            Select a loan type to begin a structured due-diligence workflow
          </div>
        </div>

        {/* Large loan cards */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          {largeLoanTypes.map((loan) => (
            <LoanCard key={loan.id} loan={loan} onClick={() => handleLoanClick(loan)} />
          ))}
        </div>

        {/* Small loan cards */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {smallLoanTypes.map((loan) => (
            <LoanCard key={loan.id} loan={loan} onClick={() => handleLoanClick(loan)} />
          ))}
        </div>
      </div>

      {/* Divider: standalone checks */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "24px 36px 0",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background: "var(--border-subtle)",
          }}
        />
        <span
          style={{
            ...f,
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--text-muted-themed)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            whiteSpace: "nowrap",
          }}
        >
          Or run a standalone check
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "var(--border-subtle)",
          }}
        />
      </div>

      {/* Check cards */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          padding: "16px 36px 0",
        }}
      >
        {CHECKS.map((check) => (
          <CheckCard key={check.id} check={check} />
        ))}
      </div>

      {/* Created cases list */}
      {createdCases.length > 0 && (
        <div style={{ padding: "32px 0 0" }}>
          <div
            style={{
              padding: "0 36px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  ...f,
                  fontSize: "var(--text-md)",
                  fontWeight: 700,
                  color: "var(--text-heading)",
                  lineHeight: "22px",
                }}
              >
                Your Cases
              </div>
              <div
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted-themed)",
                  marginTop: 2,
                }}
              >
                {createdCases.length} case
                {createdCases.length > 1 ? "s" : ""} created
              </div>
            </div>
            <button
              onClick={() => navigate("/case-management")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                ...f,
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--primary)",
                background: "rgba(23,102,214,0.08)",
                border: "1px solid rgba(23,102,214,0.20)",
                borderRadius: 8,
                padding: "7px 14px",
                cursor: "pointer",
              }}
            >
              View all cases <ArrowRight size={13} strokeWidth={2} />
            </button>
          </div>
          <CaseTable cases={createdCases} showSources={false} />
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modalStep === "docs" && activeLoan && (
          <OptionalDocsModal
            loanLabel={activeLoan.label}
            onContinue={handleDocsSelected}
            onClose={closeModal}
          />
        )}
        {modalStep === "create" && activeLoan && (
          <CaseCreationModal
            loanLabel={activeLoan.label}
            selectedDocs={selectedDocs}
            onCreateCase={handleCaseCreate}
            onBack={() => setModalStep("docs")}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {showToast && (
          <SuccessToast entityName={showToast.name} caseId={showToast.id} />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   UNDERWRITER REGULAR VIEW (placeholder)
───────────────────────────────────────────────────────────── */
const UnderwriterRegularView: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 36px",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: "rgba(23,102,214,0.08)",
        border: "1px solid rgba(23,102,214,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Layers size={24} color="var(--primary)" strokeWidth={1.6} />
    </div>
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          ...f,
          fontSize: "var(--text-md)",
          fontWeight: 700,
          color: "var(--text-heading)",
          lineHeight: "24px",
        }}
      >
        Regular User View
      </div>
      <div
        style={{
          ...f,
          fontSize: "var(--text-base)",
          color: "var(--text-muted-themed)",
          marginTop: 6,
          maxWidth: 400,
        }}
      >
        The regular underwriter view with case list, activity feed, and
        analytics is coming in the next session.
      </div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 16px",
        borderRadius: 8,
        background: "rgba(23,102,214,0.06)",
        border: "1px solid rgba(23,102,214,0.15)",
      }}
    >
      <Sparkles size={14} color="var(--primary)" />
      <span
        style={{
          ...f,
          fontSize: "var(--text-sm)",
          color: "var(--primary)",
          fontWeight: 500,
        }}
      >
        Journey definition in progress
      </span>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   CREDIT HEAD VIEW (placeholder)
───────────────────────────────────────────────────────────── */
const CreditHeadView: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 36px",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: "rgba(19,26,37,0.06)",
        border: "1px solid rgba(19,26,37,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Users size={24} color="var(--neutral-900)" strokeWidth={1.6} />
    </div>
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          ...f,
          fontSize: "var(--text-md)",
          fontWeight: 700,
          color: "var(--text-heading)",
          lineHeight: "24px",
        }}
      >
        Credit Head View
      </div>
      <div
        style={{
          ...f,
          fontSize: "var(--text-base)",
          color: "var(--text-muted-themed)",
          marginTop: 6,
          maxWidth: 400,
        }}
      >
        The Credit Head journey — pending approvals, team view, CAM reviews —
        will be defined and built in the next session.
      </div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 16px",
        borderRadius: 8,
        background: "rgba(19,26,37,0.04)",
        border: "1px solid rgba(19,26,37,0.10)",
      }}
    >
      <Sparkles size={14} color="var(--neutral-900)" />
      <span
        style={{
          ...f,
          fontSize: "var(--text-sm)",
          color: "var(--neutral-900)",
          fontWeight: 500,
        }}
      >
        Journey definition in progress
      </span>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export const WorkspaceFinalPage: React.FC = () => {
  const [role, setRole] = useState<Role>("underwriter");
  const [userType, setUserType] = useState<UserType>("newuser");

  const isUW = role === "underwriter";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--neutral-50)",
      }}
    >
      {/* Sidebar */}
      <WorkspaceSidebar role={role} onRoleChange={setRole} />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
          backgroundColor: "var(--neutral-0)",
        }}
      >
        {/* Top header bar */}
        <div
          style={{
            flexShrink: 0,
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--neutral-0)",
          }}
        >
          {/* Greeting row */}
          <div
            style={{
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 36px",
            }}
          >
            <div>
              <div
                style={{
                  ...f,
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--text-heading)",
                  lineHeight: "1.2",
                }}
              >
                {getGreeting()},{" "}
                {role === "underwriter" ? "Harish" : "Vikram"} 👋
              </div>
              <div
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted-themed)",
                  marginTop: 2,
                }}
              >
                {formatDate()}
              </div>
            </div>

            {/* UW-only: User type toggle */}
            {isUW && (
              <UserTypeToggle value={userType} onChange={setUserType} />
            )}

            {/* Role badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 14px",
                borderRadius: 8,
                background:
                  role === "underwriter"
                    ? "rgba(23,102,214,0.07)"
                    : "rgba(19,26,37,0.06)",
                border: `1px solid ${role === "underwriter" ? "rgba(23,102,214,0.18)" : "rgba(19,26,37,0.12)"}`,
              }}
            >
              {role === "underwriter" ? (
                <User
                  size={14}
                  strokeWidth={1.8}
                  color="var(--primary)"
                />
              ) : (
                <Users size={14} strokeWidth={1.8} color="var(--neutral-900)" />
              )}
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color:
                    role === "underwriter"
                      ? "var(--primary)"
                      : "var(--neutral-900)",
                }}
              >
                {role === "underwriter" ? "Underwriter" : "Credit Head"}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${userType}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{ paddingBottom: 48 }}
            >
              {role === "underwriter" ? (
                userType === "newuser" ? (
                  <UnderwriterNewUserView />
                ) : (
                  <UnderwriterRegularView />
                )
              ) : (
                <CreditHeadView />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

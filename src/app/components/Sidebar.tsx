import idfyPaths from "../../imports/svg-2t4o7mlshq";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Bell,
  Upload,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

/* ─── IDfy Logo ─── */
const LogoIcon = ({ collapsed }: { collapsed?: boolean }) => (
  <div
    className="relative shrink-0 flex items-center justify-center"
    style={{
      width: collapsed ? 32 : 36,
      height: collapsed ? 20 : 24,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }}
  >
    <svg
      className="block"
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

/* ─── Bell icon with red notification dot ─── */
const AlertsBellIcon = ({
  size,
  color,
}: {
  size: number;
  color: string;
}) => (
  <div style={{ position: "relative", display: "inline-flex" }}>
    <Bell size={size} strokeWidth={1.8} color={color} />
    {/* Red dot */}
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
        flexShrink: 0,
      }}
    />
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);

  const isWorkspace =
    location.pathname === "/workspace" ||
    location.pathname.startsWith("/workspace/");
  const isAlerts = location.pathname === "/alerts";
  const isBulkUpload = location.pathname === "/bulk-upload";

  const sidebarWidth = expanded ? 248 : 68;
  const iconSize = 18;
  const itemHeight = 38;
  const transitionCSS = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  const toggleExpanded = () => setExpanded((prev) => !prev);

  /* ─── Shared nav-item style builder ─── */
  const navItemStyle = (active: boolean): React.CSSProperties => ({
    height: itemHeight,
    padding: expanded ? "0 12px" : "0",
    justifyContent: expanded ? "flex-start" : "center",
    gap: 10,
    backgroundColor: active ? "var(--sidebar-active-bg)" : "transparent",
    border: "none",
    borderRadius: "var(--radius)",
    margin: expanded ? "0 8px" : "0 6px",
    width: expanded ? "calc(100% - 16px)" : "calc(100% - 12px)",
    transition: transitionCSS,
  });

  /* ─── Shared label style builder ─── */
  const labelStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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

  return (
    <motion.aside
      className={`flex flex-col h-screen flex-shrink-0 select-none ${className || ""}`}
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border-color)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "sticky",
        top: 0,
        overflow: "visible",
        zIndex: 20,
      }}
      animate={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ─── Floating collapse/expand toggle ─── */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={toggleExpanded}
            className="flex items-center justify-center cursor-pointer"
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
              boxShadow: "var(--shadow-card)",
              zIndex: 30,
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--neutral-100)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--neutral-0)";
            }}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <ChevronLeft size={13} strokeWidth={2} />
            ) : (
              <ChevronRight size={13} strokeWidth={2} />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Inner content wrapper */}
      <div className="flex flex-col flex-1 min-h-0" style={{ overflow: "hidden" }}>

        {/* ═══ Header: Logo ═══ */}
        <div
          className="shrink-0 flex items-center"
          style={{
            height: 56,
            padding: expanded ? "0 16px" : "0",
            justifyContent: expanded ? "flex-start" : "center",
            borderBottom: "1px solid var(--sidebar-border-color)",
            transition: transitionCSS,
          }}
        >
          <div
            className="flex items-center cursor-pointer"
            style={{ gap: 10, minWidth: 0 }}
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
                  className="whitespace-nowrap"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    lineHeight: "22px",
                    letterSpacing: "-0.2px",
                    color: "var(--text-heading)",
                  }}
                >
                  OneRisk
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ Navigation ═══ */}
        <nav
          className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden"
          style={{ padding: "8px 0", gap: 2 }}
        >
          {/* ── Workspace ── */}
          <NavButton
            active={isWorkspace}
            expanded={expanded}
            icon={
              <LayoutDashboard
                size={iconSize}
                strokeWidth={1.8}
                color={iconColor(isWorkspace)}
              />
            }
            label="Workspace"
            labelStyle={labelStyle(isWorkspace)}
            style={navItemStyle(isWorkspace)}
            onClick={() => navigate("/workspace")}
          />

          {/* ── Alerts (with red dot badge) ── */}
          <NavButton
            active={isAlerts}
            expanded={expanded}
            icon={
              <AlertsBellIcon size={iconSize} color={iconColor(isAlerts)} />
            }
            label="Alerts"
            labelStyle={labelStyle(isAlerts)}
            style={navItemStyle(isAlerts)}
            onClick={() => navigate("/alerts")}
          />

          {/* ── Bulk Upload ── */}
          <NavButton
            active={isBulkUpload}
            expanded={expanded}
            icon={
              <Upload
                size={iconSize}
                strokeWidth={1.8}
                color={iconColor(isBulkUpload)}
              />
            }
            label="Bulk Upload"
            labelStyle={labelStyle(isBulkUpload)}
            style={navItemStyle(isBulkUpload)}
            onClick={() => navigate("/bulk-upload")}
          />
        </nav>

        {/* ═══ Footer ═══ */}
        <div
          className="shrink-0 flex flex-col"
          style={{
            borderTop: "1px solid var(--sidebar-border-color)",
            padding: expanded ? "8px 8px" : "8px 6px",
            transition: transitionCSS,
          }}
        >
          {/* User row */}
          <div
            className="flex items-center cursor-pointer"
            style={{
              height: 42,
              padding: expanded ? "0 8px" : "0",
              justifyContent: expanded ? "flex-start" : "center",
              gap: 10,
              borderRadius: "var(--radius)",
              transition: transitionCSS,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {/* Avatar */}
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
              }}
            >
              <User size={15} strokeWidth={1.8} color="var(--text-on-color)" />
            </div>
            <AnimatePresence mode="wait">
              {expanded && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.12 }}
                  className="flex flex-col min-w-0 flex-1"
                >
                  <span
                    className="whitespace-nowrap"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 13,
                      lineHeight: "18px",
                      color: "var(--text-heading)",
                    }}
                  >
                    Harish M
                  </span>
                  <span
                    className="whitespace-nowrap"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 11,
                      lineHeight: "14px",
                      color: "var(--text-muted-themed)",
                    }}
                  >
                    Credit Analyst
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {expanded && (
                <motion.span
                  key="logout-icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="shrink-0 flex items-center"
                >
                  <LogOut
                    size={15}
                    strokeWidth={1.8}
                    color="var(--text-muted-themed)"
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

/* ═══════════════════════════════════════════
   Reusable NavButton
   ═══════════════════════════════════════════ */
interface NavButtonProps {
  active: boolean;
  expanded: boolean;
  icon: React.ReactNode;
  label: string;
  labelStyle: React.CSSProperties;
  style: React.CSSProperties;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({
  active,
  expanded,
  icon,
  label,
  labelStyle: lblStyle,
  style: btnStyle,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center cursor-pointer"
    style={btnStyle}
    title={!expanded ? label : undefined}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = "var(--sidebar-hover-bg)";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = "transparent";
      } else {
        e.currentTarget.style.backgroundColor = "var(--sidebar-active-bg)";
      }
    }}
  >
    <span
      className="shrink-0 flex items-center justify-center"
      style={{ width: 20 }}
    >
      {icon}
    </span>
    <AnimatePresence mode="wait">
      {expanded && (
        <motion.span
          key={`${label}-text`}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.12 }}
          className="flex-1 text-left whitespace-nowrap"
          style={lblStyle}
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  </button>
);

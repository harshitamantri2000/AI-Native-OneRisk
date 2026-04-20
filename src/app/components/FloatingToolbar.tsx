import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Share2,
  Bookmark,
  Printer,
  Flag,
} from "lucide-react";

const fontBase = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
};

interface FloatingToolbarProps {
  accentColor?: string;
  glowRgba?: string;
}

interface ToolbarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  accentOverride?: string;
}

export const FloatingToolbar = ({
  accentColor = "var(--info-400)",
  glowRgba = "92, 212, 230",
}: FloatingToolbarProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [flagged, setFlagged] = useState(false);

  const actions: ToolbarAction[] = [
    {
      id: "download",
      icon: <Download className="w-4 h-4" />,
      label: "Export Report",
    },
    {
      id: "share",
      icon: <Share2 className="w-4 h-4" />,
      label: "Share",
    },
    {
      id: "bookmark",
      icon: <Bookmark className="w-4 h-4" style={bookmarked ? { fill: "var(--warning-200)" } : {}} />,
      label: bookmarked ? "Saved" : "Bookmark",
      onClick: () => setBookmarked(!bookmarked),
      isActive: bookmarked,
      accentOverride: bookmarked ? "var(--warning-200)" : undefined,
    },
    {
      id: "print",
      icon: <Printer className="w-4 h-4" />,
      label: "Print",
    },
    {
      id: "flag",
      icon: <Flag className="w-4 h-4" style={flagged ? { fill: "var(--destructive-500)" } : {}} />,
      label: flagged ? "Flagged" : "Flag for Review",
      onClick: () => setFlagged(!flagged),
      isActive: flagged,
      accentOverride: flagged ? "var(--destructive-500)" : undefined,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-5 z-40 flex items-center gap-2"
      style={{ left: "84px" }}
    >
      {actions.map((action) => {
        const isHovered = hoveredId === action.id;
        const isActive = action.isActive;
        const iconColor = isActive
          ? (action.accentOverride || accentColor)
          : isHovered
          ? "var(--text-heading)"
          : "var(--text-secondary-themed)";

        return (
          <div key={action.id} className="relative">
            <motion.button
              onMouseEnter={() => setHoveredId(action.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={action.onClick}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all"
              style={{
                backgroundColor: isActive
                  ? `rgba(${action.id === "bookmark" ? "249, 201, 99" : "226, 51, 24"}, 0.15)`
                  : "var(--surface-card)",
                color: iconColor,
                border: isActive
                  ? `1px solid rgba(${action.id === "bookmark" ? "249, 201, 99" : "226, 51, 24"}, 0.25)`
                  : "1px solid var(--border-default)",
                boxShadow: "var(--shadow-elevated)",
              }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10" style={{ color: iconColor }}>
                {action.icon}
              </span>
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50"
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    className="px-2.5 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: "var(--tooltip-bg)",
                      border: "1px solid var(--tooltip-border)",
                      boxShadow: "var(--tooltip-shadow)",
                    }}
                  >
                    <span
                      style={{
                        ...fontBase,
                        fontSize: "11px",
                        lineHeight: "140%",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--text-heading)",
                      }}
                    >
                      {action.label}
                    </span>
                  </div>
                  {/* Arrow */}
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 -mt-[3px] w-1.5 h-1.5 rotate-45"
                    style={{
                      backgroundColor: "var(--tooltip-bg)",
                      borderRight: "1px solid var(--tooltip-border)",
                      borderBottom: "1px solid var(--tooltip-border)",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
};
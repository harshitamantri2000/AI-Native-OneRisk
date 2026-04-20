import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Mail, Clock, ArrowRight, Plus, X } from "lucide-react";

const f: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
};

export interface NewCaseMeta {
  id: string;
  name: string;
  loanType?: string;
  submittedAt: Date;
}

export const CaseCreatedModal: React.FC<{
  open: boolean;
  newCase: NewCaseMeta | null;
  onClose: () => void;
  onGoToWorkspace: () => void;
  onCreateAnother: () => void;
}> = ({ open, newCase, onClose, onGoToWorkspace, onCreateAnother }) => {
  return (
    <AnimatePresence>
      {open && newCase && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(10, 13, 19, 0.45)",
              zIndex: 100,
            }}
          />

          {/* Centered modal card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.85 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 101,
              backgroundColor: "var(--neutral-0)",
              borderRadius: 14,
              border: "1px solid var(--border-subtle)",
              width: 420,
              maxWidth: "calc(100vw - 40px)",
              overflow: "hidden",
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--neutral-50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={13} style={{ color: "var(--text-muted-themed)" } as React.CSSProperties} />
            </button>

            {/* Body */}
            <div style={{ padding: "32px 28px 28px" }}>

              {/* Success icon */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "color-mix(in srgb, var(--success-700) 10%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--success-700) 20%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <CheckCircle2 size={24} strokeWidth={2} style={{ color: "var(--success-700)" } as React.CSSProperties} />
                </div>
              </div>

              {/* Heading */}
              <div style={{ textAlign: "center", marginBottom: 6 }}>
                <span style={{ ...f, fontSize: "var(--text-md)", lineHeight: "140%", fontWeight: 700, color: "var(--text-heading)", display: "block" }}>
                  Case created successfully
                </span>
              </div>

              {/* Entity name + ID */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 500, color: "var(--text-body)", display: "block" }}>
                  {newCase.name}
                </span>
                <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 3 }}>
                  {newCase.id}{newCase.loanType ? ` · ${newCase.loanType}` : ""}
                </span>
              </div>

              {/* Email notification card */}
              <div style={{
                padding: "14px 16px",
                backgroundColor: "color-mix(in srgb, var(--primary) 4%, var(--neutral-0))",
                border: "1px solid color-mix(in srgb, var(--primary) 16%, var(--border-subtle))",
                borderRadius: 10,
                marginBottom: 24,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Mail size={15} strokeWidth={2} style={{ color: "var(--primary)" } as React.CSSProperties} />
                </div>
                <div>
                  <span style={{ ...f, fontSize: "var(--text-base)", lineHeight: "140%", fontWeight: 600, color: "var(--text-heading)", display: "block" }}>
                    You'll be notified by email
                  </span>
                  <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 400, color: "var(--text-muted-themed)", display: "block", marginTop: 3 }}>
                    Once the case is ready for review, we'll send a direct link to the analysis.
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
                    <Clock size={11} style={{ color: "var(--warning-700)" } as React.CSSProperties} />
                    <span style={{ ...f, fontSize: "var(--text-sm)", lineHeight: "140%", fontWeight: 600, color: "var(--warning-700)" }}>
                      Estimated ready in 4–5 hours
                    </span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  type="button"
                  onClick={onGoToWorkspace}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    height: 40,
                    backgroundColor: "var(--primary)",
                    color: "var(--neutral-0)",
                    border: "none",
                    borderRadius: 8,
                    ...f,
                    fontSize: "var(--text-sm)",
                    lineHeight: "140%",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background-color 0.14s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--primary-600)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--primary)"; }}
                >
                  Go to workspace
                  <ArrowRight size={13} strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  onClick={onCreateAnother}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    height: 38,
                    backgroundColor: "var(--neutral-0)",
                    color: "var(--text-heading)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8,
                    ...f,
                    fontSize: "var(--text-sm)",
                    lineHeight: "140%",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "border-color 0.13s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
                >
                  <Plus size={13} strokeWidth={2.2} />
                  Create another case
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Gavel,
  ShieldAlert,
  Car,
  FileText,
  Radar,
  CheckCircle2,
  Zap,
  Loader2,
  Upload,
  AlertCircle,
} from "lucide-react";
import type { CheckType } from "../data/terminalChecks";
import { CHECK_TYPE_LABELS } from "../data/terminalChecks";

const ff = "'Plus Jakarta Sans', sans-serif";

const CHECK_ICONS: Record<CheckType, React.ReactNode> = {
  "court-check": <Gavel style={{ width: 18, height: 18 }} />,
  "aml-check": <ShieldAlert style={{ width: 18, height: 18 }} />,
  "vehicular-check": <Car style={{ width: 18, height: 18 }} />,
  "bank-statement": <FileText style={{ width: 18, height: 18 }} />,
  "netscan": <Radar style={{ width: 18, height: 18 }} />,
};

const CHECK_DESCRIPTIONS: Record<CheckType, string> = {
  "court-check":
    "Search criminal and civil court records across all Indian courts for an entity or individual.",
  "aml-check":
    "Screen against PEP lists, global sanctions databases, and adverse media for AML compliance.",
  "vehicular-check":
    "Verify vehicle ownership, hypothecation status, and loan defaults for registered vehicles.",
  "bank-statement":
    "Analyze uploaded bank statements for cash flow patterns, anomalies, and ABB ratios.",
  "netscan":
    "Scan digital footprint — news articles, social media mentions, and sentiment analysis.",
};

const CHECK_FIELDS: Record<CheckType, { label: string; placeholder: string; key: string }[]> = {
  "court-check": [
    { label: "Entity / Individual Name", placeholder: "e.g. Rajesh Kalyanrao Amboli", key: "name" },
    { label: "PAN / CIN", placeholder: "e.g. BQRPA4521L", key: "entityId" },
  ],
  "aml-check": [
    { label: "Full Name", placeholder: "e.g. Rajesh Kalyanrao Amboli", key: "name" },
    { label: "PAN", placeholder: "e.g. BQRPA4521L", key: "entityId" },
    { label: "Date of Birth (optional)", placeholder: "DD/MM/YYYY", key: "dob" },
  ],
  "vehicular-check": [
    { label: "Entity / Owner Name", placeholder: "e.g. Nova Energy Corp", key: "name" },
    { label: "PAN / CIN", placeholder: "e.g. AABCN5566P", key: "entityId" },
  ],
  "bank-statement": [
    { label: "Entity Name", placeholder: "e.g. Global Synthetics Pvt Ltd", key: "name" },
    { label: "PAN / CIN", placeholder: "e.g. AABCG7788Q", key: "entityId" },
  ],
  "netscan": [
    { label: "Entity / Individual Name", placeholder: "e.g. TechFlow Solutions Ltd", key: "name" },
    { label: "PAN / CIN (optional)", placeholder: "e.g. AABCT3344R", key: "entityId" },
  ],
};

interface NewCheckDrawerProps {
  open: boolean;
  checkType: CheckType | null;
  onClose: () => void;
}

export const NewCheckDrawer: React.FC<NewCheckDrawerProps> = ({
  open,
  checkType,
  onClose,
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

  const resetForm = useCallback(() => {
    setFormValues({});
    setSubmitting(false);
    setSubmitted(false);
    setGeneratedId("");
    setFileUploaded(false);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(resetForm, 300);
  }, [onClose, resetForm]);

  const updateField = useCallback((key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    const id = `TC-${Math.floor(5000 + Math.random() * 5000)}`;
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setGeneratedId(id);
    }, 1600);
  }, []);

  if (!checkType) return null;

  const fields = CHECK_FIELDS[checkType];
  const isFormValid =
    fields
      .filter((f) => !f.placeholder.includes("optional"))
      .every((f) => (formValues[f.key] || "").trim().length > 0) &&
    (checkType !== "bank-statement" || fileUploaded);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="check-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(10, 13, 19, 0.35)",
              zIndex: 50,
            }}
          />

          {/* Drawer */}
          <motion.div
            key="check-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="flex flex-col"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: 520,
              maxWidth: "100vw",
              backgroundColor: "var(--neutral-0)",
              borderLeft: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-elevated)",
              zIndex: 51,
              fontFamily: ff,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center" style={{ gap: 10 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--radius)",
                    backgroundColor: "var(--surface-inset)",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  {CHECK_ICONS[checkType]}
                </div>
                <span
                  style={{
                    fontFamily: ff,
                    fontSize: "var(--text-md)",
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    lineHeight: "1.3",
                    letterSpacing: "0.004em",
                  }}
                >
                  {submitted ? "Check Initiated" : `New ${CHECK_TYPE_LABELS[checkType]}`}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius)",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted-themed)",
                  transition: "background-color 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Body */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ padding: "24px 24px 28px" }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* Success state */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center"
                    style={{ gap: 20, paddingTop: 48, textAlign: "center" }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "var(--success-50)",
                      }}
                    >
                      <CheckCircle2
                        style={{ width: 26, height: 26, color: "var(--success-500)" }}
                      />
                    </div>
                    <div className="flex flex-col" style={{ gap: 8 }}>
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-lg)",
                          fontWeight: 600,
                          color: "var(--text-heading)",
                          lineHeight: "1.3",
                        }}
                      >
                        {CHECK_TYPE_LABELS[checkType]} Initiated
                      </span>
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-base)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--text-secondary-themed)",
                          lineHeight: "1.5",
                        }}
                      >
                        Your check has been queued for processing. Results will appear in the Terminal hub once complete.
                      </span>
                    </div>
                    <div
                      className="flex items-center"
                      style={{
                        gap: 8,
                        padding: "10px 16px",
                        borderRadius: "var(--radius)",
                        backgroundColor: "var(--info-50)",
                        border: "1px solid var(--info-200)",
                      }}
                    >
                      <Zap
                        style={{
                          width: 13,
                          height: 13,
                          color: "var(--info-600)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--info-600)",
                          lineHeight: "1.4",
                        }}
                      >
                        {generatedId} assigned
                      </span>
                    </div>
                    <div className="flex" style={{ gap: 12, marginTop: 12 }}>
                      <button
                        onClick={resetForm}
                        style={{
                          height: 40,
                          padding: "0 20px",
                          fontFamily: ff,
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          color: "var(--primary)",
                          backgroundColor: "rgba(23, 102, 214, 0.08)",
                          border: "1px solid rgba(23, 102, 214, 0.2)",
                          borderRadius: "var(--radius)",
                          cursor: "pointer",
                          lineHeight: "1",
                          transition: "background-color 0.12s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(23, 102, 214, 0.14)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(23, 102, 214, 0.08)";
                        }}
                      >
                        Run Another
                      </button>
                      <button
                        onClick={handleClose}
                        style={{
                          height: 40,
                          padding: "0 20px",
                          fontFamily: ff,
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          color: "var(--primary-foreground)",
                          backgroundColor: "var(--primary)",
                          border: "none",
                          borderRadius: "var(--radius)",
                          cursor: "pointer",
                          lineHeight: "1",
                          transition: "background-color 0.12s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--primary-600)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--primary)";
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Form */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col"
                    style={{ gap: 24 }}
                  >
                    {/* Description */}
                    <div
                      className="flex items-start"
                      style={{
                        gap: 10,
                        padding: "12px 14px",
                        borderRadius: "var(--radius)",
                        backgroundColor: "var(--surface-inset-subtle)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <AlertCircle
                        style={{
                          width: 15,
                          height: 15,
                          color: "var(--text-muted-themed)",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--text-secondary-themed)",
                          lineHeight: "1.5",
                        }}
                      >
                        {CHECK_DESCRIPTIONS[checkType]}
                      </span>
                    </div>

                    {/* Fields */}
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        className="flex flex-col"
                        style={{ gap: 6 }}
                      >
                        <label
                          style={{
                            fontFamily: ff,
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--text-body)",
                            lineHeight: "1.5",
                          }}
                        >
                          {field.label}
                          {!field.placeholder.includes("optional") && (
                            <span style={{ color: "var(--destructive)" }}> *</span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={formValues[field.key] || ""}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          style={{
                            width: "100%",
                            height: 40,
                            padding: "0 12px",
                            fontFamily: ff,
                            fontSize: "var(--text-base)",
                            fontWeight: "var(--font-weight-normal)",
                            color: "var(--text-body)",
                            backgroundColor: "var(--input-background)",
                            border: "1px solid var(--border-default)",
                            borderRadius: "var(--radius)",
                            outline: "none",
                            transition: "border-color 0.15s ease",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--border-default)";
                          }}
                        />
                      </div>
                    ))}

                    {/* Bank statement file upload */}
                    {checkType === "bank-statement" && (
                      <div className="flex flex-col" style={{ gap: 6 }}>
                        <label
                          style={{
                            fontFamily: ff,
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--text-body)",
                            lineHeight: "1.5",
                          }}
                        >
                          Upload Statement
                          <span style={{ color: "var(--destructive)" }}> *</span>
                        </label>
                        <div
                          className="flex flex-col items-center justify-center cursor-pointer"
                          onClick={() => setFileUploaded(true)}
                          style={{
                            height: 100,
                            borderRadius: "var(--radius)",
                            border: fileUploaded
                              ? "1.5px solid var(--success-500)"
                              : "1.5px dashed var(--border-default)",
                            backgroundColor: fileUploaded
                              ? "var(--success-50)"
                              : "var(--surface-inset-subtle)",
                            transition: "all 0.15s ease",
                            gap: 6,
                          }}
                        >
                          {fileUploaded ? (
                            <>
                              <CheckCircle2
                                style={{
                                  width: 20,
                                  height: 20,
                                  color: "var(--success-500)",
                                }}
                              />
                              <span
                                style={{
                                  fontFamily: ff,
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-medium)",
                                  color: "var(--success-700)",
                                }}
                              >
                                bank_statement_2025.pdf uploaded
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload
                                style={{
                                  width: 20,
                                  height: 20,
                                  color: "var(--text-muted-themed)",
                                }}
                              />
                              <span
                                style={{
                                  fontFamily: ff,
                                  fontSize: "var(--text-sm)",
                                  fontWeight: "var(--font-weight-normal)",
                                  color: "var(--text-muted-themed)",
                                }}
                              >
                                Click to upload PDF or Excel file
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Link to existing case (optional) */}
                    <div className="flex flex-col" style={{ gap: 6 }}>
                      <label
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--text-body)",
                          lineHeight: "1.5",
                        }}
                      >
                        Link to Bundle Case{" "}
                        <span
                          style={{
                            fontWeight: "var(--font-weight-normal)",
                            color: "var(--text-muted-themed)",
                          }}
                        >
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formValues["linkedCase"] || ""}
                        onChange={(e) => updateField("linkedCase", e.target.value)}
                        placeholder="e.g. CASE-10235"
                        style={{
                          width: "100%",
                          height: 40,
                          padding: "0 12px",
                          fontFamily: ff,
                          fontSize: "var(--text-base)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--text-body)",
                          backgroundColor: "var(--input-background)",
                          border: "1px solid var(--border-default)",
                          borderRadius: "var(--radius)",
                          outline: "none",
                          transition: "border-color 0.15s ease",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "var(--primary)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--border-default)";
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer — only during form state */}
            {!submitted && (
              <div
                className="shrink-0 flex items-center justify-end"
                style={{
                  padding: "14px 24px",
                  borderTop: "1px solid var(--border-subtle)",
                  gap: 12,
                }}
              >
                <button
                  onClick={handleClose}
                  style={{
                    height: 40,
                    padding: "0 20px",
                    fontFamily: ff,
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-secondary-themed)",
                    backgroundColor: "transparent",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius)",
                    cursor: "pointer",
                    lineHeight: "1",
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || submitting}
                  className="flex items-center"
                  style={{
                    height: 40,
                    padding: "0 20px",
                    gap: 8,
                    fontFamily: ff,
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--primary-foreground)",
                    backgroundColor:
                      !isFormValid || submitting
                        ? "color-mix(in srgb, var(--primary) 32%, transparent)"
                        : "var(--primary)",
                    border: "none",
                    borderRadius: "var(--radius)",
                    cursor: !isFormValid || submitting ? "not-allowed" : "pointer",
                    lineHeight: "1",
                    transition: "background-color 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (isFormValid && !submitting)
                      e.currentTarget.style.backgroundColor = "var(--primary-600)";
                  }}
                  onMouseLeave={(e) => {
                    if (isFormValid && !submitting)
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                  }}
                >
                  {submitting && (
                    <Loader2
                      className="animate-spin"
                      style={{ width: 14, height: 14 }}
                    />
                  )}
                  {submitting ? "Initiating…" : "Run Check"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

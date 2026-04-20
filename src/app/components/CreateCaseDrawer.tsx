import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  User,
  Users,
  MoreHorizontal,
  Network,
  Target,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Zap,
  Loader2,
} from "lucide-react";

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
type EntityType = "company" | "sole_prop" | "partnership" | "others" | null;
type AssessmentMode = "network" | "standalone" | null;

interface PartnerRow {
  id: string;
  pan: string;
  name: string;
  panValid: boolean | null;
}

interface CompanySuggestion {
  name: string;
  cin: string;
  pan: string;
}

interface CreateCaseDrawerProps {
  open: boolean;
  onClose: () => void;
}

/* ═══════════════════════════════════════════
   Mock data
   ═══════════════════════════════════════════ */
const MOCK_COMPANIES: CompanySuggestion[] = [
  { name: "Reliance Industries Ltd", cin: "L17110MH1973PLC019786", pan: "AAACR5055K" },
  { name: "Tata Consultancy Services Ltd", cin: "L22210MH1995PLC084781", pan: "AAACT2727Q" },
  { name: "Infosys Limited", cin: "L85110KA1981PLC013115", pan: "AAACI1195H" },
  { name: "HDFC Bank Limited", cin: "L65920MH1994PLC080618", pan: "AAACH2702H" },
  { name: "Wipro Limited", cin: "L32102KA1945PLC020800", pan: "AAACW5849R" },
  { name: "Amboli Infrastructure Pvt Ltd", cin: "U45200MH2018PTC312456", pan: "AADCA8765M" },
  { name: "Bajaj Finance Ltd", cin: "L65910MH1987PLC042961", pan: "AABCB1234A" },
];

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const validatePAN = (pan: string): boolean | null => {
  if (!pan) return null;
  if (pan.length < 10) return null;
  return PAN_REGEX.test(pan.toUpperCase());
};

/* ═══════════════════════════════════════════
   Entity type cards config
   ═══════════════════════════════════════════ */
const ENTITY_TYPES: {
  key: EntityType;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "company",
    label: "Company / LLP",
    desc: "Private Ltd, Public Ltd, LLP, OPC registered under MCA",
    icon: <Building2 style={{ width: 18, height: 18 }} />,
  },
  {
    key: "sole_prop",
    label: "Sole Proprietorship",
    desc: "Individual-owned business with single PAN identity",
    icon: <User style={{ width: 18, height: 18 }} />,
  },
  {
    key: "partnership",
    label: "Partnership Firm",
    desc: "Registered or unregistered with multiple partners",
    icon: <Users style={{ width: 18, height: 18 }} />,
  },
  {
    key: "others",
    label: "Others",
    desc: "Trusts, societies, HUFs, or custom entity types",
    icon: <MoreHorizontal style={{ width: 18, height: 18 }} />,
  },
];

/* ═══════════════════════════════════════════
   Font shorthand
   ═══════════════════════════════════════════ */
const ff = "'Plus Jakarta Sans', sans-serif";

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */
export const CreateCaseDrawer: React.FC<CreateCaseDrawerProps> = ({
  open,
  onClose,
}) => {
  /* ── state ── */
  const [entityType, setEntityType] = useState<EntityType>(null);
  const [mode, setMode] = useState<AssessmentMode>(null);
  const [entitySearch, setEntitySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanySuggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [businessPAN, setBusinessPAN] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [proprietorPAN, setProprietorPAN] = useState("");
  const [firmName, setFirmName] = useState("");
  const [partners, setPartners] = useState<PartnerRow[]>([
    { id: "p1", pan: "", name: "", panValid: null },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedCaseId, setGeneratedCaseId] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  /* reset on close */
  const resetForm = useCallback(() => {
    setEntityType(null);
    setMode(null);
    setEntitySearch("");
    setSelectedCompany(null);
    setShowSuggestions(false);
    setBusinessPAN("");
    setBusinessName("");
    setProprietorPAN("");
    setFirmName("");
    setPartners([{ id: "p1", pan: "", name: "", panValid: null }]);
    setSubmitting(false);
    setSubmitted(false);
    setGeneratedCaseId("");
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    // delay reset so exit animation plays
    setTimeout(resetForm, 300);
  }, [onClose, resetForm]);

  /* click-away for suggestions */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* derived */
  const filteredCompanies = useMemo(() => {
    if (!entitySearch.trim()) return [];
    const q = entitySearch.toLowerCase();
    return MOCK_COMPANIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.cin.toLowerCase().includes(q)
    );
  }, [entitySearch]);

  const needsMode = entityType === "company";
  const showDetails =
    entityType && (!needsMode || mode !== null);

  /* form validity */
  const isFormValid = useMemo(() => {
    if (!entityType) return false;
    if (entityType === "company") {
      if (!mode) return false;
      if (mode === "network") return !!selectedCompany;
      return !!businessPAN && validatePAN(businessPAN) === true;
    }
    if (entityType === "sole_prop") return !!proprietorPAN && validatePAN(proprietorPAN) === true;
    if (entityType === "partnership") {
      if (!businessPAN || validatePAN(businessPAN) !== true) return false;
      return partners.every((p) => p.pan && validatePAN(p.pan) === true && p.name.trim());
    }
    return true;
  }, [entityType, mode, selectedCompany, businessPAN, proprietorPAN, partners]);

  /* handlers */
  const selectEntity = useCallback((e: EntityType) => {
    setEntityType(e);
    setMode(null);
    setSelectedCompany(null);
    setEntitySearch("");
    setBusinessPAN("");
    setBusinessName("");
    setProprietorPAN("");
    setFirmName("");
    setPartners([{ id: "p1", pan: "", name: "", panValid: null }]);
  }, []);

  const selectCompany = useCallback((c: CompanySuggestion) => {
    setSelectedCompany(c);
    setEntitySearch(c.name);
    setShowSuggestions(false);
  }, []);

  const addPartner = useCallback(() => {
    setPartners((prev) => [
      ...prev,
      { id: `p${Date.now()}`, pan: "", name: "", panValid: null },
    ]);
  }, []);

  const removePartner = useCallback((id: string) => {
    setPartners((prev) => (prev.length <= 1 ? prev : prev.filter((p) => p.id !== id)));
  }, []);

  const updatePartner = useCallback(
    (id: string, field: "pan" | "name", value: string) => {
      setPartners((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                [field]: field === "pan" ? value.toUpperCase() : value,
                panValid: field === "pan" ? validatePAN(value.toUpperCase()) : p.panValid,
              }
            : p
        )
      );
    },
    []
  );

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    const caseId = `CASE-${Math.floor(10000 + Math.random() * 90000)}`;
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setGeneratedCaseId(caseId);
    }, 1800);
  }, []);

  /* ═══════════════════════════════════════════
     Shared render helpers
     ═══════════════════════════════════════════ */
  const renderPANInput = (
    value: string,
    onChange: (v: string) => void,
    label: string,
    mandatory = true
  ) => {
    const valid = validatePAN(value);
    return (
      <div className="flex flex-col" style={{ gap: 6 }}>
        <label
          style={{
            fontFamily: ff,
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-body)",
            lineHeight: 1.5,
          }}
        >
          {label}
          {mandatory && <span style={{ color: "var(--destructive)" }}> *</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            maxLength={10}
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder="e.g. ABCDE1234F"
            style={{
              width: "100%",
              height: 40,
              padding: "0 36px 0 12px",
              fontFamily: ff,
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-body)",
              backgroundColor: "var(--input-background)",
              border: `1px solid ${valid === false ? "var(--destructive)" : valid === true ? "var(--success-500)" : "var(--border-default)"}`,
              borderRadius: "var(--radius)",
              outline: "none",
              transition: "border-color 0.15s ease",
              letterSpacing: "0.06em",
            }}
            onFocus={(e) => {
              if (valid === null) e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onBlur={(e) => {
              if (valid === null) e.currentTarget.style.borderColor = "var(--border-default)";
            }}
          />
          {valid !== null && (
            <div
              className="absolute flex items-center justify-center"
              style={{ right: 10, top: "50%", transform: "translateY(-50%)" }}
            >
              {valid ? (
                <CheckCircle2 style={{ width: 14, height: 14, color: "var(--success-500)" }} />
              ) : (
                <AlertCircle style={{ width: 14, height: 14, color: "var(--destructive)" }} />
              )}
            </div>
          )}
        </div>
        {valid === false && (
          <span
            style={{
              fontFamily: ff,
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--destructive)",
              lineHeight: 1.4,
            }}
          >
            Invalid PAN format. Expected: ABCDE1234F
          </span>
        )}
      </div>
    );
  };

  const renderTextInput = (
    value: string,
    onChange: (v: string) => void,
    label: string,
    placeholder: string,
    disabled = false
  ) => (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <label
        style={{
          fontFamily: ff,
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--text-body)",
          lineHeight: 1.5,
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          height: 40,
          padding: "0 12px",
          fontFamily: ff,
          fontSize: "var(--text-base)",
          fontWeight: "var(--font-weight-normal)",
          color: disabled ? "var(--text-muted-themed)" : "var(--text-body)",
          backgroundColor: disabled ? "var(--surface-inset)" : "var(--input-background)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius)",
          outline: "none",
          transition: "border-color 0.15s ease",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; }}
      />
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
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

          {/* ── Drawer ── */}
          <motion.div
            key="drawer"
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
              width: 580,
              maxWidth: "100vw",
              backgroundColor: "var(--neutral-0)",
              borderLeft: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-elevated)",
              zIndex: 51,
              fontFamily: ff,
            }}
          >
            {/* ══ Header ══ */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <span
                style={{
                  fontFamily: ff,
                  fontSize: "var(--text-md)",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  lineHeight: 1.3,
                  letterSpacing: "0.004em",
                }}
              >
                {submitted ? "Case Created" : "New Case"}
              </span>
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

            {/* ══ Body ══ */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ padding: "24px 24px 28px" }}
            >
              <AnimatePresence mode="wait">
                {/* ════════════════════════════════════
                   SUCCESS STATE
                   ════════════════════════════════════ */}
                {submitted ? (
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
                          lineHeight: 1.3,
                        }}
                      >
                        Case Generated Successfully
                      </span>
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-base)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--text-secondary-themed)",
                          lineHeight: 1.5,
                        }}
                      >
                        Your case has been queued for risk analysis. You'll receive a notification once processing is complete.
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
                      <Zap style={{ width: 13, height: 13, color: "var(--info-600)", flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--info-600)",
                          lineHeight: 1.4,
                        }}
                      >
                        {generatedCaseId} assigned
                      </span>
                    </div>
                    <div className="flex" style={{ gap: 12, marginTop: 12 }}>
                      <button
                        onClick={() => {
                          resetForm();
                        }}
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
                          lineHeight: 1,
                          transition: "background-color 0.12s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(23, 102, 214, 0.14)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(23, 102, 214, 0.08)";
                        }}
                      >
                        Create Another
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
                          lineHeight: 1,
                          transition: "background-color 0.12s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--primary-600)";
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
                  /* ════════════════════════════════════
                     FORM
                     ═══════════════════════════════════��� */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col"
                    style={{ gap: 28 }}
                  >
                    {/* ──── Section 1: Entity Type ──── */}
                    <div className="flex flex-col" style={{ gap: 14 }}>
                      <span
                        style={{
                          fontFamily: ff,
                          fontSize: "var(--text-base)",
                          fontWeight: 600,
                          color: "var(--text-heading)",
                          lineHeight: 1.3,
                        }}
                      >
                        Entity Type
                      </span>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                        }}
                      >
                        {ENTITY_TYPES.map((et) => {
                          const selected = entityType === et.key;
                          return (
                            <button
                              key={et.key}
                              onClick={() => selectEntity(et.key)}
                              className="flex items-start"
                              style={{
                                gap: 12,
                                padding: "14px 14px",
                                backgroundColor: selected
                                  ? "rgba(23, 102, 214, 0.04)"
                                  : "var(--neutral-0)",
                                border: `1.5px solid ${selected ? "var(--primary)" : "var(--border-subtle)"}`,
                                borderRadius: "var(--radius)",
                                cursor: "pointer",
                                transition: "all 0.12s ease",
                                textAlign: "left",
                                outline: "none",
                              }}
                              onMouseEnter={(e) => {
                                if (!selected) {
                                  e.currentTarget.style.borderColor = "var(--border-strong)";
                                  e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!selected) {
                                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                                  e.currentTarget.style.backgroundColor = "var(--neutral-0)";
                                }
                              }}
                            >
                              <div
                                className="flex items-center justify-center shrink-0"
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: "var(--radius)",
                                  backgroundColor: selected
                                    ? "rgba(23, 102, 214, 0.08)"
                                    : "var(--surface-inset)",
                                  color: selected
                                    ? "var(--primary)"
                                    : "var(--text-muted-themed)",
                                  transition: "all 0.12s ease",
                                }}
                              >
                                {et.icon}
                              </div>
                              <div className="flex flex-col" style={{ gap: 4 }}>
                                <span
                                  style={{
                                    fontFamily: ff,
                                    fontSize: "var(--text-base)",
                                    fontWeight: 600,
                                    color: selected
                                      ? "var(--primary)"
                                      : "var(--text-heading)",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {et.label}
                                </span>
                                <span
                                  style={{
                                    fontFamily: ff,
                                    fontSize: "var(--text-sm)",
                                    fontWeight: "var(--font-weight-normal)",
                                    color: "var(--text-muted-themed)",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {et.desc}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ──── Section 2: Assessment Mode (Company only) ──── */}
                    <AnimatePresence>
                      {needsMode && entityType && (
                        <motion.div
                          key="mode-section"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col overflow-hidden"
                          style={{ gap: 14 }}
                        >
                          <div
                            style={{
                              height: 1,
                              backgroundColor: "var(--border-subtle)",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: ff,
                              fontSize: "var(--text-base)",
                              fontWeight: 600,
                              color: "var(--text-heading)",
                              lineHeight: 1.3,
                            }}
                          >
                            Assessment Mode
                          </span>
                          <div className="flex" style={{ gap: 10 }}>
                            {([
                              {
                                key: "network" as AssessmentMode,
                                icon: <Network style={{ width: 16, height: 16 }} />,
                                label: "Network Assessment",
                                desc: "Entity + connected network",
                              },
                              {
                                key: "standalone" as AssessmentMode,
                                icon: <Target style={{ width: 16, height: 16 }} />,
                                label: "Standalone",
                                desc: "Primary entity only",
                              },
                            ]).map((m) => {
                              const selected = mode === m.key;
                              return (
                                <button
                                  key={m.key}
                                  onClick={() => setMode(m.key)}
                                  className="flex items-center flex-1"
                                  style={{
                                    gap: 12,
                                    padding: "12px 14px",
                                    backgroundColor: selected
                                      ? "rgba(23, 102, 214, 0.04)"
                                      : "var(--neutral-0)",
                                    border: `1.5px solid ${selected ? "var(--primary)" : "var(--border-subtle)"}`,
                                    borderRadius: "var(--radius)",
                                    cursor: "pointer",
                                    transition: "all 0.12s ease",
                                    textAlign: "left",
                                    outline: "none",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!selected) {
                                      e.currentTarget.style.borderColor = "var(--border-strong)";
                                      e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!selected) {
                                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                                      e.currentTarget.style.backgroundColor = "var(--neutral-0)";
                                    }
                                  }}
                                >
                                  <div
                                    className="flex items-center justify-center shrink-0"
                                    style={{
                                      width: 34,
                                      height: 34,
                                      borderRadius: "var(--radius)",
                                      backgroundColor: selected
                                        ? "rgba(23, 102, 214, 0.08)"
                                        : "var(--surface-inset)",
                                      color: selected
                                        ? "var(--primary)"
                                        : "var(--text-muted-themed)",
                                      transition: "all 0.12s ease",
                                    }}
                                  >
                                    {m.icon}
                                  </div>
                                  <div className="flex flex-col" style={{ gap: 3 }}>
                                    <span
                                      style={{
                                        fontFamily: ff,
                                        fontSize: "var(--text-base)",
                                        fontWeight: 600,
                                        color: selected
                                          ? "var(--primary)"
                                          : "var(--text-heading)",
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      {m.label}
                                    </span>
                                    <span
                                      style={{
                                        fontFamily: ff,
                                        fontSize: "var(--text-sm)",
                                        fontWeight: "var(--font-weight-normal)",
                                        color: "var(--text-muted-themed)",
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      {m.desc}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ──── Section 3: Details ──── */}
                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          key="details-section"
                          initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                          animate={{ opacity: 1, height: "auto", overflow: "visible", transitionEnd: { overflow: "visible" } }}
                          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col"
                          style={{ gap: 16 }}
                        >
                          <div
                            style={{
                              height: 1,
                              backgroundColor: "var(--border-subtle)",
                            }}
                          />

                          {/* Section header */}
                          <span
                            style={{
                              fontFamily: ff,
                              fontSize: "var(--text-base)",
                              fontWeight: 600,
                              color: "var(--text-heading)",
                              lineHeight: 1.3,
                            }}
                          >
                            Primary Entity Details
                          </span>

                          {/* === COMPANY / NETWORK === */}
                          {entityType === "company" && mode === "network" && (
                            <div className="flex flex-col" style={{ gap: 14 }}>
                              <div className="flex flex-col" style={{ gap: 6 }} ref={searchRef}>
                                <label
                                  style={{
                                    fontFamily: ff,
                                    fontSize: "var(--text-sm)",
                                    fontWeight: "var(--font-weight-medium)",
                                    color: "var(--text-body)",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  Search Entity{" "}
                                  <span style={{ color: "var(--destructive)" }}>*</span>
                                </label>
                                <div className="relative">
                                  <Search
                                    className="absolute"
                                    style={{
                                      left: 10,
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      width: 15,
                                      height: 15,
                                      color: "var(--text-muted-themed)",
                                      pointerEvents: "none",
                                    }}
                                  />
                                  <input
                                    type="text"
                                    value={entitySearch}
                                    onChange={(e) => {
                                      setEntitySearch(e.target.value);
                                      setShowSuggestions(true);
                                      if (selectedCompany) setSelectedCompany(null);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Search by company name or CIN…"
                                    style={{
                                      width: "100%",
                                      height: 40,
                                      padding: "0 12px 0 34px",
                                      fontFamily: ff,
                                      fontSize: "var(--text-base)",
                                      fontWeight: "var(--font-weight-normal)",
                                      color: "var(--text-body)",
                                      backgroundColor: "var(--input-background)",
                                      border: "1px solid var(--border-default)",
                                      borderRadius: "var(--radius)",
                                      outline: "none",
                                    }}
                                  />
                                  {/* Suggestions */}
                                  <AnimatePresence>
                                    {showSuggestions &&
                                      filteredCompanies.length > 0 &&
                                      !selectedCompany && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -3 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -3 }}
                                          transition={{ duration: 0.1 }}
                                          className="absolute"
                                          style={{
                                            top: "calc(100% + 3px)",
                                            left: 0,
                                            right: 0,
                                            zIndex: 20,
                                            backgroundColor: "var(--neutral-0)",
                                            border: "1px solid var(--border-default)",
                                            borderRadius: "var(--radius)",
                                            boxShadow: "var(--shadow-elevated)",
                                            overflow: "hidden",
                                            maxHeight: 200,
                                            overflowY: "auto",
                                          }}
                                        >
                                          {filteredCompanies.map((c) => (
                                            <button
                                              key={c.cin}
                                              onClick={() => selectCompany(c)}
                                              className="flex flex-col w-full"
                                              style={{
                                                padding: "10px 14px",
                                                gap: 2,
                                                textAlign: "left",
                                                border: "none",
                                                backgroundColor: "transparent",
                                                cursor: "pointer",
                                                borderBottom: "1px solid var(--border-subtle)",
                                                transition: "background-color 0.08s ease",
                                              }}
                                              onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                  "var(--surface-hover)";
                                              }}
                                              onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                  "transparent";
                                              }}
                                            >
                                              <span
                                                style={{
                                                  fontFamily: ff,
                                                  fontSize: "var(--text-sm)",
                                                  fontWeight: "var(--font-weight-medium)",
                                                  color: "var(--text-heading)",
                                                  lineHeight: 1.4,
                                                }}
                                              >
                                                {c.name}
                                              </span>
                                              <span
                                                style={{
                                                  fontFamily: ff,
                                                  fontSize: "var(--text-sm)",
                                                  fontWeight: "var(--font-weight-normal)",
                                                  color: "var(--text-muted-themed)",
                                                  lineHeight: 1.3,
                                                }}
                                              >
                                                CIN: {c.cin}
                                              </span>
                                            </button>
                                          ))}
                                        </motion.div>
                                      )}
                                  </AnimatePresence>
                                </div>
                              </div>

                              {/* Auto-filled */}
                              {selectedCompany && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.18 }}
                                  className="flex flex-col"
                                  style={{ gap: 12 }}
                                >
                                  <div
                                    className="flex items-center"
                                    style={{
                                      gap: 8,
                                      padding: "8px 12px",
                                      borderRadius: "var(--radius)",
                                      backgroundColor: "var(--success-50)",
                                      border: "1px solid var(--success-200)",
                                    }}
                                  >
                                    <CheckCircle2
                                      style={{
                                        width: 13,
                                        height: 13,
                                        color: "var(--success-500)",
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontFamily: ff,
                                        fontSize: "var(--text-sm)",
                                        fontWeight: "var(--font-weight-medium)",
                                        color: "var(--success-700)",
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      Entity identified — auto-filled from MCA registry
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "1fr 1fr",
                                      gap: 12,
                                    }}
                                  >
                                    {renderTextInput(selectedCompany.cin, () => {}, "CIN", "", true)}
                                    {renderTextInput(
                                      selectedCompany.pan,
                                      () => {},
                                      "Business PAN",
                                      "",
                                      true
                                    )}
                                  </div>
                                  {renderTextInput(
                                    selectedCompany.name,
                                    () => {},
                                    "Registered Name",
                                    "",
                                    true
                                  )}
                                </motion.div>
                              )}
                            </div>
                          )}

                          {/* === COMPANY / STANDALONE === */}
                          {entityType === "company" && mode === "standalone" && (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 12,
                              }}
                            >
                              {renderPANInput(businessPAN, setBusinessPAN, "Business PAN")}
                              {renderTextInput(
                                businessName,
                                setBusinessName,
                                "Business Name",
                                "Registered business name"
                              )}
                            </div>
                          )}

                          {/* === SOLE PROPRIETORSHIP === */}
                          {entityType === "sole_prop" && (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 12,
                              }}
                            >
                              {renderPANInput(proprietorPAN, setProprietorPAN, "Proprietor PAN")}
                              {renderTextInput(
                                businessName,
                                setBusinessName,
                                "Business Name",
                                "Business or trade name"
                              )}
                            </div>
                          )}

                          {/* === PARTNERSHIP === */}
                          {entityType === "partnership" && (
                            <>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: 12,
                                }}
                              >
                                {renderPANInput(businessPAN, setBusinessPAN, "Business PAN")}
                                {renderTextInput(
                                  firmName,
                                  setFirmName,
                                  "Firm Name",
                                  "Registered firm name"
                                )}
                              </div>

                              {/* Partners */}
                              <div className="flex flex-col" style={{ gap: 10, marginTop: 6 }}>
                                <div
                                  style={{
                                    height: 1,
                                    backgroundColor: "var(--border-subtle)",
                                  }}
                                />
                                <div
                                  className="flex items-center justify-between"
                                >
                                  <span
                                    style={{
                                      fontFamily: ff,
                                      fontSize: "var(--text-base)",
                                      fontWeight: 600,
                                      color: "var(--text-heading)",
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    Partners
                                  </span>
                                  <button
                                    onClick={addPartner}
                                    className="flex items-center"
                                    style={{
                                      gap: 4,
                                      height: 28,
                                      padding: "0 10px",
                                      fontFamily: ff,
                                      fontSize: "var(--text-sm)",
                                      fontWeight: 600,
                                      color: "var(--primary)",
                                      backgroundColor: "rgba(23, 102, 214, 0.08)",
                                      border: "1px solid rgba(23, 102, 214, 0.2)",
                                      borderRadius: "var(--radius)",
                                      cursor: "pointer",
                                      lineHeight: 1,
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
                                    <Plus style={{ width: 11, height: 11 }} />
                                    Add Partner
                                  </button>
                                </div>
                                {partners.map((p, idx) => (
                                  <div
                                    key={p.id}
                                    className="flex items-end"
                                    style={{ gap: 10 }}
                                  >
                                    <div style={{ flex: 1 }}>
                                      {renderPANInput(
                                        p.pan,
                                        (v) => updatePartner(p.id, "pan", v),
                                        `Partner ${idx + 1} PAN`
                                      )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      {renderTextInput(
                                        p.name,
                                        (v) => updatePartner(p.id, "name", v),
                                        `Partner ${idx + 1} Name`,
                                        "Full name"
                                      )}
                                    </div>
                                    <button
                                      onClick={() => removePartner(p.id)}
                                      disabled={partners.length <= 1}
                                      className="flex items-center justify-center"
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "var(--radius)",
                                        backgroundColor: "transparent",
                                        border: "1px solid var(--border-subtle)",
                                        cursor:
                                          partners.length <= 1 ? "not-allowed" : "pointer",
                                        color:
                                          partners.length <= 1
                                            ? "var(--neutral-200)"
                                            : "var(--destructive)",
                                        transition: "all 0.12s ease",
                                        flexShrink: 0,
                                      }}
                                    >
                                      <Trash2 style={{ width: 13, height: 13 }} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {/* === OTHERS === */}
                          {entityType === "others" && (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 12,
                              }}
                            >
                              {renderTextInput(
                                businessName,
                                setBusinessName,
                                "Entity Name",
                                "Enter entity name"
                              )}
                              {renderTextInput(
                                "",
                                () => {},
                                "Entity Identifier",
                                "Registration number or PAN"
                              )}
                            </div>
                          )}

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ══ Footer ══ */}
            {!submitted && (
              <div
                className="flex items-center justify-between shrink-0"
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <button
                  onClick={handleClose}
                  style={{
                    height: 40,
                    padding: "0 18px",
                    fontFamily: ff,
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-secondary-themed)",
                    backgroundColor: "transparent",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius)",
                    cursor: "pointer",
                    lineHeight: 1,
                    transition: "background-color 0.12s ease",
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
                    gap: 6,
                    height: 40,
                    padding: "0 22px",
                    fontFamily: ff,
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--primary-foreground)",
                    backgroundColor:
                      !isFormValid || submitting
                        ? "rgba(23, 102, 214, 0.32)"
                        : "var(--primary)",
                    border: "none",
                    borderRadius: "var(--radius)",
                    cursor: !isFormValid || submitting ? "not-allowed" : "pointer",
                    transition: "background-color 0.12s ease",
                    lineHeight: 1,
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
                  {submitting ? (
                    <>
                      <Loader2
                        style={{
                          width: 14,
                          height: 14,
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Generating…
                    </>
                  ) : (
                    <>
                      Generate Case
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

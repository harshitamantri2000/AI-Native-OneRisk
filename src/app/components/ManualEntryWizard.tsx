import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  User,
  Users,
  MoreHorizontal,
  Network,
  FileText,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";

const f = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
} as const;

/* ─── Types ─── */
type EntityType = "company-llp" | "sole-prop" | "partnership" | "others";
type CompanyMode = "network" | "standalone";

interface Partner {
  id: string;
  name: string;
  pan: string;
}

interface AssociatedParty {
  id: string;
  cin: string;
  businessName: string;
}

const ENTITY_TYPES: {
  key: EntityType;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    key: "company-llp",
    label: "Company / LLP",
    desc: "Private, Public, OPC, or Limited Liability Partnership registered with MCA.",
    icon: Building2,
  },
  {
    key: "sole-prop",
    label: "Sole Proprietorship",
    desc: "Business owned and operated by a single individual.",
    icon: User,
  },
  {
    key: "partnership",
    label: "Partnership Firm",
    desc: "Business owned by two or more partners sharing profits and liabilities.",
    icon: Users,
  },
  {
    key: "others",
    label: "Others",
    desc: "Trust, Society, HUF, or any other entity type not listed above.",
    icon: MoreHorizontal,
  },
];

/* ═══════════════════════════════════════════════════════════
   ManualEntryWizard
   ═══════════════════════════════════════════════════════════ */
export const ManualEntryWizard = ({
  initialSearch,
  onCancel,
  onGenerate,
  isGenerating,
}: {
  initialSearch: string;
  onCancel: () => void;
  onGenerate: (data: Record<string, unknown>) => void;
  isGenerating: boolean;
}) => {
  /* Step 1 */
  const [entityType, setEntityType] = useState<EntityType | null>(null);

  /* Step 2 (Company only) */
  const [companyMode, setCompanyMode] = useState<CompanyMode>("network");

  /* Step 3 — fields */
  const [businessName, setBusinessName] = useState("");
  const [businessPan, setBusinessPan] = useState("");
  const [cin, setCin] = useState(initialSearch);
  const [proprietorPan, setProprietorPan] = useState("");
  const [firmName, setFirmName] = useState("");
  const [partners, setPartners] = useState<Partner[]>([
    { id: "p1", name: "", pan: "" },
  ]);
  const [associatedParties, setAssociatedParties] = useState<AssociatedParty[]>(
    []
  );

  /* Others fields */
  const [othersEntityName, setOthersEntityName] = useState("");
  const [othersPan, setOthersPan] = useState("");

  /* ─── Derived ─── */
  const showStep2 = entityType === "company-llp";
  const showStep3 = entityType !== null;

  const currentStep = !entityType ? 1 : showStep2 && !companyMode ? 2 : showStep2 ? 3 : 3;

  /* ─── Helpers ─── */
  const addPartner = () =>
    setPartners((p) => [...p, { id: `p${Date.now()}`, name: "", pan: "" }]);
  const removePartner = (id: string) =>
    setPartners((p) => p.filter((x) => x.id !== id));
  const updatePartner = (id: string, field: "name" | "pan", value: string) =>
    setPartners((p) =>
      p.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    );

  const addAssociatedParty = () =>
    setAssociatedParties((a) => [
      ...a,
      { id: `ap${Date.now()}`, cin: "", businessName: "" },
    ]);
  const removeAssociatedParty = (id: string) =>
    setAssociatedParties((a) => a.filter((x) => x.id !== id));
  const updateAssociatedParty = (
    id: string,
    field: "cin" | "businessName",
    value: string
  ) =>
    setAssociatedParties((a) =>
      a.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    );

  /* ─── Validation ─── */
  const canGenerate = useCallback((): boolean => {
    if (!entityType) return false;
    if (entityType === "company-llp") {
      if (companyMode === "network") return !!cin.trim();
      return !!businessPan.trim();
    }
    if (entityType === "sole-prop") return !!proprietorPan.trim();
    if (entityType === "partnership") return !!businessPan.trim();
    if (entityType === "others") return !!othersEntityName.trim();
    return false;
  }, [entityType, companyMode, cin, businessPan, proprietorPan, othersEntityName]);

  const handleGenerate = () => {
    onGenerate({
      entityType,
      companyMode: entityType === "company-llp" ? companyMode : undefined,
      cin,
      businessName,
      businessPan,
      proprietorPan,
      firmName,
      partners,
      associatedParties,
      othersEntityName,
      othersPan,
    });
  };

  /* ─── Shared input styles ─── */
  const inputStyle: React.CSSProperties = {
    ...f,
    fontSize: "var(--text-sm)",
    lineHeight: "normal",
    fontWeight: "var(--font-weight-normal)",
    color: "var(--text-heading)",
    height: 40,
    padding: "0 12px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border-default)",
    backgroundColor: "var(--neutral-0)",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    ...f,
    fontSize: "var(--text-sm)",
    lineHeight: "16.8px",
    fontWeight: "var(--font-weight-medium)" as unknown as number,
    color: "var(--text-heading)",
    display: "block",
    marginBottom: 6,
  };

  const sectionHeadingStyle: React.CSSProperties = {
    ...f,
    fontSize: "var(--text-sm)",
    lineHeight: "16.8px",
    fontWeight: 600,
    color: "var(--text-heading)",
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--primary)";
    e.currentTarget.style.boxShadow =
      "0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--border-default)";
    e.currentTarget.style.boxShadow = "none";
  };

  /* ─── Step number badge ─── */
  const StepBadge = ({
    num,
    active,
    done,
  }: {
    num: number;
    active: boolean;
    done: boolean;
  }) => (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: done
          ? "var(--primary)"
          : active
          ? "color-mix(in srgb, var(--primary) 12%, transparent)"
          : "var(--surface-inset)",
        border: active
          ? "1px solid color-mix(in srgb, var(--primary) 30%, transparent)"
          : done
          ? "none"
          : "1px solid var(--border-subtle)",
        transition: "all 0.2s ease",
      }}
    >
      {done ? (
        <Check
          style={{ width: 12, height: 12, color: "var(--text-on-color)" }}
        />
      ) : (
        <span
          style={{
            ...f,
            fontSize: "var(--text-xs)",
            lineHeight: "1",
            fontWeight: "var(--font-weight-medium)" as unknown as number,
            color: active ? "var(--primary)" : "var(--text-muted-themed)",
          }}
        >
          {num}
        </span>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        marginTop: 20,
        borderRadius: "var(--radius)",
        border: "1px solid var(--border-subtle)",
        backgroundColor: "var(--neutral-0)",
        boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "16.8px",
              fontWeight: 600,
              color: "var(--text-heading)",
              display: "block",
            }}
          >
            Manual Case Creation
          </span>
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "18px",
              fontWeight: "var(--font-weight-normal)" as unknown as number,
              color: "var(--text-muted-themed)",
              display: "block",
              marginTop: 3,
            }}
          >
            Select the entity type and fill in the required details.
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center cursor-pointer shrink-0"
          style={{
            ...f,
            fontSize: "var(--text-sm)",
            lineHeight: "16.8px",
            fontWeight: "var(--font-weight-medium)" as unknown as number,
            color: "var(--text-muted-themed)",
            background: "none",
            border: "none",
            padding: "6px 10px",
            borderRadius: "var(--radius)",
            gap: 4,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-heading)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted-themed)";
          }}
        >
          Cancel
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "20px" }}>
        {/* ────────── STEP 1: Entity Type ────────── */}
        <div style={{ marginBottom: entityType ? 24 : 0 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
            <StepBadge num={1} active={!entityType} done={!!entityType} />
            <span style={sectionHeadingStyle}>Select Entity Type</span>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {ENTITY_TYPES.map((et) => {
              const selected = entityType === et.key;
              const Icon = et.icon;
              return (
                <button
                  key={et.key}
                  type="button"
                  onClick={() => {
                    setEntityType(et.key);
                    if (et.key !== "company-llp") {
                      setCompanyMode("network");
                    }
                  }}
                  className="flex flex-col items-start cursor-pointer"
                  style={{
                    padding: "14px 14px 16px",
                    borderRadius: "var(--radius)",
                    border: selected
                      ? "1.5px solid var(--primary)"
                      : "1px solid var(--border-subtle)",
                    backgroundColor: selected
                      ? "color-mix(in srgb, var(--primary) 4%, transparent)"
                      : "var(--neutral-0)",
                    transition: "all 0.15s ease",
                    textAlign: "left" as const,
                    gap: 0,
                    position: "relative" as const,
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = "var(--border-strong)";
                      e.currentTarget.style.backgroundColor = "var(--surface-inset)";
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
                    className="flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius)",
                      backgroundColor: selected
                        ? "color-mix(in srgb, var(--primary) 10%, transparent)"
                        : "var(--surface-inset)",
                      border: selected
                        ? "1px solid color-mix(in srgb, var(--primary) 20%, transparent)"
                        : "1px solid var(--border-subtle)",
                      marginBottom: 10,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon
                      style={{
                        width: 16,
                        height: 16,
                        color: selected
                          ? "var(--primary)"
                          : "var(--text-muted-themed)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      ...f,
                      fontSize: "var(--text-sm)",
                      lineHeight: "16.8px",
                      fontWeight: "var(--font-weight-medium)" as unknown as number,
                      color: selected
                        ? "var(--primary)"
                        : "var(--text-heading)",
                      marginBottom: 4,
                    }}
                  >
                    {et.label}
                  </span>
                  <span
                    style={{
                      ...f,
                      fontSize: "var(--text-sm)",
                      lineHeight: "150%",
                      fontWeight: "var(--font-weight-normal)" as unknown as number,
                      color: "var(--text-muted-themed)",
                    }}
                  >
                    {et.desc}
                  </span>
                  {selected && (
                    <div
                      className="flex items-center justify-center"
                      style={{
                        position: "absolute" as const,
                        top: 10,
                        right: 10,
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: "var(--primary)",
                      }}
                    >
                      <Check
                        style={{
                          width: 10,
                          height: 10,
                          color: "var(--text-on-color)",
                        }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ────────── STEP 2: Mode (Company/LLP only) ────────── */}
        <AnimatePresence>
          {entityType === "company-llp" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: 24, overflow: "hidden" }}
            >
              <div
                className="flex items-center"
                style={{ gap: 8, marginBottom: 14 }}
              >
                <StepBadge num={2} active={true} done={false} />
                <span style={sectionHeadingStyle}>Assessment Mode</span>
              </div>

              <div className="flex items-center" style={{ gap: 0 }}>
                <div
                  className="flex items-center"
                  style={{
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-subtle)",
                    overflow: "hidden",
                    backgroundColor: "var(--surface-inset)",
                    padding: 3,
                    gap: 2,
                  }}
                >
                  {(
                    [
                      {
                        key: "network" as CompanyMode,
                        label: "Network Assessment",
                        icon: Network,
                        desc: "Full network & relationship mapping",
                      },
                      {
                        key: "standalone" as CompanyMode,
                        label: "Standalone",
                        icon: FileText,
                        desc: "Single entity assessment",
                      },
                    ] as const
                  ).map((mode) => {
                    const sel = companyMode === mode.key;
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setCompanyMode(mode.key)}
                        className="flex items-center cursor-pointer"
                        style={{
                          ...f,
                          fontSize: "var(--text-sm)",
                          lineHeight: "16.8px",
                          fontWeight: "var(--font-weight-medium)" as unknown as number,
                          color: sel
                            ? "var(--primary)"
                            : "var(--text-muted-themed)",
                          padding: "8px 16px",
                          gap: 6,
                          borderRadius: 6,
                          border: sel
                            ? "1px solid var(--border-subtle)"
                            : "1px solid transparent",
                          backgroundColor: sel
                            ? "var(--neutral-0)"
                            : "transparent",
                          boxShadow: sel
                            ? "0 1px 2px rgba(0,0,0,0.05)"
                            : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Icon style={{ width: 14, height: 14 }} />
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode description */}
              <div
                style={{
                  marginTop: 8,
                  ...f,
                  fontSize: "var(--text-sm)",
                  lineHeight: "150%",
                  fontWeight: "var(--font-weight-normal)" as unknown as number,
                  color: "var(--text-muted-themed)",
                }}
              >
                {companyMode === "network"
                  ? "Performs full network mapping, UBO identification, and connected-party risk analysis."
                  : "Runs a standalone due diligence assessment on a single entity without network analysis."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ────────── STEP 3: Dynamic Fields ────────── */}
        <AnimatePresence>
          {entityType && (
            <motion.div
              key={`${entityType}-${companyMode}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="flex items-center"
                style={{ gap: 8, marginBottom: 14 }}
              >
                <StepBadge
                  num={entityType === "company-llp" ? 3 : 2}
                  active={true}
                  done={false}
                />
                <span style={sectionHeadingStyle}>Entity Information</span>
              </div>

              <div
                style={{
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border-subtle)",
                  overflow: "hidden",
                }}
              >
                {/* ── Primary Entity Details ── */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--surface-inset)",
                  }}
                >
                  <span
                    style={{
                      ...f,
                      fontSize: "var(--text-sm)",
                      lineHeight: "16.8px",
                      fontWeight: "var(--font-weight-medium)" as unknown as number,
                      color: "var(--text-secondary-themed)",
                    }}
                  >
                    Primary Entity Details
                  </span>
                </div>

                <div
                  style={{ padding: "16px 16px" }}
                >
                  {/* ── Company / LLP — Network ── */}
                  {entityType === "company-llp" &&
                    companyMode === "network" && (
                      <div className="grid grid-cols-2" style={{ gap: 14 }}>
                        <FormField
                          label="CIN"
                          required
                          value={cin}
                          onChange={setCin}
                          placeholder="e.g. U72200KA2018PTC115234"
                          inputStyle={inputStyle}
                          labelStyle={labelStyle}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                        <FormField
                          label="Business Name"
                          value={businessName}
                          onChange={setBusinessName}
                          placeholder="Enter business name"
                          inputStyle={inputStyle}
                          labelStyle={labelStyle}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                      </div>
                    )}

                  {/* ── Company / LLP — Standalone ── */}
                  {entityType === "company-llp" &&
                    companyMode === "standalone" && (
                      <div className="grid grid-cols-2" style={{ gap: 14 }}>
                        <FormField
                          label="Business PAN"
                          required
                          value={businessPan}
                          onChange={setBusinessPan}
                          placeholder="e.g. AABCT1234A"
                          inputStyle={inputStyle}
                          labelStyle={labelStyle}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                        <FormField
                          label="Business Name"
                          value={businessName}
                          onChange={setBusinessName}
                          placeholder="Enter business name"
                          inputStyle={inputStyle}
                          labelStyle={labelStyle}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                      </div>
                    )}

                  {/* ── Sole Proprietorship ── */}
                  {entityType === "sole-prop" && (
                    <div className="grid grid-cols-2" style={{ gap: 14 }}>
                      <FormField
                        label="Proprietor PAN"
                        required
                        value={proprietorPan}
                        onChange={setProprietorPan}
                        placeholder="e.g. ABCDE1234F"
                        inputStyle={inputStyle}
                        labelStyle={labelStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                      <FormField
                        label="Business Name"
                        value={businessName}
                        onChange={setBusinessName}
                        placeholder="Enter business name"
                        inputStyle={inputStyle}
                        labelStyle={labelStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                  )}

                  {/* ── Partnership ── */}
                  {entityType === "partnership" && (
                    <div className="grid grid-cols-2" style={{ gap: 14 }}>
                      <FormField
                        label="Business PAN"
                        required
                        value={businessPan}
                        onChange={setBusinessPan}
                        placeholder="e.g. AABCT1234A"
                        inputStyle={inputStyle}
                        labelStyle={labelStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                      <FormField
                        label="Firm Name"
                        value={firmName}
                        onChange={setFirmName}
                        placeholder="Enter firm name"
                        inputStyle={inputStyle}
                        labelStyle={labelStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                  )}

                  {/* ── Others ── */}
                  {entityType === "others" && (
                    <div className="grid grid-cols-2" style={{ gap: 14 }}>
                      <FormField
                        label="Entity Name"
                        required
                        value={othersEntityName}
                        onChange={setOthersEntityName}
                        placeholder="Enter entity name"
                        inputStyle={inputStyle}
                        labelStyle={labelStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                      <FormField
                        label="PAN"
                        value={othersPan}
                        onChange={setOthersPan}
                        placeholder="e.g. AABCT1234A"
                        inputStyle={inputStyle}
                        labelStyle={labelStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                  )}
                </div>

                {/* ── Associated Parties (Company Network) ── */}
                {entityType === "company-llp" &&
                  companyMode === "network" && (
                    <>
                      <div
                        className="flex items-center justify-between"
                        style={{
                          padding: "14px 16px",
                          borderTop: "1px solid var(--border-subtle)",
                          borderBottom:
                            associatedParties.length > 0
                              ? "1px solid var(--border-subtle)"
                              : "none",
                          backgroundColor: "var(--surface-inset)",
                        }}
                      >
                        <span
                          style={{
                            ...f,
                            fontSize: "var(--text-sm)",
                            lineHeight: "16.8px",
                            fontWeight: "var(--font-weight-medium)" as unknown as number,
                            color: "var(--text-secondary-themed)",
                          }}
                        >
                          Associated Parties
                          {associatedParties.length > 0 && (
                            <span style={{ color: "var(--text-muted-themed)", fontWeight: "var(--font-weight-normal)" as unknown as number }}> ({associatedParties.length})</span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={addAssociatedParty}
                          className="flex items-center cursor-pointer"
                          style={{
                            ...f,
                            fontSize: "var(--text-sm)",
                            lineHeight: "16.8px",
                            fontWeight: "var(--font-weight-medium)" as unknown as number,
                            color: "var(--primary)",
                            background: "none",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "var(--radius)",
                            gap: 4,
                            transition: "background-color 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "color-mix(in srgb, var(--primary) 6%, transparent)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <Plus style={{ width: 13, height: 13 }} />
                          Add Party
                        </button>
                      </div>
                      {associatedParties.length > 0 && (
                        <div style={{ padding: "12px 16px" }}>
                          <div
                            className="flex flex-col"
                            style={{ gap: 10 }}
                          >
                            {associatedParties.map((ap, idx) => (
                              <div
                                key={ap.id}
                                className="flex items-end"
                                style={{ gap: 10 }}
                              >
                                <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 4 }}>
                                  {idx === 0 && (
                                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                                      CIN <span style={{ color: "var(--destructive-500)" }}>*</span>
                                    </label>
                                  )}
                                  <input
                                    type="text"
                                    value={ap.cin}
                                    onChange={(e) =>
                                      updateAssociatedParty(
                                        ap.id,
                                        "cin",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter CIN"
                                    className="outline-none"
                                    style={inputStyle}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                  />
                                </div>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 4 }}>
                                  {idx === 0 && (
                                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                                      Business Name
                                    </label>
                                  )}
                                  <input
                                    type="text"
                                    value={ap.businessName}
                                    onChange={(e) =>
                                      updateAssociatedParty(
                                        ap.id,
                                        "businessName",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter business name"
                                    className="outline-none"
                                    style={inputStyle}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeAssociatedParty(ap.id)
                                  }
                                  className="flex items-center justify-center cursor-pointer shrink-0"
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "var(--radius)",
                                    border: "1px solid var(--border-subtle)",
                                    backgroundColor: "transparent",
                                    color: "var(--text-muted-themed)",
                                    padding: 0,
                                    transition: "all 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor =
                                      "var(--destructive-500)";
                                    e.currentTarget.style.color =
                                      "var(--destructive-500)";
                                    e.currentTarget.style.backgroundColor =
                                      "color-mix(in srgb, var(--destructive-500) 6%, transparent)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor =
                                      "var(--border-subtle)";
                                    e.currentTarget.style.color =
                                      "var(--text-muted-themed)";
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                  }}
                                >
                                  <Trash2
                                    style={{ width: 14, height: 14 }}
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {associatedParties.length === 0 && (
                        <div
                          className="flex flex-col items-center justify-center"
                          style={{
                            padding: "20px 16px",
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              ...f,
                              fontSize: "var(--text-sm)",
                              lineHeight: "18px",
                              fontWeight: "var(--font-weight-normal)" as unknown as number,
                              color: "var(--text-muted-themed)",
                            }}
                          >
                            No associated parties added yet. Click &quot;Add Party&quot; to include connected entities.
                          </span>
                        </div>
                      )}
                    </>
                  )}

                {/* ── Partners (Partnership) ── */}
                {entityType === "partnership" && (
                  <>
                    <div
                      className="flex items-center justify-between"
                      style={{
                        padding: "14px 16px",
                        borderTop: "1px solid var(--border-subtle)",
                        borderBottom: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--surface-inset)",
                      }}
                    >
                      <span
                        style={{
                          ...f,
                          fontSize: "var(--text-sm)",
                          lineHeight: "16.8px",
                          fontWeight: "var(--font-weight-medium)" as unknown as number,
                          color: "var(--text-secondary-themed)",
                        }}
                      >
                        Partners
                        <span style={{ color: "var(--text-muted-themed)", fontWeight: "var(--font-weight-normal)" as unknown as number }}> ({partners.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={addPartner}
                        className="flex items-center cursor-pointer"
                        style={{
                          ...f,
                          fontSize: "var(--text-sm)",
                          lineHeight: "16.8px",
                          fontWeight: "var(--font-weight-medium)" as unknown as number,
                          color: "var(--primary)",
                          background: "none",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "var(--radius)",
                          gap: 4,
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "color-mix(in srgb, var(--primary) 6%, transparent)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "transparent";
                        }}
                      >
                        <Plus style={{ width: 13, height: 13 }} />
                        Add Partner
                      </button>
                    </div>
                    <div style={{ padding: "12px 16px" }}>
                      <div className="flex flex-col" style={{ gap: 10 }}>
                        {partners.map((p, idx) => (
                          <div
                            key={p.id}
                            className="flex items-end"
                            style={{ gap: 10 }}
                          >
                            <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 4 }}>
                              {idx === 0 && (
                                <label style={{ ...labelStyle, marginBottom: 0 }}>
                                  Partner Name
                                </label>
                              )}
                              <input
                                type="text"
                                value={p.name}
                                onChange={(e) =>
                                  updatePartner(
                                    p.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter partner name"
                                className="outline-none"
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                              />
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 4 }}>
                              {idx === 0 && (
                                <label style={{ ...labelStyle, marginBottom: 0 }}>
                                  Partner PAN
                                </label>
                              )}
                              <input
                                type="text"
                                value={p.pan}
                                onChange={(e) =>
                                  updatePartner(
                                    p.id,
                                    "pan",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter PAN"
                                className="outline-none"
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                              />
                            </div>
                            {partners.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePartner(p.id)}
                                className="flex items-center justify-center cursor-pointer shrink-0"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "var(--radius)",
                                  border: "1px solid var(--border-subtle)",
                                  backgroundColor: "transparent",
                                  color: "var(--text-muted-themed)",
                                  padding: 0,
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor =
                                    "var(--destructive-500)";
                                  e.currentTarget.style.color =
                                    "var(--destructive-500)";
                                  e.currentTarget.style.backgroundColor =
                                    "color-mix(in srgb, var(--destructive-500) 6%, transparent)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor =
                                    "var(--border-subtle)";
                                  e.currentTarget.style.color =
                                    "var(--text-muted-themed)";
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                }}
                              >
                                <Trash2
                                  style={{ width: 14, height: 14 }}
                                />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      {entityType && (
        <div
          className="flex items-center justify-end"
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border-subtle)",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center cursor-pointer"
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-medium)" as unknown as number,
              height: 38,
              padding: "0 16px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-default)",
              backgroundColor: "var(--neutral-0)",
              color: "var(--text-secondary-themed)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--neutral-0)";
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !canGenerate()}
            className="flex items-center cursor-pointer"
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-medium)" as unknown as number,
              height: 38,
              padding: "0 20px",
              gap: 8,
              borderRadius: "var(--radius)",
              border: "none",
              backgroundColor: !canGenerate()
                ? "color-mix(in srgb, var(--primary) 32%, transparent)"
                : isGenerating
                ? "color-mix(in srgb, var(--primary) 60%, transparent)"
                : "var(--primary)",
              color: !canGenerate()
                ? "color-mix(in srgb, var(--neutral-0) 60%, transparent)"
                : "var(--text-on-color)",
              transition: "all 0.15s ease",
              opacity: isGenerating ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isGenerating && canGenerate())
                e.currentTarget.style.backgroundColor = "var(--primary-600)";
            }}
            onMouseLeave={(e) => {
              if (!isGenerating && canGenerate())
                e.currentTarget.style.backgroundColor = "var(--primary)";
            }}
          >
            {isGenerating ? (
              <>
                <Loader2
                  className="animate-spin"
                  style={{ width: 16, height: 16 }}
                />
                Generating Case...
              </>
            ) : (
              <>
                Generate Case
                <ArrowRight style={{ width: 16, height: 16 }} />
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

/* ─── Reusable Form Field ─── */
const FormField = ({
  label,
  required,
  value,
  onChange,
  placeholder,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => (
  <div style={{ display: "flex", flexDirection: "column" as const }}>
    <label style={labelStyle}>
      {label}
      {required && (
        <span style={{ color: "var(--destructive-500)" }}> *</span>
      )}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="outline-none"
      style={inputStyle}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </div>
);
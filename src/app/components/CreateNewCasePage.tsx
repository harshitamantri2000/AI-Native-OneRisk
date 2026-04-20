import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Building2,
  MapPin,
  CheckCircle2,
  Loader2,
  X,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Landmark,
  CreditCard,
  Users,
  User,
} from "lucide-react";
import { MOCK_COMPANIES, type Company } from "../data/companies";
import { ManualEntryWizard } from "./ManualEntryWizard";
import { CaseCreatedModal } from "./CaseCreatedModal";

const f = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
} as const;

/* ─── Helpers ─── */
const getOrgType = (cin: string): string => {
  if (cin.includes("PTC")) return "Company";
  if (cin.includes("PLC")) return "Public Company";
  if (cin.includes("GAP")) return "Govt. Company";
  if (cin.includes("NPL")) return "Not-for-Profit";
  return "Company";
};

/* ═══════════════════════════════════════════════════════════
   CreateNewCasePage
   ═══════════════════════════════════════════════════════════ */
export const CreateNewCasePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [caseGenerated, setCaseGenerated] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [selectedOrgType, setSelectedOrgType] = useState("Company / LLP");
  const [modalOpen, setModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_COMPANIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.cin.toLowerCase().includes(q) ||
        c.pan.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedCompany(null);
    setCaseGenerated(false);
    setManualEntry(false);
    if (value.trim()) {
      setIsSearching(true);
      setShowDropdown(false);
      setTimeout(() => {
        setIsSearching(false);
        setShowDropdown(true);
      }, 400);
    } else {
      setIsSearching(false);
      setShowDropdown(false);
    }
  }, []);

  const handleSelectCompany = useCallback((company: Company) => {
    setSelectedCompany(company);
    setSearchQuery(company.name);
    setShowDropdown(false);
    setCaseGenerated(false);
    setSelectedOrgType("Company / LLP");
  }, []);

  const handleGenerateCase = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCaseGenerated(true);
      setModalOpen(true);
    }, 2000);
  }, []);

  const fillExample = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedCompany(null);
    setCaseGenerated(false);
    setIsSearching(true);
    setShowDropdown(false);
    setTimeout(() => {
      setIsSearching(false);
      setShowDropdown(true);
    }, 400);
  }, []);

  return (
    <main
      className="flex-1 flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "var(--neutral-0)" }}
    >
      {/* ── Top Header: Breadcrumb + Title ── */}
      <div
        className="shrink-0"
        style={{
          backgroundColor: "var(--neutral-0)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center" style={{ height: 40, paddingLeft: 32, gap: 2 }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "16.8px",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
            }}
          >
            Risk Bundles
          </button>
          <ChevronRight
            style={{ width: 16, height: 16, color: "var(--border-strong)", flexShrink: 0 }}
          />
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "16.8px",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
            }}
          >
            Entity Due Diligence
          </button>
          <ChevronRight
            style={{ width: 16, height: 16, color: "var(--border-strong)", flexShrink: 0 }}
          />
          <span
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "16.8px",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-heading)",
            }}
          >
            Create New Case
          </span>
        </div>

        {/* Divider between breadcrumb and heading */}
        <div style={{ borderBottom: "1px solid var(--border-subtle)" }} />

        {/* Page Title with Back Button */}
        <div className="flex items-center" style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 12, paddingBottom: 20, gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center cursor-pointer shrink-0"
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--neutral-0)",
              color: "var(--text-muted-themed)",
              padding: 0,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-hover)";
              e.currentTarget.style.borderColor = "var(--border-default)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--neutral-0)";
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </button>
          <span
            style={{
              ...f,
              fontSize: "var(--text-lg)",
              lineHeight: "132%",
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Create New Case
          </span>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--neutral-0)" }}>
        <div style={{ padding: "28px 32px" }}>
          {/* ── Entity Identification Card ── */}
          <div
            style={{
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--neutral-0)",
              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.04)",
            }}
          >
            {/* Card Header */}
            <div style={{ padding: "18px 20px 0 20px" }}>
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
                Entity Identification
              </span>
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  lineHeight: "18px",
                  fontWeight: "var(--font-weight-normal)",
                  color: "var(--text-muted-themed)",
                  display: "block",
                  marginTop: 6,
                }}
              >
                Search by CIN, PAN, or company name to auto-populate entity details.
              </span>
            </div>

            {/* Search Input */}
            <div style={{ padding: "16px 20px 0 20px" }}>
              <div ref={searchRef} className="relative">
                <div
                  className="flex items-center"
                  style={{
                    height: 44,
                    borderRadius: "var(--radius)",
                    border: showDropdown
                      ? "1px solid var(--primary)"
                      : "1px solid var(--border-default)",
                    backgroundColor: "var(--neutral-0)",
                    padding: "0 14px",
                    gap: 10,
                    boxShadow: showDropdown
                      ? "0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent)"
                      : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {isSearching ? (
                    <Loader2
                      className="animate-spin"
                      style={{ width: 15, height: 15, color: "var(--primary)", flexShrink: 0 }}
                    />
                  ) : (
                    <Search
                      style={{ width: 15, height: 15, color: "var(--text-muted-themed)", flexShrink: 0 }}
                    />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0 && !selectedCompany) setShowDropdown(true);
                    }}
                    placeholder="Search using CIN, PAN, or Company Name"
                    className="flex-1 bg-transparent outline-none border-none"
                    style={{
                      ...f,
                      fontSize: "var(--text-sm)",
                      lineHeight: "normal",
                      fontWeight: "var(--font-weight-normal)",
                      color: "var(--text-heading)",
                      minWidth: 0,
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCompany(null);
                        setShowDropdown(false);
                        setCaseGenerated(false);
                        inputRef.current?.focus();
                      }}
                      className="flex items-center justify-center cursor-pointer shrink-0"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: "none",
                        backgroundColor: "transparent",
                        color: "var(--text-muted-themed)",
                        padding: 0,
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-heading)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted-themed)"; }}
                    >
                      <X style={{ width: 15, height: 15 }} />
                    </button>
                  )}
                </div>

                {/* ── Dropdown Suggestions ── */}
                <AnimatePresence>
                  {showDropdown && !selectedCompany && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 w-full"
                      style={{
                        top: "calc(100% + 2px)",
                        left: 0,
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--neutral-0)",
                        boxShadow: "var(--shadow-elevated)",
                        overflow: "hidden",
                        maxHeight: 380,
                        overflowY: "auto",
                      }}
                    >
                      {suggestions.length > 0 ? (
                        suggestions.map((company) => (
                          <button
                            key={company.id}
                            type="button"
                            onClick={() => handleSelectCompany(company)}
                            className="w-full flex items-center cursor-pointer"
                            style={{
                              padding: "12px 16px",
                              border: "none",
                              backgroundColor: "transparent",
                              gap: 12,
                              textAlign: "left" as const,
                              borderBottom: "1px solid var(--border-subtle)",
                              transition: "background-color 0.1s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            {/* Building icon */}
                            <div
                              className="flex items-center justify-center shrink-0"
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "var(--radius)",
                                backgroundColor: "var(--surface-inset)",
                                border: "1px solid var(--border-subtle)",
                              }}
                            >
                              <Building2
                                style={{ width: 16, height: 16, color: "var(--text-muted-themed)" }}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col" style={{ gap: 3, minWidth: 0 }}>
                              <div className="flex items-center" style={{ gap: 8 }}>
                                <span
                                  className="truncate"
                                  style={{
                                    ...f,
                                    fontSize: "var(--text-base)",
                                    lineHeight: "140%",
                                    fontWeight: "var(--font-weight-medium)",
                                    color: "var(--text-heading)",
                                  }}
                                >
                                  {company.name}
                                </span>
                                <span
                                  style={{
                                    ...f,
                                    fontSize: "var(--text-sm)",
                                    lineHeight: "140%",
                                    fontWeight: "var(--font-weight-medium)",
                                    color: "var(--primary)",
                                  }}
                                >
                                  {getOrgType(company.cin)}
                                </span>
                              </div>
                              <div className="flex items-center" style={{ gap: 12 }}>
                                <span
                                  className="flex items-center"
                                  style={{
                                    ...f,
                                    fontSize: "var(--text-sm)",
                                    lineHeight: "140%",
                                    fontWeight: "var(--font-weight-normal)",
                                    color: "var(--text-muted-themed)",
                                    gap: 3,
                                  }}
                                >
                                  <MapPin style={{ width: 11, height: 11, flexShrink: 0 }} />
                                  {company.registeredAddress}
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
                                  {company.cin}
                                </span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <ArrowRight
                              style={{
                                width: 16,
                                height: 16,
                                color: "var(--border-strong)",
                                flexShrink: 0,
                              }}
                            />
                          </button>
                        ))
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center"
                          style={{ padding: "28px 20px 24px", gap: 0 }}
                        >
                          {/* Search icon in circle */}
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              backgroundColor: "var(--surface-inset)",
                              marginBottom: 10,
                            }}
                          >
                            <Search
                              style={{ width: 18, height: 18, color: "var(--text-muted-themed)", opacity: 0.5 }}
                            />
                          </div>
                          {/* Heading */}
                          <span
                            style={{
                              ...f,
                              fontSize: "var(--text-sm)",
                              lineHeight: "16.8px",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--text-heading)",
                              marginBottom: 6,
                            }}
                          >
                            No entity found
                          </span>
                          {/* Description */}
                          <span
                            style={{
                              ...f,
                              fontSize: "var(--text-sm)",
                              lineHeight: "18px",
                              fontWeight: "var(--font-weight-normal)",
                              color: "var(--text-muted-themed)",
                              textAlign: "center" as const,
                              maxWidth: 262,
                              marginBottom: 14,
                            }}
                          >
                            We couldn&apos;t find a match for &ldquo;{searchQuery}&rdquo;. You can enter the details manually.
                          </span>
                          {/* Continue with manual entry button */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowDropdown(false);
                              setManualEntry(true);
                            }}
                            className="flex items-center cursor-pointer"
                            style={{
                              ...f,
                              fontSize: "var(--text-sm)",
                              lineHeight: "16.8px",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--primary)",
                              background: "none",
                              border: "none",
                              padding: "8px 12px",
                              borderRadius: "var(--radius)",
                              gap: 6,
                              transition: "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 6%, transparent)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            Continue with manual entry
                            <ArrowRight style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Examples row */}
            {!selectedCompany && (
              <div
                className="flex items-center"
                style={{ padding: "10px 20px 20px 20px", gap: 8 }}
              >
                <span
                  style={{
                    ...f,
                    fontSize: "var(--text-xs)",
                    lineHeight: "14px",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-muted-themed)",
                  }}
                >
                  Examples:
                </span>
                <button
                  type="button"
                  onClick={() => fillExample("U72200KA2018PTC115234")}
                  className="cursor-pointer"
                  style={{
                    ...f,
                    fontSize: "var(--text-xs)",
                    lineHeight: "16px",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-secondary-themed)",
                    backgroundColor: "var(--surface-inset)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius)",
                    padding: "2px 10px",
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-inset)"; }}
                >
                  U72200KA2018PTC115234
                </button>
                <button
                  type="button"
                  onClick={() => fillExample("AABCT1234A")}
                  className="cursor-pointer"
                  style={{
                    ...f,
                    fontSize: "var(--text-xs)",
                    lineHeight: "16px",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-secondary-themed)",
                    backgroundColor: "var(--surface-inset)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius)",
                    padding: "2px 10px",
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-inset)"; }}
                >
                  AABCT1234A
                </button>
              </div>
            )}

            {/* Selected company indicator (search already shows name) */}
            {selectedCompany && <div style={{ height: 20 }} />}
          </div>

          {/* ── Manual Entry Wizard ── */}
          <AnimatePresence>
            {manualEntry && !selectedCompany && (
              <ManualEntryWizard
                initialSearch={searchQuery}
                onCancel={() => setManualEntry(false)}
                onGenerate={(data) => {
                  setIsGenerating(true);
                  // Map entity type to display label
                  const entityTypeMap: Record<string, string> = {
                    "company-llp": "Company / LLP",
                    "sole-prop": "Sole Proprietorship",
                    "partnership": "Partnership Firm",
                    "others": "Others",
                  };
                  setSelectedOrgType(entityTypeMap[(data.entityType as string) || ""] || "Company / LLP");
                  setTimeout(() => {
                    setIsGenerating(false);
                    setCaseGenerated(true);
                    setManualEntry(false);
                    const name =
                      (data.businessName as string) ||
                      (data.firmName as string) ||
                      (data.othersEntityName as string) ||
                      "Manual Entity";
                    setSelectedCompany({
                      id: "manual-001",
                      name: name || "Manual Entity",
                      cin: (data.cin as string) || "N/A",
                      pan:
                        (data.businessPan as string) ||
                        (data.proprietorPan as string) ||
                        (data.othersPan as string) ||
                        "N/A",
                      registeredAddress: "N/A",
                      industry: "N/A",
                      riskGrade: "Medium",
                      status: "Active",
                      directors: [],
                      incorporationDate: "N/A",
                      authorizedCapital: 0,
                      paidUpCapital: 0,
                      promoterHolding: 0,
                      revenue: 0,
                      activeCases: 0,
                      lastAssessed: null,
                      contactPerson: "N/A",
                      contactEmail: "N/A",
                      riskIndicators: [],
                    });
                  }, 2000);
                }}
                isGenerating={isGenerating}
              />
            )}
          </AnimatePresence>

          {/* ── Selected Company Preview ── */}
          <AnimatePresence>
            {selectedCompany && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: 28 }}
              >
                <CompanyPreviewCard
                  company={selectedCompany}
                  orgType={selectedOrgType}
                  onGenerate={handleGenerateCase}
                  isGenerating={isGenerating}
                  caseGenerated={caseGenerated}
                  onNavigateToCase={() => setModalOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Case created confirmation modal */}
      <CaseCreatedModal
        open={modalOpen}
        newCase={selectedCompany ? {
          id: `CASE-${Math.floor(10000 + Math.random() * 90000)}`,
          name: selectedCompany.name,
          submittedAt: new Date(),
        } : null}
        onClose={() => setModalOpen(false)}
        onGoToWorkspace={() => { setModalOpen(false); navigate("/my-cases"); }}
        onCreateAnother={() => {
          setModalOpen(false);
          setSelectedCompany(null);
          setSearchQuery("");
          setCaseGenerated(false);
          setManualEntry(false);
        }}
      />
    </main>
  );
};

/* ═══════════════════════════════════════════════════════════
   Company Preview Card (Post-selection)
   ═══════════════════════════════════════════════════════════ */
const CompanyPreviewCard = ({
  company,
  orgType,
  onGenerate,
  isGenerating,
  caseGenerated,
  onNavigateToCase,
}: {
  company: Company;
  orgType: string;
  onGenerate: () => void;
  isGenerating: boolean;
  caseGenerated: boolean;
  onNavigateToCase: () => void;
}) => {
  return (
    <div>
      {/* ── Company Header ── */}
      <div className="flex items-start" style={{ gap: 12, marginBottom: 20 }}>
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius)",
            backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
          }}
        >
          <Landmark style={{ width: 20, height: 20, color: "var(--primary)" }} />
        </div>
        <div className="flex flex-col" style={{ gap: 4 }}>
          <span
            style={{
              ...f,
              fontSize: "var(--text-md)",
              lineHeight: "140%",
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            {company.name}
          </span>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--primary)",
              }}
            >
              {orgType}
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
              &middot; {company.status}
            </span>
          </div>
        </div>
      </div>

      {/* ── Info Grid (Bordered cells) ── */}
      <div
        style={{
          borderRadius: "var(--radius)",
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        {/* Row 1: CIN + PAN */}
        <div className="flex" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div
            className="flex-1 flex flex-col"
            style={{
              padding: "16px 20px",
              gap: 6,
              borderRight: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center" style={{ gap: 5, color: "var(--text-muted-themed)" }}>
              <Landmark style={{ width: 12, height: 12 }} />
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-xs)",
                  lineHeight: "1",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-muted-themed)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.04em",
                }}
              >
                CIN
              </span>
            </div>
            <span
              style={{
                ...f,
                fontSize: "var(--text-base)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              {company.cin}
            </span>
          </div>
          <div
            className="flex-1 flex flex-col"
            style={{ padding: "16px 20px", gap: 6 }}
          >
            <div className="flex items-center" style={{ gap: 5, color: "var(--text-muted-themed)" }}>
              <CreditCard style={{ width: 12, height: 12 }} />
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-xs)",
                  lineHeight: "1",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-muted-themed)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.04em",
                }}
              >
                PAN
              </span>
            </div>
            <span
              style={{
                ...f,
                fontSize: "var(--text-base)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              {company.pan}
            </span>
          </div>
        </div>

        {/* Row 2: Address + Industry */}
        <div className="flex">
          <div
            className="flex-1 flex flex-col"
            style={{
              padding: "16px 20px",
              gap: 6,
              borderRight: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center" style={{ gap: 5, color: "var(--text-muted-themed)" }}>
              <MapPin style={{ width: 12, height: 12 }} />
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-xs)",
                  lineHeight: "1",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-muted-themed)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.04em",
                }}
              >
                Registered Address
              </span>
            </div>
            <span
              style={{
                ...f,
                fontSize: "var(--text-base)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              {company.registeredAddress}
            </span>
          </div>
          <div
            className="flex-1 flex flex-col"
            style={{ padding: "16px 20px", gap: 6 }}
          >
            <div className="flex items-center" style={{ gap: 5, color: "var(--text-muted-themed)" }}>
              <Building2 style={{ width: 12, height: 12 }} />
              <span
                style={{
                  ...f,
                  fontSize: "var(--text-xs)",
                  lineHeight: "1",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-muted-themed)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.04em",
                }}
              >
                Industry
              </span>
            </div>
            <span
              style={{
                ...f,
                fontSize: "var(--text-base)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-heading)",
              }}
            >
              {company.industry}
            </span>
          </div>
        </div>
      </div>

      {/* ── Directors / Partners ── */}
      {company.directors.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="flex items-center" style={{ gap: 5, marginBottom: 12, color: "var(--text-muted-themed)" }}>
            <Users style={{ width: 13, height: 13 }} />
            <span
              style={{
                ...f,
                fontSize: "var(--text-xs)",
                lineHeight: "1",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-muted-themed)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.04em",
              }}
            >
              Directors / Partners ({company.directors.length})
            </span>
          </div>
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {company.directors.map((dir) => (
              <div
                key={dir.din}
                className="flex items-center"
                style={{
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--neutral-0)",
                }}
              >
                <User style={{ width: 13, height: 13, color: "var(--text-muted-themed)" }} />
                <span
                  style={{
                    ...f,
                    fontSize: "var(--text-sm)",
                    lineHeight: "140%",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-heading)",
                  }}
                >
                  {dir.name}
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
                  {dir.din}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Action Footer ── */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "16px 0 0",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {/* Inline usage note */}
        {!caseGenerated && (
          <span
            className="flex items-center"
            style={{
              ...f,
              fontSize: "var(--text-sm)",
              lineHeight: "140%",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-muted-themed)",
              gap: 5,
            }}
          >
            <CreditCard style={{ width: 13, height: 13, opacity: 0.55 }} />
            Each case counts towards your plan usage
          </span>
        )}
        {caseGenerated && <div />}
        <div className="flex items-center" style={{ gap: 10 }}>
          {caseGenerated ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center"
              style={{ gap: 10 }}
            >
              <div
                className="flex items-center"
                style={{
                  gap: 6,
                  ...f,
                  fontSize: "var(--text-sm)",
                  lineHeight: "140%",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--success-700)",
                }}
              >
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                Case Created Successfully
              </div>
              <button
                type="button"
                onClick={onNavigateToCase}
                className="flex items-center cursor-pointer"
                style={{
                  ...f,
                  fontSize: "var(--text-sm)",
                  lineHeight: "140%",
                  fontWeight: "var(--font-weight-medium)",
                  height: 36,
                  padding: "0 16px",
                  gap: 6,
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--primary)",
                  backgroundColor: "color-mix(in srgb, var(--primary) 6%, transparent)",
                  color: "var(--primary)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 12%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--primary) 6%, transparent)";
                }}
              >
                Open Case
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="flex items-center cursor-pointer"
              style={{
                ...f,
                fontSize: "var(--text-sm)",
                lineHeight: "140%",
                fontWeight: "var(--font-weight-medium)",
                height: 40,
                padding: "0 20px",
                gap: 8,
                borderRadius: "var(--radius)",
                border: "none",
                backgroundColor: isGenerating
                  ? "color-mix(in srgb, var(--primary) 60%, transparent)"
                  : "var(--primary)",
                color: "var(--text-on-color)",
                transition: "all 0.15s ease",
                opacity: isGenerating ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) e.currentTarget.style.backgroundColor = "var(--primary-600)";
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) e.currentTarget.style.backgroundColor = "var(--primary)";
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />
                  Generating Case...
                </>
              ) : (
                <>
                  Generate Case
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
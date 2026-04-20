import type { RichCaseEntry } from "./types";

/**
 * A.R. Amboli Developers Private Limited
 * Source: IDfy Netscan + CrimeCheck Report
 * CIN: U70109MH2020PTC342547
 * Risk: HIGH — 5 active criminal cases including IPC 467 (Forgery, Life Imprisonment)
 */
export const arAmboliDevelopers: RichCaseEntry = {
  id: "CASE-10241",
  name: "A.R. Amboli Developers Pvt Ltd",
  industry: "Real Estate",
  created: "2026-02-19",
  riskLevel: "High",
  status: "In Progress",
  source: "court-check",
  aiSuggestion: "Reject",
  aiInsight: {
    summary:
      "High-risk entity with 5 active criminal cases against directors, including forgery of valuable security (IPC 467, max: Life Imprisonment) and criminal conspiracy (IPC 120-B). Severe financial stress with D/E of 6.49 and negative net profit. Do not approve without senior credit committee review.",
    topRisk: "IPC 467 — Forgery of valuable security (Life Imprisonment)",
    confidencePercent: 94,
    factors: [
      "5 active criminal cases — forgery, cheating, criminal conspiracy",
      "D/E Ratio: 6.49 — 3.5x industry median",
      "Net loss: ₹32L in FY25",
      "Revenue decline: 30.7% YoY",
      "Network contagion via M.K. Shelters (common director)",
    ],
    networkRisk: { level: "HIGH", label: "Contagion source in 4-entity network" },
  },
  detail: {
    cin: "U70109MH2020PTC342547",
    pan: "AAVCA6812N",
    incorporationDate: "2020-07-09",
    registeredAddress:
      "302, Highland Park Apartment, Aarey Road, Andheri (West), Mumbai – 400058, Maharashtra",
    industry: "Real Estate — Commercial & Residential Construction",
    entityType: "Private Limited",
    authorizedCapital: 10000000,
    paidUpCapital: 6500000,
    promoterHolding: 100,

    // ── Network ──────────────────────────────────────────────────────────────
    networkNodes: [
      {
        id: "NE-AR-001",
        name: "M.K. Shelters Private Limited",
        riskLevel: "Medium",
        isContagionSource: false,
        commonDirectors: ["Mahafuz Khaan"],
        debtToEquity: 1.84,
        netProfit: 3200000,
        natureOfBusiness: "Real Estate",
        cin: "U45200MH2005PTC156666",
        incorporationDate: "2005-03-22",
        registeredAddress: "Shop 4, Mehta Arcade, S.V. Road, Malad (W), Mumbai – 400064",
        relationship: "Common Director",
        directors: ["Mahafuz Khaan", "Sunil Parshuram Kadam", "Rekha M. Khaan"],
        aiSummary: "Medium risk with borderline financials. D/E 1.84, ICR 1.62x — debt stress indicators. Mahafuz Khaan is named in 3 of A.R. Amboli's criminal cases. Revenue declining 12% YoY warrants monitoring.",
      },
      {
        id: "NE-AR-002",
        name: "Empire Living Spaces Pvt Ltd",
        riskLevel: "Low",
        isContagionSource: false,
        commonDirectors: ["Mahafuz Khaan"],
        debtToEquity: 1.12,
        netProfit: 2400000,
        natureOfBusiness: "Real Estate",
        cin: "U45203MH2011PTC217483",
        incorporationDate: "2011-05-17",
        registeredAddress: "401, Empire House, Goregaon (E), Mumbai – 400063",
        relationship: "Common Director",
        directors: ["Mahafuz Khaan", "Sunil Parshuram Kadam", "Priya Shankar Nair"],
        aiSummary: "Low risk with strong financials. Revenue ₹78.4 Cr (+8.4% YoY), D/E 1.12, ICR 4.92x. No direct litigation. Mahafuz Khaan's link to A.R. Amboli criminal cases creates second-degree reputational exposure.",
      },
    ],
    networkInsights: {
      summary:
        "A.R. Amboli Developers is the primary risk node in this network. Mahafuz Khaan links it to M.K. Shelters and Empire Living Spaces. The entity's criminal exposure radiates reputational risk across the entire network.",
      litigationFlag:
        "5 active criminal cases against directors — IPC 467, 420, 120-B, 406, 34. Highest severity: Life Imprisonment (IPC 467).",
      amlFlag: undefined,
      pepFlag: undefined,
      contagionRisk: "HIGH",
      contagionExplanation:
        "A.R. Amboli is the contagion source. Any conviction of Mahafuz Khaan (common director with M.K. Shelters and Empire Living) would trigger cross-entity reputational and legal exposure.",
    },

    // ── Financial Parameters ──────────────────────────────────────────────────
    financialParameters: [
      // Priority 5 — Revenue & Profitability (highest importance; surfaces in Overview)
      {
        id: "FP-AR-01",
        name: "Revenue (FY 2024-25)",
        value: 84500000,
        unit: "₹",
        source: "MCA",
        priority: 5,
        trend: "down",
        trendValue: -30.7,
        aiCommentary:
          "Revenue has collapsed 30.7% YoY — the sharpest decline in this network. No new project launches post-RERA disputes.",
        flagged: true,
        alternateSources: [
          { source: "GST", value: 68200000, unit: "₹", deviationNote: "GST reports ₹6.82 Cr — 19.3% lower than MCA. Gap likely reflects delayed recognition on disputed project completions." },
          { source: "Banking", value: 61400000, unit: "₹", deviationNote: "Bank credits ₹6.14 Cr — widest deviation, suggesting unreported advances or off-book collections." },
        ],
      },
      {
        id: "FP-AR-02",
        name: "EBITDA",
        value: 3549000,
        unit: "₹",
        source: "MCA",
        priority: 5,
        trend: "down",
        trendValue: -52.3,
        aiCommentary: "EBITDA margin at 4.2% — critically low for a real estate firm. Industry median is ~14%.",
        flagged: true,
        alternateSources: [
          { source: "ITR", value: 4100000, unit: "₹", deviationNote: "ITR-implied EBITDA ₹41L — slightly higher than MCA; timing of expense deductions likely cause." },
        ],
      },
      {
        id: "FP-AR-03",
        name: "Net Profit / Loss",
        value: -3200000,
        unit: "₹",
        source: "ITR",
        priority: 5,
        trend: "down",
        trendValue: -166.7,
        aiCommentary: "Entity is loss-making. Net loss of ₹32L against revenue of ₹8.45 Cr is unsustainable.",
        flagged: true,
        benchmarkValue: 5800000,
        benchmarkLabel: "Industry median net profit",
      },
      // Priority 4 — Quality & Coverage Checks (surfaces in Overview)
      {
        id: "FP-AR-10",
        name: "Interest Coverage Ratio",
        value: 0.68,
        source: "MCA",
        priority: 4,
        trend: "down",
        aiCommentary:
          "Interest coverage at 0.68x — entity is NOT generating enough EBIT to cover interest payments. Default risk is high.",
        flagged: true,
      },
      {
        id: "FP-AR-11",
        name: "Monthly Burn Rate",
        value: 2800000,
        unit: "₹/mo",
        source: "Banking",
        priority: 4,
        trend: "up",
        trendValue: 21.7,
        aiCommentary: "Burn rate at ₹28L/month against ₹80L in cash — ~2.9 months runway. Critical.",
        flagged: true,
      },
      {
        id: "FP-AR-12",
        name: "GST Verified Turnover",
        value: 68200000,
        unit: "₹",
        source: "GST",
        priority: 4,
        aiCommentary:
          "GST-reported ₹6.82 Cr vs MCA-reported ₹8.45 Cr — gap of ₹1.63 Cr (19.3%). Significant discrepancy warrants scrutiny.",
        benchmarkValue: 84500000,
        benchmarkLabel: "MCA reported",
        flagged: true,
      },
      {
        id: "FP-AR-13",
        name: "Banking Turnover",
        value: 61400000,
        unit: "₹",
        source: "Banking",
        priority: 4,
        aiCommentary:
          "Bank credits ₹6.14 Cr — 27.3% lower than MCA-reported revenue. Large gap raises concerns about revenue recognition practices.",
        flagged: true,
      },
      {
        id: "FP-AR-14",
        name: "ITR Declared Income",
        value: 71200000,
        unit: "₹",
        source: "ITR",
        priority: 4,
        aiCommentary:
          "ITR declares ₹7.12 Cr vs MCA ₹8.45 Cr. 15.7% variance — possible deferred recognition or unreported advances.",
        flagged: true,
      },
      // Priority 3 — Leverage & Working Capital
      {
        id: "FP-AR-04",
        name: "Debt-to-Equity Ratio",
        value: 6.49,
        source: "MCA",
        priority: 3,
        trend: "up",
        trendValue: 34.2,
        aiCommentary:
          "D/E at 6.49 — 3.5x the industry median of 1.85. Severe over-leveraging with declining equity base due to net losses.",
        flagged: true,
        benchmarkValue: 1.85,
        benchmarkLabel: "Industry median",
      },
      {
        id: "FP-AR-05",
        name: "Total Debt",
        value: 208000000,
        unit: "₹",
        source: "Banking",
        priority: 3,
        trend: "up",
        trendValue: 12.4,
        aiCommentary: "Borrowings of ₹20.8 Cr continue to rise despite negative operating performance.",
        flagged: true,
      },
      {
        id: "FP-AR-06",
        name: "Net Worth",
        value: 32000000,
        unit: "₹",
        source: "MCA",
        priority: 3,
        trend: "down",
        trendValue: -18.6,
        aiCommentary: "Net worth eroding due to consecutive net losses. Capital base shrinking.",
        flagged: true,
      },
      {
        id: "FP-AR-07",
        name: "Current Ratio",
        value: 0.72,
        source: "MCA",
        priority: 3,
        trend: "down",
        trendValue: -23.4,
        aiCommentary:
          "Current ratio below 1.0 — entity cannot cover short-term liabilities from current assets. Acute liquidity stress.",
        flagged: true,
        benchmarkValue: 1.5,
        benchmarkLabel: "Recommended minimum",
      },
      {
        id: "FP-AR-08",
        name: "Operating Cash Flow",
        value: -8400000,
        unit: "₹",
        source: "Banking",
        priority: 3,
        trend: "down",
        aiCommentary: "Negative operating cash flow of ₹84L. Entity is consuming capital without generating returns.",
        flagged: true,
      },
      // Priority 2 — Banking & Cash Indicators
      {
        id: "FP-AR-09",
        name: "Cash & Equivalents",
        value: 8000000,
        unit: "₹",
        source: "Banking",
        priority: 2,
        trend: "down",
        trendValue: -46.7,
        aiCommentary: "Cash reserves have nearly halved YoY. At current burn, runway is ~3 months.",
        flagged: true,
      },
    ],

    yearlyFinancials: [
      { year: 2022, revenue: 142000000, ebitda: 19880000, netProfit: 8500000, totalDebt: 112000000, cashAndEquivalents: 22000000 },
      { year: 2023, revenue: 131000000, ebitda: 13100000, netProfit: 3200000, totalDebt: 142000000, cashAndEquivalents: 18000000 },
      { year: 2024, revenue: 121900000, ebitda: 7450000, netProfit: -1900000, totalDebt: 185000000, cashAndEquivalents: 15000000 },
      { year: 2025, revenue: 84500000, ebitda: 3549000, netProfit: -3200000, totalDebt: 208000000, cashAndEquivalents: 8000000 },
    ],

    // ── Litigations ───────────────────────────────────────────────────────────
    entityLitigations: [
      {
        id: "LIT-AR-E01",
        caseNumber: "CS/2023/0841",
        offence: "Criminal Conspiracy",
        ipcSection: "IPC 120-B",
        court: "Mumbai Sessions Court",
        filingDate: "2023-04-11",
        status: "Pending",
        maxPunishment: "Rigorous Imprisonment + Fine",
        severity: "High",
        notes: "Entity named as accused party in conspiracy related to fraudulent land registration.",
      },
    ],

    directorLitigations: [
      {
        name: "Mahafuz Khaan",
        din: "00420666",
        designation: "Managing Director",
        appointmentDate: "2020-07-09",
        litigations: [
          {
            id: "LIT-AR-D01",
            caseNumber: "CC/2021/4578",
            offence: "Forgery of valuable security",
            ipcSection: "IPC 467",
            court: "Mumbai Sessions Court",
            filingDate: "2021-09-14",
            status: "Pending",
            maxPunishment: "Life Imprisonment or 10 years + Fine",
            severity: "Critical",
            notes: "Property sale deed forged to obtain bank loan. IDfy CrimeCheck confirmed.",
          },
          {
            id: "LIT-AR-D02",
            caseNumber: "CC/2022/1190",
            offence: "Cheating and dishonestly inducing delivery of property",
            ipcSection: "IPC 420",
            court: "Andheri Metropolitan Magistrate Court",
            filingDate: "2022-03-07",
            status: "Pending",
            maxPunishment: "7 years + Fine",
            severity: "High",
            notes: "Buyer alleges advance payment of ₹42L received without legal title transfer.",
          },
          {
            id: "LIT-AR-D03",
            caseNumber: "CC/2023/0312",
            offence: "Criminal Conspiracy",
            ipcSection: "IPC 120-B r/w 420",
            court: "Mumbai Sessions Court",
            filingDate: "2023-01-22",
            status: "Pending",
            maxPunishment: "Same as main offence",
            severity: "High",
          },
        ],
      },
      {
        name: "Sunil Parshuram Kadam",
        din: "08533072",
        designation: "Director",
        appointmentDate: "2020-07-09",
        litigations: [
          {
            id: "LIT-AR-D04",
            caseNumber: "CC/2022/2847",
            offence: "Abetment and criminal breach of trust",
            ipcSection: "IPC 406 r/w 114",
            court: "Borivali Metropolitan Magistrate Court",
            filingDate: "2022-07-19",
            status: "Pending",
            maxPunishment: "3 years + Fine",
            severity: "High",
            notes: "Alleged to have abetted misuse of client deposits by co-director.",
          },
          {
            id: "LIT-AR-D05",
            caseNumber: "CC/2023/1644",
            offence: "Common intention to cheat",
            ipcSection: "IPC 34 r/w 420",
            court: "Andheri Metropolitan Magistrate Court",
            filingDate: "2023-06-30",
            status: "Pending",
            maxPunishment: "7 years + Fine",
            severity: "High",
          },
        ],
      },
    ],

    // ── Compliance ────────────────────────────────────────────────────────────
    complianceChecks: [
      {
        category: "Entity",
        label: "MCA Active Status",
        status: "Clear",
        source: "MCA",
        checkedOn: "2026-02-19",
      },
      {
        category: "Entity",
        label: "GST Registration",
        status: "Flagged",
        finding: "GST return filing gap: Q2 FY25 return filed with 45-day delay. Penalty levied.",
        source: "GST",
        checkedOn: "2026-02-19",
      },
      {
        category: "Entity",
        label: "CIBIL / Credit Bureau",
        status: "Flagged",
        finding: "Two NPA-adjacent accounts with kotak bank, restructured under OTR in 2023.",
        source: "IDfy",
        checkedOn: "2026-02-19",
      },
      {
        category: "AML",
        label: "AML Screening (Entity)",
        status: "Caution",
        finding: "Entity flagged in adverse media database for alleged property fraud (2022 press reports).",
        source: "IDfy",
        checkedOn: "2026-02-19",
      },
      {
        category: "AML",
        label: "AML Screening — Mahafuz Khaan",
        status: "Flagged",
        finding: "Mahafuz Khaan appears in adverse news database linked to property fraud allegations.",
        source: "IDfy",
        checkedOn: "2026-02-19",
      },
      {
        category: "PEP",
        label: "PEP Check — Mahafuz Khaan",
        status: "Clear",
        source: "IDfy",
        checkedOn: "2026-02-19",
      },
      {
        category: "Litigation",
        label: "Criminal Check (Entity)",
        status: "Flagged",
        finding: "Entity is a named accused in criminal conspiracy case CS/2023/0841.",
        source: "CrimeCheck",
        checkedOn: "2026-02-19",
      },
      {
        category: "Litigation",
        label: "Criminal Check — Mahafuz Khaan",
        status: "Flagged",
        finding: "3 active criminal cases including IPC 467 (Life Imprisonment). Confirmed by Mumbai Sessions Court records.",
        source: "CrimeCheck",
        checkedOn: "2026-02-19",
      },
      {
        category: "Litigation",
        label: "Criminal Check — Sunil P. Kadam",
        status: "Flagged",
        finding: "2 active criminal cases including IPC 406 (criminal breach of trust).",
        source: "CrimeCheck",
        checkedOn: "2026-02-19",
      },
    ],

    // ── CAM Draft ─────────────────────────────────────────────────────────────
    camDraft: {
      generatedOn: "2026-02-20",
      borrowerName: "A.R. Amboli Developers Pvt Ltd",
      loanAmount: 30000000,
      purpose: "Working capital for pending construction projects",
      riskRating: "E",
      recommendation: "Reject",
      sections: [
        {
          title: "Borrower Overview",
          content:
            "A.R. Amboli Developers Pvt Ltd (CIN: U70109MH2020PTC342547) is a Mumbai-based real estate developer incorporated in July 2020. It is 100% promoter-held with two directors — Mahafuz Khaan (MD) and Sunil Parshuram Kadam. The entity has been operational for ~5 years with a focus on commercial and residential construction in Andheri (West).",
        },
        {
          title: "Financial Assessment",
          content:
            "The entity presents severe financial distress: revenue has fallen 30.7% YoY to ₹8.45 Cr, the company is loss-making (net loss: ₹32L), D/E ratio is at 6.49 (3.5x industry median), and cash runway is under 3 months at current burn rate. Current ratio of 0.72 indicates inability to service short-term obligations. Cross-source variance in revenue (GST vs MCA: 19.3%) adds further concern about financial reporting reliability.",
        },
        {
          title: "Risk Assessment",
          content:
            "This entity carries the highest risk profile in its network. Both directors face active criminal prosecution — Mahafuz Khaan is charged under IPC 467 (forgery of valuable security, max: Life Imprisonment) and IPC 420 (cheating), while Sunil Parshuram Kadam faces IPC 406 and IPC 34/420 charges. The entity itself is named in a criminal conspiracy case. Financial stress is acute and worsening. No mitigating factors identified.",
        },
        {
          title: "Recommendation",
          content:
            "Rejection recommended. The combination of active criminal cases against both directors (including a Life Imprisonment charge), severe financial distress (D/E 6.49, negative cash flow, sub-3-month runway), and cross-source revenue discrepancies makes this loan application untenable under standard risk policy. Escalate to Credit Head for final disposition.",
        },
      ],
      sharedWithCreditHead: false,
    },

    // ── Documents ─────────────────────────────────────────────────────────────
    documents: [
      { id: "DOC-AR-01", name: "ITR FY 2024-25", type: "ITR", uploadDate: "2026-02-14", verified: true, verifiedBy: "ITR" },
      { id: "DOC-AR-02", name: "GST Returns (Apr–Sep 2025)", type: "GST", uploadDate: "2026-02-14", verified: true, verifiedBy: "GST", notes: "Q2 filing delayed — penalty noted" },
      { id: "DOC-AR-03", name: "Bank Statement — Kotak CA (Jan–Dec 2025)", type: "Bank Statement", uploadDate: "2026-02-15", verified: true, verifiedBy: "Banking" },
      { id: "DOC-AR-04", name: "MCA Extract — Board Resolution", type: "MCA Extract", uploadDate: "2026-02-14", verified: true, verifiedBy: "MCA" },
      { id: "DOC-AR-05", name: "IDfy CrimeCheck Report", type: "Other", uploadDate: "2026-02-19", verified: true, verifiedBy: "IDfy" },
      { id: "DOC-AR-06", name: "KYC — Mahafuz Khaan", type: "KYC", uploadDate: "2026-02-14", verified: true },
      { id: "DOC-AR-07", name: "KYC — Sunil Parshuram Kadam", type: "KYC", uploadDate: "2026-02-14", verified: true },
    ],

    sourceReconciliation: [
      {
        metric: "Annual Revenue / Turnover",
        mcaValue: 84500000,
        gstValue: 68200000,
        itrValue: 71200000,
        bankingValue: 61400000,
        discrepancy: true,
        discrepancyNote:
          "19.3% gap between GST and MCA revenue. 27.3% gap between Banking and MCA. Possible advance collections not reconciled or under-reporting in tax filings.",
      },
      {
        metric: "Net Profit / Loss",
        mcaValue: -3200000,
        itrValue: -2800000,
        discrepancy: false,
        discrepancyNote: "Minor ₹4L difference — within normal tax adjustment range.",
      },
      {
        metric: "Total Borrowings",
        mcaValue: 208000000,
        bankingValue: 224000000,
        discrepancy: true,
        discrepancyNote:
          "Banking data shows ₹1.6 Cr more debt than MCA. Possible off-balance-sheet borrowings or undisclosed credit facility.",
      },
      {
        metric: "Current Liabilities",
        mcaValue: 112000000,
        bankingValue: 98000000,
        discrepancy: true,
        discrepancyNote:
          "MCA shows ₹1.4 Cr higher current liabilities than banking ledger — possible unbooked creditors or disputed payables.",
      },
    ],
  },
};

import React from "react";
import type { RichCaseEntry } from "../../data/mock";
import { AlertTriangle, TrendingUp, ArrowUpRight, X } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart, Cell
} from "recharts";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif" } as const;

// ─── Shared Components ────────────────────────────────────────────────────────

const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: "#FFFFFF", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
    {children}
  </div>
);

const Tag = ({ color, bg, border, icon, children }: any) => (
  <span style={{ ...f, display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 600, color, backgroundColor: bg, border: `1px solid ${border || "transparent"}`, padding: "4px 10px", borderRadius: 100 }}>
    {icon} {children}
  </span>
);

const SectionHeader = ({ title, value, meta, sources, headerTag }: any) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ ...f, fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>{title}</h3>
        {headerTag}
      </div>
      <span style={{ ...f, fontSize: "11px", color: "var(--text-muted-themed)" }}>Sources: {sources}</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
      {value.text && (
        <span style={{ ...f, fontSize: "20px", fontWeight: 700, color: value.color, lineHeight: 1 }}>{value.text}</span>
      )}
      {meta.text && (
        <span style={{ ...f, fontSize: "11px", fontWeight: 600, color: meta.color, display: "flex", alignItems: "center", gap: 4 }}>
          {meta.icon} {meta.text}
        </span>
      )}
    </div>
  </div>
);

// ─── Data ──────────────────────────────────────────────────────────────────

const dataFY17to24 = [
  { year: "FY17", rev: 0, inv: 0.5, ebitda: -0.34, roe: -43, roce: -22, icr: -5, rpt: 0, de: 1.04, eq: 1.0, debt: 1.04, cash: 0.05 },
  { year: "FY18", rev: 0, inv: 1.0, ebitda: -0.28, roe: -32, roce: -15, icr: -70, rpt: 0, de: 2.1, eq: 0.8, debt: 1.6, cash: 0.1 },
  { year: "FY19", rev: 0, inv: 1.2, ebitda: -0.05, roe: -15, roce: -8, icr: -115, rpt: 0.02, de: 3.05, eq: 0.7, debt: 2.1, cash: 0.1 },
  { year: "FY20", rev: 0.02, inv: 1.2, ebitda: 0, roe: -10, roce: -5, icr: -50, rpt: 0, de: 3.1, eq: 0.65, debt: 2.0, cash: 0.05 },
  { year: "FY21", rev: 0, inv: 1.5, ebitda: -0.08, roe: -12, roce: -8, icr: -70, rpt: 0, de: 4.0, eq: 0.6, debt: 2.2, cash: 0.05 },
  { year: "FY22", rev: 0, inv: 2.0, ebitda: 0.02, roe: 15.22, roce: 5, icr: 50, rpt: 0, de: 4.1, eq: 0.65, debt: 2.8, cash: 0.5 },
  { year: "FY23", rev: 0.02, inv: 3.0, ebitda: 0, roe: -5, roce: -2, icr: -115, rpt: 0, de: 5.5, eq: 0.65, debt: 3.8, cash: 0.05 },
  { year: "FY24", rev: 0.01, inv: 4.06, ebitda: 0, roe: -0.81, roce: -0.5, icr: -5, rpt: 0, de: 7.17, eq: 0.67, debt: 4.81, cash: 0.05 },
];

export const FinancialsTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  return (
    <div style={{ backgroundColor: "#FFFFFF", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24, flex: 1, minHeight: 0, overflowY: "auto" }}>
      
      {/* 1. Revenue / Turnover */}
      <Card>
        <SectionHeader 
          title="Revenue / Turnover"
          sources="MCA (P&L) · GST (GSTR-3B/1)"
          value={{ text: "₹0.02 Cr", color: "#D97706" }}
          meta={{ text: "Near-zero — FY24", color: "#D97706", icon: <AlertTriangle size={12} /> }}
        />
        <p style={{ ...f, fontSize: "12px", color: "var(--text-body)", lineHeight: "1.6", margin: 0 }}>
          MCA revenue is <span style={{ color: "var(--destructive-600)", fontWeight: 500 }}>₹0 - ₹0.02 Cr across 8 years</span>. Expected for a <span style={{ fontWeight: 600 }}>real estate developer in construction phase</span> — revenue recognised only on flat handover (POC method). However <span style={{ color: "#D97706", fontWeight: 500 }}>GSTR-3B filed every month through FY26</span> implies ongoing taxable billing not in MCA books. Inventory grew ₹0.50 Cr → ₹4.06 Cr — real business activity is happening. <span style={{ fontWeight: 600 }}>Key question: what is MKSPL invoicing on GSTR-1 if MCA revenue is nil?</span>
        </p>
        <div style={{ height: 200, width: "100%", marginTop: 10 }}>
          <ResponsiveContainer>
            <ComposedChart data={dataFY17to24} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} label={{ value: 'Revenue (₹Cr)', angle: -90, position: 'insideLeft', fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} label={{ value: 'Inventory (₹Cr)', angle: 90, position: 'insideRight', fontSize: 10, fill: "#9CA3AF" }} />
              <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280" }} />
              <Bar yAxisId="right" dataKey="inv" name="Inventory ₹Cr" fill="#93C5FD" radius={[2, 2, 0, 0]} barSize={40} />
              <Bar yAxisId="left" dataKey="rev" name="Revenue ₹Cr" fill="#86EFAC" radius={[2, 2, 0, 0]} barSize={40} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
          <Tag color="#B45309" bg="#FEF3C7" border="#FDE68A" icon={<AlertTriangle size={12} />}>GST vs MCA discrepancy — reconcile</Tag>
          <Tag color="#6B7280" bg="transparent" icon={<TrendingUp size={12} />}>Flat declared</Tag>
        </div>
      </Card>

      {/* 2. EBITDA */}
      <Card>
        <SectionHeader 
          title="Operating Profit (EBITDA)"
          sources="MCA (P&L) · ITR · Banking (cash accrual)"
          value={{ text: "₹0.00 Cr", color: "var(--destructive-600)" }}
          meta={{ text: "Zero / negative FY24", color: "var(--destructive-600)", icon: <X size={12} /> }}
        />
        <p style={{ ...f, fontSize: "12px", color: "var(--text-body)", lineHeight: "1.6", margin: 0 }}>
          EBITDA is <span style={{ color: "var(--destructive-600)", fontWeight: 500 }}>negative in 7 of 8 years</span>. FY17-FY19 were deeply negative (−₹0.34 Cr to −₹0.03 Cr) from employee costs vs near-zero revenue. <span style={{ color: "#16A34A", fontWeight: 500 }}>Losses shrinking consistently since FY17</span> — business stabilising. FY22 posted the only positive EBITDA (₹0.02 Cr). Positive operating cash flow per report is driven by customer advances, <span style={{ fontWeight: 600 }}>not EBITDA</span>.
        </p>
        <div style={{ height: 160, width: "100%", marginTop: 10 }}>
          <ResponsiveContainer>
            <BarChart data={dataFY17to24} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <Bar dataKey="ebitda" name="EBITDA ₹Cr" radius={[0, 0, 2, 2]} barSize={60}>
                {dataFY17to24.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.ebitda >= 0 ? "#86EFAC" : "#FCA5A5"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
          <Tag color="var(--destructive-600)" bg="#FEE2E2" border="#FECACA" icon={<X size={12} />}>Negative 7/8 years</Tag>
          <Tag color="#16A34A" bg="transparent" icon={<ArrowUpRight size={12} />}>Recovering since FY17</Tag>
        </div>
      </Card>

      {/* 3. Margins / Profitability */}
      <Card>
        <SectionHeader 
          title="Margins / Profitability"
          sources="MCA (P&L) · ITR · Banking"
          value={{ text: "−0.81%", color: "var(--destructive-600)" }}
          meta={{ text: "ROE FY24 · target >10%", color: "var(--destructive-600)" }}
        />
        <p style={{ ...f, fontSize: "12px", color: "var(--text-body)", lineHeight: "1.6", margin: 0 }}>
          ROE <span style={{ color: "var(--destructive-600)", fontWeight: 500 }}>negative 7 of 8 years</span>, from −43% (FY17) to −0.81% (FY24). Only FY22 positive (15.22%) — driven by ₹0.10 Cr <span style={{ fontWeight: 600 }}>Other Income</span>, not core ops. ROCE follows same pattern. Sector median ROE 1.12% — MKSPL was 15.22% in FY22 for artificial reasons. <span style={{ color: "#16A34A", fontWeight: 500 }}>Trend improving</span> — ~−43% → −0.81% over 7 years signals real cost reduction.
        </p>
        <div style={{ height: 160, width: "100%", marginTop: 10 }}>
          <ResponsiveContainer>
            <LineChart data={dataFY17to24} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280" }} iconType="square" />
              <Line type="monotone" dataKey="roe" name="ROE %" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="roce" name="ROCE %" stroke="#D97706" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
          <Tag color="var(--destructive-600)" bg="#FEE2E2" border="#FECACA">ROE −0.81% FY24</Tag>
          <Tag color="#16A34A" bg="transparent" icon={<ArrowUpRight size={12} />}>Recovering since FY17 trough</Tag>
        </div>
      </Card>

      {/* 4. Revenue Growth */}
      <Card>
        <SectionHeader 
          title="Revenue Growth (Topline)"
          sources="MCA · ITR/GST · Banking"
          value={{ text: "0%", color: "#D97706" }}
          meta={{ text: "FY24 declared YoY", color: "#D97706" }}
        />
        <p style={{ ...f, fontSize: "12px", color: "var(--text-body)", lineHeight: "1.6", margin: 0 }}>
          Declared revenue growth 0% FY24. Real signal: <span style={{ color: "#16A34A", fontWeight: 500 }}>Inventory ₹0.50 Cr → ₹4.06 Cr (+713%)</span> over FY17-FY24 — active construction confirmed. Revenue will step up on project handover. Sector median growth was −41.6% (FY24) — MKSPL at 0% was technically better than peers. <span style={{ fontWeight: 600 }}>This is a timing mismatch, not stagnation.</span>
        </p>
        <div style={{ height: 160, width: "100%", marginTop: 10 }}>
          <ResponsiveContainer>
            <BarChart data={dataFY17to24} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Bar dataKey="inv" name="Inventory ₹Cr (Growth)" fill="#93C5FD" radius={[2, 2, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
          <Tag color="#1D4ED8" bg="#EFF6FF" border="#DBEAFE">Revenue deferred — inventory is the real signal</Tag>
          <Tag color="#16A34A" bg="transparent" icon={<ArrowUpRight size={12} />}>+713% inventory build</Tag>
        </div>
      </Card>

      {/* 5. DSCR */}
      <Card>
        <SectionHeader 
          title="Debt Service Coverage (DSCR)"
          sources="Banking (EMIs) · MCA (LT debt) · ITR (interest exp)"
          value={{ text: "Negative", color: "var(--destructive-600)" }}
          meta={{ text: "Required ≥ 1.25x", color: "var(--destructive-600)", icon: <X size={12} /> }}
        />
        <p style={{ ...f, fontSize: "12px", color: "var(--text-body)", lineHeight: "1.6", margin: 0 }}>
          ICR is <span style={{ color: "var(--destructive-600)", fontWeight: 500 }}>−250x in FY24</span> — mathematically extreme because both EBIT and finance costs are near zero. <span style={{ fontWeight: 600 }}>Metric unreliable without bank statement EMI data.</span> ₹4.81 Cr borrowings with ₹0 registered charges suggest loans may be from promoters at zero/low interest. If formal bank loans with EMIs, DSCR would be critically low. <span style={{ color: "#D97706", fontWeight: 500 }}>This is the single most critical unresolved data gap.</span>
        </p>
        <div style={{ height: 160, width: "100%", marginTop: 10 }}>
          <ResponsiveContainer>
            <BarChart data={dataFY17to24} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Bar dataKey="icr" name="Interest Coverage Ratio" radius={[2, 2, 2, 2]} barSize={60}>
                {dataFY17to24.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.icr >= 0 ? "#86EFAC" : "#FCA5A5"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
          <Tag color="var(--destructive-600)" bg="#FEE2E2" border="#FECACA" icon={<X size={12} />}>Bank statements mandatory before any decision</Tag>
          <Tag color="#D97706" bg="#FEF3C7" border="#FDE68A" icon={<AlertTriangle size={12} />}>Verify source of debt</Tag>
        </div>
      </Card>

      {/* 6. Related Party */}
      <Card>
        <SectionHeader 
          title="Related Party Transactions"
          sources="MCA (AS-18 Notes) · Banking · GST (linked GSTINs)"
          value={{ text: "₹0.00", color: "#16A34A" }}
          meta={{ text: "AS-18 declared — all years", color: "#16A34A" }}
        />
        <p style={{ ...f, fontSize: "12px", color: "var(--text-body)", lineHeight: "1.6", margin: 0 }}>
          <span style={{ color: "#16A34A", fontWeight: 500 }}>Declared RPTs per AS-18 = ₹0 Cr all years</span> (except ₹0.02 Cr in FY19). Clean on paper. However, <span style={{ color: "#D97706", fontWeight: 500 }}>both directors hold positions in 4 group entities</span> including the high-risk A.R. Amboli Developers. Zero RPT with this network complexity is atypical. Inter-entity land deals, construction contracts, or management fees may exist and must be verified via banking cross-credits and GSTR-1 B2B invoices.
        </p>
        <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", marginTop: 4, display: "flex", gap: 8 }}>
          <span style={{ fontSize: "14px" }}>📄</span>
          <p style={{ ...f, fontSize: "11px", color: "var(--destructive-700)", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
            <strong>A.R. Amboli Developers</strong> (common director) = HIGH RISK — criminal offences + excessive leverage. Any financial linkage with MKSPL would be an automatic reject-level flag.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--border-subtle)", marginTop: 4 }}>
          <Tag color="#B45309" bg="#FEF3C7" border="#FDE68A" icon={<AlertTriangle size={12} />}>Verify via banking + GST B2B cross-check</Tag>
          <Tag color="#6B7280" bg="transparent">→ Declared: nil</Tag>
        </div>
      </Card>

      {/* 7. Leverage */}
      <Card>
        <SectionHeader 
          title="Leverage (Debt-to-Equity)"
          sources="MCA (Balance Sheet) · ITR · Banking (CC limits)"
          value={{ text: "7.17x", color: "var(--destructive-600)" }}
          meta={{ text: "Threshold: < 3.0x", color: "var(--destructive-600)", icon: <X size={12} /> }}
        />
        <p style={{ ...f, fontSize: "12px", color: "var(--text-body)", lineHeight: "1.6", margin: 0 }}>
          <span style={{ color: "var(--destructive-600)", fontWeight: 500 }}>D/E escalated 1.04x → 7.17x over 7 years (+590%).</span> LT borrowings grew +362% (₹1.04 Cr → ₹4.81 Cr) while equity <span style={{ color: "var(--destructive-600)", fontWeight: 500 }}>fell ₹1.00 Cr → ₹0.67 Cr</span> from accumulated losses eroding reserves (₹0.56 Cr → ₹0.23 Cr). Debt Ratio 0.88 — <span style={{ fontWeight: 600 }}>88 paise of every rupee is debt-funded.</span> Sector median D/E was 1.01x (FY22) — MKSPL was at 4.00x that year.
        </p>
        <div style={{ height: 200, width: "100%", marginTop: 10 }}>
          <ResponsiveContainer>
            <LineChart data={dataFY17to24} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} domain={[0, 8]} />
              <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280" }} iconType="square" />
              <Line type="monotone" dataKey="de" name="D/E Ratio (x)" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#EF4444" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey={() => 3.0} name="Threshold 3.0x" stroke="#D97706" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
          <Tag color="var(--destructive-600)" bg="#FEE2E2" border="#FECACA" icon={<X size={12} />}>7.17x — single biggest financial risk</Tag>
          <Tag color="var(--destructive-600)" bg="transparent" icon={<ArrowUpRight size={12} />}>Worsening every year</Tag>
        </div>
      </Card>

      {/* 8. Equity erosion */}
      <Card>
        <SectionHeader 
          title="Equity erosion vs debt escalation — FY17 to FY24"
          sources="Borrowings +362% · Equity -33% · The core structural problem"
          value={{ text: "", color: "" }}
          meta={{ text: "", color: "" }}
          headerTag={<Tag color="var(--destructive-600)" bg="#FEE2E2" border="#FECACA">Critical signal</Tag>}
        />
        <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 14px", marginTop: 4, display: "flex", gap: 8 }}>
          <span style={{ fontSize: "14px" }}>🚨</span>
          <p style={{ ...f, fontSize: "11px", color: "var(--destructive-700)", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
            Debt ₹1.04 Cr → ₹4.81 Cr (+362%) while equity fell ₹1.00 Cr → ₹0.67 Cr (−33%) from accumulated losses. This inverse scissors pattern explains D/E going 1.04x → 7.17x over 7 years.
          </p>
        </div>
        <div style={{ height: 200, width: "100%", marginTop: 10 }}>
          <ResponsiveContainer>
            <ComposedChart data={dataFY17to24} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} label={{ value: '₹ Crore', angle: -90, position: 'insideLeft', fontSize: 10, fill: "#9CA3AF" }} />
              <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6B7280" }} iconType="square" />
              <Bar dataKey="eq" name="Total Equity ₹Cr" fill="#86EFAC" radius={[2, 2, 0, 0]} barSize={40} />
              <Bar dataKey="debt" name="LT Borrowings ₹Cr" fill="#FCA5A5" radius={[2, 2, 0, 0]} barSize={40} />
              <Line type="monotone" dataKey="cash" name="Cash ₹Cr" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: "#fff", stroke: "#3B82F6" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
};

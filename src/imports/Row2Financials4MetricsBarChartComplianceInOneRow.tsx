import svgPaths from "./svg-ify3jlztg9";

function DivCardKicker() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="div.card-kicker">
      <div className="flex flex-col font-['DM_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4a5568] text-[10px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">Revenue FY24</p>
      </div>
    </div>
  );
}

function DivBigNum() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div.big-num">
      <div className="flex flex-col font-['DM_Mono:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#edf0f4] text-[32px] whitespace-nowrap" style={{ fontVariationSettings: "\'CTGR\' 0, \'wdth\' 100, \'wght\' 400" }}>
        <p className="leading-[32px]">₹0</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Component 2">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4a5568] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="leading-[16.5px]">Cr — zero recognition</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="link_2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="link_2">
          <mask height="20" id="mask0_9_212" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" x="0" y="0">
            <rect fill="var(--fill-0, #D9D9D9)" height="20" id="Bounding box" width="20" />
          </mask>
          <g mask="url(#mask0_9_212)">
            <path d={svgPaths.p26be9600} fill="var(--fill-0, #1766D6)" id="link_2_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-start relative">
        <Link />
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#1766d6] text-[14px] tracking-[0.056px] whitespace-nowrap" style={{ fontFeatureSettings: "\'case\'" }}>
          <p className="leading-[1.4]">2</p>
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px pt-[11px] relative" data-name="Component 2">
      <div aria-hidden="true" className="absolute border-[#1e2530] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[19.2px] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="mb-0">WIP real estate project. Revenue drops from</p>
        <p className="mb-0">₹0.04 Cr (FY21) to zero as construction phase</p>
        <p>holds all capital.</p>
      </div>
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Component1 />
    </div>
  );
}

function DivCard() {
  return (
    <div className="bg-[#0d1117] relative rounded-[8px] self-stretch shrink-0 w-[378.5px]" data-name="div.card">
      <div className="content-stretch flex flex-col gap-[9px] items-start overflow-clip p-[21px] relative rounded-[inherit] size-full">
        <DivCardKicker />
        <DivBigNum />
        <Component />
        <Frame1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#21262d] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function SpanCardKickerFlag() {
  return (
    <div className="bg-[rgba(224,82,82,0.08)] content-stretch flex flex-col items-start px-[8px] py-[3px] relative rounded-[3px] shrink-0" data-name="span.card-kicker-flag">
      <div aria-hidden="true" className="absolute border border-[rgba(224,82,82,0.22)] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="flex flex-col font-['DM_Mono:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#e05252] text-[9px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[13.5px]">7.1× ABOVE MEDIAN</p>
      </div>
    </div>
  );
}

function DivCardKicker1() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[21px] right-[20.5px] top-[21px]" data-name="div.card-kicker">
      <div className="flex flex-col font-['DM_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4a5568] text-[10px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">D/E Ratio</p>
      </div>
      <SpanCardKickerFlag />
    </div>
  );
}

function DivBigNum1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[21px] right-[20.5px] top-[52.5px]" data-name="div.big-num">
      <div className="flex flex-col font-['DM_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#e05252] text-[32px] whitespace-nowrap">
        <p className="leading-[32px]">7.17×</p>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[21px] right-[20.5px] top-[88.5px]" data-name="Component 2">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4a5568] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="leading-[16.5px]">vs industry 1.01×</p>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[21px] pt-[11px] right-[20.5px] top-[115px]" data-name="Component 2">
      <div aria-hidden="true" className="absolute border-[#1e2530] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[19.2px] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="mb-0">Borrowings grew ₹1.04 Cr → ₹4.81 Cr</p>
        <p className="mb-0">(FY20→FY24) funding construction. Leverage</p>
        <p>will resolve on project completion.</p>
      </div>
    </div>
  );
}

function DivCard1() {
  return (
    <div className="bg-[#0d1117] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] self-stretch" data-name="div.card">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <DivCardKicker1 />
        <DivBigNum1 />
        <Component2 />
        <Component3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(224,82,82,0.22)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivCardKicker2() {
  return (
    <div className="absolute content-stretch flex items-center left-[21px] right-[20.5px] top-[21px]" data-name="div.card-kicker">
      <div className="flex flex-col font-['DM_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4a5568] text-[10px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">Current Ratio</p>
      </div>
    </div>
  );
}

function DivBigNum2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[21px] right-[20.5px] top-[48px]" data-name="div.big-num">
      <div className="flex flex-col font-['DM_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d9970] text-[32px] whitespace-nowrap">
        <p className="leading-[32px]">7,068</p>
      </div>
    </div>
  );
}

function Component4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[21px] right-[20.5px] top-[84px]" data-name="Component 2">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4a5568] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="leading-[16.5px]">Extremely liquid</p>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[21px] pb-[0.285px] pt-[10.095px] right-[20.5px] top-[110.5px]" data-name="Component 2">
      <div aria-hidden="true" className="absolute border-[#1e2530] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[19.2px] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="mb-0">Current assets far exceed current liabilities.</p>
        <p>Short-term solvency not a concern.</p>
      </div>
    </div>
  );
}

function DivCard2() {
  return (
    <div className="bg-[#0d1117] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] self-stretch" data-name="div.card">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <DivCardKicker2 />
        <DivBigNum2 />
        <Component4 />
        <Component5 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(61,153,112,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DivCardKicker3() {
  return (
    <div className="relative shrink-0 w-[258px]" data-name="div.card-kicker">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative w-full">
        <div className="flex flex-col font-['DM_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4a5568] text-[10px] tracking-[0.8px] uppercase whitespace-nowrap">
          <p className="leading-[15px]">Compliance</p>
        </div>
      </div>
    </div>
  );
}

function SpanCompName() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="leading-[18px]">GST</p>
      </div>
    </div>
  );
}

function SpanCompVal() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-val">
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'CTGR\' 0, \'wdth\' 100, \'wght\' 500" }}>
        <p className="leading-[16.5px]">✓ Regular</p>
      </div>
    </div>
  );
}

function DivCompRow() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.comp-row">
      <SpanCompName />
      <SpanCompVal />
    </div>
  );
}

function SpanCompName1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="leading-[18px]">EPF</p>
      </div>
    </div>
  );
}

function SpanCompVal1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-val">
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'CTGR\' 0, \'wdth\' 100, \'wght\' 500" }}>
        <p className="leading-[16.5px]">✓ Filed</p>
      </div>
    </div>
  );
}

function DivCompRow1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.comp-row">
      <SpanCompName1 />
      <SpanCompVal1 />
    </div>
  );
}

function SpanCompName2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="leading-[18px]">Auditor</p>
      </div>
    </div>
  );
}

function SpanCompVal2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-val">
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'CTGR\' 0, \'wdth\' 100, \'wght\' 500" }}>
        <p className="leading-[16.5px]">✓ Clean</p>
      </div>
    </div>
  );
}

function DivCompRow2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.comp-row">
      <SpanCompName2 />
      <SpanCompVal2 />
    </div>
  );
}

function SpanCompName3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="leading-[18px]">AML / Sanctions</p>
      </div>
    </div>
  );
}

function SpanCompVal3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-val">
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'CTGR\' 0, \'wdth\' 100, \'wght\' 500" }}>
        <p className="leading-[16.5px]">✓ No hits</p>
      </div>
    </div>
  );
}

function DivCompRow3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.comp-row">
      <SpanCompName3 />
      <SpanCompVal3 />
    </div>
  );
}

function SpanCompName4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-name">
      <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
        <p className="leading-[18px]">Adverse media</p>
      </div>
    </div>
  );
}

function SpanCompVal4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="span.comp-val">
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans:Medium',sans-serif] justify-center leading-[0] relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'CTGR\' 0, \'wdth\' 100, \'wght\' 500" }}>
        <p className="leading-[16.5px]">✓ None</p>
      </div>
    </div>
  );
}

function DivCompRow4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div.comp-row">
      <SpanCompName4 />
      <SpanCompVal4 />
    </div>
  );
}

function DivComplianceGrid() {
  return (
    <div className="relative shrink-0 w-[337px]" data-name="div.compliance-grid">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative w-full">
        <DivCompRow />
        <DivCompRow1 />
        <DivCompRow2 />
        <DivCompRow3 />
        <DivCompRow4 />
      </div>
    </div>
  );
}

function DivCard3() {
  return (
    <div className="bg-[#0d1117] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] self-stretch" data-name="div.card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start p-[21px] relative size-full">
          <DivCardKicker3 />
          <DivComplianceGrid />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(61,153,112,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

export default function Row2Financials4MetricsBarChartComplianceInOneRow() {
  return (
    <div className="content-stretch flex gap-[14px] items-start justify-center relative size-full" data-name="Row 2: Financials — 4 metrics, bar chart, compliance in one row">
      <DivCard />
      <DivCard1 />
      <DivCard2 />
      <DivCard3 />
    </div>
  );
}
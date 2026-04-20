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
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans_Symbols2:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap">
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
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans_Symbols2:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap">
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
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans_Symbols2:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap">
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
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans_Symbols2:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap">
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
      <div className="flex flex-col font-['DM_Mono:Medium','Noto_Sans_Symbols2:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3d9970] text-[11px] whitespace-nowrap">
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

export default function DivComplianceGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative size-full" data-name="div.compliance-grid">
      <DivCompRow />
      <DivCompRow1 />
      <DivCompRow2 />
      <DivCompRow3 />
      <DivCompRow4 />
    </div>
  );
}
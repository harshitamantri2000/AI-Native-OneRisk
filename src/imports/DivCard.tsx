function SpanCardKickerFlag() {
  return (
    <div className="bg-[rgba(224,82,82,0.08)] content-stretch flex flex-col items-start px-[8px] py-[3px] relative rounded-[3px] shrink-0" data-name="span.card-kicker-flag">
      <div aria-hidden="true" className="absolute border border-[rgba(224,82,82,0.22)] border-solid inset-0 pointer-events-none rounded-[3px]" />
      <div className="flex flex-col font-['DM_Mono:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[9px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[13.5px]">7.1× ABOVE MEDIAN</p>
      </div>
    </div>
  );
}

function DivCardKicker() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[20px] right-[20.38px] top-[20px]" data-name="div.card-kicker">
      <div className="flex flex-col font-['DM_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4a5568] text-[10px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">D/E Ratio</p>
      </div>
      <SpanCardKickerFlag />
    </div>
  );
}

function DivBigNum() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[20px] right-[20.38px] top-[51.5px]" data-name="div.big-num">
      <div className="flex flex-col font-['DM_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[32px] whitespace-nowrap">
        <p className="leading-[32px]">7.17×</p>
      </div>
    </div>
  );
}

export default function DivCard() {
  return (
    <div className="border border-[rgba(224,82,82,0.22)] border-solid overflow-clip relative rounded-[8px] size-full" data-name="div.card">
      <DivCardKicker />
      <DivBigNum />
      <div className="absolute content-stretch flex flex-col items-start left-[20px] right-[20.38px] top-[87.5px]" data-name="Component 2">
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4a5568] text-[11px] whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
          <p className="leading-[16.5px]">vs industry 1.01×</p>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col items-start left-[20px] pt-[11px] right-[20.38px] top-[114px]" data-name="Component 2">
        <div aria-hidden="true" className="absolute border-[#1e2530] border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[19.2px] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontVariationSettings: "\'opsz\' 9" }}>
          <p className="mb-0">Borrowings grew ₹1.04 Cr → ₹4.81 Cr</p>
          <p className="mb-0">(FY20→FY24) funding construction. Leverage</p>
          <p>will resolve on project completion.</p>
        </div>
      </div>
    </div>
  );
}
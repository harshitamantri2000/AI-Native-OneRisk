import clsx from "clsx";
import svgPaths from "./svg-ha4lwabilx";
type Wrapper5Props = {
  additionalClassNames?: string;
};

function Wrapper5({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper5Props>) {
  return (
    <div className={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">{children}</div>
    </div>
  );
}
type Wrapper4Props = {
  additionalClassNames?: string;
};

function Wrapper4({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper4Props>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}
type ContainerProps = {
  additionalClassNames?: string;
};

function Container({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerProps>) {
  return (
    <div className={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">{children}</div>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div className={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">{children}</div>
    </div>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return <Wrapper2 additionalClassNames={clsx("flex-[1_0_0] min-h-px min-w-px relative", additionalClassNames)}>{children}</Wrapper2>;
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return <Wrapper2 additionalClassNames={clsx("relative shrink-0", additionalClassNames)}>{children}</Wrapper2>;
}

function Icon3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[14px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function Icon2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type Icon1Props = {
  additionalClassNames?: string;
};

function Icon1({ children, additionalClassNames = "" }: React.PropsWithChildren<Icon1Props>) {
  return (
    <div className={clsx("size-[15px]", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type ButtonTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ButtonText({ text, additionalClassNames = "" }: ButtonTextProps) {
  return (
    <div className={clsx("absolute content-stretch flex h-[34px] items-center left-[8px] pl-[42px] pr-[12px] rounded-[8px] w-[231px]", additionalClassNames)}>
      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#64748b] text-[13px] text-center tracking-[0.052px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TextText1Props = {
  text: string;
};

function TextText1({ text }: TextText1Props) {
  return (
    <Wrapper1 additionalClassNames="h-[20px]">
      <p className="absolute font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#484e56] text-[14px] top-0 tracking-[0.056px] whitespace-nowrap">{text}</p>
    </Wrapper1>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 4L10 8L6 12" id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}
type TextTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextText({ text, additionalClassNames = "" }: TextTextProps) {
  return (
    <Wrapper2 additionalClassNames={clsx("h-[16.797px] relative shrink-0", additionalClassNames)}>
      <p className="absolute font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16.8px] left-0 text-[#64748b] text-[12px] top-[-0.5px] tracking-[0.048px] whitespace-nowrap">{text}</p>
    </Wrapper2>
  );
}

export default function MyWork() {
  return (
    <div className="bg-white relative size-full" data-name="My Work">
      <div className="absolute bg-white content-stretch flex h-[997px] items-start left-0 pl-[248px] top-0 w-[1387px]" data-name="DashboardLayout">
        <Container additionalClassNames="h-[997px]">
          <Wrapper3 additionalClassNames="bg-white w-[1139px]">
            <div className="bg-white h-[87.398px] relative shrink-0 w-[1139px]" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative size-full">
                <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[2px] items-center pl-[32px] relative size-full">
                      <TextText text="Risk Bundles" additionalClassNames="w-[72.055px]" />
                      <Icon />
                      <TextText text="Entity Due Diligence" additionalClassNames="w-[114.844px]" />
                      <Icon />
                      <Wrapper additionalClassNames="h-[16.797px] w-[58.203px]">
                        <p className="absolute font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16.8px] left-0 text-[#0f172a] text-[12px] top-[-0.5px] tracking-[0.048px] whitespace-nowrap">New Case</p>
                      </Wrapper>
                    </div>
                  </div>
                </div>
                <div className="h-[46.398px] relative shrink-0 w-full" data-name="Container">
                  <div className="content-stretch flex items-start pb-[20px] px-[32px] relative size-full">
                    <p className="flex-[1_0_0] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[26.4px] min-h-px min-w-px relative text-[#0f172a] text-[20px] tracking-[0.08px]">Create New Case</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1139px]" data-name="Container">
              <div className="overflow-clip rounded-[inherit] size-full">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[28px] px-[32px] relative size-full">
                  <div className="bg-white h-[173px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
                    <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
                    <div className="content-stretch flex flex-col items-start p-px relative size-full">
                      <div className="h-[59px] relative shrink-0 w-full" data-name="Container">
                        <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16.8px] left-[20px] text-[#0f172a] text-[12px] top-[18.5px] tracking-[0.048px] whitespace-nowrap">Entity Identification</p>
                        <div className="absolute h-[18px] left-[20px] top-[41px] w-[1033px]" data-name="Paragraph">
                          <p className="absolute font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[18px] left-0 text-[#64748b] text-[12px] top-[-0.5px] tracking-[0.048px] whitespace-nowrap">Search by CIN, PAN, or company name to auto-populate entity details.</p>
                        </div>
                      </div>
                      <div className="h-[112px] relative shrink-0 w-full" data-name="Container">
                        <div className="content-stretch flex flex-col gap-[10px] items-start pt-[16px] px-[20px] relative size-full">
                          <div className="bg-white h-[44px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
                            <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
                            <div className="absolute content-stretch flex h-[42px] items-center left-px overflow-clip px-[38px] top-px w-[1031px]" data-name="Text Input">
                              <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(30,41,59,0.5)] tracking-[0.048px] whitespace-nowrap">Search using CIN, PAN, or Company Name</p>
                            </div>
                            <Icon1 additionalClassNames="absolute left-[13px] top-[14.5px]">
                              <path d={svgPaths.p220e9c00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
                              <path d={svgPaths.p1de9fb00} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
                            </Icon1>
                          </div>
                          <div className="h-[22px] relative shrink-0 w-full" data-name="Container">
                            <div className="absolute h-[14px] left-0 top-[4px] w-[49.117px]" data-name="Text">
                              <p className="absolute font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[14px] left-0 text-[#64748b] text-[10px] top-[0.5px] tracking-[0.04px] whitespace-nowrap">Examples:</p>
                            </div>
                            <div className="absolute bg-[#f5f6f8] border border-[#e5e7eb] border-solid h-[22px] left-[57.12px] rounded-[8px] top-0 w-[147.961px]" data-name="Button">
                              <p className="-translate-x-1/2 absolute font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[73px] text-[#475569] text-[10px] text-center top-[2.5px] tracking-[0.04px] whitespace-nowrap">U72200KA2018PTC115234</p>
                            </div>
                            <div className="absolute bg-[#f5f6f8] border border-[#e5e7eb] border-solid h-[22px] left-[211.08px] rounded-[8px] top-0 w-[81.82px]" data-name="Button">
                              <p className="-translate-x-1/2 absolute font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[40px] text-[#475569] text-[10px] text-center top-[2.5px] tracking-[0.04px] whitespace-nowrap">AABCT1234A</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Wrapper3>
        </Container>
      </div>
      <div className="absolute bg-[#fafafb] content-stretch flex flex-col h-[997px] items-start left-0 pr-px top-0 w-[248px]" data-name="Sidebar">
        <div aria-hidden="true" className="absolute border-[#eceded] border-r border-solid inset-0 pointer-events-none" />
        <Wrapper3 additionalClassNames="w-[247px]">
          <div className="h-[56px] relative shrink-0 w-[247px]" data-name="Container">
            <div aria-hidden="true" className="absolute border-[#eceded] border-b border-solid inset-0 pointer-events-none" />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-px pl-[16px] relative size-full">
              <Wrapper additionalClassNames="h-[24px] w-[109.969px]">
                <div className="absolute h-[22px] left-[46px] top-px w-[63.969px]" data-name="Text">
                  <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[22px] left-0 text-[#0f172a] text-[16px] top-0 tracking-[-0.2px] whitespace-nowrap">OneRisk</p>
                </div>
                <div className="absolute content-stretch flex h-[24px] items-center justify-center left-0 top-0 w-[36px]" data-name="LogoIcon">
                  <div className="h-[24px] relative shrink-0 w-[36px]" data-name="Icon">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 24">
                      <g clipPath="url(#clip0_260_211)" id="Icon">
                        <path d={svgPaths.p34165d00} fill="var(--fill-0, white)" id="Vector" />
                        <path d={svgPaths.p1f8229c0} fill="var(--fill-0, #CE1417)" id="Vector_2" />
                        <path d={svgPaths.p1d9382f0} fill="var(--fill-0, #CE1417)" id="Vector_3" />
                        <path d={svgPaths.p39386200} fill="var(--fill-0, #131A25)" id="Vector_4" />
                      </g>
                      <defs>
                        <clipPath id="clip0_260_211">
                          <rect fill="white" height="24" width="36" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </Wrapper>
            </div>
          </div>
          <Wrapper5 additionalClassNames="w-[247px]">
            <div className="absolute h-[144px] left-0 top-[8px] w-[247px]" data-name="Container">
              <div className="absolute content-stretch flex gap-[10px] h-[38px] items-center left-[8px] px-[12px] rounded-[8px] top-0 w-[231px]" data-name="Button">
                <Icon2>
                  <path d={svgPaths.p3c193bc0} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M13.5 12.75V6.75" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M9.75 12.75V3.75" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M6 12.75V10.5" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                </Icon2>
                <TextText1 text="Risk Bundles" />
                <Wrapper4 additionalClassNames="size-[14px]">
                  <Icon3>
                    <path d="M10.5 8.75L7 5.25L3.5 8.75" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.05" />
                  </Icon3>
                </Wrapper4>
              </div>
              <div className="absolute h-[106px] left-0 overflow-clip top-[38px] w-[247px]" data-name="Container">
                <div className="absolute bg-[rgba(23,102,214,0.08)] content-stretch flex h-[34px] items-center left-[8px] pl-[42px] pr-[12px] rounded-[8px] top-[2px] w-[231px]" data-name="Button">
                  <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[#1766d6] text-[13px] text-center tracking-[0.052px] whitespace-nowrap">Entity Due Diligence</p>
                </div>
                <ButtonText text="Individual Due Diligence" additionalClassNames="top-[36px]" />
                <ButtonText text="Asset Due Diligence" additionalClassNames="top-[70px]" />
              </div>
            </div>
            <div className="absolute content-stretch flex gap-[10px] h-[38px] items-center left-[8px] px-[12px] rounded-[8px] top-[154px] w-[231px]" data-name="Button">
              <Icon2>
                <path d={svgPaths.p126da180} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                <path d="M15.75 15.75L12.525 12.525" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
              </Icon2>
              <TextText1 text="Terminal" />
              <Wrapper4 additionalClassNames="size-[14px]">
                <Icon3>
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.05" />
                </Icon3>
              </Wrapper4>
            </div>
            <div className="absolute content-stretch flex gap-[10px] h-[38px] items-center left-[8px] px-[12px] rounded-[8px] top-[194px] w-[231px]" data-name="NavButton">
              <Wrapper4 additionalClassNames="h-[18px] w-[20px]">
                <Icon2>
                  <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M12.75 6L9 2.25L5.25 6" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M9 2.25V11.25" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                </Icon2>
              </Wrapper4>
              <TextText1 text="Bulk Upload" />
            </div>
            <div className="absolute content-stretch flex gap-[10px] h-[38px] items-center left-[8px] px-[12px] rounded-[8px] top-[234px] w-[231px]" data-name="NavButton">
              <Wrapper4 additionalClassNames="h-[18px] w-[20px]">
                <Icon2>
                  <path d={svgPaths.p22c79200} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d={svgPaths.p173d700} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M9 8.25H12" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M9 12H12" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M6 8.25H6.0075" id="Vector_5" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                  <path d="M6 12H6.0075" id="Vector_6" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                </Icon2>
              </Wrapper4>
              <TextText1 text="Case Management" />
            </div>
          </Wrapper5>
          <div className="h-[59px] relative shrink-0 w-[247px]" data-name="Container">
            <div aria-hidden="true" className="absolute border-[#eceded] border-solid border-t inset-0 pointer-events-none" />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] pl-[8px] pt-[9px] relative size-full">
              <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[231px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center px-[8px] relative size-full">
                  <Wrapper4 additionalClassNames="bg-[#1766d6] rounded-[15px] size-[30px]">
                    <Icon1 additionalClassNames="relative shrink-0">
                      <path d={svgPaths.p3b9d0f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
                      <path d={svgPaths.p2ec9be80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
                    </Icon1>
                  </Wrapper4>
                  <Container additionalClassNames="h-[32px]">
                    <Wrapper1 additionalClassNames="w-[150px]">
                      <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[18px] left-0 text-[#0f172a] text-[13px] top-[-0.5px] whitespace-nowrap">Harish M</p>
                    </Wrapper1>
                    <div className="h-[14px] relative shrink-0 w-[150px]" data-name="Sidebar">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
                        <p className="flex-[1_0_0] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[14px] min-h-px min-w-px relative text-[#64748b] text-[11px]">Credit Analyst</p>
                      </div>
                    </div>
                  </Container>
                  <div className="relative shrink-0 size-[15px]" data-name="Text">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
                      <Wrapper5 additionalClassNames="h-[15px]">
                        <div className="absolute inset-[12.5%_62.5%_12.5%_12.5%]" data-name="Vector">
                          <div className="absolute inset-[-5%_-15%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.875 12.375">
                              <path d={svgPaths.p29d487d8} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-[29.17%_12.5%_29.17%_66.67%]" data-name="Vector">
                          <div className="absolute inset-[-9%_-18%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.25 7.375">
                              <path d={svgPaths.p2be00e80} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-1/2 left-[37.5%] right-[12.5%] top-1/2" data-name="Vector">
                          <div className="absolute inset-[-0.56px_-7.5%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.625 1.125">
                              <path d="M8.0625 0.5625H0.5625" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
                            </svg>
                          </div>
                        </div>
                      </Wrapper5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrapper3>
      </div>
    </div>
  );
}
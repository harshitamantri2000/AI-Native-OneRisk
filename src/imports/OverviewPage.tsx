import svgPaths from "./svg-rg9qbkgykv";

function Group() {
  return (
    <div className="absolute h-[34px] left-[13px] top-[21.5px] w-[53.04px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.0401 34">
        <g id="Group 2">
          <ellipse cx="16.9646" cy="17" fill="var(--fill-0, white)" id="Ellipse 5" rx="16.9646" ry="17" />
          <g id="Group 1">
            <g id="Vector">
              <path d={svgPaths.p2a9ce700} fill="var(--fill-0, #CE1417)" />
              <path d={svgPaths.p3cd9e980} fill="var(--fill-0, #CE1417)" />
            </g>
            <path d={svgPaths.p198bdc80} fill="var(--fill-0, #484E56)" id="Vector_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function LogoIdfyMain() {
  return (
    <div className="absolute contents left-[13px] top-[21.5px]" data-name="logo/idfy-main">
      <Group />
    </div>
  );
}

function IDfyLogoProductDfShort() {
  return (
    <div className="absolute contents left-[13px] top-[21.5px]" data-name="IDfy Logo/Product/DF-short">
      <LogoIdfyMain />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-center p-[10px] relative shrink-0 w-[79px]">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Icon=fi:home">
        <div className="absolute inset-[4.58%_8.75%]" data-name="Vector (Stroke)">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 18.1667">
            <path clipRule="evenodd" d={svgPaths.p26069680} fill="var(--fill-0, #131A25)" fillRule="evenodd" id="Vector (Stroke)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-start flex flex-wrap gap-y-[4px] items-start left-0 top-[73px] w-[80px]">
      <Frame />
    </div>
  );
}

function SidebarCollapsed() {
  return (
    <div className="bg-[#fafafb] h-[900px] pointer-events-auto sticky top-0 w-[80px]" data-name="sidebar/collapsed">
      <IDfyLogoProductDfShort />
      <Frame1 />
    </div>
  );
}

function Frame6() {
  return <div className="absolute bg-white h-[900px] left-[80px] top-0 w-[1362px]" />;
}

function FeUser() {
  return (
    <div className="relative shrink-0 size-[19.2px]" data-name="fe:user">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <g id="fe:user">
          <path d={svgPaths.p21edbb00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#fc5555] col-1 content-stretch flex items-center ml-0 mt-0 p-[6.4px] relative rounded-[16px] row-1 size-[32px]">
      <FeUser />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Group1 />
    </div>
  );
}

function OuName() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex h-[47px] items-center left-[10px] p-[12px] rounded-[31.5px] top-[842px]" data-name="OU Name">
      <Frame3 />
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="breadcrumb">
      <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#7d8187] text-[12px] tracking-[0.048px]" style={{ fontFeatureSettings: "\'case\', \'liga\' 0" }}>
        Search Terminal
      </p>
      <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Icon=fi:chevron-right">
        <div className="absolute inset-[21.25%_33.75%]" data-name="Vector (Stroke)">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.55 8.05">
            <path clipRule="evenodd" d={svgPaths.p1cba5000} fill="var(--fill-0, #131A25)" fillRule="evenodd" id="Vector (Stroke)" />
          </svg>
        </div>
      </div>
      <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[1.3] relative shrink-0 text-[#131a25] text-[12px] tracking-[0.048px]" style={{ fontFeatureSettings: "\'case\', \'liga\' 0" }}>
        Bulk Management
      </p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <Breadcrumb />
    </div>
  );
}

function LeftContainer() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative shrink-0 w-[1360px]" data-name="left-container">
      <div aria-hidden="true" className="absolute border-[#eceded] border-b border-solid inset-0 pointer-events-none" />
      <Frame5 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
      <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[1.4] relative shrink-0 text-[#131a25] text-[18px] tracking-[0.072px]" style={{ fontFeatureSettings: "\'case\', \'liga\' 0" }}>
        Bulk Management
      </p>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Page Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[8px] relative w-full">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[79px] items-start left-[80px] top-0 w-[1360px]">
      <LeftContainer />
      <PageHeader />
    </div>
  );
}

export default function OverviewPage() {
  return (
    <div className="bg-[#f3f3f4] relative size-full" data-name="Overview page">
      <div className="absolute bottom-0 h-[900px] left-0 pointer-events-none top-0">
        <SidebarCollapsed />
      </div>
      <Frame6 />
      <OuName />
      <Frame7 />
    </div>
  );
}
import svgPaths from "./svg-2t4o7mlshq";

function Group() {
  return (
    <div className="absolute h-[34px] left-0 top-0 w-[53.04px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.0401 34">
        <g id="Group 2">
          <ellipse cx="16.9646" cy="17" fill="var(--fill-0, white)" id="Ellipse 5" rx="16.9646" ry="17" />
          <g id="Group 1">
            <g id="Vector">
              <path d={svgPaths.p2a9ce700} fill="var(--fill-0, #CE1417)" />
              <path d={svgPaths.p3cd9e980} fill="var(--fill-0, #CE1417)" />
            </g>
            <path d={svgPaths.p198bdc80} fill="var(--fill-0, white)" id="Vector_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function LogoIdfyMain() {
  return (
    <div className="absolute contents left-0 top-0" data-name="logo/idfy-main">
      <Group />
    </div>
  );
}

export default function IDfyLogoProductDfShort() {
  return (
    <div className="relative size-full" data-name="IDfy Logo/Product/DF-short">
      <LogoIdfyMain />
    </div>
  );
}
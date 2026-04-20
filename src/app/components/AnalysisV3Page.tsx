import React from "react";
import { useParams } from "react-router";

/* ─── Typography helper ─── */
const f = {
  fontFamily: "var(--font-family, 'Plus Jakarta Sans', sans-serif)",
  letterSpacing: "0.4%",
} as const;

/* ══════════════════════════════════════════════════════
   Analysis V3 Page — /analysis/case/:caseId
   ══════════════════════════════════════════════════════ */
export const AnalysisV3Page = () => {
  const { caseId } = useParams<{ caseId: string }>();

  return (
    <main
      className="flex-1 flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "var(--neutral-0)" }}
    >
      {/* Empty — ready for rebuild */}
    </main>
  );
};

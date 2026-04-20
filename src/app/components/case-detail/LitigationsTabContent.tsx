import React from "react";
import type { RichCaseEntry, LitigationRecord } from "../../data/mock";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

const severityColors = {
  Critical: { text: "var(--destructive-700)", bg: "color-mix(in srgb, var(--destructive-500) 10%, transparent)" },
  High:     { text: "var(--destructive-600)", bg: "color-mix(in srgb, var(--destructive-500) 8%, transparent)" },
  Medium:   { text: "var(--warning-700)", bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)" },
  Low:      { text: "var(--text-muted-themed)", bg: "var(--neutral-100)" },
} as const;

const LitigationCard = ({ lit }: { lit: LitigationRecord }) => {
  const sc = severityColors[lit.severity];
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg" style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
      <div className="flex items-start justify-between gap-2">
        <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{lit.offence}</span>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 shrink-0" style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, backgroundColor: sc.bg, color: sc.text }}>
          {lit.severity}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Case: {lit.caseNumber}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Section: {lit.ipcSection}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Court: {lit.court}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Filed: {lit.filingDate}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Status: {lit.status}</span>
        <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Max punishment: {lit.maxPunishment}</span>
      </div>
      {lit.notes && (
        <p style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)", fontStyle: "italic" }}>{lit.notes}</p>
      )}
    </div>
  );
};

export const LitigationsTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const { detail } = entry;
  const hasEntityLit = detail.entityLitigations.length > 0;
  const hasDirectorLit = detail.directorLitigations.some((d) => d.litigations.length > 0);

  if (!hasEntityLit && !hasDirectorLit) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-2" style={{ minHeight: 220 }}>
        <span style={{ ...f, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--success-700)" }}>✓ No litigation records</span>
        <span style={{ ...f, fontSize: "var(--text-sm)", color: "var(--text-muted-themed)" }}>No active cases found for this entity or its directors.</span>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {hasEntityLit && (
        <div>
          <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", marginBottom: 12 }}>Entity Litigations</h3>
          <div className="flex flex-col gap-3">
            {detail.entityLitigations.map((lit) => <LitigationCard key={lit.id} lit={lit} />)}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)", marginBottom: 12 }}>Director Litigations</h3>
        <div className="flex flex-col gap-6">
          {detail.directorLitigations.map((dir) => (
            <div key={dir.din}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>{dir.name}</span>
                <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>{dir.designation} · DIN: {dir.din}</span>
                {dir.litigations.length === 0 ? (
                  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--success-700)", backgroundColor: "color-mix(in srgb, var(--success-500) 10%, transparent)", padding: "2px 8px", borderRadius: 999 }}>
                    Clean
                  </span>
                ) : (
                  <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--destructive-700)", backgroundColor: "color-mix(in srgb, var(--destructive-500) 10%, transparent)", padding: "2px 8px", borderRadius: 999 }}>
                    {dir.litigations.length} case{dir.litigations.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {dir.litigations.length > 0 && (
                <div className="flex flex-col gap-3">
                  {dir.litigations.map((lit) => <LitigationCard key={lit.id} lit={lit} />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

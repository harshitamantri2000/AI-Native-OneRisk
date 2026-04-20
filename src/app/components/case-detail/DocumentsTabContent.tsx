import React from "react";
import type { RichCaseEntry } from "../../data/mock";
import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const f = { fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.4%" } as const;

const typeColors: Record<string, { bg: string; text: string }> = {
  ITR:           { bg: "color-mix(in srgb, var(--success-500) 10%, transparent)", text: "var(--success-700)" },
  GST:           { bg: "color-mix(in srgb, var(--info-600) 10%, transparent)", text: "var(--info-600)" },
  "Bank Statement": { bg: "color-mix(in srgb, var(--primary) 10%, transparent)", text: "var(--primary)" },
  "MCA Extract": { bg: "color-mix(in srgb, var(--neutral-900) 8%, transparent)", text: "var(--neutral-700)" },
  KYC:           { bg: "color-mix(in srgb, var(--warning-600) 10%, transparent)", text: "var(--warning-700)" },
  "Property Doc":{ bg: "color-mix(in srgb, var(--success-700) 10%, transparent)", text: "var(--success-700)" },
};

export const DocumentsTabContent: React.FC<{ entry: RichCaseEntry }> = ({ entry }) => {
  const docs = entry.detail.documents;
  const verifiedCount = docs.filter((d) => d.verified).length;

  return (
    <div className="p-6">
      <div style={{ backgroundColor: "var(--surface-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-heading)" }}>Uploaded Documents</h3>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} strokeWidth={2} color="var(--success-600)" />
            <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>
              {verifiedCount} of {docs.length} verified
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {docs.map((doc) => {
            const typeStyle = typeColors[doc.type] ?? { bg: "var(--neutral-100)", text: "var(--text-muted-themed)" };
            return (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ border: "1px solid var(--border-subtle)" }}>
                <FileText size={16} strokeWidth={1.8} color="var(--text-muted-themed)" className="shrink-0" />

                <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                  <span style={{ ...f, fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-heading)" }}>{doc.name}</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5" style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 500, backgroundColor: typeStyle.bg, color: typeStyle.text }}>
                      {doc.type}
                    </span>
                    <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Uploaded: {doc.uploadDate}</span>
                    {doc.verifiedBy && (
                      <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>via {doc.verifiedBy}</span>
                    )}
                  </div>
                  {doc.notes && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <AlertCircle size={11} strokeWidth={2} color="var(--warning-600)" />
                      <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--warning-700)", fontStyle: "italic" }}>{doc.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {doc.verified ? (
                    <>
                      <CheckCircle2 size={14} strokeWidth={2} color="var(--success-600)" />
                      <span style={{ ...f, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--success-700)" }}>Verified</span>
                    </>
                  ) : (
                    <>
                      <Clock size={14} strokeWidth={2} color="var(--text-muted-themed)" />
                      <span style={{ ...f, fontSize: "var(--text-xs)", color: "var(--text-muted-themed)" }}>Pending</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

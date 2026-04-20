import React from "react";
import { Link as LinkIcon, Check, AlertTriangle } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subValue?: string;
  description?: React.ReactNode;
  status?: "neutral" | "danger" | "success";
  flag?: string;
  linkCount?: number;
  className?: string;
}

const MetricCard = ({
  label,
  value,
  subValue,
  description,
  status = "neutral",
  flag,
  linkCount,
  className,
}: MetricCardProps) => {
  return (
    <div className={`bg-card border border-border rounded-xl p-5 flex flex-col h-full shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
          {label}
        </span>
        {flag && (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-destructive/10 text-destructive border border-destructive/20">
            {flag}
          </span>
        )}
      </div>

      {/* Value */}
      <div className={`text-3xl font-bold mb-1 ${
        status === "danger" ? "text-destructive" : 
        status === "success" ? "text-emerald-600" : 
        "text-foreground"
      }`}>
        {value}
      </div>

      {/* Sub Value */}
      {subValue && (
        <div className="text-xs text-muted-foreground mb-4">
          {subValue}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border w-full mb-3" />

      {/* Description */}
      <div className="text-xs text-muted-foreground leading-relaxed flex-grow">
        {description}
      </div>

      {/* Link Footer */}
      {linkCount !== undefined && (
        <div className="mt-4 flex items-center gap-1.5 text-primary hover:underline cursor-pointer w-fit">
          <LinkIcon className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">{linkCount}</span>
        </div>
      )}
    </div>
  );
};

const ComplianceRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-xs py-1">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-emerald-600 flex items-center gap-1.5">
      <Check className="w-3 h-3" />
      {value}
    </span>
  </div>
);

export const FinancialMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Card 1: Revenue */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
            Revenue FY24
          </span>
        </div>
        
        <div className="text-3xl font-bold mb-1 text-foreground">
          ₹0
        </div>
        
        <div className="text-xs text-muted-foreground mb-4">
          Cr — zero recognition
        </div>
        
        <div className="h-px bg-border w-full mb-3" />
        
        <div className="text-xs text-muted-foreground leading-relaxed flex-grow">
          WIP real estate project. Revenue drops from ₹0.04 Cr (FY21) to zero as construction phase holds all capital.
        </div>
        
        <div className="mt-4 flex items-center gap-1.5 text-primary hover:underline cursor-pointer w-fit">
          <LinkIcon className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">2</span>
        </div>
      </div>

      {/* Card 2: D/E Ratio */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 pointer-events-none border border-destructive/20 rounded-xl" />
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
            D/E Ratio
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-destructive/10 text-destructive border border-destructive/20">
            7.1x ABOVE MEDIAN
          </span>
        </div>
        
        <div className="text-3xl font-bold mb-1 text-destructive">
          7.17x
        </div>
        
        <div className="text-xs text-muted-foreground mb-4">
          vs industry 1.01x
        </div>
        
        <div className="h-px bg-border w-full mb-3" />
        
        <div className="text-xs text-muted-foreground leading-relaxed flex-grow">
          Borrowings grew ₹1.04 Cr → ₹4.81 Cr (FY20→FY24) funding construction. Leverage will resolve on project completion.
        </div>
      </div>

      {/* Card 3: Current Ratio */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none border border-emerald-500/20 rounded-xl" />
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
            Current Ratio
          </span>
        </div>
        
        <div className="text-3xl font-bold mb-1 text-emerald-600">
          7,068
        </div>
        
        <div className="text-xs text-muted-foreground mb-4">
          Extremely liquid
        </div>
        
        <div className="h-px bg-border w-full mb-3" />
        
        <div className="text-xs text-muted-foreground leading-relaxed flex-grow">
          Current assets far exceed current liabilities. Short-term solvency not a concern.
        </div>
      </div>

      {/* Card 4: Compliance */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full shadow-sm relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none border border-emerald-500/20 rounded-xl" />
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
            Compliance
          </span>
        </div>
        
        <div className="flex flex-col gap-2.5 mt-1">
          <ComplianceRow label="GST" value="Regular" />
          <ComplianceRow label="EPF" value="Filed" />
          <ComplianceRow label="Auditor" value="Clean" />
          <ComplianceRow label="AML / Sanctions" value="No hits" />
          <ComplianceRow label="Adverse media" value="None" />
        </div>
      </div>
    </div>
  );
};

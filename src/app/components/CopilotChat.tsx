import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Bot,
  Sparkles,
  User,
  CornerDownLeft,
  Zap,
  AlertTriangle,
  TrendingDown,
  Shield,
  MessageCircle,
} from "lucide-react";
import type { CaseEntry, RiskLevel } from "../data/cases";

const fontBase = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  letterSpacing: "0.4%",
};

interface CopilotChatProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  caseData: CaseEntry;
  accentColor: string;
  glowRgba: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const SUGGESTED_PROMPTS = [
  { icon: <AlertTriangle className="w-3 h-3" />, text: "Summarize key risks" },
  { icon: <TrendingDown className="w-3 h-3" />, text: "Analyze financials" },
  { icon: <Shield className="w-3 h-3" />, text: "Director background" },
  { icon: <Zap className="w-3 h-3" />, text: "Recommend actions" },
];

const generateAIResponse = (query: string, caseData: CaseEntry): string => {
  const q = query.toLowerCase();

  if (q.includes("risk") || q.includes("summarize") || q.includes("summary")) {
    return `Based on the AI analysis of **${caseData.name}**, the primary risk factor is "${caseData.aiInsight.mostRiskyElement}" with a model confidence of ${caseData.aiInsight.confidencePercent}%.\n\n${caseData.aiInsight.riskExplanation}\n\nSupporting signals include: ${caseData.aiInsight.additionalFactors.join(", ")}.${caseData.riskLevel === "High" ? "\n\n**Recommendation:** This case requires immediate escalation and enhanced due diligence before any credit decision." : ""}`;
  }

  if (q.includes("financial") || q.includes("finance") || q.includes("analyze")) {
    const f = caseData.detail?.financials;
    if (!f) return "Financial data is not available for this case.";
    const formatCr = (v: number) => {
      if (Math.abs(v) >= 10000000) return `${(v / 10000000).toFixed(1)} Cr`;
      if (Math.abs(v) >= 100000) return `${(v / 100000).toFixed(1)} L`;
      return v.toLocaleString("en-IN");
    };
    return `**Financial Analysis — ${caseData.name}:**\n\n- Revenue: ${formatCr(f.revenue)} (${f.revenueChange > 0 ? "+" : ""}${f.revenueChange}% YoY)\n- EBITDA Margin: ${f.ebitdaMargin}%\n- D/E Ratio: ${f.debtToEquity.toFixed(2)}\n- Current Ratio: ${f.currentRatio.toFixed(2)}\n- Interest Coverage: ${f.interestCoverage}x\n\n${f.debtToEquity > 3 ? "**Warning:** Debt-to-Equity ratio exceeds safe threshold of 3x, signaling severe leverage risk." : f.debtToEquity > 1.5 ? "**Caution:** Elevated leverage detected." : "Leverage ratios are within acceptable limits."}${f.currentRatio < 1 ? "\n\n**Critical:** Current ratio below 1.0 indicates potential liquidity crisis." : ""}`;
  }

  if (q.includes("director") || q.includes("background") || q.includes("promoter")) {
    const directors = caseData.detail?.directors;
    if (!directors || directors.length === 0) return "Director information is not available for this case.";
    const lines = directors.map((d) => {
      let line = `- **${d.name}** — ${d.designation} (DIN: ${d.din})`;
      if (d.criminalCases && d.criminalCases.length > 0) {
        line += `\n  **${d.criminalCases.length} criminal case(s) detected:**`;
        d.criminalCases.forEach((cc) => {
          line += `\n  - ${cc.offence} (${cc.section}) — ${cc.status}, Max: ${cc.maxPunishment}`;
        });
      }
      return line;
    });
    return `**Director Profile — ${caseData.name}:**\n\n${lines.join("\n\n")}${caseData.detail?.promoterHolding === 100 ? "\n\n**Note:** This is a 100% promoter-held entity with no institutional oversight." : ""}`;
  }

  if (q.includes("recommend") || q.includes("action") || q.includes("next step")) {
    if (caseData.riskLevel === "High") {
      return `**Recommended Actions for ${caseData.name}:**\n\n1. **Immediate Escalation** — Flag to Credit Committee for urgent review\n2. **Enhanced Due Diligence** — Engage external forensic auditors for director background verification\n3. **Collateral Review** — Re-assess all pledged collateral at current market value\n4. **Exposure Cap** — Implement hard stop on incremental exposure\n5. **Watch-list Classification** — Move to SMA-2 category with weekly monitoring\n\n**Priority:** Critical — Action within 48 hours`;
    }
    if (caseData.riskLevel === "Medium") {
      return `**Recommended Actions for ${caseData.name}:**\n\n1. **Quarterly Review** — Schedule deep-dive in next credit review cycle\n2. **Covenant Monitoring** — Track financial covenants monthly\n3. **Sector Analysis** — Monitor industry-specific headwinds\n4. **Engagement** — Schedule management discussion to assess mitigation plans\n\n**Priority:** Moderate — Action within 2 weeks`;
    }
    return `**Recommended Actions for ${caseData.name}:**\n\n1. **Standard Monitoring** — Continue quarterly review cycle\n2. **Renewal** — Pre-approved for facility renewal based on current risk profile\n3. **Upsell Opportunity** — Consider cross-sell of trade finance products\n\n**Priority:** Low — Routine review`;
  }

  return `I've analyzed the query regarding **${caseData.name}** (${caseData.id}).\n\nThis is a ${caseData.riskLevel.toLowerCase()}-risk case in the ${caseData.natureOfBusiness} sector. The AI model has ${caseData.aiInsight.confidencePercent}% confidence in its assessment.\n\nWould you like me to dive deeper into any specific aspect? Try asking about:\n- Risk summary\n- Financial analysis\n- Director background\n- Recommended actions`;
};

const renderMarkdown = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--text-heading); font-weight: var(--font-weight-medium)">$1</strong>');

    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const indent = line.startsWith("  ") ? "16px" : "0px";
      return (
        <div key={i} className="flex gap-2" style={{ paddingLeft: indent, marginTop: "2px" }}>
          <span style={{ color: "var(--info-400)", flexShrink: 0, marginTop: "2px" }}>&bull;</span>
          <span
            style={{ ...fontBase, fontSize: "12px", lineHeight: "170%", fontWeight: "var(--font-weight-normal)", color: "var(--text-heading)", opacity: 0.85 }}
            dangerouslySetInnerHTML={{ __html: processed.replace(/^[\s]*[-*]\s/, "") }}
          />
        </div>
      );
    }

    const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      return (
        <div key={i} className="flex gap-2" style={{ marginTop: "4px" }}>
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: "18px",
              height: "18px",
              minWidth: "18px",
              backgroundColor: "rgba(92, 212, 230, 0.1)",
              ...fontBase,
              fontSize: "10px",
              lineHeight: "1",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--info-400)",
              marginTop: "2px",
            }}
          >
            {numberedMatch[1]}
          </span>
          <span
            style={{ ...fontBase, fontSize: "12px", lineHeight: "170%", fontWeight: "var(--font-weight-normal)", color: "var(--text-heading)", opacity: 0.85 }}
            dangerouslySetInnerHTML={{ __html: processed.replace(/^\d+\.\s/, "") }}
          />
        </div>
      );
    }

    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }

    return (
      <span
        key={i}
        style={{ ...fontBase, fontSize: "12px", lineHeight: "170%", fontWeight: "var(--font-weight-normal)", color: "var(--text-heading)", opacity: 0.85, display: "block" }}
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  });
};

export const CopilotChat = ({ isOpen, onClose, onToggle, caseData, accentColor, glowRgba }: CopilotChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your AI Credit Copilot. I've loaded the complete risk profile for **${caseData.name}** (${caseData.id}). Ask me anything about this case — risk factors, financial health, director background, or recommended actions.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const response = generateAIResponse(messageText, caseData);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ─── Floating AI FAB (always visible) ─── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
        onClick={onToggle}
        className="fixed z-50 flex items-center justify-center rounded-2xl cursor-pointer"
        style={{
          bottom: isOpen ? "548px" : "36px",
          right: "36px",
          width: isOpen ? "44px" : "48px",
          height: isOpen ? "44px" : "48px",
          backgroundColor: isOpen ? "rgba(92, 212, 230, 0.15)" : "var(--surface-card)",
          border: isOpen ? "1px solid rgba(92, 212, 230, 0.25)" : "1px solid var(--border-default)",
          boxShadow: isOpen
            ? `0 0 20px rgba(92, 212, 230, 0.2)`
            : "var(--shadow-elevated)",
          transition: "bottom 0.35s cubic-bezier(0.23, 1, 0.32, 1), width 0.2s ease, height 0.2s ease",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing ring when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ border: "2px solid rgba(92, 212, 230, 0.3)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" style={{ color: "var(--info-400)" }} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <Bot className="w-5 h-5" style={{ color: "var(--info-400)" }} />
              {/* Unread dot */}
              <div
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--info-400)", boxShadow: "0 0 6px rgba(92, 212, 230, 0.5)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ─── Chat Window ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed z-50 flex flex-col overflow-hidden rounded-2xl"
            style={{
              bottom: "36px",
              right: "36px",
              width: "400px",
              height: "500px",
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-elevated)",
            }}
          >
            {/* Ambient glow at top */}
            <div
              className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(${glowRgba}, 0.06) 0%, transparent 100%)`,
              }}
            />

            {/* Header */}
            <div
              className="relative z-10 flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom: "1px solid var(--border-default)",
                background: "linear-gradient(135deg, rgba(23,102,214,0.06) 0%, rgba(92, 212, 230, 0.03) 100%)",
              }}
            >
              <div className="relative flex items-center justify-center w-7 h-7">
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: "rgba(23,102,214,0.2)" }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <Bot className="w-4 h-4 relative z-10" style={{ color: "var(--info-400)" }} />
              </div>
              <div className="flex flex-col flex-1">
                <span
                  style={{
                    ...fontBase,
                    fontSize: "13px",
                    lineHeight: "140%",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-heading)",
                  }}
                >
                  AI Credit Copilot
                </span>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--success-500)" }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span
                    style={{
                      ...fontBase,
                      fontSize: "10px",
                      lineHeight: "140%",
                      fontWeight: "var(--font-weight-normal)",
                      color: "var(--text-muted-themed)",
                    }}
                  >
                    Analyzing {caseData.name}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-colors"
                style={{
                  backgroundColor: "var(--surface-hover)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-secondary-themed)",
                }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: "26px",
                      height: "26px",
                      backgroundColor: msg.role === "assistant"
                        ? "rgba(92, 212, 230, 0.1)"
                        : "rgba(23,102,214, 0.15)",
                      border: msg.role === "assistant"
                        ? "1px solid rgba(92, 212, 230, 0.15)"
                        : "1px solid rgba(23,102,214,0.2)",
                    }}
                  >
                    {msg.role === "assistant" ? (
                      <Sparkles className="w-3 h-3" style={{ color: "var(--info-400)" }} />
                    ) : (
                      <User className="w-3 h-3" style={{ color: "var(--primary)" }} />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className="flex flex-col gap-1 rounded-xl px-3 py-2.5 max-w-[290px]"
                    style={{
                      backgroundColor: msg.role === "assistant"
                        ? "var(--surface-inset)"
                        : "rgba(23,102,214,0.08)",
                      border: msg.role === "assistant"
                        ? "1px solid var(--border-default)"
                        : "1px solid rgba(23,102,214,0.15)",
                    }}
                  >
                    <div className="flex flex-col gap-0.5">
                      {renderMarkdown(msg.content)}
                    </div>
                    <span
                      style={{
                        ...fontBase,
                        fontSize: "9px",
                        lineHeight: "140%",
                        fontWeight: "var(--font-weight-normal)",
                        color: "var(--text-muted-themed)",
                        opacity: 0.3,
                        marginTop: "4px",
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: "26px",
                      height: "26px",
                      backgroundColor: "rgba(92, 212, 230, 0.1)",
                      border: "1px solid rgba(92, 212, 230, 0.15)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-3 h-3" style={{ color: "var(--info-400)" }} />
                    </motion.div>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl"
                    style={{
                      backgroundColor: "var(--surface-inset)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--info-400)" }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--info-400)" }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--info-400)" }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length <= 1 && !isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 px-4 pb-2 flex flex-wrap gap-1.5"
              >
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.text)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                    style={{
                      backgroundColor: "var(--surface-inset)",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-secondary-themed)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(92, 212, 230, 0.06)";
                      e.currentTarget.style.borderColor = "rgba(92, 212, 230, 0.15)";
                      e.currentTarget.style.color = "var(--info-600)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--surface-inset)";
                      e.currentTarget.style.borderColor = "var(--border-default)";
                      e.currentTarget.style.color = "var(--text-secondary-themed)";
                    }}
                  >
                    <span style={{ color: "inherit", display: "flex" }}>{prompt.icon}</span>
                    <span
                      style={{
                        ...fontBase,
                        fontSize: "11px",
                        lineHeight: "140%",
                        fontWeight: "var(--font-weight-medium)",
                        color: "inherit",
                      }}
                    >
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input Area */}
            <div
              className="relative z-10 px-4 py-2.5"
              style={{
                borderTop: "1px solid var(--border-default)",
                background: `linear-gradient(180deg, var(--surface-inset-subtle) 0%, var(--surface-inset) 100%)`,
              }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  backgroundColor: "var(--surface-hover)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about this case..."
                  className="flex-1 bg-transparent outline-none"
                  style={{
                    ...fontBase,
                    fontSize: "13px",
                    lineHeight: "140%",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-heading)",
                    border: "none",
                  }}
                />
                <div className="flex items-center gap-1.5">
                  <span
                    className="flex items-center gap-0.5 px-1"
                    style={{
                      ...fontBase,
                      fontSize: "9px",
                      lineHeight: "1",
                      fontWeight: "var(--font-weight-normal)",
                      color: "var(--text-muted-themed)",
                    }}
                  >
                    <CornerDownLeft className="w-2.5 h-2.5" />
                  </span>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isThinking}
                    className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-all"
                    style={{
                      backgroundColor: input.trim() ? "var(--primary)" : "var(--surface-hover)",
                      border: "none",
                      opacity: input.trim() ? 1 : 0.4,
                    }}
                  >
                    <Send className="w-3.5 h-3.5" style={{ color: input.trim() ? "var(--text-on-color)" : "var(--text-secondary-themed)" }} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center mt-1.5">
                <span
                  style={{
                    ...fontBase,
                    fontSize: "9px",
                    lineHeight: "140%",
                    fontWeight: "var(--font-weight-normal)",
                    color: "var(--text-muted-themed)",
                    opacity: 0.25,
                  }}
                >
                  AI-generated analysis. Verify critical decisions independently.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
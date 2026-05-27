"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Sparkles, Send, Clock, CheckCircle2, XCircle, History, BookOpen, Database } from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { RelatedPages } from "@/components/cockpit/related-pages";
import { AskResult } from "@/components/cockpit/ask-result";
import { useAskStream } from "@/hooks/use-ask-stream";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS_ID = [
  "Bagaimana tren rasio klaim industri 2024?",
  "Bandingkan RBC top 5 perusahaan Q4 2024",
  "Channel distribusi mana yang dominan?",
  "Top 10 perusahaan berdasarkan premium Q4 2024",
  "Bagaimana growth YoY BRI Life vs industri?",
  "Tampilkan kategori klaim terbesar 2024",
];

const SUGGESTED_PROMPTS_EN = [
  "How did the industry claims ratio trend in 2024?",
  "Compare RBC of top 5 companies Q4 2024",
  "Which distribution channel is dominant?",
  "Top 10 companies by premium Q4 2024",
  "BRI Life YoY growth vs industry?",
  "Show largest claim categories 2024",
];

const MOCK_RECENT = [
  { id: 1, question: "Tampilkan tren premi BRI Life per kuartal 2024", time: "2 hours ago", status: "complete" as const },
  { id: 2, question: "Bagaimana posisi BRI Life dibanding kompetitor?", time: "5 hours ago", status: "complete" as const },
  { id: 3, question: "Detail rasio klaim Q4 2024 per kategori", time: "1 day ago", status: "complete" as const },
  { id: 4, question: "Project growth premium 2025", time: "2 days ago", status: "error" as const },
  { id: 5, question: "Market share evolution top 10", time: "3 days ago", status: "complete" as const },
];

export default function AskAIPage() {
  const { lang } = useI18n();
  const { state, ask, reset } = useAskStream();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const prompts = lang === "id" ? SUGGESTED_PROMPTS_ID : SUGGESTED_PROMPTS_EN;

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    ask(input.trim(), lang);
  }, [input, lang, ask]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const showResult = state.stage !== "idle";

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Tanya AI" : "Ask AI"}
        description={
          lang === "id"
            ? "Tanya apapun tentang data asuransi jiwa Indonesia. AI generate SQL dan insight analyst-grade."
            : "Ask anything about Indonesian life insurance data. AI generates SQL and analyst-grade insights."
        }
        badge="Claude Sonnet 4.6"
        icon={<Sparkles className="h-5 w-5" />}
        breadcrumb={[{ label: lang === "id" ? "Tanya AI" : "Ask AI" }]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6 p-8 max-w-7xl mx-auto">
          {/* Main composer */}
          <div className="col-span-2 space-y-6">
            <div className="relative rounded-lg border border-border/60 bg-card/50 focus-within:border-primary/40 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  lang === "id"
                    ? "Tanya tentang premi, RBC, market share, claims..."
                    : "Ask about premium, RBC, market share, claims..."
                }
                className="w-full min-h-[140px] bg-transparent px-4 py-3 text-[14px] resize-none focus:outline-none placeholder:text-muted-foreground/50"
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-border/40">
                <span className="text-[11px] text-muted-foreground">
                  {lang === "id" ? "Tekan" : "Press"}{" "}
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted/60 border border-border/60 rounded">
                    ⌘+Enter
                  </kbd>{" "}
                  {lang === "id" ? "untuk submit" : "to submit"}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors",
                    input.trim()
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Send className="h-3 w-3" />
                  {lang === "id" ? "Tanya" : "Ask"}
                </button>
              </div>
            </div>

            {/* Suggested prompts */}
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
                {lang === "id" ? "Pertanyaan saran" : "Suggested prompts"}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {prompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left px-3 py-2.5 rounded-md border border-border/40 bg-card/30 hover:bg-card/60 hover:border-border transition-colors text-[12px] text-foreground/90 leading-relaxed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent queries sidebar */}
          <div className="col-span-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {lang === "id" ? "Riwayat terbaru" : "Recent queries"}
            </div>
            <div className="space-y-1.5">
              {MOCK_RECENT.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handlePromptClick(q.question)}
                  className="w-full text-left px-3 py-2.5 rounded-md border border-border/40 bg-card/30 hover:bg-card/60 hover:border-border transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {q.status === "complete" ? (
                      <CheckCircle2 className="h-3 w-3 text-[#10b981] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-3 w-3 text-[#f43f5e] shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-foreground/90 line-clamp-2 leading-snug">
                        {q.question}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 font-numeric">
                        {q.time}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <hr className="my-8 border-border/40" />
          <RelatedPages
            links={[
              { label: "Query History", href: "/query-history", icon: History, description: "View past queries and results" },
              { label: "KPI Glossary", href: "/kpi-glossary", icon: BookOpen, description: "Look up insurance metric definitions" },
              { label: "Data Schema", href: "/data-schema", icon: Database, description: "Browse available tables and columns" },
            ]}
          />
        </div>
      </div>

      {showResult && <AskResult state={state} onClose={reset} />}
    </div>
  );
}

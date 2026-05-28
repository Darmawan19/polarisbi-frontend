"use client";

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from "react";
import {
  Sparkles,
  Send,
  Clock,
  History,
  BookOpen,
  Database,
  RotateCcw,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { RelatedPages } from "@/components/cockpit/related-pages";
import { AskResultBody } from "@/components/cockpit/ask-result";
import { useAskStream } from "@/hooks/use-ask-stream";
import { useFindingsStore } from "@/lib/stores/findings";
import { formatRelative } from "@/lib/format";
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

export default function AskAIPage() {
  const { lang } = useI18n();
  const { state, ask, reset } = useAskStream();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // SSR hydration guard for the findings store
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const findings = useFindingsStore((s) => s.findings);
  const removeFinding = useFindingsStore((s) => s.removeFinding);
  // Most recent 6 findings — store is already newest-first
  const recentFindings = mounted ? findings.slice(0, 6) : [];

  const prompts = lang === "id" ? SUGGESTED_PROMPTS_ID : SUGGESTED_PROMPTS_EN;
  const showResult = state.stage !== "idle";

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

  const handleRecentClick = (question: string) => {
    setInput(question);
    ask(question, lang);
    // Scroll result into view after a tick
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleNewQuery = () => {
    reset();
  };

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

          {/* ── Left 2 columns: composer + result/prompts ── */}
          <div className="col-span-2 space-y-5">
            {/* Input — always visible */}
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
                className="w-full min-h-[120px] bg-transparent px-4 py-3 text-[14px] resize-none focus:outline-none placeholder:text-muted-foreground/50"
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

            {/* ── Inline answer ── */}
            {showResult && (
              <div ref={resultRef}>
                {/* Question heading + New query button */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="flex-1 text-[15px] font-medium text-foreground leading-snug pt-1">
                    {state.question}
                  </p>
                  <button
                    onClick={handleNewQuery}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {lang === "id" ? "Kueri baru" : "New query"}
                  </button>
                </div>

                {/* Result body — inline (no height constraint, page scrolls) */}
                <div className="rounded-lg border border-border/40 bg-card/30 overflow-hidden">
                  <AskResultBody state={state} />
                </div>
              </div>
            )}

            {/* ── Suggested prompts — hidden while answer is showing ── */}
            {!showResult && (
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
            )}
          </div>

          {/* ── Right column: recent queries ── */}
          <div className="col-span-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {lang === "id" ? "Riwayat terbaru" : "Recent queries"}
            </div>

            {recentFindings.length === 0 ? (
              <p className="text-[11px] text-muted-foreground/60 italic">
                {lang === "id" ? "Belum ada kueri." : "No queries yet."}
              </p>
            ) : (
              <div className="space-y-1.5">
                {recentFindings.map((f) => (
                  <div
                    key={f.id}
                    className="group relative rounded-md border border-border/40 bg-card/30 hover:bg-card/60 hover:border-border transition-colors"
                  >
                    <button
                      onClick={() => handleRecentClick(f.question)}
                      className="w-full text-left px-3 py-2.5 pr-8"
                    >
                      <div className="text-[12px] text-foreground/90 line-clamp-2 leading-snug">
                        {f.question}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground font-numeric">
                          {formatRelative(f.timestamp)}
                        </span>
                        {f.rowCount > 0 && (
                          <>
                            <span className="text-[10px] text-muted-foreground/40">·</span>
                            <span className="text-[10px] text-muted-foreground font-numeric">
                              {f.rowCount.toLocaleString()} rows
                            </span>
                          </>
                        )}
                      </div>
                    </button>
                    {/* Delete button — appears on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFinding(f.id);
                      }}
                      className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 flex items-center justify-center h-5 w-5 rounded text-muted-foreground/40 hover:text-[#f43f5e] hover:bg-muted/40 transition-all"
                      aria-label="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <hr className="my-8 border-border/40" />
            <RelatedPages
              links={[
                {
                  label: "Query History",
                  href: "/query-history",
                  icon: History,
                  description: "View past queries and results",
                },
                {
                  label: "KPI Glossary",
                  href: "/kpi-glossary",
                  icon: BookOpen,
                  description: "Look up insurance metric definitions",
                },
                {
                  label: "Data Schema",
                  href: "/data-schema",
                  icon: Database,
                  description: "Browse available tables and columns",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

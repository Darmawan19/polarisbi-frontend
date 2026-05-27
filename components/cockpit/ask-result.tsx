"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, AlertCircle, Copy, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import type { AskState } from "@/hooks/use-ask-stream";

interface AskResultProps {
  state: AskState;
  onClose: () => void;
}

type Tab = "insight" | "results" | "sql";

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-2.5 text-[12px] font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
      )}
    >
      {children}
      {active && <div className="absolute bottom-0 left-0 right-0 h-px bg-primary" />}
    </button>
  );
}

function CopyButton({ text, labelCopy, labelCopied }: { text: string; labelCopy: string; labelCopied: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
    >
      {copied ? <Check className="h-3 w-3 text-[#10b981]" /> : <Copy className="h-3 w-3" />}
      {copied ? labelCopied : labelCopy}
    </button>
  );
}

export function AskResult({ state, onClose }: AskResultProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("insight");
  const isStreaming = state.stage === "generating_insight";
  const isLoading = state.stage === "generating_sql" || state.stage === "executing_sql";
  const isError = state.stage === "error";

  const stageLabelMap: Record<AskState["stage"], string> = {
    idle: t("askResultStatusIdle"),
    generating_sql: t("askResultStatusGeneratingSql"),
    executing_sql: t("askResultStatusExecutingSql"),
    generating_insight: t("askResultStatusGeneratingInsight"),
    done: t("askResultStatusDone"),
    error: t("askResultStatusError"),
  };

  const statusDotColor =
    isError
      ? "bg-[#f43f5e]"
      : state.stage === "done"
      ? "bg-[#10b981]"
      : "bg-[#00d4ff] animate-pulse";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-[640px] flex flex-col bg-card border-l border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-numeric text-muted-foreground/60 uppercase tracking-wider">
                {t("askResultQueryLabel")} #001
              </span>
              <div className={cn("h-1.5 w-1.5 rounded-full", statusDotColor)} />
              <span className="text-[11px] text-muted-foreground/80">{stageLabelMap[state.stage]}</span>
            </div>
            <p className="text-[13px] text-foreground leading-snug line-clamp-2">{state.question}</p>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-border px-2 shrink-0">
          <TabButton active={tab === "insight"} onClick={() => setTab("insight")}>
            {t("askResultTabInsight")}
          </TabButton>
          <TabButton active={tab === "results"} onClick={() => setTab("results")}>
            {t("askResultTabResults")}
            {state.rows.length > 0 && (
              <span className="ml-1.5 text-[10px] font-numeric text-muted-foreground/60">
                {state.rows.length}
              </span>
            )}
          </TabButton>
          <TabButton active={tab === "sql"} onClick={() => setTab("sql")}>
            {t("askResultTabSQL")}
          </TabButton>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Insight Tab */}
          {tab === "insight" && (
            <div className="p-5">
              {isError && (
                <div className="rounded-lg border border-[#f43f5e]/30 bg-[#f43f5e]/8 p-4 flex items-start gap-3 mb-4">
                  <AlertCircle className="h-4 w-4 text-[#f43f5e] shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[#f43f5e]">{state.error}</p>
                </div>
              )}

              {isLoading && !state.insight && (
                <div className="space-y-3">
                  {[80, 65, 90, 55, 72].map((w, i) => (
                    <div
                      key={i}
                      className="h-3.5 rounded bg-muted/40 animate-pulse"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              )}

              {!isLoading && !state.insight && !isError && (
                <p className="text-[13px] text-muted-foreground italic">{t("askResultWaitingInsight")}</p>
              )}

              {state.insight && (
                <div className="text-[14px] text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {state.insight}
                  {isStreaming && (
                    <span className="inline-block w-[3px] h-[1.1em] bg-primary/70 animate-pulse ml-0.5 align-text-bottom rounded-sm" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Results Tab */}
          {tab === "results" && (
            <div>
              {state.rows.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-[13px] text-muted-foreground">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("askResultRunningQuery")}
                    </div>
                  ) : (
                    t("askResultNoResults")
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/20">
                        {state.columns.map((col) => (
                          <th
                            key={col}
                            className="px-4 py-2.5 text-left font-medium text-muted-foreground text-[11px] uppercase tracking-wider whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {state.rows.map((row, i) => (
                        <tr
                          key={i}
                          className={cn(
                            "border-b border-border/30 hover:bg-muted/10 transition-colors",
                            i === state.rows.length - 1 && "border-0"
                          )}
                        >
                          {state.columns.map((col) => {
                            const val = row[col];
                            const isNum = typeof val === "number";
                            return (
                              <td
                                key={col}
                                className={cn(
                                  "px-4 py-2.5 text-foreground/80",
                                  isNum && "font-numeric text-right"
                                )}
                              >
                                {val != null ? String(val) : "—"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SQL Tab */}
          {tab === "sql" && (
            <div className="p-5">
              {!state.sql ? (
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? t("askResultGeneratingSql") : t("askResultNoSql")}
                </div>
              ) : (
                <div className="rounded-lg border border-border/60 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-b border-border/40">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {t("askResultGeneratedSql")}
                    </span>
                    <CopyButton
                      text={state.sql}
                      labelCopy={t("askResultCopy")}
                      labelCopied={t("askResultCopied")}
                    />
                  </div>
                  <pre className="p-4 text-[12px] font-mono text-foreground/80 overflow-x-auto leading-relaxed">
                    {state.sql}
                  </pre>
                </div>
              )}
              {state.interpretation && (
                <p className="mt-3 text-[12px] text-muted-foreground italic">{state.interpretation}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
          <span className="text-[11px] font-numeric text-muted-foreground/60">
            {state.rows.length > 0
              ? t("askResultRowsReturned", { n: state.rows.length })
              : t("askResultNoDataYet")}
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            {t("askResultNewQuery")}
          </button>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CircleCheck, Clock, CircleX, CirclePause, RefreshCw, LoaderCircle, Info, Radio, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import { refreshSources } from "@/lib/insight/api";
import { formatDateTime, formatRelativeTime, parseIso } from "@/lib/insight/format";
import type { RefreshResponse, SourceStatus, SourceStatusValue } from "@/lib/insight/types";
import { toApiError, useNow, type Resource } from "@/hooks/use-insight";
import { SectionError, useErrorMessage } from "./section-state";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<SourceStatusValue, { icon: LucideIcon; cls: string }> = {
  ok: { icon: CircleCheck, cls: "bg-chip-up text-chip-up-fg border-chip-up-fg/25 dark:bg-chip-up/10 dark:border-chip-up/30" },
  stale: { icon: Clock, cls: "bg-chip-warn text-chip-warn-fg border-chip-warn-fg/25 dark:bg-chip-warn/10 dark:border-chip-warn/30" },
  error: { icon: CircleX, cls: "bg-chip-down text-chip-down-fg border-chip-down-fg/25 dark:bg-chip-down/10 dark:border-chip-down/30" },
  disabled: { icon: CirclePause, cls: "bg-muted text-muted-foreground border-border dark:text-foreground/70" },
};

type Notice = { kind: "info" | "error"; text: string } | null;

function latestSuccess(sources: SourceStatus[]): string | null {
  let best: { iso: string; ms: number } | null = null;
  for (const s of sources) {
    const d = parseIso(s.last_success_at);
    if (d && (!best || d.getTime() > best.ms)) best = { iso: s.last_success_at as string, ms: d.getTime() };
  }
  return best?.iso ?? null;
}

export function SourceStatusStrip({
  sources,
  isAdmin,
  onRefreshed,
}: {
  sources: Resource<SourceStatus[]>;
  isAdmin: boolean;
  onRefreshed: (res: RefreshResponse) => void;
}) {
  const { t, lang } = useI18n();
  const now = useNow();
  const errMsg = useErrorMessage();
  const [refreshing, setRefreshing] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const list = sources.data ?? [];
  const last = latestSuccess(list);
  const labelOf = (key: string) => list.find((s) => s.source === key)?.label ?? key;

  async function onRefresh() {
    setRefreshing(true);
    setNotice(null);
    try {
      const res = await refreshSources();
      const newItems = res.results.reduce((a, r) => a + (r.ok ? r.new_items : 0), 0);
      const failed = res.results.filter((r) => !r.ok).map((r) => labelOf(r.source));
      const summary = t("insight.refreshDone", { n: newItems });
      const failedText = failed.length ? t("insight.refreshFailedSources", { sources: failed.join(", ") }) : "";
      setNotice({ kind: "info", text: failedText ? `${summary} ${failedText}` : summary });
      if (failed.length) toast.warning(summary, { description: failedText });
      else toast.success(summary);
      onRefreshed(res);
    } catch (e) {
      const err = toApiError(e);
      if (err.status === 409 || err.code === "already_running") {
        setNotice({ kind: "info", text: t("insight.refreshRunning") });
      } else if (err.status === 403) {
        setForbidden(true);
        setNotice({ kind: "info", text: t("insight.err.forbidden") });
      } else {
        setNotice({ kind: "error", text: err.status === 0 ? t("insight.err.network") : t("insight.refreshError") });
      }
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <section
      aria-labelledby="insight-sources-title"
      aria-busy={sources.loading || refreshing || undefined}
      className="rounded-lg border border-border bg-card px-4 py-2.5"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-[12px]">
          <Radio className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <h2 id="insight-sources-title" className="font-semibold text-foreground">
            {t("insight.sources.title")}
          </h2>
          <span className="text-muted-foreground">
            · {t("insight.sources.lastUpdated")}:{" "}
            {sources.loading && !sources.data ? (
              <Skeleton className="inline-block h-3 w-20 align-middle" />
            ) : last ? (
              <time dateTime={last} title={formatDateTime(last, lang)} className="text-foreground/90 font-medium">
                {formatRelativeTime(last, lang, now || undefined)}
              </time>
            ) : (
              <span>{t("insight.sources.never")}</span>
            )}
          </span>
        </div>

        <ul className="flex flex-1 flex-wrap items-center gap-1.5" aria-label={t("insight.sources.title")}>
          {sources.loading && !sources.data
            ? Array.from({ length: 4 }, (_, i) => (
                <li key={i}>
                  <Skeleton className="h-6 w-24" />
                </li>
              ))
            : list.map((s) => {
                const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.stale;
                const Icon = st.icon;
                const statusText = t(`insight.sources.status.${s.status}` as const);
                return (
                  <li key={s.source}>
                    <Tooltip>
                      <TooltipTrigger
                        className={cn(
                          "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          st.cls
                        )}
                      >
                        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span>{s.label}</span>
                        <span className="opacity-90">· {statusText}</span>
                        {s.last_error && (
                          <span className="sr-only">. {t("insight.sources.lastError", { error: s.last_error })}</span>
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="flex-col items-start gap-0.5 text-left">
                        <span className="font-semibold">
                          {s.label} · {statusText}
                        </span>
                        <span>
                          {t("insight.sources.lastSuccess", {
                            time: s.last_success_at ? formatDateTime(s.last_success_at, lang) : t("insight.sources.never"),
                          })}
                        </span>
                        {s.last_attempt_at && (
                          <span>{t("insight.sources.lastAttempt", { time: formatDateTime(s.last_attempt_at, lang) })}</span>
                        )}
                        {s.last_item_count !== null && (
                          <span>{t("insight.sources.itemCount", { n: s.last_item_count })}</span>
                        )}
                        {s.last_error && (
                          <span className="break-words">{t("insight.sources.lastError", { error: s.last_error })}</span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
          {!sources.loading && !sources.error && list.length === 0 && (
            <li className="text-[12px] text-muted-foreground">{t("insight.sources.empty")}</li>
          )}
        </ul>

        {isAdmin && !forbidden && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-busy={refreshing || undefined}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[12px] font-medium text-foreground hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {refreshing ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {refreshing ? t("insight.refreshing") : t("insight.refreshNow")}
          </button>
        )}
      </div>

      {sources.error && (
        <SectionError
          className="mt-2"
          message={errMsg(sources.error, "insight.sources.error")}
          onRetry={sources.reload}
        />
      )}

      <div aria-live="polite" role="status" className="empty:hidden">
        {notice && (
          <p
            className={cn(
              "mt-2 flex items-start gap-1.5 text-[12px]",
              notice.kind === "error" ? "text-chip-down-fg" : "text-muted-foreground dark:text-foreground/80"
            )}
          >
            {notice.kind === "error" ? (
              <CircleX className="h-3.5 w-3.5 shrink-0 mt-px" aria-hidden="true" />
            ) : (
              <Info className="h-3.5 w-3.5 shrink-0 mt-px" aria-hidden="true" />
            )}
            {notice.text}
          </p>
        )}
      </div>
    </section>
  );
}

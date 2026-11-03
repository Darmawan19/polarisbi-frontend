"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, LoaderCircle, RotateCcw, FileText, Clock, ExternalLink, Eye, CircleX, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { generateDigest } from "@/lib/insight/api";
import { formatDate, formatDateTime, formatRelativeTime, formatCountdown, safeExternalUrl, truncate } from "@/lib/insight/format";
import type { DigestResponse, FeedItem, InsightPeriod } from "@/lib/insight/types";
import { toApiError, useCountdown, useNow, type Resource } from "@/hooks/use-insight";
import { SectionCard, SectionEmpty, SectionError, SectionSkeleton, useErrorMessage } from "./section-state";
import { PERIOD_PANEL_ID, periodTabId } from "./period-tabs";
import { cn } from "@/lib/utils";

export function SourceChip({ item }: { item: FeedItem }) {
  const { t } = useI18n();
  const href = safeExternalUrl(item.url);
  const label = (
    <>
      <span className="font-semibold">{item.source_label}</span>
      <span className="text-muted-foreground">·</span>
      <span className="truncate">{truncate(item.title, 48)}</span>
    </>
  );
  const cls =
    "inline-flex max-w-full items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[11px] text-foreground/90";
  if (!href) return <span className={cls}>{label}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={t("insight.brief.sourceChipTitle", { title: item.title })}
      className={cn(cls, "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
    >
      {label}
      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">{t("insight.feed.opensNewTab")}</span>
    </a>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</h3>
  );
}

export function BriefCard({
  period,
  digest,
  canGenerate,
}: {
  period: InsightPeriod;
  digest: Resource<DigestResponse>;
  canGenerate: boolean;
}) {
  const { t, lang } = useI18n();
  const now = useNow();
  const errMsg = useErrorMessage();
  const { remaining, start } = useCountdown();
  const [generating, setGenerating] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [notice, setNotice] = useState<{ kind: "info" | "error"; text: string } | null>(null);

  const d = digest.data;
  const showSkeleton = digest.loading && !d;
  const hasBrief = !!d && d.status !== "not_generated";
  const allowGenerate = canGenerate && !forbidden;
  const cooling = remaining > 0;

  async function onGenerate() {
    setGenerating(true);
    setNotice(null);
    try {
      const res = await generateDigest({ period, force: hasBrief, language: "id" });
      digest.setData(res);
      setNotice({ kind: "info", text: t("insight.brief.generated") });
    } catch (e) {
      const err = toApiError(e);
      if (err.status === 429) {
        const secs = Number(err.extra?.retry_after_seconds);
        start(Number.isFinite(secs) && secs > 0 ? secs : 60);
        setNotice({ kind: "info", text: t("insight.brief.cooldownMsg") });
      } else if (err.status === 403) {
        setForbidden(true);
        setNotice({ kind: "info", text: t("insight.err.forbidden") });
      } else if (err.status === 422) {
        setNotice({ kind: "error", text: t("insight.brief.invalidPeriod") });
      } else {
        const text = err.status === 0 ? t("insight.err.network") : t("insight.err.generic");
        setNotice({ kind: "error", text });
        toast.error(text);
      }
    } finally {
      setGenerating(false);
    }
  }

  const generateButton = allowGenerate && d && (
    <button
      type="button"
      onClick={onGenerate}
      disabled={generating || cooling}
      aria-busy={generating || undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        hasBrief
          ? "border border-border bg-background text-foreground hover:bg-muted"
          : "bg-primary text-primary-foreground hover:bg-primary/85"
      )}
    >
      {generating ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : hasBrief ? (
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {generating
        ? t("insight.brief.generating")
        : cooling
          ? t("insight.brief.cooldown", { time: formatCountdown(remaining) })
          : hasBrief
            ? t("insight.brief.regenerate")
            : t("insight.brief.generate")}
    </button>
  );

  const itemsById = new Map((d?.items ?? []).map((i) => [i.id, i]));

  const meta = hasBrief && d ? (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {d.generated_at && (
        <span>
          {t("insight.brief.generatedAt", { time: "" })}
          <time dateTime={d.generated_at} title={formatDateTime(d.generated_at, lang)} className="font-medium text-foreground/90">
            {formatRelativeTime(d.generated_at, lang, now || undefined)}
          </time>
        </span>
      )}
      {d.period_start && d.period_end && (
        <span>
          · {t("insight.brief.periodRange", { start: formatDate(d.period_start, lang), end: formatDate(d.period_end, lang) })}
        </span>
      )}
    </span>
  ) : null;

  const addons = hasBrief && d && (
    <>
      {d.status === "fallback" && (
        <span
          title={t("insight.brief.templateTitle")}
          className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground/85"
        >
          <FileText className="h-3 w-3" aria-hidden="true" />
          {t("insight.brief.template")}
        </span>
      )}
      {d.is_stale && (
        <span className="inline-flex items-center gap-1 rounded border border-chip-warn-fg/30 bg-chip-warn px-1.5 py-0.5 text-[10px] font-semibold text-chip-warn-fg dark:bg-chip-warn/10 dark:border-chip-warn/30">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {t("insight.brief.stale")}
        </span>
      )}
    </>
  );

  return (
    <div role="tabpanel" id={PERIOD_PANEL_ID} aria-labelledby={periodTabId(period)}>
      <SectionCard
        id="insight-brief"
        title={t("insight.brief.label")}
        titleAddon={
          <>
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {addons}
          </>
        }
        meta={meta}
        action={generateButton}
        busy={digest.loading || generating}
      >
        {showSkeleton ? (
          <SectionSkeleton lines={7} />
        ) : digest.error && !d ? (
          <SectionError message={errMsg(digest.error, "insight.brief.error")} onRetry={digest.reload} />
        ) : !d || d.status === "not_generated" ? (
          <SectionEmpty title={t("insight.brief.notGeneratedTitle")} icon={<Sparkles className="h-5 w-5" />}>
            <p>{t("insight.brief.notGeneratedBody")}</p>
            {!allowGenerate && <p className="mt-1">{t("insight.brief.notGeneratedAsk")}</p>}
          </SectionEmpty>
        ) : !d.content ? (
          <SectionEmpty title={t("insight.brief.noContent")} />
        ) : (
          <div className={cn("space-y-4 text-[13px] leading-relaxed", generating && "opacity-60")}>
            {d.content.executive_summary && (
              <div>
                <SubHeading>{t("insight.brief.executiveSummary")}</SubHeading>
                <p className="text-foreground whitespace-pre-line">{d.content.executive_summary}</p>
              </div>
            )}

            {d.content.key_events.length > 0 && (
              <div>
                <SubHeading>{t("insight.brief.keyEvents")}</SubHeading>
                <ol className="space-y-2">
                  {d.content.key_events.map((ev, i) => {
                    const refs = ev.item_ids
                      .map((id) => itemsById.get(id))
                      .filter((x): x is FeedItem => !!x);
                    return (
                      <li key={i} className="flex gap-2">
                        <span className="font-numeric text-[11px] text-primary mt-0.5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 space-y-1">
                          <p className="text-foreground">{ev.text}</p>
                          {refs.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {refs.map((it) => (
                                <SourceChip key={it.id} item={it} />
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {d.content.impact_note && (
              <div className="rounded-md border border-primary/25 bg-primary/5 px-3 py-2">
                <SubHeading>{t("insight.brief.impactNote")}</SubHeading>
                <p className="text-foreground whitespace-pre-line">{d.content.impact_note}</p>
              </div>
            )}

            {d.content.watchlist.length > 0 && (
              <div>
                <SubHeading>{t("insight.brief.watchlist")}</SubHeading>
                <ul className="space-y-1">
                  {d.content.watchlist.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground">
                      <Eye className="h-3.5 w-3.5 shrink-0 mt-1 text-muted-foreground" aria-hidden="true" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {digest.error && d && (
          <SectionError className="mt-3" message={errMsg(digest.error, "insight.brief.error")} onRetry={digest.reload} />
        )}

        <div aria-live="polite" role="status" className="empty:hidden">
          {notice && (
            <p
              className={cn(
                "mt-3 flex items-start gap-1.5 text-[12px]",
                notice.kind === "error" ? "text-chip-down-fg" : "text-muted-foreground"
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
      </SectionCard>
    </div>
  );
}

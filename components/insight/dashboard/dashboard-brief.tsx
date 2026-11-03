"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, FileText, Info, LoaderCircle, MapPin, Sparkles, CircleX } from "lucide-react";
import { DemoBadge } from "@/components/common/demo-badge";
import { SourceChip } from "@/components/insight/brief-card";
import { CategoryBadge } from "@/components/insight/category-badge";
import { SeverityBadge } from "@/components/insight/severity-badge";
import { SectionCard, SectionEmpty, SectionError, SectionSkeleton, useErrorMessage } from "@/components/insight/section-state";
import { useI18n } from "@/lib/i18n/context";
import { generateDigest } from "@/lib/insight/api";
import { formatDateTime, formatRelativeTime } from "@/lib/insight/format";
import type { DigestResponse, FeedItem, InsightPeriod } from "@/lib/insight/types";
import { toApiError, useNow, type Resource } from "@/hooks/use-insight";
import { cn } from "@/lib/utils";

const MAX_EVENTS = 3;
const MAX_WATCH = 3;
const MAX_PROVINCES = 6;

export function insightHref(period: InsightPeriod, hash?: string): string {
  const qs = period === "daily" ? "" : `?period=${period}`;
  return `/insight${qs}${hash ? `#${hash}` : ""}`;
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</h3>;
}

const LINK_CLS =
  "inline-flex min-h-6 items-center gap-1 rounded text-[12px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Brief Direksi untuk dashboard: versi ringkas BriefCard.
 * ATURAN DATA DEMO: angka polis / catatan dampak tidak pernah tampil di sini selama
 * `exposure_is_demo !== false`; sebagai gantinya ada tautan ke panel dampak di /insight.
 */
export function DashboardBrief({
  period,
  digest,
  canGenerate,
  className,
}: {
  period: InsightPeriod;
  digest: Resource<DigestResponse>;
  canGenerate: boolean;
  className?: string;
}) {
  const { t, lang } = useI18n();
  const now = useNow();
  const errMsg = useErrorMessage();
  const [generating, setGenerating] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [notice, setNotice] = useState<{ kind: "info" | "error"; text: string } | null>(null);

  const d = digest.data;
  const hasBrief = !!d && d.status !== "not_generated" && !!d.content;
  const exposureReal = d?.exposure_is_demo === false;
  const periodName = t(`insight.period.${period}` as const);

  async function onGenerate() {
    setGenerating(true);
    setNotice(null);
    try {
      digest.setData(await generateDigest({ period, language: "id" }));
    } catch (e) {
      const err = toApiError(e);
      if (err.status === 403) {
        setForbidden(true);
        setNotice({ kind: "info", text: t("insight.err.forbidden") });
      } else if (err.status === 429) {
        setNotice({ kind: "info", text: t("insight.brief.cooldownMsg") });
      } else {
        setNotice({ kind: "error", text: err.status === 0 ? t("insight.err.network") : t("insight.err.generic") });
      }
    } finally {
      setGenerating(false);
    }
  }

  const itemsById = new Map((d?.items ?? []).map((i) => [i.id, i]));
  const provinces = [...(d?.impact ?? [])]
    .filter((r) => r.province && r.province !== "—" && r.events > 0)
    .sort((a, b) => b.events - a.events || b.max_score - a.max_score)
    .slice(0, MAX_PROVINCES);

  const meta =
    hasBrief && d ? (
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {d.generated_at && (
          <span>
            {t("insight.brief.generatedAt", { time: "" })}
            <time dateTime={d.generated_at} title={formatDateTime(d.generated_at, lang)} className="font-medium text-foreground/90">
              {formatRelativeTime(d.generated_at, lang, now || undefined)}
            </time>
          </span>
        )}
        {d.status === "fallback" && (
          <span
            title={t("dash.brief.fallbackTitle")}
            className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground/85"
          >
            <FileText className="h-3 w-3" aria-hidden="true" />
            {t("dash.brief.fallback")}
          </span>
        )}
        {d.generated_by && <span>· {t("dash.brief.generatedBy", { by: t(`dash.brief.by.${d.generated_by}` as const) })}</span>}
      </span>
    ) : null;

  let body: React.ReactNode;
  if (digest.loading && !d) {
    body = <SectionSkeleton lines={8} />;
  } else if (digest.error && !d) {
    body = <SectionError message={errMsg(digest.error, "insight.brief.error")} onRetry={digest.reload} />;
  } else if (!hasBrief || !d?.content) {
    body = (
      <SectionEmpty title={t("dash.brief.autoTitle")} icon={<Sparkles className="h-5 w-5" />}>
        <p>{t("dash.brief.autoBody")}</p>
        {canGenerate && !forbidden && d && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={generating}
            aria-busy={generating || undefined}
            className="mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[12px] font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {generating ? (
              <LoaderCircle className="h-3.5 w-3.5 motion-safe:animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {generating ? t("insight.brief.generating") : t("insight.brief.generate")}
          </button>
        )}
      </SectionEmpty>
    );
  } else {
    const c = d.content;
    const events = c.key_events.slice(0, MAX_EVENTS);
    const watch = c.watchlist.slice(0, MAX_WATCH);
    body = (
      <div className="space-y-4 text-[13px] leading-relaxed">
        {c.executive_summary && (
          <div>
            <SubHeading>{t("insight.brief.executiveSummary")}</SubHeading>
            <p className="line-clamp-5 whitespace-pre-line text-foreground">{c.executive_summary}</p>
            <Link
              href={insightHref(period)}
              aria-label={t("dash.brief.readMoreLabel", { period: periodName.toLowerCase() })}
              className={cn(LINK_CLS, "mt-1")}
            >
              {t("dash.brief.readMore")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}

        {events.length > 0 && (
          <div>
            <SubHeading>{t("insight.brief.keyEvents")}</SubHeading>
            <ol className="space-y-2.5">
              {events.map((ev, i) => {
                const refs = ev.item_ids.map((id) => itemsById.get(id)).filter((x): x is FeedItem => !!x);
                const lead = refs[0];
                const category = ev.category ?? lead?.category;
                return (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 font-numeric text-[11px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 space-y-1">
                      <p className="line-clamp-2 text-foreground">{ev.text}</p>
                      <div className="flex flex-wrap items-center gap-1">
                        {category && <CategoryBadge category={category} />}
                        {lead && <SeverityBadge label={lead.severity_label} />}
                        {refs.slice(0, 2).map((it) => (
                          <SourceChip key={it.id} item={it} />
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {watch.length > 0 && (
          <div>
            <SubHeading>{t("insight.brief.watchlist")}</SubHeading>
            <ul className="space-y-1">
              {watch.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground">
                  <Eye className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Catatan dampak memuat angka polis: hanya bila backend menyatakan data riil. */}
        {exposureReal && c.impact_note && (
          <div className="rounded-md border border-primary/25 bg-primary/5 px-3 py-2">
            <SubHeading>{t("insight.brief.impactNote")}</SubHeading>
            <p className="line-clamp-3 whitespace-pre-line text-foreground">{c.impact_note}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <SectionCard
      id="dash-brief"
      title={t("dash.brief.title")}
      titleAddon={
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {t("dash.brief.subtitle")}
        </span>
      }
      meta={meta}
      busy={digest.loading || generating}
      className={cn("flex flex-col", className)}
      bodyClassName="flex flex-1 flex-col gap-4"
    >
      <div className="flex-1">{body}</div>

      {digest.error && d && (
        <SectionError message={errMsg(digest.error, "insight.brief.error")} onRetry={digest.reload} />
      )}

      <div aria-live="polite" role="status" className="empty:hidden">
        {notice && (
          <p
            className={cn(
              "flex items-start gap-1.5 text-[12px]",
              notice.kind === "error" ? "text-chip-down-fg" : "text-muted-foreground"
            )}
          >
            {notice.kind === "error" ? (
              <CircleX className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            {notice.text}
          </p>
        )}
      </div>

      {d && (
        <div className="space-y-2.5 border-t border-border pt-3">
          {provinces.length > 0 && (
            <div>
              <SubHeading>{t("dash.brief.provinces")}</SubHeading>
              <ul className="flex flex-wrap gap-1.5">
                {provinces.map((r) => (
                  <li
                    key={r.province}
                    className="inline-flex items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[11px] text-foreground/90"
                  >
                    <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {t("dash.brief.provinceEvents", { province: r.province, n: r.events })}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Link href={insightHref(period, "insight-impact-title")} className={LINK_CLS}>
              {t("dash.brief.impactLink")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            {!exposureReal && <DemoBadge title={t("dash.brief.impactDemoNote")} />}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

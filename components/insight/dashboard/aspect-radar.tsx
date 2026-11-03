"use client";

import Link from "next/link";
import { ChevronRight, Info, Tag } from "lucide-react";
import { CATEGORY_ICON } from "@/components/insight/category-badge";
import { SeverityBadge } from "@/components/insight/severity-badge";
import { SectionCard, SectionError, useErrorMessage } from "@/components/insight/section-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/insight/format";
import { INSIGHT_ASPECTS, SEVERITY_LABELS, type InsightCategory, type SeverityLabel } from "@/lib/insight/types";
import type { RecentFeed, Resource } from "@/hooks/use-insight";
import { cn } from "@/lib/utils";

interface AspectStat {
  category: InsightCategory;
  count: number;
  maxSeverity: SeverityLabel | null;
}

function computeStats(feed: RecentFeed): AspectStat[] {
  const rank = (s: SeverityLabel) => SEVERITY_LABELS.indexOf(s);
  const map = new Map<InsightCategory, AspectStat>(
    INSIGHT_ASPECTS.map((c) => [c, { category: c, count: 0, maxSeverity: null }])
  );
  for (const it of feed.items) {
    const st = map.get(it.category);
    if (!st) continue;
    st.count += 1;
    if (!st.maxSeverity || rank(it.severity_label) > rank(st.maxSeverity)) st.maxSeverity = it.severity_label;
  }
  return INSIGHT_ASPECTS.map((c) => map.get(c)!);
}

/** Tujuh aspek, jumlah kejadian 24 jam terakhir + keparahan tertinggi; klik membuka /insight?category=slug. */
export function AspectRadar({ feed, className }: { feed: Resource<RecentFeed>; className?: string }) {
  const { t, lang } = useI18n();
  const errMsg = useErrorMessage();
  const data = feed.data;
  const stats = data ? computeStats(data) : null;

  return (
    <SectionCard
      id="dash-radar"
      title={t("dash.radar.title")}
      meta={t("dash.radar.subtitle")}
      busy={feed.loading}
      className={cn("flex flex-col", className)}
      bodyClassName="flex flex-1 flex-col gap-2 px-2 py-2"
    >
      {!stats ? (
        feed.error ? (
          <div className="px-2 py-1">
            <SectionError message={errMsg(feed.error, "dash.radar.error")} onRetry={feed.reload} />
          </div>
        ) : (
          <ul aria-hidden="true" className="space-y-1">
            {INSIGHT_ASPECTS.map((c) => (
              <li key={c} className="flex items-center gap-2 px-2 py-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3.5 flex-1" />
                <Skeleton className="h-3.5 w-10" />
              </li>
            ))}
          </ul>
        )
      ) : (
        <>
          <ul className="flex-1 space-y-0.5">
            {stats.map((s) => {
              const Icon = CATEGORY_ICON[s.category] ?? Tag;
              const name = t(`insight.category.${s.category}` as const);
              const empty = s.count === 0;
              const label = empty
                ? t("dash.radar.rowLabelEmpty", { aspect: name })
                : t("dash.radar.rowLabel", {
                    aspect: name,
                    n: s.count,
                    severity: s.maxSeverity ? t(`insight.severity.${s.maxSeverity}` as const) : "—",
                  });
              return (
                <li key={s.category}>
                  <Link
                    href={`/insight?category=${encodeURIComponent(s.category)}`}
                    aria-label={label}
                    className={cn(
                      "group flex min-h-10 items-center gap-2.5 rounded-md px-2 py-1.5 text-[12px] hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      empty && "text-muted-foreground"
                    )}
                  >
                    <Icon
                      className={cn("h-4 w-4 shrink-0", empty ? "text-muted-foreground" : "text-primary")}
                      aria-hidden="true"
                    />
                    <span className={cn("min-w-0 flex-1 truncate font-medium", !empty && "text-foreground")}>{name}</span>
                    {empty ? (
                      <span className="text-[11px]">{t("dash.radar.noEvents")}</span>
                    ) : (
                      <>
                        <span className="font-numeric text-[13px] font-semibold text-foreground">
                          {formatNumber(s.count, lang)}
                        </span>
                        {s.maxSeverity && <SeverityBadge label={s.maxSeverity} />}
                      </>
                    )}
                    <ChevronRight
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          {data && data.truncated && (
            <p className="flex items-start gap-1.5 px-2 pb-1 text-[11px] text-muted-foreground">
              <Info className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />
              {t("dash.radar.truncated", {
                n: formatNumber(data.items.length, lang),
                total: formatNumber(data.total, lang),
              })}
            </p>
          )}
          {feed.error && (
            <div className="px-2 pb-1">
              <SectionError message={errMsg(feed.error, "dash.radar.error")} onRetry={feed.reload} />
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}

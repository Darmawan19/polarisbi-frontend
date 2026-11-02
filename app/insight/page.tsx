"use client";

import { Suspense, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Newspaper, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { PeriodTabs } from "@/components/insight/period-tabs";
import { SourceStatusStrip } from "@/components/insight/source-status-strip";
import { BriefCard } from "@/components/insight/brief-card";
import { ImpactPanel } from "@/components/insight/impact-panel";
import { FeedFilters } from "@/components/insight/feed-filters";
import { FeedList } from "@/components/insight/feed-list";
import { InsightFooter } from "@/components/insight/insight-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-context";
import { useI18n } from "@/lib/i18n/context";
import { INSIGHT_MOCK } from "@/lib/insight/api";
import { uniqueAttributions } from "@/lib/insight/format";
import {
  INSIGHT_CATEGORIES,
  INSIGHT_PERIODS,
  type InsightCategory,
  type InsightPeriod,
} from "@/lib/insight/types";
import { useDigest, useFeed, useSources, type FeedFilters as Filters } from "@/hooks/use-insight";
import { cn } from "@/lib/utils";

/**
 * Di dark mode, muted-foreground bawaan (#71717a di atas #111114) < 4.5:1.
 * Di halaman ini token dinaikkan (diturunkan dari token foreground/card, tanpa warna baru).
 */
const DARK_CONTRAST_FIX = "dark:[--muted-foreground:color-mix(in_oklab,var(--foreground)_66%,var(--card))]";

function parsePeriod(v: string | null): InsightPeriod {
  return v && (INSIGHT_PERIODS as readonly string[]).includes(v) ? (v as InsightPeriod) : "daily";
}

function parseFilters(sp: URLSearchParams): Filters {
  const cat = sp.get("category");
  const prov = sp.get("province")?.trim();
  const min = Number(sp.get("min_score"));
  return {
    category: cat && (INSIGHT_CATEGORIES as readonly string[]).includes(cat) ? (cat as InsightCategory) : undefined,
    province: prov || undefined,
    min_score: Number.isFinite(min) && min > 0 ? Math.min(100, Math.round(min)) : undefined,
  };
}

function InsightView() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const period = parsePeriod(searchParams.get("period"));
  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams.toString())), [searchParams]);

  const role = user?.role;
  const isAdmin = role === "admin";
  const canGenerate = role === "admin" || role === "analyst";

  const digest = useDigest(period);
  const sources = useSources();
  const feed = useFeed(filters);

  const updateQuery = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const onPeriod = (p: InsightPeriod) => updateQuery({ period: p === "daily" ? undefined : p });
  const onFilters = (f: Filters) =>
    updateQuery({
      category: f.category,
      province: f.province,
      min_score: f.min_score ? String(f.min_score) : undefined,
    });

  const provinces = useMemo(() => {
    const set = new Set<string>();
    for (const r of digest.data?.impact ?? []) if (r.province && r.province !== "—") set.add(r.province);
    for (const i of digest.data?.items ?? []) if (i.province) set.add(i.province);
    for (const i of feed.items) if (i.province) set.add(i.province);
    return [...set].sort((a, b) => a.localeCompare(b, "id"));
  }, [digest.data, feed.items]);

  const attributions = useMemo(
    () =>
      uniqueAttributions(
        (sources.data ?? []).filter((s) => s.enabled).map((s) => s.attribution),
        digest.data?.attributions ?? [],
        (digest.data?.items ?? []).map((i) => i.attribution),
        feed.items.map((i) => i.attribution)
      ),
    [sources.data, digest.data, feed.items]
  );

  const { reload: reloadSources } = sources;
  const { reload: reloadDigest } = digest;
  const { refreshInPlace } = feed;
  const onRefreshed = useCallback(() => {
    refreshInPlace();
    reloadSources();
    reloadDigest();
  }, [refreshInPlace, reloadSources, reloadDigest]);

  return (
    <div className={cn("flex-1 flex flex-col h-screen overflow-hidden", DARK_CONTRAST_FIX)}>
      <PageHeader
        title={t("insight.title")}
        description={t("insight.description")}
        badge={INSIGHT_MOCK ? t("insight.demo") : undefined}
        icon={<Newspaper className="h-5 w-5" />}
        breadcrumb={[{ label: t("insight.title") }]}
        className="px-4 sm:px-6 lg:px-8"
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <div className="mx-auto max-w-[1600px] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <PeriodTabs value={period} onChange={onPeriod} />
            {INSIGHT_MOCK && (
              <span className="text-[11px] text-muted-foreground" title={t("insight.mockModeTitle")}>
                {t("insight.mockModeTitle")}
              </span>
            )}
          </div>

          <SourceStatusStrip sources={sources} isAdmin={isAdmin} onRefreshed={onRefreshed} />

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-4">
              <BriefCard key={period} period={period} digest={digest} canGenerate={canGenerate} />
              <ImpactPanel digest={digest} />
            </div>

            <section
              aria-labelledby="insight-feed-title"
              aria-busy={feed.loading || feed.loadingMore || undefined}
              className="min-w-0 flex flex-col rounded-lg border border-border bg-card lg:sticky lg:top-0 lg:max-h-[calc(100vh-10rem)]"
            >
              <header className="space-y-2.5 border-b border-border px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="insight-feed-title" className="text-[13px] font-semibold tracking-tight text-foreground">
                    {t("insight.feed.title")}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <RefreshCw className="h-3 w-3" aria-hidden="true" />
                    {t("insight.feed.autoRefresh")}
                  </span>
                </div>
                <FeedFilters value={filters} provinces={provinces} onChange={onFilters} />
              </header>
              <div
                role="region"
                aria-label={t("insight.feed.regionLabel")}
                tabIndex={0}
                className="min-h-0 flex-1 overflow-y-auto px-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <FeedList feed={feed} />
              </div>
            </section>
          </div>

          <InsightFooter attributions={attributions} />
        </div>
      </div>
    </div>
  );
}

function InsightFallback() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden" aria-busy="true">
      <div className="on-header bg-header border-b border-border/40 px-8 py-6">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function InsightPage() {
  return (
    <Suspense fallback={<InsightFallback />}>
      <InsightView />
    </Suspense>
  );
}

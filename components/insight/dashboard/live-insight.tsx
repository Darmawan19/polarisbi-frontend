"use client";

import { Component, useMemo, useState, type ReactNode } from "react";
import { CircleX, RotateCcw, Scale } from "lucide-react";
import { DemoBadge } from "@/components/common/demo-badge";
import { useAuth } from "@/lib/auth/auth-context";
import { useI18n } from "@/lib/i18n/context";
import { INSIGHT_MOCK } from "@/lib/insight/api";
import { formatDateTime, formatRelativeTime, parseIso, uniqueAttributions } from "@/lib/insight/format";
import { INSIGHT_PERIODS, type InsightPeriod, type SourceStatus } from "@/lib/insight/types";
import { useAutoRefresh, useDigest, useNow, useRecentFeed, useSources } from "@/hooks/use-insight";
import { AspectRadar } from "./aspect-radar";
import { DashboardBrief } from "./dashboard-brief";
import { SourceHealth } from "./source-health";
import { cn } from "@/lib/utils";

/**
 * Di dark mode, muted-foreground bawaan (#71717a di atas #111114) < 4.5:1.
 * Sama dengan halaman Insight: token dinaikkan dari foreground/card, tanpa warna baru.
 */
const DARK_CONTRAST_FIX = "dark:[--muted-foreground:color-mix(in_oklab,var(--foreground)_66%,var(--card))]";

function latestSuccess(sources: SourceStatus[] | null): string | null {
  let best: { iso: string; ms: number } | null = null;
  for (const s of sources ?? []) {
    const d = parseIso(s.last_success_at);
    if (d && (!best || d.getTime() > best.ms)) best = { iso: s.last_success_at as string, ms: d.getTime() };
  }
  return best?.iso ?? null;
}

function PeriodToggle({ value, onChange }: { value: InsightPeriod; onChange: (p: InsightPeriod) => void }) {
  const { t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("dash.live.periodLabel")}
      className="inline-flex items-center rounded-md border border-border bg-card p-0.5 text-[12px]"
    >
      {INSIGHT_PERIODS.map((p) => {
        const selected = p === value;
        return (
          <button
            key={p}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(p)}
            className={cn(
              "min-h-7 rounded-[5px] px-3 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {t(`insight.period.${p}` as const)}
          </button>
        );
      })}
    </div>
  );
}

/** Batas error: kegagalan render di blok ini tidak boleh menjatuhkan KPI dashboard. */
class LiveBoundary extends Component<{ fallback: (retry: () => void) => ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback(() => this.setState({ failed: false })) : this.props.children;
  }
}

function LiveInsightBlock() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const now = useNow();
  const [period, setPeriod] = useState<InsightPeriod>("daily");

  const canGenerate = user?.role === "admin" || user?.role === "analyst";

  const recent = useRecentFeed();
  const sources = useSources();
  const digest = useDigest(period);

  useAutoRefresh([recent.reload, sources.reload, digest.reload]);

  const updated = latestSuccess(sources.data);
  const attributions = useMemo(
    () =>
      uniqueAttributions(
        digest.data?.attributions ?? [],
        (recent.data?.items ?? []).map((i) => i.attribution)
      ),
    [digest.data, recent.data]
  );

  return (
    <section
      aria-labelledby="dash-live-title"
      className={cn(
        "relative space-y-4 rounded-xl border border-primary/30 bg-primary/[0.03] p-3 sm:p-4",
        DARK_CONTRAST_FIX
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="dash-live-title" className="text-[20px] font-semibold tracking-tight text-foreground">
              {t("dash.live.title")}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded border border-chip-up-fg/30 bg-chip-up px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-chip-up-fg dark:border-chip-up/30 dark:bg-chip-up/10">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-chip-up-fg opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-chip-up-fg" />
              </span>
              {t("dash.live.badge")}
            </span>
            {INSIGHT_MOCK && <DemoBadge title={t("dash.live.mockTitle")} />}
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {t("dash.live.window")} ·{" "}
            {updated ? (
              <time dateTime={updated} title={formatDateTime(updated, lang)}>
                {t("dash.live.updated", { time: formatRelativeTime(updated, lang, now || undefined) })}
              </time>
            ) : (
              t("dash.live.updatedNever")
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SourceHealth sources={sources} />
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>
      </header>

      {/* Mulai lg: 2fr + 1fr, kedua kartu meregang ke tinggi baris (yang tertinggi menentukan). */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <DashboardBrief key={period} period={period} digest={digest} canGenerate={canGenerate} className="h-full min-w-0" />
        <AspectRadar feed={recent} className="h-full min-w-0" />
      </div>

      {attributions.length > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
          <span className="inline-flex shrink-0 items-center gap-1 font-semibold uppercase tracking-wider text-[10px]">
            <Scale className="h-3 w-3" aria-hidden="true" />
            {t("insight.footer.title")}:
          </span>
          <span>{attributions.join(" · ")}</span>
        </p>
      )}
    </section>
  );
}

export function LiveInsight() {
  const { t } = useI18n();
  return (
    <LiveBoundary
      fallback={(retry) => (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-2 rounded-lg border border-chip-down-fg/25 bg-chip-down/60 px-3 py-2 text-[12px] text-chip-down-fg dark:bg-chip-down/10"
        >
          <CircleX className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t("dash.live.boundary")}</span>
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-7 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t("insight.retry")}
          </button>
        </div>
      )}
    >
      <LiveInsightBlock />
    </LiveBoundary>
  );
}

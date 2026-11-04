"use client";

import Link from "next/link";
import { CATEGORY_ICON } from "@/components/insight/category-badge";
import { useI18n } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/insight/format";
import type { OverviewAspect } from "@/lib/insight/overview";
import { formatDelta, LEVEL_STYLE, Sparkline, TrendDelta, useTrendText } from "./level";
import { cn } from "@/lib/utils";

/** Radar aspek versi monitor: tujuh ubin skor + tren 7 hari. Klik membuka /insight?category=slug. */
export function AspectStrip({
  aspects,
  baselineReady,
  className,
}: {
  aspects: OverviewAspect[];
  baselineReady: boolean;
  className?: string;
}) {
  const { t, lang } = useI18n();
  const trendText = useTrendText();

  return (
    <section aria-labelledby="dash-aspects-title" className={cn("relative min-w-0", className)}>
      <header className="mb-2 flex flex-wrap items-baseline gap-x-2">
        <h3 id="dash-aspects-title" className="text-[15px] font-semibold tracking-tight text-foreground">
          {t("cockpit.aspects.title")}
        </h3>
        <p className="text-[12px] text-muted-foreground">{t("cockpit.aspects.subtitle")}</p>
      </header>

      {aspects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-[12px] text-muted-foreground">
          {t("cockpit.aspects.empty")}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
          {aspects.map((a) => {
            const st = LEVEL_STYLE[a.level];
            const Icon = CATEGORY_ICON[a.category];
            const LIcon = st.icon;
            const quiet = a.level === "normal";
            const name = t(`insight.category.${a.category}` as const);
            return (
              <li key={a.category} className="min-w-0">
                <Link
                  href={`/insight?category=${encodeURIComponent(a.category)}`}
                  aria-label={t("cockpit.aspects.tileLabel", {
                    aspect: name,
                    score: a.score,
                    level: t(`cockpit.level.${a.level}` as const),
                    trend: trendText(a.trend, a.delta),
                    n: a.item_count,
                  })}
                  className={cn(
                    "relative flex h-full flex-col gap-1 rounded-lg border bg-card px-3 py-2.5 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    quiet ? "border-border/70" : "border-border border-t-[3px]",
                    !quiet && st.top
                  )}
                >
                  <span className="flex min-w-0 items-center gap-1.5" aria-hidden="true">
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", st.text)} />
                    <span className={cn("truncate text-[12px] font-medium", quiet ? "text-muted-foreground" : "text-foreground")}>
                      {name}
                    </span>
                  </span>
                  <span className="flex items-baseline justify-between gap-1" aria-hidden="true">
                    <span className={cn("font-numeric font-semibold leading-none tracking-tight", quiet ? "text-[22px]" : "text-[28px]", st.text)}>
                      {a.score}
                    </span>
                    <TrendDelta
                      trend={a.trend}
                      delta={a.delta}
                      className={cn("text-[12px] font-semibold", quiet ? "text-muted-foreground" : "text-foreground")}
                    />
                  </span>
                  <span className={cn("block", quiet ? "text-muted-foreground/70" : st.text)} aria-hidden="true">
                    <Sparkline values={a.sparkline} />
                  </span>
                  <span className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground" aria-hidden="true">
                    <LIcon className="h-3 w-3 shrink-0" />
                    <span>{t(`cockpit.level.${a.level}` as const)}</span>
                    <span>·</span>
                    <span>{t("cockpit.aspects.events", { n: formatNumber(a.item_count, lang) })}</span>
                  </span>
                  {baselineReady && a.vs_baseline !== null && (
                    <span className="text-[10px] text-muted-foreground">
                      {t("cockpit.aspects.vsBaseline", { d: formatDelta(a.vs_baseline, lang) })}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

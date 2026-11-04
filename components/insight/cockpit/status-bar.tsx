"use client";

import { CircleAlert, Gavel, Eye, CircleCheck, type LucideIcon } from "lucide-react";
import { DemoBadge } from "@/components/common/demo-badge";
import { SourceHealth } from "@/components/insight/dashboard/source-health";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n/context";
import { INSIGHT_MOCK } from "@/lib/insight/api";
import { formatDateTime, formatNumber, formatRelativeTime } from "@/lib/insight/format";
import type { Overview } from "@/lib/insight/overview";
import type { SourceStatus } from "@/lib/insight/types";
import type { Resource } from "@/hooks/use-insight";
import { useNow } from "@/hooks/use-insight";
import { LEVEL_STYLE, LevelBadge, TrendDelta, useTrendText } from "./level";
import { cn } from "@/lib/utils";

export function LiveBadge() {
  const { t } = useI18n();
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-chip-up-fg/30 bg-chip-up px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-chip-up-fg dark:border-chip-up/30 dark:bg-chip-up/10">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-chip-up-fg opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-chip-up-fg" />
      </span>
      {t("cockpit.badge")}
    </span>
  );
}

/** Judul blok + badge; dipakai juga oleh skeleton dan kartu error agar judul tetap stabil. */
export function CockpitTitle({ demo }: { demo: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 id="dash-cockpit-title" className="text-[20px] font-semibold tracking-tight text-foreground">
        {t("cockpit.title")}
      </h2>
      <LiveBadge />
      {demo && <DemoBadge title={INSIGHT_MOCK ? t("cockpit.mockTitle") : t("cockpit.demoTitle")} />}
    </div>
  );
}

function Counter({
  icon: Icon,
  label,
  hint,
  value,
  emphasis,
}: {
  icon: LucideIcon;
  label: string;
  hint: string;
  value: number;
  /** kelas teks saat nilai > 0; nol tampil redup */
  emphasis: string | null;
}) {
  const { lang } = useI18n();
  const active = value > 0 && emphasis !== null;
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-0.5 flex items-baseline gap-1">
        <span
          className={cn(
            "font-numeric text-[32px] font-semibold leading-none tracking-tight",
            active ? emphasis : "text-muted-foreground"
          )}
        >
          {formatNumber(value, lang)}
        </span>
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      </dd>
    </div>
  );
}

export function CockpitStatusBar({
  data,
  sources,
  demo,
}: {
  data: Overview;
  sources: Resource<SourceStatus[]>;
  demo: boolean;
}) {
  const { t, lang } = useI18n();
  const now = useNow();
  const trendText = useTrendText();
  const c = data.composite;
  const st = LEVEL_STYLE[c.level];
  const degraded = data.degraded_sources;

  return (
    <div
      className={cn(
        "relative rounded-lg border border-border border-l-4 bg-card px-4 py-3",
        st.accent
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <CockpitTitle demo={demo} />
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {t("cockpit.window", { n: data.window_hours })} ·{" "}
            {data.generated_at ? (
              <time dateTime={data.generated_at} title={formatDateTime(data.generated_at, lang)}>
                {t("cockpit.updated", { time: formatRelativeTime(data.generated_at, lang, now || undefined) })}
              </time>
            ) : (
              t("cockpit.updatedNever")
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SourceHealth sources={sources} />
          {degraded.length > 0 && (
            <Tooltip>
              <TooltipTrigger
                aria-label={t("cockpit.degradedTitle", { list: degraded.join(", ") })}
                className="inline-flex min-h-7 items-center gap-1.5 rounded-md border border-chip-warn-fg/25 bg-chip-warn px-2 py-0.5 text-[11px] font-medium text-chip-warn-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-chip-warn/30 dark:bg-chip-warn/10"
              >
                <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {t("cockpit.degraded", { n: degraded.length })}
              </TooltipTrigger>
              <TooltipContent>{t("cockpit.degradedTitle", { list: degraded.join(", ") })}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-4">
        {/* Titik fokus: indeks komposit */}
        <div
          role="group"
          aria-label={t("cockpit.compositeAria", {
            score: c.score,
            level: t(`cockpit.level.${c.level}` as const),
            trend: trendText(c.trend, c.delta),
          })}
          className="flex items-end gap-3"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground" aria-hidden="true">
              {t("cockpit.composite")}
            </p>
            <p className="mt-0.5 flex items-baseline gap-1" aria-hidden="true">
              <span className={cn("font-numeric text-[48px] font-bold leading-none tracking-tight", st.text)}>
                {c.score}
              </span>
              <span className="text-[13px] text-muted-foreground">/100</span>
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 pb-1" aria-hidden="true">
            <LevelBadge level={c.level} />
            <TrendDelta trend={c.trend} delta={c.delta} className="text-[13px] font-semibold text-foreground" />
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-x-6 gap-y-2">
          <Counter
            icon={Gavel}
            label={t("cockpit.count.perlu")}
            hint={t("cockpit.count.perluHint")}
            value={data.counts.perlu_keputusan}
            emphasis="text-sev-critical-fg"
          />
          <Counter
            icon={Eye}
            label={t("cockpit.count.pantau")}
            hint={t("cockpit.count.pantauHint")}
            value={data.counts.dipantau}
            emphasis="text-sev-medium-fg"
          />
          <Counter
            icon={CircleCheck}
            label={t("cockpit.count.normal")}
            hint={t("cockpit.count.normalHint")}
            value={data.counts.normal}
            emphasis={null}
          />
        </dl>

        {data.headline && (
          <p className="min-w-0 basis-full text-[14px] font-medium leading-snug text-foreground xl:basis-0 xl:flex-1">
            {data.headline}
          </p>
        )}
      </div>
    </div>
  );
}

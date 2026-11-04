"use client";

import { Component, useCallback, useMemo, useState, type ReactNode } from "react";
import { CircleX, PlugZap, RotateCcw, Scale, TriangleAlert } from "lucide-react";
import { SectionError, useErrorMessage } from "@/components/insight/section-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-context";
import { useI18n } from "@/lib/i18n/context";
import { INSIGHT_MOCK } from "@/lib/insight/api";
import type { DecisionStatus } from "@/lib/insight/overview";
import { useAutoRefresh, useSources } from "@/hooks/use-insight";
import { useOverview } from "@/hooks/use-overview";
import { AspectStrip } from "./aspect-strip";
import { DecisionQueue, type CellFilter } from "./decision-queue";
import { EvidenceDrawer } from "./evidence-drawer";
import { HeatMatrix } from "./heat-matrix";
import { CockpitStatusBar, CockpitTitle } from "./status-bar";
import { cn } from "@/lib/utils";

/**
 * Di dark mode, muted-foreground bawaan (#71717a di atas #111114) < 4.5:1.
 * Sama dengan halaman Insight: token dinaikkan dari foreground/card, tanpa warna baru.
 */
const DARK_CONTRAST_FIX = "dark:[--muted-foreground:color-mix(in_oklab,var(--foreground)_66%,var(--card))]";

/** Batas error: kegagalan render blok ini tidak boleh menjatuhkan KPI dashboard. */
class CockpitBoundary extends Component<
  { fallback: (retry: () => void) => ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback(() => this.setState({ failed: false })) : this.props.children;
  }
}

function RetryButton({ onClick }: { onClick: () => void }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-7 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
      {t("insight.retry")}
    </button>
  );
}

function CockpitSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-4">
      <div className="rounded-lg border border-border border-l-4 bg-card px-4 py-3">
        <Skeleton className="h-3 w-40" />
        <div className="mt-3 flex flex-wrap items-end gap-8">
          <Skeleton className="h-12 w-28" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-4 min-w-0 flex-1" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <Skeleton className="h-52 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function DecisionCockpitBlock() {
  const { t } = useI18n();
  const { user } = useAuth();
  const errMsg = useErrorMessage();
  const overview = useOverview();
  const sources = useSources();
  const [filter, setFilter] = useState<CellFilter | null>(null);
  const [evidenceKey, setEvidenceKey] = useState<string | null>(null);

  useAutoRefresh([overview.reload, sources.reload]);

  const canEdit = user?.role === "admin" || user?.role === "analyst";
  const data = overview.data;
  // Aturan data demo: badge tampil selama product_data_is_demo bukan false (dan selalu di mode contoh).
  const demo = INSIGHT_MOCK || (data ? data.product_data_is_demo : false);

  const { updateStatus } = overview;
  const onUpdateStatus = useCallback(
    (key: string, status: DecisionStatus) => updateStatus(key, status),
    [updateStatus]
  );

  const openDecision = useMemo(
    () => (data && evidenceKey ? data.decisions.find((d) => d.key === evidenceKey) ?? null : null),
    [data, evidenceKey]
  );
  const openAspect = useMemo(
    () => (data && openDecision?.aspect ? data.aspects.find((a) => a.category === openDecision.aspect) ?? null : null),
    [data, openDecision]
  );

  let body: ReactNode;
  if (!data) {
    if (overview.unavailable) {
      body = (
        <div className="relative rounded-lg border border-border bg-card px-4 py-4">
          <CockpitTitle demo={false} />
          <div className="mt-3 flex items-start gap-3">
            <PlugZap className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0 space-y-1.5">
              <p className="text-[14px] font-medium text-foreground">{t("cockpit.unavailable.title")}</p>
              <p className="text-[12px] text-muted-foreground">{t("cockpit.unavailable.body")}</p>
              <p className="text-[12px] text-muted-foreground">{t("cockpit.unavailable.hint")}</p>
              <div className="pt-1">
                <RetryButton onClick={overview.reload} />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (overview.error) {
      body = (
        <div className="relative space-y-3 rounded-lg border border-border bg-card px-4 py-4">
          <CockpitTitle demo={INSIGHT_MOCK} />
          <SectionError message={errMsg(overview.error, "cockpit.error")} onRetry={overview.reload} />
        </div>
      );
    } else {
      body = <CockpitSkeleton />;
    }
  } else {
    body = (
      <div className="space-y-4">
        <CockpitStatusBar data={data} sources={sources} demo={demo} />

        {overview.error && (
          <p
            role="status"
            className="flex flex-wrap items-center gap-2 rounded-md border border-chip-warn-fg/25 bg-chip-warn px-3 py-1.5 text-[12px] text-chip-warn-fg dark:border-chip-warn/30 dark:bg-chip-warn/10"
          >
            <TriangleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{t("cockpit.staleError")}</span>
            <RetryButton onClick={overview.reload} />
          </p>
        )}

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <DecisionQueue
            decisions={data.decisions}
            products={data.products}
            aspectCount={data.aspects.length}
            filter={filter}
            onClearFilter={() => setFilter(null)}
            canEdit={canEdit}
            demo={demo}
            onUpdateStatus={onUpdateStatus}
            onOpenEvidence={setEvidenceKey}
          />
          <HeatMatrix
            products={data.products}
            aspects={data.aspects}
            bands={data.levels}
            demo={demo}
            filter={filter}
            onSelect={setFilter}
          />
        </div>

        <AspectStrip aspects={data.aspects} baselineReady={data.baseline_ready} />

        {data.attributions.length > 0 && (
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
            <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
              <Scale className="h-3 w-3" aria-hidden="true" />
              {t("cockpit.attribution")}:
            </span>
            <span>{data.attributions.join(" · ")}</span>
          </p>
        )}

        <EvidenceDrawer decision={openDecision} aspect={openAspect} onClose={() => setEvidenceKey(null)} />
      </div>
    );
  }

  return (
    <section
      aria-labelledby="dash-cockpit-title"
      aria-busy={overview.loading || undefined}
      className={cn("relative", DARK_CONTRAST_FIX)}
    >
      {!data && !overview.unavailable && !overview.error && (
        <h2 id="dash-cockpit-title" className="sr-only">
          {t("cockpit.title")}
        </h2>
      )}
      {body}
    </section>
  );
}

/** Pengganti LiveInsight di dashboard: memuat datanya sendiri; gagal tidak memengaruhi KPI. */
export function DecisionCockpit() {
  const { t } = useI18n();
  return (
    <CockpitBoundary
      fallback={(retry) => (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-2 rounded-lg border border-chip-down-fg/25 bg-chip-down/60 px-3 py-2 text-[12px] text-chip-down-fg dark:bg-chip-down/10"
        >
          <CircleX className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t("cockpit.boundary")}</span>
          <RetryButton onClick={retry} />
        </div>
      )}
    >
      <DecisionCockpitBlock />
    </CockpitBoundary>
  );
}

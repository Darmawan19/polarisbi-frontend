"use client";

import Link from "next/link";
import { ChevronRight, CircleCheck, Filter, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { ApiError } from "@/lib/api";
import type { AspectCategory, Decision, DecisionStatus, OverviewProduct } from "@/lib/insight/overview";
import { DecisionCard } from "./decision-card";
import { cn } from "@/lib/utils";

export const QUEUE_MAX = 3;

export interface CellFilter {
  product: string;
  category: AspectCategory;
}

export function matchesFilter(d: Decision, f: CellFilter | null): boolean {
  if (!f) return true;
  return d.product_codes.includes(f.product) && d.aspect === f.category;
}

export function DecisionQueue({
  decisions,
  products,
  aspectCount,
  filter,
  onClearFilter,
  canEdit,
  demo,
  onUpdateStatus,
  onOpenEvidence,
  className,
}: {
  /** sudah terurut (level, priority) */
  decisions: Decision[];
  products: OverviewProduct[];
  aspectCount: number;
  filter: CellFilter | null;
  onClearFilter: () => void;
  canEdit: boolean;
  demo: boolean;
  onUpdateStatus: (key: string, status: DecisionStatus) => Promise<ApiError | null>;
  onOpenEvidence: (key: string) => void;
  className?: string;
}) {
  const { t } = useI18n();
  const byCode = new Map(products.map((p) => [p.code, p]));
  const matching = decisions.filter((d) => matchesFilter(d, filter));
  const shown = matching.slice(0, QUEUE_MAX);
  const rest = matching.length - shown.length;
  const filterLabel = filter
    ? t("cockpit.filter.chip", {
        product: byCode.get(filter.product)?.name ?? filter.product,
        aspect: t(`insight.category.${filter.category}` as const),
      })
    : "";

  return (
    <section aria-labelledby="dash-queue-title" className={cn("relative flex min-w-0 flex-col gap-3", className)}>
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h3 id="dash-queue-title" className="text-[15px] font-semibold tracking-tight text-foreground">
            {t("cockpit.queue.title")}
          </h3>
          <p className="text-[12px] text-muted-foreground">{t("cockpit.queue.subtitle")}</p>
        </div>
        <Link
          href="/insight"
          className="inline-flex min-h-7 items-center gap-0.5 rounded-sm text-[12px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("cockpit.queue.viewAll")}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </header>

      {filter && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 py-0.5 pl-2 pr-0.5 text-[12px] font-medium text-foreground">
            <Filter className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            {filterLabel}
            <button
              type="button"
              onClick={onClearFilter}
              aria-label={t("cockpit.filter.clear", { label: filterLabel })}
              className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        </div>
      )}

      {shown.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-8 text-center">
          <CircleCheck className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          {filter ? (
            <p className="text-[13px] text-muted-foreground">{t("cockpit.queue.filterEmpty")}</p>
          ) : (
            <>
              <p className="text-[14px] font-medium text-foreground">{t("cockpit.queue.emptyTitle")}</p>
              <p className="text-[12px] text-muted-foreground">{t("cockpit.queue.emptyBody", { n: aspectCount })}</p>
            </>
          )}
        </div>
      ) : (
        <ol className="flex flex-col gap-3">
          {shown.map((d, i) => (
            <li key={d.key} className="min-w-0">
              <DecisionCard
                decision={d}
                variant={i === 0 ? "primary" : "compact"}
                products={byCode}
                canEdit={canEdit}
                demo={demo}
                onUpdateStatus={onUpdateStatus}
                onOpenEvidence={onOpenEvidence}
              />
            </li>
          ))}
        </ol>
      )}

      {rest > 0 && (
        <p className="text-[12px] text-muted-foreground">
          <Link href="/insight" className="rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {t("cockpit.queue.more", { n: rest })}
          </Link>
        </p>
      )}
    </section>
  );
}

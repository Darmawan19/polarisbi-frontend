"use client";

import { useRef, type KeyboardEvent } from "react";
import { useI18n } from "@/lib/i18n/context";
import { INSIGHT_PERIODS, type InsightPeriod } from "@/lib/insight/types";
import { cn } from "@/lib/utils";

export const PERIOD_PANEL_ID = "insight-period-panel";

export function periodTabId(p: InsightPeriod) {
  return `insight-tab-${p}`;
}

/** Tab periode (WAI-ARIA tabs): panah kiri/kanan, Home, End berpindah tab dan langsung memilihnya. */
export function PeriodTabs({
  value,
  onChange,
}: {
  value: InsightPeriod;
  onChange: (p: InsightPeriod) => void;
}) {
  const { t } = useI18n();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const idx = INSIGHT_PERIODS.indexOf(value);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % INSIGHT_PERIODS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + INSIGHT_PERIODS.length) % INSIGHT_PERIODS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = INSIGHT_PERIODS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const p = INSIGHT_PERIODS[next];
    onChange(p);
    refs.current[p]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={t("insight.periodTabsLabel")}
      onKeyDown={onKeyDown}
      className="inline-flex items-center rounded-md border border-border bg-card p-0.5 text-[12px]"
    >
      {INSIGHT_PERIODS.map((p) => {
        const selected = p === value;
        return (
          <button
            key={p}
            ref={(el) => {
              refs.current[p] = el;
            }}
            id={periodTabId(p)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={PERIOD_PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(p)}
            className={cn(
              "px-3 py-1 rounded-[5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {t(`insight.period.${p}` as const)}
          </button>
        );
      })}
    </div>
  );
}

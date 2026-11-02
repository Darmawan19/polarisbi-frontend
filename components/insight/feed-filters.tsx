"use client";

import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { INSIGHT_CATEGORIES, type InsightCategory } from "@/lib/insight/types";
import type { FeedFilters as Filters } from "@/hooks/use-insight";

export const MIN_SCORE_OPTIONS = [0, 25, 50, 75] as const;

const selectCls =
  "w-full rounded-md border border-input bg-background px-2 py-1 text-[12px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function FeedFilters({
  value,
  provinces,
  onChange,
}: {
  value: Filters;
  provinces: string[];
  onChange: (next: Filters) => void;
}) {
  const { t } = useI18n();
  const active = !!(value.category || value.province || value.min_score);
  // Nilai provinsi dari URL tetap tampil walau belum ada di data
  const provinceOptions =
    value.province && !provinces.includes(value.province) ? [value.province, ...provinces] : provinces;

  return (
    <div role="group" aria-label={t("insight.feed.title")} className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <label className="space-y-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{t("insight.feed.filterCategory")}</span>
          <select
            className={selectCls}
            value={value.category ?? ""}
            onChange={(e) =>
              onChange({ ...value, category: (e.target.value || undefined) as InsightCategory | undefined })
            }
          >
            <option value="">{t("insight.feed.all")}</option>
            {INSIGHT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`insight.category.${c}` as const)}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{t("insight.feed.filterProvince")}</span>
          <select
            className={selectCls}
            value={value.province ?? ""}
            onChange={(e) => onChange({ ...value, province: e.target.value || undefined })}
          >
            <option value="">{t("insight.feed.all")}</option>
            {provinceOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{t("insight.feed.filterMinScore")}</span>
          <select
            className={selectCls}
            value={String(value.min_score ?? 0)}
            onChange={(e) => {
              const n = Number(e.target.value);
              onChange({ ...value, min_score: n > 0 ? n : undefined });
            }}
          >
            {MIN_SCORE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n === 0 ? t("insight.feed.anyScore") : `≥ ${n}`}
              </option>
            ))}
            {value.min_score && !(MIN_SCORE_OPTIONS as readonly number[]).includes(value.min_score) && (
              <option value={value.min_score}>≥ {value.min_score}</option>
            )}
          </select>
        </label>
      </div>
      {active && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="inline-flex items-center gap-1 rounded text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3 w-3" aria-hidden="true" />
          {t("insight.feed.resetFilters")}
        </button>
      )}
    </div>
  );
}

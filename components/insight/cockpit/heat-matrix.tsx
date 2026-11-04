"use client";

import { CATEGORY_ICON } from "@/components/insight/category-badge";
import { DemoBadge } from "@/components/common/demo-badge";
import { useI18n } from "@/lib/i18n/context";
import {
  ASPECT_CATEGORIES,
  levelFromScore,
  type LevelBand,
  type OverviewAspect,
  type OverviewProduct,
} from "@/lib/insight/overview";
import type { CellFilter } from "./decision-queue";
import { LEVEL_STYLE } from "./level";
import { cn } from "@/lib/utils";

export function LevelLegend({ bands, className }: { bands: readonly LevelBand[]; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground", className)}>
      <span className="font-semibold uppercase tracking-wider text-[10px]">{t("cockpit.legend")}</span>
      <ul className="flex flex-wrap items-center gap-1.5">
        {bands.map((b) => {
          const st = LEVEL_STYLE[b.level];
          const Icon = st.icon;
          return (
            <li
              key={b.level}
              className={cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-medium", st.chip)}
            >
              <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
              {t(`cockpit.level.${b.level}` as const)}
              <span className="font-numeric">{t("cockpit.legendRange", { min: b.min, max: b.max })}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Peta panas produk x risiko. Klik sel = filter fokus untuk antrean keputusan. */
export function HeatMatrix({
  products,
  aspects,
  bands,
  demo,
  filter,
  onSelect,
  className,
}: {
  /** sudah urut skor produk menurun */
  products: OverviewProduct[];
  aspects: OverviewAspect[];
  bands: readonly LevelBand[];
  demo: boolean;
  filter: CellFilter | null;
  onSelect: (f: CellFilter | null) => void;
  className?: string;
}) {
  const { t } = useI18n();
  const aspectMap = new Map(aspects.map((a) => [a.category, a]));

  return (
    <section
      aria-labelledby="dash-matrix-title"
      className={cn("relative flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card px-3 py-3", className)}
    >
      <header className="min-w-0 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id="dash-matrix-title" className="text-[15px] font-semibold tracking-tight text-foreground">
            {t("cockpit.matrix.title")}
          </h3>
          {demo && <DemoBadge title={t("cockpit.demoTitle")} />}
        </div>
        <p className="text-[12px] text-muted-foreground">{t("cockpit.matrix.subtitle")}</p>
      </header>

      {products.length === 0 ? (
        <p className="px-1 py-6 text-center text-[12px] text-muted-foreground">{t("cockpit.matrix.empty")}</p>
      ) : (
        /* Satu-satunya wadah scroll horizontal di dashboard; relative karena memuat caption sr-only. */
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[30rem] border-separate border-spacing-1 text-[12px]">
            <caption className="sr-only">{t("cockpit.matrix.caption")}</caption>
            <thead>
              <tr>
                <th scope="col" className="px-1 pb-1 text-left align-bottom text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("cockpit.matrix.product")}
                </th>
                {ASPECT_CATEGORIES.map((c) => {
                  const Icon = CATEGORY_ICON[c];
                  const a = aspectMap.get(c);
                  const full = t(`insight.category.${c}` as const);
                  return (
                    <th
                      key={c}
                      scope="col"
                      title={full}
                      className="w-[12%] px-0.5 pb-1 text-center align-bottom font-normal"
                    >
                      <span className="sr-only">
                        {a ? t("cockpit.matrix.aspectScore", { aspect: full, score: a.score }) : full}
                      </span>
                      <span aria-hidden="true" className="flex flex-col items-center gap-0.5">
                        <Icon className={cn("h-3.5 w-3.5", a ? LEVEL_STYLE[a.level].text : "text-muted-foreground")} />
                        <span className="text-[10px] leading-tight text-muted-foreground">
                          {t(`insight.categoryShort.${c}` as const)}
                        </span>
                        <span className="font-numeric text-[11px] font-semibold text-foreground">{a ? a.score : "—"}</span>
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const pst = LEVEL_STYLE[p.level];
                const PIcon = pst.icon;
                return (
                  <tr key={p.code}>
                    <th scope="row" className="max-w-[11rem] px-1 text-left align-middle font-normal">
                      <span className="block truncate text-[12px] font-medium text-foreground" title={p.name}>
                        {p.name}
                      </span>
                      <span className={cn("inline-flex items-center gap-1 text-[11px]", pst.text)}>
                        <PIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="font-numeric font-semibold">{t("cockpit.matrix.productScore", { score: p.score })}</span>
                        <span className="text-muted-foreground">· {t(`cockpit.level.${p.level}` as const)}</span>
                      </span>
                    </th>
                    {ASPECT_CATEGORIES.map((c) => {
                      const v = p.cells[c];
                      const aspectName = t(`insight.category.${c}` as const);
                      if (typeof v !== "number") {
                        return (
                          <td key={c} className="text-center text-muted-foreground">
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">
                              {p.name}, {aspectName}: {t("cockpit.matrix.noCell")}
                            </span>
                          </td>
                        );
                      }
                      const level = levelFromScore(v, bands);
                      const active = filter?.product === p.code && filter.category === c;
                      const label = t("cockpit.matrix.cell", {
                        product: p.name,
                        aspect: aspectName,
                        score: v,
                        level: t(`cockpit.level.${level}` as const),
                      });
                      return (
                        <td key={c} className="p-0">
                          <button
                            type="button"
                            aria-pressed={active}
                            aria-label={active ? `${label}, ${t("cockpit.matrix.cellActive")}` : label}
                            onClick={() => onSelect(active ? null : { product: p.code, category: c })}
                            className={cn(
                              "flex h-9 w-full min-w-[2.5rem] items-center justify-center rounded font-numeric text-[13px] transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card dark:hover:brightness-125",
                              LEVEL_STYLE[level].cell,
                              level === "normal" && "border border-border/60",
                              active && "ring-2 ring-primary ring-offset-1 ring-offset-card"
                            )}
                          >
                            {v}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <LevelLegend bands={bands} className="px-1" />
    </section>
  );
}

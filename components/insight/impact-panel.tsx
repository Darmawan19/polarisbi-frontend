"use client";

import { Fragment, useState } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import { DemoBadge } from "@/components/common/demo-badge";
import { useI18n } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/insight/format";
import type { DigestResponse } from "@/lib/insight/types";
import type { Resource } from "@/hooks/use-insight";
import { SectionCard, SectionEmpty, SectionError, SectionSkeleton, useErrorMessage } from "./section-state";
import { cn } from "@/lib/utils";

export function ImpactPanel({ digest, className }: { digest: Resource<DigestResponse>; className?: string }) {
  const { t, lang } = useI18n();
  const errMsg = useErrorMessage();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const d = digest.data;
  const rows = [...(d?.impact ?? [])].sort(
    (a, b) => b.max_score - a.max_score || b.total_active_policies - a.total_active_policies
  );
  const isDemo = !!d?.exposure_is_demo;

  return (
    <SectionCard
      id="insight-impact"
      title={t("insight.impact.title")}
      titleAddon={isDemo ? <DemoBadge title={t("insight.impact.demoNote")} /> : undefined}
      meta={isDemo ? t("insight.impact.demoNote") : undefined}
      busy={digest.loading}
      className={cn("flex flex-col", className)}
      bodyClassName="flex min-h-0 flex-1 flex-col px-0 py-0"
    >
      {/* Satu-satunya scroll di kartu ini: header tabel menempel (sticky), badan tabel scroll.
          `relative` agar caption sr-only terpotong di sini, tidak bocor ke wadah halaman. */}
      <div
        role="region"
        aria-label={t("insight.impact.regionLabel")}
        tabIndex={0}
        className="relative min-h-0 flex-1 overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {digest.loading && !d ? (
          <SectionSkeleton lines={5} className="px-4 py-3" />
        ) : digest.error && !d ? (
          <div className="px-4 py-3">
            <SectionError message={errMsg(digest.error, "insight.impact.error")} onRetry={digest.reload} />
          </div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-3">
            <SectionEmpty title={t("insight.impact.empty")} icon={<MapPin className="h-5 w-5" />} />
          </div>
        ) : (
          <table className="w-full text-[12px]">
            <caption className="sr-only">{t("insight.impact.caption")}</caption>
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-2 text-left font-semibold sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_var(--border)]">
                  {t("insight.impact.colProvince")}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_var(--border)]">
                  {t("insight.impact.colEvents")}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_var(--border)]">
                  {t("insight.impact.colMaxScore")}
                </th>
                <th scope="col" className="px-4 py-2 text-right font-semibold sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_var(--border)]">
                  {t("insight.impact.colPolicies")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => {
                const rowKey = `${r.province}-${idx}`;
                const isOpen = !!open[rowKey];
                const detailId = `insight-impact-detail-${idx}`;
                return (
                  <Fragment key={rowKey}>
                    <tr className="border-b border-border/70 hover:bg-muted/40">
                      <th scope="row" className="px-4 py-1.5 text-left font-medium">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={detailId}
                          aria-label={t("insight.impact.expand", { province: r.province })}
                          onClick={() => setOpen((o) => ({ ...o, [rowKey]: !o[rowKey] }))}
                          className="inline-flex items-center gap-1.5 rounded text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ChevronRight
                            className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")}
                            aria-hidden="true"
                          />
                          <span>{r.province}</span>
                        </button>
                      </th>
                      <td className="px-3 py-1.5 text-right font-numeric">{formatNumber(r.events, lang)}</td>
                      <td className="px-3 py-1.5 text-right font-numeric">{formatNumber(r.max_score, lang)}</td>
                      <td className="px-4 py-1.5 text-right font-numeric">
                        {formatNumber(r.total_active_policies, lang)}
                      </td>
                    </tr>
                    <tr id={detailId} hidden={!isOpen} className="border-b border-border/70 bg-muted/30">
                      <td colSpan={4} className="px-4 py-2 pl-10">
                        {r.exposure.length === 0 ? (
                          <span className="text-muted-foreground">{t("insight.impact.noProducts")}</span>
                        ) : (
                          <table className="w-full max-w-md text-[12px]">
                            <thead>
                              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                <th scope="col" className="py-1 text-left font-semibold">
                                  {t("insight.impact.colProduct")}
                                </th>
                                <th scope="col" className="py-1 text-right font-semibold">
                                  {t("insight.impact.colActivePolicies")}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.exposure.map((e, j) => (
                                <tr key={`${e.product}-${j}`}>
                                  <td className="py-0.5 text-foreground/90">{e.product}</td>
                                  <td className="py-0.5 text-right font-numeric">{formatNumber(e.active_policies, lang)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
        {digest.error && d && (
          <div className="px-4 py-3">
            <SectionError message={errMsg(digest.error, "insight.impact.error")} onRetry={digest.reload} />
          </div>
        )}
      </div>
    </SectionCard>
  );
}

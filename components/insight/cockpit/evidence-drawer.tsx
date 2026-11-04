"use client";

import { ExternalLink, Info } from "lucide-react";
import { CategoryBadge } from "@/components/insight/category-badge";
import { SeverityBadge } from "@/components/insight/severity-badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n/context";
import { formatDateTime, formatRelativeTime, safeExternalUrl } from "@/lib/insight/format";
import type { Decision, OverviewAspect } from "@/lib/insight/overview";
import { useNow } from "@/hooks/use-insight";
import { DecisionLevelMark } from "./decision-card";
import { EmphasizeNumbers, LevelBadge } from "./level";

/** Panel bukti (Sheet dari kanan). Berita di sini hanya bukti; rekomendasi berasal dari aturan. */
export function EvidenceDrawer({
  decision,
  aspect,
  onClose,
}: {
  decision: Decision | null;
  aspect: OverviewAspect | null;
  onClose: () => void;
}) {
  const { t, lang } = useI18n();
  const now = useNow();
  const d = decision;

  return (
    <Sheet open={d !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md dark:[--muted-foreground:color-mix(in_oklab,var(--foreground)_66%,var(--popover))]">
        {d && (
          <>
            <SheetHeader className="border-b border-border pr-12">
              <DecisionLevelMark level={d.level} />
              <SheetTitle className="mt-1 text-[16px] font-semibold leading-snug">{d.title}</SheetTitle>
              {d.why && (
                <SheetDescription className="text-[13px] leading-relaxed">
                  <EmphasizeNumbers text={d.why} />
                </SheetDescription>
              )}
            </SheetHeader>

            {/* Satu-satunya wadah scroll panel; relative karena memuat elemen sr-only. */}
            <div className="relative min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4">
              <section aria-labelledby="evd-basis">
                <h3 id="evd-basis" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("cockpit.drawer.basis")}
                </h3>
                <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[12px]">
                  {d.rule_id && (
                    <>
                      <dt className="text-muted-foreground">{t("cockpit.drawer.rule")}</dt>
                      <dd className="font-mono text-foreground">{d.rule_id}</dd>
                    </>
                  )}
                  {d.aspect && (
                    <>
                      <dt className="text-muted-foreground">{t("cockpit.drawer.aspect")}</dt>
                      <dd className="flex flex-wrap items-center gap-1.5 text-foreground">
                        <CategoryBadge category={d.aspect} />
                        {aspect && (
                          <>
                            <span className="font-numeric">
                              {t("cockpit.drawer.aspectScore", {
                                score: aspect.score,
                                level: t(`cockpit.level.${aspect.level}` as const),
                              })}
                            </span>
                            <LevelBadge level={aspect.level} />
                          </>
                        )}
                      </dd>
                    </>
                  )}
                  <dt className="text-muted-foreground">{t("cockpit.decision.confidence")}</dt>
                  <dd className="text-foreground">{t(`cockpit.decision.confidence.${d.confidence}` as const)}</dd>
                  {d.provinces.length > 0 && (
                    <>
                      <dt className="text-muted-foreground">{t("cockpit.drawer.provinces")}</dt>
                      <dd className="text-foreground">{d.provinces.join(", ")}</dd>
                    </>
                  )}
                  {d.first_seen_at && (
                    <>
                      <dt className="text-muted-foreground">{t("cockpit.drawer.firstSeen")}</dt>
                      <dd className="text-foreground">
                        <time dateTime={d.first_seen_at} title={formatDateTime(d.first_seen_at, lang)}>
                          {formatRelativeTime(d.first_seen_at, lang, now || undefined)}
                        </time>
                      </dd>
                    </>
                  )}
                </dl>
              </section>

              {d.actions.length > 0 && (
                <section aria-labelledby="evd-actions">
                  <h3 id="evd-actions" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("cockpit.decision.actions")}
                  </h3>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] text-foreground marker:text-muted-foreground">
                    {d.actions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ol>
                </section>
              )}

              <section aria-labelledby="evd-list">
                <h3 id="evd-list" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("cockpit.drawer.evidence", { n: d.evidence.length })}
                </h3>
                {d.evidence.length === 0 ? (
                  <p className="mt-2 text-[12px] text-muted-foreground">{t("cockpit.drawer.noEvidence")}</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {d.evidence.map((e) => {
                      const href = safeExternalUrl(e.url);
                      return (
                        <li key={e.id} className="rounded-md border border-border bg-card px-3 py-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <SeverityBadge label={e.severity} score={e.score} />
                            <CategoryBadge category={e.category} />
                          </div>
                          <p className="mt-1.5 text-[13px] font-medium leading-snug text-foreground">
                            {href ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t("cockpit.drawer.openSource", { title: e.title })}
                                className="inline-flex items-start gap-1 rounded-sm underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <span>{e.title}</span>
                                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                              </a>
                            ) : (
                              e.title
                            )}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {e.source || "—"}
                            {e.published_at && (
                              <>
                                {" · "}
                                <time dateTime={e.published_at} title={formatDateTime(e.published_at, lang)}>
                                  {formatRelativeTime(e.published_at, lang, now || undefined)}
                                </time>
                              </>
                            )}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <p className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-[12px] text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{t("cockpit.drawer.note")}</span>
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

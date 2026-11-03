"use client";

import { CircleCheck, CircleX, Clock, LoaderCircle, CircleHelp, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n/context";
import type { SourceStatus } from "@/lib/insight/types";
import type { Resource } from "@/hooks/use-insight";
import { cn } from "@/lib/utils";

type Level = "ok" | "warn" | "error" | "loading" | "unknown";

const STYLE: Record<Level, { icon: LucideIcon; cls: string }> = {
  ok: { icon: CircleCheck, cls: "bg-chip-up text-chip-up-fg border-chip-up-fg/25 dark:bg-chip-up/10 dark:border-chip-up/30" },
  warn: { icon: Clock, cls: "bg-chip-warn text-chip-warn-fg border-chip-warn-fg/25 dark:bg-chip-warn/10 dark:border-chip-warn/30" },
  error: { icon: CircleX, cls: "bg-chip-down text-chip-down-fg border-chip-down-fg/25 dark:bg-chip-down/10 dark:border-chip-down/30" },
  loading: { icon: LoaderCircle, cls: "bg-muted text-muted-foreground border-border" },
  unknown: { icon: CircleHelp, cls: "bg-muted text-muted-foreground border-border" },
};

/** Indikator ringkas kesehatan sumber: hijau bila semua sumber aktif normal, kuning/merah bila ada masalah. */
export function SourceHealth({ sources }: { sources: Resource<SourceStatus[]> }) {
  const { t } = useI18n();
  const list = (sources.data ?? []).filter((s) => s.enabled && s.status !== "disabled");
  const failing = list.filter((s) => s.status === "error");
  const stale = list.filter((s) => s.status === "stale");
  const problems = [...failing, ...stale];

  let level: Level;
  let text: string;
  if (!sources.data) {
    level = sources.loading ? "loading" : "unknown";
    text = sources.loading ? t("dash.health.loading") : t("dash.health.unknown");
  } else if (failing.length > 0) {
    level = "error";
    text = t("dash.health.error", { n: problems.length });
  } else if (stale.length > 0) {
    level = "warn";
    text = t("dash.health.warn", { n: stale.length });
  } else {
    level = "ok";
    text = t("dash.health.ok");
  }

  const st = STYLE[level];
  const Icon = st.icon;

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`${t("dash.health.label")}: ${text}`}
        className={cn(
          "inline-flex min-h-7 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          st.cls
        )}
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", level === "loading" && "motion-safe:animate-spin")} aria-hidden="true" />
        <span>{text}</span>
      </TooltipTrigger>
      <TooltipContent className="flex-col items-start gap-0.5 text-left">
        {problems.length === 0 ? (
          <span>{level === "ok" ? t("dash.health.okTooltip") : text}</span>
        ) : (
          <>
            <span className="font-semibold">{t("dash.health.tooltipTitle")}</span>
            <ul>
              {problems.map((s) => (
                <li key={s.source}>
                  {s.label} · {t(`insight.sources.status.${s.status}` as const)}
                </li>
              ))}
            </ul>
          </>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

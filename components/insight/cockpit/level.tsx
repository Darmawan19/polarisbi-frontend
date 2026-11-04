"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  OctagonAlert,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { Language } from "@/lib/i18n/dictionary";
import { useI18n } from "@/lib/i18n/context";
import type { ScoreLevel, Trend } from "@/lib/insight/overview";
import { cn } from "@/lib/utils";

/**
 * Gaya per level skor, hanya dari token --sev-* (pasangan latar/teks yang sama dengan
 * SeverityBadge, kontras >= 4.5:1 di light dan dark). Level "normal" sengaja redup:
 * manajemen berdasarkan pengecualian.
 */
export const LEVEL_STYLE: Record<
  ScoreLevel,
  { icon: LucideIcon; chip: string; cell: string; text: string; accent: string; top: string }
> = {
  normal: {
    icon: CircleCheck,
    chip: "border-border bg-muted/50 text-muted-foreground",
    cell: "bg-transparent text-muted-foreground",
    text: "text-muted-foreground",
    accent: "border-l-border",
    top: "border-t-border",
  },
  pantau: {
    icon: CircleAlert,
    chip: "border-sev-medium-fg/30 bg-sev-medium text-sev-medium-fg",
    cell: "bg-sev-medium text-sev-medium-fg",
    text: "text-sev-medium-fg",
    accent: "border-l-sev-medium-fg",
    top: "border-t-sev-medium-fg",
  },
  waspada: {
    icon: TriangleAlert,
    chip: "border-sev-high-fg/30 bg-sev-high text-sev-high-fg",
    cell: "bg-sev-high text-sev-high-fg font-semibold",
    text: "text-sev-high-fg",
    accent: "border-l-sev-high-fg",
    top: "border-t-sev-high-fg",
  },
  kritis: {
    icon: OctagonAlert,
    chip: "border-sev-critical-fg/35 bg-sev-critical text-sev-critical-fg",
    cell: "bg-sev-critical text-sev-critical-fg font-bold ring-1 ring-inset ring-sev-critical-fg/40",
    text: "text-sev-critical-fg",
    accent: "border-l-sev-critical-fg",
    top: "border-t-sev-critical-fg",
  },
};

export function LevelBadge({ level, className }: { level: ScoreLevel; className?: string }) {
  const { t } = useI18n();
  const s = LEVEL_STYLE[level];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap",
        s.chip,
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {t(`cockpit.level.${level}` as const)}
    </span>
  );
}

/** "+9", "−3,5", "0" — tanda minus tipografis, angka sesuai bahasa. */
export function formatDelta(n: number, lang: Language): string {
  const abs = new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", { maximumFractionDigits: 1 }).format(
    Math.abs(n)
  );
  if (n > 0) return `+${abs}`;
  if (n < 0) return `−${abs}`;
  return abs;
}

/** Teks tren untuk aria-label, mis. "naik +9". */
export function useTrendText() {
  const { t, lang } = useI18n();
  return (trend: Trend, delta: number) =>
    trend === "stabil" && delta === 0 ? t("cockpit.trend.stabil") : t(`cockpit.trend.${trend}` as const, { d: formatDelta(delta, lang) });
}

const TREND_ICON: Record<Trend, LucideIcon> = { naik: ArrowUpRight, turun: ArrowDownRight, stabil: ArrowRight };

/** Panah tren + delta. Arti dibawa ikon + angka, bukan warna. */
export function TrendDelta({
  trend,
  delta,
  className,
  iconClassName,
}: {
  trend: Trend;
  delta: number;
  className?: string;
  iconClassName?: string;
}) {
  const { lang } = useI18n();
  const trendText = useTrendText();
  const Icon = TREND_ICON[trend];
  return (
    <span className={cn("inline-flex items-center gap-0.5 font-numeric", className)} title={trendText(trend, delta)}>
      <Icon className={cn("h-3.5 w-3.5 shrink-0", iconClassName)} aria-hidden="true" />
      {formatDelta(delta, lang)}
    </span>
  );
}

/** Sparkline SVG sederhana (lama ke baru). Dekoratif: angka yang sama tersedia sebagai teks. */
export function Sparkline({ values, className }: { values: readonly number[]; className?: string }) {
  if (values.length < 2) return null;
  const w = 64;
  const h = 18;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - 2 - ((v - min) / span) * (h - 4);
    return [x, y] as const;
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("h-[18px] w-full overflow-visible", className)}
    >
      <polyline
        points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Pecah teks dan cetak tebal angka (mis. "4", "M5,0+", "4,2%", "25 bps"). Aman: tanpa HTML. */
export function EmphasizeNumbers({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:[.,]\d+)*\+?\s?(?:%|bps|poin|jam|hari)?)/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-foreground">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

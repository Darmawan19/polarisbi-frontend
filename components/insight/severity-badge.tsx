"use client";

import { CircleMinus, CircleAlert, TriangleAlert, OctagonAlert, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { SeverityLabel } from "@/lib/insight/types";
import { cn } from "@/lib/utils";

const STYLE: Record<SeverityLabel, { icon: LucideIcon; cls: string }> = {
  rendah: { icon: CircleMinus, cls: "bg-sev-low text-sev-low-fg border-sev-low-fg/25" },
  sedang: { icon: CircleAlert, cls: "bg-sev-medium text-sev-medium-fg border-sev-medium-fg/30" },
  tinggi: { icon: TriangleAlert, cls: "bg-sev-high text-sev-high-fg border-sev-high-fg/30" },
  sangat_tinggi: { icon: OctagonAlert, cls: "bg-sev-critical text-sev-critical-fg border-sev-critical-fg/35" },
};

export function SeverityBadge({
  label,
  score,
  className,
}: {
  label: SeverityLabel;
  score?: number;
  className?: string;
}) {
  const { t } = useI18n();
  const s = STYLE[label] ?? STYLE.rendah;
  const Icon = s.icon;
  const text = t(`insight.severity.${label}` as const);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap",
        s.cls,
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="sr-only">{t("insight.severity.label")}: </span>
      <span>{text}</span>
      {typeof score === "number" && <span className="font-numeric opacity-90">· {score}</span>}
    </span>
  );
}

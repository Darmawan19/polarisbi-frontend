"use client";

import { FlaskConical } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface DemoBadgeProps {
  /** Penjelasan pada atribut title; bawaan: teks umum "data contoh". */
  title?: string;
  className?: string;
}

/**
 * Badge "Demo" yang bisa dipakai ulang untuk menandai bagian yang masih memakai data contoh.
 * Memakai token chip-warn (kontras >= 4.5:1 di light dan dark) dan selalu disertai ikon + teks.
 */
export function DemoBadge({ title, className }: DemoBadgeProps) {
  const { t } = useI18n();
  const explanation = title ?? t("insight.demoTitle");
  return (
    <span
      title={explanation}
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        "bg-chip-warn text-chip-warn-fg border-chip-warn-fg/30",
        "dark:bg-chip-warn/15 dark:border-chip-warn/40",
        className
      )}
    >
      <FlaskConical className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{t("insight.demo")}</span>
      <span className="sr-only">: {explanation}</span>
    </span>
  );
}

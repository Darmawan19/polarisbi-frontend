"use client";

import { Mountain, HeartPulse, TrendingUp, Scale, ShieldCheck, Tag, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { InsightCategory } from "@/lib/insight/types";
import { cn } from "@/lib/utils";

export const CATEGORY_ICON: Record<InsightCategory, LucideIcon> = {
  bencana_alam: Mountain,
  kesehatan_wabah: HeartPulse,
  ekonomi_makro: TrendingUp,
  regulasi: Scale,
  industri_asuransi: ShieldCheck,
  lainnya: Tag,
};

export function CategoryBadge({ category, className }: { category: InsightCategory; className?: string }) {
  const { t } = useI18n();
  const Icon = CATEGORY_ICON[category] ?? Tag;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-foreground/85 whitespace-nowrap",
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
      {t(`insight.category.${category}` as const)}
    </span>
  );
}

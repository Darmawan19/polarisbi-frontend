"use client";

import { Scale } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

/**
 * Atribusi seluruh sumber aktif (unik). Kewajiban lisensi sumber data — JANGAN dihilangkan.
 */
export function InsightFooter({ attributions }: { attributions: string[] }) {
  const { t } = useI18n();
  return (
    <footer aria-labelledby="insight-footer-title" className="rounded-lg border border-border bg-card px-4 py-3">
      <h2
        id="insight-footer-title"
        className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        <Scale className="h-3 w-3" aria-hidden="true" />
        {t("insight.footer.title")}
      </h2>
      {attributions.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">{t("insight.footer.empty")}</p>
      ) : (
        <ul className="space-y-0.5 text-[11px] text-foreground/85">
          {attributions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[10px] text-muted-foreground">{t("insight.footer.timezone")}</p>
    </footer>
  );
}

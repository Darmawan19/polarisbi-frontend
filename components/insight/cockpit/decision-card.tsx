"use client";

import { useId, useState } from "react";
import {
  CalendarClock,
  Check,
  CircleX,
  Eye,
  FileText,
  Gavel,
  Gauge,
  LoaderCircle,
  TrendingUp,
  UserRound,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { DemoBadge } from "@/components/common/demo-badge";
import { useI18n } from "@/lib/i18n/context";
import { formatDateTime, formatRelativeTime } from "@/lib/insight/format";
import {
  DECISION_STATUSES,
  type Decision,
  type DecisionLevel,
  type DecisionStatus,
  type OverviewProduct,
} from "@/lib/insight/overview";
import type { ApiError } from "@/lib/api";
import { useNow } from "@/hooks/use-insight";
import { EmphasizeNumbers, LEVEL_STYLE } from "./level";
import { cn } from "@/lib/utils";

const DECISION_STYLE: Record<DecisionLevel, { icon: LucideIcon; chip: string; accent: string }> = {
  perlu_keputusan: {
    icon: Gavel,
    chip: "border-sev-critical-fg/35 bg-sev-critical text-sev-critical-fg",
    accent: "border-l-sev-critical-fg",
  },
  pantau: {
    icon: Eye,
    chip: "border-sev-medium-fg/30 bg-sev-medium text-sev-medium-fg",
    accent: "border-l-sev-medium-fg",
  },
};

/** Penanda level keputusan: ikon + teks huruf kapital (tidak hanya warna). */
export function DecisionLevelMark({ level, className }: { level: DecisionLevel; className?: string }) {
  const { t } = useI18n();
  const s = DECISION_STYLE[level];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
        s.chip,
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {t(`cockpit.decision.level.${level}` as const)}
    </span>
  );
}

function MetaChip({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] text-foreground/90">
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">{label}: </span>
      {value}
    </span>
  );
}

function ProductChips({ codes, products }: { codes: string[]; products: Map<string, OverviewProduct> }) {
  const { t } = useI18n();
  if (codes.length === 0) return null;
  return (
    <ul aria-label={t("cockpit.decision.products")} className="flex flex-wrap gap-1">
      {codes.map((code) => {
        const p = products.get(code);
        if (!p) {
          return (
            <li key={code} className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
              {code}
            </li>
          );
        }
        const st = LEVEL_STYLE[p.level];
        const Icon = st.icon;
        const label = t("cockpit.decision.productChip", {
          name: p.name,
          score: p.score,
          level: t(`cockpit.level.${p.level}` as const),
        });
        return (
          <li
            key={code}
            title={label}
            className={cn("inline-flex max-w-full items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium", st.chip)}
          >
            <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="sr-only">{label}</span>
            <span aria-hidden="true" className="truncate">
              {p.name}
            </span>
            <span aria-hidden="true" className="font-numeric font-semibold">
              {p.score}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

type SaveState = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; forbidden: boolean };

function StatusControl({
  decision,
  canEdit,
  onUpdateStatus,
}: {
  decision: Decision;
  canEdit: boolean;
  onUpdateStatus: (key: string, status: DecisionStatus) => Promise<ApiError | null>;
}) {
  const { t, lang } = useI18n();
  const now = useNow();
  const id = useId();
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  const change = async (status: DecisionStatus) => {
    setSave({ kind: "saving" });
    const err = await onUpdateStatus(decision.key, status);
    setSave(err ? { kind: "error", forbidden: err.status === 403 } : { kind: "saved" });
  };

  const meta = decision.status_updated_at ? (
    <span className="text-[11px] text-muted-foreground">
      <time dateTime={decision.status_updated_at} title={formatDateTime(decision.status_updated_at, lang)}>
        {formatRelativeTime(decision.status_updated_at, lang, now || undefined)}
      </time>
      {decision.status_updated_by && <> · {t("cockpit.decision.statusBy", { by: decision.status_updated_by })}</>}
    </span>
  ) : null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {canEdit ? (
        <>
          <label htmlFor={id} className="sr-only">
            {t("cockpit.decision.statusLabel", { title: decision.title })}
          </label>
          <span aria-hidden="true" className="text-[11px] font-medium text-muted-foreground">
            {t("cockpit.decision.status")}
          </span>
          <select
            id={id}
            value={decision.status}
            disabled={save.kind === "saving"}
            onChange={(e) => void change(e.target.value as DecisionStatus)}
            className="min-h-7 rounded-md border border-input bg-card px-2 py-0.5 text-[12px] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {DECISION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`cockpit.status.${s}` as const)}
              </option>
            ))}
          </select>
        </>
      ) : (
        <span className="text-[12px] text-foreground">
          <span className="text-muted-foreground">{t("cockpit.decision.status")}: </span>
          <span className="font-medium">{t(`cockpit.status.${decision.status}` as const)}</span>
        </span>
      )}
      {meta}
      <span role="status" aria-live="polite" className="text-[11px]">
        {save.kind === "saving" && (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <LoaderCircle className="h-3 w-3 motion-safe:animate-spin" aria-hidden="true" />
            {t("cockpit.decision.statusSaving")}
          </span>
        )}
        {save.kind === "saved" && (
          <span className="inline-flex items-center gap-1 text-chip-up-fg">
            <Check className="h-3 w-3" aria-hidden="true" />
            {t("cockpit.decision.statusSaved")}
          </span>
        )}
        {save.kind === "error" && (
          <span className="inline-flex items-center gap-1 text-chip-down-fg">
            <CircleX className="h-3 w-3" aria-hidden="true" />
            {save.forbidden ? t("cockpit.decision.statusForbidden") : t("cockpit.decision.statusError")}
          </span>
        )}
      </span>
    </div>
  );
}

export function DecisionCard({
  decision: d,
  variant,
  products,
  canEdit,
  demo,
  onUpdateStatus,
  onOpenEvidence,
}: {
  decision: Decision;
  variant: "primary" | "compact";
  products: Map<string, OverviewProduct>;
  canEdit: boolean;
  demo: boolean;
  onUpdateStatus: (key: string, status: DecisionStatus) => Promise<ApiError | null>;
  onOpenEvidence: (key: string) => void;
}) {
  const { t } = useI18n();
  const primary = variant === "primary";
  const titleId = useId();
  const spike = d.flags.some((f) => f.toLowerCase() === "lonjakan");

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "relative flex min-w-0 flex-col rounded-lg border border-border border-l-4 bg-card",
        DECISION_STYLE[d.level].accent,
        primary ? "gap-3 p-4" : "gap-2 px-3 py-2.5"
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <DecisionLevelMark level={d.level} />
        {spike && (
          <span className="inline-flex items-center gap-1 rounded border border-sev-high-fg/30 bg-sev-high px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sev-high-fg">
            <TrendingUp className="h-3 w-3 shrink-0" aria-hidden="true" />
            {t("cockpit.decision.flag.lonjakan")}
          </span>
        )}
        {demo && <DemoBadge title={t("cockpit.demoTitle")} />}
      </div>

      <h3
        id={titleId}
        className={cn(
          "font-semibold leading-snug tracking-tight text-foreground",
          primary ? "text-[18px]" : "line-clamp-2 text-[14px]"
        )}
      >
        {d.title}
      </h3>

      {d.why && (
        <p className={cn("text-muted-foreground", primary ? "text-[13px] leading-relaxed" : "line-clamp-2 text-[12px]")}>
          <span className="font-semibold text-foreground">{t("cockpit.decision.why")}: </span>
          <EmphasizeNumbers text={d.why} />
        </p>
      )}

      {primary && d.actions.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("cockpit.decision.actions")}
          </p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-[13px] text-foreground marker:text-muted-foreground">
            {d.actions.slice(0, 3).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1">
        {d.owner && <MetaChip icon={UserRound} label={t("cockpit.decision.owner")} value={d.owner} />}
        {d.horizon && <MetaChip icon={CalendarClock} label={t("cockpit.decision.horizon")} value={d.horizon} />}
        <MetaChip
          icon={Gauge}
          label={t("cockpit.decision.confidence")}
          value={t(`cockpit.decision.confidence.${d.confidence}` as const)}
        />
      </div>

      <ProductChips codes={d.product_codes} products={products} />

      {d.is_draft && (
        <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <WandSparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
          {t("cockpit.decision.draft")}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
        <StatusControl decision={d} canEdit={canEdit} onUpdateStatus={onUpdateStatus} />
        <button
          type="button"
          onClick={() => onOpenEvidence(d.key)}
          aria-label={t("cockpit.decision.evidenceLabel", { n: d.evidence.length, title: d.title })}
          className="inline-flex min-h-7 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {t("cockpit.decision.evidence", { n: d.evidence.length })}
        </button>
      </div>
    </article>
  );
}

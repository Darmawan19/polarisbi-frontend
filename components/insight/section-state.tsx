"use client";

import type { ReactNode } from "react";
import { CircleX, RotateCcw, Inbox } from "lucide-react";
import type { ApiError } from "@/lib/api";
import type { DictKey } from "@/lib/i18n/dictionary";
import { useI18n } from "@/lib/i18n/context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Pesan ramah untuk error API; `fallbackKey` dipakai untuk error umum per bagian. */
export function useErrorMessage() {
  const { t } = useI18n();
  return (err: ApiError | null, fallbackKey: DictKey): string => {
    if (!err) return t(fallbackKey);
    if (err.status === 0) return t("insight.err.network");
    if (err.status === 403) return t("insight.err.forbidden");
    return t(fallbackKey);
  };
}

export function SectionError({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-2 rounded-md border border-chip-down-fg/25 bg-chip-down/60 px-3 py-2.5 text-[12px] text-chip-down-fg dark:bg-chip-down/10",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <CircleX className="h-4 w-4 shrink-0 mt-px" aria-hidden="true" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          {t("insight.retry")}
        </button>
      )}
    </div>
  );
}

export function SectionEmpty({
  title,
  children,
  icon,
  className,
}: {
  title: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-8 text-center",
        className
      )}
    >
      <div className="text-muted-foreground" aria-hidden="true">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <p className="text-[13px] font-medium text-foreground">{title}</p>
      {children && <div className="text-[12px] text-muted-foreground max-w-sm">{children}</div>}
    </div>
  );
}

export function SectionSkeleton({ lines = 4, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-3.5", i === 0 ? "w-2/5" : i % 3 === 2 ? "w-3/5" : "w-full")} />
      ))}
    </div>
  );
}

/** Kerangka kartu bagian (judul + aksi + isi) dengan gaya terminal yang padat. */
export function SectionCard({
  id,
  title,
  titleAddon,
  meta,
  action,
  children,
  busy,
  className,
  bodyClassName,
}: {
  id: string;
  title: string;
  titleAddon?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  busy?: boolean;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      aria-busy={busy || undefined}
      className={cn("rounded-lg border border-border bg-card", className)}
    >
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={`${id}-title`} className="text-[13px] font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {titleAddon}
          </div>
          {meta && <div className="mt-1 text-[11px] text-muted-foreground">{meta}</div>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </header>
      <div className={cn("px-4 py-3", bodyClassName)}>{children}</div>
    </section>
  );
}

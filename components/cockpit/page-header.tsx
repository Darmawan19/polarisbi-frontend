"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  breadcrumb?: BreadcrumbItem[];
}

/**
 * Judul halaman ringkas di dalam area konten. Sidebar + header atas berasal dari
 * kerangka app/(app)/layout.tsx, jadi tidak ada lagi tombol kembali ke dashboard.
 */
export function PageHeader({
  title,
  description,
  badge,
  icon,
  action,
  className,
  breadcrumb,
}: PageHeaderProps) {
  const { t } = useI18n();
  const allCrumbs: BreadcrumbItem[] = breadcrumb
    ? [{ label: t("navIndustryPulse"), href: "/" }, ...breadcrumb]
    : [];

  return (
    <div className={cn("border-b border-border/60 px-8 pt-5 pb-4 shrink-0", className)}>
      {allCrumbs.length > 0 && (
        <nav aria-label={t("breadcrumbLabel")} className="mb-2">
          <ol className="flex flex-wrap items-center gap-1 font-mono text-[11px] tracking-wider text-muted-foreground dark:text-foreground/70">
            {allCrumbs.map((crumb, i) => {
              const isLast = i === allCrumbs.length - 1;
              return (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />}
                  {!isLast && crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded-sm hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined}>{crumb.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {icon && (
            <div
              className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary [&_svg]:h-4 [&_svg]:w-4"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
              {badge && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-[13px] text-muted-foreground dark:text-foreground/70 mt-0.5 max-w-2xl">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
      </div>
    </div>
  );
}

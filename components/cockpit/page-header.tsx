"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
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
  showBackButton?: boolean;
}

export function PageHeader({
  title,
  description,
  badge,
  icon,
  action,
  className,
  breadcrumb,
  showBackButton = true,
}: PageHeaderProps) {
  const allCrumbs: BreadcrumbItem[] = breadcrumb
    ? [{ label: "Industry Pulse", href: "/" }, ...breadcrumb]
    : [];

  return (
    <div className={cn("border-b border-border/40 px-8 py-6", className)}>
      {allCrumbs.length > 0 && (
        <div className="flex items-center gap-1 mb-3 font-mono text-xs tracking-wider text-muted-foreground">
          {allCrumbs.map((crumb, i) => {
            const isLast = i === allCrumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
                {!isLast && crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-muted-foreground/60" : "hover:text-foreground transition-colors"}>
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="h-10 w-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
              {badge && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-[13px] text-muted-foreground mt-1 max-w-2xl">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showBackButton && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition px-2.5 py-1.5 rounded-md hover:bg-accent/50 border border-border/40 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          )}
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}

"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, badge, icon, action, className }: PageHeaderProps) {
  return (
    <div className={cn("border-b border-border/40 px-8 py-6", className)}>
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
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

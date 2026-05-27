"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface RelatedLink {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

interface RelatedPagesProps {
  links: RelatedLink[];
}

export function RelatedPages({ links }: RelatedPagesProps) {
  return (
    <div>
      <div className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-3">
        Related
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative border border-border/40 rounded-lg p-4 hover:border-cyan-500/30 hover:bg-cyan-500/[0.02] transition block"
          >
            <div className="flex items-center gap-2">
              <link.icon className="h-4 w-4 text-cyan-500 shrink-0" />
              <span className="text-sm font-medium text-foreground">{link.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{link.description}</p>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 absolute top-4 right-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}

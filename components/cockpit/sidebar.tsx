"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Clock,
  BookOpen,
  Database,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/common/brand";

const sections = [
  {
    label: "Workspace",
    items: [
      { label: "Ask AI", icon: MessageSquare, href: "/" },
      { label: "Query History", icon: Clock, href: "/history" },
    ],
  },
  {
    label: "Knowledge",
    items: [
      { label: "KPI Glossary", icon: BookOpen, href: "/glossary" },
      { label: "Data Schema", icon: Database, href: "/schema" },
    ],
  },
  {
    label: "Sources",
    items: [
      { label: "OJK Statistics", icon: FileText, href: "/sources/ojk" },
      { label: "AAJI Press", icon: FileText, href: "/sources/aaji" },
      { label: "BRI Life Reports", icon: FileText, href: "/sources/brilife" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] border-r border-border bg-card/30 flex flex-col h-screen">
      <div className="h-12 flex items-center px-4 border-b border-border">
        <Brand />
      </div>

      <nav className="flex-1 px-2 py-4 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-2 mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors duration-150",
                      isActive
                        ? "bg-accent/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors duration-150"
        >
          <Settings className="h-3.5 w-3.5 shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}

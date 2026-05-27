"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Clock,
  BookOpen,
  Database,
  FileText,
  Settings,
  ChevronsUpDown,
  Home,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "Overview",
    items: [
      { label: "Industry Pulse", icon: Home, href: "/" },
      { label: "Ask AI", icon: Sparkles, href: "/ask", shortcut: "⌘K" },
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
      { label: "OJK Statistics", icon: FileText, href: "/sources/ojk", badge: "60" },
      { label: "AAJI Press", icon: FileText, href: "/sources/aaji", badge: "12" },
      { label: "BRI Life Reports", icon: FileText, href: "/sources/brilife", badge: "8" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] border-r border-border bg-sidebar flex flex-col h-screen shrink-0">
      {/* Workspace switcher top */}
      <div className="h-[60px] flex items-center px-3 border-b border-border">
        <button
          className={cn(
            "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md",
            "hover:bg-sidebar-accent transition-colors group"
          )}
        >
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#0070f3] to-[#7928ca] flex items-center justify-center shrink-0">
            <TrendingUp className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[13px] font-semibold text-foreground truncate">
              PolarisBI
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              Insurance Analytics
            </div>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-muted-foreground shrink-0" />
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-2 py-3 space-y-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
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
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors group",
                      isActive
                        ? "bg-sidebar-accent text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isActive && "text-[#0070f3]"
                    )} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {"shortcut" in item && item.shortcut && (
                      <kbd className="hidden group-hover:inline-flex px-1.5 py-0.5 text-[9px] font-mono bg-muted/60 border border-border/60 rounded text-muted-foreground">
                        {item.shortcut}
                      </kbd>
                    )}
                    {"badge" in item && item.badge && (
                      <span className="text-[10px] text-muted-foreground/70 tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: user + settings */}
      <div className="border-t border-border p-2 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors",
            "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
          )}
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-sidebar-accent/60 cursor-pointer transition-colors">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#7928ca] to-[#ff0080] flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
            D
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-foreground truncate">Darmawan</div>
            <div className="text-[10px] text-muted-foreground truncate">Analyst</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

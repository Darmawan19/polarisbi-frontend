"use client";

import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const sections = [
    {
      label: t("sectionOverview"),
      items: [
        { label: t("navIndustryPulse"), icon: Home, href: "/" },
        { label: t("navAskAI"), icon: Sparkles, href: "/ask", shortcut: "⌘K" },
        { label: t("navQueryHistory"), icon: Clock, href: "/history" },
      ],
    },
    {
      label: t("sectionKnowledge"),
      items: [
        { label: t("navKpiGlossary"), icon: BookOpen, href: "/glossary" },
        { label: t("navDataSchema"), icon: Database, href: "/schema" },
      ],
    },
    {
      label: t("sectionSources"),
      items: [
        { label: t("navOjkStatistics"), icon: FileText, href: "/sources/ojk", badge: "60" },
        { label: t("navAajiPress"), icon: FileText, href: "/sources/aaji", badge: "12" },
        { label: t("navBriLifeReports"), icon: FileText, href: "/sources/brilife", badge: "8" },
      ],
    },
  ];

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
          <div className="h-7 w-7 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-border/40">
            <Image
              src="/logo.png"
              alt="PolarisBI"
              width={28}
              height={28}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[13px] font-semibold text-foreground truncate">
              {t("workspaceName")}
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              {t("workspaceTagline")}
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
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive && "text-primary")} />
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
          <span>{t("navSettings")}</span>
        </Link>
        <div className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-sidebar-accent/60 cursor-pointer transition-colors">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#10b981] flex items-center justify-center text-[10px] font-semibold text-[#0a0a0c] shrink-0">
            D
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-foreground truncate">Darmawan</div>
            <div className="text-[10px] text-muted-foreground truncate">{t("navAnalystRole")}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

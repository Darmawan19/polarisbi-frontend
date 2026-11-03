"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, Calendar } from "lucide-react";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { GenerateReport } from "@/components/cockpit/generate-report";
import { useI18n } from "@/lib/i18n/context";
import type { DictKey } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

/** Label chip halaman di header, per route (URL sama dengan item sidebar). */
const PAGE_LABEL: Record<string, DictKey> = {
  "/": "headerSectionLabel",
  "/ask-ai": "navAskAI",
  "/insight": "insight.nav",
  "/query-history": "navQueryHistory",
  "/kpi-glossary": "navKpiGlossary",
  "/data-schema": "navDataSchema",
  "/sources/ojk-statistics": "navOjkStatistics",
  "/sources/aaji-press": "navAajiPress",
  "/sources/bri-life-reports": "navBriLifeReports",
  "/settings": "navSettings",
  "/profile": "navProfile",
};

function pageLabelKey(pathname: string): DictKey {
  if (PAGE_LABEL[pathname]) return PAGE_LABEL[pathname];
  const match = Object.keys(PAGE_LABEL)
    .filter((href) => href !== "/" && pathname.startsWith(href + "/"))
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_LABEL[match] : "headerSectionLabel";
}

export function Header({ menuButton }: { menuButton?: ReactNode }) {
  const [isMac, setIsMac] = useState(false);
  const [time, setTime] = useState("");
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  // Command palette + panel hasil hanya terpasang di dashboard (state milik dashboard)
  const onDashboard = pathname === "/";

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes("mac"));

    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Di luar dashboard, ⌘K / Ctrl+K membuka halaman Ask AI
  useEffect(() => {
    if (onDashboard) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (pathname !== "/ask-ai") router.push("/ask-ai");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onDashboard, pathname, router]);

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: !isMac,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  const askClass = cn(
    "flex items-center gap-2 h-8 px-3 rounded-md",
    "border border-border bg-card hover:bg-muted/40",
    "text-[12px] text-muted-foreground hover:text-foreground transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  );
  const askContent = (
    <>
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      <span>{t("headerAskPlaceholder")}</span>
      <kbd className="ml-6 px-1.5 py-0.5 rounded text-[10px] bg-transparent dark:bg-muted/60 border border-border font-mono">
        {isMac ? "⌘K" : "Ctrl+K"}
      </kbd>
    </>
  );

  return (
    // on-header: blue (Nusantara) bar in day mode, unchanged in night mode
    <header className="on-header h-[60px] border-b border-border bg-header flex items-center justify-between px-6 shrink-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-1.5 focus:text-[12px] focus:text-foreground focus:ring-2 focus:ring-ring"
      >
        {t("skipToContent")}
      </a>

      <div className="flex items-center gap-4 min-w-0">
        {/* Hamburger + merek (blok merek sidebar tersembunyi saat panel tertutup) */}
        <div className="flex items-center gap-2 shrink-0">
          {menuButton}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="h-6 w-6 rounded-md bg-white flex items-center justify-center overflow-hidden ring-1 ring-border/40">
              <Image src="/logo.png" alt="" width={24} height={24} className="h-full w-full object-cover" />
            </span>
            <span className="text-[13px] font-semibold text-foreground">{t("workspaceName")}</span>
          </Link>
        </div>

        <div className="h-4 w-px bg-border" aria-hidden="true" />

        {/* Section context */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span className="sr-only">{t("headerCurrentPage")}: </span>
          <span className="text-[13px] font-semibold text-foreground truncate" aria-live="polite">
            {t(pageLabelKey(pathname))}
          </span>
          {onDashboard && (
            <>
              <span className="text-[12px] text-muted-foreground" aria-hidden="true">·</span>
              <span className="text-[12px] text-muted-foreground tabular-nums">
                {t("headerYear")}
              </span>
            </>
          )}
        </div>

        {/* Date range — hanya untuk dashboard */}
        {onDashboard && (
          <>
            <div className="h-4 w-px bg-border" />
            <button className="flex items-center gap-2 h-7 px-2.5 rounded-md hover:bg-muted/40 transition-colors">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[12px] text-foreground tabular-nums">
                {t("headerDateRange")}
              </span>
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Ask AI: palette di dashboard, halaman Ask AI di tempat lain */}
        {onDashboard ? (
          <button type="button" onClick={triggerCommandPalette} className={askClass}>
            {askContent}
          </button>
        ) : (
          <Link href="/ask-ai" className={askClass}>
            {askContent}
          </Link>
        )}

        <GenerateReport />

        <div className="h-4 w-px bg-border" />

        {/* Live time */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-muted-foreground tabular-nums">
            {time}
          </div>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

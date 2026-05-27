"use client";

import { useEffect, useState } from "react";
import { Sparkles, Calendar } from "lucide-react";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMac, setIsMac] = useState(false);
  const [time, setTime] = useState("");
  const { t } = useI18n();

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

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: !isMac,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="h-[60px] border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {/* Section context */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[13px] font-semibold text-foreground">
            {t("headerSectionLabel")}
          </span>
          <span className="text-[12px] text-muted-foreground">·</span>
          <span className="text-[12px] text-muted-foreground tabular-nums">
            {t("headerYear")}
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        {/* Date range */}
        <button className="flex items-center gap-2 h-7 px-2.5 rounded-md hover:bg-muted/40 transition-colors">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[12px] text-foreground tabular-nums">
            {t("headerDateRange")}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Ask AI command */}
        <button
          onClick={triggerCommandPalette}
          className={cn(
            "flex items-center gap-2 h-8 px-3 rounded-md",
            "border border-border bg-card hover:bg-muted/40",
            "text-[12px] text-muted-foreground hover:text-foreground transition-all"
          )}
        >
          <Sparkles className="h-3 w-3" />
          <span>{t("headerAskPlaceholder")}</span>
          <kbd className="ml-6 px-1.5 py-0.5 rounded text-[10px] bg-muted/60 border border-border font-mono">
            {isMac ? "⌘K" : "Ctrl+K"}
          </kbd>
        </button>

        <div className="h-4 w-px bg-border" />

        {/* Live time */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-muted-foreground tabular-nums">
            {time}
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

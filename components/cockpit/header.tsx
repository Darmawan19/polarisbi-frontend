"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { cn } from "@/lib/utils";

export function Header({ title }: { title?: string }) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes("mac"));
  }, []);

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="h-12 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {title && (
          <span className="text-[13px] font-medium text-muted-foreground">
            {title}
          </span>
        )}
        <button
          onClick={triggerCommandPalette}
          className={cn(
            "flex items-center gap-2 h-7 px-3 rounded-md",
            "border border-border/60 bg-card/40 hover:bg-card/70",
            "text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          )}
        >
          <Sparkles className="h-3 w-3" />
          <span>Ask anything about your data...</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded text-[10px] bg-muted/40 border border-border/40 font-mono">
            {isMac ? "⌘K" : "Ctrl+K"}
          </kbd>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
      </div>
    </header>
  );
}

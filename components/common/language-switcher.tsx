"use client";

import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5">
      <button
        onClick={() => setLang("en")}
        className={cn(
          "h-5 px-2 text-[10px] font-semibold tracking-wide rounded transition-all",
          lang === "en"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLang("id")}
        className={cn(
          "h-5 px-2 text-[10px] font-semibold tracking-wide rounded transition-all",
          lang === "id"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ID
      </button>
    </div>
  );
}

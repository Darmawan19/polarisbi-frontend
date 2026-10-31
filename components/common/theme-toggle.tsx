"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Day / night switch. Both icons are rendered and swapped with the `dark:`
 * variant, so there is no hydration mismatch and no icon flicker on load.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { lang } = useI18n();

  const label =
    lang === "id" ? "Ganti mode tampilan (terang / gelap)" : "Toggle day / night mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
        "border border-border bg-card text-muted-foreground transition-colors",
        "hover:bg-muted/40 hover:text-foreground",
        className
      )}
    >
      {/* Night mode shows the sun (= "switch to day"), day mode shows the moon */}
      <Sun className="hidden h-3.5 w-3.5 dark:block" />
      <Moon className="h-3.5 w-3.5 dark:hidden" />
    </button>
  );
}

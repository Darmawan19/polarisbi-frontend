"use client";

import { useEffect, useState } from "react";
import { Sparkles, MessageSquare } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useI18n } from "@/lib/i18n/context";

const SUGGESTED_QUESTIONS_ID = [
  "Tunjukkan tren premi BRI Life per kuartal 2024",
  "Bandingkan APE BRI Life vs Allianz per kanal distribusi",
  "Top 5 perusahaan dengan RBC tertinggi 2024Q4",
  "Rasio klaim kesehatan per perusahaan 2024",
];

const SUGGESTED_QUESTIONS_EN = [
  "Show BRI Life premium trend per quarter 2024",
  "Compare BRI Life APE vs Allianz by distribution channel",
  "Top 5 companies with highest RBC in 2024Q4",
  "Health claims ratio per company 2024",
];

interface CommandPaletteProps {
  onAsk?: (question: string, language?: string) => void;
}

export function CommandPalette({ onAsk }: CommandPaletteProps) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSubmit = (question: string) => {
    onAsk?.(question, lang);
    setOpen(false);
    setQuery("");
  };

  const suggestedQuestions = lang === "id" ? SUGGESTED_QUESTIONS_ID : SUGGESTED_QUESTIONS_EN;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput
          placeholder={t("cmdPlaceholder")}
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleSubmit(query.trim());
            }
          }}
        />
        <CommandList>
          <CommandEmpty>
            <div className="py-6 text-center text-[13px] text-muted-foreground">
              {t("cmdPressEnter")}:{" "}
              <span className="text-foreground">&ldquo;{query}&rdquo;</span>
            </div>
          </CommandEmpty>
          {query.length === 0 && (
            <>
              <CommandGroup heading={t("cmdSuggestedHeading")}>
                {suggestedQuestions.map((q) => (
                  <CommandItem
                    key={q}
                    onSelect={() => handleSubmit(q)}
                    className="text-[13px] cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                    {q}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading={t("cmdActionsHeading")}>
                <CommandItem disabled className="text-[13px]">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("cmdOpenChat")}
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {t("cmdSoon")}
                  </span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
          {query.length > 0 && (
            <CommandGroup>
              <CommandItem
                onSelect={() => handleSubmit(query)}
                className="text-[13px] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {t("cmdAsk")}:{" "}
                <span className="ml-1 text-foreground">{query}</span>
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

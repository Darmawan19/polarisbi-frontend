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

const SUGGESTED_QUESTIONS = [
  "Tunjukkan tren premi BRI Life per kuartal 2024",
  "Bandingkan APE BRI Life vs Allianz per kanal distribusi",
  "Top 5 perusahaan dengan RBC tertinggi 2024Q4",
  "Rasio klaim kesehatan per perusahaan 2024",
];

export function CommandPalette() {
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
    // TODO Chunk 4B-2: wire to FastAPI streaming
    console.log("Ask:", question);
    setOpen(false);
    setQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput
          placeholder="Ask anything about insurance data..."
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
              Press Enter to ask:{" "}
              <span className="text-foreground">&ldquo;{query}&rdquo;</span>
            </div>
          </CommandEmpty>
          {query.length === 0 && (
            <>
              <CommandGroup heading="Suggested Questions">
                {SUGGESTED_QUESTIONS.map((q) => (
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
              <CommandGroup heading="Actions">
                <CommandItem disabled className="text-[13px]">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  Open chat conversation
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    Soon
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
                Ask:{" "}
                <span className="ml-1 text-foreground">{query}</span>
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

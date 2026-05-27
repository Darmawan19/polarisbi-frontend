"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const [lang, setLang] = useState<"EN" | "ID">("EN");

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
      onClick={() => setLang(lang === "EN" ? "ID" : "EN")}
    >
      {lang}
    </Button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FileDown, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useFindingsStore } from "@/lib/stores/findings";
import { fetchReport, triggerDownload } from "@/lib/generate-report";

export function GenerateReport() {
  const [loading, setLoading] = useState(false);
  // SSR hydration guard — only read persisted findings after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const findings = useFindingsStore((s) => s.findings);
  const clear = useFindingsStore((s) => s.clear);
  const displayFindings = mounted ? findings : [];
  const selectedFindings = displayFindings.filter((f) => f.selected);

  async function download(kind: string, fmt: string) {
    setLoading(true);
    const id = toast.loading("Generating report…");
    try {
      const { blob, filename } = await fetchReport(
        kind,
        fmt,
        selectedFindings.length > 0
          ? selectedFindings.map((f) => ({ question: f.question, sql: f.sql }))
          : undefined
      );
      triggerDownload(blob, filename);
      toast.success("Report ready", { id });
    } catch (e) {
      toast.error(
        `Report failed: ${e instanceof Error ? e.message : String(e)}`,
        { id }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={loading}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-8 gap-2 text-[12px]"
        )}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <FileDown className="h-3.5 w-3.5" />
        )}
        {loading ? "Generating…" : "Generate Report"}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Deck */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-1.5">
            Deck
            {selectedFindings.length > 0 && (
              <span className="text-[10px] text-cyan-400/80 font-normal">
                from {selectedFindings.length} selected
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuItem
            disabled={loading}
            onClick={() => download("deck", "pptx")}
          >
            PowerPoint (.pptx)
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loading}
            onClick={() => download("deck", "pdf")}
          >
            PDF
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Document */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-1.5">
            Document
            {selectedFindings.length > 0 && (
              <span className="text-[10px] text-cyan-400/80 font-normal">
                from {selectedFindings.length} selected
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuItem
            disabled={loading}
            onClick={() => download("document", "docx")}
          >
            Word (.docx)
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loading}
            onClick={() => download("document", "pdf")}
          >
            PDF
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Clear — only shown when there are any findings */}
        {displayFindings.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[11px] text-muted-foreground gap-1.5"
              onClick={() => clear()}
            >
              <X className="h-3 w-3" />
              Clear {displayFindings.length} session finding
              {displayFindings.length !== 1 ? "s" : ""}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

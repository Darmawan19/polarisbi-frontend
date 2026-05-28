"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function GenerateReport() {
  const [loading, setLoading] = useState(false);

  async function download(kind: string, fmt: string) {
    setLoading(true);
    const id = toast.loading("Generating report…");
    try {
      const res = await fetch(
        `${API_URL}/api/report?kind=${kind}&fmt=${fmt}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const name =
        cd.match(/filename="?([^"]+)"?/)?.[1] ?? `PolarisBI-${kind}.${fmt}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
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
        <DropdownMenuGroup>
          <DropdownMenuLabel>Deck</DropdownMenuLabel>
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
        <DropdownMenuGroup>
          <DropdownMenuLabel>Document</DropdownMenuLabel>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

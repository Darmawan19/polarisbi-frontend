"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  Sparkles,
  BookOpen,
  Activity,
  GripVertical,
  X,
  FileDown,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { PageHeader } from "@/components/cockpit/page-header";
import { RelatedPages } from "@/components/cockpit/related-pages";
import { useFindingsStore, type Finding } from "@/lib/stores/findings";
import { fetchReport, triggerDownload } from "@/lib/generate-report";
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
import { useI18n } from "@/lib/i18n/context";

function formatRelative(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffM = Math.floor(diffMs / 60_000);
  if (diffM < 1) return "just now";
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

interface SortableRowProps {
  finding: Finding;
  onToggleSelected: () => void;
  onRemove: () => void;
  isLast: boolean;
}

function SortableRow({ finding, onToggleSelected, onRemove, isLast }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: finding.id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "border-b border-border/20 hover:bg-card/50 transition-colors",
        isDragging && "opacity-50 bg-card/80 z-50",
        isLast && "border-0"
      )}
    >
      {/* drag handle */}
      <td className="px-1.5 py-2.5 w-8">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors touch-none flex items-center justify-center"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>

      {/* checkbox */}
      <td className="px-1.5 py-2.5 w-8">
        <button
          onClick={onToggleSelected}
          className="flex items-center justify-center h-3.5 w-3.5 rounded-sm border transition-colors"
          style={
            finding.selected
              ? { background: "rgb(6 182 212 / 0.2)", borderColor: "rgb(6 182 212 / 0.6)" }
              : { borderColor: "hsl(var(--border))" }
          }
          aria-label={finding.selected ? "Remove from report" : "Add to report"}
        >
          {finding.selected && <Check className="h-2.5 w-2.5 text-cyan-400" />}
        </button>
      </td>

      {/* question + insight snippet */}
      <td className="px-3 py-2.5">
        <p className="text-[12px] text-foreground/90 leading-snug">{finding.question}</p>
        {finding.insight && (
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 max-w-[420px]">
            {finding.insight}
          </p>
        )}
      </td>

      {/* row count */}
      <td className="px-3 py-2.5 text-[11px] text-right font-numeric text-muted-foreground whitespace-nowrap">
        {finding.rowCount.toLocaleString()} rows
      </td>

      {/* relative timestamp */}
      <td className="px-3 py-2.5 text-[11px] text-right font-numeric text-muted-foreground whitespace-nowrap">
        {formatRelative(finding.timestamp)}
      </td>

      {/* delete */}
      <td className="px-1.5 py-2.5 w-8">
        <button
          onClick={onRemove}
          className="flex items-center justify-center text-muted-foreground/30 hover:text-[#f43f5e] transition-colors"
          aria-label="Remove finding"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
  );
}

export default function QueryHistoryPage() {
  const { lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const findings = useFindingsStore((s) => s.findings);
  const removeFinding = useFindingsStore((s) => s.removeFinding);
  const toggleSelected = useFindingsStore((s) => s.toggleSelected);
  const setAllSelected = useFindingsStore((s) => s.setAllSelected);
  const reorder = useFindingsStore((s) => s.reorder);
  const clear = useFindingsStore((s) => s.clear);

  const displayFindings = mounted ? findings : [];
  const selectedFindings = displayFindings.filter((f) => f.selected);

  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = displayFindings.map((f) => f.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex !== -1 && newIndex !== -1) {
      reorder(arrayMove(ids, oldIndex, newIndex));
    }
  }

  async function download(kind: string, fmt: string) {
    if (selectedFindings.length === 0) return;
    setLoading(true);
    const id = toast.loading("Generating report…");
    try {
      const { blob, filename } = await fetchReport(
        kind,
        fmt,
        selectedFindings.map((f) => ({ question: f.question, sql: f.sql }))
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

  const headerAction = (
    <div className="flex items-center gap-2">
      {displayFindings.length > 0 && (
        <>
          <button
            onClick={() => setAllSelected(true)}
            className="h-7 px-2.5 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            {lang === "id" ? "Pilih semua" : "Select all"}
          </button>
          <button
            onClick={() => setAllSelected(false)}
            className="h-7 px-2.5 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            {lang === "id" ? "Batal pilih" : "None"}
          </button>
          <div className="h-4 w-px bg-border/60" />
          <button
            onClick={() => clear()}
            className="h-7 px-2.5 rounded-md text-[11px] text-muted-foreground hover:text-[#f43f5e] hover:bg-muted/40 transition-colors"
          >
            {lang === "id" ? "Hapus semua" : "Clear all"}
          </button>
          <div className="h-4 w-px bg-border/60" />
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={loading || selectedFindings.length === 0}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-7 gap-1.5 text-[11px]"
              )}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <FileDown className="h-3 w-3" />
              )}
              {loading
                ? (lang === "id" ? "Membuat…" : "Generating…")
                : selectedFindings.length > 0
                ? `Generate (${selectedFindings.length})`
                : "Generate"}
              {!loading && <ChevronDown className="h-3 w-3 opacity-60" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
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
        </>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Riwayat Kueri" : "Query History"}
        description={
          lang === "id"
            ? "Temuan dari sesi AI saat ini. Seret untuk mengatur urutan slide laporan."
            : "Findings from the current AI session. Drag to set slide order in the report."
        }
        badge={
          displayFindings.length > 0
            ? `${selectedFindings.length}/${displayFindings.length} ${lang === "id" ? "dipilih" : "selected"}`
            : undefined
        }
        icon={<Clock className="h-5 w-5" />}
        breadcrumb={[{ label: lang === "id" ? "Riwayat Query" : "Query History" }]}
        action={headerAction}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {displayFindings.length === 0 ? (
            <div className="rounded-lg border border-border/40 bg-card/30 flex flex-col items-center justify-center py-16 text-center gap-3">
              <Sparkles className="h-8 w-8 text-muted-foreground/20" />
              <p className="text-[13px] text-muted-foreground">
                {lang === "id"
                  ? "Ajukan pertanyaan di Ask AI untuk mulai membuat laporan."
                  : "Ask a question in Ask AI to start building a report."}
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={displayFindings.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="rounded-lg border border-border/40 bg-card/30 overflow-hidden">
                  <table className="w-full">
                    <thead className="border-b border-border/40 bg-card/50">
                      <tr>
                        <th className="w-8" />
                        <th className="w-8 px-1.5 py-2.5 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {selectedFindings.length}/{displayFindings.length}
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {lang === "id" ? "Pertanyaan & Insight" : "Question & Insight"}
                        </th>
                        <th className="px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Rows
                        </th>
                        <th className="px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {lang === "id" ? "Waktu" : "Time"}
                        </th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {displayFindings.map((f, i) => (
                        <SortableRow
                          key={f.id}
                          finding={f}
                          onToggleSelected={() => toggleSelected(f.id)}
                          onRemove={() => removeFinding(f.id)}
                          isLast={i === displayFindings.length - 1}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </SortableContext>
            </DndContext>
          )}

          <hr className="my-8 border-border/40" />
          <RelatedPages
            links={[
              {
                label: "Ask AI",
                href: "/ask-ai",
                icon: Sparkles,
                description: "Start a new natural-language query",
              },
              {
                label: "KPI Glossary",
                href: "/kpi-glossary",
                icon: BookOpen,
                description: "Look up insurance metric definitions",
              },
              {
                label: "Industry Pulse",
                href: "/",
                icon: Activity,
                description: "Back to main dashboard",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

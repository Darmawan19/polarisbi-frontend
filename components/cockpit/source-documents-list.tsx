"use client";

import { useState, useMemo } from "react";
import { FileText, FileSpreadsheet, FileImage, Search, Download, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export interface SourceDocument {
  id: string;
  title: string;
  type: "pdf" | "xlsx" | "csv" | "image";
  category: string;
  sizeMB: number;
  publishedAt: string;
  status: "indexed" | "processing" | "archived";
  tags?: string[];
}

interface SourceDocumentsListProps {
  documents: SourceDocument[];
}

const TYPE_ICONS = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  image: FileImage,
};

const TYPE_COLORS = {
  pdf: "text-rose-400",
  xlsx: "text-emerald-400",
  csv: "text-sky-400",
  image: "text-amber-400",
};

export function SourceDocumentsList({ documents }: SourceDocumentsListProps) {
  const { lang } = useI18n();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      if (typeFilter !== "all" && doc.type !== typeFilter) return false;
      if (statusFilter !== "all" && doc.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return doc.title.toLowerCase().includes(q) || doc.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [documents, search, typeFilter, statusFilter]);

  const handleClick = (doc: SourceDocument) => {
    alert(
      lang === "id"
        ? `Coming soon: buka dokumen "${doc.title}"`
        : `Coming soon: open document "${doc.title}"`
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "id" ? "Cari dokumen..." : "Search documents..."}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] rounded-md border border-border/60 bg-card/30 focus:outline-none focus:border-primary/40 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="inline-flex items-center rounded-md border border-border/60 p-0.5 text-[11px]">
          {["all", "pdf", "xlsx", "csv"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "px-2.5 py-1 rounded-[3px] font-medium uppercase transition-colors",
                typeFilter === t
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "all" ? (lang === "id" ? "Semua" : "All") : t}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center rounded-md border border-border/60 p-0.5 text-[11px]">
          {["all", "indexed", "processing", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-2.5 py-1 rounded-[3px] font-medium transition-colors",
                statusFilter === s
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "all" ? (lang === "id" ? "Semua" : "All") : s}
            </button>
          ))}
        </div>
      </div>

      {/* Document table */}
      <div className="rounded-lg border border-border/40 bg-card/30 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border/40 bg-card/50">
            <tr>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground w-10" />
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {lang === "id" ? "Dokumen" : "Document"}
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {lang === "id" ? "Kategori" : "Category"}
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {lang === "id" ? "Ukuran" : "Size"}
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {lang === "id" ? "Tanggal" : "Published"}
              </th>
              <th className="px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground w-20" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => {
              const Icon = TYPE_ICONS[doc.type];
              return (
                <tr
                  key={doc.id}
                  onClick={() => handleClick(doc)}
                  className="border-b border-border/20 last:border-b-0 hover:bg-card/50 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-2.5">
                    <Icon className={cn("h-4 w-4", TYPE_COLORS[doc.type])} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="text-[12px] text-foreground font-medium leading-snug">
                      {doc.title}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] text-muted-foreground">{doc.category}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-[11px] font-numeric text-muted-foreground">
                    {doc.sizeMB.toFixed(1)} MB
                  </td>
                  <td className="px-4 py-2.5 text-[11px] font-numeric text-muted-foreground">
                    {doc.publishedAt}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider",
                        doc.status === "indexed" &&
                          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        doc.status === "processing" &&
                          "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                        doc.status === "archived" &&
                          "bg-muted/40 text-muted-foreground border border-border/40"
                      )}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-[12px] text-muted-foreground">
            {lang === "id" ? "Tidak ada dokumen ditemukan." : "No documents found."}
          </div>
        )}
      </div>

      <div className="text-[11px] text-muted-foreground text-right">
        {lang === "id"
          ? `Menampilkan ${filtered.length} dari ${documents.length} dokumen`
          : `Showing ${filtered.length} of ${documents.length} documents`}
      </div>
    </div>
  );
}

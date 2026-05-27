"use client";

import { useState } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

type Status = "complete" | "error";
type FilterType = "all" | "complete" | "error";

interface HistoryEntry {
  id: string;
  question: string;
  status: Status;
  tokens: number;
  durationMs: number;
  timestamp: string;
}

const MOCK_HISTORY: HistoryEntry[] = [
  { id: "q-020", question: "Tampilkan tren premi BRI Life per kuartal 2024", status: "complete", tokens: 1842, durationMs: 3210, timestamp: "2024-05-27 22:14" },
  { id: "q-019", question: "Bandingkan RBC top 5 perusahaan Q4 2024", status: "complete", tokens: 2104, durationMs: 4150, timestamp: "2024-05-27 21:08" },
  { id: "q-018", question: "Channel distribusi mana yang dominan?", status: "complete", tokens: 1567, durationMs: 2890, timestamp: "2024-05-27 19:42" },
  { id: "q-017", question: "Bagaimana growth YoY BRI Life vs industri?", status: "complete", tokens: 1923, durationMs: 3450, timestamp: "2024-05-27 17:21" },
  { id: "q-016", question: "Project growth premium 2025 untuk top 3", status: "error", tokens: 412, durationMs: 1820, timestamp: "2024-05-27 15:34" },
  { id: "q-015", question: "Market share evolution top 10 selama 4 kuartal", status: "complete", tokens: 2456, durationMs: 5120, timestamp: "2024-05-27 14:02" },
  { id: "q-014", question: "Detail rasio klaim Q4 2024 per kategori produk", status: "complete", tokens: 1789, durationMs: 3340, timestamp: "2024-05-27 11:47" },
  { id: "q-013", question: "Top 10 perusahaan berdasarkan premium Q4 2024", status: "complete", tokens: 1654, durationMs: 2980, timestamp: "2024-05-27 09:23" },
  { id: "q-012", question: "Bagaimana tren rasio klaim industri 2024?", status: "complete", tokens: 2089, durationMs: 4020, timestamp: "2024-05-26 22:11" },
  { id: "q-011", question: "Posisi BRI Life dibanding kompetitor bancassurance", status: "complete", tokens: 1934, durationMs: 3620, timestamp: "2024-05-26 18:55" },
  { id: "q-010", question: "Kategori klaim terbesar industri 2024", status: "complete", tokens: 1567, durationMs: 2810, timestamp: "2024-05-26 16:32" },
  { id: "q-009", question: "Tampilkan distribusi premium per channel", status: "complete", tokens: 1789, durationMs: 3210, timestamp: "2024-05-26 14:14" },
  { id: "q-008", question: "Solvency analysis lifecycle perusahaan asuransi", status: "error", tokens: 234, durationMs: 1450, timestamp: "2024-05-26 11:08" },
  { id: "q-007", question: "Net profit margin top 5 perusahaan FY2024", status: "complete", tokens: 1834, durationMs: 3540, timestamp: "2024-05-26 09:42" },
  { id: "q-006", question: "Forecast BRI Life premium Q1 2025", status: "error", tokens: 187, durationMs: 1230, timestamp: "2024-05-25 22:23" },
  { id: "q-005", question: "Compliance check RBC threshold seluruh industri", status: "complete", tokens: 2123, durationMs: 4380, timestamp: "2024-05-25 19:11" },
  { id: "q-004", question: "BRI Life market share evolution 2020-2024", status: "complete", tokens: 1989, durationMs: 3690, timestamp: "2024-05-25 16:48" },
  { id: "q-003", question: "Dominant product types per channel 2024", status: "complete", tokens: 1745, durationMs: 3120, timestamp: "2024-05-25 14:22" },
  { id: "q-002", question: "AAJI vs OJK data reconciliation summary", status: "complete", tokens: 2245, durationMs: 4670, timestamp: "2024-05-25 11:34" },
  { id: "q-001", question: "Industry premium growth FY2024 vs FY2023", status: "complete", tokens: 1856, durationMs: 3340, timestamp: "2024-05-25 09:18" },
];

export default function QueryHistoryPage() {
  const { lang } = useI18n();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = MOCK_HISTORY.filter((q) => filter === "all" || q.status === filter);

  const filterLabels: Record<FilterType, string> = {
    all: lang === "id" ? "Semua" : "All",
    complete: lang === "id" ? "Selesai" : "Complete",
    error: "Error",
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Riwayat Kueri" : "Query History"}
        description={
          lang === "id"
            ? "Riwayat lengkap pertanyaan AI dengan token usage dan durasi eksekusi."
            : "Complete history of AI queries with token usage and execution duration."
        }
        badge={`${MOCK_HISTORY.length} ${lang === "id" ? "kueri" : "queries"}`}
        icon={<Clock className="h-5 w-5" />}
        action={
          <div className="inline-flex items-center rounded-md border border-border/60 p-0.5 text-[11px]">
            {(["all", "complete", "error"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 py-1 rounded-[3px] font-medium transition-colors",
                  filter === f
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-lg border border-border/40 bg-card/30 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border/40 bg-card/50">
                <tr>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground w-10" />
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    ID
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {lang === "id" ? "Pertanyaan" : "Question"}
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Tokens
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {lang === "id" ? "Durasi" : "Duration"}
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {lang === "id" ? "Waktu" : "Timestamp"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <tr
                    key={q.id}
                    className={cn(
                      "border-b border-border/20 hover:bg-card/50 transition-colors",
                      i === filtered.length - 1 && "border-0"
                    )}
                  >
                    <td className="px-3 py-2.5">
                      {q.status === "complete" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-[#f43f5e]" />
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-[11px] font-numeric text-muted-foreground whitespace-nowrap">
                      {q.id}
                    </td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground/90 max-w-[360px]">
                      {q.question}
                    </td>
                    <td className="px-3 py-2.5 text-[12px] text-right font-numeric text-muted-foreground whitespace-nowrap">
                      {q.tokens.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-[12px] text-right font-numeric text-muted-foreground whitespace-nowrap">
                      {(q.durationMs / 1000).toFixed(2)}s
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-right font-numeric text-muted-foreground whitespace-nowrap">
                      {q.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="px-3 py-12 text-center text-[12px] text-muted-foreground">
                {lang === "id" ? "Tidak ada kueri." : "No queries found."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

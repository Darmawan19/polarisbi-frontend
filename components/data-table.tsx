"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyRow {
  rank: number;
  company: string;
  ticker: string;
  premium: number;
  marketShare: number;
  rbc: number;
  growth: number;
  channel: string;
}

const rows: CompanyRow[] = [
  { rank: 1, company: "Prudential Life Assurance", ticker: "PRU", premium: 5.89, marketShare: 16.2, rbc: 412, growth: 8.6, channel: "Agency" },
  { rank: 2, company: "Allianz Life Indonesia", ticker: "AZLI", premium: 4.65, marketShare: 12.8, rbc: 387, growth: 6.7, channel: "Agency" },
  { rank: 3, company: "Manulife Indonesia", ticker: "MFC", premium: 4.21, marketShare: 11.6, rbc: 356, growth: 5.3, channel: "Bancassurance" },
  { rank: 4, company: "AIA Financial", ticker: "AIA", premium: 3.85, marketShare: 10.6, rbc: 445, growth: 4.2, channel: "Agency" },
  { rank: 5, company: "Sequis Life", ticker: "SEQ", premium: 2.94, marketShare: 8.1, rbc: 298, growth: 3.1, channel: "Agency" },
  { rank: 6, company: "BRI Life", ticker: "BRIL", premium: 0.84, marketShare: 3.14, rbc: 435, growth: 11.0, channel: "Bancassurance" },
  { rank: 7, company: "Sinarmas MSIG Life", ticker: "SMIG", premium: 2.31, marketShare: 6.4, rbc: 267, growth: 2.8, channel: "Multi-channel" },
  { rank: 8, company: "Bumiputera 1912", ticker: "ABPU", premium: 1.87, marketShare: 5.2, rbc: 178, growth: -1.4, channel: "Agency" },
  { rank: 9, company: "Mandiri Inhealth", ticker: "MNHI", premium: 1.62, marketShare: 4.5, rbc: 312, growth: 7.2, channel: "Bancassurance" },
  { rank: 10, company: "Cigna Indonesia", ticker: "CIGNA", premium: 1.18, marketShare: 3.3, rbc: 289, growth: 1.9, channel: "Digital" },
];

const channelColors: Record<string, string> = {
  Agency: "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/20",
  Bancassurance: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20",
  "Multi-channel": "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20",
  Digital: "text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/20",
};

function RBCIndicator({ value }: { value: number }) {
  const color =
    value >= 400
      ? "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20"
      : value >= 300
      ? "text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/20"
      : value >= 200
      ? "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20"
      : "text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/20";
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded text-[11px] font-medium font-numeric border", color)}>
      {value}%
    </span>
  );
}

type SortKey = keyof CompanyRow;

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  onSort,
  align = "right",
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey | null;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors",
        align === "right" && "ml-auto"
      )}
    >
      {label}
      <ArrowUpDown
        className={cn(
          "h-3 w-3",
          current === sortKey ? "text-primary" : "text-muted-foreground/40"
        )}
      />
    </button>
  );
}

export function DataTable() {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>("rank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    let result = rows.filter(
      (r) =>
        r.company.toLowerCase().includes(filter.toLowerCase()) ||
        r.ticker.toLowerCase().includes(filter.toLowerCase())
    );
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [filter, sortKey, sortDir]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div>
          <span className="text-[13px] font-semibold text-foreground tracking-tight">
            Top 10 Perusahaan Asuransi Jiwa
          </span>
          <span className="ml-2 text-[11px] text-muted-foreground">Q4 2024 · OJK</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Filter..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-7 w-36 pl-8 pr-3 rounded-md bg-card border border-border/60 text-[12px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/60">
              <th className="px-4 py-2.5 text-left w-8">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">#</span>
              </th>
              <th className="px-4 py-2.5 text-left">
                <SortHeader label="Company" sortKey="company" current={sortKey} dir={sortDir} onSort={handleSort} align="left" />
              </th>
              <th className="px-4 py-2.5 text-right">
                <SortHeader label="Premium (Rp T)" sortKey="premium" current={sortKey} dir={sortDir} onSort={handleSort} />
              </th>
              <th className="px-4 py-2.5 text-right">
                <SortHeader label="Mkt Share" sortKey="marketShare" current={sortKey} dir={sortDir} onSort={handleSort} />
              </th>
              <th className="px-4 py-2.5 text-right">
                <SortHeader label="RBC" sortKey="rbc" current={sortKey} dir={sortDir} onSort={handleSort} />
              </th>
              <th className="px-4 py-2.5 text-right">
                <SortHeader label="Growth YoY" sortKey="growth" current={sortKey} dir={sortDir} onSort={handleSort} />
              </th>
              <th className="px-4 py-2.5 text-left">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Channel</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const isBRI = row.ticker === "BRIL";
              return (
                <tr
                  key={row.rank}
                  className={cn(
                    "border-b border-border/40 hover:bg-muted/20 transition-colors group",
                    isBRI && "bg-primary/5 border-l-2 border-l-primary/50"
                  )}
                >
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-numeric text-muted-foreground/60">{row.rank}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isBRI && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                      <div>
                        <div className={cn("text-[13px]", isBRI ? "font-semibold text-foreground" : "text-foreground")}>
                          {row.company}
                        </div>
                        <div className="text-[11px] font-numeric text-muted-foreground/60">{row.ticker}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[13px] font-numeric text-foreground">{row.premium.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[13px] font-numeric text-foreground">{row.marketShare.toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RBCIndicator value={row.rbc} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {row.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-[#10b981]" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-[#f43f5e]" />
                      )}
                      <span className={cn("text-[13px] font-numeric", row.growth >= 0 ? "text-[#10b981]" : "text-[#f43f5e]")}>
                        {row.growth >= 0 ? "+" : ""}{row.growth.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border", channelColors[row.channel] ?? "text-muted-foreground bg-muted/20 border-border/40")}>
                      {row.channel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-border/60">
        <span className="text-[11px] text-muted-foreground/60">
          {filtered.length} of {rows.length} companies
        </span>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const data = [
  { quarter: "Q1 2024", "BRI Life": 0.83, Prudential: 5.42, Allianz: 4.12, Manulife: 3.78, AIA: 3.45 },
  { quarter: "Q2 2024", "BRI Life": 0.92, Prudential: 5.68, Allianz: 4.35, Manulife: 3.91, AIA: 3.62 },
  { quarter: "Q3 2024", "BRI Life": 0.83, Prudential: 5.51, Allianz: 4.48, Manulife: 4.02, AIA: 3.71 },
  { quarter: "Q4 2024", "BRI Life": 0.84, Prudential: 5.89, Allianz: 4.65, Manulife: 4.21, AIA: 3.85 },
];

const companies = [
  { name: "BRI Life", color: "#00d4ff", isHighlight: true },
  { name: "Prudential", color: "#a855f7", isHighlight: false },
  { name: "Allianz", color: "#f59e0b", isHighlight: false },
  { name: "Manulife", color: "#10b981", isHighlight: false },
  { name: "AIA", color: "#f43f5e", isHighlight: false },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl min-w-[180px]">
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="space-y-1.5">
        {[...payload].sort((a, b) => b.value - a.value).map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-3 text-[12px]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-foreground">{entry.name}</span>
            </div>
            <span className="font-numeric text-foreground">Rp {entry.value.toFixed(2)} T</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartAreaInteractive() {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground tracking-tight">
            Tren Premi Bruto · 5 Perusahaan Terbesar
          </h3>
          <p className="text-[12px] text-muted-foreground mt-1">
            Per kuartal 2024 · dalam triliun Rupiah · sumber AAJI
          </p>
        </div>
        <div className="flex items-center gap-1">
          {companies.map((c) => (
            <button
              key={c.name}
              onMouseEnter={() => setActiveCompany(c.name)}
              onMouseLeave={() => setActiveCompany(null)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] transition-all hover:bg-muted/40",
                activeCompany && activeCompany !== c.name && "opacity-40"
              )}
            >
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span className={cn("text-foreground", c.isHighlight && "font-semibold")}>
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {companies.map((c) => (
                <linearGradient key={c.name} id={`grad-${c.name.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.color} stopOpacity={c.isHighlight ? 0.4 : 0.15} />
                  <stop offset="100%" stopColor={c.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#1f1f25" vertical={false} />
            <XAxis
              dataKey="quarter"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fontFamily: "var(--font-jetbrains-mono)" }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fontFamily: "var(--font-jetbrains-mono)" }}
              tickFormatter={(v) => `${v.toFixed(1)}T`}
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#27272a", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            {companies.map((c) => (
              <Area
                key={c.name}
                type="monotone"
                dataKey={c.name}
                stroke={c.color}
                strokeWidth={c.isHighlight ? 2 : 1.5}
                fill={`url(#grad-${c.name.replace(/\s/g, "")})`}
                opacity={activeCompany === null ? 1 : activeCompany === c.name ? 1 : 0.25}
                dot={c.isHighlight ? { r: 3, fill: c.color, strokeWidth: 0 } : false}
                activeDot={{ r: 4, fill: c.color, strokeWidth: 2, stroke: "#0a0a0c" }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

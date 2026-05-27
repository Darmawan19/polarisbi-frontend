"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const chartData = [
  { quarter: "Q1", briLife: 2.0, prudential: 5.5, allianz: 4.2, manulife: 3.8, aia: 3.5 },
  { quarter: "Q2", briLife: 2.2, prudential: 5.8, allianz: 4.4, manulife: 3.9, aia: 3.6 },
  { quarter: "Q3", briLife: 2.3, prudential: 5.6, allianz: 4.5, manulife: 4.0, aia: 3.7 },
  { quarter: "Q4", briLife: 2.4, prudential: 6.0, allianz: 4.7, manulife: 4.2, aia: 3.9 },
];

const series = [
  { key: "briLife",    label: "BRI Life",   color: "var(--chart-1)" },
  { key: "prudential", label: "Prudential", color: "var(--chart-2)" },
  { key: "allianz",    label: "Allianz",    color: "var(--chart-3)" },
  { key: "manulife",   label: "Manulife",   color: "var(--chart-4)" },
  { key: "aia",        label: "AIA",        color: "var(--chart-5)" },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-[12px] shadow-lg">
      <div className="font-medium text-foreground mb-1.5">{label} 2024</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-muted-foreground">{p.name}</span>
          </div>
          <span className="tabular-nums font-medium text-foreground">
            Rp {p.value.toFixed(1)} T
          </span>
        </div>
      ))}
    </div>
  );
};

export function ChartAreaInteractive() {
  const [activeSeries, setActiveSeries] = React.useState<string[]>(
    series.map((s) => s.key)
  );

  const toggleSeries = (key: string) => {
    setActiveSeries((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-[14px] font-semibold tracking-tight">
              Tren Premi Bruto Industri Asuransi Jiwa 2024
            </CardTitle>
            <CardDescription className="text-[12px] mt-0.5">
              Per kuartal · Sumber: AAJI · 5 perusahaan terbesar
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {series.map((s) => (
              <button
                key={s.key}
                onClick={() => toggleSeries(s.key)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded text-[11px] border transition-colors",
                  activeSeries.includes(s.key)
                    ? "border-border/60 bg-card/60 text-foreground"
                    : "border-border/20 bg-transparent text-muted-foreground/40"
                )}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: activeSeries.includes(s.key) ? s.color : "currentColor" }}
                />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `Rp ${v}T`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
            {series.map((s) =>
              activeSeries.includes(s.key) ? (
                <Area
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  type="monotone"
                  stroke={s.color}
                  strokeWidth={1.5}
                  fill={`url(#fill-${s.key})`}
                  dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
                  activeDot={{ r: 4, fill: s.color, strokeWidth: 0 }}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICard {
  title: string;
  period: string;
  value: string;
  delta: string;
  deltaType: "positive" | "negative" | "neutral";
  footer: string;
}

const kpis: KPICard[] = [
  {
    title: "Premi Bruto Industri",
    period: "2024 · AAJI",
    value: "Rp 109,00 T",
    delta: "+3,6%",
    deltaType: "positive",
    footer: "Pertumbuhan industri asuransi jiwa nasional",
  },
  {
    title: "APE BRI Life",
    period: "2024 · BRI Life",
    value: "Rp 3,42 T",
    delta: "+11,0%",
    deltaType: "positive",
    footer: "Bancassurance dominan, +18% YoY",
  },
  {
    title: "RBC BRI Life",
    period: "Q4 2024 · BRI Life",
    value: "434,6%",
    delta: "vs 120% min OJK",
    deltaType: "neutral",
    footer: "3,6× di atas batas regulator",
  },
  {
    title: "Laba Bersih BRI Life",
    period: "2024 · BRI Life",
    value: "Rp 760,4 M",
    delta: "+42,1%",
    deltaType: "positive",
    footer: "Pertumbuhan laba year-over-year",
  },
];

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className={cn(
            "rounded-lg border border-border/40 bg-card/40 p-5",
            "hover:bg-card/60 hover:border-border/60 transition-colors duration-200"
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[12px] font-medium text-muted-foreground">
                {kpi.title}
              </div>
              <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                {kpi.period}
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0",
                kpi.deltaType === "positive" &&
                  "bg-accent/10 text-accent border border-accent/20",
                kpi.deltaType === "negative" &&
                  "bg-destructive/10 text-destructive border border-destructive/20",
                kpi.deltaType === "neutral" &&
                  "bg-muted/40 text-muted-foreground border border-border/40"
              )}
            >
              {kpi.deltaType === "positive" && (
                <TrendingUp className="h-3 w-3" />
              )}
              {kpi.deltaType === "negative" && (
                <TrendingDown className="h-3 w-3" />
              )}
              {kpi.delta}
            </div>
          </div>
          <div className="text-[28px] font-semibold tracking-tight tabular-nums text-foreground mb-2">
            {kpi.value}
          </div>
          <div className="text-[11px] text-muted-foreground/80">
            {kpi.footer}
          </div>
        </div>
      ))}
    </div>
  );
}

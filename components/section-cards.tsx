"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface KPIDefinition {
  id: string;
  title: string;
  sparklineKey: string;
  value: string;
  delta: string;
  deltaType: "positive" | "negative" | "neutral";
  unit: string;
  context: string;
}

const kpis: KPIDefinition[] = [
  {
    id: "premi_industri",
    title: "Premi Bruto Industri",
    sparklineKey: "premi_industri",
    value: "Rp 109,00 T",
    delta: "+3,6%",
    deltaType: "positive",
    unit: "FY 2024 · AAJI",
    context: "Pertumbuhan industri nasional",
  },
  {
    id: "ape_brilife",
    title: "APE BRI Life",
    sparklineKey: "ape_brilife",
    value: "Rp 3,42 T",
    delta: "+11,0%",
    deltaType: "positive",
    unit: "FY 2024 · BRI Life",
    context: "Bancassurance dominan",
  },
  {
    id: "rbc_brilife",
    title: "RBC BRI Life",
    sparklineKey: "rbc_brilife",
    value: "434,6%",
    delta: "vs 120% min",
    deltaType: "neutral",
    unit: "Q4 2024 · OJK",
    context: "3.6× di atas regulator",
  },
  {
    id: "laba_brilife",
    title: "Laba Bersih",
    sparklineKey: "laba_brilife",
    value: "Rp 760,4 M",
    delta: "+42,1%",
    deltaType: "positive",
    unit: "FY 2024 · BRI Life",
    context: "Pertumbuhan signifikan YoY",
  },
  {
    id: "klaim_ratio",
    title: "Rasio Klaim",
    sparklineKey: "klaim_ratio",
    value: "62,3%",
    delta: "+2,1pp",
    deltaType: "negative",
    unit: "FY 2024 · Industri",
    context: "Tekanan pricing kesehatan",
  },
  {
    id: "market_share",
    title: "Market Share BRI Life",
    sparklineKey: "market_share_brilife",
    value: "3,14%",
    delta: "+0,4pp",
    deltaType: "positive",
    unit: "FY 2024 · vs industri",
    context: "Naik 4 peringkat",
  },
];

function Sparkline({
  points,
  deltaType,
}: {
  points: number[];
  deltaType: "positive" | "negative" | "neutral";
}) {
  if (!points || points.length === 0) {
    return <div className="h-12 w-full bg-muted/20 rounded animate-pulse" />;
  }

  const width = 200;
  const height = 48;
  const padding = 4;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xStep = (width - padding * 2) / (points.length - 1);

  const pathPoints = points.map((p, i) => {
    const x = padding + i * xStep;
    const y = height - padding - ((p - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${pathPoints.join(" L ")}`;
  const areaPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;

  const color = { positive: "#10b981", negative: "#f43f5e", neutral: "#00d4ff" }[deltaType];
  const gradientId = `grad-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {pathPoints.map((p, i) => {
        const [x, y] = p.split(",");
        return <circle key={i} cx={x} cy={y} r={i === pathPoints.length - 1 ? "2.5" : "0"} fill={color} />;
      })}
    </svg>
  );
}

function DeltaBadge({ delta, type }: { delta: string; type: "positive" | "negative" | "neutral" }) {
  const Icon = type === "positive" ? TrendingUp : type === "negative" ? TrendingDown : Minus;
  const color = {
    positive: "text-[#10b981] bg-[#10b981]/10",
    negative: "text-[#f43f5e] bg-[#f43f5e]/10",
    neutral: "text-muted-foreground bg-muted/40",
  }[type];
  return (
    <div className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium font-numeric", color)}>
      <Icon className="h-2.5 w-2.5" />
      {delta}
    </div>
  );
}

export function SectionCards() {
  const [sparklines, setSparklines] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const fetchAll = async () => {
      const results: Record<string, number[]> = {};
      await Promise.all(
        kpis.map(async (kpi) => {
          try {
            const res = await fetch(`${API_URL}/api/sparkline/${kpi.sparklineKey}`);
            if (res.ok) {
              const data = await res.json();
              results[kpi.id] = data.points || [];
            }
          } catch {
            // silent fail
          }
        })
      );
      setSparklines(results);
    };
    fetchAll();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="group relative rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-all duration-200 overflow-hidden"
        >
          <div className="flex items-start justify-between mb-1">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {kpi.title}
            </div>
            <DeltaBadge delta={kpi.delta} type={kpi.deltaType} />
          </div>
          <div className="text-[10px] text-muted-foreground/60 mb-3">{kpi.unit}</div>
          <div className="text-[24px] font-semibold font-numeric tracking-tight text-foreground leading-none mb-3">
            {kpi.value}
          </div>
          <div className="-mx-1 mb-3">
            <Sparkline points={sparklines[kpi.id] ?? []} deltaType={kpi.deltaType} />
          </div>
          <div className="text-[11px] text-muted-foreground border-t border-border/60 pt-2.5">
            {kpi.context}
          </div>
        </div>
      ))}
    </div>
  );
}

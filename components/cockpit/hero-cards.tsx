"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface ProgressSegment {
  label: string;
  value: number;
  max: number;
  formattedValue: string;
  color: "blue" | "purple" | "pink" | "grey";
}

interface HeroCard {
  title: string;
  delta: string;
  deltaType: "positive" | "negative" | "neutral";
  mainValue: string;
  mainLabel: string;
  segments: ProgressSegment[];
  footer: string;
  footerLink?: string;
}

function ProgressBar({ segments }: { segments: ProgressSegment[] }) {
  const max = Math.max(...segments.map((s) => s.max));
  const colorClass: Record<string, string> = {
    blue: "bg-[#00d4ff]",
    purple: "bg-[#10b981]",
    pink: "bg-[#10b981]",
    grey: "bg-[#2a2a32]",
  };

  return (
    <div className="h-1 rounded-full bg-muted/40 overflow-hidden flex">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={cn(colorClass[seg.color], "h-full transition-all duration-500")}
          style={{ width: `${(seg.value / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function HeroCards() {
  const { t } = useI18n();

  const cards: HeroCard[] = [
    {
      title: t("heroIndustryPremium"),
      delta: "+3.6%",
      deltaType: "positive",
      mainValue: "Rp 109.0 T",
      mainLabel: t("heroIndustryPremiumLabel"),
      segments: [
        { label: "Q1 2024", value: 25.5, max: 109, formattedValue: "Rp 25.5 T", color: "blue" },
        { label: "Q2 2024", value: 27.1, max: 109, formattedValue: "Rp 27.1 T", color: "purple" },
        { label: "Q3 2024", value: 28.2, max: 109, formattedValue: "Rp 28.2 T", color: "pink" },
        { label: "Q4 2024", value: 28.2, max: 109, formattedValue: "Rp 28.2 T", color: "grey" },
      ],
      footer: t("heroDataSource"),
      footerLink: t("heroViewReport"),
    },
    {
      title: t("heroBriLifeCapital"),
      delta: t("heroVsMinOJK"),
      deltaType: "neutral",
      mainValue: "434.6%",
      mainLabel: t("heroBriLifeCapitalLabel"),
      segments: [
        { label: "Q1 RBC", value: 412, max: 500, formattedValue: "412.3%", color: "blue" },
        { label: "Q2 RBC", value: 425, max: 500, formattedValue: "425.1%", color: "purple" },
        { label: "Q3 RBC", value: 441, max: 500, formattedValue: "440.8%", color: "pink" },
      ],
      footer: t("heroOJKMin"),
      footerLink: t("heroRBCInfo"),
    },
    {
      title: t("heroNetProfit"),
      delta: "+42.1%",
      deltaType: "positive",
      mainValue: "Rp 760.4 M",
      mainLabel: t("heroNetProfitLabel"),
      segments: [
        { label: t("heroOperating"), value: 535, max: 760, formattedValue: "Rp 535 M (70.4%)", color: "blue" },
        { label: t("heroInvestment"), value: 152, max: 760, formattedValue: "Rp 152 M (20.0%)", color: "purple" },
        { label: t("heroOther"), value: 73, max: 760, formattedValue: "Rp 73 M (9.6%)", color: "grey" },
      ],
      footer: t("heroSignificantYoY"),
      footerLink: t("heroDetailReport"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-lg border border-border bg-card p-5 hover:border-border/80 transition-colors duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-foreground">{card.title}</h3>
            <span
              className={cn(
                "text-[11px] font-medium px-1.5 py-0.5 rounded tabular-nums",
                card.deltaType === "positive" && "text-[#10b981]",
                card.deltaType === "negative" && "text-[#f43f5e]",
                card.deltaType === "neutral" && "text-muted-foreground"
              )}
            >
              {card.delta}
            </span>
          </div>

          {/* Main metric */}
          <div className="mb-5">
            <div className="text-[28px] font-semibold tracking-tight tabular-nums text-foreground leading-none">
              {card.mainValue}
            </div>
            <div className="text-[12px] text-muted-foreground mt-1.5">{card.mainLabel}</div>
          </div>

          {/* Segments */}
          <div className="space-y-3">
            {card.segments.map((seg, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-muted-foreground">{seg.label}</span>
                  <span className="text-foreground tabular-nums">{seg.formattedValue}</span>
                </div>
                <ProgressBar segments={[seg]} />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
            {card.footer}
            {card.footerLink && (
              <>
                {". "}
                <button
                  onClick={() =>
                    alert(
                      `${card.footerLink} — Coming soon. Will link to OJK/AAJI sources in production.`
                    )
                  }
                  className="text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-sm"
                >
                  {card.footerLink}
                </button>
                {"."}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

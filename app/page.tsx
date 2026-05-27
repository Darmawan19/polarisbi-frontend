"use client";

import { useCallback } from "react";
import { Sidebar } from "@/components/cockpit/sidebar";
import { Header } from "@/components/cockpit/header";
import { HeroCards } from "@/components/cockpit/hero-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { CommandPalette } from "@/components/cockpit/command-palette";
import { AskResult } from "@/components/cockpit/ask-result";
import { useAskStream } from "@/hooks/use-ask-stream";

export default function Home() {
  const { state, ask, reset } = useAskStream();

  const handleAsk = useCallback(
    (question: string, language?: string) => {
      ask(question, language ?? "id");
    },
    [ask]
  );

  const showResult = state.stage !== "idle";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-auto relative">
          <div className="absolute inset-0 bg-grid pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[400px] bg-radial-glow pointer-events-none" />
          <div className="relative flex flex-col gap-8 p-8 max-w-[1600px] mx-auto">
            {/* Section 1: Hero KPI cards (Supabase-style) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
                    Current performance
                  </h2>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    FY 2024 snapshot · Industry premium, BRI Life capital, net profit
                  </p>
                </div>
              </div>
              <HeroCards />
            </section>

            {/* Section 2: 6-card grid (existing) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
                    Overview
                  </h2>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    Key insurance metrics with quarterly trends
                  </p>
                </div>
              </div>
              <SectionCards />
            </section>

            {/* Section 3: Chart */}
            <section>
              <div className="rounded-lg border border-border bg-card">
                <ChartAreaInteractive />
              </div>
            </section>

            {/* Section 4: Companies table */}
            <section>
              <DataTable />
            </section>
          </div>
        </main>
      </div>

      {showResult && <AskResult state={state} onClose={reset} />}

      <CommandPalette onAsk={handleAsk} />
    </div>
  );
}

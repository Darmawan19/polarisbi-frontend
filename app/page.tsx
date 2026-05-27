"use client";

import { Sidebar } from "@/components/cockpit/sidebar";
import { Header } from "@/components/cockpit/header";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { CommandPalette } from "@/components/cockpit/command-palette";
import data from "./data.json";

export default function Home() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="flex flex-col gap-6 p-6">
            <SectionCards />
            <div className="rounded-lg border border-border bg-card/40">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

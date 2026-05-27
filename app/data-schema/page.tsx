"use client";

import { Database, Table2, Key, Sparkles, BookOpen, FileText } from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { RelatedPages } from "@/components/cockpit/related-pages";
import { useI18n } from "@/lib/i18n/context";

const SCHEMA_DATA = [
  {
    name: "industry_aggregate",
    rowCount: 60,
    sizeKB: 248,
    descId: "Tabel agregat industri asuransi jiwa per perusahaan per kuartal. Sumber utama dashboard.",
    descEn: "Industry aggregate table per company per quarter. Primary dashboard source.",
    columns: [
      { name: "company_code", type: "VARCHAR(10)", descId: "Kode perusahaan (PRU, BRIL, dll)", descEn: "Company code (PRU, BRIL, etc)", nullable: false, indexed: true },
      { name: "company_name", type: "VARCHAR(100)", descId: "Nama lengkap perusahaan", descEn: "Full company name", nullable: false, indexed: false },
      { name: "quarter", type: "VARCHAR(7)", descId: "Periode kuartal (2024Q1-2024Q4)", descEn: "Quarter period (2024Q1-2024Q4)", nullable: false, indexed: true },
      { name: "gross_premium", type: "DOUBLE", descId: "Premi bruto dalam Rupiah", descEn: "Gross premium in Rupiah", nullable: true, indexed: false },
      { name: "ape", type: "DOUBLE", descId: "Annualized Premium Equivalent", descEn: "Annualized Premium Equivalent", nullable: true, indexed: false },
      { name: "rbc_ratio", type: "DOUBLE", descId: "Risk-Based Capital ratio (%)", descEn: "Risk-Based Capital ratio (%)", nullable: true, indexed: false },
      { name: "net_profit", type: "DOUBLE", descId: "Laba bersih dalam Rupiah", descEn: "Net profit in Rupiah", nullable: true, indexed: false },
      { name: "claims_ratio", type: "DOUBLE", descId: "Rasio klaim (%)", descEn: "Claims ratio (%)", nullable: true, indexed: false },
      { name: "market_share", type: "DOUBLE", descId: "Pangsa pasar (%)", descEn: "Market share (%)", nullable: true, indexed: false },
      { name: "growth_yoy", type: "DOUBLE", descId: "Pertumbuhan tahunan (%)", descEn: "Year-over-year growth (%)", nullable: true, indexed: false },
      { name: "primary_channel", type: "VARCHAR(20)", descId: "Channel dominan (Agency/Bancassurance/Multi-channel/Digital)", descEn: "Dominant channel", nullable: true, indexed: false },
      { name: "updated_at", type: "TIMESTAMP", descId: "Waktu update record", descEn: "Record update time", nullable: false, indexed: false },
    ],
  },
  {
    name: "channel_distribusi",
    rowCount: 40,
    sizeKB: 96,
    descId: "Breakdown premi per channel distribusi per perusahaan.",
    descEn: "Premium breakdown per distribution channel per company.",
    columns: [
      { name: "company_code", type: "VARCHAR(10)", descId: "Kode perusahaan", descEn: "Company code", nullable: false, indexed: true },
      { name: "channel_type", type: "VARCHAR(20)", descId: "Tipe channel (Agency, Bancassurance, Digital, Direct)", descEn: "Channel type", nullable: false, indexed: true },
      { name: "premium_amount", type: "DOUBLE", descId: "Total premi via channel (Rupiah)", descEn: "Total premium via channel (Rupiah)", nullable: true, indexed: false },
      { name: "policy_count", type: "INTEGER", descId: "Jumlah polis aktif", descEn: "Active policy count", nullable: true, indexed: false },
      { name: "quarter", type: "VARCHAR(7)", descId: "Periode", descEn: "Period", nullable: false, indexed: true },
    ],
  },
  {
    name: "klaim_kategori",
    rowCount: 32,
    sizeKB: 72,
    descId: "Klaim per kategori produk asuransi (kesehatan, jiwa, kecelakaan, dll).",
    descEn: "Claims per insurance product category (health, life, accident, etc).",
    columns: [
      { name: "category", type: "VARCHAR(30)", descId: "Kategori klaim (Kesehatan, Jiwa, Kecelakaan, Critical Illness, dll)", descEn: "Claim category (Health, Life, Accident, Critical Illness, etc)", nullable: false, indexed: true },
      { name: "claim_amount", type: "DOUBLE", descId: "Total nilai klaim dibayar (Rupiah)", descEn: "Total claims paid (Rupiah)", nullable: true, indexed: false },
      { name: "claim_count", type: "INTEGER", descId: "Jumlah klaim", descEn: "Claim count", nullable: true, indexed: false },
      { name: "avg_claim_size", type: "DOUBLE", descId: "Rata-rata nilai klaim", descEn: "Average claim size", nullable: true, indexed: false },
      { name: "quarter", type: "VARCHAR(7)", descId: "Periode", descEn: "Period", nullable: false, indexed: true },
    ],
  },
];

export default function DataSchemaPage() {
  const { lang } = useI18n();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Skema Data" : "Data Schema"}
        description={
          lang === "id"
            ? "Struktur tabel DuckDB analytical engine — kolom, tipe data, dan indeks."
            : "DuckDB analytical engine table structures — columns, data types, and indexes."
        }
        badge={`${SCHEMA_DATA.length} tables`}
        icon={<Database className="h-5 w-5" />}
        breadcrumb={[{ label: lang === "id" ? "Skema Data" : "Data Schema" }]}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {SCHEMA_DATA.map((table) => (
            <div
              key={table.name}
              className="rounded-lg border border-border/40 bg-card/30 overflow-hidden"
            >
              {/* Table header */}
              <div className="px-5 py-4 border-b border-border/40 bg-card/50 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Table2 className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-[14px] font-mono font-semibold text-foreground">
                        {table.name}
                      </code>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                        DuckDB
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-1">
                      {lang === "id" ? table.descId : table.descEn}
                    </p>
                  </div>
                </div>
                <div className="text-right text-[11px] font-numeric text-muted-foreground space-y-0.5">
                  <div>{table.rowCount.toLocaleString()} rows</div>
                  <div>{table.sizeKB} KB</div>
                </div>
              </div>

              {/* Columns table */}
              <table className="w-full">
                <thead className="border-b border-border/40">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {lang === "id" ? "Kolom" : "Column"}
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {lang === "id" ? "Deskripsi" : "Description"}
                    </th>
                    <th className="px-4 py-2 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Null
                    </th>
                    <th className="px-4 py-2 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Index
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col) => (
                    <tr
                      key={col.name}
                      className="border-b border-border/20 last:border-b-0 hover:bg-card/50 transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <code className="text-[12px] font-mono text-foreground font-medium">
                          {col.name}
                        </code>
                      </td>
                      <td className="px-4 py-2.5">
                        <code className="text-[11px] font-mono text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                          {col.type}
                        </code>
                      </td>
                      <td className="px-4 py-2.5 text-[12px] text-foreground/80">
                        {lang === "id" ? col.descId : col.descEn}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {col.nullable ? (
                          <span className="text-[11px] text-muted-foreground">YES</span>
                        ) : (
                          <span className="text-[11px] text-rose-400 font-semibold">NO</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {col.indexed && (
                          <Key className="h-3 w-3 text-primary inline-block" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <hr className="my-8 border-border/40" />
          <RelatedPages
            links={[
              { label: "Ask AI", href: "/ask-ai", icon: Sparkles, description: "Query these tables in natural language" },
              { label: "KPI Glossary", href: "/kpi-glossary", icon: BookOpen, description: "Understand metric definitions" },
              { label: "OJK Statistics", href: "/sources/ojk-statistics", icon: FileText, description: "Source documents" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

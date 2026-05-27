"use client";

import { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const KPI_DATA = [
  {
    id: "rbc",
    abbr: "RBC",
    nameId: "Risk-Based Capital",
    nameEn: "Risk-Based Capital",
    category: "solvency",
    formula: "Available Capital / Required Capital × 100%",
    threshold: "Minimum 120% (OJK regulation)",
    descId: "Rasio modal tersedia terhadap modal minimum berbasis risiko. Indikator solvabilitas perusahaan asuransi.",
    descEn: "Ratio of available capital to risk-based required capital. Solvency indicator for insurance companies.",
    sourceId: "OJK POJK No. 71/POJK.05/2016",
    sourceEn: "OJK Regulation 71/POJK.05/2016",
    contextId: "BRI Life Q4 2024: 434.6% — 3.6× di atas threshold regulator, indikasi kapasitas underwriting longgar.",
    contextEn: "BRI Life Q4 2024: 434.6% — 3.6× above regulator threshold, indicating relaxed underwriting capacity.",
  },
  {
    id: "ape",
    abbr: "APE",
    nameId: "Annualized Premium Equivalent",
    nameEn: "Annualized Premium Equivalent",
    category: "premium",
    formula: "Regular Premium + (Single Premium × 10%)",
    threshold: "—",
    descId: "Metrik standar untuk menormalisasi premi reguler dengan premi sekali bayar. Memudahkan perbandingan portofolio antar perusahaan.",
    descEn: "Standard metric to normalize regular premium with single premium. Enables portfolio comparison across companies.",
    sourceId: "AAJI Standard",
    sourceEn: "AAJI Standard",
    contextId: "BRI Life FY2024: Rp 3.42 T — pertumbuhan +11.0% YoY, di atas industri.",
    contextEn: "BRI Life FY2024: Rp 3.42 T — +11.0% YoY growth, above industry.",
  },
  {
    id: "gross-premium",
    abbr: "GWP",
    nameId: "Gross Written Premium",
    nameEn: "Gross Written Premium",
    category: "premium",
    formula: "Sum of all premiums written before reinsurance",
    threshold: "—",
    descId: "Total premi yang ditulis oleh perusahaan asuransi sebelum dikurangi premi reasuransi. Indikator utama skala bisnis.",
    descEn: "Total premium written by insurer before reinsurance deduction. Primary scale indicator.",
    sourceId: "OJK & AAJI Reports",
    sourceEn: "OJK & AAJI Reports",
    contextId: "Industri FY2024: Rp 109 T — tumbuh +3.6% dari FY2023.",
    contextEn: "Industry FY2024: Rp 109 T — +3.6% from FY2023.",
  },
  {
    id: "market-share",
    abbr: "MS",
    nameId: "Market Share",
    nameEn: "Market Share",
    category: "premium",
    formula: "Company Premium / Industry Total × 100%",
    threshold: "—",
    descId: "Porsi premi perusahaan terhadap total premi industri asuransi jiwa nasional.",
    descEn: "Company premium as % of total national life insurance industry premium.",
    sourceId: "AAJI Quarterly Reports",
    sourceEn: "AAJI Quarterly Reports",
    contextId: "BRI Life Q4 2024: 3.14% — naik 0.4pp dari sebelumnya, ranking 6 nasional.",
    contextEn: "BRI Life Q4 2024: 3.14% — up 0.4pp from previous, ranked 6th nationally.",
  },
  {
    id: "claims-ratio",
    abbr: "CR",
    nameId: "Claims Ratio",
    nameEn: "Claims Ratio",
    category: "profitability",
    formula: "Total Claims Paid / Earned Premium × 100%",
    threshold: "Healthy: < 60% | Caution: 60-80% | Concerning: > 80%",
    descId: "Rasio klaim dibayar terhadap premi diperoleh. Indikator profitabilitas underwriting.",
    descEn: "Ratio of claims paid to earned premium. Underwriting profitability indicator.",
    sourceId: "OJK Quarterly Filing",
    sourceEn: "OJK Quarterly Filing",
    contextId: "Industri FY2024: 62.3% — naik +2.1pp dari FY2023, tekanan klaim kesehatan.",
    contextEn: "Industry FY2024: 62.3% — +2.1pp from FY2023, health claims pressure.",
  },
  {
    id: "net-profit",
    abbr: "NP",
    nameId: "Net Profit",
    nameEn: "Net Profit",
    category: "profitability",
    formula: "Total Revenue - Total Expenses - Tax",
    threshold: "—",
    descId: "Laba bersih setelah pajak. Indikator kinerja keuangan akhir perusahaan.",
    descEn: "Net income after tax. Final financial performance indicator.",
    sourceId: "OJK Annual Filing",
    sourceEn: "OJK Annual Filing",
    contextId: "BRI Life FY2024: Rp 760.4 M — tumbuh +42.1% YoY, signifikan di atas industri.",
    contextEn: "BRI Life FY2024: Rp 760.4 M — +42.1% YoY, significantly above industry.",
  },
  {
    id: "channel-bancassurance",
    abbr: "BANCA",
    nameId: "Bancassurance Channel",
    nameEn: "Bancassurance Channel",
    category: "distribution",
    formula: "Premium via Bank Partner Distribution",
    threshold: "—",
    descId: "Penjualan asuransi melalui kemitraan bank. Channel dominan untuk produk credit-life dan endowment.",
    descEn: "Insurance sales via bank partnership. Dominant channel for credit-life and endowment products.",
    sourceId: "AAJI Channel Reports",
    sourceEn: "AAJI Channel Reports",
    contextId: "BRI Life: bancassurance dominan (~70% APE), didukung partnership Bank BRI Group.",
    contextEn: "BRI Life: bancassurance dominant (~70% APE), backed by Bank BRI Group partnership.",
  },
  {
    id: "channel-agency",
    abbr: "AGY",
    nameId: "Agency Channel",
    nameEn: "Agency Channel",
    category: "distribution",
    formula: "Premium via Tied Agent Network",
    threshold: "—",
    descId: "Penjualan melalui jaringan agen terikat. Channel utama untuk produk unit-link dan whole-life.",
    descEn: "Sales via tied agent network. Primary channel for unit-link and whole-life products.",
    sourceId: "AAJI Channel Reports",
    sourceEn: "AAJI Channel Reports",
    contextId: "Industri: 5 dari 10 top perusahaan agency-dominant.",
    contextEn: "Industry: 5 of top 10 companies are agency-dominant.",
  },
  {
    id: "growth-yoy",
    abbr: "YoY",
    nameId: "Year-over-Year Growth",
    nameEn: "Year-over-Year Growth",
    category: "premium",
    formula: "(Current Period - Previous Year Period) / Previous Year Period × 100%",
    threshold: "—",
    descId: "Pertumbuhan tahun-ke-tahun, mengisolasi efek musiman.",
    descEn: "Year-over-year growth, isolating seasonal effects.",
    sourceId: "Calculated",
    sourceEn: "Calculated",
    contextId: "BRI Life APE: +11.0% YoY — di atas rata-rata industri (+3.6%).",
    contextEn: "BRI Life APE: +11.0% YoY — above industry average (+3.6%).",
  },
  {
    id: "solvency-ratio",
    abbr: "SR",
    nameId: "Solvency Ratio",
    nameEn: "Solvency Ratio",
    category: "solvency",
    formula: "Total Assets - Total Liabilities (Surplus)",
    threshold: "Positive surplus required",
    descId: "Selisih aset dan kewajiban. Memastikan perusahaan mampu memenuhi obligasi klaim jangka panjang.",
    descEn: "Asset-liability surplus. Ensures company can meet long-term claim obligations.",
    sourceId: "OJK POJK 71/2016",
    sourceEn: "OJK POJK 71/2016",
    contextId: "Industri: 100% perusahaan di atas threshold (FY2024).",
    contextEn: "Industry: 100% companies above threshold (FY2024).",
  },
];

const CATEGORIES = [
  { id: "all", labelId: "Semua", labelEn: "All" },
  { id: "premium", labelId: "Premium", labelEn: "Premium" },
  { id: "solvency", labelId: "Solvabilitas", labelEn: "Solvency" },
  { id: "profitability", labelId: "Profitabilitas", labelEn: "Profitability" },
  { id: "distribution", labelId: "Distribusi", labelEn: "Distribution" },
];

export default function KPIGlossaryPage() {
  const { lang } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return KPI_DATA.filter((kpi) => {
      if (category !== "all" && kpi.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = lang === "id" ? kpi.nameId : kpi.nameEn;
        return name.toLowerCase().includes(q) || kpi.abbr.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, category, lang]);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Glosarium KPI" : "KPI Glossary"}
        description={
          lang === "id"
            ? "Definisi formal seluruh metrik dengan formula, threshold regulator, dan konteks BRI Life."
            : "Formal definitions of all metrics with formulas, regulatory thresholds, and BRI Life context."
        }
        badge={`${KPI_DATA.length} KPIs`}
        icon={<BookOpen className="h-5 w-5" />}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filter bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "id" ? "Cari KPI atau singkatan..." : "Search KPI or abbreviation..."}
                className="w-full pl-8 pr-3 py-1.5 text-[12px] rounded-md border border-border/60 bg-card/30 focus:outline-none focus:border-primary/40 placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="inline-flex items-center rounded-md border border-border/60 p-0.5 text-[11px]">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-[3px] font-medium transition-colors",
                    category === c.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {lang === "id" ? c.labelId : c.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((kpi) => (
              <div
                key={kpi.id}
                className="rounded-lg border border-border/40 bg-card/30 p-5 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-foreground">
                        {lang === "id" ? kpi.nameId : kpi.nameEn}
                      </span>
                      <span className="text-[11px] font-mono font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {kpi.abbr}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      {kpi.category}
                    </div>
                  </div>
                </div>

                <p className="text-[13px] text-foreground/80 leading-relaxed mb-4">
                  {lang === "id" ? kpi.descId : kpi.descEn}
                </p>

                <div className="space-y-2.5 text-[11px]">
                  <div>
                    <div className="text-muted-foreground uppercase tracking-wider mb-1">
                      {lang === "id" ? "Formula" : "Formula"}
                    </div>
                    <div className="font-mono text-foreground/90 bg-muted/30 px-2 py-1.5 rounded border border-border/30">
                      {kpi.formula}
                    </div>
                  </div>

                  {kpi.threshold !== "—" && (
                    <div>
                      <div className="text-muted-foreground uppercase tracking-wider mb-1">
                        Threshold
                      </div>
                      <div className="text-foreground/90">{kpi.threshold}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-muted-foreground uppercase tracking-wider mb-1">
                      {lang === "id" ? "Sumber" : "Source"}
                    </div>
                    <div className="text-foreground/90">
                      {lang === "id" ? kpi.sourceId : kpi.sourceEn}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/30">
                    <div className="text-primary/80 uppercase tracking-wider mb-1 text-[10px]">
                      {lang === "id" ? "Konteks BRI Life" : "BRI Life Context"}
                    </div>
                    <div className="text-foreground/90 leading-relaxed">
                      {lang === "id" ? kpi.contextId : kpi.contextEn}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-[12px] text-muted-foreground">
              {lang === "id" ? "Tidak ada KPI ditemukan." : "No KPI found."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

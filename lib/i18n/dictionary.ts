export type Language = "id" | "en";

export const dictionary = {
  // Sidebar
  workspaceName: { id: "PolarisBI", en: "PolarisBI" },
  workspaceTagline: { id: "Analitik Asuransi", en: "Insurance Analytics" },

  // Sidebar sections
  sectionOverview: { id: "Ringkasan", en: "Overview" },
  sectionKnowledge: { id: "Pengetahuan", en: "Knowledge" },
  sectionSources: { id: "Sumber Data", en: "Sources" },

  // Sidebar items
  navIndustryPulse: { id: "Denyut Industri", en: "Industry Pulse" },
  navAskAI: { id: "Tanya AI", en: "Ask AI" },
  navQueryHistory: { id: "Riwayat Query", en: "Query History" },
  navKpiGlossary: { id: "Glosarium KPI", en: "KPI Glossary" },
  navDataSchema: { id: "Skema Data", en: "Data Schema" },
  navOjkStatistics: { id: "Statistik OJK", en: "OJK Statistics" },
  navAajiPress: { id: "Rilis AAJI", en: "AAJI Press" },
  navBriLifeReports: { id: "Laporan BRI Life", en: "BRI Life Reports" },
  navSettings: { id: "Pengaturan", en: "Settings" },
  navAnalystRole: { id: "Analis", en: "Analyst" },

  // Header
  headerSectionLabel: { id: "Denyut Industri", en: "Industry Pulse" },
  headerYear: { id: "TA 2024", en: "FY 2024" },
  headerDateRange: { id: "1 Jan — 31 Des 2024", en: "Jan 1 — Dec 31, 2024" },
  headerAskPlaceholder: { id: "Tanya apa saja...", en: "Ask anything..." },

  // Page sections
  sectionCurrentPerformance: { id: "Kinerja Saat Ini", en: "Current performance" },
  sectionCurrentPerformanceSubtitle: {
    id: "Snapshot TA 2024 · Premi industri, modal BRI Life, laba bersih",
    en: "FY 2024 snapshot · Industry premium, BRI Life capital, net profit",
  },
  sectionOverviewTitle: { id: "Ringkasan", en: "Overview" },
  sectionOverviewSubtitle: {
    id: "Metrik kunci asuransi dengan tren kuartalan",
    en: "Key insurance metrics with quarterly trends",
  },

  // Hero cards
  heroIndustryPremium: { id: "Premi Industri", en: "Industry Premium" },
  heroIndustryPremiumLabel: { id: "total premi bruto TA 2024", en: "FY2024 gross premium total" },
  heroBriLifeCapital: { id: "Modal BRI Life", en: "BRI Life Capital" },
  heroBriLifeCapitalLabel: { id: "Rasio Risk-Based Capital", en: "Risk-Based Capital ratio" },
  heroNetProfit: { id: "Laba Bersih", en: "Net Profit" },
  heroNetProfitLabel: { id: "Pendapatan BRI Life TA 2024", en: "BRI Life FY2024 earnings" },
  heroOperating: { id: "Operasional", en: "Operating" },
  heroInvestment: { id: "Investasi", en: "Investment" },
  heroOther: { id: "Lainnya", en: "Other" },
  heroVsMinOJK: { id: "vs min OJK 120%", en: "vs 120% min OJK" },
  heroDataSource: { id: "Sumber data: AAJI", en: "Data source: AAJI" },
  heroViewReport: { id: "Lihat laporan", en: "View report" },
  heroOJKMin: { id: "Minimum OJK: 120%", en: "OJK minimum: 120%" },
  heroRBCInfo: { id: "Info ambang RBC", en: "RBC threshold info" },
  heroSignificantYoY: { id: "Pertumbuhan YoY signifikan", en: "Significant YoY growth" },
  heroDetailReport: { id: "Detail laporan", en: "Detail report" },

  // Section cards (6 KPI)
  kpiPremiumIndustri: { id: "Premi Bruto Industri", en: "Industry Gross Premium" },
  kpiApeBrilife: { id: "APE BRI Life", en: "BRI Life APE" },
  kpiRbcBrilife: { id: "RBC BRI Life", en: "BRI Life RBC" },
  kpiLabaBrilife: { id: "Laba Bersih", en: "Net Profit" },
  kpiRasioKlaim: { id: "Rasio Klaim", en: "Claims Ratio" },
  kpiMarketShare: { id: "Pangsa Pasar BRI Life", en: "BRI Life Market Share" },
  kpiContextNational: { id: "Pertumbuhan industri nasional", en: "National industry growth" },
  kpiContextBancass: { id: "Bancassurance dominan", en: "Bancassurance dominant" },
  kpiContextRegulator: { id: "3.6× di atas regulator", en: "3.6× above regulator" },
  kpiContextYoY: { id: "Pertumbuhan signifikan YoY", en: "Significant YoY growth" },
  kpiContextPricing: { id: "Tekanan pricing kesehatan", en: "Health pricing pressure" },
  kpiContextRanking: { id: "Naik 4 peringkat", en: "Up 4 rankings" },

  // Chart
  chartTitle: { id: "Tren Premi Bruto · 5 Perusahaan Terbesar", en: "Gross Premium Trend · Top 5 Companies" },
  chartSubtitle: {
    id: "Per kuartal 2024 · dalam triliun Rupiah · sumber AAJI",
    en: "Per quarter 2024 · in Rupiah trillion · source AAJI",
  },

  // Data table
  tableTitle: { id: "Top 10 Perusahaan Asuransi Jiwa", en: "Top 10 Life Insurance Companies" },
  tableSubtitle: { id: "Q4 2024 · OJK", en: "Q4 2024 · OJK" },
  tableFilterPlaceholder: { id: "Filter...", en: "Filter..." },
  tableColCompany: { id: "Perusahaan", en: "Company" },
  tableColPremium: { id: "Premi (Rp T)", en: "Premium (Rp T)" },
  tableColMarketShare: { id: "Pangsa", en: "Mkt Share" },
  tableColRBC: { id: "RBC", en: "RBC" },
  tableColGrowth: { id: "Pertumbuhan YoY", en: "Growth YoY" },
  tableColChannel: { id: "Kanal", en: "Channel" },
  tableShowingOf: { id: "Menampilkan {n} dari {total} perusahaan", en: "Showing {n} of {total} companies" },

  // Tooltips for column headers
  tooltipCompany: {
    id: "Nama perusahaan asuransi jiwa terdaftar di OJK",
    en: "Life insurance company registered with OJK",
  },
  tooltipPremium: {
    id: "Premi bruto kuartal 4 dalam triliun Rupiah. Premi bruto = total premi yang diterima sebelum potongan reasuransi.",
    en: "Q4 gross premium in Rupiah trillion. Gross premium = total premium received before reinsurance deductions.",
  },
  tooltipMarketShare: {
    id: "Persentase premi perusahaan terhadap total premi industri asuransi jiwa nasional",
    en: "Company premium as percentage of total national life insurance industry premium",
  },
  tooltipRBC: {
    id: "Risk-Based Capital. Rasio modal terhadap risiko. Minimum OJK: 120%. Hijau = sehat (>400%), Biru = baik (>300%), Kuning = waspada (>200%), Merah = di bawah ambang.",
    en: "Risk-Based Capital. Capital-to-risk ratio. OJK minimum: 120%. Green = healthy (>400%), Blue = good (>300%), Yellow = caution (>200%), Red = below threshold.",
  },
  tooltipGrowth: {
    id: "Pertumbuhan premi bruto Year-over-Year vs periode yang sama tahun sebelumnya",
    en: "Gross premium growth Year-over-Year vs same period previous year",
  },
  tooltipChannel: {
    id: "Kanal distribusi dominan: Agency (agen tradisional), Bancassurance (via bank), Multi-channel (gabungan), Digital (online direct)",
    en: "Dominant distribution channel: Agency (traditional agents), Bancassurance (via banks), Multi-channel (combined), Digital (online direct)",
  },

  // Ask result panel
  askResultQueryLabel: { id: "QUERY", en: "QUERY" },
  askResultStatusIdle: { id: "Menunggu", en: "Idle" },
  askResultStatusGeneratingSql: { id: "Menerjemahkan...", en: "Translating..." },
  askResultStatusExecutingSql: { id: "Menjalankan query...", en: "Running query..." },
  askResultStatusGeneratingInsight: { id: "Menulis insight...", en: "Generating insight..." },
  askResultStatusDone: { id: "Selesai", en: "Complete" },
  askResultStatusError: { id: "Error", en: "Error" },
  askResultTabInsight: { id: "Insight", en: "Insight" },
  askResultTabResults: { id: "Hasil", en: "Results" },
  askResultTabSQL: { id: "SQL", en: "SQL" },
  askResultWaitingInsight: { id: "Menunggu insight...", en: "Waiting for insight..." },
  askResultNoResults: { id: "Belum ada hasil.", en: "No results yet." },
  askResultRunningQuery: { id: "Menjalankan query...", en: "Running query..." },
  askResultNoSql: { id: "Belum ada SQL.", en: "No SQL generated yet." },
  askResultGeneratingSql: { id: "Membuat SQL...", en: "Generating SQL..." },
  askResultGeneratedSql: { id: "SQL yang Dihasilkan", en: "Generated SQL" },
  askResultCopy: { id: "Salin", en: "Copy" },
  askResultCopied: { id: "Tersalin", en: "Copied" },
  askResultRowsReturned: { id: "{n} baris dikembalikan", en: "{n} rows returned" },
  askResultNoDataYet: { id: "Belum ada data", en: "No data yet" },
  askResultNewQuery: { id: "Query baru", en: "New query" },

  // Command palette
  cmdPlaceholder: { id: "Tanya apa saja tentang data asuransi...", en: "Ask anything about insurance data..." },
  cmdSuggestedHeading: { id: "Pertanyaan Saran", en: "Suggested Questions" },
  cmdActionsHeading: { id: "Aksi", en: "Actions" },
  cmdOpenChat: { id: "Buka percakapan", en: "Open chat conversation" },
  cmdSoon: { id: "Segera", en: "Soon" },
  cmdPressEnter: { id: "Tekan Enter untuk bertanya", en: "Press Enter to ask" },
  cmdAsk: { id: "Tanya", en: "Ask" },
} as const;

export type DictKey = keyof typeof dictionary;

export function translate(
  key: DictKey,
  lang: Language,
  vars?: Record<string, string | number>
): string {
  let text: string = dictionary[key]?.[lang] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

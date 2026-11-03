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
  navProfile: { id: "Profil", en: "Profile" },

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

  // Navigation
  backToDashboard: { id: "Dashboard", en: "Dashboard" },
  breadcrumbLabel: { id: "Jejak halaman", en: "Breadcrumb" },
  skipToContent: { id: "Lompat ke konten utama", en: "Skip to main content" },
  navMainLabel: { id: "Navigasi utama", en: "Main navigation" },
  headerCurrentPage: { id: "Halaman aktif", en: "Current page" },

  // Command palette
  cmdPlaceholder: { id: "Tanya apa saja tentang data asuransi...", en: "Ask anything about insurance data..." },
  cmdSuggestedHeading: { id: "Pertanyaan Saran", en: "Suggested Questions" },
  cmdActionsHeading: { id: "Aksi", en: "Actions" },
  cmdOpenChat: { id: "Buka percakapan", en: "Open chat conversation" },
  cmdSoon: { id: "Segera", en: "Soon" },
  cmdPressEnter: { id: "Tekan Enter untuk bertanya", en: "Press Enter to ask" },
  cmdAsk: { id: "Tanya", en: "Ask" },
  // Auth: login, sesi, ganti password
  loginTitle: { id: "Masuk", en: "Sign in" },
  loginSubtitle: { id: "Gunakan akun PolarisBI Anda untuk melanjutkan.", en: "Use your PolarisBI account to continue." },
  loginUsername: { id: "Username", en: "Username" },
  loginPassword: { id: "Password", en: "Password" },
  loginShowPassword: { id: "Tampilkan password", en: "Show password" },
  loginHidePassword: { id: "Sembunyikan password", en: "Hide password" },
  loginSubmit: { id: "Masuk", en: "Sign in" },
  loginSubmitting: { id: "Memproses…", en: "Signing in…" },
  loginRequired: { id: "Isi username dan password.", en: "Enter your username and password." },
  loginErrInvalid: { id: "Username atau password salah.", en: "Incorrect username or password." },
  loginErrLocked: {
    id: "Terlalu banyak percobaan. Coba lagi dalam {minutes} menit.",
    en: "Too many attempts. Try again in {minutes} minutes.",
  },
  loginErrNetwork: {
    id: "Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.",
    en: "Cannot reach the server. Check your connection and try again.",
  },
  loginErrGeneric: { id: "Terjadi kesalahan. Silakan coba lagi.", en: "Something went wrong. Please try again." },
  loginSessionExpired: { id: "Sesi Anda sudah berakhir. Silakan masuk lagi.", en: "Your session has ended. Please sign in again." },
  loginLoggedOut: { id: "Anda sudah keluar.", en: "You have been signed out." },
  loginForgot: { id: "Lupa password? Hubungi admin PolarisBI.", en: "Forgot your password? Contact a PolarisBI admin." },
  loginHeroTitle: { id: "Analitik asuransi yang berpikir.", en: "Insurance analytics that thinks." },
  loginHeroSubtitle: {
    id: "Tanyakan data dengan bahasa sehari-hari, dapatkan jawaban yang bisa ditelusuri.",
    en: "Ask your data in plain language and get answers you can trace.",
  },
  loginPoint1: { id: "Tanya dalam bahasa Indonesia atau Inggris", en: "Ask in Indonesian or English" },
  loginPoint2: { id: "Setiap jawaban menampilkan SQL dan sumbernya", en: "Every answer shows its SQL and sources" },
  loginPoint3: { id: "Akses sesuai peran, setiap login tercatat", en: "Role-based access, every sign-in logged" },
  authLoading: { id: "Memeriksa sesi…", en: "Checking session…" },
  logout: { id: "Keluar", en: "Sign out" },
  roleAdmin: { id: "Admin", en: "Admin" },
  roleAnalyst: { id: "Analis", en: "Analyst" },
  roleViewer: { id: "Pembaca", en: "Viewer" },
  changePwTitle: { id: "Ganti password", en: "Change password" },
  changePwSubtitle: { id: "Pakai kombinasi yang belum pernah dipakai di tempat lain.", en: "Use a combination you have not used elsewhere." },
  changePwForcedTitle: { id: "Buat password baru", en: "Create a new password" },
  changePwForcedSubtitle: {
    id: "Demi keamanan, ganti password sementara Anda sebelum melanjutkan.",
    en: "For security, replace your temporary password before continuing.",
  },
  changePwCurrent: { id: "Password saat ini", en: "Current password" },
  changePwNew: { id: "Password baru", en: "New password" },
  changePwConfirm: { id: "Ulangi password baru", en: "Repeat new password" },
  changePwHint: { id: "Minimal 10 karakter, mengandung huruf dan angka.", en: "At least 10 characters, with letters and numbers." },
  changePwSubmit: { id: "Simpan password", en: "Save password" },
  changePwSaving: { id: "Menyimpan…", en: "Saving…" },
  changePwRequired: { id: "Isi semua kolom.", en: "Fill in all fields." },
  changePwMismatch: { id: "Password baru dan pengulangannya tidak sama.", en: "The new passwords do not match." },
  changePwWrongCurrent: { id: "Password saat ini salah.", en: "Current password is incorrect." },
  changePwSuccess: { id: "Password berhasil diganti.", en: "Password changed." },
  pwReason_too_short: { id: "Password minimal 10 karakter.", en: "Password must be at least 10 characters." },
  pwReason_too_long: { id: "Password terlalu panjang (maksimal 128 karakter).", en: "Password is too long (128 characters max)." },
  pwReason_needs_letter_and_digit: { id: "Password harus mengandung huruf dan angka.", en: "Password must contain letters and numbers." },
  pwReason_too_common: { id: "Password terlalu umum, pilih yang lain.", en: "That password is too common. Pick another." },
  pwReason_contains_username: { id: "Password tidak boleh memuat username.", en: "Password must not contain your username." },
  pwReason_same_as_old: { id: "Password baru harus berbeda dari yang lama.", en: "The new password must differ from the old one." },

  // Insight: terminal informasi (brief AI, dampak BRI Life, feed berita)
  "insight.nav": { id: "Insight", en: "Insight" },
  "insight.title": { id: "Insight", en: "Insight" },
  "insight.description": {
    id: "Brief AI harian, mingguan, dan bulanan beserta berita yang memengaruhi bisnis asuransi.",
    en: "Daily, weekly, and monthly AI briefs plus news that affects the insurance business.",
  },
  "insight.periodTabsLabel": { id: "Periode brief", en: "Brief period" },
  "insight.period.daily": { id: "Harian", en: "Daily" },
  "insight.period.weekly": { id: "Mingguan", en: "Weekly" },
  "insight.period.monthly": { id: "Bulanan", en: "Monthly" },
  "insight.demo": { id: "Demo", en: "Demo" },
  "insight.demoTitle": {
    id: "Bagian ini memakai data contoh, bukan data riil.",
    en: "This section uses sample data, not real data.",
  },
  "insight.mockModeTitle": {
    id: "Mode contoh aktif: seluruh data di halaman ini adalah data contoh lokal.",
    en: "Sample mode is on: all data on this page is local sample data.",
  },

  // Strip status sumber
  "insight.sources.title": { id: "Sumber data", en: "Data sources" },
  "insight.sources.lastUpdated": { id: "Pembaruan terakhir", en: "Last updated" },
  "insight.sources.never": { id: "Belum pernah", en: "Never" },
  "insight.sources.status.ok": { id: "Normal", en: "OK" },
  "insight.sources.status.stale": { id: "Tertunda", en: "Stale" },
  "insight.sources.status.error": { id: "Gagal", en: "Error" },
  "insight.sources.status.disabled": { id: "Nonaktif", en: "Disabled" },
  "insight.sources.lastSuccess": { id: "Sukses terakhir: {time}", en: "Last success: {time}" },
  "insight.sources.lastAttempt": { id: "Percobaan terakhir: {time}", en: "Last attempt: {time}" },
  "insight.sources.itemCount": { id: "Item terakhir: {n}", en: "Last items: {n}" },
  "insight.sources.lastError": { id: "Error terakhir: {error}", en: "Last error: {error}" },
  "insight.sources.empty": { id: "Belum ada sumber data yang terdaftar.", en: "No data sources registered yet." },
  "insight.sources.error": { id: "Status sumber tidak dapat dimuat.", en: "Source status could not be loaded." },
  "insight.refreshNow": { id: "Perbarui sekarang", en: "Refresh now" },
  "insight.refreshing": { id: "Memperbarui…", en: "Refreshing…" },
  "insight.refreshRunning": {
    id: "Sumber data sedang diperbarui. Hasilnya akan muncul sebentar lagi.",
    en: "Sources are already being refreshed. Results will appear shortly.",
  },
  "insight.refreshDone": {
    id: "Pembaruan selesai: {n} item baru.",
    en: "Refresh finished: {n} new items.",
  },
  "insight.refreshFailedSources": { id: "Sumber gagal: {sources}", en: "Failed sources: {sources}" },
  "insight.refreshError": { id: "Pembaruan sumber gagal.", en: "Source refresh failed." },

  // Kartu brief
  "insight.brief.label": { id: "Ringkasan AI", en: "AI Summary" },
  "insight.brief.generatedAt": { id: "Dibuat {time}", en: "Generated {time}" },
  "insight.brief.periodRange": { id: "Periode {start} – {end}", en: "Period {start} – {end}" },
  "insight.brief.template": { id: "Ringkasan templat", en: "Template summary" },
  "insight.brief.templateTitle": {
    id: "Model AI tidak tersedia saat brief dibuat, jadi isi disusun dari templat.",
    en: "The AI model was unavailable when this brief was made, so it was built from a template.",
  },
  "insight.brief.stale": { id: "Ada kejadian baru sejak brief dibuat", en: "New events since this brief was made" },
  "insight.brief.executiveSummary": { id: "Ringkasan eksekutif", en: "Executive summary" },
  "insight.brief.keyEvents": { id: "Kejadian penting", en: "Key events" },
  "insight.brief.impactNote": { id: "Catatan dampak", en: "Impact note" },
  "insight.brief.watchlist": { id: "Perlu dipantau", en: "Watchlist" },
  "insight.brief.sourceChipTitle": { id: "Buka sumber: {title}", en: "Open source: {title}" },
  "insight.brief.generate": { id: "Buat brief", en: "Generate brief" },
  "insight.brief.regenerate": { id: "Buat ulang", en: "Regenerate" },
  "insight.brief.generating": { id: "Membuat brief…", en: "Generating brief…" },
  "insight.brief.cooldown": { id: "Tunggu {time}", en: "Wait {time}" },
  "insight.brief.cooldownMsg": {
    id: "Brief baru saja dibuat. Coba lagi setelah hitung mundur selesai.",
    en: "A brief was made recently. Try again when the countdown ends.",
  },
  "insight.brief.generated": { id: "Brief berhasil dibuat.", en: "Brief generated." },
  "insight.brief.notGeneratedTitle": { id: "Brief belum dibuat", en: "No brief yet" },
  "insight.brief.notGeneratedBody": {
    id: "Ringkasan AI untuk periode ini belum dibuat. Analis atau admin dapat membuatnya secara manual lewat tombol Buat brief.",
    en: "The AI summary for this period has not been generated yet. An analyst or admin can create it manually with the Generate brief button.",
  },
  "insight.brief.notGeneratedAsk": {
    id: "Minta analis atau admin untuk membuatnya.",
    en: "Ask an analyst or admin to generate it.",
  },
  "insight.brief.noContent": {
    id: "Brief tersedia tetapi isinya kosong.",
    en: "The brief exists but has no content.",
  },
  "insight.brief.error": { id: "Brief tidak dapat dimuat.", en: "The brief could not be loaded." },
  "insight.brief.invalidPeriod": { id: "Periode tidak valid.", en: "Invalid period." },

  // Panel dampak
  "insight.impact.title": { id: "Dampak untuk BRI Life", en: "Impact on BRI Life" },
  "insight.impact.demoNote": {
    id: "Angka polis pada panel ini adalah data contoh, bukan data portofolio BRI Life yang sebenarnya.",
    en: "Policy figures in this panel are sample data, not BRI Life's actual portfolio.",
  },
  "insight.impact.colProvince": { id: "Provinsi", en: "Province" },
  "insight.impact.colEvents": { id: "Kejadian", en: "Events" },
  "insight.impact.colMaxScore": { id: "Skor tertinggi", en: "Top score" },
  "insight.impact.colPolicies": { id: "Polis terpapar", en: "Exposed policies" },
  "insight.impact.colProduct": { id: "Produk", en: "Product" },
  "insight.impact.colActivePolicies": { id: "Polis aktif", en: "Active policies" },
  "insight.impact.expand": { id: "Tampilkan rincian produk {province}", en: "Show product details for {province}" },
  "insight.impact.noProducts": { id: "Tidak ada rincian produk.", en: "No product breakdown." },
  "insight.impact.empty": {
    id: "Belum ada data dampak untuk periode ini. Data dampak muncul setelah brief dibuat dan ada kejadian yang terdeteksi di provinsi.",
    en: "No impact data for this period yet. It appears once a brief is generated and province-level events are detected.",
  },
  "insight.impact.error": { id: "Data dampak tidak dapat dimuat.", en: "Impact data could not be loaded." },
  "insight.impact.caption": {
    id: "Kejadian per provinsi dan jumlah polis aktif yang terpapar",
    en: "Events per province and number of exposed active policies",
  },

  // Feed
  "insight.feed.title": { id: "Berita & kejadian", en: "News & events" },
  "insight.feed.regionLabel": { id: "Feed berita asuransi", en: "Insurance news feed" },
  "insight.feed.filterCategory": { id: "Kategori", en: "Category" },
  "insight.feed.filterProvince": { id: "Provinsi", en: "Province" },
  "insight.feed.filterMinScore": { id: "Skor minimum", en: "Minimum score" },
  "insight.feed.all": { id: "Semua", en: "All" },
  "insight.feed.anyScore": { id: "Semua skor", en: "Any score" },
  "insight.feed.resetFilters": { id: "Atur ulang filter", en: "Reset filters" },
  "insight.feed.showing": { id: "Menampilkan {n} dari {total}", en: "Showing {n} of {total}" },
  "insight.feed.loadMore": { id: "Muat lebih banyak", en: "Load more" },
  "insight.feed.loadingMore": { id: "Memuat…", en: "Loading…" },
  "insight.feed.loadMoreError": { id: "Gagal memuat item berikutnya.", en: "Could not load more items." },
  "insight.feed.empty": { id: "Belum ada berita untuk filter ini.", en: "No news for these filters yet." },
  "insight.feed.emptyHint": {
    id: "Coba longgarkan filter atau tunggu pembaruan sumber berikutnya.",
    en: "Try loosening the filters or wait for the next source refresh.",
  },
  "insight.feed.error": { id: "Feed berita tidak dapat dimuat.", en: "The news feed could not be loaded." },
  "insight.feed.unverified": { id: "Belum terverifikasi", en: "Unverified" },
  "insight.feed.unverifiedTitle": {
    id: "Tingkat keparahan belum diverifikasi oleh sumber resmi.",
    en: "Severity has not been verified by an official source.",
  },
  "insight.feed.score": { id: "Skor {n}", en: "Score {n}" },
  "insight.feed.noProvince": { id: "Nasional / tanpa provinsi", en: "National / no province" },
  "insight.feed.opensNewTab": { id: "(membuka tab baru)", en: "(opens in new tab)" },
  "insight.feed.autoRefresh": { id: "Diperbarui otomatis tiap 5 menit", en: "Auto-refreshes every 5 minutes" },

  // Kategori
  "insight.category.bencana_alam": { id: "Bencana alam", en: "Natural disaster" },
  "insight.category.kesehatan_wabah": { id: "Kesehatan & wabah", en: "Health & outbreak" },
  "insight.category.ekonomi_makro": { id: "Ekonomi makro", en: "Macroeconomy" },
  "insight.category.regulasi": { id: "Regulasi", en: "Regulation" },
  "insight.category.industri_asuransi": { id: "Industri asuransi", en: "Insurance industry" },
  "insight.category.lainnya": { id: "Lainnya", en: "Other" },

  // Keparahan
  "insight.severity.label": { id: "Keparahan", en: "Severity" },
  "insight.severity.rendah": { id: "Rendah", en: "Low" },
  "insight.severity.sedang": { id: "Sedang", en: "Medium" },
  "insight.severity.tinggi": { id: "Tinggi", en: "High" },
  "insight.severity.sangat_tinggi": { id: "Sangat tinggi", en: "Very high" },

  // Footer & umum
  "insight.footer.title": { id: "Atribusi sumber", en: "Source attribution" },
  "insight.footer.empty": { id: "Atribusi akan tampil setelah data sumber dimuat.", en: "Attribution appears once source data loads." },
  "insight.footer.timezone": { id: "Semua waktu dalam WIB (Asia/Jakarta).", en: "All times in WIB (Asia/Jakarta)." },
  "insight.retry": { id: "Coba lagi", en: "Try again" },
  "insight.err.network": {
    id: "Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.",
    en: "Cannot reach the server. Check your connection and try again.",
  },
  "insight.err.forbidden": {
    id: "Peran Anda tidak memiliki akses untuk tindakan ini.",
    en: "Your role does not have access to this action.",
  },
  "insight.err.generic": { id: "Terjadi kesalahan. Silakan coba lagi.", en: "Something went wrong. Please try again." },
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

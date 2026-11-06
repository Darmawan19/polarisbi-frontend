/**
 * DATA CONTOH "monitor keputusan" (GET /api/insight/overview) untuk pengembangan sebelum
 * mesin keputusan backend siap. Hanya dimuat (dynamic import dari api.ts) bila
 * NEXT_PUBLIC_INSIGHT_MOCK=true. Semua isi fiktif; tidak ada data polis nyata.
 *
 * Satu skenario konsisten: rangkaian gempa di Sulawesi Utara + penurunan tajam IHSG.
 * Skor sel produk = skor aspek x sensitivitas produk, sehingga matriks selalu selaras
 * dengan skor aspek. Perubahan status disimpan di state modul (hilang saat muat ulang halaman).
 */
import { ApiError } from "@/lib/api";
import {
  ASPECT_CATEGORIES,
  levelFromScore,
  type AspectCategory,
  type DecisionStatus,
} from "./overview";

const MIN = 60_000;
const HOUR = 60 * MIN;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Tanggal YYYY-MM-DD, `daysBack` hari sebelum hari ini. */
function dayAgo(daysBack: number): string {
  return new Date(Date.now() - daysBack * 24 * HOUR).toISOString().slice(0, 10);
}

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// ---------------------------------------------------------------- aspek

interface AspectSeed {
  score: number;
  delta: number;
  items: number;
  max: "rendah" | "sedang" | "tinggi" | "sangat_tinggi" | null;
  /** 6 titik sebelum hari ini; titik ke-7 = skor */
  history: number[];
  vs: number | null;
  top: string[];
}

const ASPECTS: Record<AspectCategory, AspectSeed> = {
  bencana_alam: { score: 78, delta: 21, items: 14, max: "sangat_tinggi", history: [22, 25, 24, 31, 44, 57], vs: 46, top: ["ev-q1", "ev-q2"] },
  kesehatan_wabah: { score: 18, delta: -2, items: 2, max: "rendah", history: [21, 20, 22, 19, 20, 20], vs: -3, top: ["ev-h1"] },
  ekonomi_makro: { score: 52, delta: 4, items: 9, max: "tinggi", history: [41, 43, 44, 46, 47, 48], vs: 9, top: ["ev-m1"] },
  pasar_keuangan: { score: 71, delta: 14, items: 11, max: "tinggi", history: [38, 40, 39, 45, 50, 57], vs: 23, top: ["ev-p1", "ev-p2"] },
  regulasi: { score: 46, delta: 6, items: 4, max: "sedang", history: [34, 35, 36, 38, 39, 40], vs: 8, top: ["ev-r1"] },
  industri_asuransi: { score: 24, delta: -3, items: 3, max: "rendah", history: [27, 28, 26, 27, 28, 27], vs: -2, top: ["ev-i1"] },
  perbankan_bri: { score: 38, delta: 2, items: 5, max: "sedang", history: [33, 34, 35, 35, 36, 36], vs: 4, top: ["ev-b1"] },
};

function trendOf(d: number) {
  return d >= 2 ? "naik" : d <= -2 ? "turun" : "stabil";
}

// ---------------------------------------------------------------- produk

interface ProductSeed {
  code: string;
  name: string;
  line: string;
  delta: number;
  /** sensitivitas 0..1 per aspek */
  sens: Record<AspectCategory, number>;
}

const PRODUCTS: ProductSeed[] = [
  {
    code: "CL",
    name: "Credit Life (Kredit KUR dan KPR)",
    line: "Bancassurance kredit",
    delta: 11,
    sens: { bencana_alam: 0.95, kesehatan_wabah: 0.6, ekonomi_makro: 0.9, pasar_keuangan: 0.2, regulasi: 0.7, industri_asuransi: 0.5, perbankan_bri: 1 },
  },
  {
    code: "TE",
    name: "Tabungan dan Endowment Bancassurance",
    line: "Bancassurance tabungan",
    delta: 5,
    sens: { bencana_alam: 0.5, kesehatan_wabah: 0.4, ekonomi_makro: 0.8, pasar_keuangan: 0.7, regulasi: 0.8, industri_asuransi: 0.6, perbankan_bri: 0.9 },
  },
  {
    code: "UL",
    name: "Unit-Link",
    line: "Investasi",
    delta: 10,
    sens: { bencana_alam: 0.3, kesehatan_wabah: 0.3, ekonomi_makro: 0.85, pasar_keuangan: 1, regulasi: 0.95, industri_asuransi: 0.7, perbankan_bri: 0.5 },
  },
  {
    code: "TL",
    name: "Proteksi Individu (Term Life)",
    line: "Individu",
    delta: 9,
    sens: { bencana_alam: 0.9, kesehatan_wabah: 0.8, ekonomi_makro: 0.4, pasar_keuangan: 0.1, regulasi: 0.5, industri_asuransi: 0.6, perbankan_bri: 0.2 },
  },
  {
    code: "EB",
    name: "Employee Benefit Kelompok (COZY)",
    line: "Kumpulan",
    delta: 6,
    sens: { bencana_alam: 0.8, kesehatan_wabah: 1, ekonomi_makro: 0.6, pasar_keuangan: 0.2, regulasi: 0.6, industri_asuransi: 0.7, perbankan_bri: 0.4 },
  },
  {
    code: "PA",
    name: "Personal Accident Digital",
    line: "Digital",
    delta: 13,
    sens: { bencana_alam: 1, kesehatan_wabah: 0.3, ekonomi_makro: 0.3, pasar_keuangan: 0.1, regulasi: 0.6, industri_asuransi: 0.6, perbankan_bri: 0.3 },
  },
];

// ---------------------------------------------------------------- keputusan

interface DecisionSeed {
  key: string;
  rule_id: string;
  level: "perlu_keputusan" | "pantau";
  priority: number;
  title: string;
  why: string;
  actions: string[];
  owner: string;
  /** kode backend: hari_ini | 7_hari | 30_hari */
  horizon: "hari_ini" | "7_hari" | "30_hari";
  horizon_label: string;
  confidence: "tinggi" | "sedang" | "rendah";
  flags: string[];
  aspect: AspectCategory;
  provinces: string[];
  product_codes: string[];
  status: DecisionStatus;
  status_by: string | null;
  status_ago: number | null;
  first_seen_ago: number;
  evidence: {
    id: string;
    title: string;
    url: string;
    source: string;
    ago: number;
    score: number;
    severity: "rendah" | "sedang" | "tinggi" | "sangat_tinggi";
    category: AspectCategory;
  }[];
}

const DECISIONS: DecisionSeed[] = [
  {
    key: "dec-gempa-sulut",
    rule_id: "R-BENCANA-01",
    level: "perlu_keputusan",
    priority: 1,
    title: "Siagakan penanganan klaim Credit Life dan PA untuk rangkaian gempa Sulawesi Utara",
    why: "Terjadi 4 gempa M5,0+ dalam 24 jam di Sulawesi Utara; skor bencana alam 78, naik 21 poin dan 46 poin di atas rata-rata 30 hari.",
    actions: [
      "Aktifkan jalur klaim cepat untuk debitur KUR dan KPR di Sulawesi Utara dan Gorontalo",
      "Koordinasikan pendataan debitur terdampak dengan kanwil BRI Manado",
      "Tinjau kecukupan cadangan klaim Credit Life dan Personal Accident wilayah Sulawesi",
    ],
    owner: "Divisi Klaim",
    horizon: "hari_ini",
    horizon_label: "24 jam",
    confidence: "tinggi",
    flags: ["lonjakan"],
    aspect: "bencana_alam",
    provinces: ["Sulawesi Utara", "Gorontalo"],
    product_codes: ["CL", "PA", "TL"],
    status: "baru",
    status_by: null,
    status_ago: null,
    first_seen_ago: 5 * HOUR,
    evidence: [
      { id: "ev-q1", title: "[CONTOH] Gempa M5,8 guncang Minahasa Utara, dirasakan hingga Manado", url: "https://www.bmkg.go.id/", source: "BMKG Gempa", ago: 50 * MIN, score: 88, severity: "sangat_tinggi", category: "bencana_alam" },
      { id: "ev-q2", title: "[CONTOH] Gempa susulan M5,2 tercatat di Laut Maluku, tidak berpotensi tsunami", url: "https://www.bmkg.go.id/", source: "BMKG Gempa", ago: 3 * HOUR, score: 74, severity: "tinggi", category: "bencana_alam" },
      { id: "ev-q3", title: "[CONTOH] BPBD Sulut catat ratusan rumah rusak ringan di dua kabupaten", url: "https://bnpb.go.id/", source: "Contoh Kanal Berita (RSS)", ago: 4 * HOUR, score: 69, severity: "tinggi", category: "bencana_alam" },
      { id: "ev-q4", title: "[CONTOH] Aktivitas perbankan di sejumlah unit BRI Minahasa sempat dihentikan sementara", url: "https://www.bri.co.id/", source: "Contoh Kanal Berita (RSS)", ago: 6 * HOUR, score: 52, severity: "tinggi", category: "perbankan_bri" },
    ],
  },
  {
    key: "dec-ihsg-unitlink",
    rule_id: "R-PASAR-02",
    level: "perlu_keputusan",
    priority: 2,
    title: "Tinjau alokasi dana investasi Unit-Link setelah penurunan tajam IHSG",
    why: "IHSG turun 4,2% dalam 2 sesi; skor pasar keuangan 71, naik 14 poin dan 23 poin di atas rata-rata 30 hari.",
    actions: [
      "Uji ulang NAB dana ekuitas Unit-Link terhadap skenario penurunan 10%",
      "Siapkan materi komunikasi nasabah Unit-Link untuk kanal bancassurance",
      "Evaluasi penyeimbangan sementara ke dana pendapatan tetap",
    ],
    owner: "Divisi Investasi",
    horizon: "7_hari",
    horizon_label: "3 hari",
    confidence: "sedang",
    flags: ["lonjakan"],
    aspect: "pasar_keuangan",
    provinces: ["DKI Jakarta"],
    product_codes: ["UL", "TE"],
    status: "ditinjau",
    status_by: "analis.risiko",
    status_ago: 40 * MIN,
    first_seen_ago: 9 * HOUR,
    evidence: [
      { id: "ev-p1", title: "[CONTOH] IHSG ditutup melemah 2,6%, saham perbankan besar memimpin penurunan", url: "https://www.idx.co.id/", source: "Contoh Kanal Berita (RSS)", ago: 2 * HOUR, score: 76, severity: "sangat_tinggi", category: "pasar_keuangan" },
      { id: "ev-p2", title: "[CONTOH] Investor asing catat jual bersih Rp3,1 triliun dalam dua hari", url: "https://www.idx.co.id/", source: "The GDELT Project", ago: 5 * HOUR, score: 68, severity: "tinggi", category: "pasar_keuangan" },
      { id: "ev-p3", title: "[CONTOH] Imbal hasil SUN 10 tahun naik ke level tertinggi tiga bulan", url: "https://www.bi.go.id/", source: "Contoh Kanal Berita (RSS)", ago: 8 * HOUR, score: 57, severity: "tinggi", category: "ekonomi_makro" },
    ],
  },
  {
    key: "dec-makro-bunga",
    rule_id: "R-MAKRO-03",
    level: "pantau",
    priority: 3,
    title: "Pantau tekanan rupiah dan suku bunga terhadap Tabungan dan Endowment",
    why: "Rupiah melemah 1,8% sepekan dan pasar memperkirakan kenaikan suku bunga 25 bps; skor ekonomi makro 52.",
    actions: [
      "Perbarui asumsi imbal hasil jaminan produk endowment",
      "Siapkan skenario harga ulang bila BI menaikkan suku bunga",
    ],
    owner: "Divisi Aktuaria",
    horizon: "7_hari",
    horizon_label: "1 minggu",
    confidence: "sedang",
    flags: [],
    aspect: "ekonomi_makro",
    provinces: [],
    product_codes: ["TE", "CL", "UL"],
    status: "baru",
    status_by: null,
    status_ago: null,
    first_seen_ago: 30 * HOUR,
    evidence: [
      { id: "ev-m1", title: "[CONTOH] Rupiah menembus level terlemah dalam empat bulan", url: "https://www.bi.go.id/", source: "The GDELT Project", ago: 7 * HOUR, score: 61, severity: "tinggi", category: "ekonomi_makro" },
      { id: "ev-m2", title: "[CONTOH] Ekonom perkirakan BI naikkan suku bunga acuan 25 bps bulan ini", url: "https://www.bi.go.id/", source: "Contoh Kanal Berita (RSS)", ago: 11 * HOUR, score: 48, severity: "sedang", category: "ekonomi_makro" },
    ],
  },
  {
    key: "dec-pojk-paydi",
    rule_id: "R-REG-01",
    level: "pantau",
    priority: 4,
    title: "Siapkan kajian dampak rancangan POJK produk asuransi yang dikaitkan dengan investasi",
    why: "OJK merilis 1 rancangan POJK baru untuk masa konsultasi 30 hari; skor regulasi 46, naik 6 poin.",
    actions: ["Petakan pasal yang memengaruhi fitur dan biaya Unit-Link", "Jadwalkan masukan konsultasi bersama asosiasi"],
    owner: "Divisi Kepatuhan",
    horizon: "30_hari",
    horizon_label: "2 minggu",
    confidence: "tinggi",
    flags: [],
    aspect: "regulasi",
    provinces: [],
    product_codes: ["UL"],
    status: "ditunda",
    status_by: "admin.polaris",
    status_ago: 20 * HOUR,
    first_seen_ago: 2 * 24 * HOUR,
    evidence: [
      { id: "ev-r1", title: "[CONTOH] OJK buka konsultasi publik rancangan POJK PAYDI", url: "https://www.ojk.go.id/", source: "Contoh Kanal Berita (RSS)", ago: 14 * HOUR, score: 55, severity: "tinggi", category: "regulasi" },
      { id: "ev-r2", title: "[CONTOH] Asosiasi asuransi jiwa minta masa transisi lebih panjang", url: "https://www.ojk.go.id/", source: "The GDELT Project", ago: 18 * HOUR, score: 41, severity: "sedang", category: "industri_asuransi" },
    ],
  },
  {
    key: "dec-npl-kur",
    rule_id: "R-BANK-02",
    level: "pantau",
    priority: 5,
    title: "Pantau kualitas kredit KUR mitra BRI untuk portofolio Credit Life",
    why: "Rasio NPL KUR dilaporkan 3,1%, naik 0,2 poin dari kuartal lalu; skor perbankan BRI 38.",
    actions: ["Bandingkan tren klaim Credit Life dengan data NPL per wilayah", "Minta pembaruan data debitur restrukturisasi dari BRI"],
    owner: "Divisi Bancassurance",
    horizon: "30_hari",
    horizon_label: "1 bulan",
    confidence: "rendah",
    flags: [],
    aspect: "perbankan_bri",
    provinces: [],
    product_codes: ["CL", "TE"],
    status: "baru",
    status_by: null,
    status_ago: null,
    first_seen_ago: 3 * 24 * HOUR,
    evidence: [
      { id: "ev-b1", title: "[CONTOH] Laporan triwulanan: NPL segmen mikro naik tipis", url: "https://www.bri.co.id/", source: "Contoh Kanal Berita (RSS)", ago: 12 * HOUR, score: 44, severity: "sedang", category: "perbankan_bri" },
      { id: "ev-b2", title: "[CONTOH] Penyaluran KUR tetap tumbuh di tengah perlambatan konsumsi", url: "https://www.bri.co.id/", source: "The GDELT Project", ago: 20 * HOUR, score: 31, severity: "sedang", category: "perbankan_bri" },
    ],
  },
];

// ---------------------------------------------------------------- state lokal status

const statusOverrides = new Map<string, { status: DecisionStatus; at: string; by: string }>();

// ---------------------------------------------------------------- pembangun respons

function buildProducts() {
  return PRODUCTS.map((p) => {
    const cells = {} as Record<AspectCategory, number>;
    for (const c of ASPECT_CATEGORIES) cells[c] = Math.round(ASPECTS[c].score * p.sens[c]);
    const values = Object.values(cells);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const score = Math.round(0.7 * max + 0.3 * mean);
    const drivers = ASPECT_CATEGORIES.map((c) => ({ aspect: c, value: cells[c] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 2);
    // decision_keys sengaja tidak dikirim (backend tidak mengirimnya); normalizer menurunkannya
    return {
      product_code: p.code,
      product_name: p.name,
      product_line: p.line,
      score,
      level: levelFromScore(score),
      delta: p.delta,
      drivers,
      cells,
    };
  });
}

function buildDecisions() {
  return DECISIONS.map((d) => {
    const o = statusOverrides.get(d.key);
    return {
      key: d.key,
      rule_id: d.rule_id,
      level: d.level,
      priority: d.priority,
      title: d.title,
      why: d.why,
      actions: d.actions,
      owner: d.owner,
      horizon: d.horizon,
      horizon_label: d.horizon_label,
      confidence: d.confidence,
      flags: d.flags,
      aspect: d.aspect,
      provinces: d.provinces,
      product_codes: d.product_codes,
      evidence: d.evidence.map((e) => ({
        id: e.id,
        title: e.title,
        url: e.url,
        source: e.source,
        published_at: ago(e.ago),
        score: e.score,
        severity: e.severity,
        category: e.category,
      })),
      status: o?.status ?? d.status,
      status_updated_at: o?.at ?? (d.status_ago === null ? null : ago(d.status_ago)),
      status_updated_by: o?.by ?? d.status_by,
      first_seen_at: ago(d.first_seen_ago),
      is_draft: true,
      source_count: new Set(d.evidence.map((e) => e.source)).size,
    };
  });
}

export function buildMockOverview() {
  return {
    generated_at: ago(4 * MIN),
    window_hours: 24,
    composite: { score: 68, level: "waspada", delta: 9, trend: "naik" },
    counts: { perlu_keputusan: 2, dipantau: 3, normal: 2 },
    headline:
      "2 keputusan menunggu: kesiagaan klaim akibat rangkaian gempa Sulawesi Utara dan peninjauan dana Unit-Link setelah IHSG turun 4,2%.",
    aspects: ASPECT_CATEGORIES.map((c) => {
      const a = ASPECTS[c];
      return {
        aspect: c,
        score: a.score,
        level: levelFromScore(a.score),
        delta: a.delta,
        trend: trendOf(a.delta),
        event_count: a.items,
        max_severity: a.max,
        sparkline: [...a.history, a.score].map((v, i, all) => ({ date: dayAgo(all.length - 1 - i), score: v })),
        vs_baseline: a.vs,
        top_event_ids: a.top,
      };
    }),
    provinces: [
      { province: "Sulawesi Utara", score: 81, level: "kritis", event_count: 9, categories: ["bencana_alam", "perbankan_bri"] },
      { province: "DKI Jakarta", score: 64, level: "waspada", event_count: 12, categories: ["pasar_keuangan", "regulasi", "ekonomi_makro"] },
      { province: "Gorontalo", score: 57, level: "waspada", event_count: 3, categories: ["bencana_alam"] },
      { province: "Jawa Barat", score: 28, level: "normal", event_count: 2, categories: ["kesehatan_wabah"] },
    ],
    products: buildProducts(),
    decisions: buildDecisions(),
    baseline_ready: true,
    exposure_is_demo: true,
    product_data_is_demo: true,
    attributions: [
      "Sumber: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)",
      "Source: The GDELT Project",
      "Sumber: Contoh Kanal Berita (RSS)",
    ],
    degraded_sources: ["The GDELT Project"],
    levels: [
      { level: "normal", min: 0, max: 29 },
      { level: "pantau", min: 30, max: 54 },
      { level: "waspada", min: 55, max: 74 },
      { level: "kritis", min: 75, max: 100 },
    ],
  };
}

// ---------------------------------------------------------------- handler

export async function mockGetOverview(): Promise<unknown> {
  return delay(buildMockOverview());
}

export async function mockPostDecisionStatus(key: string, status: DecisionStatus, note?: string): Promise<unknown> {
  void note;
  if (!DECISIONS.some((d) => d.key === key)) {
    await delay(null, 200);
    throw new ApiError(404, "decision_not_found", "Keputusan tidak ditemukan (data contoh).");
  }
  statusOverrides.set(key, { status, at: ago(0), by: "pengguna.demo" });
  return delay(buildDecisions().find((d) => d.key === key), 300);
}

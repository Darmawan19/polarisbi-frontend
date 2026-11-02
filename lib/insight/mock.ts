/**
 * DATA CONTOH LOKAL untuk pengembangan sebelum backend siap.
 * Hanya dimuat (dynamic import dari api.ts) bila NEXT_PUBLIC_INSIGHT_MOCK=true.
 * Semua isi di sini fiktif dan tidak mewakili kejadian atau data polis nyata.
 */
import { ApiError } from "@/lib/api";
import type {
  DigestResponse,
  ExposureResponse,
  FeedItem,
  FeedQuery,
  FeedResponse,
  GenerateDigestBody,
  ImpactRow,
  InsightPeriod,
  RefreshResponse,
  SourceStatus,
} from "./types";

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const ATTR = {
  bmkg: "Sumber: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)",
  who: "Source: World Health Organization — Disease Outbreak News",
  gdelt: "Source: The GDELT Project",
  rss: "Sumber: Contoh Kanal Berita (RSS)",
};

function buildItems(): FeedItem[] {
  return [
    {
      id: "mock-1",
      source: "bmkg_quake",
      source_label: "BMKG Gempa",
      attribution: ATTR.bmkg,
      title: "[CONTOH] Gempa M6,1 mengguncang wilayah selatan Jawa Barat",
      snippet: "Data contoh: guncangan dirasakan di beberapa kabupaten, tidak berpotensi tsunami.",
      url: "https://www.bmkg.go.id/",
      published_at: ago(40 * MIN),
      fetched_at: ago(35 * MIN),
      category: "bencana_alam",
      province: "Jawa Barat",
      score: 86,
      severity_label: "sangat_tinggi",
      severity_verified: true,
    },
    {
      id: "mock-2",
      source: "bmkg_weather",
      source_label: "BMKG Cuaca",
      attribution: ATTR.bmkg,
      title: "[CONTOH] Peringatan dini hujan lebat dan banjir di Jawa Tengah",
      snippet: "Data contoh: potensi hujan lebat disertai angin kencang dalam 24 jam ke depan.",
      url: "https://www.bmkg.go.id/",
      published_at: ago(3 * HOUR),
      fetched_at: ago(3 * HOUR - 5 * MIN),
      category: "bencana_alam",
      province: "Jawa Tengah",
      score: 62,
      severity_label: "tinggi",
      severity_verified: true,
    },
    {
      id: "mock-3",
      source: "who_don",
      source_label: "WHO DON",
      attribution: ATTR.who,
      title: "[SAMPLE] Dengue case surge reported in Southeast Asia region",
      snippet: "Sample data: regional health authorities report increased hospitalisation.",
      url: "https://www.who.int/emergencies/disease-outbreak-news",
      published_at: ago(9 * HOUR),
      fetched_at: ago(8 * HOUR),
      category: "kesehatan_wabah",
      province: "DKI Jakarta",
      score: 58,
      severity_label: "tinggi",
      severity_verified: false,
    },
    {
      id: "mock-4",
      source: "gdelt",
      source_label: "GDELT",
      attribution: ATTR.gdelt,
      title: "[CONTOH] Rupiah melemah terhadap dolar AS di tengah ketidakpastian global",
      snippet: "Data contoh: tekanan nilai tukar berpotensi memengaruhi imbal hasil investasi.",
      url: "https://www.gdeltproject.org/",
      published_at: ago(20 * HOUR),
      fetched_at: ago(19 * HOUR),
      category: "ekonomi_makro",
      province: null,
      score: 41,
      severity_label: "sedang",
      severity_verified: true,
    },
    {
      id: "mock-5",
      source: "rss.contoh-berita",
      source_label: "Contoh Berita",
      attribution: ATTR.rss,
      title: "[CONTOH] Regulator menerbitkan rancangan aturan baru produk asuransi kesehatan",
      snippet: "Data contoh: rancangan mengatur pembagian risiko dan kewajiban pelaporan.",
      url: "https://example.com/regulasi-contoh",
      published_at: ago(2 * DAY),
      fetched_at: ago(2 * DAY - HOUR),
      category: "regulasi",
      province: null,
      score: 55,
      severity_label: "tinggi",
      severity_verified: true,
    },
    {
      id: "mock-6",
      source: "rss.contoh-berita",
      source_label: "Contoh Berita",
      attribution: ATTR.rss,
      title: "[CONTOH] Asosiasi mencatat pertumbuhan premi asuransi jiwa kuartal III",
      snippet: "Data contoh: pertumbuhan didorong kanal bancassurance dan produk proteksi.",
      url: "https://example.com/industri-contoh",
      published_at: ago(4 * DAY),
      fetched_at: ago(4 * DAY - HOUR),
      category: "industri_asuransi",
      province: null,
      score: 22,
      severity_label: "rendah",
      severity_verified: true,
    },
    {
      id: "mock-7",
      source: "gdelt",
      source_label: "GDELT",
      attribution: ATTR.gdelt,
      title: "[CONTOH] Gangguan layanan transportasi akibat cuaca di Sulawesi Selatan",
      snippet: "Data contoh: tautan item ini sengaja tidak valid untuk menguji safeExternalUrl.",
      url: "javascript:alert(1)",
      published_at: ago(10 * DAY),
      fetched_at: ago(10 * DAY - HOUR),
      category: "lainnya",
      province: "Sulawesi Selatan",
      score: 12,
      severity_label: "rendah",
      severity_verified: true,
    },
    {
      id: "mock-8",
      source: "bmkg_quake",
      source_label: "BMKG Gempa",
      attribution: ATTR.bmkg,
      title: "[CONTOH] Gempa M4,8 di perairan Sumatera Barat",
      snippet: "Data contoh: guncangan lemah dirasakan, tidak ada laporan kerusakan.",
      url: "https://www.bmkg.go.id/",
      published_at: ago(18 * DAY),
      fetched_at: ago(18 * DAY - HOUR),
      category: "bencana_alam",
      province: "Sumatera Barat",
      score: 33,
      severity_label: "sedang",
      severity_verified: true,
    },
  ];
}

let ITEMS = buildItems();

const EXPOSURE: ExposureResponse = {
  is_demo: true,
  rows: [
    { province: "Jawa Barat", product: "Asuransi Jiwa Kredit", active_policies: 182_400 },
    { province: "Jawa Barat", product: "Proteksi Kesehatan", active_policies: 64_250 },
    { province: "Jawa Tengah", product: "Asuransi Jiwa Kredit", active_policies: 141_300 },
    { province: "Jawa Tengah", product: "Mikro Proteksi", active_policies: 97_800 },
    { province: "DKI Jakarta", product: "Proteksi Kesehatan", active_policies: 88_900 },
    { province: "DKI Jakarta", product: "Unit Link", active_policies: 23_150 },
    { province: "Sulawesi Selatan", product: "Mikro Proteksi", active_policies: 41_600 },
    { province: "Sumatera Barat", product: "Asuransi Jiwa Kredit", active_policies: 38_700 },
  ],
};

const PERIOD_MS: Record<InsightPeriod, number> = { daily: DAY, weekly: 7 * DAY, monthly: 30 * DAY };

function itemsFor(period: InsightPeriod): FeedItem[] {
  const cutoff = Date.now() - PERIOD_MS[period];
  return ITEMS.filter((i) => new Date(i.published_at).getTime() >= cutoff);
}

function impactFor(items: FeedItem[]): ImpactRow[] {
  const byProv = new Map<string, { events: number; max: number }>();
  for (const it of items) {
    if (!it.province) continue;
    const cur = byProv.get(it.province) ?? { events: 0, max: 0 };
    cur.events += 1;
    cur.max = Math.max(cur.max, it.score);
    byProv.set(it.province, cur);
  }
  return [...byProv.entries()].map(([province, v]) => {
    const exposure = EXPOSURE.rows
      .filter((r) => r.province === province)
      .map((r) => ({ product: r.product, active_policies: r.active_policies }));
    return {
      province,
      events: v.events,
      max_score: v.max,
      total_active_policies: exposure.reduce((a, b) => a + b.active_policies, 0),
      exposure,
    };
  });
}

type DigestState = { status: DigestResponse["status"]; generatedAt: string | null; isStale: boolean };

const DIGEST_STATE: Record<InsightPeriod, DigestState> = {
  daily: { status: "ready", generatedAt: ago(2 * HOUR), isStale: true },
  weekly: { status: "fallback", generatedAt: ago(26 * HOUR), isStale: false },
  monthly: { status: "not_generated", generatedAt: null, isStale: false },
};

function buildDigest(period: InsightPeriod): DigestResponse {
  const st = DIGEST_STATE[period];
  const items = itemsFor(period);
  const base = {
    period,
    language: "id" as const,
    bucket_key: `${period}-contoh`,
    period_start: new Date(Date.now() - PERIOD_MS[period]).toISOString().replace(/\.\d{3}Z$/, "Z"),
    period_end: ago(0),
    impact: impactFor(items),
    exposure_is_demo: EXPOSURE.is_demo,
    items,
    attributions: [...new Set(items.map((i) => i.attribution))],
  };
  if (st.status === "not_generated") {
    return {
      ...base,
      status: "not_generated",
      bucket_key: null,
      generated_at: null,
      generated_by: null,
      is_stale: false,
      content: null,
    };
  }
  const isTemplate = st.status === "fallback";
  const top = [...items].sort((a, b) => b.score - a.score);
  return {
    ...base,
    status: st.status,
    generated_at: st.generatedAt,
    generated_by: isTemplate ? "template" : "llm",
    is_stale: st.isStale,
    content: {
      executive_summary: isTemplate
        ? `[Ringkasan templat contoh] Tercatat ${items.length} kejadian pada periode ini. Kejadian dengan skor tertinggi berada di kategori bencana alam.`
        : "[Contoh] Periode ini didominasi kejadian bencana alam di Pulau Jawa yang berpotensi meningkatkan klaim asuransi jiwa kredit dan kesehatan. Tekanan nilai tukar juga perlu dipantau untuk portofolio investasi.",
      key_events: top.slice(0, 4).map((i) => ({
        text: `${i.title.replace(/^\[(CONTOH|SAMPLE)\]\s*/, "")} (skor ${i.score}).`,
        item_ids: [i.id],
      })),
      impact_note:
        "[Contoh] Provinsi dengan jumlah polis aktif terbesar yang terdampak adalah Jawa Barat dan Jawa Tengah. Angka polis pada data contoh bukan data riil.",
      watchlist: [
        "Perkembangan gempa susulan di Jawa Barat",
        "Status peringatan dini banjir Jawa Tengah",
        "Tren kasus demam berdarah",
      ],
    },
  };
}

// ---------------------------------------------------------------- exported handlers

export async function mockGetFeed(q: FeedQuery): Promise<FeedResponse> {
  const limit = q.limit ?? 20;
  const offset = q.offset ?? 0;
  const filtered = ITEMS.filter(
    (i) =>
      (!q.category || i.category === q.category) &&
      (!q.province || i.province === q.province) &&
      (!q.min_score || i.score >= q.min_score)
  ).sort((a, b) => b.published_at.localeCompare(a.published_at));
  return delay({ items: filtered.slice(offset, offset + limit), total: filtered.length, limit, offset });
}

export async function mockGetDigest(period: InsightPeriod): Promise<DigestResponse> {
  return delay(buildDigest(period), 600);
}

const lastGenerate: Partial<Record<InsightPeriod, number>> = {};

export async function mockGenerateDigest(body: GenerateDigestBody): Promise<DigestResponse> {
  const last = lastGenerate[body.period];
  if (last && Date.now() - last < 30_000) {
    const wait = Math.ceil((30_000 - (Date.now() - last)) / 1000);
    await delay(null, 300);
    throw new ApiError(429, "cooldown", "Cooldown (mock)", { retry_after_seconds: wait });
  }
  lastGenerate[body.period] = Date.now();
  DIGEST_STATE[body.period] = { status: "ready", generatedAt: ago(0), isStale: false };
  return delay(buildDigest(body.period), 1500);
}

let refreshCount = 0;

export async function mockRefreshSources(): Promise<RefreshResponse> {
  refreshCount += 1;
  const newItem: FeedItem = {
    id: `mock-new-${refreshCount}`,
    source: "bmkg_quake",
    source_label: "BMKG Gempa",
    attribution: ATTR.bmkg,
    title: `[CONTOH] Gempa M5,${refreshCount % 10} terdeteksi di Nusa Tenggara Barat`,
    snippet: "Data contoh hasil pembaruan manual.",
    url: "https://www.bmkg.go.id/",
    published_at: ago(MIN),
    fetched_at: ago(0),
    category: "bencana_alam",
    province: "Nusa Tenggara Barat",
    score: 47,
    severity_label: "sedang",
    severity_verified: true,
  };
  ITEMS = [newItem, ...ITEMS];
  for (const s of SOURCES) {
    if (s.enabled && s.status !== "error") {
      s.last_attempt_at = ago(0);
      s.last_success_at = ago(0);
      s.status = "ok";
    }
  }
  if (DIGEST_STATE.daily.status !== "not_generated") DIGEST_STATE.daily.isStale = true;
  return delay(
    {
      results: [
        { source: "bmkg_quake", ok: true, new_items: 1, error: null },
        { source: "bmkg_weather", ok: true, new_items: 0, error: null },
        { source: "who_don", ok: false, new_items: 0, error: "Timeout setelah 20 detik (contoh)" },
        { source: "rss.contoh-berita", ok: true, new_items: 0, error: null },
      ],
      finished_at: ago(0),
    },
    1200
  );
}

const SOURCES: SourceStatus[] = [
  {
    source: "bmkg_quake",
    label: "BMKG Gempa",
    attribution: ATTR.bmkg,
    enabled: true,
    status: "ok",
    last_attempt_at: ago(30 * MIN),
    last_success_at: ago(30 * MIN),
    last_item_count: 12,
    last_error: null,
  },
  {
    source: "bmkg_weather",
    label: "BMKG Cuaca",
    attribution: ATTR.bmkg,
    enabled: true,
    status: "stale",
    last_attempt_at: ago(5 * HOUR),
    last_success_at: ago(5 * HOUR),
    last_item_count: 4,
    last_error: null,
  },
  {
    source: "who_don",
    label: "WHO DON",
    attribution: ATTR.who,
    enabled: true,
    status: "error",
    last_attempt_at: ago(20 * MIN),
    last_success_at: ago(2 * DAY),
    last_item_count: 0,
    last_error: "HTTP 503 Service Unavailable (contoh)",
  },
  {
    source: "gdelt",
    label: "GDELT",
    attribution: ATTR.gdelt,
    enabled: false,
    status: "disabled",
    last_attempt_at: null,
    last_success_at: ago(3 * DAY),
    last_item_count: null,
    last_error: null,
  },
  {
    source: "rss.contoh-berita",
    label: "Contoh Berita",
    attribution: ATTR.rss,
    enabled: true,
    status: "ok",
    last_attempt_at: ago(45 * MIN),
    last_success_at: ago(45 * MIN),
    last_item_count: 7,
    last_error: null,
  },
];

export async function mockGetSources(): Promise<SourceStatus[]> {
  return delay(SOURCES.map((s) => ({ ...s })), 350);
}

export async function mockGetExposure(): Promise<ExposureResponse> {
  return delay(EXPOSURE, 300);
}

/**
 * Tipe kontrak API Insight. WAJIB identik dengan backend (prefix /api/insight).
 * Semua waktu: string ISO 8601 UTC berakhiran "Z".
 */

export type InsightPeriod = "daily" | "weekly" | "monthly";

export type InsightCategory =
  | "bencana_alam"
  | "kesehatan_wabah"
  | "ekonomi_makro"
  | "regulasi"
  | "industri_asuransi"
  | "lainnya";

export type SeverityLabel = "rendah" | "sedang" | "tinggi" | "sangat_tinggi";

/** bmkg_quake | bmkg_weather | who_don | gdelt | rss.<slug-label> */
export type SourceKey = "bmkg_quake" | "bmkg_weather" | "who_don" | "gdelt" | `rss.${string}`;

export const INSIGHT_PERIODS: readonly InsightPeriod[] = ["daily", "weekly", "monthly"];

export const INSIGHT_CATEGORIES: readonly InsightCategory[] = [
  "bencana_alam",
  "kesehatan_wabah",
  "ekonomi_makro",
  "regulasi",
  "industri_asuransi",
  "lainnya",
];

export const SEVERITY_LABELS: readonly SeverityLabel[] = ["rendah", "sedang", "tinggi", "sangat_tinggi"];

export interface FeedItem {
  id: string;
  source: SourceKey;
  source_label: string;
  attribution: string;
  title: string;
  snippet: string;
  url: string;
  published_at: string;
  fetched_at: string;
  category: InsightCategory;
  province: string | null;
  /** integer 0..100 */
  score: number;
  severity_label: SeverityLabel;
  severity_verified: boolean;
}

/** GET /api/insight/feed */
export interface FeedQuery {
  category?: InsightCategory;
  province?: string;
  min_score?: number;
  since?: string;
  limit?: number;
  offset?: number;
}

export interface FeedResponse {
  items: FeedItem[];
  total: number;
  limit: number;
  offset: number;
}

export type DigestStatus = "ready" | "fallback" | "not_generated";

export interface DigestKeyEvent {
  text: string;
  item_ids: string[];
}

export interface DigestContent {
  executive_summary: string;
  key_events: DigestKeyEvent[];
  impact_note: string;
  watchlist: string[];
}

export interface ImpactExposure {
  product: string;
  active_policies: number;
}

export interface ImpactRow {
  province: string;
  events: number;
  max_score: number;
  total_active_policies: number;
  exposure: ImpactExposure[];
}

/** GET /api/insight/digest dan POST /api/insight/digest/generate */
export interface DigestResponse {
  status: DigestStatus;
  period: InsightPeriod;
  language: "id";
  bucket_key: string | null;
  period_start: string | null;
  period_end: string | null;
  generated_at: string | null;
  generated_by: "llm" | "template" | null;
  is_stale: boolean;
  content: DigestContent | null;
  impact: ImpactRow[];
  exposure_is_demo: boolean;
  items: FeedItem[];
  attributions: string[];
}

/** POST /api/insight/digest/generate */
export interface GenerateDigestBody {
  period: InsightPeriod;
  force?: boolean;
  language?: "id";
}

export interface RefreshResult {
  source: SourceKey;
  ok: boolean;
  new_items: number;
  error: string | null;
}

/** POST /api/insight/refresh */
export interface RefreshResponse {
  results: RefreshResult[];
  finished_at: string;
}

export type SourceStatusValue = "ok" | "stale" | "error" | "disabled";

/** GET /api/insight/sources (array) */
export interface SourceStatus {
  source: SourceKey;
  label: string;
  attribution: string;
  enabled: boolean;
  status: SourceStatusValue;
  last_attempt_at: string | null;
  last_success_at: string | null;
  last_item_count: number | null;
  last_error: string | null;
}

export interface ExposureRow {
  province: string;
  product: string;
  active_policies: number;
}

/** GET /api/insight/exposure */
export interface ExposureResponse {
  is_demo: boolean;
  rows: ExposureRow[];
}

/** Bentuk error HTTP backend: { detail: { code, message, retry_after_seconds? } } */
export interface InsightErrorDetail {
  code: string;
  message: string;
  retry_after_seconds?: number;
}

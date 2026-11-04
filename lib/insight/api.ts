/**
 * Klien API Insight. Semua pemanggilan lewat apiFetch (cookie sesi + header CSRF;
 * 401 ditangani global oleh AuthGate). Respons dinormalkan secara defensif:
 * field hilang / null / tipe salah tidak boleh membuat halaman crash.
 *
 * Mode contoh: hanya bila NEXT_PUBLIC_INSIGHT_MOCK === "true". Data contoh dimuat
 * lewat dynamic import sehingga tidak pernah dimuat di mode normal.
 */
import { apiFetch, readApiError, ApiError } from "@/lib/api";
import {
  INSIGHT_CATEGORIES,
  INSIGHT_PERIODS,
  SEVERITY_LABELS,
  type DigestContent,
  type DigestResponse,
  type DigestStatus,
  type ExposureResponse,
  type FeedItem,
  type FeedQuery,
  type FeedResponse,
  type GenerateDigestBody,
  type ImpactRow,
  type InsightCategory,
  type InsightPeriod,
  type RefreshResponse,
  type SeverityLabel,
  type SourceKey,
  type SourceStatus,
  type SourceStatusValue,
} from "./types";
import {
  looksLikeOverview,
  normalizeDecision,
  normalizeOverview,
  type Decision,
  type DecisionStatus,
  type Overview,
} from "./overview";

export const INSIGHT_MOCK = process.env.NEXT_PUBLIC_INSIGHT_MOCK === "true";

const BASE = "/api/insight";

// ---------------------------------------------------------------- helpers

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v !== "" ? v : null;
}
function int(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.round(n) : fallback;
}
function intOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = int(v, NaN);
  return Number.isFinite(n) ? n : null;
}
function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}
function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

/** Hanya dipakai bila backend mengirim label keparahan di luar enum. */
function severityFromScore(score: number): SeverityLabel {
  if (score >= 75) return "sangat_tinggi";
  if (score >= 50) return "tinggi";
  if (score >= 25) return "sedang";
  return "rendah";
}

export function normalizeFeedItem(raw: unknown, idx = 0): FeedItem | null {
  if (!isObj(raw)) return null;
  const score = Math.min(100, Math.max(0, int(raw.score, 0)));
  const severity =
    typeof raw.severity_label === "string" && (SEVERITY_LABELS as readonly string[]).includes(raw.severity_label)
      ? (raw.severity_label as SeverityLabel)
      : severityFromScore(score);
  return {
    id: str(raw.id) || `item-${idx}`,
    source: str(raw.source, "unknown") as SourceKey,
    source_label: str(raw.source_label) || str(raw.source),
    attribution: str(raw.attribution),
    title: str(raw.title),
    snippet: str(raw.snippet),
    url: str(raw.url),
    published_at: str(raw.published_at),
    fetched_at: str(raw.fetched_at),
    category: oneOf<InsightCategory>(raw.category, INSIGHT_CATEGORIES, "lainnya"),
    province: strOrNull(raw.province),
    score,
    severity_label: severity,
    severity_verified: bool(raw.severity_verified, false),
  };
}

function normalizeItems(v: unknown): FeedItem[] {
  return arr(v)
    .map((x, i) => normalizeFeedItem(x, i))
    .filter((x): x is FeedItem => x !== null);
}

export function normalizeFeed(raw: unknown): FeedResponse {
  const o = isObj(raw) ? raw : {};
  const items = normalizeItems(o.items);
  return {
    items,
    total: Math.max(int(o.total, items.length), 0),
    limit: int(o.limit, items.length),
    offset: int(o.offset, 0),
  };
}

function normalizeContent(v: unknown): DigestContent | null {
  if (!isObj(v)) return null;
  return {
    executive_summary: str(v.executive_summary),
    key_events: arr(v.key_events)
      .filter(isObj)
      .map((e) => {
        const ev: DigestContent["key_events"][number] = {
          text: str(e.text),
          item_ids: arr(e.item_ids).filter((x): x is string => typeof x === "string"),
        };
        // field opsional; slug yang belum dikenal jatuh ke "lainnya"
        if (typeof e.category === "string" && e.category !== "") {
          ev.category = oneOf<InsightCategory>(e.category, INSIGHT_CATEGORIES, "lainnya");
        }
        return ev;
      })
      .filter((e) => e.text !== ""),
    impact_note: str(v.impact_note),
    watchlist: arr(v.watchlist).filter((x): x is string => typeof x === "string" && x.trim() !== ""),
  };
}

function normalizeImpact(v: unknown): ImpactRow[] {
  return arr(v)
    .filter(isObj)
    .map((r) => ({
      province: str(r.province, "—") || "—",
      events: int(r.events),
      max_score: int(r.max_score),
      total_active_policies: int(r.total_active_policies),
      exposure: arr(r.exposure)
        .filter(isObj)
        .map((e) => ({ product: str(e.product, "—") || "—", active_policies: int(e.active_policies) })),
    }));
}

export function normalizeDigest(raw: unknown, period: InsightPeriod): DigestResponse {
  const o = isObj(raw) ? raw : {};
  const genBy = o.generated_by === "llm" || o.generated_by === "template" ? o.generated_by : null;
  return {
    status: oneOf<DigestStatus>(o.status, ["ready", "fallback", "not_generated"], "not_generated"),
    period: oneOf<InsightPeriod>(o.period, INSIGHT_PERIODS, period),
    language: "id",
    bucket_key: strOrNull(o.bucket_key),
    period_start: strOrNull(o.period_start),
    period_end: strOrNull(o.period_end),
    generated_at: strOrNull(o.generated_at),
    generated_by: genBy,
    is_stale: bool(o.is_stale, false),
    content: normalizeContent(o.content),
    impact: normalizeImpact(o.impact),
    // Aman secara bawaan: bila field hilang/rusak, angka polis dianggap data contoh.
    exposure_is_demo: bool(o.exposure_is_demo, true),
    items: normalizeItems(o.items),
    attributions: arr(o.attributions).filter((x): x is string => typeof x === "string"),
  };
}

export function normalizeSources(raw: unknown): SourceStatus[] {
  return arr(raw)
    .filter(isObj)
    .map((s) => ({
      source: str(s.source, "unknown") as SourceKey,
      label: str(s.label) || str(s.source, "—"),
      attribution: str(s.attribution),
      enabled: bool(s.enabled, true),
      status: oneOf<SourceStatusValue>(s.status, ["ok", "stale", "error", "disabled"], "stale"),
      last_attempt_at: strOrNull(s.last_attempt_at),
      last_success_at: strOrNull(s.last_success_at),
      last_item_count: intOrNull(s.last_item_count),
      last_error: strOrNull(s.last_error),
    }));
}

export function normalizeRefresh(raw: unknown): RefreshResponse {
  const o = isObj(raw) ? raw : {};
  return {
    results: arr(o.results)
      .filter(isObj)
      .map((r) => ({
        source: str(r.source, "unknown") as SourceKey,
        ok: bool(r.ok, false),
        new_items: int(r.new_items),
        error: strOrNull(r.error),
      })),
    finished_at: str(o.finished_at),
  };
}

export function normalizeExposure(raw: unknown): ExposureResponse {
  const o = isObj(raw) ? raw : {};
  return {
    is_demo: bool(o.is_demo, false),
    rows: arr(o.rows)
      .filter(isObj)
      .map((r) => ({
        province: str(r.province, "—") || "—",
        product: str(r.product, "—") || "—",
        active_policies: int(r.active_policies),
      })),
  };
}

/** apiFetch + JSON; gagal jaringan -> ApiError(status 0, "network_error"). */
async function request(path: string, init?: RequestInit): Promise<unknown> {
  let res: Response;
  try {
    res = await apiFetch(path, init);
  } catch (e) {
    throw new ApiError(0, "network_error", e instanceof Error ? e.message : "Network error");
  }
  if (!res.ok) throw await readApiError(res);
  try {
    return await res.json();
  } catch {
    throw new ApiError(res.status, "invalid_json", "Invalid JSON response");
  }
}

function postJson(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

async function mock() {
  return import("./mock");
}

// ---------------------------------------------------------------- endpoints

export async function getFeed(q: FeedQuery = {}, signal?: AbortSignal): Promise<FeedResponse> {
  if (INSIGHT_MOCK) return normalizeFeed(await (await mock()).mockGetFeed(q));
  const p = new URLSearchParams();
  if (q.category) p.set("category", q.category);
  if (q.province) p.set("province", q.province);
  if (typeof q.min_score === "number" && q.min_score > 0) p.set("min_score", String(q.min_score));
  if (q.since) p.set("since", q.since);
  if (typeof q.limit === "number") p.set("limit", String(q.limit));
  if (typeof q.offset === "number") p.set("offset", String(q.offset));
  const qs = p.toString();
  return normalizeFeed(await request(`${BASE}/feed${qs ? `?${qs}` : ""}`, { signal }));
}

export async function getDigest(period: InsightPeriod, signal?: AbortSignal): Promise<DigestResponse> {
  if (INSIGHT_MOCK) return normalizeDigest(await (await mock()).mockGetDigest(period), period);
  return normalizeDigest(
    await request(`${BASE}/digest?period=${encodeURIComponent(period)}`, { signal }),
    period
  );
}

export async function generateDigest(body: GenerateDigestBody): Promise<DigestResponse> {
  const payload: GenerateDigestBody = { language: "id", ...body };
  if (INSIGHT_MOCK) return normalizeDigest(await (await mock()).mockGenerateDigest(payload), body.period);
  return normalizeDigest(await request(`${BASE}/digest/generate`, postJson(payload)), body.period);
}

export async function refreshSources(): Promise<RefreshResponse> {
  if (INSIGHT_MOCK) return normalizeRefresh(await (await mock()).mockRefreshSources());
  return normalizeRefresh(await request(`${BASE}/refresh`, { method: "POST" }));
}

export async function getSources(signal?: AbortSignal): Promise<SourceStatus[]> {
  if (INSIGHT_MOCK) return normalizeSources(await (await mock()).mockGetSources());
  return normalizeSources(await request(`${BASE}/sources`, { signal }));
}

export async function getExposure(signal?: AbortSignal): Promise<ExposureResponse> {
  if (INSIGHT_MOCK) return normalizeExposure(await (await mock()).mockGetExposure());
  return normalizeExposure(await request(`${BASE}/exposure`, { signal }));
}

// ---------------------------------------------------------------- monitor keputusan

async function overviewMock() {
  return import("./overview-mock");
}

/**
 * GET /api/insight/overview. Respons yang bukan bentuk overview (mis. HTML atau objek lain)
 * dilempar sebagai ApiError "invalid_overview" agar UI bisa menampilkan "mesin belum aktif".
 */
export async function getOverview(signal?: AbortSignal): Promise<Overview> {
  if (INSIGHT_MOCK) return normalizeOverview(await (await overviewMock()).mockGetOverview());
  const raw = await request(`${BASE}/overview`, { signal });
  if (!looksLikeOverview(raw)) throw new ApiError(200, "invalid_overview", "Unexpected overview response");
  return normalizeOverview(raw);
}

/**
 * POST /api/insight/decisions/{key}/status (hanya analyst/admin; header CSRF dari apiFetch).
 * Mengembalikan keputusan terbaru bila server mengirimnya, null bila badan respons tidak berisi keputusan.
 */
export async function postDecisionStatus(key: string, status: DecisionStatus, note?: string): Promise<Decision | null> {
  const body: { status: DecisionStatus; note?: string } = { status };
  if (note && note.trim()) body.note = note.trim();
  if (INSIGHT_MOCK) return normalizeDecision(await (await overviewMock()).mockPostDecisionStatus(key, status, body.note));
  let res: Response;
  try {
    res = await apiFetch(`${BASE}/decisions/${encodeURIComponent(key)}/status`, postJson(body));
  } catch (e) {
    throw new ApiError(0, "network_error", e instanceof Error ? e.message : "Network error");
  }
  if (!res.ok) throw await readApiError(res);
  try {
    const raw: unknown = await res.json();
    const o = raw && typeof raw === "object" && "decision" in raw ? (raw as { decision: unknown }).decision : raw;
    return normalizeDecision(o);
  } catch {
    // 204 atau badan bukan JSON: perubahan tetap dianggap berhasil
    return null;
  }
}

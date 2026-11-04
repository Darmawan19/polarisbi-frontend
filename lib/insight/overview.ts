/**
 * Kontrak "monitor keputusan" (GET /api/insight/overview) dan normalizernya.
 *
 * Mesin keputusan backend belum final, jadi SEMUA field diperlakukan opsional:
 * field hilang atau salah tipe diganti nilai aman, enum tak dikenal jatuh ke nilai
 * netral, dan normalizeOverview tidak pernah melempar error.
 */
import {
  INSIGHT_ASPECTS,
  INSIGHT_CATEGORIES,
  SEVERITY_LABELS,
  type InsightCategory,
  type SeverityLabel,
} from "./types";

// ---------------------------------------------------------------- enum

export type ScoreLevel = "normal" | "pantau" | "waspada" | "kritis";
export type Trend = "naik" | "turun" | "stabil";
export type DecisionLevel = "perlu_keputusan" | "pantau";
export type DecisionStatus = "baru" | "ditinjau" | "disetujui" | "ditunda" | "ditolak";
export type Confidence = "tinggi" | "sedang" | "rendah";
/** Tujuh aspek yang dipantau (tanpa `lainnya`). */
export type AspectCategory = Exclude<InsightCategory, "lainnya">;

export const SCORE_LEVELS: readonly ScoreLevel[] = ["normal", "pantau", "waspada", "kritis"];
export const TRENDS: readonly Trend[] = ["naik", "turun", "stabil"];
export const DECISION_LEVELS: readonly DecisionLevel[] = ["perlu_keputusan", "pantau"];
export const DECISION_STATUSES: readonly DecisionStatus[] = ["baru", "ditinjau", "disetujui", "ditunda", "ditolak"];
export const CONFIDENCES: readonly Confidence[] = ["tinggi", "sedang", "rendah"];
export const ASPECT_CATEGORIES = INSIGHT_ASPECTS as readonly AspectCategory[];

export interface LevelBand {
  level: ScoreLevel;
  /** batas bawah inklusif */
  min: number;
  /** batas atas inklusif */
  max: number;
}

/** Batas bawaan kontrak: normal < 30, pantau 30–54, waspada 55–74, kritis >= 75. */
export const DEFAULT_LEVEL_BANDS: readonly LevelBand[] = [
  { level: "normal", min: 0, max: 29 },
  { level: "pantau", min: 30, max: 54 },
  { level: "waspada", min: 55, max: 74 },
  { level: "kritis", min: 75, max: 100 },
];

export function levelFromScore(score: number, bands: readonly LevelBand[] = DEFAULT_LEVEL_BANDS): ScoreLevel {
  let out: ScoreLevel = "normal";
  for (const b of bands) if (score >= b.min) out = b.level;
  return out;
}

// ---------------------------------------------------------------- bentuk

export interface OverviewComposite {
  score: number;
  level: ScoreLevel;
  delta: number;
  trend: Trend;
}

export interface OverviewCounts {
  perlu_keputusan: number;
  dipantau: number;
  normal: number;
}

export interface OverviewAspect {
  category: AspectCategory;
  score: number;
  level: ScoreLevel;
  delta: number;
  trend: Trend;
  item_count: number;
  max_severity: SeverityLabel | null;
  /** 7 angka, lama ke baru (bisa lebih pendek bila backend mengirim kurang) */
  sparkline: number[];
  vs_baseline: number | null;
  top_item_ids: string[];
}

export interface OverviewProvince {
  province: string;
  score: number;
  level: ScoreLevel;
  item_count: number;
  categories: AspectCategory[];
}

export interface ProductDriver {
  category: AspectCategory;
  cell: number;
}

export interface OverviewProduct {
  code: string;
  name: string;
  line: string;
  score: number;
  level: ScoreLevel;
  delta: number;
  drivers: ProductDriver[];
  /** skor sel 0–100 per aspek; aspek yang tidak dikirim = tidak ada sel */
  cells: Partial<Record<AspectCategory, number>>;
  decision_keys: string[];
}

export interface DecisionEvidence {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
  score: number;
  severity: SeverityLabel;
  category: InsightCategory;
}

export interface Decision {
  key: string;
  rule_id: string;
  level: DecisionLevel;
  priority: number;
  title: string;
  why: string;
  actions: string[];
  owner: string;
  horizon: string;
  confidence: Confidence;
  flags: string[];
  aspect: AspectCategory | null;
  provinces: string[];
  product_codes: string[];
  evidence: DecisionEvidence[];
  status: DecisionStatus;
  status_updated_at: string | null;
  status_updated_by: string | null;
  first_seen_at: string | null;
  is_draft: boolean;
}

export interface Overview {
  generated_at: string | null;
  window_hours: number;
  composite: OverviewComposite;
  counts: OverviewCounts;
  headline: string;
  aspects: OverviewAspect[];
  provinces: OverviewProvince[];
  products: OverviewProduct[];
  decisions: Decision[];
  baseline_ready: boolean;
  exposure_is_demo: boolean;
  product_data_is_demo: boolean;
  attributions: string[];
  degraded_sources: string[];
  levels: LevelBand[];
}

// ---------------------------------------------------------------- helper defensif

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : typeof v === "number" && Number.isFinite(v) ? String(v) : fallback;
}
function strOrNull(v: unknown): string | null {
  const s = str(v);
  return s === "" ? null : s;
}
function num(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}
function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = num(v, NaN);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null;
}
/** skor bulat 0..100 */
function score(v: unknown): number {
  return Math.min(100, Math.max(0, Math.round(num(v, 0))));
}
/** delta satu desimal */
function delta(v: unknown): number {
  return Math.round(num(v, 0) * 10) / 10;
}
function count(v: unknown): number {
  return Math.max(0, Math.round(num(v, 0)));
}
function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}
function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function strList(v: unknown): string[] {
  return arr(v)
    .map((x) => str(x))
    .filter((x) => x !== "");
}
function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}
function oneOfOrNull<T extends string>(v: unknown, allowed: readonly T[]): T | null {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}
/** Level skor: enum valid dipakai; selain itu diturunkan dari skor (bukan disembunyikan sebagai normal). */
function scoreLevel(v: unknown, s: number, bands: readonly LevelBand[]): ScoreLevel {
  return oneOfOrNull(v, SCORE_LEVELS) ?? levelFromScore(s, bands);
}
function trend(v: unknown, d: number): Trend {
  return oneOfOrNull(v, TRENDS) ?? (d > 0 ? "naik" : d < 0 ? "turun" : "stabil");
}
function severityFromScore(s: number): SeverityLabel {
  if (s >= 75) return "sangat_tinggi";
  if (s >= 50) return "tinggi";
  if (s >= 25) return "sedang";
  return "rendah";
}

// ---------------------------------------------------------------- normalizer

function normalizeBands(v: unknown): LevelBand[] {
  const list = arr(v)
    .filter(isObj)
    .map((b) => {
      const level = oneOfOrNull(b.level, SCORE_LEVELS);
      const min = numOrNull(b.min);
      if (!level || min === null) return null;
      return { level, min: Math.max(0, Math.round(min)), max: Math.round(num(b.max, 100)) };
    })
    .filter((b): b is LevelBand => b !== null)
    .sort((a, b) => a.min - b.min);
  // legenda backend hanya dipakai bila lengkap (empat level unik); selain itu bawaan kontrak
  const unique = new Set(list.map((b) => b.level));
  return list.length === 4 && unique.size === 4 ? list : DEFAULT_LEVEL_BANDS.map((b) => ({ ...b }));
}

function normalizeAspect(raw: unknown, bands: readonly LevelBand[]): OverviewAspect | null {
  if (!isObj(raw)) return null;
  const category = oneOfOrNull(raw.category, ASPECT_CATEGORIES);
  if (!category) return null;
  const s = score(raw.score);
  const d = delta(raw.delta);
  return {
    category,
    score: s,
    level: scoreLevel(raw.level, s, bands),
    delta: d,
    trend: trend(raw.trend, d),
    item_count: count(raw.item_count),
    max_severity: oneOfOrNull(raw.max_severity, SEVERITY_LABELS),
    sparkline: arr(raw.sparkline)
      .map((x) => num(x, NaN))
      .filter((x) => Number.isFinite(x))
      .map((x) => Math.min(100, Math.max(0, x)))
      .slice(-7),
    vs_baseline: numOrNull(raw.vs_baseline),
    top_item_ids: strList(raw.top_item_ids),
  };
}

function normalizeProvince(raw: unknown, bands: readonly LevelBand[]): OverviewProvince | null {
  if (!isObj(raw)) return null;
  const province = str(raw.province);
  if (!province) return null;
  const s = score(raw.score);
  return {
    province,
    score: s,
    level: scoreLevel(raw.level, s, bands),
    item_count: count(raw.item_count),
    categories: arr(raw.categories)
      .map((c) => oneOfOrNull(c, ASPECT_CATEGORIES))
      .filter((c): c is AspectCategory => c !== null),
  };
}

function normalizeCells(v: unknown): Partial<Record<AspectCategory, number>> {
  const out: Partial<Record<AspectCategory, number>> = {};
  if (isObj(v)) {
    for (const c of ASPECT_CATEGORIES) {
      const n = numOrNull(v[c]);
      if (n !== null) out[c] = score(n);
    }
  } else {
    // toleran: daftar {category, score|cell}
    for (const e of arr(v).filter(isObj)) {
      const c = oneOfOrNull(e.category, ASPECT_CATEGORIES);
      const n = numOrNull(e.score ?? e.cell ?? e.value);
      if (c && n !== null) out[c] = score(n);
    }
  }
  return out;
}

function normalizeProduct(raw: unknown, idx: number, bands: readonly LevelBand[]): OverviewProduct | null {
  if (!isObj(raw)) return null;
  const code = str(raw.code) || `produk-${idx + 1}`;
  const cells = normalizeCells(raw.cells);
  const cellValues = Object.values(cells) as number[];
  // skor produk hilang -> pakai sel tertinggi agar baris tidak tampil lebih tenang dari isinya
  const s = raw.score === undefined || raw.score === null ? (cellValues.length ? Math.max(...cellValues) : 0) : score(raw.score);
  return {
    code,
    name: str(raw.name) || code,
    line: str(raw.line),
    score: s,
    level: scoreLevel(raw.level, s, bands),
    delta: delta(raw.delta),
    drivers: arr(raw.drivers)
      .filter(isObj)
      .map((d) => {
        const category = oneOfOrNull(d.category, ASPECT_CATEGORIES);
        return category ? { category, cell: score(d.cell ?? d.score) } : null;
      })
      .filter((d): d is ProductDriver => d !== null),
    cells,
    decision_keys: strList(raw.decision_keys),
  };
}

function normalizeEvidence(raw: unknown, idx: number): DecisionEvidence | null {
  if (!isObj(raw)) return null;
  const title = str(raw.title);
  if (!title) return null;
  const s = score(raw.score);
  return {
    id: str(raw.id) || `bukti-${idx + 1}`,
    title,
    url: str(raw.url),
    source: str(raw.source) || str(raw.source_label),
    published_at: str(raw.published_at),
    score: s,
    severity: oneOfOrNull(raw.severity ?? raw.severity_label, SEVERITY_LABELS) ?? severityFromScore(s),
    category: oneOf<InsightCategory>(raw.category, INSIGHT_CATEGORIES, "lainnya"),
  };
}

export function normalizeDecision(raw: unknown, idx = 0): Decision | null {
  if (!isObj(raw)) return null;
  const title = str(raw.title);
  const key = str(raw.key) || str(raw.id);
  if (!title && !key) return null;
  return {
    key: key || `keputusan-${idx + 1}`,
    rule_id: str(raw.rule_id),
    level: oneOf<DecisionLevel>(raw.level, DECISION_LEVELS, "pantau"),
    priority: num(raw.priority, Number.MAX_SAFE_INTEGER),
    title: title || key,
    why: str(raw.why),
    actions: strList(raw.actions),
    owner: str(raw.owner),
    horizon: str(raw.horizon),
    confidence: oneOf<Confidence>(raw.confidence, CONFIDENCES, "sedang"),
    flags: strList(raw.flags),
    aspect: oneOfOrNull(raw.aspect, ASPECT_CATEGORIES),
    provinces: strList(raw.provinces),
    product_codes: strList(raw.product_codes),
    evidence: arr(raw.evidence)
      .map((e, i) => normalizeEvidence(e, i))
      .filter((e): e is DecisionEvidence => e !== null),
    status: oneOf<DecisionStatus>(raw.status, DECISION_STATUSES, "baru"),
    status_updated_at: strOrNull(raw.status_updated_at),
    status_updated_by: strOrNull(raw.status_updated_by),
    first_seen_at: strOrNull(raw.first_seen_at),
    // aman secara bawaan: tanpa penanda eksplisit, rekomendasi dianggap draf yang perlu ditinjau
    is_draft: bool(raw.is_draft, true),
  };
}

/** Urutan antrean: level (perlu_keputusan dulu), lalu priority menaik (1 = paling penting). */
export function sortDecisions(list: readonly Decision[]): Decision[] {
  const rank = (l: DecisionLevel) => (l === "perlu_keputusan" ? 0 : 1);
  return [...list].sort((a, b) => rank(a.level) - rank(b.level) || a.priority - b.priority);
}

/**
 * true bila respons tampak seperti overview (dipakai untuk membedakan "mesin belum aktif"
 * dari data kosong yang sah).
 */
export function looksLikeOverview(raw: unknown): boolean {
  return (
    isObj(raw) &&
    (isObj(raw.composite) || Array.isArray(raw.aspects) || Array.isArray(raw.decisions) || Array.isArray(raw.products))
  );
}

export function normalizeOverview(raw: unknown): Overview {
  const o = isObj(raw) ? raw : {};
  const levels = normalizeBands(o.levels);
  const comp = isObj(o.composite) ? o.composite : {};
  const cs = score(comp.score);
  const cd = delta(comp.delta);

  const aspects = arr(o.aspects)
    .map((a) => normalizeAspect(a, levels))
    .filter((a): a is OverviewAspect => a !== null);
  // satu entri per aspek, urutan tampil tetap
  const aspectMap = new Map<AspectCategory, OverviewAspect>();
  for (const a of aspects) if (!aspectMap.has(a.category)) aspectMap.set(a.category, a);

  const decisions = sortDecisions(
    arr(o.decisions)
      .map((d, i) => normalizeDecision(d, i))
      .filter((d): d is Decision => d !== null)
  );
  const products = arr(o.products)
    .map((p, i) => normalizeProduct(p, i, levels))
    .filter((p): p is OverviewProduct => p !== null)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const orderedAspects = ASPECT_CATEGORIES.map((c) => aspectMap.get(c)).filter(
    (a): a is OverviewAspect => a !== undefined
  );

  const cnt = isObj(o.counts) ? o.counts : {};
  const derived = {
    perlu_keputusan: decisions.filter((d) => d.level === "perlu_keputusan").length,
    dipantau: decisions.filter((d) => d.level === "pantau").length,
    normal: orderedAspects.filter((a) => a.level === "normal").length,
  };

  return {
    generated_at: strOrNull(o.generated_at),
    window_hours: count(o.window_hours) || 24,
    composite: {
      score: cs,
      level: scoreLevel(comp.level, cs, levels),
      delta: cd,
      trend: trend(comp.trend, cd),
    },
    counts: {
      perlu_keputusan: cnt.perlu_keputusan === undefined ? derived.perlu_keputusan : count(cnt.perlu_keputusan),
      dipantau: cnt.dipantau === undefined ? derived.dipantau : count(cnt.dipantau),
      normal: cnt.normal === undefined ? derived.normal : count(cnt.normal),
    },
    headline: str(o.headline),
    aspects: orderedAspects,
    provinces: arr(o.provinces)
      .map((p) => normalizeProvince(p, levels))
      .filter((p): p is OverviewProvince => p !== null)
      .sort((a, b) => b.score - a.score),
    products,
    decisions,
    baseline_ready: bool(o.baseline_ready, false),
    exposure_is_demo: bool(o.exposure_is_demo, true),
    // aman secara bawaan: selama bukan false eksplisit, data produk dianggap contoh
    product_data_is_demo: o.product_data_is_demo !== false,
    attributions: strList(o.attributions),
    degraded_sources: strList(o.degraded_sources),
    levels,
  };
}

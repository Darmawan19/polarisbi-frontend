import type { Language } from "@/lib/i18n/dictionary";

export const INSIGHT_TIME_ZONE = "Asia/Jakarta";

function localeOf(lang: Language): string {
  return lang === "id" ? "id-ID" : "en-US";
}

/**
 * Hanya meloloskan URL http/https. Selain itu (javascript:, data:, relatif, rusak)
 * mengembalikan null sehingga tidak dijadikan tautan.
 */
export function safeExternalUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

/** Parse ISO aman; null bila kosong atau tidak valid. */
export function parseIso(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Tanggal + jam di zona Asia/Jakarta, mis. "3 Nov 2026, 14.05 WIB". */
export function formatDateTime(iso: string | null | undefined, lang: Language): string {
  const d = parseIso(iso);
  if (!d) return "—";
  return new Intl.DateTimeFormat(localeOf(lang), {
    timeZone: INSIGHT_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

/** Tanggal saja di zona Asia/Jakarta. */
export function formatDate(iso: string | null | undefined, lang: Language): string {
  const d = parseIso(iso);
  if (!d) return "—";
  return new Intl.DateTimeFormat(localeOf(lang), {
    timeZone: INSIGHT_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

const REL_STEPS: { unit: Intl.RelativeTimeFormatUnit; secs: number }[] = [
  { unit: "year", secs: 31_536_000 },
  { unit: "month", secs: 2_592_000 },
  { unit: "week", secs: 604_800 },
  { unit: "day", secs: 86_400 },
  { unit: "hour", secs: 3_600 },
  { unit: "minute", secs: 60 },
];

/** Waktu relatif ("5 menit yang lalu") memakai Intl.RelativeTimeFormat. */
export function formatRelativeTime(
  iso: string | null | undefined,
  lang: Language,
  now: number = Date.now()
): string {
  const d = parseIso(iso);
  if (!d) return "—";
  const diffSec = Math.round((d.getTime() - now) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(localeOf(lang), { numeric: "auto" });
  for (const step of REL_STEPS) {
    if (abs >= step.secs) return rtf.format(Math.round(diffSec / step.secs), step.unit);
  }
  return rtf.format(0, "second");
}

export function formatNumber(n: number | null | undefined, lang: Language): string {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(localeOf(lang)).format(n);
}

export function truncate(text: string | null | undefined, max: number): string {
  const s = (text ?? "").trim();
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
}

/** Hitung mundur "m:ss" atau "Ns". */
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

/** Atribusi unik, urut sesuai kemunculan pertama, tanpa string kosong. */
export function uniqueAttributions(...lists: (readonly (string | null | undefined)[])[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const raw of list) {
      const a = typeof raw === "string" ? raw.trim() : "";
      if (a && !seen.has(a)) {
        seen.add(a);
        out.push(a);
      }
    }
  }
  return out;
}

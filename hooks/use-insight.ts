"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ApiError } from "@/lib/api";
import { getDigest, getFeed, getSources } from "@/lib/insight/api";
import type {
  DigestResponse,
  FeedItem,
  FeedQuery,
  InsightPeriod,
  SourceStatus,
} from "@/lib/insight/types";

export const FEED_PAGE_SIZE = 20;
export const FEED_AUTO_REFRESH_MS = 5 * 60_000;

export function toApiError(e: unknown): ApiError {
  if (e instanceof ApiError) return e;
  return new ApiError(0, "network_error", e instanceof Error ? e.message : String(e));
}

function isAbort(e: unknown): boolean {
  return e instanceof DOMException && e.name === "AbortError";
}

// ------------------------------------------------------------------ generic resource

interface ResourceState<T> {
  /** kunci data (mis. periode) yang dimuat */
  key: string | null;
  /** kunci permintaan terakhir yang selesai (key + nonce) */
  reqKey: string | null;
  data: T | null;
  error: ApiError | null;
}

export interface Resource<T> {
  data: T | null;
  error: ApiError | null;
  /** true selama permintaan untuk kunci saat ini belum selesai */
  loading: boolean;
  reload: () => void;
  /** ganti data secara lokal (mis. hasil POST generate) */
  setData: (data: T) => void;
}

function useResource<T>(key: string, fetcher: (signal: AbortSignal) => Promise<T>): Resource<T> {
  const [state, setState] = useState<ResourceState<T>>({ key: null, reqKey: null, data: null, error: null });
  const [nonce, setNonce] = useState(0);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const reqKey = `${key}#${nonce}`;

  useEffect(() => {
    const ctrl = new AbortController();
    fetcherRef.current(ctrl.signal).then(
      (data) => {
        if (!ctrl.signal.aborted) setState({ key, reqKey, data, error: null });
      },
      (e) => {
        if (ctrl.signal.aborted || isAbort(e)) return;
        // pertahankan data lama untuk kunci yang sama; error tetap ditampilkan
        setState((prev) => ({
          key,
          reqKey,
          data: prev.key === key ? prev.data : null,
          error: toApiError(e),
        }));
      }
    );
    return () => ctrl.abort();
  }, [key, reqKey]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const setData = useCallback(
    (data: T) => setState((prev) => ({ key, reqKey: prev.reqKey, data, error: null })),
    [key]
  );

  const sameKey = state.key === key;
  return {
    data: sameKey ? state.data : null,
    error: sameKey ? state.error : null,
    loading: state.reqKey !== reqKey,
    reload,
    setData,
  };
}

export function useDigest(period: InsightPeriod): Resource<DigestResponse> {
  return useResource(`digest:${period}`, (signal) => getDigest(period, signal));
}

export function useSources(): Resource<SourceStatus[]> {
  return useResource("sources", (signal) => getSources(signal));
}

// ------------------------------------------------------------------ dashboard: feed 24 jam + auto refresh

/** Batas `limit` terbesar yang diterima GET /api/insight/feed (backend: FEED_MAX_LIMIT). */
export const FEED_MAX_LIMIT = 200;
export const RECENT_WINDOW_MS = 24 * 60 * 60_000;

export interface RecentFeed {
  /** item yang terbit dalam 24 jam terakhir, urut skor tertinggi */
  items: FeedItem[];
  /** jumlah item yang cocok di server (bisa > items.length bila terpotong limit) */
  total: number;
  /** true bila server punya lebih banyak item daripada yang diterima */
  truncated: boolean;
  fetchedAt: string;
}

/**
 * Feed 24 jam terakhir dengan limit terbesar yang didukung API. Dipakai bersama oleh
 * pita headline dan Radar aspek (satu permintaan). `since` dihitung saat fetch.
 */
export function useRecentFeed(): Resource<RecentFeed> {
  return useResource("recent-feed:24h", async (signal) => {
    const sinceMs = Date.now() - RECENT_WINDOW_MS;
    const res = await getFeed(
      { since: new Date(sinceMs).toISOString().replace(/\.\d{3}Z$/, "Z"), limit: FEED_MAX_LIMIT, offset: 0 },
      signal
    );
    // saring ulang di klien (mode contoh mengabaikan `since`)
    const items = res.items
      .filter((i) => {
        const ms = new Date(i.published_at).getTime();
        return Number.isFinite(ms) && ms >= sinceMs;
      })
      .sort((a, b) => b.score - a.score || b.published_at.localeCompare(a.published_at));
    return {
      items,
      total: res.total,
      truncated: res.total > res.items.length,
      fetchedAt: new Date().toISOString(),
    };
  });
}

/**
 * Panggil `reloads` tiap 5 menit, hanya saat tab terlihat (pola sama dengan useFeed).
 * Saat tab kembali terlihat dan jeda sudah lewat, langsung diperbarui.
 */
export function useAutoRefresh(reloads: readonly (() => void)[]) {
  const reloadsRef = useRef(reloads);
  useEffect(() => {
    reloadsRef.current = reloads;
  });

  useEffect(() => {
    let last = Date.now();
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - last < FEED_AUTO_REFRESH_MS - 1000) return;
      last = Date.now();
      reloadsRef.current.forEach((r) => r());
    };
    const id = window.setInterval(tick, 30_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
}

// ------------------------------------------------------------------ feed (paging + auto refresh)

export interface FeedFilters {
  category?: FeedQuery["category"];
  province?: string;
  min_score?: number;
}

interface FeedState {
  key: string | null;
  items: FeedItem[];
  total: number;
  error: ApiError | null;
  /** waktu fetch sukses terakhir (ms) */
  fetchedAt: number;
}

export interface FeedResource {
  items: FeedItem[];
  total: number;
  error: ApiError | null;
  loading: boolean;
  loadingMore: boolean;
  loadMoreError: ApiError | null;
  hasMore: boolean;
  loadMore: () => void;
  reload: () => void;
  /** ambil ulang halaman pertama tanpa skeleton (dipakai auto refresh & setelah "Perbarui sekarang") */
  refreshInPlace: () => void;
}

export function useFeed(filters: FeedFilters): FeedResource {
  const key = JSON.stringify([filters.category ?? "", filters.province ?? "", filters.min_score ?? 0]);
  const [state, setState] = useState<FeedState>({ key: null, items: [], total: 0, error: null, fetchedAt: 0 });
  const [nonce, setNonce] = useState(0);
  const [doneReq, setDoneReq] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<ApiError | null>(null);

  const filtersRef = useRef(filters);
  const stateRef = useRef(state);
  useEffect(() => {
    filtersRef.current = filters;
    stateRef.current = state;
  });

  const reqKey = `${key}#${nonce}`;

  useEffect(() => {
    const ctrl = new AbortController();
    getFeed({ ...filtersRef.current, limit: FEED_PAGE_SIZE, offset: 0 }, ctrl.signal).then(
      (res) => {
        if (ctrl.signal.aborted) return;
        setState({ key, items: res.items, total: res.total, error: null, fetchedAt: Date.now() });
        setLoadMoreError(null);
        setDoneReq(reqKey);
      },
      (e) => {
        if (ctrl.signal.aborted || isAbort(e)) return;
        setState((prev) => ({
          ...(prev.key === key ? prev : { items: [], total: 0, fetchedAt: 0 }),
          key,
          error: toApiError(e),
        }));
        setDoneReq(reqKey);
      }
    );
    return () => ctrl.abort();
  }, [key, reqKey]);

  const loadMore = useCallback(() => {
    const cur = stateRef.current;
    setLoadingMore(true);
    setLoadMoreError(null);
    const k = cur.key;
    getFeed({ ...filtersRef.current, limit: FEED_PAGE_SIZE, offset: cur.items.length })
      .then((res) => {
        setState((prev) => {
          if (prev.key !== k) return prev;
          const seen = new Set(prev.items.map((i) => i.id));
          return {
            ...prev,
            items: [...prev.items, ...res.items.filter((i) => !seen.has(i.id))],
            total: res.total,
          };
        });
      })
      .catch((e) => setLoadMoreError(toApiError(e)))
      .finally(() => setLoadingMore(false));
  }, []);

  const refreshInPlace = useCallback(() => {
    const cur = stateRef.current;
    const k = cur.key;
    const limit = Math.max(FEED_PAGE_SIZE, cur.items.length);
    getFeed({ ...filtersRef.current, limit, offset: 0 }).then(
      (res) => {
        setState((prev) =>
          prev.key !== k ? prev : { key: k, items: res.items, total: res.total, error: null, fetchedAt: Date.now() }
        );
      },
      () => {
        // pembaruan senyap: biarkan data lama tetap tampil
      }
    );
  }, []);

  // Auto refresh tiap 5 menit, hanya saat tab browser terlihat.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      const last = stateRef.current.fetchedAt;
      // belum pernah sukses -> pengguna memakai tombol "Coba lagi"; jangan memukul server tiap 30 detik
      if (last === 0) return;
      if (Date.now() - last >= FEED_AUTO_REFRESH_MS - 1000) refreshInPlace();
    };
    const id = window.setInterval(tick, 30_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [refreshInPlace]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const sameKey = state.key === key;
  const items = sameKey ? state.items : [];
  const total = sameKey ? state.total : 0;
  return {
    items,
    total,
    error: sameKey ? state.error : null,
    loading: doneReq !== reqKey,
    loadingMore,
    loadMoreError,
    hasMore: items.length < total,
    loadMore,
    reload,
    refreshInPlace,
  };
}

// ------------------------------------------------------------------ clock & countdown

const clockListeners = new Set<() => void>();
let clockNow = 0;
let clockTimer: ReturnType<typeof setInterval> | null = null;

function subscribeClock(cb: () => void) {
  clockListeners.add(cb);
  if (clockTimer === null) {
    clockNow = Date.now();
    clockTimer = setInterval(() => {
      clockNow = Date.now();
      clockListeners.forEach((l) => l());
    }, 30_000);
  }
  return () => {
    clockListeners.delete(cb);
    if (clockListeners.size === 0 && clockTimer !== null) {
      clearInterval(clockTimer);
      clockTimer = null;
    }
  };
}

function getClockSnapshot(): number {
  // nilai harus stabil antar-panggilan; hanya berubah saat timer berdetak
  if (clockNow === 0) clockNow = Date.now();
  return clockNow;
}

/** Waktu sekarang (ms) yang diperbarui tiap 30 detik — untuk label waktu relatif. */
export function useNow(): number {
  return useSyncExternalStore(subscribeClock, getClockSnapshot, () => 0);
}

/** Hitung mundur detik (mis. dari retry_after_seconds 429). */
export function useCountdown() {
  const [endAt, setEndAt] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (endAt === 0) return;
    const id = window.setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= endAt) {
        setEndAt(0);
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [endAt]);

  const start = useCallback((seconds: number) => {
    const n = Date.now();
    setNow(n);
    setEndAt(n + Math.max(1, seconds) * 1000);
  }, []);

  const remaining = endAt === 0 ? 0 : Math.max(0, Math.ceil((endAt - now) / 1000));
  return { remaining, start };
}

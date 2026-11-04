"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ApiError } from "@/lib/api";
import { getOverview, postDecisionStatus } from "@/lib/insight/api";
import type { Decision, DecisionStatus, Overview } from "@/lib/insight/overview";
import { toApiError, useResource, type Resource } from "@/hooks/use-insight";

export interface OverviewResource extends Resource<Overview> {
  /** true bila server belum menyediakan mesin keputusan (404 atau bentuk respons tidak dikenal) */
  unavailable: boolean;
  /**
   * Ubah status keputusan. Tampilan diperbarui lokal lebih dulu (optimistis) lalu
   * diselaraskan dengan respons server; bila gagal dikembalikan dan error dikembalikan.
   */
  updateStatus: (key: string, status: DecisionStatus, note?: string) => Promise<ApiError | null>;
}

type StatusPatch = Pick<Decision, "status" | "status_updated_at" | "status_updated_by">;

/** Memuat GET /api/insight/overview sendiri. Auto refresh diatur pemanggil lewat useAutoRefresh. */
export function useOverview(): OverviewResource {
  const res = useResource("insight-overview", (signal) => getOverview(signal));
  const { setData } = res;

  const dataRef = useRef<Overview | null>(res.data);
  useEffect(() => {
    dataRef.current = res.data;
  });

  const patch = useCallback(
    (key: string, p: StatusPatch) => {
      const cur = dataRef.current;
      if (!cur) return;
      const next: Overview = {
        ...cur,
        decisions: cur.decisions.map((d) => (d.key === key ? { ...d, ...p } : d)),
      };
      dataRef.current = next;
      setData(next);
    },
    [setData]
  );

  const updateStatus = useCallback(
    async (key: string, status: DecisionStatus, note?: string): Promise<ApiError | null> => {
      const prev = dataRef.current?.decisions.find((d) => d.key === key);
      if (!prev) return null;
      const before: StatusPatch = {
        status: prev.status,
        status_updated_at: prev.status_updated_at,
        status_updated_by: prev.status_updated_by,
      };
      patch(key, { status, status_updated_at: new Date().toISOString(), status_updated_by: null });
      try {
        const updated = await postDecisionStatus(key, status, note);
        if (updated && updated.key === key) {
          patch(key, {
            status: updated.status,
            status_updated_at: updated.status_updated_at ?? new Date().toISOString(),
            status_updated_by: updated.status_updated_by,
          });
        }
        return null;
      } catch (e) {
        patch(key, before);
        return toApiError(e);
      }
    },
    [patch]
  );

  const err = res.error;
  const unavailable = !res.data && !!err && (err.status === 404 || err.code === "invalid_overview");

  return { ...res, unavailable, updateStatus };
}

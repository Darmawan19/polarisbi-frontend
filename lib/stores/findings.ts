import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Finding {
  id: string;
  question: string;
  sql: string | null;
  columns: string[];
  rowCount: number;
  insight: string;
  timestamp: number;
  selected: boolean;
}

interface FindingsState {
  findings: Finding[];
  /** Deduplicates by normalized question. Returns the id actually stored (existing id on dedup, new id otherwise). */
  addFinding: (f: Omit<Finding, "selected">) => string;
  removeFinding: (id: string) => void;
  toggleSelected: (id: string) => void;
  setAllSelected: (val: boolean) => void;
  /** Reorders findings to match the given id order; extras not in ids are appended. */
  reorder: (ids: string[]) => void;
  clear: () => void;
}

export const useFindingsStore = create<FindingsState>()(
  persist(
    (set, get) => ({
      findings: [],

      addFinding: (f) => {
        const normalized = f.question.trim().toLowerCase();
        const existing = get().findings.find(
          (e) => e.question.trim().toLowerCase() === normalized
        );
        if (existing) {
          // Replace in place with fresh data, keep id + selected=true, move to top
          set((s) => ({
            findings: [
              {
                ...existing,
                sql: f.sql,
                columns: f.columns,
                rowCount: f.rowCount,
                insight: f.insight,
                timestamp: f.timestamp,
                selected: true,
              },
              ...s.findings.filter((e) => e.id !== existing.id),
            ],
          }));
          return existing.id;
        }
        const newFinding: Finding = { ...f, selected: true };
        set((s) => ({ findings: [newFinding, ...s.findings] }));
        return f.id;
      },

      removeFinding: (id) =>
        set((s) => ({ findings: s.findings.filter((f) => f.id !== id) })),

      toggleSelected: (id) =>
        set((s) => ({
          findings: s.findings.map((f) =>
            f.id === id ? { ...f, selected: !f.selected } : f
          ),
        })),

      setAllSelected: (val) =>
        set((s) => ({
          findings: s.findings.map((f) => ({ ...f, selected: val })),
        })),

      reorder: (ids) =>
        set((s) => {
          const idSet = new Set(ids);
          const ordered = ids
            .map((id) => s.findings.find((f) => f.id === id))
            .filter((f): f is Finding => f !== undefined);
          const extras = s.findings.filter((f) => !idSet.has(f.id));
          return { findings: [...ordered, ...extras] };
        }),

      clear: () => set({ findings: [] }),
    }),
    { name: "polaris-session-findings" }
  )
);

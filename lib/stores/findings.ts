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
}

interface FindingsState {
  findings: Finding[];
  addFinding: (f: Finding) => void;
  removeFinding: (id: string) => void;
  clear: () => void;
}

export const useFindingsStore = create<FindingsState>()(
  persist(
    (set) => ({
      findings: [],
      addFinding: (f) =>
        set((s) => ({ findings: [...s.findings, f] })),
      removeFinding: (id) =>
        set((s) => ({ findings: s.findings.filter((f) => f.id !== id) })),
      clear: () => set({ findings: [] }),
    }),
    { name: "polaris-session-findings" }
  )
);

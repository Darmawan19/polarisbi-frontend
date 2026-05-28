"use client";

import { useState, useCallback, useRef } from "react";
import { useFindingsStore } from "@/lib/stores/findings";

export type AskStage =
  | "idle"
  | "generating_sql"
  | "executing_sql"
  | "generating_insight"
  | "done"
  | "error";

export interface AskState {
  stage: AskStage;
  question: string;
  sql: string | null;
  interpretation: string | null;
  rows: Record<string, unknown>[];
  columns: string[];
  insight: string;
  error: string | null;
  findingId: string | undefined;
}

const INITIAL: AskState = {
  stage: "idle",
  question: "",
  sql: null,
  interpretation: null,
  rows: [],
  columns: [],
  insight: "",
  error: null,
  findingId: undefined,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function useAskStream() {
  const [state, setState] = useState<AskState>(INITIAL);
  const abortRef = useRef<AbortController | null>(null);

  const ask = useCallback(async (question: string, language = "id") => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ ...INITIAL, stage: "generating_sql", question });

    // Local vars mirror the SSE payloads so we can assemble a Finding on done
    // without relying on React state (which is async and stale in closures).
    let localSql: string | null = null;
    let localColumns: string[] = [];
    let localRowCount = 0;
    let localInsight = "";

    try {
      const res = await fetch(`${API_URL}/api/ask/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, language }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // SSE parser state
      let currentEvent = "";
      let currentData = "";

      const dispatchEvent = (eventName: string, data: string) => {
        try {
          const payload = JSON.parse(data);
          switch (eventName) {
            case "status":
              setState((s) => ({ ...s, stage: payload.stage as AskStage }));
              break;
            case "sql":
              localSql = payload.sql;
              setState((s) => ({
                ...s,
                stage: "executing_sql",
                sql: payload.sql,
                interpretation: payload.interpretation ?? null,
              }));
              break;
            case "rows":
              localColumns = payload.columns;
              localRowCount = payload.rows.length;
              setState((s) => ({
                ...s,
                stage: "generating_insight",
                rows: payload.rows,
                columns: payload.columns,
              }));
              break;
            case "insight_token":
              localInsight += payload.token;
              setState((s) => ({ ...s, insight: s.insight + payload.token }));
              break;
            case "done": {
              const usedId = useFindingsStore.getState().addFinding({
                id: crypto.randomUUID(),
                question,
                sql: localSql,
                columns: localColumns,
                rowCount: localRowCount,
                insight: localInsight,
                timestamp: Date.now(),
              });
              setState((s) => ({ ...s, stage: "done", findingId: usedId }));
              console.log("[findings] captured:", question, "— store now has", useFindingsStore.getState().findings.length);
              break;
            }
            case "error":
              setState((s) => ({
                ...s,
                stage: "error",
                error: payload.message,
              }));
              break;
          }
        } catch {
          // malformed JSON — ignore
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event:")) {
            currentEvent = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            currentData = line.slice(5).trim();
          } else if (line.trim() === "" && currentEvent && currentData) {
            dispatchEvent(currentEvent, currentData);
            currentEvent = "";
            currentData = "";
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState((s) => ({
        ...s,
        stage: "error",
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(INITIAL);
  }, []);

  return { state, ask, reset };
}

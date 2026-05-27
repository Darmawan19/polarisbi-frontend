"use client";

import { ChatInput } from "./chat-input";

const SUGGESTED_QUESTIONS = [
  "Show total industry premium 2024 by quarter",
  "Compare BRI Life vs Allianz APE by channel",
  "Top 5 companies by RBC in 2024 Q4",
];

interface EmptyStateProps {
  onSubmit: (value: string) => void;
}

export function EmptyState({ onSubmit }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            What do you want to know?
          </h1>
          <p className="text-[14px] text-muted-foreground">
            Ask anything about Indonesian insurance industry data
          </p>
        </div>

        <ChatInput onSubmit={onSubmit} autoFocus />

        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onSubmit(q)}
              className="px-3 py-1.5 rounded-full border border-border text-[12px] text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

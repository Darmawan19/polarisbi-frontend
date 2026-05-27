"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function ChatInput({
  onSubmit,
  placeholder = "Ask anything about insurance data...",
  className,
  autoFocus = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border border-border bg-card/40 backdrop-blur-sm",
        "focus-within:border-primary/40 focus-within:bg-card/60 transition-colors",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent px-4 py-3 pr-12",
          "text-[14px] text-foreground placeholder:text-muted-foreground/60",
          "focus:outline-none"
        )}
        style={{ maxHeight: "200px" }}
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className={cn(
          "absolute bottom-2 right-2 h-7 w-7 rounded-md flex items-center justify-center transition-colors",
          value.trim()
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted/40 text-muted-foreground cursor-not-allowed"
        )}
        aria-label="Submit"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <div className="px-4 pb-2 text-[11px] text-muted-foreground/60">
        ⌘+Enter to submit
      </div>
    </div>
  );
}

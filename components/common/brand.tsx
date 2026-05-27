import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-5 w-5 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      </div>
      <span className="text-sm font-semibold tracking-tight text-foreground">
        PolarisBI
      </span>
    </div>
  );
}

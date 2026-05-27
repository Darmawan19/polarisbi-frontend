import { LanguageSwitcher } from "@/components/common/language-switcher";

export function Header({ title }: { title?: string }) {
  return (
    <header className="h-12 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="text-[13px] font-medium text-muted-foreground">
        {title || ""}
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
      </div>
    </header>
  );
}

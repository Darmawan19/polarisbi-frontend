"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/cockpit/sidebar";
import { Header } from "@/components/cockpit/header";
import { useI18n } from "@/lib/i18n/context";

export const APP_SIDEBAR_ID = "app-sidebar";

/**
 * Kerangka klien: header selalu tampil, sidebar berupa panel overlay yang dibuka
 * dari tombol hamburger. Sheet (Base UI Dialog) sudah mengurus Esc, klik di luar,
 * jebakan fokus, dan mengembalikan fokus ke tombol saat panel ditutup.
 * State sengaja tidak disimpan: tiap halaman dimuat dalam keadaan tertutup.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Header
          menuButton={
            <SheetTrigger
              aria-label={t("menuOpen")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </SheetTrigger>
          }
        />
        <main id="main-content" tabIndex={-1} className="flex-1 min-h-0 overflow-auto relative focus:outline-none">
          {children}
        </main>
      </div>

      <SheetContent
        side="left"
        id={APP_SIDEBAR_ID}
        showCloseButton={false}
        className="gap-0 p-0 bg-sidebar data-[side=left]:w-[240px] data-[side=left]:max-w-[85vw] data-[side=left]:border-r-0"
      >
        <SheetTitle className="sr-only">{t("navMainLabel")}</SheetTitle>
        <Sidebar className="h-full w-full" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

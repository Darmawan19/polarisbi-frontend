"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useI18n } from "@/lib/i18n/context";

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-black/10"
      style={{ width: size, height: size }}
    >
      <Image src="/logo.png" alt="PolarisBI" width={size} height={size} className="h-full w-full object-cover" priority />
    </div>
  );
}

/** Kerangka halaman masuk: panel merek di kiri (biru Nusantara di mode terang), formulir di kanan. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useI18n();
  const points = [t("loginPoint1"), t("loginPoint2"), t("loginPoint3")];

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-background">
      {/* Panel merek */}
      <aside className="on-header bg-header relative hidden lg:flex flex-col justify-between overflow-hidden p-12 dark:border-r dark:border-border">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-radial-glow pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <LogoMark />
          <div>
            <div className="text-[16px] font-semibold tracking-tight text-foreground">PolarisBI</div>
            <div className="text-[11px] text-muted-foreground dark:text-foreground/70">{t("workspaceTagline")}</div>
          </div>
        </div>

        <div className="relative max-w-md space-y-7">
          <h1 className="text-[34px] leading-[1.15] font-semibold tracking-tight text-foreground">
            {t("loginHeroTitle")}
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground dark:text-foreground/70">{t("loginHeroSubtitle")}</p>
          <ul className="space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[14px] text-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 dark:bg-primary/15">
                  <Check className="h-3 w-3 text-foreground dark:text-primary" />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12px] text-muted-foreground dark:text-foreground/70">© PT Asuransi BRI Life</p>
      </aside>

      {/* Panel formulir */}
      <main className="relative flex flex-col">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2.5 lg:invisible">
            <LogoMark size={30} />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">PolarisBI</span>
          </div>
          {/* on-header: kontrol ini dirancang untuk latar biru header; dibungkus agar tetap terbaca di panel terang */}
          <div className="on-header bg-header flex items-center gap-2 rounded-lg px-2 py-1.5">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-16">
          <div className="w-full max-w-[380px]">
            <h2 className="text-[26px] font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-1.5 text-[13px] text-muted-foreground dark:text-foreground/70">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer ? <div className="mt-6 text-[12px] text-muted-foreground dark:text-foreground/70">{footer}</div> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

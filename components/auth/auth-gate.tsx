"use client";

import Image from "next/image";
import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { useAuth } from "@/lib/auth/auth-context";
import { useI18n } from "@/lib/i18n/context";

function FullScreenLoader() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background" role="status" aria-live="polite">
      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center overflow-hidden ring-1 ring-black/10 animate-pulse">
        <Image src="/logo.png" alt="" width={40} height={40} className="h-full w-full object-cover" priority />
      </div>
      <span className="text-[12px] text-muted-foreground dark:text-foreground/70">{t("authLoading")}</span>
    </div>
  );
}

/**
 * Penjaga rute sisi klien. Ini hanya soal TAMPILAN (mengarahkan ke /login);
 * keamanan sebenarnya ditegakkan oleh backend pada setiap permintaan data.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { status, user, sessionExpired, logout } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const onLoginPage = pathname === "/login";

  useEffect(() => {
    if (status !== "unauthenticated" || onLoginPage) return;
    const q = new URLSearchParams();
    if (pathname && pathname !== "/") q.set("next", pathname);
    if (sessionExpired) q.set("reason", "expired");
    const qs = q.toString();
    router.replace(qs ? `/login?${qs}` : "/login");
  }, [status, onLoginPage, pathname, sessionExpired, router]);

  if (status === "loading") return <FullScreenLoader />;
  if (status === "unauthenticated" && !onLoginPage) return <FullScreenLoader />;

  // Akun dengan password sementara: wajib ganti sebelum memakai aplikasi
  if (status === "authenticated" && user?.must_change_password) {
    return (
      <AuthShell
        title={t("changePwForcedTitle")}
        subtitle={t("changePwForcedSubtitle")}
        footer={
          <button type="button" onClick={() => logout()} className="text-primary hover:underline underline-offset-2">
            {t("logout")}
          </button>
        }
      >
        <ChangePasswordForm />
      </AuthShell>
    );
  }

  return <>{children}</>;
}

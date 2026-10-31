"use client";

import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Info, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth/auth-context";
import { useI18n } from "@/lib/i18n/context";

/** Hanya terima jalur internal ("/xyz"); tolak "//evil.com" dan sejenisnya (open redirect). */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\") || raw.startsWith("/login")) return "/";
  return raw;
}

function LoginForm() {
  const { t } = useI18n();
  const { login, status, user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const reason = params.get("reason");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Sudah punya sesi -> langsung ke tujuan
  useEffect(() => {
    if (status === "authenticated" && user && !user.must_change_password) router.replace(next);
  }, [status, user, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!username.trim() || !password) {
      setError(t("loginRequired"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await login(username.trim(), password);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "account_locked") {
          const secs = Number(err.extra.retry_after_seconds ?? 900);
          setError(t("loginErrLocked", { minutes: Math.max(1, Math.ceil(secs / 60)) }));
        } else if (err.code === "invalid_credentials") {
          setError(t("loginErrInvalid"));
        } else {
          setError(t("loginErrGeneric"));
        }
      } else {
        setError(t("loginErrNetwork"));
      }
      setPassword("");
      passwordRef.current?.focus();
    } finally {
      setBusy(false);
    }
  }

  const notice = reason === "expired" ? t("loginSessionExpired") : reason === "logout" ? t("loginLoggedOut") : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {notice ? (
        <div role="status" className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-[12.5px] text-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{notice}</span>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="username" className="text-[12px]">{t("loginUsername")}</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={error ? true : undefined}
          className="h-10 text-[14px] bg-card dark:bg-input/30"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[12px]">{t("loginPassword")}</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            ref={passwordRef}
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
            className="h-10 pr-10 text-[14px] bg-card dark:bg-input/30"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? t("loginHidePassword") : t("loginShowPassword")}
            title={show ? t("loginHidePassword") : t("loginShowPassword")}
            className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error ? (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-signal-down/25 bg-signal-down/10 px-3 py-2.5 text-[12.5px] text-signal-down-fg">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <Button type="submit" disabled={busy} className="h-10 w-full text-[14px]">
        {busy ? (<><Loader2 className="h-4 w-4 animate-spin" />{t("loginSubmitting")}</>) : t("loginSubmit")}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  const { t } = useI18n();
  return (
    <AuthShell title={t("loginTitle")} subtitle={t("loginSubtitle")} footer={t("loginForgot")}>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

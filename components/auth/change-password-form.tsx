"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch, readApiError, type ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth/auth-context";
import { useI18n } from "@/lib/i18n/context";
import { dictionary, type DictKey } from "@/lib/i18n/dictionary";

/** Cermin aturan backend (minimal 10 karakter, ada huruf dan angka) supaya pengguna tahu langsung. */
function localProblem(pw: string): DictKey | null {
  if (pw.length < 10) return "pwReason_too_short";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "pwReason_needs_letter_and_digit";
  return null;
}

export function ChangePasswordForm({ className }: { className?: string }) {
  const { t } = useI18n();
  const { refresh } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function messageFor(err: ApiError): string {
    if (err.code === "wrong_current_password") return t("changePwWrongCurrent");
    if (err.code === "not_authenticated") return t("loginSessionExpired");
    if (err.code === "weak_password") {
      const key = `pwReason_${String(err.extra.reason ?? "")}` as DictKey;
      if (key in dictionary) return t(key);
    }
    return t("loginErrGeneric");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!current || !next || !confirm) return setError(t("changePwRequired"));
    const problem = localProblem(next);
    if (problem) return setError(t(problem));
    if (next !== confirm) return setError(t("changePwMismatch"));

    setBusy(true);
    try {
      const res = await apiFetch("/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      if (!res.ok) {
        setError(messageFor(await readApiError(res)));
        return;
      }
      toast.success(t("changePwSuccess"));
      setCurrent("");
      setNext("");
      setConfirm("");
      await refresh();
    } catch {
      setError(t("loginErrNetwork"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className ?? "space-y-4"}>
      <div className="space-y-1.5">
        <Label htmlFor="cp-current" className="text-[12px]">{t("changePwCurrent")}</Label>
        <Input id="cp-current" type="password" autoComplete="current-password" value={current}
          onChange={(e) => setCurrent(e.target.value)} className="h-10 text-[14px] bg-card dark:bg-input/30" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cp-new" className="text-[12px]">{t("changePwNew")}</Label>
        <Input id="cp-new" type="password" autoComplete="new-password" value={next}
          onChange={(e) => setNext(e.target.value)} className="h-10 text-[14px] bg-card dark:bg-input/30" />
        <p className="text-[11px] text-muted-foreground dark:text-foreground/70">{t("changePwHint")}</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cp-confirm" className="text-[12px]">{t("changePwConfirm")}</Label>
        <Input id="cp-confirm" type="password" autoComplete="new-password" value={confirm}
          onChange={(e) => setConfirm(e.target.value)} className="h-10 text-[14px] bg-card dark:bg-input/30" />
      </div>

      {error ? (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-signal-down/25 bg-signal-down/10 px-3 py-2.5 text-[12.5px] text-signal-down-fg">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <Button type="submit" disabled={busy} className="h-10 w-full text-[14px]">
        {busy ? (<><Loader2 className="h-4 w-4 animate-spin" />{t("changePwSaving")}</>) : t("changePwSubmit")}
      </Button>
    </form>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, readApiError, AUTH_UNAUTHORIZED_EVENT } from "@/lib/api";
import { useFindingsStore } from "@/lib/stores/findings";
import type { DictKey } from "@/lib/i18n/dictionary";

export type Role = "admin" | "analyst" | "viewer";

export interface AuthUser {
  id: number;
  username: string;
  display_name: string;
  role: Role;
  must_change_password: boolean;
}

type Status = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: Status;
  user: AuthUser | null;
  /** true bila sesi berakhir saat pengguna sedang memakai aplikasi */
  sessionExpired: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const ROLE_LABEL_KEY: Record<Role, DictKey> = {
  admin: "roleAdmin",
  analyst: "roleAnalyst",
  viewer: "roleViewer",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user as AuthUser);
        setStatus("authenticated");
        return;
      }
    } catch {
      // backend tidak terjangkau -> perlakukan sebagai belum login
    }
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Endpoint data menjawab 401 -> sesi habis / dicabut oleh admin
  useEffect(() => {
    const onUnauthorized = () => {
      setSessionExpired(true);
      setUser(null);
      setStatus("unauthenticated");
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw await readApiError(res);
    const data = await res.json();
    setUser(data.user as AuthUser);
    setSessionExpired(false);
    setStatus("authenticated");
    return data.user as AuthUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // tetap lanjut: yang penting sisi browser dibersihkan
    }
    // Hasil analisis tersimpan di localStorage; kosongkan agar tidak terbaca pengguna berikutnya
    useFindingsStore.getState().clear();
    setUser(null);
    setStatus("unauthenticated");
    // Muat ulang penuh = semua state di memori ikut bersih
    window.location.assign("/login?reason=logout");
  }, []);

  const value = useMemo(
    () => ({ status, user, sessionExpired, login, logout, refresh }),
    [status, user, sessionExpired, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/**
 * Pintu tunggal untuk semua pemanggilan ke backend PolarisBI.
 *
 * - `credentials: "include"` : cookie sesi (httpOnly) ikut terkirim.
 * - `X-Requested-With`       : penanda keamanan (CSRF) yang diminta backend untuk permintaan POST/PATCH.
 * - 401 dari endpoint data   : sesi habis / dicabut -> beri tahu AuthProvider agar kembali ke halaman login.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const AUTH_UNAUTHORIZED_EVENT = "polarisbi:unauthorized";

export class ApiError extends Error {
  status: number;
  code: string;
  extra: Record<string, unknown>;

  constructor(status: number, code: string, message: string, extra: Record<string, unknown> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("X-Requested-With", "polarisbi");
  const res = await fetch(`${API_URL}${path}`, { ...init, headers, credentials: "include" });
  if (res.status === 401 && !path.startsWith("/auth/") && typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
  }
  return res;
}

/** Ubah respons error backend ({detail: {code, message, ...}}) menjadi ApiError. */
export async function readApiError(res: Response): Promise<ApiError> {
  let code = "http_error";
  let message = `HTTP ${res.status}`;
  let extra: Record<string, unknown> = {};
  try {
    const body = await res.json();
    const d = body?.detail;
    if (d && typeof d === "object") {
      const { code: c, message: m, ...rest } = d as Record<string, unknown>;
      if (typeof c === "string") code = c;
      if (typeof m === "string") message = m;
      extra = rest;
    } else if (typeof d === "string") {
      message = d;
    }
  } catch {
    // badan bukan JSON — pakai nilai bawaan
  }
  return new ApiError(res.status, code, message, extra);
}

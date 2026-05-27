# PolarisBI — Demo Day Quick Start

## Pre-Demo Checklist (30 menit sebelum interview)

### 1. Start Backend
Open PowerShell terminal 1:
```powershell
cd C:\Users\User\polarisbi
.venv\Scripts\activate
$env:PYTHONIOENCODING="utf-8"
.venv\Scripts\uvicorn.exe api.main:app --host 0.0.0.0 --port 8000
```
Verify: buka browser → http://localhost:8000/api/health → harus tampil `"status":"ok","duckdb_exists":true`

### 2. Start Frontend Production
Open PowerShell terminal 2:
```powershell
cd C:\Users\User\polarisbi-frontend
pnpm start
```
Verify: terminal output `✓ Ready` → buka http://localhost:3000

### 3. Open Browser (Incognito)
URL: **http://localhost:3000**
- Incognito supaya tidak ada extension interference
- Hard refresh: Ctrl+Shift+R kalau ada cache

### 4. Pre-warm Anthropic API
Press **Ctrl+K**, klik suggested question, tunggu stream complete.
Ini penting — first call cold start bisa 2-3 detik, subsequent calls lebih cepat.

### 5. Visual Checklist
- [ ] Logo PolarisBI hexagonal muncul di sidebar kiri atas
- [ ] "N" indicator development hilang (tidak ada mode badge)
- [ ] 3 Hero Cards: Industry Premium / BRI Life Capital / Net Profit
- [ ] 6 KPI sparkline cards dengan trend charts
- [ ] Companies table sorted by rank
- [ ] Console DevTools clean (F12 → Console — zero errors)

---

## Demo Flow (8 menit)

### 1. Industry Overview (1 menit)
Point ke 3 Hero Cards di top:
- **Rp 109.0 T** — total premi bruto industri FY 2024
- **434.6%** — BRI Life RBC, 3.6× di atas minimum OJK 120%
- **Rp 760.4 M** — laba bersih BRI Life, +42.1% YoY

Script: *"Data real dari OJK dan AAJI, processed via DuckDB embedded analytics."*

### 2. KPI Sparklines (1 menit)
Scroll ke section Overview — 6 KPI cards dengan quarterly sparklines.
- Hover card untuk lihat trend detail
- Point ke warna: hijau = positif, merah = negatif, biru = neutral/RBC

### 3. Companies Ranking Table (1 menit)
- Klik header **"Growth YoY"** → sort ascending/descending
- Hover header **"RBC"** → tooltip definisi muncul: *"Risk-Based Capital. OJK minimum 120%..."*
- Hover header **"Channel"** → tooltip distribusi muncul
- Highlight BRI Life row (warna berbeda + dot indicator)

### 4. AI Query — STAR FEATURE (3 menit)
Press **Ctrl+K** atau klik "Ask anything..." di header.

**Query 1 (bahasa Indonesia):**
> "Tunjukkan tren premi BRI Life per kuartal 2024"

Watch live:
1. Status → "Translating..." (SQL generation)
2. SQL tab terbentuk otomatis
3. Results tab — data rows
4. Insight tab — streaming narasi bisnis dalam Bahasa Indonesia

**Query 2 (optional, kalau ada waktu):**
> "Top 5 perusahaan dengan RBC tertinggi 2024"

### 5. Bilingual Switch (30 detik)
- Klik **ID** di header kanan atas
- Semua label sidebar, section titles, table headers → Bahasa Indonesia
- Klik **EN** → switch kembali
- Refresh halaman → pilihan persist (localStorage)

### 6. Tech Stack Closing (1 menit)
*"Stack: Next.js 16 + Tailwind v4 + FastAPI + DuckDB + Anthropic Claude Sonnet 4.6. Semua running lokal, latency < 2 detik untuk query analytics."*

Point ke GitHub repos kalau ada slide closing.

---

## Troubleshooting

| Problem | Solusi |
|---|---|
| Ctrl+K tidak respond | Check terminal 1 — backend harus running di port 8000 |
| Insight tidak streaming | Check `.env` backend punya `ANTHROPIC_API_KEY` valid |
| Visual broken/kosong | Hard refresh Ctrl+Shift+R atau buka tab incognito baru |
| Sparklines tidak muncul | Backend harus running — sparklines fetch dari `/api/sparkline/*` |
| "N" indicator muncul | Pastikan pakai `pnpm start` bukan `pnpm dev` |
| Build error | `pnpm build` ulang dari `C:\Users\User\polarisbi-frontend` |

---

## Quick Commands Reference

```powershell
# Backend
cd C:\Users\User\polarisbi
.venv\Scripts\uvicorn.exe api.main:app --host 0.0.0.0 --port 8000

# Frontend production
cd C:\Users\User\polarisbi-frontend
pnpm start

# Frontend rebuild kalau perlu
pnpm build && pnpm start

# Health check
Invoke-WebRequest http://localhost:8000/api/health -UseBasicParsing | Select-Object -ExpandProperty Content
```

---

## Backup Plan

Kalau demo live gagal total — tunjukkan GitHub repos:

- **Frontend:** https://github.com/Darmawan19/polarisbi-frontend
- **Backend:** https://github.com/Darmawan19/polarisbi

Screenshot backup (kalau sempat buat sebelum demo):
- Dashboard full view
- AI query result panel terbuka dengan Insight tab
- Table sorted + tooltip RBC hovering

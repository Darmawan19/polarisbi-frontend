"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Database,
  AlertTriangle,
  Check,
  User,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { RelatedPages } from "@/components/cockpit/related-pages";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n/dictionary";

export default function SettingsPage() {
  const { lang, setLang } = useI18n();
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [maxTokens, setMaxTokens] = useState(2048);
  const [temperature, setTemperature] = useState(0.3);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifQuery, setNotifQuery] = useState(true);
  const [notifError, setNotifError] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Pengaturan" : "Settings"}
        description={
          lang === "id"
            ? "Konfigurasi tampilan, AI model, sumber data, dan preferensi notifikasi."
            : "Configure appearance, AI model, data sources, and notification preferences."
        }
        icon={<SettingsIcon className="h-5 w-5" />}
        breadcrumb={[{ label: lang === "id" ? "Pengaturan" : "Settings" }]}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Appearance */}
          <Section
            title={lang === "id" ? "Tampilan" : "Appearance"}
            description={lang === "id" ? "Tema warna dan bahasa antarmuka." : "Color theme and interface language."}
          >
            <SettingRow label={lang === "id" ? "Tema" : "Theme"}>
              <div className="inline-flex items-center rounded-md border border-border/60 p-0.5 text-[12px]">
                {[
                  { id: "dark", icon: Moon, label: lang === "id" ? "Gelap" : "Dark" },
                  { id: "light", icon: Sun, label: lang === "id" ? "Terang" : "Light" },
                  { id: "system", icon: Monitor, label: "System" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as "dark" | "light" | "system")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-medium transition-colors",
                      theme === t.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <t.icon className="h-3 w-3" />
                    {t.label}
                  </button>
                ))}
              </div>
            </SettingRow>

            <SettingRow label={lang === "id" ? "Bahasa" : "Language"}>
              <div className="inline-flex items-center rounded-md border border-border/60 p-0.5 text-[12px]">
                {[
                  { id: "en" as Language, label: "English" },
                  { id: "id" as Language, label: "Bahasa Indonesia" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={cn(
                      "px-3 py-1 rounded-[3px] font-medium transition-colors",
                      lang === l.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </Section>

          {/* API & Models */}
          <Section
            title={lang === "id" ? "API & Model AI" : "API & AI Models"}
            description={
              lang === "id"
                ? "Konfigurasi Claude API untuk query natural language."
                : "Claude API configuration for natural language queries."
            }
          >
            <SettingRow label="Model">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="px-3 py-1.5 text-[12px] rounded-md border border-border/60 bg-card/30 focus:outline-none focus:border-primary/40 font-mono"
              >
                <option value="claude-sonnet-4-6">claude-sonnet-4-6</option>
                <option value="claude-opus-4-7">claude-opus-4-7</option>
                <option value="claude-haiku-4-5">claude-haiku-4-5</option>
              </select>
            </SettingRow>

            <SettingRow label="Max tokens">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={512}
                  max={4096}
                  step={256}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className="w-40 accent-primary"
                />
                <span className="text-[12px] font-numeric text-foreground w-12 text-right">
                  {maxTokens}
                </span>
              </div>
            </SettingRow>

            <SettingRow label="Temperature">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-40 accent-primary"
                />
                <span className="text-[12px] font-numeric text-foreground w-12 text-right">
                  {temperature.toFixed(1)}
                </span>
              </div>
            </SettingRow>

            <SettingRow label={lang === "id" ? "Status API" : "API Status"}>
              <div className="flex items-center gap-1.5 text-[12px] text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                <span>{lang === "id" ? "Tersambung" : "Connected"}</span>
              </div>
            </SettingRow>
          </Section>

          {/* Data Sources */}
          <Section
            title={lang === "id" ? "Sumber Data" : "Data Sources"}
            description={
              lang === "id"
                ? "Sumber data yang terhubung ke pipeline analytics."
                : "Connected data sources in the analytics pipeline."
            }
          >
            <div className="space-y-2">
              {[
                { name: "DuckDB Engine", desc: "Local analytical database", meta: "polaris.duckdb · 1.76 MB" },
                { name: "OJK Statistics", desc: "Quarterly + annual reports", meta: "60 documents indexed" },
                { name: "AAJI Press Releases", desc: "Industry press + bulletins", meta: "12 documents indexed" },
                { name: "BRI Life Internal", desc: "Company-specific reports", meta: "8 documents indexed" },
              ].map((src) => (
                <div
                  key={src.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border/40 bg-card/30"
                >
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-[12px] font-medium text-foreground">{src.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {src.desc} · {src.meta}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Notifications */}
          <Section
            title={lang === "id" ? "Notifikasi" : "Notifications"}
            description={
              lang === "id"
                ? "Atur kapan Anda ingin diberi tahu."
                : "Configure when you want to be notified."
            }
          >
            <Toggle
              label={lang === "id" ? "Email digest harian" : "Daily email digest"}
              description={
                lang === "id"
                  ? "Ringkasan KPI dan query terkini setiap pagi."
                  : "Daily KPI and query summary every morning."
              }
              checked={notifEmail}
              onChange={setNotifEmail}
            />
            <Toggle
              label={lang === "id" ? "Query selesai" : "Query completion"}
              description={
                lang === "id"
                  ? "Notif saat query AI selesai diproses."
                  : "Notify when AI query completes processing."
              }
              checked={notifQuery}
              onChange={setNotifQuery}
            />
            <Toggle
              label={lang === "id" ? "Error alerts" : "Error alerts"}
              description={
                lang === "id"
                  ? "Notif saat pipeline data atau API gagal."
                  : "Notify when data pipeline or API fails."
              }
              checked={notifError}
              onChange={setNotifError}
            />
          </Section>

          {/* Danger Zone */}
          <Section
            title="Danger Zone"
            description={
              lang === "id"
                ? "Aksi destruktif yang tidak bisa dibatalkan."
                : "Destructive actions that cannot be undone."
            }
            danger
          >
            <div className="space-y-3">
              <button
                onClick={() =>
                  alert(
                    lang === "id"
                      ? "Coming soon: reset preferensi"
                      : "Coming soon: reset preferences"
                  )
                }
                className="w-full text-left px-3 py-2.5 rounded-md border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-foreground">
                      {lang === "id" ? "Reset semua preferensi" : "Reset all preferences"}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {lang === "id" ? "Kembalikan ke pengaturan default." : "Restore to default settings."}
                    </div>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                </div>
              </button>

              <button
                onClick={() =>
                  alert(
                    lang === "id"
                      ? "Coming soon: keluar dari workspace"
                      : "Coming soon: sign out of workspace"
                  )
                }
                className="w-full text-left px-3 py-2.5 rounded-md border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-foreground">
                      {lang === "id" ? "Keluar dari workspace" : "Sign out"}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {lang === "id" ? "Tutup sesi PolarisBI." : "End your PolarisBI session."}
                    </div>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                </div>
              </button>
            </div>
          </Section>

          <hr className="my-8 border-border/40" />
          <RelatedPages
            links={[
              { label: "Profile", href: "/profile", icon: User, description: "View user info and activity" },
              { label: "Data Schema", href: "/data-schema", icon: Database, description: "Browse data sources" },
              { label: "Industry Pulse", href: "/", icon: Activity, description: "Back to dashboard" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  danger = false,
  children,
}: {
  title: string;
  description: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/40 pb-3">
        <h2
          className={cn(
            "text-[14px] font-semibold",
            danger ? "text-rose-400" : "text-foreground"
          )}
        >
          {title}
        </h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] text-foreground">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex-1 pr-4">
        <div className="text-[12px] font-medium text-foreground">{label}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 rounded-full bg-background shadow-sm transform transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

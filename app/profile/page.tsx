"use client";

import {
  User,
  Mail,
  Briefcase,
  Calendar,
  Activity,
  Sparkles,
  Database,
  BookOpen,
  FileText,
  Settings as SettingsIcon,
  History,
} from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { RelatedPages } from "@/components/cockpit/related-pages";
import { useI18n } from "@/lib/i18n/context";
import type { LucideIcon } from "lucide-react";

const ACTIVITY_LOG: { id: number; action: string; target: string; time: string; icon: LucideIcon }[] = [
  { id: 1, action: "Ran AI query", target: "Tren rasio klaim industri 2024", time: "2 hours ago", icon: Sparkles },
  { id: 2, action: "Viewed dashboard", target: "Industry Pulse", time: "3 hours ago", icon: Activity },
  { id: 3, action: "Ran AI query", target: "RBC top 5 perusahaan Q4 2024", time: "5 hours ago", icon: Sparkles },
  { id: 4, action: "Opened document", target: "OJK Annual Report 2024", time: "1 day ago", icon: FileText },
  { id: 5, action: "Viewed schema", target: "industry_aggregate", time: "1 day ago", icon: Database },
  { id: 6, action: "Read KPI", target: "Risk-Based Capital (RBC)", time: "2 days ago", icon: BookOpen },
  { id: 7, action: "Ran AI query", target: "Channel distribusi dominan", time: "2 days ago", icon: Sparkles },
  { id: 8, action: "Viewed dashboard", target: "Industry Pulse", time: "3 days ago", icon: Activity },
];

export default function ProfilePage() {
  const { lang } = useI18n();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Profil" : "Profile"}
        description={
          lang === "id"
            ? "Informasi akun, statistik penggunaan, dan riwayat aktivitas."
            : "Account information, usage statistics, and activity log."
        }
        icon={<User className="h-5 w-5" />}
        breadcrumb={[{ label: lang === "id" ? "Profil" : "Profile" }]}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Profile card */}
          <div className="rounded-lg border border-border/40 bg-card/30 p-6">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#10b981] flex items-center justify-center text-[28px] font-semibold text-[#0a0a0c] shrink-0">
                D
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">Darmawan</h2>
                <p className="text-[13px] text-muted-foreground">Lidharmawan Suryaatmadja</p>
                <div className="grid grid-cols-2 gap-3 mt-4 max-w-md">
                  <InfoItem icon={Mail} label="Email" value="darmawan@polarisbi.io" />
                  <InfoItem
                    icon={Briefcase}
                    label={lang === "id" ? "Peran" : "Role"}
                    value="Insurance Analyst"
                  />
                  <InfoItem
                    icon={Calendar}
                    label={lang === "id" ? "Bergabung" : "Joined"}
                    value="May 2026"
                  />
                  <InfoItem icon={Activity} label="Workspace" value="PolarisBI" />
                </div>
              </div>
              <button
                onClick={() =>
                  alert(
                    lang === "id"
                      ? "Coming soon: edit profil"
                      : "Coming soon: edit profile"
                  )
                }
                className="px-3 py-1.5 text-[12px] rounded-md border border-border/60 text-foreground hover:bg-card/60 transition-colors"
              >
                {lang === "id" ? "Edit Profil" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Usage stats */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              {lang === "id" ? "Statistik penggunaan" : "Usage statistics"}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <StatCard
                label={lang === "id" ? "Total kueri" : "Total queries"}
                value="247"
                trend="+12 this week"
              />
              <StatCard
                label={lang === "id" ? "Tokens digunakan" : "Tokens used"}
                value="412.8K"
                trend="68% of monthly cap"
              />
              <StatCard
                label={lang === "id" ? "Dokumen dilihat" : "Documents viewed"}
                value="38"
                trend="+5 this week"
              />
              <StatCard
                label={lang === "id" ? "Hari aktif" : "Active days"}
                value="22"
                trend="of last 30 days"
              />
            </div>
          </div>

          {/* Activity log */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              {lang === "id" ? "Aktivitas terbaru" : "Recent activity"}
            </h3>
            <div className="rounded-lg border border-border/40 bg-card/30 divide-y divide-border/20">
              {ACTIVITY_LOG.map((entry) => {
                const Icon = entry.icon;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-card/50 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-foreground">
                        <span className="text-muted-foreground">{entry.action}: </span>
                        <span className="font-medium">{entry.target}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-numeric text-muted-foreground shrink-0">
                      {entry.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="my-8 border-border/40" />
          <RelatedPages
            links={[
              { label: "Settings", href: "/settings", icon: SettingsIcon, description: "Adjust preferences" },
              { label: "Query History", href: "/query-history", icon: History, description: "Review past activity" },
              { label: "Industry Pulse", href: "/", icon: Activity, description: "Back to dashboard" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-[12px] text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/30 p-4">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-semibold text-foreground font-numeric mt-1">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{trend}</div>
    </div>
  );
}

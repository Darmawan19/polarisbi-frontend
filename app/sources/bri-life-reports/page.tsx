"use client";

import { FileText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { RelatedPages } from "@/components/cockpit/related-pages";
import { SourceDocumentsList, type SourceDocument } from "@/components/cockpit/source-documents-list";
import { useI18n } from "@/lib/i18n/context";

const BRILIFE_DOCS: SourceDocument[] = [
  { id: "bri-1", title: "BRI Life Annual Report 2024", type: "pdf", category: "Annual Report", sizeMB: 18.4, publishedAt: "2025-03-30", status: "indexed" },
  { id: "bri-2", title: "BRI Life Q4 2024 Financial Highlights", type: "xlsx", category: "Financial Report", sizeMB: 3.2, publishedAt: "2025-02-14", status: "indexed" },
  { id: "bri-3", title: "BRI Life Bancassurance Strategy Deck 2024", type: "pdf", category: "Strategy", sizeMB: 8.1, publishedAt: "2024-12-10", status: "indexed" },
  { id: "bri-4", title: "BRI Life Sustainability Report 2024", type: "pdf", category: "Sustainability", sizeMB: 12.7, publishedAt: "2025-04-15", status: "indexed" },
  { id: "bri-5", title: "BRI Life Product Portfolio Overview 2024", type: "pdf", category: "Product", sizeMB: 5.4, publishedAt: "2024-11-20", status: "indexed" },
  { id: "bri-6", title: "BRI Life Internal Audit Summary Q4 2024", type: "pdf", category: "Audit", sizeMB: 2.8, publishedAt: "2025-01-25", status: "indexed" },
  { id: "bri-7", title: "BRI Life Channel Performance Dashboard Q4 2024", type: "xlsx", category: "Channel Analysis", sizeMB: 4.6, publishedAt: "2025-01-30", status: "indexed" },
  { id: "bri-8", title: "BRI Life 2025 Business Plan & Targets", type: "pdf", category: "Business Plan", sizeMB: 9.3, publishedAt: "2025-01-10", status: "processing" },
];

export default function BRILifeReportsPage() {
  const { lang } = useI18n();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Laporan BRI Life" : "BRI Life Reports"}
        description={
          lang === "id"
            ? "Laporan internal dan publikasi resmi PT Asuransi BRI Life."
            : "Internal reports and official publications from PT Asuransi BRI Life."
        }
        badge={`${BRILIFE_DOCS.length} ${lang === "id" ? "dokumen" : "documents"}`}
        icon={<FileText className="h-5 w-5" />}
        breadcrumb={[{ label: "Sources" }, { label: "BRI Life Reports" }]}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <SourceDocumentsList documents={BRILIFE_DOCS} />
          <hr className="my-8 border-border/40" />
          <RelatedPages
            links={[
              { label: "OJK Statistics", href: "/sources/ojk-statistics", icon: FileText, description: "Regulatory data source" },
              { label: "AAJI Press", href: "/sources/aaji-press", icon: FileText, description: "Industry association releases" },
              { label: "Ask AI", href: "/ask-ai", icon: Sparkles, description: "Query BRI Life data" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

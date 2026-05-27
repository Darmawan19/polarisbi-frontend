"use client";

import { FileText } from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { SourceDocumentsList, type SourceDocument } from "@/components/cockpit/source-documents-list";
import { useI18n } from "@/lib/i18n/context";

const AAJI_DOCS: SourceDocument[] = [
  { id: "aaji-1", title: "Press Release Kinerja Industri Asuransi Jiwa Q4 2024", type: "pdf", category: "Quarterly Press", sizeMB: 2.1, publishedAt: "2025-02-15", status: "indexed" },
  { id: "aaji-2", title: "AAJI Annual Report 2024 — Membangun Ketahanan Industri", type: "pdf", category: "Annual Report", sizeMB: 8.7, publishedAt: "2025-04-20", status: "indexed" },
  { id: "aaji-3", title: "Press Release Q3 2024 — Pertumbuhan Bancassurance", type: "pdf", category: "Quarterly Press", sizeMB: 1.9, publishedAt: "2024-11-12", status: "indexed" },
  { id: "aaji-4", title: "AAJI Channel Distribution Report 2024", type: "xlsx", category: "Channel Analysis", sizeMB: 3.2, publishedAt: "2024-10-30", status: "indexed" },
  { id: "aaji-5", title: "Press Release Q2 2024 — Recovery Pasca Pandemi", type: "pdf", category: "Quarterly Press", sizeMB: 2.0, publishedAt: "2024-08-14", status: "indexed" },
  { id: "aaji-6", title: "AAJI Claims Ratio Benchmark Study 2024", type: "pdf", category: "Benchmark Study", sizeMB: 4.5, publishedAt: "2024-07-22", status: "indexed" },
  { id: "aaji-7", title: "Press Release Q1 2024 — Outlook Tahun 2024", type: "pdf", category: "Quarterly Press", sizeMB: 1.8, publishedAt: "2024-05-13", status: "indexed" },
  { id: "aaji-8", title: "AAJI Product Innovation Whitepaper 2024", type: "pdf", category: "Whitepaper", sizeMB: 5.6, publishedAt: "2024-04-08", status: "indexed" },
  { id: "aaji-9", title: "Konferensi Pers AAJI — Digital Transformation 2024", type: "pdf", category: "Conference", sizeMB: 3.4, publishedAt: "2024-03-15", status: "indexed" },
  { id: "aaji-10", title: "AAJI Quarterly Statistical Bulletin Q1 2024", type: "xlsx", category: "Statistical Bulletin", sizeMB: 2.8, publishedAt: "2024-05-13", status: "indexed" },
  { id: "aaji-11", title: "Press Release — Komite Aktuaris AAJI 2024", type: "pdf", category: "Committee", sizeMB: 1.4, publishedAt: "2024-02-20", status: "archived" },
  { id: "aaji-12", title: "AAJI Industry Outlook 2025", type: "pdf", category: "Outlook Report", sizeMB: 6.2, publishedAt: "2025-01-08", status: "processing" },
];

export default function AAJIPressPage() {
  const { lang } = useI18n();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "AAJI Press" : "AAJI Press"}
        description={
          lang === "id"
            ? "Press release dan publikasi resmi Asosiasi Asuransi Jiwa Indonesia (AAJI)."
            : "Press releases and official publications from the Indonesian Life Insurance Association (AAJI)."
        }
        badge={`${AAJI_DOCS.length} ${lang === "id" ? "dokumen" : "documents"}`}
        icon={<FileText className="h-5 w-5" />}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <SourceDocumentsList documents={AAJI_DOCS} />
        </div>
      </div>
    </div>
  );
}

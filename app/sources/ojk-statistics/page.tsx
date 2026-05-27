"use client";

import { FileText, Database } from "lucide-react";
import { PageHeader } from "@/components/cockpit/page-header";
import { RelatedPages } from "@/components/cockpit/related-pages";
import { SourceDocumentsList, type SourceDocument } from "@/components/cockpit/source-documents-list";
import { useI18n } from "@/lib/i18n/context";

function generateOJKDocs(): SourceDocument[] {
  const docs: SourceDocument[] = [];
  const years = [2021, 2022, 2023, 2024];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  let counter = 1;

  // Quarterly Statistics: 4 years × 4 quarters = 16
  years.forEach((year) => {
    quarters.forEach((q) => {
      const monthMap: Record<string, string> = { Q1: "04", Q2: "07", Q3: "10", Q4: "01" };
      const pubYear = q === "Q4" ? year + 1 : year;
      docs.push({
        id: `ojk-stat-${counter++}`,
        title: `Statistik Perasuransian Indonesia ${q} ${year}`,
        type: "pdf",
        category: "Quarterly Statistics",
        sizeMB: parseFloat((3.4 + (counter % 7) * 0.3).toFixed(1)),
        publishedAt: `${pubYear}-${monthMap[q]}-15`,
        status: "indexed",
      });
    });
  });

  // Annual Reports: 5 years × 2 docs = 10
  for (let y = 2020; y <= 2024; y++) {
    docs.push({
      id: `ojk-ann-${counter++}`,
      title: `Laporan Tahunan OJK ${y}`,
      type: "pdf",
      category: "Annual Report",
      sizeMB: parseFloat((12.5 + (counter % 5)).toFixed(1)),
      publishedAt: `${y + 1}-06-30`,
      status: y === 2024 ? "processing" : "indexed",
    });
    docs.push({
      id: `ojk-ann-${counter++}`,
      title: `Lampiran Statistik Perasuransian ${y}`,
      type: "xlsx",
      category: "Annual Report",
      sizeMB: parseFloat((4.2 + (counter % 3) * 0.4).toFixed(1)),
      publishedAt: `${y + 1}-06-30`,
      status: y === 2024 ? "processing" : "indexed",
    });
  }

  // Regulations: 12 POJK documents
  const pojkTitles = [
    "POJK No. 71/POJK.05/2016 — Kesehatan Keuangan Perusahaan Asuransi",
    "POJK No. 69/POJK.05/2016 — Penyelenggaraan Usaha Perusahaan Asuransi",
    "POJK No. 14/POJK.05/2020 — Pengendalian Pelanggaran Asuransi",
    "POJK No. 13/POJK.05/2018 — Tata Kelola Asuransi",
    "POJK No. 28/POJK.05/2020 — Tata Cara Pendirian Asuransi",
    "POJK No. 67/POJK.05/2016 — Perizinan Usaha Asuransi",
    "POJK No. 17/POJK.05/2017 — Pemasaran Bancassurance",
    "POJK No. 23/POJK.05/2015 — Penilaian Tingkat Risiko",
    "POJK No. 23/POJK.05/2023 — Asuransi Mikro",
    "POJK No. 21/POJK.05/2024 — Asuransi Wajib",
    "POJK No. 11/POJK.05/2014 — Bank Custodian Asuransi",
    "POJK No. 1/POJK.05/2022 — Aktuaris Perusahaan Asuransi",
  ];
  pojkTitles.forEach((title) => {
    docs.push({
      id: `ojk-reg-${counter++}`,
      title,
      type: "pdf",
      category: "Regulation (POJK)",
      sizeMB: parseFloat((1.2 + (counter % 4) * 0.2).toFixed(1)),
      publishedAt: "2023-12-01",
      status: "indexed",
    });
  });

  // Monthly Bulletins: 22 entries
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  for (let i = 0; i < 22; i++) {
    const monthIdx = i % 12;
    const year = i < 12 ? 2024 : 2023;
    docs.push({
      id: `ojk-bul-${counter++}`,
      title: `Buletin Statistik Perasuransian — ${months[monthIdx]} ${year}`,
      type: "pdf",
      category: "Monthly Bulletin",
      sizeMB: parseFloat((0.8 + (counter % 5) * 0.12).toFixed(1)),
      publishedAt: `${year}-${String(monthIdx + 1).padStart(2, "0")}-25`,
      status: i < 3 ? "processing" : i > 18 ? "archived" : "indexed",
    });
  }

  return docs.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

const OJK_DOCS = generateOJKDocs();

export default function OJKStatisticsPage() {
  const { lang } = useI18n();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={lang === "id" ? "Statistik OJK" : "OJK Statistics"}
        description={
          lang === "id"
            ? "Dokumen statistik dan regulasi dari Otoritas Jasa Keuangan untuk industri asuransi jiwa Indonesia."
            : "Statistical documents and regulations from Indonesia's Financial Services Authority (OJK) for the life insurance industry."
        }
        badge={`${OJK_DOCS.length} ${lang === "id" ? "dokumen" : "documents"}`}
        icon={<FileText className="h-5 w-5" />}
        breadcrumb={[{ label: "Sources" }, { label: "OJK Statistics" }]}
      />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <SourceDocumentsList documents={OJK_DOCS} />
          <hr className="my-8 border-border/40" />
          <RelatedPages
            links={[
              { label: "AAJI Press", href: "/sources/aaji-press", icon: FileText, description: "Industry association releases" },
              { label: "BRI Life Reports", href: "/sources/bri-life-reports", icon: FileText, description: "Company-specific documents" },
              { label: "Data Schema", href: "/data-schema", icon: Database, description: "How sources map to tables" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
